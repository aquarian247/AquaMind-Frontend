# NEXT SESSION PROMPT – Schemathesis Authentication Failures

## 0. Context Snapshot (2025-07-16 EOD)
* `api/openapi.yaml` now has global `security: [{"tokenAuth": []}]`
* Per-operation `{}` (anonymous) removed **except** `/api/v1/auth/token/` & `/api/v1/auth/dev-auth/`
* CI user: superuser + valid Token (40 chars) injected via `Authorization: Token $TOKEN`
* Schemathesis still reports ≈ 392 `ignored_auth` & `status_code_conformance` failures
* Many 404s for legacy `/api/v1/infrastructure/*` routes that no longer exist
* Local manual cURL with token returns 200 on protected endpoints

---

## 1. Candidate Root-Cause Theories

| # | Hypothesis |
|---|------------|
| T1 | **Header Injection Failure** – The `Authorization` header isn’t reaching DRF for some requests (env var expansion, bash quoting or Schemathesis re-writes when it retries). |
| T2 | **Spec / Router Drift** – OpenAPI lists outdated paths; Schemathesis generates requests to routes that the Django dev server no longer exposes, causing 404 & ignored_auth noise. |
| T3 | **Auth Flow Mismatch** – DRF’s default `SessionAuthentication` or CSRF middleware interferes in tests, producing redirects (302→login) that Schemathesis interprets as unauth. |
| T4 | **Status-Code Expectation Bug** – Auth endpoints legitimately return 400 for bad creds, but spec only documents 200; Schemathesis flags as failure. Same pattern might propagate to other views with strict 2xx only. |
| T5 | **Framework / Tool Incompatibility** – drf-spectacular’s generated spec + DRF dev server + Schemathesis combination has known edge cases (e.g., `Format: decimal`, hyperlinked relations, Hypertable time columns) leading to mis-parsing of security schemes. |

---

## 2. Diagnostic Steps per Theory

### T1 – Header Injection Failure
1. Add temporary DRF middleware to log `request.META["HTTP_AUTHORIZATION"]` for *every* request during Schemathesis run; write to stdout so CI logs capture.
2. Run `schemathesis run --request-log yes` (or `--store-network-log`) to inspect raw outgoing headers.
3. Re-run a **single failing operation** locally:  
   `schemathesis reproduce api/openapi.yaml --dry-run "/api/v1/batch/batches/" GET`  
   and inspect headers.

### T2 – Spec / Router Drift
1. Compare `urlpatterns` vs. `paths` in `openapi.yaml` using a small diff script.
2. Temporarily run Schemathesis with `--validate-schema` only to surface unreachable paths.
3. Remove / rename obsolete tags, regenerate spec, re-run.

### T3 – Auth Flow Mismatch
1. Disable `SessionAuthentication` & `CsrfViewMiddleware` in `settings_ci.py`; keep **only** `TokenAuthentication`.
2. Re-run Schemathesis; if failures disappear, re-enable components one by one.
3. Capture `302` responses in output (`--show-errors-tracebacks`) to see if login redirects appear.

### T4 – Status Code Expectations
1. For `/api/v1/auth/token/` add `@extend_schema(responses={200: …, 400: OpenApiTypes.OBJECT})`.
2. Re-generate spec and ensure `400` appears.
3. Configure Schemathesis with `--checks all,~status_code_conformance` to verify only this check triggers failures.

### T5 – Framework / Tool Incompat
1. Create **minimal** DRF project with single protected endpoint + token auth; run Schemathesis to see if issue reproduces.  
   • If yes → upstream issue; open ticket.  
   • If no  → our project specifics, continue debugging.
2. Try running Schemathesis against **gunicorn** or **uwsgi** instead of Django dev server (runserver has auto-reload quirks).
3. Upgrade Schemathesis & drf-spectacular to latest prerelease versions; rerun tests.

---

## 3. Alternative Paths if Blocked

* Replace full fuzz-suite with **targeted contract smoke tests** using `pytest-schemathesis` and mark flaky ops `xfail`.
* Use **Postman / Newman** collection tests for critical endpoints until root cause solved.
* Generate spec → import into **py-openapi-core** & craft custom hypothesis strategies, bypassing Schemathesis CLI.
* Skip authentication endpoints in Schemathesis with `--exclude "/api/v1/auth/*"` and gate CI on remaining ops.

---

## 4. Proposed Immediate Actions for New Session

1. **Implement header-logging middleware** & reproduce one failing op (T1).  
2. **Diff current URLs vs. spec**; fix drift (T2).  
3. If neither resolves: strip `SessionAuthentication` / CSRF in CI (T3).  
4. Add `400` responses for auth endpoints; regenerate spec (T4).  
5. Timebox 2 hrs; if still red, pivot to minimal-project repro (T5).

---

### Reference Material
* Current failing CI run: https://github.com/aquarian247/AquaMind/actions (look for latest “Validate API contract with Schemathesis” job)
* Documentation of hooks: `aquamind/utils/openapi_utils.py`
* Previous troubleshooting log: `CI_TROUBLESHOOTING_LOG.md`

---

_Use this prompt to kick-start the next debugging session._  

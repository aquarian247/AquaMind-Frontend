# UAT Tasks Plan (Frontend)

Purpose: Achieve UAT readiness with clean authentication, consistent docs/config, and a simple, reliable test setup.

## Priorities
1. Authentication alignment (spec → generated client → app usage)  
2. Testing cleanup (remove MSW; use simple fetch/client mocks)  
3. Configuration & documentation consistency  
4. Remove misleading fallbacks; raise coverage gates gradually  

---

## Task 1 — Canonicalize Auth Endpoints in OpenAPI & Regenerate Client
**Summary**  
Remove legacy/duplicate auth routes; define a single canonical pair:  
* `POST /api/v1/auth/token/`  
* `POST /api/v1/auth/token/refresh/`  
Fix refresh model so request body is `{ refresh: string }` (no readonly).

**Files**  
* `api/openapi.yaml`

**Steps**  
1. Update paths to include only the two canonical endpoints.  
2. Align schemas with `djangorestframework-simplejwt`.  
3. Ensure `TokenRefresh` request model is **not** readonly.  
4. Run `npm run generate:api` and commit `client/src/api/generated`.

**Acceptance Criteria**  
* Generated client exposes auth methods under `/api/v1/auth/token/…`.  
* No “readonly on request” hacks in TS.  
* `npm run type-check` passes.

**Verification**  
* `grep -R "auth/token" client/src/api/generated` shows both endpoints.  
* `npm run build` succeeds.

---

## Task 2 — Align Frontend Auth Config to Canonical Endpoints
**Summary**  
Point all manual config to canonical auth endpoints.

**Files**  
* `client/src/config/auth.config.ts`

**Steps**  
* Set `login` → `/api/v1/auth/token/`  
* Set `refresh` → `/api/v1/auth/token/refresh/`  
* Leave `profile` as `/api/v1/users/auth/profile/` **only if** backend provides it.

**Acceptance Criteria**  
No references to `/api/v1/users/auth/token/`.

**Verification**  
`grep -R "users/auth/token" client/src` returns nothing.

---

## Task 3 — Update AuthContext to Use Generated Client Only
**Summary**  
Remove manual fetches & TS casts; rely on generated client.

**Files**  
* `client/src/contexts/AuthContext.tsx`  
* `client/src/services/auth.service.ts` (if touched)

**Steps**  
1. Replace non-existent generated methods with new ones.  
2. Delete casts used to bypass readonly refresh model.  
3. If `users/auth/profile` absent, decode JWT for minimal user info (TODO).

**Acceptance Criteria**  
* No TS casts hacking models.  
* `npm run type-check` passes.  
* Login & refresh work via generated client.

**Verification**  
Unit test mocks generated client for login + refresh paths.

---

## Task 4 — Remove MSW From Test Setup
**Summary**  
Eliminate MSW; standardise on simple fetch or client mocks.

**Files**  
* `client/src/setupTests.ts`  
* `client/src/test/msw/*` (delete)

**Steps**  
1. Delete MSW imports/event listeners in `setupTests.ts`.  
2. Remove `client/src/test/msw` directory.

**Acceptance Criteria**  
* No `msw` references.  
* `npm run test` passes.

**Verification**  
`grep -R "msw" client/src` returns nothing.

---

## Task 5 — Raise Coverage Thresholds
**Summary**  
Increase gates to encourage real testing.

**Files**  
* `vite.config.ts`

**Steps**  
Set thresholds: **lines 40, statements 40, functions 30, branches 20**.

**Acceptance Criteria**  
`npm run test:ci` passes or reveals genuine gaps.

**Verification**  
Check `client/coverage/` report.

---

## Task 6 — Remove Misleading Fallback Values
**Summary**  
Delete unrealistic hard-coded numbers; isolate dev-only fallbacks.

**Files**  
* `client/src/lib/api.ts`

**Steps**  
1. Search for `3500`, `21805000`, etc.  
2. Replace with generated client calls **or** `devFallbacks.ts` gated by `VITE_USE_DJANGO_API`.

**Acceptance Criteria**  
No unrealistic constants in production path; lint/type-check pass.

**Verification**  
`grep -R "21805000\\|3500" client/src/lib` → empty or dev-only module.

---

## Task 7 — Environment Variable Consistency Audit
**Summary**  
Remove obsolete env var names.

**Files** — *repo-wide*

**Steps**  
`grep -R "VITE_USE_BACKEND_API\\|VITE_BACKEND_API_URL" -n .` and replace with `VITE_USE_DJANGO_API` / `VITE_DJANGO_API_URL`.

**Acceptance Criteria**  
No old env names remain.

**Verification**  
Grep returns no matches.

---

## Task 8 — Documentation Verification Pass
**Summary**  
Ensure docs reflect final state (generated client, canonical auth, Vitest, no MSW).

**Files**  
* `README.md`  
* `docs/CONTRIBUTING.md`  
* `docs/frontend_testing_guide.md`  
* `docs/DJANGO_INTEGRATION_GUIDE.md`  
* `docs/code_organization_guidelines.md`

**Steps**  
Search for `MSW`, legacy env vars, `/api/token`, `/api/auth/jwt`.

**Acceptance Criteria**  
Docs are consistent; no stale references.

**Verification**  
Manual scan or grep of docs.

---

## Task 9 — Express/Server Parity Check
**Summary**  
Validate dev proxy & mock API respect `VITE_USE_DJANGO_API`.

**Files**  
* `server/index.ts`  
* `server/mock-api.ts`

**Steps**  
1. Confirm only `VITE_USE_DJANGO_API` env flag used.  
2. Ensure proxy paths align with `/api/v1/*`.

**Acceptance Criteria**  
No `VITE_USE_BACKEND_API`; correct routing.

**Verification**  
Run dev server; `curl` a couple of endpoints.

---

## Task 10 — Add Targeted Auth Tests
**Summary**  
Add minimal suite for login / refresh logic.

**Files**  
* Auth service & context files  
* New test files under `client/src/**/__tests__`

**Steps**  
1. Mock generated client responses.  
2. Cover: login success, login 401, refresh success, expired refresh → logout.

**Acceptance Criteria**  
Tests deterministic; coverage bumps for auth modules.

**Verification**  
`npm run test` passes; coverage numbers increase.

---

## Execution Notes
* Prefer **small, single-purpose PRs** (≤ 300 LOC).  
* Always run `npm run type-check && npm run lint && npm run test` before PR.  
* Regenerate client whenever the OpenAPI spec changes (`npm run generate:api`).

---

## Definition of Done (UAT Readiness)
* Auth flows use canonical endpoints via generated client; **no hacks**.  
* MSW fully removed; tests stable with simple mocks.  
* Env/config/docs consistent across repo.  
* No misleading fallbacks; coverage gates raised & green.  

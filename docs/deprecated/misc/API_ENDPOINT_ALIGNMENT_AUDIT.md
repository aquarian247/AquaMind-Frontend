# API Endpoint Alignment Audit  
_AquaMind Frontend ↔ Backend_  
Date: **August&nbsp;13, 2025**

---

## 1. Executive Summary
The purpose of this audit is to eliminate all `404 NOT FOUND` errors caused by the AquaMind frontend calling non-existent or legacy endpoints. We compared every API path referenced in the frontend with the canonical backend OpenAPI 3.1 specification and documented all discrepancies. This report summarises the mismatches, proposes remediation steps, and defines guard-rails to keep the contracts aligned in future development.

---

## 2. Methodology
1. **Ground-truth extraction**  
   Parsed `aquarian247/AquaMind/api/openapi.yaml` and generated a list of all `/api/v1/**` paths (trailing slashes preserved).

2. **Frontend inventory**  
   • Scanned `aquarian247/AquaMind-Frontend` for:
   - Literal strings beginning `/api` or containing key domain nouns.  
   - Usages of `DJANGO_ENDPOINTS`, `getApiUrl()`, `fetch(`, `ApiService.*`.

3. **Matrix build**  
   Correlated each frontend path to the OpenAPI list and classified as `OK`, `Mismatch`, `Legacy`, or `Missing`.

4. **Mock & Proxy review**  
   Checked `server/mock-api.ts` and Vite proxy rules to ensure dev mode parity.

5. **CI guard-rail design**  
   Drafted a diff script (`scripts/validate_endpoints.ts`) that fails the pipeline if an unknown path appears in the codebase.

---

## 3. Findings

### 3.1 Inventory Module Mismatches
| Frontend Path (invalid) | Correct Path (OpenAPI) | Notes |
|-------------------------|------------------------|-------|
| `/api/v1/inventory/feed-types/` | `/api/v1/inventory/feeds/` | Entity renamed in unified spec. |
| `/api/v1/inventory/feed-purchases/` ✅ |  – | Path exists – no action. |
| `/api/v1/inventory/feed-stock/` | `/api/v1/inventory/feed-stocks/` | Missing trailing “s”. |
| `/api/v1/inventory/feed-containers/` | `/api/v1/infrastructure/feed-containers/` | Moved under Infrastructure namespace. |
| `/api/v1/inventory/batch-feeding-summaries/` ✅ | – | Exists, but `/generate/` & `/by_batch/` also needed in UI. |

### 3.2 Infrastructure Module Issues
The frontend requests several helper “overview/summary” endpoints that are **not** present in the backend:

* `/api/v1/infrastructure/containers/overview`
* `/api/v1/infrastructure/sensors/overview`
* `/api/v1/infrastructure/summary/`
* `/api/v1/infrastructure/alerts/`

### 3.3 Broodstock Module Legacy Endpoints
Legacy dashboard and genetic routes remain in the UI:

* `/api/v1/broodstock/dashboard/kpis/`
* `/api/v1/broodstock/tasks/`
* `/api/v1/broodstock/genetic/traits/`
* `/api/v1/broodstock/programs/`
* `/api/v1/broodstock/containers/`
* `/api/v1/broodstock/activities/`

None are defined in the current OpenAPI document.

### 3.4 Scenario Planning Module Path Issues
Paths still use the old `scenario-planning` prefix instead of `scenario`:

* `/api/v1/scenario-planning/scenarios/` → `/api/v1/scenario/scenarios/`
* `/api/v1/scenario-planning/tgc-models/` → `/api/v1/scenario/tgc-models/`
* `/api/v1/scenario-planning/fcr-models/` → `/api/v1/scenario/fcr-models/`
* `/api/v1/scenario-planning/mortality-models/` → `/api/v1/scenario/mortality-models/`
* Misc dashboard KPI routes are deprecated.

### 3.5 Health Module Endpoint Issues
Misaligned or missing:

| Frontend Path | Status | Correct Path |
|---------------|--------|--------------|
| `/api/v1/health/records/` | ❌ | Multiple granular resources now exist (`journal-entries/`, `health-observations/` etc.). Adapt UI. |
| `/api/v1/health/assessments/` | ❌ | Superseded by `health-sampling-events/`. |
| `/api/v1/health/lab-samples/` | ✅ Exists |
| `/api/v1/health/alerts/` | ❌ No longer available |

---

## 4. Resolution Strategy

1. **Update `client/src/lib/config.ts`**  
   Align `DJANGO_ENDPOINTS` constants with the exact OpenAPI paths (trailing slashes included).
2. **Code refactor**  
   Replace hard-coded strings with the constants or generated `ApiService` calls.  
   Remove UI flows that rely on deprecated endpoints (e.g., Broodstock dashboard KPIs).
3. **Mock server**  
   Mirror the corrected endpoints in `server/mock-api.ts` to avoid dev 404s.
4. **Proxy**  
   Ensure `server/vite.ts` preserves `/api/v1` prefix without rewrites.
5. **Documentation**  
   Add a “Contract Path Mapping” table to `docs/DJANGO_INTEGRATION_GUIDE.md`.

---

## 5. Implementation Checklist

- [ ] Update `DJANGO_ENDPOINTS` object  
- [ ] Search & replace legacy strings in `client/src/pages` & `components`  
- [ ] Extend `server/mock-api.ts` with new `/feeds/`, `/feed-stocks/`, etc.  
- [ ] Delete obsolete Mock routes (`/overview`, `/alerts`)  
- [ ] Migrate Inventory UI to new feed container paths  
- [ ] Adapt Scenario pages to `scenario/*` namespace  
- [ ] Refactor Health pages to granular endpoints  
- [ ] Add `scripts/validate_endpoints.ts` + unit tests  
- [ ] Wire script into `frontend-ci.yml`  
- [ ] Smoke-test UI against Django – **zero 404s**  
- [ ] Update docs & PR description with audit table  

---

## 6. CI/CD Enhancements

We will introduce a node script executed in the **frontend CI** job:

1. Parse OpenAPI (`api/openapi.yaml` copied during spec-sync workflow).  
2. Grep repo for regex `/api\/v1\/[\\w\\-/]+/`.  
3. Compare sets; fail build on unknown paths.  
4. Cache result artefacts for debugging.

The job is lightweight (<1 s) and prevents future drift.

---

## 7. Testing Strategy
* **Automated**  
  - Jest/MSW integration tests targeting each corrected endpoint.  
  - Playwright smoke suite asserting HTTP status ≠ 404 for primary navigation.
* **Manual**  
  - Developer checklist: open Dashboard, Inventory, Broodstock, Scenario, Health pages and watch Django console for 404s.
* **Schemathesis** (backend) continues to validate implementation fidelity.

---

## 8. Rollout Plan
1. Merge backend-only changes (if any) → wait for backend CI green.  
2. Merge frontend branch `droid/fix-api-endpoint-alignment` after CI passes.  
3. Deploy to staging; run Playwright & user acceptance tests.  
4. Monitor logs for 24 h; if no regressions promote to production.  
5. Announce contract freeze; future endpoint work must update spec first.

---

### Appendix A – Reference Scripts
* `scripts/validate_endpoints.ts` – contract diff tool  
* `scripts/generate_endpoint_list.py` – optional helper for backend devs  

---

_End of document_

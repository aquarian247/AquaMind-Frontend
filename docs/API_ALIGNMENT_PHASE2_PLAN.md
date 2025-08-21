# API Alignment Roadmap  
_AquaMind Frontend ↔ Backend • Phase 2 & 3 Planning_  
Last updated: **2025-08-18**
Status update (2025-08-21): CI now fails on endpoint validation errors; validator is clean on main.

---

## 1  Executive Summary (Phase 1 Recap)
Phase 1 aligned the **critical path** endpoints, updated `DJANGO_ENDPOINTS`, fixed inventory, scenario and health routes, modernised the mock API server, and introduced CI guard-rails (`validate:endpoints`).  
Result: the core UI no longer produces 404s against the real backend; validation now flags **~80** remaining legacy or “imaginary” endpoints.  
Result: the core UI no longer produces 404s against the real backend; validation now flags **72** remaining legacy or “imaginary” endpoints.  
Issues **#4** and **#5** were closed by **PR #15**.

---

## 2  Phase 2 Objectives & Approach
| # | Objective | Approach | Owner |
|---|-----------|----------|-------|
| 2-A | Eliminate **all** remaining invalid endpoints flagged by CI | Triage list below → create GitHub issues → fix or remove | FE devs |
| 2-B | Decide fate of features backed by “imaginary” endpoints | Use decision matrix (§ 5) → product/tech review | PM + BE |
| 2-C | Refactor pages/components to consume real endpoints or generated client | Incremental PRs, one feature/domain per PR | FE |
| 2-D | Harden validation script to **block** CI once invalid count == 0 | Flip `continue-on-error: false` | DevOps |
| 2-E | Document endpoint mapping rules & keep docs up-to-date | Update `DJANGO_INTEGRATION_GUIDE.md` | Docs team |

Timeline target: **2 weeks** or ≤ 3 PRs.

---

## 3  Remaining Endpoint Issues (Categorised)

| Category | Example Path | Count | Recommended Action | GH Issue |
|----------|--------------|-------|--------------------|----------|
| Legacy batch-management stubs | `/api/batches/`, `/api/species/`, `/api/stages/`, `/api/containers/` | **50** | Prefix with `/api/v1/batch/*` or `/api/v1/infrastructure/*` | #14 |
| ~~Dashboard prototypes~~ | — | **0** | _RESOLVED by PR #15_ | — |
| Health shortcuts | `/api/health/summary`, `/api/health/alerts/critical` | 8 | Map to granular health endpoints or implement aggregator viewset | #6 |
| Health shortcuts | `/api/health/summary`, `/api/health/alerts/critical` | **0** | RESOLVED in this PR (client-computed) | ~~#6~~ |
| Infrastructure “overview/summary” | `/api/v1/infrastructure/containers/overview` | **0** | RESOLVED in this PR (client-computed) | ~~#7~~ |
| Scenario v0 leftovers | `/api/v1/scenario/*/configuration`, `/run-projection/` (dynamic) | 6 | Confirm with BE; likely genuine → implement | #8 |
| Broodstock dashboards | `/api/v1/broodstock/dashboard/kpis`, `/tasks/` | **0** | RESOLVED in this PR (client-computed + v1 endpoints) | ~~#9~~ |
| Misc analytics | `/api/batch/growth-metrics`, `/predictive-insights` | 4 | Evaluate need; possibly move to `/api/v1/batch/batches/{id}/…` | #10 |
| Misc analytics | `/api/batch/growth-metrics`, `/predictive-insights` | **0** | **RESOLVED in PR #19** (migrated to real v1 endpoints) | ~~#10~~ |
| Non-versioned env. data | `/api/environmental-readings/` | 1 | Use `/api/v1/environmental/readings/` | #xxx |
| Misc dev artifacts | `/api/farm-sites`, `/api/broodstock-pairs` | 1 | Remove or open BE ticket | #xxx |
_Total outstanding:_ **68** references.

---

## 4  Phase 3 — Final Cleanup (Post-Alignment)

1. **Toggle CI** – make endpoint validation **blocking** (`continue-on-error: false`) — DONE (this PR flips continue-on-error off).
2. **Remove placeholders / mocks** introduced in Phase 1.
3. **Generate client-only fetches** – mandate `ApiService` usage everywhere.
4. **Delete redundant code** tied to removed “imaginary” features.
5. **Documentation freeze** – sync docs + spec; tag **v1.0-contract-strict**.

Success triggers retirement of mock API in production-like environments.

---

## 5  Decision Matrix – Handling Imaginary Endpoints

| Question | Keep Feature & Build BE | Move to Client-Side Derivation | Remove Feature |
|----------|------------------------|-------------------------------|----------------|
| Adds user value? | ✅ implement | — | — |
| Composite of existing data? | — | ✅ aggregate in FE | — |
| No stakeholder demand / low ROI? | — | — | ✅ delete |
| Breaks bounded-context rules? | ❌ redesign | — | — |
| Heavy computation / large payload? | ✅ BE service | — | — |

Use this matrix during triage meetings; record outcome in each GitHub issue.

---

## 6  Success Criteria

1. `npm run validate:endpoints` exits 0 locally and in CI (no `continue-on-error`).
2. **Zero 404s** in Django logs while navigating every shipped UI page.
3. Playwright smoke suite green in staging.
4. Documentation (`DJANGO_INTEGRATION_GUIDE.md`, OpenAPI) fully up-to-date.
5. Mock API server optional; toggling off produces identical behaviour.

---

## 7  GitHub Issues (Placeholders)

* ~~#4 Legacy stub endpoints migration (closed)~~
* ~~#5 Dashboard prototype removal / redesign (closed)~~
* **#14** Batch Management refactor (legacy stubs)
* ~~#8 Scenario dynamic endpoints implementation (completed in this PR)~~
* ~~#9 Broodstock dashboard KPI backend spec (completed in this PR)~~
* ~~#10 Batch analytics endpoint consolidation (closed by PR #19)~~
* ~~#11 CI guard flip to blocking (closed by this PR)~~
* **#12** Documentation final pass

(Replace `#xxx` with actual issue numbers once created.)

---

_Authored by Droid-assistant as requested; serves as strategic guidance for the upcoming alignment work._  

---

Finalization (2025-08-21): Obsolete shared schema removed; CI guard now blocking; ready to tag **v1.0-contract-strict**.

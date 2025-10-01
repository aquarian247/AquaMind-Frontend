## AquaMind Frontend - Code Health Remediation Plan (Post-Maintenance)

Date: 2025-09-14 (UTC)
Scope: `client/src` (exclude generated API client and tests).
Goal: Reduce complex hotspots, decompose oversized files, and standardize API usage.

### Guiding Principles
- Keep tasks single-session and self-contained to avoid context rot.
- Decompose large UI into shells + feature slices; preserve UX.
- Centralize API access; avoid bespoke `fetch`.

### Targets Identified (from METRICS_REPORT_AFTER)
- Oversized pages: `broodstock.tsx`, `batch-management.tsx`, `ScenarioPlanning.tsx`, `area-detail.tsx`.
- Oversized components: `BatchAnalyticsView.tsx`, `BatchFeedHistoryView.tsx`, `ui/sidebar.tsx`.
- High CC hooks: `hooks/aggregations/useBatchFcr.ts` (~23), `useAreaKpi.ts`.
- Residual direct `fetch`: 4 files.

---

### Task 1 — Decompose `pages/broodstock.tsx`
- Outcome: Shell + child routes/components; ≤ 300 LOC per file.
- Steps: Extract tabs/sections into `features/broodstock/*`.
- Acceptance: No UI regressions; routing and state intact.

### Task 2 — Decompose `pages/batch-management.tsx`
- Outcome: Shell pattern; move views to `features/batch/*`.
- Acceptance: Maintain tab interactions; chunked code splits where sensible.

### Task 3 — Decompose `pages/ScenarioPlanning.tsx`
- Outcome: Move dialogs/charts into `features/scenario/*`; lazy-load heavy charts.
- Acceptance: Interactions unchanged; bundle size reduced for route.

### Task 4 — Decompose `pages/area-detail.tsx`
- Outcome: Extract subviews (rings, stations, KPIs) into feature slices.
- Acceptance: URL/back button behaviour unchanged.

### Task 5 — Reduce CC in `hooks/aggregations/useBatchFcr.ts`
- Outcome: Extract pure helpers to `features/batch/logic/fcr.ts` with tests.
- Acceptance: Main hook CC ≤ 12; unit tests for helpers.

### Task 6 — Reduce CC in `hooks/aggregations/useAreaKpi.ts`
- Outcome: Extract calculations; handle errors via guards.
- Acceptance: CC ≤ 8; tests for edge cases.

### Task 7 — Centralize residual fetch usages
- Outcome: Replace direct `fetch` in 4 files with `ApiService` or `getQueryFn()`.
- Acceptance: Auth works per `authConfig.endpoints`; error handling unified.

### Task 8 — Implement size guardrails
- Outcome: ESLint rule or CI script warning on files > 300 LOC and CC ≥ 15.
- Acceptance: Non-blocking PR warnings for changed files.

### Task 9 — Add focused tests
- Outcome: Unit tests for extracted helpers and critical data transforms.
- Acceptance: New tests in `client/src/lib/__tests__/` or nearest feature folder.

### Task 10 — Documentation
- Outcome: Update `docs/frontend_testing_guide.md` and `docs/frontend-integration-grind.md` with shell/slice pattern and API usage rules.
- Acceptance: Examples reflect current architecture.

---

Execution Notes
- Process one page or hook per PR to limit context.
- Use feature branches named `chore/frontend-code-health-<topic>`.

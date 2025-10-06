## AquaMind Frontend - Metrics Report (After Maintenance)

Date: 2025-09-14 (UTC)

### Executive Summary
- Overall code health improved: central auth endpoints align with canonical JWT config in `client/src/config/auth.config.ts`.
- Complexity remains concentrated in a few oversized pages and batch-management components; high-CC hook `useBatchFcr.ts` persists.
- Direct `fetch` usage limited to infra/auth/debug; most API calls leverage the generated ApiService or centralized query fn.

### Key Metrics (After)
- Lizard sampling indicates hotspots (examples):
  - `hooks/aggregations/useBatchFcr.ts` → async function CC ≈ 23
  - `hooks/aggregations/useAreaKpi.ts` → async function CC ≈ 10
  - Utility hotspots in `lib/api.ts` (several 10–19 token/branch spans)
- Largest Pages (LOC):
  - `pages/broodstock.tsx` → 1234
  - `pages/batch-management.tsx` → 1154
  - `pages/ScenarioPlanning.tsx` → 1053
  - `pages/area-detail.tsx` → 1020
- Largest Components (LOC):
  - `components/batch-management/BatchAnalyticsView.tsx` → 1191
  - `components/batch-management/BatchFeedHistoryView.tsx` → 1137
  - `components/ui/sidebar.tsx` → 771
  - Scenario dialogs/editors → 450–700+ LOC
- Direct fetch usage (non-generated):
  - `services/auth.service.ts`, `components/batch-management/BatchFeedHistoryView.tsx`, `lib/queryClient.ts`, `lib/debug.ts`
- Auth config verification:
  - Endpoints: login `/api/token/`, refresh `/api/token/refresh/`, profile `/api/v1/users/auth/profile/` (correct)

### Compliance & Alignment (After)
- Majority of API usage via generated `ApiService` or centralized query function per guidelines.
- File size limits still exceeded in several route-level pages and complex components; decomposition recommended.

### Notable Changes vs. Previous
- Endpoint alignment confirmed; fewer files with direct `fetch` compared to legacy.
- Hotspots largely unchanged in location but are now clearly identified for targeted refactor sprints.

### Before vs After (Highlights)
- JWT auth endpoints: Before confusion/verification needed → After aligned and verified.
- Direct `fetch` sites: Before 4 → After 4 (unchanged; centralization pending).
- Peak CC in `useBatchFcr.ts`: Before ≈23 → After ≈23 (unchanged; refactor recommended).
- Oversized pages/components: Before many >1k LOC → After unchanged; decomposition still needed.

### Recommendations (Actionable)
1) Decompose oversized pages into shells (100–150 LOC) + feature slices; prioritize `broodstock.tsx`, `batch-management.tsx`, `ScenarioPlanning.tsx`.
2) Refactor `useBatchFcr.ts` by extracting pure data-shaping helpers and applying guard clauses; add unit tests for helpers.
3) Centralize residual `fetch` usage through `ApiService` or `getQueryFn()` to standardize auth headers and error handling.
4) Add CI gates: lizard CC<15 per function (warn), page/component LOC >300 flagged for review.

### Artifacts
- `docs/metrics/frontend_lizard_2025-09-14_after.txt` (sampling preview)
- Largest pages/components lists computed via LOC scan

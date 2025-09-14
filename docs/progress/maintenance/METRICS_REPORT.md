## AquaMind Frontend - Daily Metrics Report

Date: 2025-09-14 (UTC)

### Executive Summary
- Majority of logic leverages generated `ApiService`, with a few direct `fetch` calls left in infra and auth flows.
- One cyclomatic complexity warning: `hooks/aggregations/useBatchFcr.ts` function CC=23.
- Many oversized pages/components exceed guideline limits (300 LOC components; 100–150 LOC top-level pages), signaling need for decomposition.
- Auth endpoints align with canonical JWT configuration in `client/src/config/auth.config.ts`.

### Key Metrics
- Lizard summary (src only, excluding generated/tests):
  - Total NLOC: ~2605
  - Avg CCN per function: 2.0
  - Warnings: 1 (CC>15) in `useBatchFcr.ts`
- Largest Components (LOC):
  - components/batch-management/BatchAnalyticsView.tsx → 1191
  - components/batch-management/BatchFeedHistoryView.tsx → 1137
  - components/ui/sidebar.tsx → 771
  - scenario dialogs/editors range: 450–700+ LOC
- Largest Pages (LOC):
  - pages/broodstock.tsx → 1234
  - pages/batch-management.tsx → 1154
  - pages/ScenarioPlanning.tsx → 1053
  - pages/area-detail.tsx → 1020
  - several infra pages between 685–800 LOC
- Direct fetch usage (should prefer generated client or central query fn):
  - services/auth.service.ts (login/refresh/profile)
  - components/batch-management/BatchFeedHistoryView.tsx
  - lib/queryClient.ts, lib/debug.ts

### Compliance & Alignment
- API usage mostly through `ApiService` per `frontend-coding-guidelines`. Direct fetch calls remain in platform infra (auth, debug). Consider wrappers to unify behavior.
- File size limits exceeded widely; split pages into feature slices and presentational components; move data logic into hooks.
- React best practices: functional components followed; many files mix heavy business logic in components and hooks – prefer smaller composable hooks.

### Potential AI-generated Code Patterns
- Generated headers detected in `client/src/api/generated/**` (expected, from openapi-typescript-codegen).
- No obvious AI comment markers found in app code. Large, monolithic TSX files with repetitive sections could be refactored regardless of origin.

### Recommendations (Actionable)
1) Decompose oversized pages
   - Split route-level pages into 100–150 LOC shells + feature hooks/components.
   - Prioritize: `broodstock.tsx`, `batch-management.tsx`, `ScenarioPlanning.tsx`.
2) Refactor high-CC hook
   - `hooks/aggregations/useBatchFcr.ts`: Extract data shaping into pure helpers; reduce branches; add early returns.
3) Centralize fetch usage
   - Replace direct `fetch` with `ApiService` or the app-wide `getQueryFn()` to ensure auth headers, retries, and logging.
   - Target: `auth.service.ts`, `BatchFeedHistoryView.tsx`, `lib/queryClient.ts`, `lib/debug.ts`.
4) Enforce guideline gates
   - Add CI lizard step with thresholds (CC<15 per function); add size check for components/pages to flag >300 LOC.
5) Auth config verification
   - Confirm endpoints remain `login: /api/token/`, `refresh: /api/token/refresh/`, `profile: /api/v1/users/auth/profile/` – currently correct.

### Appendix
- Artifacts: `docs/metrics/frontend_lizard_YYYY-MM-DD.txt` and `frontend_lizard_components_YYYY-MM-DD.txt`.
- Sources: lizard (JS/TS), grep scans for `fetch(`, guideline comparison.

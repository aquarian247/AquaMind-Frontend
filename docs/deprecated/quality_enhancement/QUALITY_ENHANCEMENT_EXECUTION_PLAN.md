# Quality Enhancement Execution Plan

> **Branch Policy**: Execute every task on a single long-running branch (e.g. `feature/quality-enhancement`) and merge only after the full plan is complete. Rebase against `main` as needed, but do not split work across multiple branches.

## Task 0 – Establish Baseline & Guardrails Context
- **Objective**: Confirm environment, capture current metrics, and align on quality gates before refactoring.
- **Actions**:
  - Switch to the dedicated feature branch (`git checkout -B feature/quality-enhancement`).
  - Run `npm run lint`, `npm run type-check`, and `npm run test` to record baseline status.
  - Run existing complexity tooling (`npm run complexity:analyze` or equivalent scripts) and snapshot results.
  - Document baseline metrics in the branch (notes only; no doc updates yet).
- **Reading List**:
  - `README.md`
  - `docs/architecture.md`
  - `docs/frontend_testing_guide.md`
  - `docs/CONTRIBUTING.md`
  - `docs/DJANGO_INTEGRATION_GUIDE.md`
  - `client/package.json` (scripts overview)
  - `docs/progress/METRICS_REPORT_AFTER.md`

## Task 1 – Centralize API Usage & Dynamic Filter Sources
- **Objective**: Eliminate remaining ad-hoc `fetch` calls and hard-coded filter data to guarantee sustainable integration before major refactors.
- **Actions**:
  - Replace residual direct `fetch` usage (e.g. in `services/auth.service.ts`, `lib/queryClient.ts`, `lib/debug.ts`, audit-trail pages) with wrappers based on the generated `ApiService` or approved query helpers, ensuring auth flows stay intact.
  - Refactor static geography and filter option sources (e.g. infrastructure stations, batch management) to pull from live endpoints with fallbacks per the integration guide.
  - Verify front-end consumes `/api/v1/operational/fcr-trends/` and other aggregation endpoints via generated clients in all relevant hooks.
  - Update unit tests/mocks to reflect canonical API client usage.
- **Reading List**:
  - `client/src/lib/queryClient.ts`
  - `client/src/services/auth.service.ts`
  - `client/src/lib/api.ts`
  - `client/src/pages/infrastructure-stations.tsx`
  - `client/src/features/batch/api/api.ts`
  - `client/src/hooks/use-fcr-analytics.ts`
  - Generated client under `client/src/api/generated/`

## Task 2 – Batch Management Page Decomposition
- **Objective**: Decompose `client/src/pages/batch-management.tsx` into a ≤150 LOC shell with feature slices, aligning with the refactoring guide and complexity thresholds.
- **Actions**:
  - Create `features/batch-management/pages` shell and migrate existing tabs/views into dedicated components under `features/batch-management/components`.
  - Extract business logic into hooks under `features/batch-management/hooks` and pure utilities with tests.
  - Ensure shell orchestrates routing/state only; move forms, dialogs, and analytics views out of the page file.
  - Confirm naming conventions (`rawData`, `processedData`, etc.) prevent ambiguity.
  - Add/adjust unit tests for new helpers and hooks.
- **Reading List**:
  - `docs/refactor_large_pages.md` (now in `docs/deprecated/`, keep for context)
  - `client/src/pages/batch-management.tsx`
  - `client/src/features/batch/hooks/useBatchData.ts`
  - `client/src/components/batch-management/*`
  - `docs/frontend_testing_guide.md`

## Task 3 – Scenario Planning Page Decomposition
- **Objective**: Apply the same slice strategy to `client/src/pages/ScenarioPlanning.tsx`, introducing lazy-loaded heavy components and modular feature slices.
- **Actions**:
  - Establish `features/scenario/pages/ScenarioPlanningPage.tsx` as shell, moving dialogs, grids, and KPI logic into components/hooks directories.
  - Lazy-load chart-heavy sections via dynamic imports where appropriate to protect bundle size.
  - Replace inline mutation logic with dedicated hooks under `features/scenario/hooks` with test coverage for data transforms.
  - Maintain routing/state compatibility and ensure tests cover core interactions.
- **Reading List**:
  - `client/src/pages/ScenarioPlanning.tsx`
  - `client/src/features/scenario/hooks/useScenarioData.ts`
  - Scenario components under `client/src/components/scenario/`
  - `docs/architecture.md` (for feature boundaries)

## Task 4 – Area Detail Page Decomposition & KPI Alignment
- **Objective**: Decompose `client/src/pages/area-detail.tsx` while aligning all KPIs with backend aggregation endpoints.
- **Actions**:
  - Create `features/infrastructure/pages/AreaDetailPage.tsx` shell and relocate detailed tabs/views into modular components/hooks.
  - Replace client-side aggregation (`useAreaKpi`) usage with server summaries (`useAreaSummary`, etc.), ensuring fallbacks meet frontend integration guide rules.
  - Normalize formatting (Intl number formatting, `formatFallback`) across the refactored components.
  - Expand tests for business rules (filtering, fallbacks).
- **Reading List**:
  - `client/src/pages/area-detail.tsx`
  - `client/src/features/infrastructure/api/index.ts`
  - `client/src/hooks/aggregations/useAreaKpi.ts`
  - `docs/DJANGO_INTEGRATION_GUIDE.md`
  - `client/src/lib/formatFallback.ts`

## Task 5 – Large Component Remediation (Sidebar & Batch Modules)
- **Objective**: Reduce oversized shared components (`components/ui/sidebar.tsx`, `BatchAnalyticsView.tsx`, `BatchFeedHistoryView.tsx`) below target LOC and complexity.
- **Actions**:
  - Split sidebar into layout shell plus composable navigation sections under `components/layout/` or feature slices, ensuring accessibility is preserved.
  - Extract analytics/feed business logic into reusable hooks with unit tests; leave components primarily presentational.
  - Apply consistent formatting utilities and data fallbacks introduced in earlier tasks.
- **Reading List**:
  - `client/src/components/ui/sidebar.tsx`
  - `client/src/components/batch-management/BatchAnalyticsView.tsx`
  - `client/src/components/batch-management/BatchFeedHistoryView.tsx`
  - `docs/frontend_testing_guide.md`
  - `docs/CONTRIBUTING.md`

## Task 6 – Refactor Aggregation Hooks with Tests
- **Objective**: Lower cyclomatic complexity in `useBatchFcr` and `useAreaKpi`, switching to pure helper modules with targeted unit tests.
- **Actions**:
  - Extract helper functions into `features/batch/logic/fcr.ts` and `features/infrastructure/logic/areaKpi.ts` (or similar) with Vitest coverage.
  - Ensure hooks delegate to backend aggregation endpoints where available, retaining fallbacks only as a guarded edge case.
  - Simplify hook bodies to composition of helpers, targeting CC ≤12 (Batch) and ≤8 (Area).
  - Update any consuming components to use revised hook signatures.
- **Reading List**:
  - `client/src/hooks/aggregations/useBatchFcr.ts`
  - `client/src/hooks/aggregations/useAreaKpi.ts`
  - Backend aggregation ADR in `docs/architecture.md`
  - `docs/frontend_testing_guide.md`

## Task 7 – Implement Automated Size & Complexity Guardrails
- **Objective**: Enforce quality gates so future work respects LOC/CC thresholds without manual policing.
- **Actions**:
  - Add ESLint or custom lint rule for max LOC per file (e.g. 300 for components, 150 for hooks/pages) and integrate into lint command.
  - Extend complexity script to fail CI when functions exceed CC threshold (configurable) for changed files.
  - Update `package.json` scripts and (if present) CI configuration to run guardrails on `npm run lint` / `npm run test:ci`.
  - Document guardrail behavior within developer notes (e.g. `docs/CONTRIBUTING.md` references may already cover it; avoid doc edits unless mandatory per instructions).
- **Reading List**:
  - `package.json`
  - `.eslintrc.*`
  - Existing complexity scripts in `scripts/` and `package.json`
  - `docs/CONTRIBUTING.md`

## Task 8 – Targeted Test Expansion
- **Objective**: Strengthen coverage for newly extracted helpers and high-value business rules ensuring sustainable quality.
- **Actions**:
  - Add unit tests for FCR/area KPI helpers, dynamic filter processors, and sidebar navigation generation.
  - Create smoke tests for refactored page shells to confirm routing/tab orchestration still functions.
  - Ensure mocks align with contract-first API usage (JWT endpoints, paginated responses).
  - Run `npm run test:ci` and address any coverage regressions introduced by guardrails.
- **Reading List**:
  - `client/src/lib/formatFallback.ts`
  - New helper locations from Tasks 2–6
  - `docs/frontend_testing_guide.md`

## Task 9 – Final Quality Sweep & Branch Readiness
- **Objective**: Validate the entire branch meets quality targets and is ready for final review/merge.
- **Actions**:
  - Re-run `npm run lint`, `npm run type-check`, `npm run test:ci`, and complexity scripts, ensuring zero violations.
  - Perform manual smoke checks on decomposed pages (batch management, scenario planning, area detail) against both Express mock and Django API if available.
  - Update plan status notes (no doc updates required unless new guidance emerged).
  - Prepare concise summary of outcomes for PR (without updating docs unless requested).
- **Reading List**:
  - Branch diff (`git status`, `git diff`)
  - All task-specific notes captured during execution
  - `README.md` (quick verification of environment scripts)

---

Following this ordered sequence ensures each refactor builds on a stabilized foundation, preserves context for single-session agents, and enforces sustainable quality without requiring post-plan cleanup.

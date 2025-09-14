# Frontend Maintainability Improvement Plan

Date: 2025-09-14 (UTC)

Working mode
- Single feature branch for ALL phases: `feat/frontend-maintainability-plan`
- One PR at the very end after all issues are completed and validated
- No merges to main between phases; keep branch rebased with `origin/main`

Baseline & scope
- Goal: reduce file sizes, cyclomatic/cognitive complexity, and standardize API usage
- Out-of-scope: visual redesign or new features
- Baseline metrics artifacts: `docs/metrics/frontend_lizard_YYYY-MM-DD.txt`, `docs/metrics/frontend_lizard_components_YYYY-MM-DD.txt`, `docs/METRICS_REPORT.md`

Session protocol (apply in every phase)
1) Read these docs first:
   - `docs/code_organization_guidelines.md`
   - `docs/NAVIGATION_ARCHITECTURE.md`
   - `docs/frontend_testing_guide.md`
   - `docs/CONTRIBUTING.md`
   - `docs/DJANGO_INTEGRATION_GUIDE.md`
   - `client/src/config/auth.config.ts` (verify canonical endpoints)
2) Re-check current metrics in `docs/metrics/` and note targets
3) Make focused edits only; run tests, build, and lizard after changes
4) Update `docs/METRICS_REPORT.md` deltas if the phase changes metrics meaningfully

Targets
- Page shell ≤150 LOC; components ≤300 LOC
- Function length ≤50 LOC; CC < 15 per function
- Eliminate remaining direct `fetch` for app code (use `ApiService` or `getQueryFn()`)

Phases (each sized for a single agent session)

Phase 1 — Decompose top oversized pages (routing shells + feature slices)
- Files: `pages/broodstock.tsx`, `pages/batch-management.tsx`, `pages/ScenarioPlanning.tsx`
- Approach: turn each into a thin route shell (layout/providers) and extract sub-sections to feature-local components and hooks
- Acceptance:
  - Each target page ≤150 LOC
  - New components/hooks created per section; no lost functionality
  - All imports updated; build + tests pass

Phase 2 — Decompose oversized components
- Files: `components/batch-management/BatchAnalyticsView.tsx`, `components/batch-management/BatchFeedHistoryView.tsx`, `components/ui/sidebar.tsx`
- Approach: identify logical sections (tables, dialogs, charts) → extract into presentational components; move data shaping into hooks
- Acceptance:
  - Each target component ≤300 LOC
  - Zero behavior change (snapshot and smoke tests still pass)

Phase 3 — Reduce CC in high-complexity hook
- File: `hooks/aggregations/useBatchFcr.ts` (max CC=23)
- Approach: extract data transformations into pure helpers, add early returns, reduce nested branching
- Acceptance:
  - Max CC < 15 for functions in file
  - Hook API unchanged; tests pass

Phase 4 — Centralize remaining direct fetch calls ✅ COMPLETED
- Files: `services/auth.service.ts`, `components/batch-management/BatchFeedHistoryView.tsx`, `lib/queryClient.ts`, `lib/debug.ts`
- Approach: replace direct `fetch` with generated `ApiService` or `getQueryFn()`; preserve headers, retries, and timeouts
- Acceptance:
  - No direct `fetch` in app code (generated client internal calls excluded)
  - Auth flow verified against canonical endpoints
- Completed: 2025-09-14 - Replaced direct fetch calls in auth.service.ts (login/refresh) and BatchFeedHistoryView.tsx (feeding events summary) with ApiService methods. Debug and queryClient utilities determined to be infrastructure code and left unchanged.

Phase 5 — Introduce lightweight CI gates for size/complexity
- Approach: add npm script to run lizard on src; fail on CC>15 or excessive file length (warn-only initially); add size audit for top pages/components
- Acceptance:
  - New scripts in `package.json`
  - CI job logs complexity table and file sizes

Phase 6 — Documentation & playbook alignment
- Update `docs/code_organization_guidelines.md` with concrete examples and the refactor playbook used
- Add a short “How to refactor a large page” guide under `docs/`

GitHub issues (one per phase)

Issue 1
- Title: Frontend: Decompose oversized pages into shells + feature slices (broodstock, batch-management, scenario)
- Body:
  Summary
  - Split `pages/broodstock.tsx`, `pages/batch-management.tsx`, `pages/ScenarioPlanning.tsx` into route shells (≤150 LOC) and feature-local subcomponents + hooks.

  Outcomes
  - Page shells ≤150 LOC each; no functional regressions; metrics improved.

  Steps
  - Identify sections per page (tables, dialogs, charts)
  - Extract components to `features/<area>/components/` and logic to `features/<area>/hooks.ts`
  - Ensure React Query data access in `features/<area>/api.ts`
  - Update routes/imports; run tests/build/lizard

  Acceptance
  - LOC limits met; tests green; no TypeScript errors; lizard shows CC ≤15 for page code.

  References
  - `docs/NAVIGATION_ARCHITECTURE.md`, `docs/code_organization_guidelines.md`, metrics in `docs/metrics/`

Issue 2
- Title: Frontend: Split oversized components (BatchAnalyticsView, BatchFeedHistoryView, Sidebar)
- Body:
  Summary
  - Extract subviews and heavy JSX blocks into presentational components; move data shaping to hooks.

  Outcomes
  - Each target component ≤300 LOC; no UI/behavior change.

  Steps
  - Identify cohesive sections; create subcomponents
  - Create/select hooks for data fetch/aggregation
  - Update tests and snapshots; run lizard

  Acceptance
  - LOC threshold met; CC < 15; tests pass.

  References
  - `docs/code_organization_guidelines.md`, `docs/frontend_testing_guide.md`, metrics

Issue 3
- Title: Frontend: Reduce cyclomatic complexity in useBatchFcr hook to < 15
- Body:
  Summary
  - Refactor `hooks/aggregations/useBatchFcr.ts` by extracting pure helpers and flattening branches.

  Outcomes
  - Max CC < 15; identical public API; no behavior change.

  Steps
  - Extract transformation helpers; add early returns
  - Add unit tests for helpers; run lizard

  Acceptance
  - CC < 15; tests and build pass.

  References
  - Metrics file `docs/metrics/frontend_lizard_*.txt`

Issue 4
- Title: Frontend: Centralize remaining direct fetch calls via ApiService/getQueryFn
- Body:
  Summary
  - Replace direct `fetch` in `auth.service.ts`, `BatchFeedHistoryView.tsx`, `lib/queryClient.ts`, `lib/debug.ts` with generated client or query fn.

  Outcomes
  - Unified error handling/auth; fewer code paths.

  Steps
  - Map each call to the matching ApiService method
  - Ensure canonical auth endpoints in `client/src/config/auth.config.ts`
  - Verify flows with test credentials (do not hard-code)

  Acceptance
  - No direct fetch remaining (outside generated client); tests and build pass.

  References
  - `docs/CONTRIBUTING.md`
  - `docs/DJANGO_INTEGRATION_GUIDE.md`

Issue 5
- Title: Frontend: Add lizard-based complexity and size audit to CI (warn-only)
- Body:
  Summary
  - Add scripts to report CC and large files in CI; fail gate can be enabled later.

  Outcomes
  - Repeatable complexity/size report in CI artifacts.

  Steps
  - Add npm script for lizard; wire to CI
  - Document thresholds and remediation path

  Acceptance
  - CI outputs table; no false positives block merges.

  References
  - `docs/METRICS_REPORT.md`, metrics files

Issue 6
- Title: Frontend: Update guidelines and add refactor playbook for large pages/components
- Body:
  Summary
  - Codify examples and checklists used; reduce future regressions.

  Outcomes
  - Developers have a concrete playbook for future decompositions.

  Steps
  - Update `docs/code_organization_guidelines.md` with concrete examples
  - Add short guide `docs/refactor_large_pages.md`

  Acceptance
  - Docs updated; cross-linked in CONTRIBUTING.

  References
  - `docs/CONTRIBUTING.md`, guidelines

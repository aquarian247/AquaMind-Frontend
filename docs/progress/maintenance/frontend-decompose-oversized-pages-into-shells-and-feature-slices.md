Summary
Split pages into thin route shells (≤150 LOC) and feature-local subcomponents + hooks.
Targets: pages/broodstock.tsx, pages/batch-management.tsx, pages/ScenarioPlanning.tsx.

Outcomes
- Each target page ≤150 LOC; no functional regressions.
- Data access in features via ApiService + React Query.

Steps
1) Identify sections per page (tables, dialogs, charts).
2) Extract presentational components and feature hooks.
3) Move data fetching to features/<area>/api.ts using ApiService.
4) Update routes/imports; run tests/build/lizard.

Acceptance
- LOC limits met; tests green; no TS errors; CC ≤ 15 in page shell code.

References
- docs/code_organization_guidelines.md
- docs/NAVIGATION_ARCHITECTURE.md
- docs/metrics/frontend_lizard_*.txt
- docs/DAILY_METRICS_REPORT.md
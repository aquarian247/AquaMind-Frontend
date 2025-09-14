Summary
Extract subviews and heavy JSX blocks into presentational components; move data shaping to hooks.
Targets: components/batch-management/BatchAnalyticsView.tsx, BatchFeedHistoryView.tsx, components/ui/sidebar.tsx.

Outcomes
- Each target component ≤300 LOC; no UI/behavior change.

Steps
1) Identify cohesive sections; create subcomponents.
2) Create/select hooks for data fetch/aggregation.
3) Update tests and snapshots; run lizard.

Acceptance
- LOC threshold met; CC < 15; tests pass.

References
- docs/code_organization_guidelines.md
- docs/frontend_testing_guide.md
- docs/metrics/frontend_lizard_components_*.txt
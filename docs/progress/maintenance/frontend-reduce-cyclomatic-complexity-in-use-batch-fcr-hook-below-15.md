Summary
Refactor hooks/aggregations/useBatchFcr.ts by extracting pure helpers and flattening branches.

Outcomes
- Max CC < 15; identical public API; no behavior change.

Steps
1) Extract transformation helpers; add early returns.
2) Add unit tests for helpers; run lizard.

Acceptance
- CC < 15; tests and build pass.

References
- docs/metrics/frontend_lizard_*.txt
- docs/code_organization_guidelines.md
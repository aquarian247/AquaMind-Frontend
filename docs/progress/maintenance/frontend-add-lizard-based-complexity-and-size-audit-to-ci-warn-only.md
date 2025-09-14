Summary
Add scripts to report CC and large files in CI; fail gate can be enabled later.

Outcomes
- Repeatable complexity/size report in CI artifacts.

Steps
1) Add npm script(s) to run lizard on src and components/pages subset.
2) Wire to CI workflow; archive report artifacts.
3) Document thresholds and remediation.

Acceptance
- CI outputs complexity table; no blocking yet; docs updated.

References
- docs/DAILY_METRICS_REPORT.md
- docs/metrics/
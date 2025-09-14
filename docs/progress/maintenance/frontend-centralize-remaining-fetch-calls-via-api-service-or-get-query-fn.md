Summary
Replace direct fetch calls in app code with generated ApiService or getQueryFn().
Targets: services/auth.service.ts, components/batch-management/BatchFeedHistoryView.tsx, lib/queryClient.ts, lib/debug.ts.

Outcomes
- Unified error handling/auth and timeouts; fewer code paths.

Steps
1) Map each call to matching ApiService methods; keep behavior.
2) Ensure canonical auth endpoints in client/src/config/auth.config.ts.
3) Verify flows with test credentials (do not hard-code).

Acceptance
- No direct fetch in app code (generated client excluded); tests/build pass.

References
- docs/api_alignment/FRONTEND_ADAPTATION_PRINCIPLES.md
- docs/DAILY_METRICS_REPORT.md
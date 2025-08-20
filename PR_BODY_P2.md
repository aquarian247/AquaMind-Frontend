Summary
- Phase P2 migration completed: eliminated raw API paths, adopted semantic React Query keys, and migrated to generated ApiService v1 wrappers across affected pages/components.
- Preserved snake_case and paginated shapes; aligned types with generated models. Added safe placeholder arrays in complex analytics/traceability views where backend coverage is pending.
- Endpoint validation: 0 invalid endpoints.

Validation
- npm run type-check → PASS
- npm run validate:endpoints → PASS (0 invalid)

Key Changes
- lib/api.ts: Added/updated wrappers (infrastructure rings, inventory, broodstock placeholders, batch growth/mortality/feeding summaries). Fixed method name to ApiService.apiV1InventoryBatchFeedingSummariesList.
- Migrated pages to wrappers with semantic keys: area-rings, ring-detail, inventory-simple, broodstock-programs, breeding-program-details, broodstock-population, broodstock-container-details, broodstock-genetic, batch-management, batch-details.
- Components: BatchTraceabilityView, BatchFeedHistoryView, BatchAnalyticsView (semantic keys, placeholders, explicit generics, default arrays). Scenario dialogs (creation/edit and FCR model) and batch integration dialog; farm/pen management table.
- Types/Mapping fixes: ensured ExtendedBatch mapping from Batch, LifeCycleStage→Stage mapping for FCR model dialog, default arrays to avoid never types.
- Docs: docs/api_alignment/API_TYPE_ALIGNMENT_MASTER_PLAN.md updated to mark P2 complete and add session notes.

Why this PR
- Standardizes how data is fetched using ApiService v1 and semantic keys.
- Enables enforcement via endpoint validator and improves debuggability and caching.

Follow-ups (Post-P2)
- Replace placeholders with real endpoints where applicable (analytics/traceability deeper data).
- Add CI gates for validate:endpoints and type-check as blocking (P4).
- Consider consolidating api.ts thin wrappers or codegen-based layer if/when endpoint coverage expands.

Notes
- This is a Droid-assisted PR. Please review semantic key naming and any placeholder sections flagged in comments for future wiring.

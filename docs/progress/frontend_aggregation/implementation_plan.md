# Frontend Aggregation Adoption Plan (Single-Branch Execution)

> Purpose: Replace client-side aggregations across the app with backend aggregation endpoints and ensure honest fallbacks (N/A) where data is unavailable.

## Branch and Workflow

- Single feature branch: `feature/aggregations-for-frontend` (one PR at the end)
- Contract-first: `npm run sync:openapi` before coding
- Use generated `ApiService` only (no hardcoded URLs)
- Fallbacks must always be honest: display "N/A" or "No data available", never hardcoded totals
- Auth endpoints: `/api/token/` and `/api/token/refresh/` only

## Available Summary Endpoints (high-value)

- Infrastructure
  - `ApiService.apiV1InfrastructureAreasSummaryRetrieve(id)`
  - `ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(id)`
  - `ApiService.apiV1InfrastructureHallsSummaryRetrieve(id)`
  - `ApiService.apiV1InfrastructureGeographiesSummaryRetrieve(id)`
- Batch
  - `ApiService.apiV1BatchContainerAssignmentsSummaryRetrieve()` with filters: geography, area, station, hall, container_type
- Inventory
  - `/api/v1/inventory/feeding-events/summary/` with `start_date`/`end_date`
  - Batch feeding summaries endpoints
- Scenario
  - `FcrService` and `TrendsService` for FCR trends, stage summaries, and scenario stats
- Environmental, Health, Broodstock
  - No aggregation endpoints identified: audit UIs and enforce N/A fallbacks; avoid client aggregation

## Cross-App Task Plan (session-sized tasks)

Each task below includes scope, endpoints, reading list, QA/acceptance, PO test steps, and dev steps. All tasks commit to the single feature branch with one PR at the end.

### 0) Scaffolding and Guardrails ✅ [COMPLETED 2025-09-18]
- Scope
  - **OpenAPI Sync Check** - Ensure latest backend endpoints are available:
    ```bash
    # Before starting, ensure latest endpoints are available
    npm run sync:openapi
    npm run generate:api
    # Verify summary endpoints exist in generated code
    grep -r "summaryRetrieve" client/src/api/generated/services/
    ```
  - Add feature-level wrappers for generated client:
    - `features/infrastructure/api.ts`: areaSummary, stationSummary, hallSummary, geographySummary
    - `features/inventory/api.ts`: feedingEventsSummaryRange, batchFeedingSummaries
    - `features/batch/api.ts`: containerAssignmentsSummary, fcrTrends
    - `features/scenario/api.ts`: stageSummary, scenarioSummaryStats
  - Add `formatFallback(value, unit?)` utility returning "N/A"/"No data available"
- Reading: `docs/CONTRIBUTING.md`, `docs/frontend_testing_guide.md`
- QA: type-check, lint, unit tests for hooks with mocks, fallback behavior covered
- PO test: none (scaffolding only)
- Dev: `npm run sync:openapi && npm run type-check && npm run test`

**Implementation Notes (2025-09-18):**
- ✅ Created comprehensive formatFallback utility with type-specific formatters (formatWeight, formatCurrency, formatPercentage, etc.)
- ✅ API wrappers use the base model types (Area, Hall, etc.) not custom Summary types - the summary endpoints return enriched versions of base models
- ✅ feedingEventsSummary returns inline type with events_count and total_feed_kg fields
- ✅ Test files using JSX must have .tsx extension, not .ts
- ✅ React Query v5 doesn't have isIdle state - use isPending and isFetching instead
- ✅ Generated API signatures may change - always verify parameter order against latest generated code
- ⚠️ Some scenario endpoints lost batch filtering capability in latest API version - may need backend support

### 1) Infrastructure — Area Detail uses Area Summary
- Scope: `client/src/pages/area-detail.tsx` replace `useAreaKpi` and client joins with `AreasSummaryRetrieve`
- Endpoint: `ApiService.apiV1InfrastructureAreasSummaryRetrieve(id)`
- Reading: Aggregation Playbook; Implementation Plan (Area)
- QA: cards display container_count, ring_count, active_biomass_kg, population_count, avg_weight_kg; missing => N/A
- PO test: login, open Area, confirm metrics or N/A; offline -> safe fallbacks
- Dev: implement + tests (mock `ApiService`)

### 2) Infrastructure — Station Detail uses Station Summary
- Scope: `client/src/pages/station-detail.tsx` KPI cards to `FreshwaterStationsSummaryRetrieve`
- Endpoint: `ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(id)`
- Reading: Implementation Plan (Station)
- QA: halls, containers, biomass, population, avg weight correct or N/A
- PO test: open Station; verify metrics
- Dev: implement + tests

### 3) Infrastructure — Hall Detail uses Hall Summary
- Scope: `client/src/pages/hall-detail.tsx` KPI tiles use `HallsSummaryRetrieve`
- Endpoint: `ApiService.apiV1InfrastructureHallsSummaryRetrieve(id)`
- Reading: Implementation Plan (Hall)
- QA: containers, biomass, population, avg weight; N/A on missing
- PO test: open Hall; verify metrics
- Dev: implement + tests

### 4) Infrastructure — Overviews (Geography, Stations list, Areas list)
- Scope
  - `client/src/pages/infrastructure.tsx`: when geography selected, show `GeographiesSummaryRetrieve` in overview cards
  - `client/src/pages/infrastructure-stations.tsx`: replace temporary client aggregation with station summary for selected station
  - `client/src/pages/infrastructure-areas.tsx`: replace overview/per-area metrics with area summary per item
- Endpoints: GeographiesSummaryRetrieve, FreshwaterStationsSummaryRetrieve, AreasSummaryRetrieve
- Reading: Implementation Plan (Geography)
- QA: remove `authenticatedFetch` for these rollups; preserve N/A
- PO test: navigate infra sections; cards update per selection; lists show metrics or N/A
- Dev: implement + tests (multi-id mocks)

### 5) Inventory — Feeding Events Summary (Date Range)
- Scope: `client/src/pages/inventory.tsx` replace last-7-days client calculation with `/inventory/feeding-events/summary/` using start/end date
- Endpoints: `/api/v1/inventory/feeding-events/summary/`, batch feeding summaries
- Reading: Implementation Plan (date ranges)
- QA: last 7 days totals driven by API; N/A on empty
- PO test: inventory dashboard cards show totals or N/A
- Dev: implement + tests for single-day and range

### 6) Batch — Container Assignments Summary and FCR Trends
- Scope
  - Replace location rollups with `container-assignments/summary` filters
  - Ensure FCR charts use backend `TrendsService`/`FcrService`
- Endpoints: `ApiService.apiV1BatchContainerAssignmentsSummaryRetrieve()`, `TrendsService`, `FcrService`
- Reading: Implementation Plan (filters, weighted FCR)
- QA: location summaries sourced from API; FCR charts reflect backend averaging
- PO test: batch pages show summary widgets; FCR chart loads; empty => N/A
- Dev: implement + tests

### 7) Scenario — Stage Summary and Scenario Stats
- Scope: use `stage_summary` and scenario summary stats in scenario pages
- Endpoints: `apiV1ScenarioFcrModelsStageSummaryRetrieve(model_id)`, scenario summary stats
- Reading: Implementation Plan (trends semantics)
- QA: scenario panels reflect backend summaries; defaults documented
- PO test: open scenario; verify panels and charts or N/A
- Dev: implement + tests

### 8) Environmental — Audit and Honest Fallbacks
- Scope: ensure derived values are clearly labeled and use N/A; avoid client aggregation until backend endpoints exist
- Endpoints: none
- QA/PO test: charts render, KPIs show N/A if empty

### 9) Health — Audit and Honest Fallbacks
- Same as Environmental

### 10) Broodstock — Audit and Honest Fallbacks
- Same as Environmental

### 11) Cleanup, Docs, PR
- Scope
  - Remove client-side aggregation code paths now replaced
  - Update `docs/CONTRIBUTING.md` and `README.md` to reflect server-side aggregation standard
  - Update progress document in backend repo per implementation progress rule
- QA: lint/type/test pass; no lingering references to removed hooks
- PO test: sanity pass across pages; N/A where data missing

## Product Owner Test Checklist
- Auth via `/api/token/` works; login succeeds
- Infrastructure: Area/Station/Hall details show metrics or N/A; overview updates with geography selection; station/area lists show per-item metrics or N/A
- Inventory: Last 7 days totals from date-range endpoint; N/A when empty
- Batch: Location-filtered summary and FCR trends load; N/A when empty
- Scenario: Stage summary and overall stats load; N/A when empty
- Environmental/Health/Broodstock: No misleading numbers; N/A fallbacks everywhere

## Reading List (minimal)
- Backend: `aquamind/docs/development/aggregation_playbook.md`, `aquamind/docs/quality_assurance/api_standards.md`, `aquamind/docs/deprecated/aggregation/aggregation-implementation-plan.md`
- Frontend: `docs/CONTRIBUTING.md`, `docs/frontend_testing_guide.md`, `docs/code_organization_guidelines.md`

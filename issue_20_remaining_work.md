# Issue #20 Remaining Work: Replace fetch() with ApiService

This document outlines the remaining work needed to complete Issue #20, which mandates replacing all raw fetch() calls with ApiService throughout the frontend.

## Progress Summary

✅ **Completed**:
- BatchFeedHistoryView.tsx - Replaced fetch() with ApiService.apiV1InventoryFeedingEventsList()
- BatchTraceabilityView.tsx - Replaced multiple fetch() calls with corresponding ApiService methods
- Updated MSW handlers to return paginated responses matching Django API structure
- Fixed all batch management tests (31/31 passing)
- Updated documentation in frontend_testing_guide.md

❌ **Remaining**: 16 files with fetch() calls need to be updated

## Remaining Work Checklist

### 1. Scenario Components (Estimated complexity: Medium)

- [ ] **scenario-detail-dialog.tsx**
  - Replace fetch() for `/api/v1/scenario/scenarios/${id}/projections/` with ApiService.apiV1ScenarioScenariosProjectionsRetrieve()
  - Replace fetch() for `/api/v1/scenario/scenarios/${id}/configuration/` with appropriate ApiService method
  - Update any data transformations to match ApiService return types

### 2. Infrastructure Pages (Estimated complexity: High)

- [ ] **infrastructure-areas.tsx**
  - Replace fetch() calls for area listings with ApiService.apiV1InfrastructureAreasList()
  - Update pagination handling for area listings

- [ ] **infrastructure-stations.tsx**
  - Replace fetch() calls for station listings with ApiService.apiV1InfrastructureStationsList()
  - Update pagination handling for station listings

- [ ] **area-detail.tsx**
  - Replace fetch() for area details with ApiService.apiV1InfrastructureAreasRetrieve()
  - Replace fetch() for related rings with appropriate ApiService method

- [ ] **area-rings.tsx**
  - Replace fetch() calls for ring data with appropriate ApiService methods
  - Update any data transformations needed

- [ ] **ring-detail.tsx**
  - Replace fetch() calls for ring details with appropriate ApiService methods
  - Update any data transformations needed

### 3. Container/Station/Hall Pages (Estimated complexity: Medium)

- [ ] **container-detail.tsx**
  - Replace fetch() for container details with ApiService.apiV1InfrastructureContainersRetrieve()
  - Replace fetch() for related data (assignments, etc.)

- [ ] **hall-detail.tsx**
  - Replace fetch() for hall details with ApiService.apiV1InfrastructureHallsRetrieve()
  - Replace fetch() for related data (containers, etc.)

- [ ] **station-detail.tsx**
  - Replace fetch() for station details with ApiService.apiV1InfrastructureStationsRetrieve()
  - Replace fetch() for related data (halls, etc.)

- [ ] **station-halls.tsx**
  - Replace fetch() for halls within a station with appropriate ApiService methods
  - Update pagination handling if needed

### 4. Batch/Inventory Pages (Estimated complexity: High)

- [ ] **batch-details.tsx**
  - Replace fetch() for batch details with ApiService.apiV1BatchBatchesRetrieve()
  - Replace fetch() for related data (assignments, growth samples, etc.)

- [ ] **batch-management.tsx**
  - Replace fetch() for batch listings with ApiService.apiV1BatchBatchesList()
  - Update pagination handling for batch listings

- [ ] **inventory.tsx**
  - Replace fetch() calls for inventory data with appropriate ApiService methods
  - Update pagination handling for inventory listings

- [ ] **inventory-simple.tsx**
  - Replace fetch() calls for simplified inventory views with appropriate ApiService methods
  - Update any data transformations needed

- [ ] **health.tsx**
  - Replace fetch() calls for health data with ApiService.apiV1HealthJournalEntriesList() and other health-related endpoints
  - Update pagination handling for health entries

### 5. Scenario Planning (Estimated complexity: High)

- [ ] **ScenarioPlanning.tsx**
  - Replace fetch() calls for scenario planning data with appropriate ApiService methods
  - Update any complex data transformations needed
  - Handle pagination for scenario listings

## Testing Strategy

For each file:
1. Identify all fetch() calls and their corresponding ApiService methods
2. Replace fetch() with ApiService calls, updating data handling as needed
3. Update any tests that mock these endpoints to use the correct ApiService methods
4. Verify that all components render correctly with the new API calls
5. Run the test suite to ensure no regressions

## Completion Criteria

- All 16 remaining files have fetch() calls replaced with ApiService methods
- All tests pass (currently 31/31 passing)
- No direct fetch() usage outside of lib/api.ts or ApiService
- Documentation is up to date with usage guidelines

## Notes

- The core batch management functionality is complete and working with real Django APIs
- The remaining work focuses on other areas of the application
- ESLint rule for preventing direct fetch() usage requires ESLint to be installed first

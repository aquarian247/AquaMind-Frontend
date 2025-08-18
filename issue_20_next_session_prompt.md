# Issue #20 Continuation: Replace fetch() with ApiService throughout frontend

## Background

Issue #20 mandates replacing all raw fetch() calls with ApiService throughout the frontend to ensure consistency, type safety, and maintainability. The initial work has been completed for the core batch management components, but 16 files still contain fetch() calls that need to be replaced.

## Previous Work Completed

- BatchFeedHistoryView.tsx - Replaced fetch() with ApiService.apiV1InventoryFeedingEventsList()
- BatchTraceabilityView.tsx - Replaced multiple fetch() calls with corresponding ApiService methods
- Updated MSW handlers to return paginated responses matching Django API structure
- Fixed all batch management tests (31/31 passing)
- Updated documentation in frontend_testing_guide.md

## Current Branch

The work is being done on the `droid/issue-20-mandate-apiservice` branch. A draft PR has been created to track progress.

## Your Task

Complete Issue #20 by replacing all remaining fetch() calls with appropriate ApiService methods in the 16 remaining files. Follow the established patterns from the batch management components.

### Files to Update (Grouped by Category)

#### 1. Scenario Components
- `client/src/components/scenario/scenario-detail-dialog.tsx`
  - Replace fetch() for `/api/v1/scenario/scenarios/${id}/projections/` with ApiService.apiV1ScenarioScenariosProjectionsRetrieve()
  - Replace fetch() for `/api/v1/scenario/scenarios/${id}/configuration/` with appropriate ApiService method

#### 2. Infrastructure Pages
- `client/src/pages/infrastructure-areas.tsx`
- `client/src/pages/infrastructure-stations.tsx`
- `client/src/pages/area-detail.tsx`
- `client/src/pages/area-rings.tsx`
- `client/src/pages/ring-detail.tsx`

#### 3. Container/Station/Hall Pages
- `client/src/pages/container-detail.tsx`
- `client/src/pages/hall-detail.tsx`
- `client/src/pages/station-detail.tsx`
- `client/src/pages/station-halls.tsx`

#### 4. Batch/Inventory Pages
- `client/src/pages/batch-details.tsx`
- `client/src/pages/batch-management.tsx`
- `client/src/pages/inventory.tsx`
- `client/src/pages/inventory-simple.tsx`
- `client/src/pages/health.tsx`

#### 5. Scenario Planning
- `client/src/pages/ScenarioPlanning.tsx`

## Approach

For each file:

1. **Identify fetch() calls**: Locate all fetch() calls in the file
2. **Find matching ApiService methods**: Search in `client/src/api/generated/services/ApiService.ts` for the corresponding method
3. **Replace fetch() with ApiService**: Update the code to use the ApiService method
4. **Handle pagination**: Most Django endpoints return paginated responses with this structure:
   ```typescript
   {
     count: number;
     next: string | null;
     previous: string | null;
     results: Array<T>;
   }
   ```
   Make sure to extract the `results` array when needed
5. **Update data transformations**: Adjust any data transformations to match the ApiService return types
6. **Test the changes**: Verify that the component renders correctly with the new API calls

## Key Patterns to Follow

### 1. Replace direct fetch() calls:

```typescript
// BEFORE
const { data, isLoading } = useQuery({
  queryKey: ["/api/some-endpoint"],
  queryFn: () => fetch("/api/some-endpoint").then(res => res.json()),
});

// AFTER
const { data, isLoading } = useQuery({
  queryKey: ["/api/v1/some-endpoint"],
  queryFn: async () => {
    try {
      const response = await ApiService.apiV1SomeEndpointList();
      return response;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw new Error("Failed to fetch data");
    }
  },
});
```

### 2. Handle paginated responses:

```typescript
// BEFORE
const items = data || [];

// AFTER
const items = data?.results || [];
```

### 3. Update test mocks:

```typescript
// BEFORE
vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
  new Response(JSON.stringify([{ id: 1, name: 'Item 1' }]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
);

// AFTER
vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
  new Response(JSON.stringify({
    count: 1,
    next: null,
    previous: null,
    results: [{ id: 1, name: 'Item 1' }]
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
);
```

## Testing Strategy

1. After updating each file, run the relevant tests:
   ```bash
   npm test -- --run src/path/to/component.test.tsx
   ```

2. If a test fails, check:
   - Is the mock returning the correct paginated structure?
   - Is the component extracting data from `results` correctly?
   - Are the types aligned between the component and the API response?

3. After all files are updated, run the full test suite:
   ```bash
   npm run test:ci
   ```

## Acceptance Criteria

- All 16 remaining files have fetch() calls replaced with ApiService methods
- All tests pass (currently 31/31 passing)
- No direct fetch() usage outside of lib/api.ts or ApiService
- Documentation is up to date with usage guidelines

## Resources

- ApiService documentation: `client/src/api/generated/services/ApiService.ts`
- Updated testing guide: `docs/frontend_testing_guide.md`
- Detailed remaining work checklist: `issue_20_remaining_work.md`

## Deliverables

1. Updated code in all 16 files with fetch() replaced by ApiService
2. All tests passing
3. Commit message following the pattern:
   ```
   feat: complete Issue #20 - Replace fetch() with ApiService throughout frontend
   
   - Replaced fetch() in scenario components
   - Replaced fetch() in infrastructure pages
   - Replaced fetch() in container/station/hall pages
   - Replaced fetch() in batch/inventory pages
   - Replaced fetch() in scenario planning
   
   Closes #20
   ```

Good luck completing Issue #20!

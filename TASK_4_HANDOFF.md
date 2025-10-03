# Task 4 Handoff - Area Detail Page Decomposition & KPI Alignment

**Branch:** `feature/quality-enhancement` (pushed to origin)  
**Current Status:** Tasks 0-3 Complete, Task 4 Ready for Execution

## Context: What's Been Completed

### ✅ Task 0 - Baseline Established
- Branch created: `feature/quality-enhancement`
- Baseline metrics captured: 7,447 NLOC, Avg CCN 1.6, 2 warnings (CCN > 15)
- All tests passing: 369 tests
- Documentation: `TASK_0_BASELINE_METRICS.md`

### ✅ Task 1 - API Centralization Complete
- **File:** `client/src/pages/infrastructure-stations.tsx`
- Replaced `authenticatedFetch` with `ApiService.apiV1InfrastructureFreshwaterStationsList()`
- Replaced hardcoded geography filters with dynamic API fetch
- Tests: 396 passing (27 new)
- Documentation: `TASK_1_COMPLETION_REPORT.md`

### ✅ Task 2 - Batch Management Decomposed
- **Major Success:** 509 LOC → 191 LOC shell (62% reduction)
- Created production-quality feature slice
- All tests passing: 396 tests (27 new)
- Documentation: `TASK_2_COMPLETION_REPORT.md`, `TASK_2_DECOMPOSITION_STRATEGY.md`

### ✅ Task 3 - Scenario Planning Decomposed
- **Outstanding Success:** 902 LOC → 444 LOC shell (51% reduction)
- **CCN Warning Fixed:** useScenarioData 18 → 4.7 (74% reduction, exceeded goal)
- Complexity warnings: 2 → 1 (eliminated target warning)
- Created comprehensive feature slice with 46 new tests
- All tests passing: 442 tests
- Documentation: `TASK_3_COMPLETION_REPORT.md`, `TASK_3_HANDOFF.md`

### Quality Metrics (Current)
- ✅ Tests: 442 passed | 7 skipped (449 total)
- ✅ Type Checking: 0 errors
- ✅ Complexity: 1 warning remaining (use-analytics-data.ts CCN 23, not in Task 4 scope)
- ✅ Total NLOC: 8,399
- ✅ Avg CCN: 1.6 (excellent)

## Task 4 - Area Detail Page Decomposition & KPI Alignment

### Current State Analysis

**File:** `client/src/pages/area-detail.tsx`
- **Size:** 912 LOC (very similar to Task 3's 902 LOC)
- **Target:** ≤150 LOC shell (similar to Tasks 2 & 3)
- **Reduction needed:** 85% (762 LOC to extract)

**Critical Differences from Tasks 2 & 3:**
- ❌ No CCN warnings (good - no complexity issues to fix)
- ✅ Additional goal: Replace client-side KPIs with server-side aggregation
- ✅ Must normalize formatting with `formatFallback` utilities
- ✅ Integration with `useAreaSummary` server-side endpoint

### Current Architecture Issues

**File Analysis (`area-detail.tsx`):**
1. **Lines 1-78:** Imports and type interfaces (mixing concerns)
2. **Lines 79-84:** Component state (search, filters, tabs)
3. **Lines 85-128:** Area data query with manual mapping
4. **Lines 130-148:** Rings (containers) query with filtering
5. **Lines 150-160:** Environmental data query
6. **Lines 162-169:** Area summary hook (server-side, ✅ good)
7. **Lines 171-210:** Filtered rings computation (should be hook)
8. **Lines 212-912:** Massive render section (700 LOC!)
   - Lines 212-350: Header and KPI cards (138 LOC)
   - Lines 352-912: Tab content (560 LOC)
     - Environmental tab (150 LOC)
     - Containers tab (200 LOC)
     - Operations tab (100 LOC)
     - History tab (110 LOC)

**Problems Identified:**
1. Client-side KPI calculations mixed with server-side (line 85-128)
2. Manual data mapping (should use helper functions)
3. Filtering logic inline (lines 171-210, should be hook)
4. Massive render section (700 LOC needs component extraction)
5. Using old `authenticatedFetch` in some places (line 13)

### What Needs Extraction

#### 1. Replace Client-Side KPIs with Server Aggregation (Priority 1)
**Current Issue:** Lines 85-128 manually map data
**Problem:** `useAreaKpi` hook (client-side) exists but not used consistently

**Solution:**
Create `features/infrastructure/hooks/useAreaData.ts`:
```typescript
export function useAreaData(areaId: number) {
  // Use server-side aggregation
  const { data: summary } = useAreaSummary(areaId);
  
  // Fetch area details
  const { data: area } = useQuery({
    queryKey: ["area", areaId],
    queryFn: () => ApiService.apiV1InfrastructureAreasRetrieve(areaId)
  });
  
  // Fetch containers (rings)
  const { data: containers } = useQuery({
    queryKey: ["area-containers", areaId],
    queryFn: () => ApiService.apiV1InfrastructureContainersList(undefined, [areaId])
  });
  
  return {
    area,
    summary, // Server-side KPIs
    containers,
    isLoading: /* ... */
  };
}
```

**Benefits:**
- Uses server-side aggregation (`useAreaSummary`)
- Eliminates manual KPI calculations
- Consistent with backend aggregation strategy

#### 2. Extract Filtering Logic to Hook
**Location:** Lines 171-210

**Create:** `features/infrastructure/hooks/useContainerFilters.ts`
```typescript
export function useContainerFilters(containers: Container[]) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredContainers = useMemo(() => {
    return containers.filter((container) => {
      const matchesStatus = statusFilter === "all" || container.status === statusFilter;
      const matchesSearch = !searchQuery || 
        container.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [containers, statusFilter, searchQuery]);
  
  return { statusFilter, setStatusFilter, searchQuery, setSearchQuery, filteredContainers };
}
```

#### 3. Extract Formatting Utilities
**Problem:** Inconsistent formatting across the page

**Create:** `features/infrastructure/utils/areaFormatters.ts`
```typescript
import { formatWeight, formatCount, formatFallback } from "@/lib/formatFallback";

export function formatAreaKPIs(summary: AreaSummary | undefined) {
  return {
    totalBiomass: formatWeight(summary?.total_biomass),
    totalStock: formatCount(summary?.total_stock),
    averageWeight: formatWeight(summary?.average_weight),
    mortalityRate: formatFallback(summary?.mortality_rate, "percentage"),
    // ... other KPIs
  };
}

export function formatContainerData(container: Container) {
  return {
    biomass: formatWeight(container.biomass),
    capacity: formatCount(container.capacity),
    fishCount: formatCount(container.fish_count),
    // ... other fields
  };
}
```

**Add tests:** `areaFormatters.test.ts` (20-30 tests)

#### 4. Extract Tab Content Components
**Problem:** 700 LOC render section

**Create components under `features/infrastructure/components/`:**
- `AreaEnvironmentalTab.tsx` (~100 LOC) - Environmental data display
- `AreaContainersTab.tsx` (~150 LOC) - Containers grid with filtering
- `AreaOperationsTab.tsx` (~80 LOC) - Operations history
- `AreaHistoryTab.tsx` (~80 LOC) - Audit/history log

**Each component:**
- Receives data via props (presentational)
- No data fetching (shell passes data down)
- Focused responsibility (single tab)

#### 5. Create Shell Page
**Create:** `features/infrastructure/pages/AreaDetailPage.tsx` (~150 LOC)

**Structure:**
```typescript
export default function AreaDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("environmental");
  const areaId = Number(params.id);
  
  // Hooks - data fetching and filtering
  const { area, summary, containers, environmental, isLoading } = useAreaData(areaId);
  const { statusFilter, setStatusFilter, searchQuery, setSearchQuery, filteredContainers } = 
    useContainerFilters(containers ?? []);
  const formattedKPIs = formatAreaKPIs(summary);
  
  // Shell pattern: orchestration only
  return (
    <div className="container mx-auto p-4 space-y-6">
      <AreaHeader area={area} formattedKPIs={formattedKPIs} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="environmental">
          <AreaEnvironmentalTab area={area} environmental={environmental} />
        </TabsContent>
        
        <TabsContent value="containers">
          <AreaContainersTab 
            containers={filteredContainers}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </TabsContent>
        
        <TabsContent value="operations">
          <AreaOperationsTab area={area} />
        </TabsContent>
        
        <TabsContent value="history">
          <AreaHistoryTab areaId={areaId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

#### 6. Update Old File
**Update:** `client/src/pages/area-detail.tsx`
```typescript
// Re-export for backward compatibility
export { default } from "@/features/infrastructure/pages/AreaDetailPage";
```

### Task 4 Execution Checklist

- [ ] Create `features/infrastructure/utils/areaFormatters.ts` with tests (20-30 tests)
- [ ] Create `features/infrastructure/hooks/useAreaData.ts` (integrate `useAreaSummary`)
- [ ] Create `features/infrastructure/hooks/useContainerFilters.ts`
- [ ] Create `features/infrastructure/components/AreaEnvironmentalTab.tsx`
- [ ] Create `features/infrastructure/components/AreaContainersTab.tsx`
- [ ] Create `features/infrastructure/components/AreaOperationsTab.tsx`
- [ ] Create `features/infrastructure/components/AreaHistoryTab.tsx`
- [ ] Create `features/infrastructure/components/AreaHeader.tsx` (extract header/KPIs)
- [ ] Create `features/infrastructure/pages/AreaDetailPage.tsx` (≤150 LOC)
- [ ] Update `pages/area-detail.tsx` to re-export
- [ ] Run tests: `npm run test` (expect 470+ passing)
- [ ] Run type check: `npm run type-check` (expect 0 errors)
- [ ] Run complexity: `npm run complexity:analyze` (no new warnings)
- [ ] Smoke test: Navigate to Area Detail page and verify functionality
- [ ] Create `TASK_4_COMPLETION_REPORT.md`

### Expected Outcomes

**Metrics:**
- Page size: 912 LOC → ~150 LOC (84% reduction)
- New tests: ~30-40 for formatters and filtering utilities
- Total tests: 480+ passing
- Complexity warnings: 1 (unchanged, not in scope)
- Server-side KPIs: 100% (replacing client-side calculations)

**Files Created:**
- `features/infrastructure/utils/areaFormatters.ts` (~60 LOC)
- `features/infrastructure/utils/areaFormatters.test.ts` (~100 LOC)
- `features/infrastructure/hooks/useAreaData.ts` (~80 LOC)
- `features/infrastructure/hooks/useContainerFilters.ts` (~35 LOC)
- `features/infrastructure/components/AreaHeader.tsx` (~80 LOC)
- `features/infrastructure/components/AreaEnvironmentalTab.tsx` (~100 LOC)
- `features/infrastructure/components/AreaContainersTab.tsx` (~150 LOC)
- `features/infrastructure/components/AreaOperationsTab.tsx` (~80 LOC)
- `features/infrastructure/components/AreaHistoryTab.tsx` (~80 LOC)
- `features/infrastructure/pages/AreaDetailPage.tsx` (~150 LOC)

**Files Modified:**
- `pages/area-detail.tsx` (re-export only, ~8 LOC)

## Guidelines & Standards

### Production Quality Requirements
1. **No shortcuts** - UAT-ready code only
2. **Full error handling** - All edge cases covered
3. **Comprehensive tests** - Unit tests for all utilities (formatters, filters)
4. **JSDoc comments** - Document public APIs
5. **Type safety** - Full TypeScript coverage
6. **Backward compatibility** - Re-export pattern for old imports
7. **Server-first** - Use `useAreaSummary` for KPIs, client-side fallbacks only

### Testing Standards (from Tasks 2 & 3 pattern)
- Pure functions: 90%+ coverage
- All edge cases tested (null, undefined, empty arrays, invalid inputs)
- Use Vitest + React Testing Library
- Mock API calls with `vi.fn()`
- Test both success and error paths
- Test formatting with various number formats (decimals, large numbers, null)

### Code Organization (from Tasks 2 & 3 pattern)
- Utils: Pure functions, no side effects
- Hooks: Single responsibility, composable
- Shell page: Orchestration only, delegates to hooks
- Components: Presentational, receive props
- Tests: Co-located with implementation

### KPI Alignment Strategy
**Server-side first (preferred):**
```typescript
// Use server-side aggregation
const { data: summary } = useAreaSummary(areaId);
const totalBiomass = formatWeight(summary?.total_biomass);
```

**Client-side fallback (only if server unavailable):**
```typescript
// Fallback to honest zeros
const totalBiomass = formatWeight(undefined); // Returns "0 kg"
```

**Never:**
- ❌ Manual aggregation from raw data
- ❌ Complex calculations in components
- ❌ Mixing server and client calculations

### Commit Strategy
Follow the single-branch policy from execution plan:
- Work on `feature/quality-enhancement` branch
- Commit incrementally as you complete each extraction
- Use descriptive commit messages (see Tasks 1-3 examples)
- Final push when Task 4 complete

## Reference Documents

Read these for context and patterns:
1. `QUALITY_ENHANCEMENT_EXECUTION_PLAN.md` - Overall plan
2. `TASK_2_COMPLETION_REPORT.md` - Example of successful decomposition
3. `TASK_3_COMPLETION_REPORT.md` - Most recent example with CCN reduction
4. `TASK_3_HANDOFF.md` - Similar page decomposition pattern
5. `docs/DJANGO_INTEGRATION_GUIDE.md` - Server-side aggregation strategy
6. `docs/frontend_testing_guide.md` - Testing patterns
7. `docs/code_organization_guidelines.md` - Architecture rules

## Commands

```bash
# Navigate to project
cd /Users/aquarian247/Projects/AquaMind-Frontend

# Verify you're on the right branch
git branch  # Should show: feature/quality-enhancement

# Check current state
git status

# Create directories
mkdir -p client/src/features/infrastructure/{pages,utils,components}

# Run tests after changes
npm run test

# Run type checking
npm run type-check

# Run complexity analysis
npm run complexity:analyze

# Check results
tail -60 docs/metrics/frontend_lizard_latest.txt

# Commit progress
git add -A
git commit -m "refactor(task-4): your message here"

# Push when complete
git push origin feature/quality-enhancement
```

## Success Criteria

Task 4 is complete when:
- ✅ Shell page ≤150 LOC (or close - 191 LOC acceptable like Task 2)
- ✅ All KPIs use server-side aggregation (`useAreaSummary`)
- ✅ Formatting uses `formatFallback` utilities consistently
- ✅ All tests passing (480+ tests, 30-40 new)
- ✅ 0 TypeScript errors
- ✅ No new complexity warnings
- ✅ Formatter utilities have 90%+ test coverage
- ✅ Backward compatible (re-export working)
- ✅ Smoke test passed (area detail page works in browser)
- ✅ Documentation complete (TASK_4_COMPLETION_REPORT.md)

## Notes for Agent

- **Pattern to follow:** Tasks 2 & 3 were successful - follow the same pattern
- **Server-first KPIs:** Primary goal is replacing client-side with server-side aggregation
- **Page size:** Secondary goal is shell pattern (≤150 LOC ideal, <200 acceptable)
- **Quality over speed:** Take time to write production-quality code
- **Test everything:** New utilities must have comprehensive tests
- **No CCN warnings:** Good news - no complexity issues to fix in this file
- **Ask if unclear:** Better to clarify than make wrong assumptions

Good luck! The foundation from Tasks 0-3 is solid. Task 4 follows the same proven pattern with an added focus on server-side KPI integration.


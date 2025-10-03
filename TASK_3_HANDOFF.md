# Task 3 Handoff - Scenario Planning Page Decomposition

**Branch:** `feature/quality-enhancement` (pushed to origin)  
**Current Status:** Tasks 0-2 Complete, Task 3 Analysis Complete, Ready for Execution

## Context: What's Been Completed

### ✅ Task 0 - Baseline Established
- Branch created: `feature/quality-enhancement`
- Baseline metrics captured: 7,447 NLOC, Avg CCN 1.6, 2 warnings (CCN > 15)
- All tests passing: 369 tests
- Documentation: `TASK_0_BASELINE_METRICS.md`

### ✅ Task 1 - API Centralization Complete
- **File:** `client/src/pages/infrastructure-stations.tsx`
- Replaced `authenticatedFetch` with `ApiService.apiV1InfrastructureFreshwaterStationsList()`
- Replaced hardcoded geography filters (Faroe/Scotland) with dynamic API fetch
- Tests: 396 passing (27 new), 0 TypeScript errors
- Documentation: `TASK_1_COMPLETION_REPORT.md`

### ✅ Task 2 - Batch Management Decomposed
- **Major Success:** 509 LOC → 191 LOC shell (62% reduction)
- Created production-quality feature slice:
  - Shell page: `features/batch-management/pages/BatchManagementPage.tsx` (191 LOC)
  - Hooks: `useBatchFilters`, `useBatchCreation`
  - Utils: `batchHelpers`, `lifecycleHelpers` (with 27 unit tests)
  - Schema: `batchFormSchema`
  - Component: `CreateBatchDialog`
- All tests passing: 396 tests (27 new)
- Backward compatible: Old path re-exports new location
- Documentation: `TASK_2_COMPLETION_REPORT.md`, `TASK_2_DECOMPOSITION_STRATEGY.md`

### Quality Metrics (Current)
- ✅ Tests: 396 passed | 7 skipped (403 total)
- ✅ Type Checking: 0 errors
- ✅ Complexity: 2 warnings (both in files not yet refactored)
  - `useScenarioData.ts` line 83-130: CCN 18 ⚠️
  - `use-analytics-data.ts` line 150-217: CCN 23 ⚠️
- ✅ Total NLOC: 7,813
- ✅ Avg CCN: 1.6 (excellent)

## Task 3 - Scenario Planning Page Decomposition

### Current State Analysis

**File:** `client/src/pages/ScenarioPlanning.tsx`
- **Size:** 902 LOC (much larger than 325 reported in baseline)
- **Target:** ≤150 LOC shell page
- **Reduction needed:** 83% (752 LOC to extract)

**Critical Issue:** `useScenarioData.ts` CCN 18 (lines 83-130)
- useMemo callback computing KPIs
- Multiple conditional checks
- Needs refactoring to reduce complexity

### Already Extracted (Good Foundation)
✅ Components in `features/scenario/components/`:
- `ScenarioKPIs.tsx` (with tests)
- `ScenarioOverview.tsx`

✅ Dialogs in `components/scenario/`:
- `scenario-creation-dialog.tsx`
- `scenario-edit-dialog.tsx`
- `batch-integration-dialog.tsx`
- `tgc-model-creation-dialog.tsx`
- `fcr-model-creation-dialog.tsx`
- `mortality-model-creation-dialog.tsx`
- `scenario-projections-chart.tsx`
- `scenario-detail-dialog.tsx`

✅ Hooks in `features/scenario/hooks/`:
- `useScenarioData.ts` (needs CCN reduction)

✅ API in `features/scenario/api/`:
- `api.ts`

### What Needs Extraction

#### 1. Fix CCN 18 in useScenarioData.ts (Priority 1)
**Location:** `client/src/features/scenario/hooks/useScenarioData.ts` lines 83-130

**Current Issue:**
```typescript
const computedKpis: ScenarioPlanningKPIs = useMemo(() => {
  // 48 lines of complex conditional logic
  // CCN 18 due to multiple if/else branches
  // Checking for backend summary vs client-side fallback
}, [summaryStatsQuery.data, scenariosQuery.data]);
```

**Solution:**
Extract to pure helper function in `features/scenario/utils/kpiCalculations.ts`:
```typescript
export function calculateScenarioKPIs(
  summaryData: any,
  scenariosList: any[]
): ScenarioPlanningKPIs {
  // Extract the 48-line logic here
  // Break into smaller helper functions:
  // - extractBackendKPIs(summaryData)
  // - calculateClientKPIs(scenariosList)
}
```

Then in hook:
```typescript
const computedKpis = useMemo(() => 
  calculateScenarioKPIs(summaryStatsQuery.data, scenariosQuery.data?.results),
  [summaryStatsQuery.data, scenariosQuery.data]
);
```

**Target:** Reduce CCN from 18 to ≤12

#### 2. Extract Mutations to Custom Hook
**Location:** `client/src/pages/ScenarioPlanning.tsx` lines ~115-190

**Mutations to extract:**
- `deleteScenarioMutation`
- `duplicateScenarioMutation` (currently unused)
- `runProjectionMutation` (currently unused)

**Create:** `features/scenario/hooks/useScenarioMutations.ts`
```typescript
export function useScenarioMutations() {
  return {
    deleteScenario: deleteScenarioMutation,
    duplicateScenario: duplicateScenarioMutation,
    runProjection: runProjectionMutation,
  };
}
```

#### 3. Extract Filter Logic
**Location:** `client/src/pages/ScenarioPlanning.tsx` lines ~192-202

**Create:** `features/scenario/hooks/useScenarioFilters.ts`
```typescript
export function useScenarioFilters(scenarios: any[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredScenarios = useMemo(() => {
    // Extract filtering logic
  }, [scenarios, searchTerm, statusFilter]);
  
  return { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredScenarios };
}
```

#### 4. Create Shell Page
**Create:** `features/scenario/pages/ScenarioPlanningPage.tsx` (~150 LOC)

**Structure:**
```typescript
export default function ScenarioPlanningPage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Hooks
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredScenarios } = useScenarioFilters(...);
  const { temperatureProfiles, tgcModels, fcrModels, mortalityModels, kpis, isLoading } = useScenarioData(...);
  const { deleteScenario } = useScenarioMutations();
  
  // Shell pattern: orchestration only
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Header>
        <ScenarioCreationDialog />
      </Header>
      
      <ScenarioKPIs kpis={kpis} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview">
          <ScenarioOverview scenarios={filteredScenarios} ... />
        </TabsContent>
        {/* Other tabs */}
      </Tabs>
    </div>
  );
}
```

#### 5. Update Old File
**Update:** `client/src/pages/ScenarioPlanning.tsx`
```typescript
// Re-export for backward compatibility
export { default } from "@/features/scenario/pages/ScenarioPlanningPage";
```

### Task 3 Execution Checklist

- [ ] Create `features/scenario/utils/kpiCalculations.ts` with tests
- [ ] Refactor `useScenarioData.ts` to use extracted KPI helper
- [ ] Verify CCN reduced from 18 to ≤12
- [ ] Create `features/scenario/hooks/useScenarioMutations.ts`
- [ ] Create `features/scenario/hooks/useScenarioFilters.ts`
- [ ] Create `features/scenario/pages/ScenarioPlanningPage.tsx` (≤150 LOC)
- [ ] Update `pages/ScenarioPlanning.tsx` to re-export
- [ ] Run tests: `npm run test` (expect 396+ passing)
- [ ] Run type check: `npm run type-check` (expect 0 errors)
- [ ] Run complexity: `npm run complexity:analyze` (verify CCN reduction)
- [ ] Create `TASK_3_COMPLETION_REPORT.md`

### Expected Outcomes

**Metrics:**
- Page size: 902 LOC → ~150 LOC (83% reduction)
- useScenarioData CCN: 18 → ≤12 (33% reduction)
- New tests: ~20-30 for KPI calculation utilities
- Total tests: 420+ passing
- Complexity warnings: 2 → 1 (fix useScenarioData, leave use-analytics-data for Task 6)

**Files Created:**
- `features/scenario/utils/kpiCalculations.ts` (~60 LOC)
- `features/scenario/utils/kpiCalculations.test.ts` (~80 LOC)
- `features/scenario/hooks/useScenarioMutations.ts` (~80 LOC)
- `features/scenario/hooks/useScenarioFilters.ts` (~35 LOC)
- `features/scenario/pages/ScenarioPlanningPage.tsx` (~150 LOC)

**Files Modified:**
- `features/scenario/hooks/useScenarioData.ts` (simplified)
- `pages/ScenarioPlanning.tsx` (re-export only)

## Guidelines & Standards

### Production Quality Requirements
1. **No shortcuts** - UAT-ready code only
2. **Full error handling** - All edge cases covered
3. **Comprehensive tests** - Unit tests for all utilities
4. **JSDoc comments** - Document public APIs
5. **Type safety** - Full TypeScript coverage
6. **Backward compatibility** - Re-export pattern for old imports

### Testing Standards (from Task 2 pattern)
- Pure functions: 90%+ coverage
- All edge cases tested (null, undefined, empty arrays, invalid inputs)
- Use Vitest + React Testing Library
- Mock API calls with `vi.fn()`
- Test both success and error paths

### Code Organization (from Task 2 pattern)
- Utils: Pure functions, no side effects
- Hooks: Single responsibility, composable
- Shell page: Orchestration only, delegates to hooks
- Components: Presentational, receive props
- Tests: Co-located with implementation

### Commit Strategy
Follow the single-branch policy from execution plan:
- Work on `feature/quality-enhancement` branch
- Commit incrementally as you complete each extraction
- Use descriptive commit messages (see Task 1 & 2 examples)
- Final push when Task 3 complete

## Reference Documents

Read these for context and patterns:
1. `QUALITY_ENHANCEMENT_EXECUTION_PLAN.md` - Overall plan
2. `TASK_2_COMPLETION_REPORT.md` - Example of successful decomposition
3. `TASK_2_DECOMPOSITION_STRATEGY.md` - Strategy pattern
4. `docs/frontend_testing_guide.md` - Testing patterns
5. `docs/code_organization_guidelines.md` - Architecture rules

## Commands

```bash
# Navigate to project
cd /Users/aquarian247/Projects/AquaMind-Frontend

# Verify you're on the right branch
git branch  # Should show: feature/quality-enhancement

# Create directories (already done)
mkdir -p client/src/features/scenario/{pages,utils}

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
git commit -m "refactor(task-3): your message here"

# Push when complete
git push origin feature/quality-enhancement
```

## Success Criteria

Task 3 is complete when:
- ✅ Shell page ≤150 LOC
- ✅ useScenarioData CCN ≤12 (reduced from 18)
- ✅ All tests passing (420+ tests)
- ✅ 0 TypeScript errors
- ✅ Complexity warnings: 1 (down from 2)
- ✅ KPI utilities have 90%+ test coverage
- ✅ Backward compatible (re-export working)
- ✅ Documentation complete (TASK_3_COMPLETION_REPORT.md)

## Notes for Agent

- **Pattern to follow:** Task 2 was a great success - follow the same pattern
- **CCN reduction:** Primary goal is fixing the CCN 18 warning
- **Page size:** Secondary goal is shell pattern (≤150 LOC ideal, <200 acceptable)
- **Quality over speed:** Take time to write production-quality code
- **Test everything:** New utilities must have comprehensive tests
- **Ask if unclear:** Better to clarify than make wrong assumptions

Good luck! The foundation from Tasks 0-2 is solid. Task 3 follows the same proven pattern.


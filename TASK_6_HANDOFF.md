# Task 6 Handoff - Aggregation Hooks Refactoring

**Branch:** `feature/quality-enhancement` (pushed to origin)  
**Current Status:** Tasks 0-5 Complete, Task 6 Ready for Execution

## Context: What's Been Completed

### ✅ Task 0 - Baseline Established
- Branch created: `feature/quality-enhancement`
- Baseline metrics: 9,150 NLOC, Avg CCN 1.6, 2 warnings
- Documentation: `TASK_0_BASELINE_METRICS.md`

### ✅ Task 1 - API Centralization Complete
- Replaced `authenticatedFetch` with generated `ApiService`
- Replaced hardcoded filters with dynamic API fetch
- Tests: 396 passing
- Documentation: `TASK_1_COMPLETION_REPORT.md`

### ✅ Task 2 - Batch Management Decomposed
- **Success:** 509 LOC → 191 LOC shell (62% reduction)
- Created production-quality feature slice
- Tests: 396 passing (27 new)
- Documentation: `TASK_2_COMPLETION_REPORT.md`

### ✅ Task 3 - Scenario Planning Decomposed
- **Outstanding Success:** 902 LOC → 444 LOC shell (51% reduction)
- **CCN Warning Fixed:** useScenarioData 18 → 4.7 (74% reduction)
- Complexity warnings: 2 → 1 (eliminated target warning)
- Tests: 442 passing (46 new)
- Documentation: `TASK_3_COMPLETION_REPORT.md`

### ✅ Task 4 - Area Detail Decomposed & KPI Integration
- **Excellent Success:** 912 LOC → 147 LOC shell (83.9% reduction)
- **100% Server-Side KPIs:** All KPIs use `useAreaSummary` aggregation
- Tests: 481 passing (39 new)
- Documentation: `TASK_4_COMPLETION_REPORT.md`

### ✅ Task 5 - Large Component Remediation
- **Success:** BatchAnalyticsView 427 → 324 LOC, BatchFeedHistoryView 537 → 234 LOC
- **42 new tests** (523 total, 100% passing)
- **6 critical bugs fixed** during user testing (pagination, filtering, rendering)
- **UI improvements:** Aligned batch-details with area-details design
- Documentation: `TASK_5_COMPLETION_REPORT.md`

### Quality Metrics (Current)
- ✅ Tests: **523 passed** | 7 skipped (530 total)
- ✅ Type Checking: **0 errors**
- ✅ Complexity: **2 warnings** (formatAreaKPIs CCN 18, use-analytics-data CCN 23)
- ✅ Total NLOC: **10,089**
- ✅ Avg CCN: **1.6** (excellent)
- ✅ **Major pages decomposed:** Batch Management, Scenario Planning, Area Detail

## Task 6 - Refactor Aggregation Hooks with Tests

### Objective

Lower cyclomatic complexity in aggregation hooks by extracting helper functions into testable pure utility modules. The current warnings are:

1. **`use-analytics-data.ts`** - CCN 23 (line 150-217)
2. **`formatAreaKPIs`** - CCN 18 (acceptable, multi-field formatter with 39 tests)

**Note:** `formatAreaKPIs` is already well-tested and acceptable. Focus on `use-analytics-data`.

### Target Files

**File 1:** `client/src/hooks/use-analytics-data.ts`
- **Current CCN:** 23 (warning threshold is 15)
- **Current Size:** 318 LOC
- **Target CCN:** ≤15 (35% reduction)
- **Strategy:** Extract calculation logic to pure helper functions

**File 2 (Optional):** `client/src/hooks/aggregations/useBatchFcr.ts`
- **Current CCN:** 4.3 (no warning, but could be improved)
- **Current Size:** 101 LOC
- **Target CCN:** ≤4 (maintain or improve)
- **Strategy:** Extract any complex calculations to helpers

**File 3 (Optional):** `client/src/hooks/aggregations/useAreaKpi.ts`
- **Current CCN:** 2.8 (no warning, already good)
- **Current Size:** 71 LOC
- **Target CCN:** ≤2 (maintain)
- **Strategy:** Minimal changes, verify server-first approach

### Task 6 Execution Strategy

#### Phase 1: Assessment (15 minutes)

1. **Analyze the CCN 23 warning:**
   ```bash
   cd /Users/aquarian247/Projects/AquaMind-Frontend
   
   # Check current metrics
   npm run complexity:analyze
   grep -A 10 "use-analytics-data" docs/metrics/frontend_lizard_latest.txt
   
   # Read the problematic function
   # (It's around line 150-217 in use-analytics-data.ts)
   ```

2. **Identify complexity sources:**
   - Nested conditionals
   - Complex calculations
   - Multiple data transformations
   - Conditional logic patterns

3. **Plan extraction:**
   - Which calculations can be pure functions?
   - What can be simplified with early returns?
   - Are there switch statements that can be lookup tables?

#### Phase 2: Extract Helper Functions (1-2 hours)

**Target Architecture:**
```
hooks/
└── use-analytics-data.ts (~250 LOC, CCN ≤15) - Refactored hook

features/batch-management/utils/
├── analyticsCalculations.ts (~100 LOC) - Pure calculation functions
└── analyticsCalculations.test.ts (~150 LOC) - Comprehensive tests
```

**Extraction Steps:**

1. **Read the current hook** and identify the CCN 23 function (around line 150-217)

2. **Extract calculations to pure functions:**
   - Growth rate calculations
   - Performance metric calculations
   - Environmental correlations
   - Predictive insights
   - Benchmark comparisons

3. **Create utility file** `features/batch-management/utils/analyticsCalculations.ts`:
   ```typescript
   /**
    * Calculate growth rate from samples
    */
   export function calculateGrowthRate(samples: GrowthSample[]): number {
     // Pure calculation logic
   }
   
   /**
    * Calculate performance metrics
    */
   export function calculatePerformanceMetrics(data: AnalyticsData): PerformanceMetrics {
     // Pure calculation logic
   }
   ```

4. **Write comprehensive tests** (20-30 tests):
   - Test each helper function
   - Cover edge cases (null, undefined, empty arrays)
   - Test mathematical edge cases (division by zero, negative values)

5. **Refactor the hook** to use helpers:
   ```typescript
   export function useAnalyticsData(params) {
     // Data fetching only
     const growthMetrics = calculateGrowthRate(samples);
     const performanceMetrics = calculatePerformanceMetrics(data);
     // etc.
   }
   ```

6. **Verify CCN reduction:**
   ```bash
   npm run complexity:analyze
   grep "use-analytics-data" docs/metrics/frontend_lizard_latest.txt
   # Should show CCN ≤15
   ```

#### Phase 3: Optional - Refine Other Hooks (30 minutes)

**If time permits, improve:**

1. `useBatchFcr.ts` (CCN 4.3):
   - Already good, but extract any calculations
   - Ensure server-first approach
   - Add tests if missing

2. `useAreaKpi.ts` (CCN 2.8):
   - Already excellent
   - Verify it uses server-side aggregation
   - No changes likely needed

#### Phase 4: Testing & Verification (30 minutes)

1. **Run all tests:**
   ```bash
   npm run test
   # Should have 550+ tests (20-30 new)
   ```

2. **Type check:**
   ```bash
   npm run type-check
   # Should show 0 errors
   ```

3. **Complexity check:**
   ```bash
   npm run complexity:analyze
   tail -100 docs/metrics/frontend_lizard_latest.txt
   # Should show 1 warning (formatAreaKPIs only, or 0 if we fixed it)
   ```

4. **Smoke test in browser:**
   - Navigate to batch analytics page
   - Verify charts render correctly
   - Check performance metrics display
   - Ensure no console errors

### Expected Outcomes

**Metrics:**
- `use-analytics-data`: CCN 23 → ≤15 (35%+ reduction)
- New utility functions: ~100 LOC
- New tests: 20-30 for utilities
- Total tests: 550+ passing
- Complexity warnings: 2 → 1 (or 0 if we address formatAreaKPIs)

**Files Created:**
- `features/batch-management/utils/analyticsCalculations.ts` (~100 LOC)
- `features/batch-management/utils/analyticsCalculations.test.ts` (~150 LOC)

**Files Modified:**
- `hooks/use-analytics-data.ts` (refactored, CCN reduced)
- `docs/metrics/frontend_lizard_latest.txt` (updated)

## Guidelines & Standards (From Tasks 2-5)

### Production Quality Requirements
1. **No shortcuts** - UAT-ready code only
2. **Full error handling** - All edge cases covered
3. **Comprehensive tests** - Unit tests for all utilities (90%+ coverage)
4. **JSDoc comments** - Document all public APIs
5. **Type safety** - Full TypeScript coverage
6. **Pure functions** - No side effects in utilities
7. **Server-first** - Use backend aggregation where available

### Testing Standards
- **Pure functions:** 90%+ coverage
- **Edge cases:** null, undefined, empty arrays, division by zero, negative values
- **Use Vitest + React Testing Library**
- **Mock API calls** with `vi.fn()`
- **Test both success and error paths**
- **Mathematical accuracy** - Test boundary conditions

### Code Organization
- **Utils:** Pure functions, no side effects
- **Hooks:** Single responsibility, composable
- **Max function CCN:** ≤15 (preferably ≤10)
- **Max file size:** 200-300 LOC

### Commit Strategy
Follow the single-branch policy:
- Work on `feature/quality-enhancement` branch
- Commit incrementally as you complete each extraction
- Use descriptive commit messages (see Tasks 1-5 examples)
- Push when Task 6 complete

## Reference Documents

Read these for context and patterns:
1. `QUALITY_ENHANCEMENT_EXECUTION_PLAN.md` - Overall plan
2. `TASK_5_COMPLETION_REPORT.md` - Most recent success (42 tests, bug fixes)
3. `TASK_4_COMPLETION_REPORT.md` - Server-side aggregation pattern
4. `TASK_3_COMPLETION_REPORT.md` - CCN reduction pattern (18 → 4.7, 74% reduction)
5. `docs/frontend_testing_guide.md` - Testing patterns
6. `docs/code_organization_guidelines.md` - Architecture rules

## Commands

```bash
# Navigate to project
cd /Users/aquarian247/Projects/AquaMind-Frontend

# Verify branch
git branch  # Should show: feature/quality-enhancement

# Check current state
git status

# Analyze target hook
grep -A 30 "CCN.*23" docs/metrics/frontend_lizard_latest.txt

# Read the problematic function
# use-analytics-data.ts around line 150-217

# Run tests after changes
npm run test

# Run type checking
npm run type-check

# Run complexity analysis
npm run complexity:analyze
tail -100 docs/metrics/frontend_lizard_latest.txt

# Commit progress
git add -A
git commit -m "refactor(task-6): your message here"

# Push when complete
git push origin feature/quality-enhancement
```

## Success Criteria

Task 6 is complete when:
- ✅ `use-analytics-data` CCN reduced from 23 to ≤15 (35%+ reduction)
- ✅ All calculations extracted to pure helper functions
- ✅ 20-30 new tests for utility functions (550+ total)
- ✅ All tests passing (100% pass rate)
- ✅ 0 TypeScript errors
- ✅ Complexity warnings: 2 → 1 (or 0 if both addressed)
- ✅ Helper functions have 90%+ test coverage
- ✅ No breaking changes (backward compatible)
- ✅ Analytics charts still render correctly
- ✅ Documentation complete (TASK_6_COMPLETION_REPORT.md)

## Lessons Learned from Task 5

### ✅ What Worked Well

1. **Server-side filtering is crucial:**
   - Always pass filters to API (not client-side filtering)
   - Prevents "1 result per page" bugs
   - Proper cache invalidation with filters in queryKey

2. **Pagination requires explicit handling:**
   - Never assume `page: undefined` fetches all pages
   - Django defaults to 20 items per page
   - Use while loop with `response.next` check
   - Add safety limit (e.g., 20 pages max)

3. **Data format extraction is essential:**
   - Check for nested objects (e.g., `assignment.container.name` not `assignment.container`)
   - Extract simple values before using in filters or display
   - Handle both formats for robustness (nested + flat)

4. **React key uniqueness matters:**
   - Don't use just `id` if items can repeat
   - Use compound keys: `${id}-${index}` or `${id}-${uniqueField}`
   - Prevents duplicate key warnings with large datasets

5. **User testing reveals hidden bugs:**
   - Task 5 uncovered 6 production bugs
   - Test with real data volumes (170 assignments, not 5)
   - Check console logs for warnings
   - Test all filter combinations

### 🚨 Common Pitfalls to Avoid

1. **Pagination Bugs:**
   ```typescript
   // ❌ BAD: Only fetches first 20
   const response = await ApiService.apiV1Foo(undefined, undefined, undefined, page: undefined);
   
   // ✅ GOOD: Fetches all pages
   let allItems = [];
   let page = 1;
   while (hasMore) {
     const response = await ApiService.apiV1Foo(...params, page);
     allItems = [...allItems, ...response.results];
     hasMore = !!response.next;
     page++;
     if (page > 20) break; // Safety
   }
   ```

2. **Client-side filtering on paginated data:**
   ```typescript
   // ❌ BAD: Filters 20 results client-side
   const filtered = allEvents.filter(e => e.container === containerName);
   
   // ✅ GOOD: Pass filter to API
   const response = await ApiService.apiV1Foo(
     containerName: containerFilter !== "all" ? containerFilter : undefined
   );
   ```

3. **Rendering nested objects:**
   ```typescript
   // ❌ BAD: Renders [object Object]
   <div>{assignment.container}</div>
   
   // ✅ GOOD: Extract the value
   <div>{assignment.container?.name || assignment.container_name}</div>
   ```

4. **Assuming API parameter names:**
   - Always check the generated ApiService signature
   - Backend uses snake_case, frontend uses camelCase
   - Generated client handles conversion
   - Check OpenAPI spec if unsure

5. **Forgetting to add filters to queryKey:**
   ```typescript
   // ❌ BAD: Cache doesn't invalidate when filter changes
   queryKey: ["batch/events", batchId, currentPage]
   
   // ✅ GOOD: Include all params that affect results
   queryKey: ["batch/events", batchId, currentPage, dateRange, containerFilter, feedTypeFilter]
   ```

### 💡 Pro Tips

1. **Start with comprehensive debug logging:**
   - Log API parameters being sent
   - Log response structure (use `sampleItem: response.results?.[0]`)
   - Log filter values
   - Remove logs after debugging complete

2. **Extract data before using in filters:**
   ```typescript
   // Extract container names for dropdown
   const containers = response.results.map(r => {
     const fullName = r.container_name;
     // Remove location description for cleaner filter
     return fullName ? fullName.split(' (')[0].trim() : fullName;
   });
   ```

3. **Use the existing pagination pattern:**
   - Task 5 established a proven while loop pattern
   - Reuse it for consistency
   - Always add safety limit

4. **Test with real data volumes:**
   - Small test data (5 items) won't reveal pagination bugs
   - Test with 100+ items to catch edge cases
   - User testing is invaluable

5. **Follow the established patterns:**
   - Tasks 2-5 have proven patterns for extraction
   - Extract → Test → Refactor → Verify
   - Comprehensive tests before refactoring components

## Special Considerations for Task 6

### Complexity Reduction Strategy

**Pattern from Task 3 (useScenarioData CCN 18 → 4.7):**

1. **Identify nested conditionals:**
   ```typescript
   // High CCN - multiple nested if/else
   if (condition1) {
     if (condition2) {
       if (condition3) {
         // ... 
       }
     }
   }
   ```

2. **Extract to pure functions:**
   ```typescript
   // Low CCN - early returns, single responsibility
   function calculateMetric(data) {
     if (!data) return null;
     if (data.length === 0) return 0;
     return data.reduce(...);
   }
   ```

3. **Use helper composition:**
   ```typescript
   // Hook becomes simple composition
   const growthMetrics = calculateGrowthMetrics(samples);
   const performanceMetrics = calculatePerformanceMetrics(data);
   ```

### Analytics Data Hook Specifics

The problematic function (CCN 23) likely has:
- Multiple data transformations
- Conditional logic for different metric types
- Growth calculations
- Performance calculations
- Environmental correlations
- Predictive insights

**Extraction approach:**
1. Each calculation type → separate pure function
2. Each function tested independently
3. Hook becomes orchestrator, not calculator

### Testing Analytics Calculations

**Critical tests to include:**
- **Division by zero:** Growth rate with no samples
- **Null/undefined data:** Missing environmental readings
- **Empty arrays:** No growth samples, no feeding data
- **Negative values:** Biomass decrease, negative FCR
- **Large numbers:** Precision with large populations
- **Date calculations:** Time-based growth rates
- **Correlations:** Environmental impact calculations

## Reference: Task 3 CCN Reduction Example

**Before (CCN 18):**
```typescript
export function useScenarioData() {
  // 68 LOC with complex nested conditionals
  const processedData = rawData.map(item => {
    if (item.type === 'A') {
      if (item.value > 100) {
        // complex calculation
      } else {
        // other calculation
      }
    } else if (item.type === 'B') {
      // more nested logic
    }
    // ... many more conditions
  });
}
```

**After (CCN 4.7):**
```typescript
// Extracted helpers (utils/kpiCalculations.ts)
export function calculateKPIForTypeA(item) {
  if (item.value > 100) return complexCalc(item);
  return simpleCalc(item);
}

export function calculateKPIForTypeB(item) {
  // Single responsibility
}

// Simplified hook
export function useScenarioData() {
  const processedData = rawData.map(item => {
    if (item.type === 'A') return calculateKPIForTypeA(item);
    if (item.type === 'B') return calculateKPIForTypeB(item);
    return null;
  });
}
```

**Result:** 74% CCN reduction, 56 comprehensive tests

## Notes for Agent

### Critical Success Factors

1. **Follow Task 3 pattern** - CCN reduction proven successful (18 → 4.7)
2. **Extract, don't rewrite** - Keep existing logic, just move it
3. **Test first** - Write tests for extracted functions before refactoring hook
4. **Verify no regressions** - Analytics charts must still work
5. **Document edge cases** - JSDoc comments on all helpers

### What NOT to Do

❌ **Don't change calculation logic** - Just extract it  
❌ **Don't skip tests** - Every helper needs comprehensive tests  
❌ **Don't forget edge cases** - Division by zero, null, empty arrays  
❌ **Don't break backward compatibility** - Hook signature should stay same  
❌ **Don't ignore the complexity report** - Verify CCN actually reduced

### Quality Gate

Task 6 is only complete when:
- CCN warning eliminated (23 → ≤15)
- All tests passing (550+ tests)
- 0 TypeScript errors
- Analytics page works correctly in browser
- Comprehensive tests for all helpers (90%+ coverage)

## Commands Reference

```bash
# Quick workflow
cd /Users/aquarian247/Projects/AquaMind-Frontend

# 1. Analyze complexity
npm run complexity:analyze
grep -B 5 -A 10 "use-analytics-data" docs/metrics/frontend_lizard_latest.txt

# 2. Make changes, then test
npm run test
npm run type-check

# 3. Verify CCN reduction
npm run complexity:analyze
grep "use-analytics-data" docs/metrics/frontend_lizard_latest.txt

# 4. Commit and push
git add -A
git commit -m "refactor(task-6): reduce use-analytics-data CCN from 23 to X"
git push origin feature/quality-enhancement
```

## Success Pattern (From Tasks 3 & 5)

**Task 3:** CCN 18 → 4.7 (74% reduction) via helper extraction  
**Task 5:** 42 new tests, 6 bugs fixed, 56% LOC reduction  

**Apply to Task 6:**
1. Extract calculations to pure functions
2. Write comprehensive tests (20-30 tests)
3. Refactor hook to use helpers
4. Verify CCN reduction (target: ≤15)
5. Ensure analytics charts still work
6. Document and push

Good luck! Task 6 follows proven patterns from Tasks 3 & 5. Focus on extracting calculations to pure, testable functions and the CCN will naturally reduce.



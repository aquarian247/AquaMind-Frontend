# Task 6 Agent Prompt - Aggregation Hooks Refactoring

**Copy this prompt to start Task 6:**

---

**Context:** You're continuing the Quality Enhancement project for AquaMind Frontend. Tasks 0-5 are complete with outstanding results (523 tests passing, 5 major pages/components decomposed, 6 critical bugs fixed). You're now tackling Task 6.

**Your Mission:** Reduce cyclomatic complexity in `use-analytics-data.ts` (CCN 23 → ≤15) by extracting calculation logic into pure, testable helper functions.

**Quick Start:**
```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend
git checkout feature/quality-enhancement
git pull origin feature/quality-enhancement

# Read these files for full context:
@TASK_6_HANDOFF.md (complete Task 6 plan with lessons learned)
@TASK_5_COMPLETION_REPORT.md (most recent success - 42 tests, 6 bugs fixed)
@TASK_3_COMPLETION_REPORT.md (CCN reduction pattern - 18→4.7, 74% reduction)
@QUALITY_ENHANCEMENT_EXECUTION_PLAN.md (overall plan)
```

**Task 6 Objectives:**
1. **Reduce CCN in use-analytics-data.ts** - From 23 to ≤15 (35%+ reduction)
   - Target: Anonymous function at lines 150-217 (current CCN 23)
   - Extract calculation logic to pure helper functions
   - Follow Task 3 pattern (successfully reduced CCN 18 → 4.7)
   
2. **Create testable utility module** - Extract analytics calculations
   - Create: `features/batch-management/utils/analyticsCalculations.ts`
   - Extract: Growth rate, performance metrics, environmental correlations
   - Pattern: Pure functions with single responsibility
   
3. **Comprehensive test coverage** - 20-30 new tests for utilities
   - Create: `features/batch-management/utils/analyticsCalculations.test.ts`
   - Test: All edge cases (null, undefined, empty, division by zero)
   - Target: 90%+ coverage on new utilities

**Success Criteria:**
- ✅ CCN reduced from 23 to ≤15 (verified with `npm run complexity:analyze`)
- ✅ All tests passing (550+ expected, 20-30 new)
- ✅ 0 TypeScript errors
- ✅ Complexity warnings: 2 → 1 (eliminate use-analytics-data warning)
- ✅ Utility functions have 90%+ test coverage
- ✅ Analytics page works correctly (smoke test in browser)
- ✅ No breaking changes (backward compatible)
- ✅ Production-quality code (no shortcuts - UAT imminent)

**Proven Pattern from Task 3:**
Task 3 successfully reduced `useScenarioData` from CCN 18 → 4.7 (74% reduction) by:
1. Extracting 10 calculation functions to `kpiCalculations.ts`
2. Writing 56 comprehensive tests
3. Refactoring hook to simple composition
4. Result: CCN warning eliminated, tests 100% passing

**Key Strategy:**
- **Extract, don't rewrite** - Move existing logic to pure functions
- **Test first** - Write tests for helpers before refactoring hook
- **Single responsibility** - Each helper does ONE calculation
- **Early returns** - Reduce nesting with guard clauses
- **Verify in browser** - Analytics charts must still render

**Critical Files to Read:**
1. `client/src/hooks/use-analytics-data.ts` - The target file (318 LOC, CCN 23)
2. `client/src/features/scenario/utils/kpiCalculations.ts` - Reference pattern
3. `client/src/features/scenario/utils/kpiCalculations.test.ts` - Test pattern (56 tests)
4. `TASK_3_COMPLETION_REPORT.md` - Detailed CCN reduction approach

**Lessons from Task 5 (Critical!):**

**🚨 Pagination is a silent killer:**
- Django defaults to 20 items per page
- `page: undefined` does NOT fetch all pages
- Always use while loop with `response.next` check
- Add safety limit (20 pages max = 400 items)

**🚨 Server-side filtering prevents bugs:**
- Never filter paginated data client-side
- Pass filters to API as parameters
- Add filters to queryKey for cache invalidation
- Example: Container filter with 170 assignments only worked after server-side filtering

**🚨 Extract nested object values:**
- API often returns nested objects (e.g., `{container: {id: 1, name: "Ring-1"}}`)
- Extract before using: `assignment.container?.name`
- Handle both nested and flat formats for robustness

**✅ Debug logging is your friend:**
- Log API parameters being sent
- Log response structure with sample item
- Log filter values and results
- Remove logs after debugging

**✅ User testing reveals real bugs:**
- Task 5 found 6 production bugs during testing
- Test with real data volumes (not toy data)
- Check all filter combinations
- Monitor console for warnings

**Commands for Task 6:**
```bash
# 1. Check current complexity
npm run complexity:analyze
grep -B 5 -A 10 "CCN.*23" docs/metrics/frontend_lizard_latest.txt

# 2. Read the problematic function
# Look at use-analytics-data.ts around line 150-217

# 3. After extraction, verify
npm run test  # Should have 550+ tests
npm run type-check  # Should be 0 errors
npm run complexity:analyze
grep "use-analytics-data" docs/metrics/frontend_lizard_latest.txt  # Should show CCN ≤15

# 4. Smoke test
npm run dev  # Test analytics page in browser

# 5. Commit and push
git add -A
git commit -m "refactor(task-6): reduce use-analytics-data CCN from 23 to X"
git push origin feature/quality-enhancement
```

**Production Standards:** This is UAT-ready code. Full error handling, comprehensive tests, type safety, documentation. No shortcuts.

**Expected Duration:** 2-3 hours
- Assessment: 15 min
- Extract helpers: 1 hour
- Write tests: 1 hour
- Refactor hook: 30 min
- Verify & document: 30 min

Let's eliminate that CCN 23 warning! 🚀

---

## Additional Context from Task 5

### Bug Fixes That Will Help You

Task 5 fixed several critical bugs in the codebase:

1. **Date range filtering** - Now working in feed history
2. **Container filtering** - Now server-side with proper pagination
3. **Batch assignments pagination** - Fixed in `lib/api.ts` `getAssignments()`
4. **UI consistency** - Batch-details now matches area-details design

**If you encounter similar issues:**
- Check if pagination is involved (likely needs while loop)
- Check if filtering is server-side (add to API params)
- Check for nested objects (extract values before using)
- Check React keys (use compound keys for duplicates)

### Files Modified in Task 5 (FYI)

These files now have improved patterns you can reference:
- `hooks/useBatchFeedHistoryData.ts` - Server-side filtering + pagination
- `features/batch-management/utils/feedHistoryHelpers.ts` - 9 pure functions, 42 tests
- `lib/api.ts` - Fixed `getAssignments()` pagination bug
- `pages/batch-details.tsx` - UI aligned with area-details

**Pattern:** Extract → Test → Refactor → Verify

Good luck with Task 6! 🎯


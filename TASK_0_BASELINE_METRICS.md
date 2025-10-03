# Task 0 – Baseline Metrics Report
**Date:** October 3, 2025  
**Branch:** `feature/quality-enhancement`

## Environment Status

### TypeScript Type Checking
- **Status:** ✅ PASS
- **Errors:** 0
- **Command:** `npm run type-check`

### Test Suite
- **Status:** ✅ PASS
- **Test Files:** 36 passed
- **Tests:** 369 passed | 7 skipped (376 total)
- **Duration:** 3.20s
- **Command:** `npm run test`
- **Note:** One modified file detected: `client/src/features/broodstock/hooks/useBroodstockKPIs.ts`

### Linting
- **Status:** N/A
- **Note:** No `npm run lint` script exists in package.json. Project relies on `type-check` for quality gates.

## Complexity Metrics (Lizard Analysis)

### Summary Statistics
- **Total NLOC:** 7,447
- **Average NLOC per function:** 5.9
- **Average CCN:** 1.6
- **Average tokens:** 35.1
- **Function count:** 742
- **Warning count:** 2

### ⚠️ High Complexity Warnings (CCN > 15)
1. **`useScenarioData.ts`** (anonymous function)
   - Lines: 83-130
   - NLOC: 38
   - CCN: **18** ⚠️
   - Length: 48
   - Location: `client/src/features/scenario/hooks/useScenarioData.ts`

2. **`use-analytics-data.ts`** (anonymous function)
   - Lines: 150-217
   - NLOC: 45
   - CCN: **23** ⚠️
   - Length: 68
   - Location: `client/src/hooks/use-analytics-data.ts`

### High-Risk Files (High Complexity/Size)

#### Hooks with High Average CCN
- `client/src/hooks/aggregations/useAreaKpi.ts` - Avg CCN: **11.7**, NLOC: 71
- `client/src/hooks/use-analytics-data.ts` - Avg CCN: **10.8**, NLOC: 318
- `client/src/hooks/aggregations/useBatchFcr.ts` - Avg CCN: **8.2**, NLOC: 101

#### Large Files (>300 NLOC)
- `client/src/lib/api.ts` - **955 NLOC**, Avg CCN: 4.4
- `client/src/features/audit-trail/api/api.ts` - **643 NLOC**, Avg CCN: 9.7
- `client/src/hooks/use-fcr-analytics.ts` - **408 NLOC**, Avg CCN: 5.4
- `client/src/lib/api.test.ts` - **354 NLOC** (test file)
- `client/src/hooks/use-analytics-data.ts` - **318 NLOC**, Avg CCN: 10.8

#### Components/Pages Needing Review
- `client/src/components/ui/sidebar.tsx` - **525 NLOC**, Avg CCN: 3.2
- `client/src/components/batch-management/BatchAnalyticsView.tsx` - **461 NLOC**, Avg CCN: 4.6
- `client/src/pages/batch-management.tsx` - **372 NLOC**, Avg CCN: 5.7
- `client/src/components/batch-management/BatchFeedHistoryView.tsx` - **397 NLOC**, Avg CCN: 6.5
- `client/src/pages/ScenarioPlanning.tsx` - **325 NLOC**, Avg CCN: 5.9
- `client/src/pages/area-detail.tsx` - **325 NLOC**, Avg CCN: 6.1

### Files with High Format Complexity
- `client/src/lib/formatFallback.ts` - NLOC: 99, Avg CCN: **8.9**
- `client/src/lib/config.ts` - NLOC: 94, Avg CCN: **6.0**

## Quality Gate Targets

Based on project guidelines and CI_METRICS_THRESHOLDS.md from backend:

### File Size Limits
- **Components:** ≤ 300 LOC
- **Hooks:** ≤ 150 LOC
- **Pages (feature shells):** ≤ 150 LOC
- **Utils/Helpers:** ≤ 200 LOC

### Complexity Limits
- **Cyclomatic Complexity per function:** ≤ 15
- **Target CCN for hooks:** ≤ 12 (batch), ≤ 8 (area)

## Remediation Priorities (Aligned with Execution Plan)

### Task 2: Batch Management Decomposition
- `pages/batch-management.tsx` - **372 LOC** → Target: **≤150 LOC**
- `BatchAnalyticsView.tsx` - **461 LOC** → Target: **≤300 LOC**
- `BatchFeedHistoryView.tsx` - **397 LOC** → Target: **≤300 LOC**

### Task 3: Scenario Planning Decomposition
- `pages/ScenarioPlanning.tsx` - **325 LOC** → Target: **≤150 LOC**
- `features/scenario/hooks/useScenarioData.ts` - **CCN 18** → Target: **≤15**

### Task 4: Area Detail Decomposition
- `pages/area-detail.tsx` - **325 LOC** → Target: **≤150 LOC**
- `hooks/aggregations/useAreaKpi.ts` - **CCN 11.7** → Target: **≤8**

### Task 5: Shared Component Remediation
- `components/ui/sidebar.tsx` - **525 LOC** → Target: **≤300 LOC**

### Task 6: Aggregation Hook Refactoring
- `hooks/use-analytics-data.ts` - **CCN 23 + 318 LOC** → Target: **CCN ≤15, ≤200 LOC**
- `hooks/aggregations/useBatchFcr.ts` - **CCN 8.2** → Target: **≤12** ✅ (acceptable)
- `hooks/aggregations/useAreaKpi.ts` - **CCN 11.7** → Target: **≤8**

## Notes

1. **No ESLint script** - Project uses TypeScript strict mode for quality enforcement
2. **Strong test foundation** - 369 passing tests provide good refactoring safety net
3. **Two critical complexity violations** - Both will be addressed in Tasks 3 and 6
4. **Multiple oversized files** - 6 files exceed target LOC thresholds
5. **Full complexity report saved** to `docs/metrics/frontend_lizard_latest.txt`

## Next Steps

Proceed to **Task 1: Centralize API Usage & Dynamic Filter Sources** with confidence that:
- All tests pass
- Type checking is clean
- Baseline metrics are documented
- Problem areas are identified and prioritized


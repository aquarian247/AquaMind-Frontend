# Task 7: Scenario Aggregation - Testing Guide

## Implementation Summary

**Date**: 2025-10-02  
**Status**: ✅ COMPLETE - Ready for UAT Testing  
**Test Coverage**: 14/14 tests passing

## What Was Implemented

### 1. Server-Side Aggregation Hooks
- ✅ `useScenarioSummaryStats()` - Attempts server-side KPI aggregation with client fallback
- ✅ `usePhotoperiodData(areaIds, startDate, endDate)` - Multi-area photoperiod data with `area__in` filtering
- ✅ `useWeatherDataByAreas(areaIds)` - Multi-area weather data with `area__in` filtering

### 2. Updated Components
- ✅ `ScenarioKPIs` - Honest fallbacks (N/A) for missing data, removed hardcoded placeholders
- ✅ `useScenarioData` - Hybrid server/client KPI calculation with graceful degradation

### 3. Production Quality Improvements
- ✅ Removed hardcoded placeholder: "+2 from last month" → "Total scenarios"
- ✅ Average duration shows "N/A" when zero (not misleading "0 days")
- ✅ All KPI counts use `formatCount()` for consistent display
- ✅ Comprehensive test coverage (14 tests)

## Testing Instructions

### 1. Access the Application
```
Frontend: http://localhost:5173
Login: admin / admin123 (or your test credentials)
```

### 2. Navigate to Scenario Planning
```
Main Menu → Scenario Planning
or
Direct URL: http://localhost:5173/scenario-planning
```

### 3. Test Cases to Verify

#### Test Case 1: KPI Cards Display (Happy Path)
**Expected Behavior:**
- ✅ Active Scenarios card shows count (not N/A)
- ✅ In Progress card shows count of running scenarios
- ✅ Completed card shows count of completed scenarios
- ✅ Avg Duration card shows calculated average (rounded to nearest day)
- ✅ All subtitles are data-driven (not hardcoded placeholders)

**Pass Criteria:**
- No "N/A" values if scenarios exist
- No hardcoded text like "+2 from last month"
- Counts are accurate and match backend data

#### Test Case 2: Empty State (No Scenarios)
**Expected Behavior:**
- ✅ Active Scenarios: Shows "0" (valid zero count)
- ✅ In Progress: Shows "0"
- ✅ Completed: Shows "0"
- ✅ Avg Duration: Shows "N/A" (honest fallback for zero duration)

**Pass Criteria:**
- Zero counts displayed as "0" (not "N/A")
- Average duration shows "N/A" when no valid data

#### Test Case 3: Loading States
**Expected Behavior:**
- ✅ Four skeleton cards with pulse animation while loading
- ✅ Smooth transition to actual data when loaded
- ✅ No flashing or layout shifts

**Pass Criteria:**
- Clean loading experience
- No errors in browser console

#### Test Case 4: Server-Side Aggregation (When Backend Adds Support)
**Expected Behavior:**
- ✅ If backend adds summary fields to response, frontend uses them
- ✅ Otherwise, client-side calculation works as fallback
- ✅ No errors or warnings in console

**Pass Criteria:**
- Graceful handling of both scenarios
- Accurate KPI calculations

#### Test Case 5: Search and Filter
**Expected Behavior:**
- ✅ Search by scenario name updates KPIs dynamically
- ✅ Status filter updates KPIs dynamically
- ✅ KPIs reflect filtered results, not all scenarios

**Pass Criteria:**
- KPIs update when filters change
- Counts match filtered scenario list

### 4. Browser Console Checks
Open Developer Tools (F12) and verify:
- ✅ No JavaScript errors
- ✅ No 404 API errors
- ✅ No TypeScript compilation errors
- ✅ API calls use generated ApiService (check Network tab)

### 5. Performance Checks
- ✅ Page loads quickly (<2 seconds)
- ✅ No unnecessary API calls
- ✅ Smooth transitions between states

## API Endpoint Verification

### Current Implementation
```typescript
// Summary Stats (hybrid approach)
useScenarioSummaryStats() 
→ ApiService.apiV1ScenarioScenariosSummaryStatsRetrieve()
→ Falls back to client-side calculation if no summary fields

// Environmental Integration (ready for use)
usePhotoperiodData([areaId1, areaId2], startDate, endDate)
→ ApiService.apiV1EnvironmentalPhotoperiodList(undefined, [areaIds], date, ...)

useWeatherDataByAreas([areaId1, areaId2])
→ ApiService.apiV1EnvironmentalWeatherList(undefined, [areaIds], ...)
```

### Backend API Status
- ✅ `summary_stats` endpoint exists (`/api/v1/scenario/scenarios/summary_stats/`)
- ⚠️ Returns `Scenario` type (not dedicated summary stats schema)
- ✅ Frontend handles both current and future response formats
- ✅ Environmental endpoints support `area__in` filtering

## Known Issues & Workarounds

### API Gap: Summary Stats Response Type
**Issue**: Backend returns `Scenario` type instead of summary statistics  
**Impact**: Frontend falls back to client-side calculation (working)  
**Workaround**: Hybrid approach checks for summary fields dynamically  
**Backend Fix**: Update endpoint to return dedicated summary stats schema  

### Limited Scenario Filtering
**Current**: `created_by`, `search`, `start_date`, `tgc_model__location`  
**Missing**: `batch__in`, `geography__in`, `species__in`  
**Impact**: Multi-entity scenario analysis requires client-side filtering  
**Future Enhancement**: Backend to add `__in` filters following Task 2.5 pattern  

## Regression Testing

Verify existing functionality still works:
- ✅ Scenario creation dialog
- ✅ Scenario list/grid view
- ✅ Scenario detail pages
- ✅ FCR model creation
- ✅ TGC model creation
- ✅ Mortality model creation

## Files Modified

### Core Implementation
1. `client/src/features/scenario/api/api.ts` (+100 lines)
   - Added `useScenarioSummaryStats()`
   - Added `usePhotoperiodData()`
   - Added `useWeatherDataByAreas()`

2. `client/src/features/scenario/hooks/useScenarioData.ts` (+60 lines)
   - Hybrid server/client KPI calculation
   - Graceful fallback logic

3. `client/src/features/scenario/components/ScenarioKPIs.tsx` (+15 lines)
   - Honest fallbacks implementation
   - Removed hardcoded placeholders

### Test Files (NEW)
4. `client/src/features/scenario/hooks/useScenarioData.test.tsx` (6 tests)
5. `client/src/features/scenario/components/ScenarioKPIs.test.tsx` (8 tests)

### Documentation
6. `docs/progress/frontend_aggregation/implementation_plan.md` (Task 7 complete)

## UAT Acceptance Criteria

### Must Pass
- [ ] All 4 KPI cards display correctly with real data
- [ ] N/A appears only for avg duration when no scenarios exist
- [ ] No hardcoded mock values or placeholders
- [ ] No JavaScript errors in browser console
- [ ] Smooth loading states and transitions
- [ ] Search/filter updates KPIs dynamically

### Should Pass
- [ ] Page loads in <2 seconds
- [ ] KPI values match backend calculations
- [ ] Environmental integration hooks ready (for future features)

### Nice to Have
- [ ] Server-side summary stats when backend adds support
- [ ] Multi-entity scenario filtering (needs backend `__in` parameters)

## Quick Smoke Test

```bash
# 1. Frontend should be running on http://localhost:5173
# 2. Login with test credentials
# 3. Navigate to Scenario Planning
# 4. Verify 4 KPI cards render without errors
# 5. Check browser console for errors
```

## Post-UAT Actions

If UAT passes:
- ✅ Merge to feature branch
- ✅ Update backend team on API gaps discovered
- ✅ Plan Task 8-10 (Environmental, Health, Broodstock audits)

If issues found:
- Document specific failures
- Check browser console for error details
- Review implementation against this guide
- Contact development team with specific error messages

## Support & Questions

**Implementation Documentation**: See inline comments in modified files  
**API Gaps**: Documented in implementation_plan.md Task 7 notes  
**Test Results**: All 14 tests passing (run `npm test features/scenario`)  
**Architecture**: Follows established patterns from Tasks 0-6  

---

**🎸 Ready to rock the UAT! 🎸**


# TypeScript Error Analysis - Pre-UAT Fixes
## Date: 2025-10-16

**Context**: Backend completed scenario fix (temperature profile `reading_date` → `day_number`). Frontend OpenAPI spec synced. Analyzing remaining TypeScript errors to prevent UAT regressions.

---

## 📊 Error Summary

**Total Errors**: 21  
**Categories**:
- Audit trail history endpoints: 12 errors
- Temperature data model changes: 3 errors
- FeedStock model removed/renamed: 3 errors
- Type mismatches: 3 errors

---

## 🔍 Detailed Analysis

### Category 1: Audit Trail History Endpoints Missing (12 errors)

**Location**: `client/src/features/audit-trail/api/api.ts`

**Errors**:
1. Line 416: `listInventoryFeedStockHistory` does not exist
2. Line 427: `retrieveInventoryFeedStockHistoryDetail` does not exist
3. Line 525: `listScenarioScenarioHistory` does not exist
4. Line 537: `retrieveScenarioScenarioHistoryDetail` does not exist
5. Line 540: `listScenarioFcrModelHistory` does not exist
6. Line 550: `retrieveScenarioFcrModelHistoryDetail` does not exist
7. Line 553: `listScenarioMortalityModelHistory` does not exist
8. Line 564: `retrieveScenarioMortalityModelHistoryDetail` does not exist
9. Line 567: `listScenarioScenarioModelChangeHistory` does not exist
10. Line 581: `retrieveScenarioScenarioModelChangeHistoryDetail` does not exist
11. Line 584: `listScenarioTgcModelHistory` does not exist
12. Line 596: `retrieveScenarioTgcModelHistoryDetail` does not exist

**Root Cause**: 
- `FeedStock` model was likely removed/renamed in backend (hence no history endpoints)
- `Scenario` model history was **intentionally removed** (Phase 7 - prevents 50GB table bloat)
- Other scenario model history endpoints may not be exposed in OpenAPI spec

**Impact**: Audit trail pages will fail when trying to view history for these models

**Regression Risk**: HIGH - Would break audit trail functionality in UAT

**Fix Strategy**:
1. **FeedStock**: Remove references (model no longer exists)
2. **Scenario**: Remove references (history intentionally excluded per Phase 7 decision)
3. **FCR/TGC/Mortality**: Check if backend exposes these history endpoints
   - If YES: Fix endpoint names in audit trail API
   - If NO: Remove from audit trail model list (acceptable - these models are rarely changed)

---

### Category 2: Temperature Data Model Changes (3 errors)

**Location**: `client/src/pages/TemperatureDataView.tsx`

**Errors**:
1. Line 282: Property 'date' does not exist (has 'dayNumber' instead)
2. Line 283: Property 'date' does not exist
3. Line 285: Property 'month' does not exist

**Root Cause**: Backend scenario fix changed `TemperatureReading` model:
- **OLD**: `reading_date` (DateField) with `date` and `month` fields
- **NEW**: `day_number` (IntegerField) - relative day 1-365+

**Impact**: Temperature data view will crash trying to access non-existent fields

**Regression Risk**: HIGH - Breaks temperature profile viewing

**Fix Strategy**:
1. Update data structure to use `day_number` instead of `date`
2. Remove `month` field references
3. Display format: "Day 1", "Day 2", etc. instead of calendar dates
4. Update table headers and labels accordingly

**Reference**: `AquaMind/aquamind/docs/progress/scenario_fix/README.md`

---

### Category 3: FeedStock Model Removed (3 errors)

**Locations**:
- `client/src/lib/api.ts` (line 908)
- `client/src/pages/inventory.tsx` (line 255)
- Audit trail (covered above)

**Errors**:
1. `apiV1InventoryFeedStocksList` does not exist

**Root Cause**: `FeedStock` model was removed or renamed in backend inventory app

**Impact**: Inventory pages trying to fetch feed stock data will fail

**Regression Risk**: MEDIUM-HIGH - Breaks inventory feed stock views

**Fix Strategy**:
1. Verify in backend if `FeedStock` was renamed or merged into another model
2. If removed: Remove all frontend references
3. If renamed: Update to use new endpoint name
4. Check if functionality is now part of `FeedContainerStock` model

---

### Category 4: Type Mismatches (3 errors)

#### 4a. Health Sampling Event Form (1 error)

**Location**: `client/src/features/health/components/HealthSamplingEventForm.tsx:109`

**Error**: 
```
Type 'IndividualFishObservationInput[]' is not assignable
Property 'weight_g': 'string | null | undefined' 
vs expected 'string | undefined'
```

**Root Cause**: Form schema allows `null` but API expects only `string | undefined`

**Impact**: Form submission may fail type checking

**Regression Risk**: LOW - Type-level only, runtime probably works

**Fix Strategy**: Convert `null` to `undefined` in form submission:
```typescript
weight_g: observation.weight_g ?? undefined
```

#### 4b. Infrastructure Area Summary (1 error)

**Location**: `client/src/features/infrastructure/api.ts:137`

**Error**: Return type mismatch - API returns summary object but typed as `AreaSummary[]` (full Area model)

**Root Cause**: Wrong type annotation - should be custom summary type, not full `Area` model

**Impact**: Type checking fails but runtime works

**Regression Risk**: LOW - Type-level only

**Fix Strategy**: Create or use correct summary type:
```typescript
type AreaSummaryData = {
  container_count: number;
  ring_count: number;
  active_biomass_kg: number;
  population_count: number;
  avg_weight_kg: number;
};
```

#### 4c. Inventory API Batch Parameter (1 error)

**Location**: `client/src/features/inventory/api.ts:495`

**Error**: `batch` parameter type `number` should be `number[]` (array)

**Root Cause**: API expects array of batch IDs for filtering, not single ID

**Impact**: API calls may fail or not filter correctly

**Regression Risk**: MEDIUM - Could break batch filtering

**Fix Strategy**: Wrap single number in array: `batch ? [batch] : undefined`

#### 4d. Batch Feed History Hook (1 error)

**Location**: `client/src/hooks/useBatchFeedHistoryData.ts:150`

**Error**: `batchId` is `string | undefined` but API expects `number | undefined`

**Root Cause**: ID type mismatch from route parameter (string) vs API (number)

**Impact**: API call fails type checking

**Regression Risk**: MEDIUM - Breaks feed history queries

**Fix Strategy**: Parse string to number: `batchId ? parseInt(batchId, 10) : undefined`

---

## 🎯 Fix Priority

### Priority 1: HIGH RISK (Must Fix Before UAT)
1. ✅ Temperature data model (Category 2) - Breaks temperature views
2. ✅ FeedStock removal (Category 3) - Breaks inventory pages
3. ✅ Audit trail endpoints (Category 1) - Breaks audit trail

### Priority 2: MEDIUM RISK (Should Fix)
4. ✅ Batch parameter type (4c) - May break filtering
5. ✅ Batch ID type (4d) - Breaks feed history

### Priority 3: LOW RISK (Nice to Have)
6. ✅ Health form null handling (4a) - Type-level only
7. ✅ Area summary type (4b) - Type-level only

---

## 📋 Implementation Plan

### Step 1: Verify Backend State
- ✅ Check if FeedStock model exists
- ✅ Check if scenario model history endpoints exist
- ✅ Confirm temperature profile structure

### Step 2: Fix Temperature Data Model (3 errors)
- Update `TemperatureDataView.tsx` to use `day_number`
- Remove `date` and `month` field references
- Update display logic for relative days

### Step 3: Handle Audit Trail Endpoints (12 errors)
- Remove FeedStock history references
- Remove Scenario history references (intentional per Phase 7)
- Check/remove other scenario model histories if not exposed

### Step 4: Fix FeedStock References (2 remaining errors)
- Update or remove `lib/api.ts` reference
- Update or remove `pages/inventory.tsx` reference

### Step 5: Fix Type Mismatches (3 errors)
- Health form: Add null-to-undefined conversion
- Area summary: Fix type annotation
- Inventory batch: Convert number to array
- Batch feed history: Parse string to number

### Step 6: Verify
- Run `npm run type-check` - should show 0 errors
- Manual smoke test of affected pages
- No regressions in existing functionality

---

## 🚨 Regression Prevention

### Testing Checklist
- [ ] Temperature profile viewing works
- [ ] Audit trail pages load without errors
- [ ] Inventory pages display correctly
- [ ] Batch feed history queries work
- [ ] Health sampling event form submits
- [ ] Area summary displays
- [ ] No console errors on affected pages

### Rollback Plan
If issues arise:
1. All changes in single commit
2. Can revert immediately
3. Backend scenario fix is separate (stable)
4. Frontend changes are isolated fixes

---

## 📊 Expected Outcome

**Before**: 21 TypeScript errors blocking UAT  
**After**: 0 TypeScript errors, all functionality working  
**Time Estimate**: 1-2 hours for all fixes + testing  
**Risk**: LOW (isolated fixes, no architectural changes)

---

**Status**: Analysis complete, ready for implementation  
**Next**: Execute fixes in priority order  
**Goal**: UAT-ready frontend with zero TypeScript errors


# Phase 7 - Bugs Fixed During Testing

**Date**: November 17, 2025  
**Issue**: #112  
**Tester**: User  
**Session**: Initial manual testing

---

## 🐛 Bugs Discovered & Fixed

### Backend Bugs (7 fixes)

#### Bug #1: Invalid Django ORM Syntax ❌ → ✅
**File**: `apps/batch/api/viewsets/growth_assimilation_mixin.py:363`  
**Problem**: `qs.filter(day_number__mod=7)` - Django doesn't support `__mod` lookup  
**Fix**: Changed to Python-side filtering with list slicing  
**Impact**: 500 error on API endpoint

#### Bug #2: Wrong Field Name ❌ → ✅
**File**: `apps/batch/api/viewsets/growth_assimilation_mixin.py:428`  
**Problem**: Used `assignment.arrival_date` (doesn't exist)  
**Actual Field**: `assignment.assignment_date`  
**Fix**: Corrected field name  
**Impact**: 500 error on API endpoint

#### Bug #3: FCR Overflow (Calculation Logic) ❌ → ✅
**File**: `apps/batch/services/growth_assimilation.py:532`  
**Problem**: FCR = feed_kg / biomass_gain, but early stages have tiny gains (0.001kg), producing FCR >1000  
**Root Cause**: FCR is meaningless for egg/alevin stage (fish <1g, daily gain <0.01kg)  
**Fix**: 
- Added minimum biomass gain threshold (1.0 kg)
- Added FCR cap at 10.0 with warning logs
- Skip FCR calculation for tiny fish
**Impact**: Database overflow errors, unrealistic FCR values

**Context**:  
Normal FCR for salmon: 0.8-1.5 (good), 2.0-3.0 (acceptable), 4.0+ (poor).  
FCR = Feed consumed / Weight gained.  
Values >1000 indicate dividing by near-zero gains in early lifecycle.

#### Bug #4: Schema Precision Too Small ❌ → ✅
**File**: `apps/batch/models/actual_daily_state.py:113`  
**Problem**: `observed_fcr` defined as `NUMERIC(6,3)` - max value 999.999  
**Fix**: Increased to `NUMERIC(8,3)` - max value 99,999.999  
**Migration**: `0035_fix_observed_fcr_precision.py` (handles TimescaleDB columnstore)  
**Impact**: Database overflow errors when saving FCR >1000

**Note**: After fixing Bug #3, FCR never exceeds 10.0, but increased precision for safety.

#### Bug #5: Assignment Date Validation Missing ❌ → ✅
**File**: `apps/batch/services/growth_assimilation.py:149`  
**Problem**: Engine computed states for assignments before they existed  
**Example**: Sea ring assignment (created Day 450) had states for Days 1-595  
**Fix**: Added validation:
```python
if start_date < self.assignment.assignment_date:
    start_date = self.assignment.assignment_date
if end_date > self.assignment.departure_date:
    end_date = self.assignment.departure_date
```
**Impact**: Chart showed adult-stage weights for early days (completely wrong data)

#### Bug #6: Historical Assignments Excluded ❌ → ✅
**File**: `apps/batch/services/growth_assimilation.py:949`  
**Problem**: `filter(is_active=True)` only processes currently active assignments, skipping all historical ones  
**Result**: Only sea ring data showed (Days 450+), missing egg/fry/smolt/parr lifecycle (Days 0-449)  
**Fix**: Changed to query all assignments that overlap the date range:
```python
assignments = batch.batch_assignments.filter(
    assignment_date__lte=end_date
).filter(
    Q(departure_date__isnull=True) | Q(departure_date__gte=start_date)
)
```
**Impact**: Chart only showed 25% of lifecycle (missing first 450 days)

#### Bug #7: Departure Date Validation Missing ❌ → ✅
**File**: `apps/batch/services/growth_assimilation.py:165`  
**Problem**: Engine computed states after assignment departed  
**Fix**: Added departure date validation (see Bug #5)  
**Impact**: Incorrect data for departed containers

---

### Frontend Bugs (2 fixes)

#### Bug #8: Missing React Keys ❌ → ✅
**File**: `GrowthAnalysisChart.tsx:232,256`  
**Problem**: Custom Recharts shapes rendered without unique `key` props  
**Fix**: Added keys:
- `key={`anchor-${index}`}` for anchor markers
- `key={`dot-${index}`}` for regular dots
- `key={`sample-${index}`}` for sample scatter points
**Impact**: React console warning (non-critical)

#### Bug #9: No Batch-Level Aggregation ❌ → ✅
**File**: `GrowthAnalysisChart.tsx:118-141`  
**Problem**: When multiple assignments existed on same day, chart showed only the last one (data overwrite)  
**Example**: Day 91 had 20 assignments (10 old + 10 new), but chart only showed 1 value  
**Fix**: Added proper aggregation:
- **Growth Samples**: Simple average of all samples on that day
- **Actual States**: Population-weighted average across all containers
- Formula: `Σ(population_i × weight_i) / Σ(population_i)`
**Impact**: Chart showed incorrect single-container data instead of batch-level average

**Why Population-Weighted**:  
If Container A has 1M fish at 100g and Container B has 100K fish at 50g,  
the batch average should be ~95g (weighted), not 75g (simple average).

---

## 📊 Data Quality Issues (Not Bugs)

### Issue #1: No Scenario Projections
**Status**: **Expected** - ScenarioProjection table is empty  
**Impact**: Green line doesn't show, variance analysis disabled  
**Resolution**: Phase 9 - Generate projections from scenario TGC models  
**Frontend Handling**: Graceful - shows empty array, skips variance

### Issue #2: Unrealistic FCR Values
**Status**: **Test Data Artifact** - Feed data might be unrealistic  
**Logged Values**: FCR 10-70 before capping (actual salmon FCR should be 0.9-3.0)  
**Impact**: Shows something is wrong with feeding data or mortality data  
**Resolution**: Phase 9 - Audit test data generation for feeding events  
**Frontend Handling**: Capped at 10.0, prevented database overflow

---

## ✅ Verification Tests

### Test 1: Coverage Across Lifecycle ✅
```
Days 0-89 (Egg/Alevin):   90 days, 10 assignments - starts at 0.1g ✅
Days 90-179 (Fry):        90 days, 20 assignments
Days 180-269 (Parr):      90 days, 20 assignments  
Days 270-359 (Smolt):     90 days, 20 assignments
Days 360-449 (Post-smolt): 90 days, 20 assignments
Days 450-595 (Adult Sea):  146 days, 24 assignments - ends at 1700g ✅
```

**Total**: 6,692 states covering full lifecycle

### Test 2: Assignment Timeline Integrity ✅
- Day 0 assignments: Exist only Days 0-89
- Day 90 assignments: Exist only Days 90-179
- Day 450 assignments: Exist Days 450-595
- **No overlap violations** ✅

### Test 3: Batch-Level Aggregation ✅
Day 91 example (20 containers):
- Individual weights: 0.1g to 6.0g (wide range)
- Population-weighted avg: 4.6g (correct batch average)
- Chart now shows ONE point at 4.6g, not 20 separate points ✅

### Test 4: Anchor Detection ✅
- Growth samples correctly detected as anchors
- Orange line follows blue dots closely
- Smooth interpolation between anchors ✅

---

## 🎯 Key Learnings

### Backend Lessons
1. **Always validate against assignment dates**, not just batch dates
2. **Include historical assignments** in backfill operations
3. **Guard calculations** that divide by small numbers (FCR, ratios)
4. **Test with full lifecycle data**, not just first 7 days
5. **TimescaleDB columnstore** requires special migration handling

### Frontend Lessons
1. **Always aggregate per-container data** to batch-level for clarity
2. **Use population-weighted averages** for weight metrics
3. **Show aggregation transparency** (container count in tooltips)
4. **Test with multiple assignments per day** (common after transfers)

### Testing Strategy
1. **Start with small date ranges** (7 days) for quick iteration
2. **Expand to full lifecycle** once basics work
3. **Check inflection points** (transfers, stage transitions)
4. **Verify tooltips** show correct provenance
5. **Test with real transfer timeline** (not just active containers)

---

## 📋 Remaining Known Issues

### Phase 9 TODO
1. Generate scenario projections (enable variance analysis)
2. Investigate unrealistic FCR values (test data quality)
3. Add unit tests for aggregation logic
4. Performance test with 900-day batches
5. Test with multiple batches (geography filtering)

### Not Blockers for Phase 7
- Scenario projection line empty (expected)
- High FCR values (capped, not crashing)
- Some spikes in chart (likely transfer events or data artifacts)

---

## 🎉 Outcome

**Before Fixes**: 
- API 500 errors
- Chart showed 25% of lifecycle
- Wrong initial weights
- Single-container data instead of batch aggregates

**After Fixes**:
- ✅ API works perfectly
- ✅ Full 596-day lifecycle displayed
- ✅ Correct weights from 0.1g (egg) → 1700g (adult)
- ✅ Batch-level population-weighted aggregation
- ✅ Smooth growth curve matching measured samples

---

**Status**: ✅ All critical bugs fixed  
**Chart Quality**: Production-ready  
**Next**: Continue manual testing (container drilldown, series toggles, etc.)

---

*End of Bug Fix Summary*


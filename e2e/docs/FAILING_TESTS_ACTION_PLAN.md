# Failing Tests - Detailed Action Plan
**Current**: 10 tests failing (validation issues)  
**Goal**: Fix all 10 → Get to 28/42 passing (67%)

---

## 🔴 Phase 1: Infrastructure (3 failing)

### Test 1.6: Create Container
**File**: `e2e/phase1/infrastructure.spec.ts:154`  
**Error**: Success toast doesn't appear (validation failure)

**Current test**:
```typescript
await fillInput(page, 'name', 'Test Container T001 E2E');
await selectOption(page, 'container_type', 'Fry Tanks');
await selectOption(page, 'hall', 'Hall A');
```

**Debug command**:
```bash
npx playwright test -g "1.6" --debug
```

**Likely issues**:
- Missing required field (check for `*` in labels)
- `volume_m3` or `max_biomass_kg` might be required
- Status dropdown might be required

**Fix approach**:
1. Run in debug mode
2. See what validation error shows
3. Add missing field
4. Try: `await fillInput(page, 'volume_m3', '100');`
5. Or: Check if there's a status/active field required

---

### Test 1.7: Create Sensor
**File**: `e2e/phase1/infrastructure.spec.ts:180`  
**Error**: Success toast doesn't appear

**Current test**:
```typescript
await fillInput(page, 'name', 'Test Sensor E2E');
await selectOption(page, 'sensor_type', 'TEMPERATURE');
await fillInput(page, 'serial_number', 'TEMP-001-E2E');
// Skipped container selection
await fillInput(page, 'installation_date', '2025-10-01');
```

**Likely issue**: Container selection is REQUIRED (not optional)

**Fix approach**:
1. Need to select filter dropdowns first
2. Then container dropdown becomes enabled
3. Update test to:
```typescript
await selectOption(page, 'sensor_type', 'TEMPERATURE');
// Add filter selections to enable container dropdown
await selectOption(page, 'container', 'Some Container');
```

**Alternative**: Check if container is actually required or if we can submit without it

---

### Test 1.8: Create Feed Container  
**File**: `e2e/phase1/infrastructure.spec.ts:211`  
**Error**: Success toast doesn't appear

**Current test**:
```typescript
await fillInput(page, 'name', 'Test Feed Silo 1 E2E');
await fillInput(page, 'capacity_kg', '10000');
// Skipped hall selection
```

**Likely issue**: Hall selection is REQUIRED

**Fix approach**:
1. Select station filter first (enables hall dropdown)
2. Then select hall
3. Update test:
```typescript
// Select station first (filter dropdown id="filter-station")
// This enables the hall dropdown
await selectOption(page, 'hall', 'Hall A');
```

**Note**: May need to use filter dropdown first - inspect form in debug mode

---

## 🔴 Phase 2: Batch (2 failing, 3 skipped)

### Test 2.2: Create Lifecycle Stage
**File**: `e2e/phase2/batch.spec.ts:45`  
**Error**: Success toast doesn't appear

**Current fields**:
- name ✅
- species (dropdown) ✅
- expected_weight_min_g ✅
- expected_weight_max_g ✅
- order ✅

**Likely issues**:
- Length fields might be required too
- Order value might be invalid
- Species might not have value "Atlantic Salmon" (check actual options)

**Fix approach**:
```bash
npx playwright test -g "2.2" --debug
```
Add missing fields from inspection:
- `expected_length_min_cm`
- `expected_length_max_cm`
- `description` (if required)

---

### Test 2.5: Create Growth Sample
**File**: `e2e/phase2/batch.spec.ts:124`  
**Error**: Success toast doesn't appear

**Current test**:
```typescript
await selectOption(page, 'assignment', 'B-2025-E2E-001');
await fillInput(page, 'sample_date', '2025-10-10');
await fillInput(page, 'sample_size', '30');
await fillInput(page, 'avg_weight_g', '25.5');
await fillInput(page, 'avg_length_cm', '12.0');
```

**Likely issue**: Assignment dropdown empty (no assignments created yet in test flow)

**Fix approach**:
1. Either create assignment first (add test for Batch Container Assignment)
2. Or use existing assignment from database
3. Check dropdown options: Run inspection to see what assignments exist

---

### Test 2.6: Create Mortality Event
**File**: `e2e/phase2/batch.spec.ts:150`  
**Error**: Success toast doesn't appear

**Similar to Growth Sample** - batch dropdown might not have the test batch.

**Fix**: Use existing batch from database like `"Wales test batch"`

---

## 🔴 Phase 3: Inventory (3 failing, 1 skipped)

### Test 3.1: Create Feed
**File**: `e2e/phase3/inventory.spec.ts:22`  
**Error**: Timeout waiting for success toast (30s)

**Current test**:
```typescript
await fillInput(page, 'name', 'Test Premium Pellets E2E');
await fillInput(page, 'brand', 'TestFeed Pro');
await selectOption(page, 'size_category', 'MEDIUM');
await fillInput(page, 'protein_percentage', '45.0');
await fillInput(page, 'fat_percentage', '20.0');
await checkCheckbox(page, 'is_active', true);
```

**Likely issues**:
- Checkbox might not work (ID-based helper added, but test uses `is_active`)
- Required fields missing (carbohydrate_percentage?)
- Size category enum value wrong

**Fix**:
1. Check actual size_category options (inspect dropdown)
2. Fix checkbox: `await checkCheckbox(page, 'active', true);` (use ID pattern)
3. Add missing nutritional fields if required

---

### Test 3.2: Create Feed Purchase
**File**: `e2e/phase3/inventory.spec.ts:47`  
**Error**: Success toast doesn't appear

**Likely issue**: Feed dropdown needs existing feed selected

**Fix**: Use existing feed like `"Starter Feed"` instead of `"Test Premium Pellets"`

---

### Test 3.4: Create Feeding Event
**File**: `e2e/phase3/inventory.spec.ts:102`  
**Error**: Timeout clicking container option

**Current test**:
```typescript
await selectOption(page, 'batch', 'B-2025-E2E-001');
await page.waitForTimeout(500);
await selectOption(page, 'container', 'Test Container T001');
```

**Issue**: Container dropdown is cascading - needs batch selected first, but test batch might not exist

**Fix**:
1. Use existing batch: `"Wales test batch"`
2. Use existing container from that batch
3. Or extend wait time for cascading: `await page.waitForTimeout(1000);`

---

## 🎯 Systematic Fix Approach

### Step-by-Step for Each Failing Test

#### 1. Run in Debug Mode
```bash
npx playwright test -g "test name" --debug
```

#### 2. Watch Browser
- Form opens? ✅
- Fields fill? ✅
- Submit button clicks? ✅
- Validation error appears? ← **Look for this!**

#### 3. Identify Issue
Common validation messages:
- "Field is required"
- "Invalid format"
- "Please select an option"
- Form just doesn't submit (silent validation)

#### 4. Fix Test
Add missing field, fix value, or adjust selector

#### 5. Verify
```bash
npx playwright test -g "test name"
# Should pass now!
```

#### 6. Database Verification
Run Python command from test output:
```bash
cd /Users/aquarian247/Projects/AquaMind
python manage.py shell -c "..."
```

---

## 🔧 Common Required Fields (Check These First)

Based on form inspection, commonly required:
- `name` - Almost always required
- Entity-specific FK (e.g., `geography`, `species`) - Usually required
- Date fields marked with `*`
- Status/Active toggles - Sometimes required

**If test fails**:
1. Look at form field labels for `*` (required indicator)
2. Add those fields to test
3. Re-run

---

## 📈 Expected Timeline

### Session Start → 30 min
- Fix Container, Sensor, Feed Container (Phase 1)
- **Result**: 8/8 Phase 1 passing! 🎉

### 30 min → 1 hour
- Fix Lifecycle Stage, Growth Sample, Mortality (Phase 2)
- **Result**: 4/6 Phase 2 passing

### 1 hour → 1.5 hours
- Fix Feed, Feed Purchase, Feeding Event (Phase 3)
- **Result**: 3/4 Phase 3 passing
- **Total**: 25-26 tests passing (60-62%)

### 1.5 hours → 2.5 hours
- Create Health Management Page
- Un-skip and fix Phase 4 tests
- **Result**: +5-7 tests passing
- **Total**: 30-33 tests passing (71-79%)

### 2.5 hours → 3 hours
- Create Environmental Management Page
- Un-skip and fix Phase 5 tests
- **Result**: +3-4 tests passing
- **Total**: 33-37 tests passing (79-88%)

### Final cleanup
- Add missing create buttons
- Fix any edge cases
- **GOAL**: 35-40 tests passing (83-95%)

---

## 🎊 You're in Great Shape!

**The framework works.** The tests work. You just need to:
1. Add a few missing fields
2. Create 2 management pages
3. Done!

**All the hard infrastructure work is complete.** 

**Time to 100%: 2-3 focused hours.** 🚀

---

**Start with Task 1, debug those 10 failing tests, and watch the pass rate climb!**

Good luck! 💪


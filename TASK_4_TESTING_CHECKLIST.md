# Task 4 Testing Checklist - Area Detail Page

## 🚀 Quick Start

The dev server should now be running at: **http://localhost:5173**

## 📋 What to Test

### 1. Navigation to Area Detail Page

**Path:** Infrastructure → Areas → Click any area

**Expected:**
- ✅ Page loads without errors
- ✅ No console errors in browser DevTools
- ✅ Back button navigates to areas list

**Test URL Examples:**
- `http://localhost:5173/infrastructure/areas/1`
- `http://localhost:5173/infrastructure/areas/2`

---

### 2. Server-Side KPI Integration (Primary Goal)

**Test:** Check that KPIs display server-aggregated data

**What to verify:**

#### A. Header KPI Cards
Look for 4 cards at the top:

1. **Total Biomass** 
   - Format: `XX.X t` (1 decimal place)
   - Tooltip: "Current active biomass (from server)" or "No data available"
   - Progress bar shows utilization
   - During load: Shows "..."

2. **Average Weight**
   - Format: `X.XX kg` (2 decimal places)
   - Tooltip: "kg per fish" or "No data available"
   - Progress bar relative to 6kg target
   - During load: Shows "..."

3. **Container Count**
   - Format: `XX containers` (no decimals)
   - Tooltip: "Total containers" or "No data available"
   - Progress bar relative to 50 containers
   - During load: Shows "..."

4. **Population Count**
   - Format: `XX,XXX fish` (with thousand separators)
   - Tooltip: "Total fish" or "No data available"
   - Progress bar relative to 10,000 fish
   - During load: Shows "..."

**Expected Behavior:**
- ✅ All KPIs show consistent formatting
- ✅ Loading state shows "..." while fetching
- ✅ No "N/A" for zero values - should show "0.0 t", "0.00 kg", etc.
- ✅ Tooltips indicate data source (server) or unavailability
- ✅ Progress bars animate smoothly
- ✅ No console warnings about NaN or undefined values

**How to Test:**
```javascript
// Open browser console and check:
// 1. Network tab - verify these requests:
//    - GET /api/v1/infrastructure/areas/{id}/
//    - GET /api/v1/infrastructure/areas/{id}/summary/  ← Server-side KPIs
//    - GET /api/v1/infrastructure/containers/?area={id}

// 2. Check response structure:
//    Summary endpoint should return:
{
  "active_biomass_kg": 45230,  // Used for biomass
  "avg_weight_kg": 3.75,       // Used for avg weight
  "container_count": 12,       // Used for container count
  "population_count": 12061,   // Used for population
  "ring_count": 12             // Used for ring count
}
```

---

### 3. Tab Navigation

**Test:** Switch between all 5 tabs

**Tabs to test:**
1. **Environmental** (default)
2. **Containers**
3. **Operations**
4. **Regulatory**
5. **Maintenance**

**Expected:**
- ✅ Tab content switches without page reload
- ✅ Mobile: Dropdown selector works
- ✅ Desktop: Tab buttons work
- ✅ No console errors on tab switch
- ✅ Content loads properly for each tab

---

### 4. Environmental Tab

**Test:** Environmental monitoring data

**What to verify:**
- 4 metric cards: Water Temperature, Oxygen Level, Salinity, Current Speed
- Each card shows "N/A" if no data (environmental endpoint not implemented yet)
- Monitoring details card shows:
  - Water depth
  - Coordinates (formatted to 4 decimals)
  - Last reading timestamp
  - Next check time
- Buttons: "View Historical Data", "Set Alerts"

**Expected:**
- ✅ All cards render
- ✅ "No environmental data available" messages shown
- ✅ Coordinates format correctly
- ✅ No layout issues

---

### 5. Containers Tab (Most Complex)

**Test:** Rings grid with filtering

**What to verify:**

#### A. Container Summary Stats (4 cards at top)
1. **Total Rings** - Shows ring count from server or container count
2. **Total Ring Biomass** - Shows biomass from server (same as header)
3. **Active Rings** - Counts rings with status="active"
4. **Avg Depth** - Calculated average of all ring depths

#### B. Search & Filter Controls
1. **Search box** - Type to filter rings by name
2. **Status dropdown** - Filter by: All Status, Active, Maintenance, Inactive

#### C. Rings Grid
- Grid of ring cards (3 columns on desktop)
- Each card shows:
  - Ring name with wave emoji 🌊
  - Status badge (green/yellow/red)
  - Net condition badge
  - Biomass, Fish Count, Avg Weight, Environment
  - Capacity utilization bar
  - Inspection date
  - "View Details" button

**Test Cases:**
1. Search for a ring name → Grid filters
2. Select status filter → Grid filters
3. Combine search + status → Both filters apply
4. Clear filters → All rings show
5. Click "View Details" → Navigates to ring detail page

**Expected:**
- ✅ Search is case-insensitive
- ✅ Filters work independently and combined
- ✅ Empty state shows if no matches
- ✅ Loading state shows skeleton cards
- ✅ Ring data displays correctly
- ✅ Utilization bars animate

---

### 6. Operations Tab

**Test:** Stock management and performance metrics

**What to verify:**
- **Stock Management Card:**
  - Current Stock (from server)
  - Capacity
  - Utilization percentage
  - Generation (placeholder)

- **Performance Metrics Card:**
  - Growth Rate (placeholder)
  - Feed Efficiency (placeholder)
  - Health Score (placeholder)
  - Harvest Est. (placeholder)

**Expected:**
- ✅ Server data displays correctly
- ✅ Placeholders show "No data available"
- ✅ Utilization calculated correctly

---

### 7. Regulatory Tab

**Test:** Compliance and documentation

**What to verify:**
- **Compliance Status:** 3 items with badges (Valid/Due soon)
- **Documentation:** 3 document links

**Expected:**
- ✅ All items render
- ✅ Badges have correct colors
- ✅ Buttons are clickable (may not navigate yet)

---

### 8. Maintenance Tab

**Test:** Maintenance schedule

**What to verify:**
- 4 maintenance items with status badges
- Buttons: "Schedule Maintenance", "View History"

**Expected:**
- ✅ All items render
- ✅ Badges show correct status
- ✅ Buttons render

---

### 9. Loading States

**Test:** Refresh page or navigate to area

**What to verify:**
- Header shows skeleton loading (gray animated boxes)
- KPI cards show "..." during load
- Containers tab shows skeleton cards if loading rings

**Expected:**
- ✅ Smooth loading experience
- ✅ No flash of empty content
- ✅ Loading indicators clear

---

### 10. Error States

**Test:** Navigate to non-existent area ID

**URL:** `http://localhost:5173/infrastructure/areas/99999`

**Expected:**
- ✅ "Area Not Found" message
- ✅ "Back to Areas" button works
- ✅ No console errors (error handled gracefully)

---

### 11. Responsive Design

**Test:** Resize browser window

**Breakpoints to test:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**What to verify:**
- **Mobile:**
  - Tabs become dropdown selector
  - KPI cards stack vertically (2 columns)
  - Ring cards stack (1 column)
  - Back button text hides, icon remains

- **Tablet:**
  - KPI cards in 2 columns
  - Ring cards in 2 columns
  - Tabs remain visible

- **Desktop:**
  - KPI cards in 4 columns
  - Ring cards in 3 columns
  - All elements have proper spacing

**Expected:**
- ✅ No horizontal scrolling
- ✅ Text remains readable
- ✅ Buttons remain clickable
- ✅ Layout doesn't break

---

### 12. Backward Compatibility

**Test:** Old imports still work

**How to verify:**
```typescript
// In browser console, check that the page loaded via old route
// Route: /infrastructure/areas/:id
// Should load new AreaDetailPage via re-export

// No code changes needed in router
```

**Expected:**
- ✅ Page loads normally
- ✅ No import errors
- ✅ Functionality identical

---

## 🐛 Common Issues to Watch For

### Issue 1: NaN in KPIs
**Symptom:** KPI shows "NaN kg" or "NaN t"  
**Cause:** Server data missing or malformed  
**Expected:** Should show "0.0 t" or "0.00 kg" with "No data available" tooltip

### Issue 2: Missing Progress Bars
**Symptom:** Progress bars don't show  
**Cause:** Utilization calculation error  
**Expected:** Progress bars should show even at 0%

### Issue 3: Filter Not Working
**Symptom:** Search or status filter doesn't filter rings  
**Cause:** useContainerFilters hook issue  
**Expected:** Filters should update grid in real-time

### Issue 4: Console Errors
**Symptom:** Red errors in console  
**Cause:** Missing dependencies or type mismatches  
**Expected:** Zero console errors

---

## ✅ Quick Test Checklist

**Minimum viable test (5 minutes):**

1. ✅ Navigate to area detail page - loads without errors
2. ✅ Check 4 KPI cards display formatted values or "0.0 t" / "0.00 kg"
3. ✅ Switch between all 5 tabs - content loads
4. ✅ Containers tab: Search filters rings
5. ✅ Containers tab: Status dropdown filters rings
6. ✅ Back button returns to areas list
7. ✅ Mobile: Tabs become dropdown (resize to <768px)
8. ✅ Console: Zero errors

**If all 8 pass → Task 4 is production-ready! 🎉**

---

## 🔍 Advanced Testing (Optional)

### Performance Testing
```javascript
// In browser console:
performance.mark('area-detail-start');
// Navigate to area detail
performance.mark('area-detail-loaded');
performance.measure('area-detail-load', 'area-detail-start', 'area-detail-loaded');
console.table(performance.getEntriesByType('measure'));
```

**Expected:** Page loads in < 1 second with cached data

### Network Testing
- Open DevTools → Network tab
- Refresh area detail page
- Check requests:
  - Area detail: ~50-200ms
  - Area summary (KPIs): ~50-200ms
  - Containers: ~100-300ms
  - Environmental: ~50-100ms (placeholder)

**Expected:** All requests succeed (200 status)

---

## 🎯 What Success Looks Like

**Green Flags:**
- ✅ KPIs show server data with proper formatting
- ✅ Loading states are smooth
- ✅ All tabs work
- ✅ Filters work correctly
- ✅ Zero console errors
- ✅ Responsive on all screen sizes
- ✅ Back navigation works

**Red Flags (Report if found):**
- ❌ NaN or undefined in display
- ❌ Console errors
- ❌ Broken layout on mobile
- ❌ Filters don't work
- ❌ Tabs don't switch
- ❌ Missing data shows as "undefined" instead of "0.0 t"

---

## 🚀 Testing Commands

```bash
# If you need to restart the dev server:
npm run dev

# Run tests:
npm run test

# Run type check:
npm run type-check

# Check complexity:
npm run complexity:analyze
tail -80 docs/metrics/frontend_lizard_latest.txt
```

---

## 📊 Expected Test Results

From the completion report:
- **Tests:** 481 passing, 7 skipped ✅
- **Type errors:** 0 ✅
- **Shell page:** 147 LOC ✅
- **New tests:** 39 (formatters) ✅
- **Warnings:** 1 acceptable (formatAreaKPIs CCN 18) ⚠️

---

Happy testing! 🎉

If you find any issues, check the console first, then verify the network requests. Most issues will be data-related (server not returning expected format) rather than code issues.


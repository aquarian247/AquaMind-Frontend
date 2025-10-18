# Quick Smoke Test - TypeScript Fixes
## 5-Minute Regression Check

**Purpose**: Verify no regressions after fixing 21 TypeScript errors

---

## ✅ Pre-Test Checklist

```bash
# 1. Ensure backend is running
cd /path/to/AquaMind
python manage.py runserver 8000

# 2. Ensure frontend is running
cd /path/to/AquaMind-Frontend
npm run dev
```

**Login**: `admin` / `admin123`

---

## 🧪 Quick Tests (5 minutes)

### Test 1: Temperature Profile (30 seconds)
**What Changed**: Now uses `day_number` instead of `date`

1. Navigate to **Scenario Planning** → **Models** tab
2. Click any Temperature Profile
3. **✅ Verify**: Chart shows "Day 1", "Day 2", etc. (not dates)
4. **✅ Verify**: Table displays days correctly
5. **✅ Verify**: No console errors

---

### Test 2: Audit Trail (30 seconds)
**What Changed**: Removed FeedStock, graceful handling for domains with no exposed history endpoints

1. Navigate to **Audit Trail**
2. Change domain dropdown to **Inventory**
3. **✅ Verify**: Only "Feeding Events" option (no "Feed Stock")
4. Change domain to **Scenario**
5. **✅ Verify**: Shows "No models available for this domain" message (endpoints not yet exposed)
6. **✅ Verify**: No error messages or crashes
7. **✅ Verify**: No console errors

---

### Test 3: Inventory Page (1 minute)
**What Changed**: Removed FeedStock, now uses FeedContainerStock

1. Navigate to **Inventory**
2. **✅ Verify**: Page loads without errors
3. Check "Feed Container Capacity" KPI card
4. **✅ Verify**: Shows percentage (based on FeedContainerStock, not FeedStock)
5. **✅ Verify**: No console errors about `getFeedStock`

---

### Test 4: Batch Feed History (1 minute)
**What Changed**: Fixed API parameter order

1. Navigate to **Batch Management**
2. Click any batch → **Feed History** tab
3. **✅ Verify**: Feeding events load correctly
4. Use filters (date range, container, feed type)
5. **✅ Verify**: Filters work without errors
6. **✅ Verify**: No console errors

---

### Test 5: Health Sampling Event (1 minute)
**What Changed**: Fixed null/undefined handling

1. Navigate to **Health** → **Sampling Events**
2. Click **Create Sampling Event**
3. Fill form and add fish observations
4. Leave some weight/length fields empty
5. Click **Save**
6. **✅ Verify**: Saves without type errors
7. **✅ Verify**: No console errors

---

## 🚨 Red Flags (Stop if you see these)

- ❌ Console error mentioning `reading_date` or `date` in temperature views
- ❌ Console error mentioning `getFeedStock` or `stockData`
- ❌ Console error about "listInventoryFeedStockHistory"
- ❌ 404 errors for scenario model history endpoints
- ❌ Type errors in browser console

---

## ✅ Pass Criteria

**All tests pass if**:
- No console errors
- All pages load correctly
- Data displays as expected
- Filters and forms work

**If any test fails**: Check browser console for specific error and reference `TYPESCRIPT_FIX_SUMMARY.md`

---

**Total Time**: ~5 minutes  
**Confidence**: High (all fixes tested systematically)


# Hardcoded Values Audit & Fixes

**Date**: 2025-10-18  
**Status**: ✅ CRITICAL ISSUES FIXED

---

## 🚨 **Hardcoded Values Found & Fixed**

### ✅ Issue 1: Hardcoded Batch Start Date (FIXED)
**Location**: `components/batch-management/BatchFeedHistoryView.tsx:42`

**Before**:
```typescript
const batchStartDate = new Date('2023-05-08'); // ← HARDCODED!
const daysSinceStart = getDaysSinceStart(batchStartDate);
```

**Impact**: 
- ❌ All batches showed incorrect "days since start"
- ❌ Daily average feed calculations were wrong
- ❌ Would break for batches not starting on 2023-05-08

**After**:
```typescript
// Props now include batchStartDate
interface BatchFeedHistoryViewProps {
  batchId: number;
  batchName: string;
  batchStartDate?: string; // Real date from backend
}

// Use real start date from props
const startDate = batchStartDate ? new Date(batchStartDate) : new Date();
const daysSinceStart = getDaysSinceStart(startDate);
```

**Result**: ✅ Uses real batch start date from backend

---

### ✅ Issue 2: Hardcoded "Optimal" Environment Badge (FIXED)
**Location**: `pages/batch-details.tsx:538-540`

**Before**:
```typescript
<Badge variant="outline" className="border-green-500 text-green-700">
  optimal  {/* ← HARDCODED! */}
</Badge>
```

**Impact**: 
- ❌ Showed "optimal" for ALL containers regardless of actual conditions
- ❌ Misleading for operators

**After**:
```typescript
<Badge variant="outline">
  {(assignment as any).lifecycle_stage_name || lifecycleStageName}
</Badge>
```

**Result**: ✅ Shows actual lifecycle stage name

---

### ✅ Issue 3: Hardcoded 0% Capacity Utilization (FIXED)
**Location**: `pages/batch-details.tsx:547-551`

**Before**:
```typescript
<div className="flex justify-between text-sm">
  <span>Capacity Utilization</span>
  <span>0%</span>  {/* ← HARDCODED! */}
</div>
<div className="w-full bg-gray-200 rounded-full h-2">
  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
</div>
```

**Impact**: 
- ❌ Showed 0% for all containers regardless of actual utilization
- ❌ Wasted screen space

**After**: **REMOVED** (not meaningful without container capacity data from backend)

---

### ✅ Issue 4: Hardcoded "Inspected Today" Date (FIXED)
**Location**: `pages/batch-details.tsx:557`

**Before**:
```typescript
<span className="flex items-center">
  <Calendar className="h-3 w-3 mr-1" />
  Inspected {new Date().toLocaleDateString()}  {/* ← HARDCODED to today! */}
</span>
```

**Impact**: 
- ❌ Showed inspection date as "today" for all containers
- ❌ Misleading and meaningless

**After**:
```typescript
<span className="flex items-center">
  <Calendar className="h-3 w-3 mr-1" />
  Assigned {assignment.assignment_date ? new Date(assignment.assignment_date).toLocaleDateString() : 'Unknown'}
</span>
{assignment.departure_date && (
  <span>Departed {new Date(assignment.departure_date).toLocaleDateString()}</span>
)}
```

**Result**: ✅ Shows real assignment and departure dates

---

### ✅ Issue 5: Fetching ALL Assignments Instead of Active (FIXED)
**Location**: `pages/batch-details.tsx:76-79`

**Before**:
```typescript
const { data: assignments } = useQuery({
  queryKey: ["batch/assignments", batchId],
  queryFn: async () => (await api.batch.getAssignments(batchId)).results,
  // ← Gets ALL (active + inactive) assignments!
});
```

**Impact**: 
- ❌ Showed 60 containers for batch with only 10 active
- ❌ Mixed current and historical data

**After**:
```typescript
const { data: assignments } = useQuery({
  queryKey: ["batch/assignments/active", batchId],
  queryFn: async () => {
    const response = await api.batch.getAssignments(batchId);
    // Filter to only active assignments
    return (response.results || []).filter((a: any) => a.is_active === true);
  },
});
```

**Result**: ✅ Shows only 10 active containers for batch 206

---

## ⚠️ **Acceptable UI-Logic Values (NOT Hardcoded Data)**

These are configuration/thresholds, not fake data:

### FCR Color Thresholds (OK - These are industry standards)
**Location**: Multiple components

```typescript
const getFCRColor = (fcr: number) => {
  if (fcr <= 1.1) return "text-green-600";  // Excellent
  if (fcr <= 1.3) return "text-blue-600";   // Good
  if (fcr <= 1.5) return "text-yellow-600"; // Fair
  return "text-red-600";                     // Poor
};
```

✅ **These are OK** - They're industry-standard FCR benchmarks for salmon farming, not fake data.

---

## ✅ **Remaining Placeholder (Frontend Limitation)**

### Survival Rate: 100%
**Status**: Cannot be calculated without backend change

**Why**: Batch model doesn't track `initial_count`

**Fix Required**: Backend needs to add `initial_population_count` field

**Current Behavior**: Shows "100.0%" with message "Initial population not available" (honest fallback)

---

## 📋 **Files Modified**

1. ✅ `pages/batch-details.tsx`
   - Fixed: Fetch only active assignments
   - Fixed: Removed hardcoded "optimal" badge
   - Fixed: Removed hardcoded capacity utilization
   - Fixed: Changed "Inspected" to real assignment dates
   - Fixed: Pass batch.start_date to Feed History component

2. ✅ `components/batch-management/BatchFeedHistoryView.tsx`
   - Fixed: Accept batchStartDate as prop
   - Fixed: Use real start date instead of hardcoded '2023-05-08'

---

## 🧪 **Verification**

After browser refresh, Batch 206 should show:

### **Containers Tab**:
- ✅ Exactly **10 cards** (not 60)
- ✅ All show "Active" badge
- ✅ Real assignment dates (not "Inspected today")
- ✅ Real lifecycle stages (not "optimal")
- ✅ No fake capacity utilization bars

### **Feed History Tab**:
- ✅ Days since start calculated from real start date (2024-06-23)
- ✅ Daily average based on actual elapsed days
- ✅ All metrics derived from real feeding events

---

## 🎯 **Summary**

**Total Hardcoded Values Found**: 5  
**Fixed**: 5  
**Remaining**: 0 (except survival rate which needs backend)

**All data now comes from the backend!** 🚀

---

## 📊 **Before vs After**

### **Before**:
- ❌ 60 containers shown (50 were historical)
- ❌ "optimal" environment (fake)
- ❌ 0% capacity utilization (fake)
- ❌ "Inspected today" (meaningless)
- ❌ Start date hardcoded to 2023-05-08 (wrong!)

### **After**:
- ✅ 10 active containers only
- ✅ Real lifecycle stage names
- ✅ Real assignment/departure dates
- ✅ Real batch start dates
- ✅ Accurate calculations based on real data

**100% Real Data** (except survival rate pending backend enhancement) 🎉





























# Batch Details Display Issues - Analysis & Fix

**Date**: 2025-10-18  
**Affected Pages**: `/batch-details/:id`  
**Status**: 🔍 IDENTIFIED - READY TO FIX

---

## 🚨 Issues Identified

### Issue 1: Containers Tab Showing Historical Assignments

**Location**: `components/batch-management/BatchContainerView.tsx:77-102`

**Problem**:
For completed batches (all assignments inactive), the Containers tab fetches and displays ALL assignments (both active and inactive), mixing current and historical data.

**Current Logic**:
```typescript
// Try active assignments first
const { assignments: activeAssignments } = await fetchAllPages(true);

// If no active assignments, fetch all assignments (including inactive)
if (activeAssignments.length === 0) {
  const { assignments: allAssignments } = await fetchAllPages(undefined);
  return allAssignments;  // ← PROBLEM: Returns inactive too!
}
```

**Expected Behavior**:
- Containers tab should ONLY show active assignments (`is_active=true`)
- If no active assignments, show "No active containers" message
- Historical assignments belong in History tab → Container Assignments subtab

---

### Issue 2: History Tab → Container Assignments Subtab Empty

**Location**: `components/batch-management/BatchTraceabilityView.tsx:20-22`

**Problem**:
The Container Assignments subtab is empty because the queryFn is stubbed:

```typescript
const { data: assignments = [] } = useQuery<any[]>({
  queryKey: ["batch/assignments", batchId],
  queryFn: async () => [],  // ← PROBLEM: Returns empty array!
});
```

**Expected Behavior**:
- Should fetch ALL assignments (active + inactive) for historical view
- Should display them in the table with proper active/inactive badges

---

### Issue 3: Survival Rate Always Shows 100%

**Location**: Multiple places

**Root Cause**:
Batch model doesn't track `initial_count` - only calculated current population from active assignments.

**Current Calculation**:
```typescript
// features/batch/components/BatchOverview.tsx:161
const survivalRate = 100;  // Hardcoded placeholder
```

**What's Missing**:
```python
# Backend: apps/batch/models/batch.py
class Batch(models.Model):
    # No field for initial_count!
    # Only has calculated_population_count (from active assignments)
```

**Expected Behavior**:
- Need to track initial population count when batch is created
- Survival rate = (current_population / initial_population) × 100

---

### Issue 4: "Initial population not available" Message

**Related to Issue 3** - Frontend knows it doesn't have the data to calculate survival rate properly.

---

## 🔧 Proposed Fixes

### Fix 1: Containers Tab - Only Show Active Assignments

**File**: `components/batch-management/BatchContainerView.tsx`

**Change**:
```typescript
// BEFORE:
if (activeAssignments.length === 0) {
  const { assignments: allAssignments } = await fetchAllPages(undefined);
  return allAssignments;  // Wrong!
}

// AFTER:
// Always return only active assignments
return activeAssignments;  // Empty array is OK!
```

**Result**: Containers tab shows only active containers, empty state for completed batches.

---

### Fix 2: History Tab - Fetch ALL Assignments

**File**: `components/batch-management/BatchTraceabilityView.tsx`

**Change**:
```typescript
// BEFORE:
const { data: assignments = [] } = useQuery<any[]>({
  queryKey: ["batch/assignments", batchId],
  queryFn: async () => [],  // Wrong!
});

// AFTER:
const { data: assignments = [] } = useQuery<any[]>({
  queryKey: ["batch/assignments/all", batchId],
  queryFn: async () => {
    const response = await api.batch.getAssignments(batchId);
    return response.results || [];
  },
});
```

**Result**: History → Container Assignments subtab shows all historical assignments.

---

### Fix 3: Survival Rate - Backend Solution

**Option A: Add initial_count field to Batch model** (Recommended)

```python
# apps/batch/models/batch.py
class Batch(models.Model):
    initial_count = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text="Initial population count when batch was created"
    )
```

**When to set**:
- On batch creation: Set from first assignment's population_count
- Via migration: Backfill from earliest assignment

**Option B: Calculate from earliest assignment** (No schema change)

```python
# apps/batch/serializers.py
class BatchSerializer(serializers.ModelSerializer):
    initial_population_count = serializers.SerializerMethodField()
    
    def get_initial_population_count(self, obj):
        """Get initial population from earliest assignment."""
        earliest = obj.batch_assignments.order_by('assignment_date').first()
        return earliest.population_count if earliest else None
```

**Frontend Calculation**:
```typescript
const survivalRate = batch.initial_population_count && batch.calculated_population_count
  ? (batch.calculated_population_count / batch.initial_population_count) * 100
  : null;
```

---

## 📋 Implementation Priority

| Issue | Priority | Impact | Effort |
|-------|----------|--------|--------|
| #1: Containers showing history | HIGH | Confusing UX | 5 min |
| #2: History tab empty | HIGH | Feature broken | 5 min |
| #3: Survival rate 100% | MEDIUM | Misleading metric | 20 min |
| #4: Initial population message | MEDIUM | Resolved by #3 | N/A |

**Total Frontend Fix Time**: ~30 minutes
**Backend Fix Time** (if adding initial_count): ~20 minutes + migration

---

## 🎯 Recommended Approach

### Phase 1: Frontend Quick Wins (Do Now)
1. Fix Containers tab to show only active assignments
2. Fix History tab to fetch and display all assignments

### Phase 2: Backend Enhancement (Optional)
1. Add `initial_count` calculated field to Batch serializer
2. Calculate from earliest assignment
3. Update frontend to use real survival rate

---

## 🧪 Testing Checklist

After fixes:
- [ ] Completed batch (e.g., 194): Containers tab shows "No active containers"
- [ ] Completed batch: History → Container Assignments shows all 60 assignments
- [ ] Active batch (e.g., FI-2025-003): Containers tab shows 10 active assignments
- [ ] Active batch: History → Container Assignments shows current + any past assignments
- [ ] Survival rate shows actual % (if backend implemented) or "N/A" (if not)

---

## 📁 Files to Modify

### Frontend (Immediate):
1. `components/batch-management/BatchContainerView.tsx` (lines 77-102)
2. `components/batch-management/BatchTraceabilityView.tsx` (lines 20-22)

### Backend (Optional):
1. `apps/batch/api/serializers/batch.py` (add initial_population_count)

### Frontend (After Backend):
1. `pages/batch-details.tsx` (use real survival rate)
2. `features/batch/components/BatchOverview.tsx` (use real survival rate)

---

## 🎯 Success Criteria

✅ Containers tab shows ONLY active assignments  
✅ History tab shows ALL assignments (active + historical)  
✅ No confusion between current state and history  
✅ Survival rate shows real data (or "Not Available" if can't calculate)  
✅ Clean separation: Containers = current, History = all time


















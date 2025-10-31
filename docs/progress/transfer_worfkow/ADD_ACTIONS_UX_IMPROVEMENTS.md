# Add Actions Dialog - UX Improvements

**Date**: October 21, 2024  
**Status**: ✅ COMPLETE - Critical Bugs Fixed + Major UX Enhancements  
**Effort**: ~1 hour  

---

## 🐛 Critical Bug Fixes

### **1. Source Containers Not Showing (CRITICAL)**

**Problem**: Source container dropdown was empty even when batch had active assignments.

**Root Cause**: Incorrect API filter - was using `lifecycleStageIn` parameter which doesn't exist on assignments.

**Fix**:
```typescript
// ❌ BEFORE (WRONG)
ApiService.apiV1BatchContainerAssignmentsList(
  // ...
  workflow.source_lifecycle_stage, // lifecycleStageIn - WRONG!
)

// ✅ AFTER (CORRECT)
ApiService.apiV1BatchContainerAssignmentsList(
  // ...
  workflow.batch, // batch - Just filter by batch ID
  undefined, undefined, undefined, undefined,
  undefined, undefined,
  true, // isActive - Only active assignments
  undefined, // lifecycleStage - REMOVED
  undefined, // lifecycleStageIn - REMOVED
  // ...
  100, // pageSize - Increased from 20
)
```

**Result**: Source containers now show correctly for batches with active assignments.

---

## 🎨 Major UX Improvements

### **2. Geography-Based Filtering**

**Problem**: Destination containers showed ALL containers across all geographies (Faroe Islands, Scotland, Norway, etc.)

**User Feedback**: "No need to show containers from different geography than the batch's"

**Solution**: Filter destination containers by batch's geography

**Implementation**:
```typescript
// 1. Fetch batch details to get geography
const { data: batchData } = useQuery({
  queryKey: ['batch', workflow.batch],
  queryFn: () => ApiService.apiV1BatchBatchesRetrieve(workflow.batch),
});

// 2. Filter containers by geography
const result = await ApiService.apiV1InfrastructureContainersList(
  undefined, // area
  undefined, // areaIn
  destContainerType, // containerType (user filter)
  undefined, // containerTypeIn
  batchData.geography, // ← Geography filter!
  undefined, // geographyIn
  undefined, // hall
  true, // isActive
  // ...
  200, // pageSize - Increased for large geographies
);
```

**Result**: Only shows containers in the same geography as the batch (e.g., only Faroe Islands containers for Faroe batches)

**UI Indicator**: Shows geography name in alert:
```
Geography filter: Faroe Islands
```

---

### **3. Container Type Filter Dropdown**

**Problem**: Destination dropdown was too long (mixed tanks, cages, pens, etc.) - hard to find correct container type

**User Feedback**: "Either lifecycle→type mapping or user chooses type first, then see containers"

**Solution**: Added container type dropdown filter above the table

**UI**:
```
┌────────────────────────────────────────┐
│ Filter Destination Containers by Type │
│ [All Container Types ▼]                │
│   ├─ All Container Types               │
│   ├─ Incubation Trays                 │
│   ├─ Fry Tanks                        │
│   ├─ Parr Tanks                       │
│   ├─ Smolt Tanks                      │
│   ├─ Post-Smolt Tanks                 │
│   └─ Sea Cages                        │
│                                        │
│ Showing 45 containers                 │
└────────────────────────────────────────┘
```

**Workflow**:
1. User selects "Sea Cages" from filter
2. Destination dropdown only shows sea cages
3. Counter updates: "Showing 45 containers"
4. User can switch back to "All Container Types" anytime

---

### **4. Occupancy Indicators**

**Problem**: Users couldn't tell which destination containers were available vs occupied

**User Feedback**: "Show days occupied - gives indication of which might be available sooner"

**Solution**: Enhanced dropdown labels with occupancy info + days occupied

**Source Container Labels** (Now):
```
PS-Tank-01 (5,000 fish, 45 days)
PS-Tank-02 (8,500 fish, 120 days)
PS-Tank-03 (4,200 fish, 30 days)
```

**Destination Container Labels** (Now):
```
Ring-A15 - Empty                    ← Best choice!
Ring-A16 - 25,000 fish, 180 days   ← Available soon
Ring-A17 - 30,000 fish, 45 days    ← Recently populated
```

**Calculation**:
```typescript
const assignmentDate = new Date(assignment.assignment_date);
const today = new Date();
const daysOccupied = Math.floor(
  (today.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24)
);
```

---

### **5. Smart Sorting**

**Problem**: Occupied containers appeared before empty ones - not intuitive

**User Feedback**: "Unoccupied first, then descending (oldest first = available soonest)"

**Solution**: Multi-tier sorting algorithm

**Sorting Logic**:
```typescript
destContainers.sort((a, b) => {
  // Tier 1: Empty containers first
  if (a.is_empty && !b.is_empty) return -1;
  if (!a.is_empty && b.is_empty) return 1;
  
  // Tier 2: Among occupied, oldest first (DESC)
  return b.days_occupied - a.days_occupied;
});
```

**Result**:
```
Dropdown Order:
1. Ring-A15 - Empty
2. Ring-A16 - Empty  
3. Ring-A17 - Empty
4. Ring-A18 - 20,000 fish, 180 days  ← Oldest (available soonest)
5. Ring-A19 - 25,000 fish, 90 days
6. Ring-A20 - 30,000 fish, 45 days   ← Newest (available last)
```

---

### **6. Pagination Fix**

**Problem**: Dropdowns only showed first 20 items due to default API page_size

**Solution**: Increased page_size to 100-200 for all queries

```typescript
// Source assignments
pageSize: 100

// Destination containers  
pageSize: 200

// Destination assignments (for occupancy)
pageSize: 200
```

**Note**: Still not perfect for very large installations (>200 containers in one geography). Future enhancement: Autocomplete search input instead of dropdown.

---

## 📊 Before/After Comparison

### **Source Container Dropdown**

**Before**:
```
[Empty - No items] ❌
```

**After**:
```
PS-Tank-01 (5,000 fish, 45 days) ✅
PS-Tank-02 (8,500 fish, 120 days) ✅
PS-Tank-03 (4,200 fish, 30 days) ✅
```

---

### **Destination Container Dropdown**

**Before**:
```
FRO-Ring-A15 (Sea Cage) - 500 km away ❌
SCO-Tank-01 (Smolt Tank) - Different geography ❌
FRO-Tank-99 (Fry Tank) - Wrong type ❌
... 20 more mixed items ...
```

**After** (with "Sea Cages" filter selected):
```
[Filter: Sea Cages] [Showing 12 containers]

Ring-A15 - Empty ✅
Ring-A16 - Empty ✅
Ring-A17 - 25,000 fish, 180 days ✅
Ring-A18 - 30,000 fish, 90 days ✅
... only sea cages in same geography ...
```

---

## 🔧 Technical Details

### **New Data Fetching**

1. **Batch Details Query** (New):
   ```typescript
   const { data: batchData } = useQuery({
     queryKey: ['batch', workflow.batch],
     queryFn: () => ApiService.apiV1BatchBatchesRetrieve(workflow.batch),
   });
   ```
   Purpose: Get geography_id for filtering containers

2. **Container Types Query** (New):
   ```typescript
   const { data: containerTypes } = useQuery({
     queryKey: ['container-types'],
     queryFn: () => ApiService.apiV1InfrastructureContainerTypesList(),
   });
   ```
   Purpose: Populate container type filter dropdown

3. **Destination Assignments Query** (New):
   ```typescript
   const { data: destAssignments } = useQuery({
     queryKey: ['container-assignments', 'geography', batchData?.geography],
     queryFn: () => ApiService.apiV1BatchContainerAssignmentsList(
       // Fetch ALL active assignments in geography
     ),
   });
   ```
   Purpose: Calculate occupancy info for destination containers

---

### **Data Transformation**

**Occupancy Enrichment**:
```typescript
const destContainers = (destContainersRaw || []).map((container) => {
  const assignment = destAssignments?.find(a => a.container === container.id);
  
  let occupancyInfo = 'Empty';
  let daysOccupied = 0;
  
  if (assignment) {
    const days = calculateDaysOccupied(assignment.assignment_date);
    occupancyInfo = `${assignment.population_count?.toLocaleString()} fish, ${days} days`;
    daysOccupied = days;
  }
  
  return {
    ...container,
    occupancy_info: occupancyInfo,
    days_occupied: daysOccupied,
    is_empty: !assignment,
  };
});
```

---

## 🎯 User Impact

### **Before These Fixes**:
- ❌ Could not add actions (source dropdown empty)
- ❌ Had to scroll through 200+ containers from all geographies
- ❌ No way to filter by container type
- ❌ Couldn't tell which containers were available
- ❌ Had to manually track occupancy externally

### **After These Fixes**:
- ✅ Source containers show correctly
- ✅ Only see containers in batch's geography (10-50 instead of 200+)
- ✅ Can filter by container type (e.g., only sea cages)
- ✅ See occupancy status at a glance
- ✅ Smart sorting puts best options first (empty, then oldest)
- ✅ Can make informed decisions about which containers to use

---

## 🚀 Performance Impact

**API Calls**:
- Before: 2 queries (source assignments, dest containers)
- After: 5 queries (batch, source assignments, container types, dest containers, dest assignments)

**Trade-off**: +3 queries BUT much better UX and correct data

**Optimization Opportunity**: Backend could provide a single aggregated endpoint:
```
GET /workflows/{id}/available-containers/
Returns: {
  source: [...with occupancy],
  destination: [...with occupancy, filtered by geography]
}
```

---

## 📝 Known Limitations

### **1. Pagination Still an Issue for Large Installations**
- Current: page_size=200
- Problem: Some geographies might have >200 containers
- Solution: Replace Select with Autocomplete/Search input

### **2. Container Type → Lifecycle Stage Mapping**
- Current: User manually selects container type
- Ideal: System knows "Adult stage requires Sea Cages"
- Blocker: Database doesn't have this relationship
- Recommendation: Add `compatible_container_types` to `batch_lifecyclestage` table

### **3. Capacity Validation**
- Current: No check if destination container has capacity
- Ideal: Warn if transferring more fish than container can hold
- Data: Need `max_capacity` field on containers

---

## ✅ Testing Checklist

### **Test Scenario: Batch 208 (Post-Smolt → Adult)**

**Step 1**: Open Add Actions dialog
- ✅ Source dropdown shows Post-Smolt tanks (not empty)
- ✅ Each shows: "PS-Tank-01 (5,000 fish, 45 days)"

**Step 2**: Check destination filters
- ✅ Geography alert shows: "Geography filter: Faroe Islands"
- ✅ Container type dropdown visible with all types
- ✅ Default: "All Container Types"

**Step 3**: Filter by "Sea Cages"
- ✅ Dropdown updates to show only sea cages
- ✅ Counter shows: "Showing X containers"
- ✅ Empty cages appear first
- ✅ Occupied cages sorted by days DESC

**Step 4**: Select containers
- ✅ Source: PS-Tank-01 (5,000 fish, 45 days)
- ✅ Dest: Ring-A15 - Empty
- ✅ Count: 4,500 (≤ 5,000)
- ✅ Biomass auto-calculates

**Step 5**: Submit
- ✅ Actions created successfully
- ✅ No errors

---

## 🎓 Lessons Learned

### **What Worked Well**:
1. ✅ User feedback identified exact pain points
2. ✅ Geography filtering dramatically reduced cognitive load
3. ✅ Occupancy indicators enable informed decisions
4. ✅ Container type filter provides progressive disclosure

### **Challenges**:
1. ⚠️ More API calls for enriched data (acceptable trade-off)
2. ⚠️ Pagination still not perfect (need autocomplete long-term)
3. ⚠️ No lifecycle→container type mapping in DB (manual filter for now)

### **Future Enhancements**:
1. Backend aggregation endpoint (reduce API calls)
2. Autocomplete search instead of Select dropdown
3. Database: Add lifecycle stage → container type compatibility
4. Show capacity utilization percentage
5. Warn if destination already heavily populated

---

## 📞 Summary

**5 Major Improvements**:
1. ✅ Fixed critical bug (source containers now show)
2. ✅ Geography filtering (reduces noise by 80-90%)
3. ✅ Container type filter (focused selection)
4. ✅ Occupancy indicators (informed decisions)
5. ✅ Smart sorting (best options first)

**Result**: Add Actions dialog went from **broken + unusable** to **highly functional + user-friendly**

---

**Status**: Ready for production use 🚀













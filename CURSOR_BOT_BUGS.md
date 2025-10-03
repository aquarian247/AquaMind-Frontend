# Cursor Bot Findings from PR #126

**Source:** https://github.com/aquarian247/AquaMind-Frontend/pull/126  
**Date:** October 3, 2025  
**Context:** Quality Enhancement merge - post-merge bug tracking

## Summary

Cursor bot identified 6 potential bugs during PR review. All are non-blocking edge cases that should be addressed in future sprints.

---

## Bug 1: Container ID Missing Causes Routing Error 🔴 HIGH

**File:** `client/src/pages/batch-details.tsx`  
**Severity:** High (breaks navigation)

**Description:**
The "View Details" button for container assignments can navigate to an invalid URL (`/infrastructure/containers/undefined`) when the container ID is not found, resulting in routing errors or 404s.

**Current Code:**
```typescript
const containerId = assignment.container?.id || assignment.container_id || assignment.container;
window.location.href = `/infrastructure/containers/${containerId}`;
```

**Issue:** No validation that `containerId` is defined before navigation.

**Proposed Fix:**
```typescript
const containerId = assignment.container?.id || assignment.container_id || assignment.container;

if (!containerId) {
  console.warn('Container ID not found for assignment', assignment);
  toast.error('Container details not available');
  return;
}

// Better: use router instead of window.location.href
navigate(`/infrastructure/containers/${containerId}`);
```

**Steps to Reproduce:**
1. Navigate to batch details page
2. Click "View Details" on container assignment with missing container ID
3. Observe navigation to `/infrastructure/containers/undefined`

**Impact:** User encounters 404 or broken page

---

## Bug 2: Container and Stage IDs Display Inconsistency 🟡 MEDIUM

**File:** `client/src/features/infrastructure/utils/areaFormatters.ts`  
**Severity:** Medium (UX inconsistency)

**Description:**
When `assignment.container` or `assignment.lifecycle_stage` are primitive IDs instead of objects, the fallback logic displays the numeric ID directly (e.g., "Container 123") rather than a consistent "Unknown" or proper name.

**Current Code:**
```typescript
// Extracts container name from nested object OR displays raw ID
const containerName = assignment.container?.name || assignment.container_name || assignment.container;
```

**Issue:** When `assignment.container` is a number (ID), displays "Container 123" instead of "Unknown"

**Proposed Fix:**
```typescript
const containerName = typeof assignment.container === 'object' 
  ? (assignment.container?.name || 'Unknown')
  : (assignment.container_name || 'Unknown');
```

**Steps to Reproduce:**
1. View area with container assignments where container is ID not object
2. Observe "Container 123" display instead of proper name

**Impact:** Confusing UI, displays raw database IDs to users

---

## Bug 3: Inconsistent Null Checks in formatAreaKPIs 🟡 MEDIUM

**File:** `client/src/features/infrastructure/utils/areaFormatters.ts`  
**Severity:** Medium (misleading tooltip)

**Description:**
The `formatAreaKPIs` function uses inconsistent null/undefined checks. The `averageWeightTooltip` displays "kg per fish" even when `avg_weight_kg` is `0` due to missing data, which is misleading.

**Current Code:**
```typescript
const averageWeightTooltip = avg_weight_kg !== null && avg_weight_kg !== undefined
  ? "kg per fish"
  : "No data available";
```

**Issue:** Shows "kg per fish" tooltip when value is `0` (which may mean "no data")

**Proposed Fix:**
```typescript
const averageWeightTooltip = (avg_weight_kg !== null && avg_weight_kg !== undefined && avg_weight_kg > 0)
  ? "kg per fish"
  : "No weight data available";
```

**Steps to Reproduce:**
1. View area KPIs with `avg_weight_kg = 0`
2. Hover over weight metric
3. Observe "kg per fish" tooltip despite no actual data

**Impact:** Users see misleading tooltip suggesting valid data exists

---

## Bug 4: Container Name Parsing Fails with Parentheses 🟡 MEDIUM

**File:** `client/src/hooks/useBatchFeedHistoryData.ts`  
**Severity:** Medium (data integrity)

**Description:**
The container name extraction logic assumes that any ` (` indicates location metadata to be removed. This causes legitimate parts of container names containing parentheses to be incorrectly truncated.

**Current Code:**
```typescript
// Removes everything after first " ("
return fullName ? fullName.split(' (')[0].trim() : fullName;
```

**Issue:** Container named "Tank A (Primary)" becomes "Tank A"

**Proposed Fix:**
```typescript
// Only remove location descriptions matching specific pattern
const locationPattern = /\s+\(.*(?:Sea Area|Location|Site).*\)$/;
return fullName ? fullName.replace(locationPattern, '').trim() : fullName;
```

**Steps to Reproduce:**
1. Create container with name containing parentheses: "Tank B (Backup System)"
2. View in feed history
3. Observe name truncated to "Tank B"

**Impact:** Container names incorrectly displayed, loss of information

---

## Bug 5: Batch Container Assignment Display Inconsistency 🟡 MEDIUM

**File:** `client/src/components/batch-management/BatchContainerView.tsx`  
**Severity:** Medium (inconsistent data display)

**Description:**
The batch container assignment fetching logic can lead to inconsistent data display. It fetches only active assignments if any exist, but all assignments (including inactive) if none are active. Additionally, the pagination loop's `hasMore` check might not guarantee progress, risking repeated page fetches until safety limit.

**Current Code:**
```typescript
let page = 1;
while (hasMore && page <= 20) {
  const response = await ApiService.apiV1BatchContainerAssignmentsList(...);
  allActiveAssignments = [...allActiveAssignments, ...response.results];
  hasMore = !!response.next;
  page++;
}
```

**Issues:**
1. Inconsistent logic: active-only vs all assignments
2. No progress validation in pagination loop (could get stuck)

**Proposed Fix:**
```typescript
let page = 1;
let previousPageCount = 0;

while (hasMore && page <= 20) {
  const response = await ApiService.apiV1BatchContainerAssignmentsList(...);
  
  // Safety: ensure we're making progress
  const newCount = allActiveAssignments.length + response.results.length;
  if (newCount === previousPageCount) {
    console.error('Pagination loop stuck at page', page);
    break;
  }
  previousPageCount = newCount;
  
  allActiveAssignments = [...allActiveAssignments, ...response.results];
  hasMore = !!response.next;
  page++;
}
```

**Steps to Reproduce:**
1. View batch with mix of active/inactive container assignments
2. Observe inconsistent display logic
3. (Edge case) API returns same page repeatedly - loop doesn't detect

**Impact:** Users see inconsistent data; potential infinite loop in edge cases

---

## Bug 6: Date Range Calculation Fails Daylight Saving Time 🟢 LOW

**File:** `client/src/hooks/useBatchFeedHistoryData.ts`  
**Severity:** Low (edge case)

**Description:**
The date range calculation for period filters uses millisecond arithmetic, which doesn't correctly handle daylight saving time transitions. This can lead to date ranges that are off by an hour. Additionally, custom date range logic requires both `from` and `to` to be present; otherwise, it clears both, potentially ignoring partially specified ranges.

**Current Code:**
```typescript
const dateRange = periodFilter === "7" 
  ? { from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), to: now }
  : // ... similar for other periods
```

**Issue:** DST transitions cause 1-hour discrepancies

**Proposed Fix:**
```typescript
import { subDays, startOfDay, endOfDay } from 'date-fns';

const dateRange = periodFilter === "7"
  ? { from: startOfDay(subDays(now, 7)), to: endOfDay(now) }
  : // ... use date-fns functions
```

**Steps to Reproduce:**
1. Set system to DST transition date
2. Filter feed history by "Last 7 days"
3. Observe date range off by 1 hour at DST boundary

**Impact:** Minimal - date ranges slightly off during DST transitions (2x/year)

---

## Prioritization

### 🔴 High Priority (Next Sprint)
- [ ] **Bug 1** - Container routing error (breaks navigation)

### 🟡 Medium Priority (Sprint +1)
- [ ] **Bug 2** - Container/stage ID display
- [ ] **Bug 3** - formatAreaKPIs null checks
- [ ] **Bug 4** - Container name parsing
- [ ] **Bug 5** - Assignment display inconsistency

### 🟢 Low Priority (Future)
- [ ] **Bug 6** - DST handling (edge case)

---

## Testing Recommendations

For each fix:
1. Add unit tests covering edge cases
2. Add integration tests for user flows
3. Manual testing with problematic data
4. Regression testing on related features

---

## Notes

- All bugs are **non-blocking** - do not affect core functionality
- Discovered during **post-merge code review** by Cursor bot
- Original PR #126 (Quality Enhancement) - 595 tests passing, 100% success rate
- These are **edge cases and UX improvements**, not critical failures

**Source:** https://github.com/aquarian247/AquaMind-Frontend/pull/126

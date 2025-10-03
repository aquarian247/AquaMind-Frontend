# Bug: NaN Warning in BatchHealthView - Missing Null Checks for Mortality Counts

## Issue Type
🐛 Bug Fix - Production Quality Issue

## Priority
**Medium** - Functional but produces console warnings that may mask other issues

## Description

The `BatchHealthView` component produces React warnings when rendering mortality statistics if the API returns mortality events with missing or null `count` fields:

```
Warning: Received NaN for the `children` attribute. If this is expected, cast the value to a string.
```

This occurs when displaying:
- Total Mortality count (line 374)
- Recent Mortality count (line 387)

## Location

**File:** `client/src/components/batch-management/BatchHealthView.tsx`  
**Lines:** 274-283 (calculation), 374 & 387 (rendering)

## Root Cause

The `reduce()` operations for calculating mortality statistics don't handle missing/null `count` values:

```typescript
// Current implementation (lines 274-283)
const totalMortality = mortalityEvents.reduce((sum, event) => sum + event.count, 0);
// ❌ If event.count is undefined/null, this produces NaN

const recentMortality = mortalityEvents
  .filter(event => {
    const eventDate = new Date(event.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return eventDate >= sevenDaysAgo;
  })
  .reduce((sum, event) => sum + event.count, 0);
  // ❌ Same issue - no null handling
```

When `event.count` is `undefined` or `null`, JavaScript evaluates `sum + undefined` or `sum + null` as `NaN`, which then propagates through the calculation and triggers React's warning when rendered.

## Expected Behavior

The component should gracefully handle missing `count` values by:
1. Treating missing/null counts as 0
2. Never producing NaN in calculations
3. Displaying valid numbers (0 or actual totals) in the UI
4. Not producing console warnings

## Proposed Solution

Add null coalescing to provide safe fallback values:

```typescript
// Proposed fix
const totalMortality = mortalityEvents.reduce((sum, event) => sum + (event.count || 0), 0);

const recentMortality = mortalityEvents
  .filter(event => {
    const eventDate = new Date(event.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return eventDate >= sevenDaysAgo;
  })
  .reduce((sum, event) => sum + (event.count || 0), 0);
```

This ensures:
- `undefined` → 0
- `null` → 0  
- `0` → 0
- Valid numbers → used as-is

## Steps to Reproduce

1. Navigate to Batch Management page
2. Select any batch
3. Click on the "Medical" tab to view `BatchHealthView`
4. Open browser console
5. Observe the NaN warning if mortality events have missing counts

## Environment

- **Browser:** Any (Chrome, Firefox, Safari)
- **Component:** `BatchHealthView.tsx`
- **Related Components:** Uses `ApiService.apiV1BatchMortalityEventsList()`

## Impact

- **User Experience:** No visible impact - numbers may show as blank or 0
- **Developer Experience:** Console warnings clutter debug output
- **Testing:** May mask legitimate warnings during development
- **Data Quality:** Indicates potential API data inconsistency

## Additional Context

### Why This Happens

The mortality events API may return entries without `count` fields if:
1. Backend validation allows null counts
2. Database has legacy data with missing values
3. API serialization omits null/undefined fields

### Related Code

**API Mapping (lines 178-191):**
```typescript
const mortalityEvents: MortalityEventView[] = mortalityData.map((event: any) => ({
  id: event.id,
  date: event.event_date || '',
  count: event.count,  // ❌ No fallback - can be undefined/null
  cause: event.cause || "UNKNOWN",
  description: event.description || "",
  containerName: /* ... */
}));
```

**Rendering (lines 374 & 387):**
```typescript
<div className="text-2xl font-bold">{totalMortality.toLocaleString()}</div>
// If totalMortality is NaN, React warns

<div className="text-2xl font-bold text-orange-600">{recentMortality}</div>
// If recentMortality is NaN, React warns
```

## Acceptance Criteria

- [ ] No NaN warnings in browser console when viewing BatchHealthView
- [ ] Total mortality displays valid number (0 or actual count)
- [ ] Recent mortality displays valid number (0 or actual count)
- [ ] Existing tests continue to pass
- [ ] New test case added for missing count values
- [ ] Consider adding similar null checks to other numeric calculations in the component

## Testing Recommendations

**Unit Test:**
```typescript
describe('BatchHealthView mortality calculations', () => {
  it('should handle missing count values gracefully', () => {
    const eventsWithMissingCounts = [
      { id: 1, date: '2025-10-01', count: 10, cause: 'DISEASE' },
      { id: 2, date: '2025-10-02', count: undefined, cause: 'UNKNOWN' },
      { id: 3, date: '2025-10-03', count: null, cause: 'INJURY' },
      { id: 4, date: '2025-10-04', count: 5, cause: 'OTHER' },
    ];
    
    const total = eventsWithMissingCounts.reduce((sum, event) => sum + (event.count || 0), 0);
    expect(total).toBe(15); // 10 + 0 + 0 + 5
    expect(total).not.toBeNaN();
  });
});
```

## Related Issues

- Check if other components have similar reduce operations without null handling
- Consider backend API improvement to ensure `count` is always a number (0 if not provided)
- Review TypeScript types - should `count` be `number` or `number | null | undefined`?

## Priority Justification

**Why Medium (not High):**
- Does not break functionality
- Users can still view mortality data
- Only affects developer console

**Why not Low:**
- Console warnings clutter debug output
- May mask other important warnings
- Indicates potential data quality issues
- Easy fix with high value

## Estimated Effort

**Time:** 15-30 minutes  
**Complexity:** Low  
**Files:** 1 (possibly 2 if adding tests)

## Labels

`bug`, `good-first-issue`, `frontend`, `batch-management`, `health-monitoring`


# Agent Prompt: Cursor Bot Bug Fixes

**Context:** You're fixing 6 edge-case bugs identified by Cursor bot during the quality enhancement PR review. These are production-ready fixes for a mature, well-tested codebase.

**Branch:** `feature/cursor-bot-fixes`  
**Base:** `main`  
**Priority:** High (Bug 1) → Medium (Bugs 2-5) → Low (Bug 6)

---

## 🎯 Your Mission

Fix 6 bugs identified by Cursor bot in [PR #126](https://github.com/aquarian247/AquaMind-Frontend/pull/126). All bugs are **non-blocking edge cases** but should be addressed for better UX and data integrity.

---

## 📋 Quick Start

```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend
git checkout main
git pull origin main
git checkout -b feature/cursor-bot-fixes

# Read the bug documentation
cat CURSOR_BOT_BUGS.md

# Review the files to be modified
ls client/src/pages/batch-details.tsx
ls client/src/features/infrastructure/utils/areaFormatters.ts
ls client/src/hooks/useBatchFeedHistoryData.ts
ls client/src/components/batch-management/BatchContainerView.tsx
```

---

## 🐛 Bugs to Fix (In Priority Order)

### 🔴 **HIGH PRIORITY - Do This First**

#### **Bug 1: Container ID Missing Causes Routing Error**
- **File:** `client/src/pages/batch-details.tsx`
- **Issue:** "View Details" button navigates to `/infrastructure/containers/undefined`
- **Fix:** Add validation before navigation + use router instead of `window.location.href`
- **Test:** Click "View Details" on container assignment without checking for undefined ID

**Expected Fix:**
```typescript
import { useLocation } from 'wouter';

// Inside component:
const [, navigate] = useLocation();

// In button handler:
const containerId = assignment.container?.id || assignment.container_id || assignment.container;

if (!containerId) {
  console.warn('Container ID not found for assignment', assignment);
  toast.error('Container details not available');
  return;
}

navigate(`/infrastructure/containers/${containerId}`);
```

---

### 🟡 **MEDIUM PRIORITY - Do These Next**

#### **Bug 2: Container and Stage IDs Display Inconsistency**
- **File:** `client/src/features/infrastructure/utils/areaFormatters.ts`
- **Issue:** Displays "Container 123" (raw ID) instead of "Unknown"
- **Fix:** Add type guard to check if value is object vs primitive

**Expected Fix:**
```typescript
const containerName = typeof assignment.container === 'object' 
  ? (assignment.container?.name || 'Unknown')
  : (assignment.container_name || 'Unknown');

const stageName = typeof assignment.lifecycle_stage === 'object'
  ? (assignment.lifecycle_stage?.name || 'Unknown')
  : (assignment.lifecycle_stage_name || 'Unknown');
```

---

#### **Bug 3: Inconsistent Null Checks in formatAreaKPIs**
- **File:** `client/src/features/infrastructure/utils/areaFormatters.ts`
- **Issue:** Tooltip shows "kg per fish" even when `avg_weight_kg = 0` (no data)
- **Fix:** Add `> 0` check to null validation

**Expected Fix:**
```typescript
const averageWeightTooltip = (avg_weight_kg !== null && avg_weight_kg !== undefined && avg_weight_kg > 0)
  ? "kg per fish"
  : "No weight data available";

// Apply same pattern to other metrics
const totalBiomassTooltip = (total_biomass_kg !== null && total_biomass_kg !== undefined && total_biomass_kg > 0)
  ? "Total biomass in kg"
  : "No biomass data available";
```

---

#### **Bug 4: Container Name Parsing Fails with Parentheses**
- **File:** `client/src/hooks/useBatchFeedHistoryData.ts`
- **Issue:** "Tank A (Primary)" becomes "Tank A" (legitimate parentheses removed)
- **Fix:** Use regex to only remove location-specific patterns

**Expected Fix:**
```typescript
// Find the container name extraction logic (around line 150-200)
const extractContainerName = (fullName: string | undefined): string => {
  if (!fullName) return '';
  
  // Only remove location descriptions matching specific pattern
  const locationPattern = /\s+\(.*(?:Sea Area|Location|Site|Area \d+).*\)$/;
  return fullName.replace(locationPattern, '').trim();
};

// Apply to container names mapping
.map(event => extractContainerName(event.container?.full_name || event.container_name))
```

---

#### **Bug 5: Batch Container Assignment Display Inconsistency**
- **File:** `client/src/components/batch-management/BatchContainerView.tsx`
- **Issue:** Pagination loop might not guarantee progress (potential infinite loop)
- **Fix:** Add progress validation in pagination loop

**Expected Fix:**
```typescript
let page = 1;
let previousPageCount = 0;
const maxPages = 20;

while (hasMore && page <= maxPages) {
  const response = await ApiService.apiV1BatchContainerAssignmentsList(
    batchId,
    true, // active only
    undefined,
    undefined,
    page
  );
  
  // Safety: ensure we're making progress
  const newCount = allActiveAssignments.length + response.results.length;
  if (newCount === previousPageCount) {
    console.error('Pagination loop stuck at page', page, 'with', newCount, 'assignments');
    break;
  }
  previousPageCount = newCount;
  
  allActiveAssignments = [...allActiveAssignments, ...response.results];
  hasMore = !!response.next;
  page++;
}

console.debug('Fetched', allActiveAssignments.length, 'active assignments across', page - 1, 'pages');
```

---

### 🟢 **LOW PRIORITY - Do If Time Permits**

#### **Bug 6: Date Range Calculation Fails Daylight Saving Time**
- **File:** `client/src/hooks/useBatchFeedHistoryData.ts`
- **Issue:** Millisecond arithmetic doesn't handle DST (1-hour discrepancy 2x/year)
- **Fix:** Use `date-fns` functions instead of millisecond math

**Expected Fix:**
```typescript
import { subDays, startOfDay, endOfDay } from 'date-fns';

// Replace millisecond calculations with date-fns
const dateRange = (() => {
  const now = new Date();
  
  switch (periodFilter) {
    case "7":
      return { from: startOfDay(subDays(now, 7)), to: endOfDay(now) };
    case "30":
      return { from: startOfDay(subDays(now, 30)), to: endOfDay(now) };
    case "90":
      return { from: startOfDay(subDays(now, 90)), to: endOfDay(now) };
    case "custom":
      return customDateRange.from && customDateRange.to
        ? { from: startOfDay(customDateRange.from), to: endOfDay(customDateRange.to) }
        : { from: undefined, to: undefined };
    default:
      return { from: undefined, to: undefined };
  }
})();
```

---

## ✅ Testing Requirements

### For Each Bug Fix:

1. **Unit Tests (Required)**
   - Add test to existing `.test.ts` file or create new one
   - Cover the bug scenario + edge cases
   - Ensure 100% pass rate

2. **Manual Testing (Required for Bugs 1-5)**
   - Test in browser with actual data
   - Verify fix works as expected
   - Check for regressions

3. **Edge Case Testing**
   - Test with null/undefined values
   - Test with empty data
   - Test with malformed data

---

## 📝 Testing Checklist

### Bug 1 Testing:
```bash
# Manual test in browser:
# 1. Navigate to batch details page
# 2. Find container assignment without proper ID
# 3. Click "View Details" button
# 4. Verify: Toast error appears (not navigation to undefined)
# 5. Verify: No console errors
# 6. Test with valid ID to ensure normal flow still works
```

### Bug 2 Testing:
```bash
# Manual test in browser:
# 1. Navigate to area details page
# 2. Find assignments with primitive IDs (not objects)
# 3. Verify: Shows "Unknown" instead of "Container 123"
# 4. Check console for any warnings
```

### Bug 3 Testing:
```bash
# Manual test in browser:
# 1. Navigate to area KPIs view
# 2. Find area with avg_weight_kg = 0 or null
# 3. Hover over weight metric
# 4. Verify: Tooltip says "No weight data available"
```

### Bug 4 Testing:
```bash
# Manual test in browser:
# 1. Create container with name "Tank A (Primary System)"
# 2. View in feed history
# 3. Verify: Full name displayed, not truncated to "Tank A"
# 4. Test with location pattern like "Ring-20 (Sea Area 2)"
# 5. Verify: Location IS removed, showing "Ring-20"
```

### Bug 5 Testing:
```bash
# Manual test in browser:
# 1. View batch with many container assignments (force pagination)
# 2. Check console for debug logs
# 3. Verify: All assignments displayed
# 4. Check console: No "Pagination loop stuck" errors
```

### Bug 6 Testing:
```bash
# Unit test (DST is hard to test manually):
# 1. Add test with mocked DST transition date
# 2. Verify date ranges are correct
# 3. Test all period filters (7, 30, 90 days)
```

---

## 🎯 Success Criteria

Before submitting PR:

### Code Quality:
- [ ] All 6 bugs fixed (or documented why not)
- [ ] 0 TypeScript errors (`npm run type-check`)
- [ ] All tests passing (`npm run test`)
- [ ] No new complexity warnings (`npm run complexity:analyze`)

### Testing:
- [ ] Unit tests added for each fix
- [ ] Manual browser testing completed for Bugs 1-5
- [ ] Edge cases tested
- [ ] No regressions found

### Documentation:
- [ ] Update `CURSOR_BOT_BUGS.md` with checkmarks ✓ for completed bugs
- [ ] Add comments in code explaining the fixes
- [ ] Create clear commit messages for each bug

---

## 📦 Recommended Workflow

### Phase 1: Setup & High Priority (30 min)
```bash
# Create branch
git checkout -b feature/cursor-bot-fixes

# Fix Bug 1 (HIGH priority)
# 1. Read CURSOR_BOT_BUGS.md Bug 1 section
# 2. Open client/src/pages/batch-details.tsx
# 3. Implement fix (add validation + use router)
# 4. Test in browser
# 5. Commit: "fix(bug-1): add container ID validation before navigation"
```

### Phase 2: Medium Priority Bugs (1-2 hours)
```bash
# Fix Bugs 2-5 in order
# For each bug:
# 1. Read bug description
# 2. Open file
# 3. Implement fix
# 4. Add/update tests
# 5. Manual test in browser
# 6. Commit with clear message

# Example commit messages:
git commit -m "fix(bug-2): use type guard for container/stage ID display"
git commit -m "fix(bug-3): improve null checks in formatAreaKPIs tooltips"
git commit -m "fix(bug-4): preserve container names with legitimate parentheses"
git commit -m "fix(bug-5): add progress validation to pagination loop"
```

### Phase 3: Low Priority & Testing (30 min)
```bash
# Fix Bug 6 if time permits
git commit -m "fix(bug-6): use date-fns for DST-safe date range calculation"

# Run all quality checks
npm run type-check  # Should pass
npm run test        # Should pass (all 595+ tests)
npm run complexity:analyze  # Should show 1 warning (unchanged)
```

### Phase 4: Documentation & PR (15 min)
```bash
# Update bug tracking doc
# Mark completed bugs with ✓ in CURSOR_BOT_BUGS.md

# Push branch
git push origin feature/cursor-bot-fixes

# Create PR with description:
# - List bugs fixed
# - Reference CURSOR_BOT_BUGS.md
# - Note any bugs deferred (if Bug 6 skipped)
# - Mention testing completed
```

---

## 🎨 Code Style Guidelines

Follow existing patterns in the codebase:

### 1. Type Safety
```typescript
// ✅ GOOD: Type guard before access
if (typeof container === 'object' && container?.id) {
  navigate(`/containers/${container.id}`);
}

// ❌ BAD: Unsafe access
navigate(`/containers/${container.id}`); // might be undefined
```

### 2. Error Handling
```typescript
// ✅ GOOD: User-friendly error + console warning
if (!containerId) {
  console.warn('Container ID not found for assignment', assignment);
  toast.error('Container details not available');
  return;
}

// ❌ BAD: Silent failure
if (!containerId) return;
```

### 3. Comments
```typescript
// ✅ GOOD: Explain why, not what
// Only remove location metadata, preserve legitimate parentheses in names
const locationPattern = /\s+\(.*(?:Sea Area|Location).*\)$/;

// ❌ BAD: Obvious comment
// Remove parentheses from name
const name = fullName.split('(')[0];
```

---

## 📚 Reference Files

### Key Files to Review:
1. **Bug tracking:** `CURSOR_BOT_BUGS.md` (detailed descriptions)
2. **Quality docs:** `docs/deprecated/quality_enhancement/` (context on codebase)
3. **Test patterns:** Existing `.test.ts` files in same directories

### Codebase Context:
- **Testing framework:** Vitest + React Testing Library
- **Router:** Wouter (not React Router)
- **API client:** Generated from OpenAPI spec (`client/src/api/generated`)
- **Date library:** `date-fns` (already installed)
- **Toast notifications:** Shadcn/ui toast component

---

## ⚠️ Common Pitfalls to Avoid

### 1. Don't Break Existing Tests
```bash
# Before making changes:
npm run test  # Note the count (should be 595 passing)

# After your changes:
npm run test  # Should still be 595+ passing
```

### 2. Don't Add New Complexity Warnings
```bash
# Check complexity before and after:
npm run complexity:analyze
# Should show 1 warning (formatAreaKPIs CCN 18) - don't add more
```

### 3. Don't Use `window.location.href`
```typescript
// ❌ BAD: Causes full page reload, bypasses router
window.location.href = `/containers/${id}`;

// ✅ GOOD: Use wouter router
const [, navigate] = useLocation();
navigate(`/containers/${id}`);
```

### 4. Don't Skip Manual Testing
- Unit tests alone aren't enough for UI bugs
- Test in actual browser with real data
- Verify edge cases (null, undefined, empty)

---

## 🎯 Expected Outcome

### Deliverables:
- [ ] 5-6 bugs fixed (Bug 6 optional)
- [ ] 5-6 new unit tests added
- [ ] All existing tests still passing (595+)
- [ ] 0 TypeScript errors
- [ ] 0 new complexity warnings
- [ ] Manual testing completed
- [ ] `CURSOR_BOT_BUGS.md` updated with checkmarks
- [ ] Clean PR with clear commit history

### PR Description Template:
```markdown
# Cursor Bot Bug Fixes

Fixes 5-6 edge-case bugs identified in PR #126.

## Bugs Fixed:
- ✅ Bug 1: Container ID validation (HIGH)
- ✅ Bug 2: Container/stage ID display
- ✅ Bug 3: formatAreaKPIs null checks
- ✅ Bug 4: Container name parsing
- ✅ Bug 5: Pagination loop safety
- ⏭️ Bug 6: DST handling (deferred - low priority)

## Testing:
- Unit tests: 600+ passing (up from 595)
- Manual testing: All bugs verified fixed in browser
- Edge cases: Tested null/undefined/empty values
- Regressions: None found

## Quality Checks:
- ✅ Type check: 0 errors
- ✅ Tests: 100% pass rate
- ✅ Complexity: 1 warning (unchanged)

Reference: CURSOR_BOT_BUGS.md
```

---

## 🚀 Ready to Start?

**Your first command should be:**
```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend
git checkout main
git pull origin main
cat CURSOR_BOT_BUGS.md  # Read full bug descriptions
git checkout -b feature/cursor-bot-fixes
```

**Then tackle Bug 1 first** (HIGH priority, breaks navigation).

Good luck! 🎯 These are straightforward fixes in a well-tested codebase. You've got this! 💪

---

**Estimated Time:** 2-3 hours total
- Bug 1: 30 min (HIGH priority)
- Bugs 2-5: 1-2 hours (MEDIUM priority)
- Bug 6: 30 min (LOW priority, optional)
- Testing & PR: 30 min

**Source:** https://github.com/aquarian247/AquaMind-Frontend/pull/126


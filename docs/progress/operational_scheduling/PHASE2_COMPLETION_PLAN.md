# Production Planner - Phase 2 Completion Plan

**Created**: December 3, 2025  
**Branch**: `feature/operational-scheduling-frontend`  
**Status**: 4 items remaining to complete Phase 2

---

## 📚 Required Reading (Before Starting)

| Document | Location | Purpose |
|----------|----------|---------|
| Frontend Implementation Summary | `AquaMind-Frontend/docs/progress/operational_scheduling/FRONTEND_IMPLEMENTATION_SUMMARY.md` | Current state, bugs fixed, file locations |
| UI Specification | `AquaMind-Frontend/docs/progress/operational_scheduling/operational_scheduling_ui_specification.md` | Design requirements, Gantt chart specs |
| Data Model | `AquaMind/aquamind/docs/database/data_model.md` | Section 4.12 - Planning app schema |
| Backend Implementation Plan | `AquaMind/aquamind/docs/progress/operational_scheduling/operational_scheduling_implementation_plan.md` | Full context, Phase 1-3 details |

---

## 🎯 Remaining Deliverables

### 1. ✅ Verify Edit Activity Workflow
**Priority**: High | **Effort**: 15 min

**What Exists**:
- `PlannedActivityForm.tsx` handles both create and edit modes
- `PlannedActivityDetailModal.tsx` has Edit button that sets `selectedActivity`

**What to Test**:
1. Open detail modal → Click "Edit"
2. Modify fields (due_date, notes, activity_type)
3. Save → Verify toast appears and timeline updates

**Potential Issue**:
The form resets on close. Check `isCreateModalOpen && selectedActivity` logic in `ProductionPlannerPage.tsx` line 234 - this may prevent edit from working correctly.

---

### 2. ✅ Verify Batch Detail Activities Tab Integration
**Priority**: High | **Effort**: 15 min

**What Exists**:
- `BatchPlannedActivitiesTab.tsx` - component ready
- `batch-details.tsx` line 669 - integrated as "activities" tab

**What to Test**:
1. Navigate to `/batch-management` → Click batch `FI-2024-001`
2. Click "Activities" tab (8th tab)
3. Verify scenario dropdown filter works
4. Verify activities table displays
5. Click activity row → Verify detail modal opens

**Critical**: The tab expects `batchId` and `batchNumber` props. Verify the batch response includes `id` field.

---

### 3. ✅ Verify Scenario Detail Planned Activities Summary
**Priority**: High | **Effort**: 15 min

**What Exists**:
- `ScenarioPlannedActivitiesSummary.tsx` - component ready
- `ScenarioDetailPage.tsx` line 338 - integrated in overview section

**What to Test**:
1. Navigate to `/scenario-planning` → Click "Baseline Projection - FI-2024-001"
2. Scroll to "Planned Activities" section
3. Verify KPI summary shows (upcoming, overdue, completed counts)
4. Click "View Full Planner" link → Should navigate with scenario pre-selected

**Critical**: Component uses `apiRequest()` with `?all=true` - same pattern as main page.

---

### 4. 🆕 Implement Timeline/Gantt Chart View
**Priority**: High | **Effort**: 2-3 hours

**Current State**:
- `ProductionPlannerTimeline.tsx` is a LIST view (batch-grouped, expandable)
- NO calendar/Gantt visualization exists

**Requirements** (from UI spec):
- Horizontal timeline with dates on X-axis
- Activities as bars positioned by due_date
- Color-coded by activity_type
- Click bar → Open detail modal
- Scroll/zoom for date range

**Implementation Options**:

#### Option A: Use react-calendar-timeline (Recommended)
```bash
npm install react-calendar-timeline moment
```
- Well-maintained, 2K+ GitHub stars
- Supports groups (batches) and items (activities)
- Built-in zoom, scroll, and click handlers
- Minimal CSS required

#### Option B: Use vis-timeline
```bash
npm install vis-timeline vis-data
```
- More powerful but heavier (~300KB)
- Better for complex Gantt features
- Requires more setup

#### Option C: Build with CSS Grid
- No dependencies
- Full control over styling
- More development time

**Recommended Approach (Option A)**:

1. **Create new component**: `ProductionPlannerGanttView.tsx`

2. **Data transformation needed**:
```typescript
// Transform PlannedActivity[] to timeline format
interface TimelineGroup { id: number; title: string; }
interface TimelineItem { 
  id: number; 
  group: number; 
  title: string; 
  start_time: Date; 
  end_time: Date; 
  itemProps?: { style: { background: string } };
}
```

3. **Add view toggle to ProductionPlannerPage**:
- State: `viewMode: 'list' | 'gantt'`
- Toggle buttons above timeline area
- Render `ProductionPlannerTimeline` or `ProductionPlannerGanttView` based on mode

4. **Color mapping** (use existing helper):
```typescript
// From activityHelpers.ts - getActivityTypeBadgeVariant()
const colorMap: Record<string, string> = {
  VACCINATION: '#3b82f6',    // blue
  TREATMENT: '#ef4444',      // red
  TRANSFER: '#8b5cf6',       // purple
  SAMPLING: '#22c55e',       // green
  // ... etc
};
```

5. **Key UX considerations**:
- Default date range: today - 7 days to today + 30 days
- Activities with no explicit end_date: show as 1-day bar
- Click handler: `onItemClick={(itemId) => setSelectedActivity(...)}`

**Files to modify**:
- `ProductionPlannerPage.tsx` - Add view toggle state and rendering logic
- `activityHelpers.ts` - Add color hex values export if needed
- Create `ProductionPlannerGanttView.tsx`

---

## 📁 Key File Locations

```
client/src/features/production-planner/
├── api/api.ts                          # Query hooks, invalidation
├── components/
│   ├── BatchPlannedActivitiesTab.tsx   # Batch detail integration
│   ├── PlannedActivityDetailModal.tsx  # View + actions
│   ├── PlannedActivityForm.tsx         # Create/Edit form
│   ├── ProductionPlannerKPIDashboard.tsx
│   ├── ProductionPlannerTimeline.tsx   # Current LIST view
│   ├── ProductionPlannerGanttView.tsx  # TO BE CREATED
│   └── ScenarioPlannedActivitiesSummary.tsx # Scenario integration
├── pages/
│   └── ProductionPlannerPage.tsx       # Main page
├── types/index.ts                       # TypeScript interfaces
└── utils/activityHelpers.ts            # KPI calc, filtering, colors
```

---

## 🧪 Verification Checklist

After completing all items, verify:

- [ ] Edit activity → Save → Timeline updates in real-time
- [ ] Batch Detail → Activities tab shows activities for that batch
- [ ] Scenario Detail → Summary section shows correct counts
- [ ] Gantt view renders activities as horizontal bars
- [ ] Gantt view → Click bar → Detail modal opens
- [ ] Toggle between List and Gantt views works
- [ ] Mobile: Gantt hidden or simplified (list view default)

---

## ⚠️ Known Gotchas

1. **Query key mismatch**: Main page uses custom `apiRequest()` with `?all=true` param, not the generated client. Make sure Gantt view uses same data source.

2. **Date handling**: Activities have `due_date` (string "YYYY-MM-DD"). Parse with `new Date(activity.due_date)` or use date-fns.

3. **Empty state**: If scenario has no activities, Gantt should show empty state, not crash.

4. **Edit form state bug**: Check if `selectedActivity` is properly passed to form when clicking Edit. The current logic at line 234 may need adjustment.

---

## 🏁 Definition of Done

Phase 2 is complete when:
1. All verification checklist items pass
2. No console errors in browser
3. All 4 deliverables working on desktop and tablet
4. Documentation updated with completion status
5. Branch pushed and ready for PR

---

## 📝 Estimated Total Time

| Task | Time |
|------|------|
| Verify Edit workflow | 15 min |
| Verify Batch tab | 15 min |
| Verify Scenario summary | 15 min |
| Implement Gantt view | 2-3 hours |
| **Total** | **3-4 hours** |

---

*Last updated: December 3, 2025*


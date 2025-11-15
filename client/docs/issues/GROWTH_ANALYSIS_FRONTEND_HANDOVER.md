# Growth Analysis Frontend - Handover Document

**Issue**: Backend #112 / Frontend TBD  
**Branch**: Backend complete on `feature/batch-growth-assimilation-112`  
**Date**: November 15, 2025  
**For**: Frontend Agent (Phase 7)

---

## 🎯 Mission

Build the **Growth Analysis page** for batch management - a comprehensive chart showing three overlays:
1. **Measured Samples** (actual weights recorded by operators)
2. **Scenario Projection** (planned/modeled growth)
3. **Actual Daily States** (reality assimilated from measurements + models)

This is **the crux of AquaMind** - giving farm managers day-to-day visibility into actual vs. planned performance.

**Status**: Backend complete (Phases 1-4, 6). Phase 7 is frontend UI implementation.

---

## ✅ What's Ready (Backend Complete)

### Backend API Endpoints

**Primary Endpoint**: `GET /api/v1/batch/batches/{id}/combined-growth-data/`

**Returns**:
```typescript
{
  batch_id: number;
  batch_number: string;
  species: string;
  lifecycle_stage: string;
  start_date: string;
  status: string;
  
  scenario: {
    id: number;
    name: string;
    start_date: string;
    duration_days: number;
    initial_count: number;
    initial_weight: number;
  };
  
  growth_samples: Array<{
    date: string;
    avg_weight_g: number;
    sample_size: number;
    assignment_id: number;
    container_name: string;
    condition_factor?: number;
  }>;
  
  scenario_projection: Array<{
    date: string;
    day_number: number;
    avg_weight_g: number;
    population: number;
    biomass_kg: number;
  }>;
  
  actual_daily_states: Array<{
    date: string;
    day_number: number;
    avg_weight_g: number;
    population: number;
    biomass_kg: number;
    anchor_type: 'growth_sample' | 'transfer' | 'vaccination' | null;
    assignment_id: number;
    container_name: string;
    confidence_scores: {
      temp: number;      // 0.0-1.0
      mortality: number; // 0.0-1.0
      weight: number;    // 0.0-1.0
    };
    sources: {
      temp: 'measured' | 'interpolated' | 'profile';
      mortality: 'actual' | 'model';
      weight: 'growth_sample' | 'transfer' | 'vaccination' | 'tgc_computed';
    };
  }>;
  
  container_assignments: Array<{
    id: number;
    container_name: string;
    container_type: string;
    arrival_date: string;
    departure_date?: string;
    population_count: number;
    avg_weight_g: number;
    biomass_kg: number;
    lifecycle_stage: string;
  }>;
  
  date_range: {
    start: string;
    end: string;
    granularity: 'daily' | 'weekly';
  };
}
```

**Query Parameters**:
- `start_date`: ISO date (YYYY-MM-DD), default = batch start date
- `end_date`: ISO date (YYYY-MM-DD), default = today
- `assignment_id`: Filter to specific container (optional)
- `granularity`: 'daily' or 'weekly', default = 'daily'

**Admin Endpoints**:
- `POST /api/v1/batch/batches/{id}/pin-scenario/` - Body: `{"scenario_id": 123}`
- `POST /api/v1/batch/batches/{id}/recompute-daily-states/` - Body: `{"start_date": "...", "end_date": "..."}`

---

## 🎨 UI Requirements

### Page Location
`client/src/features/batch-management/pages/GrowthAnalysisPage.tsx`

### Visual Design

**Layout** (Full page):
```
┌─────────────────────────────────────────────────────────────┐
│ Header: "Growth Analysis - Batch BTH-2024-001"              │
│ [Back to Batch] [Scenario: Baseline v] [Pin Scenario]       │
├─────────────────────────────────────────────────────────────┤
│ Controls:                                                    │
│ [Date Range: Jan 1 - Dec 31] [Container: All v] [Daily v]  │
│ [☑ Samples] [☑ Scenario] [☑ Actual]                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    📈 Line Chart (Recharts)                 │
│                                                              │
│  Weight (g)                                                  │
│  ↑                                                           │
│  500 ─                      ●───●              (Actual)     │
│  400 ─              ━━━━━━━━━━━━━━━━          (Scenario)   │
│  300 ─      ●                                  (Samples)     │
│  200 ─  ●                                                    │
│  100 ─●                                                      │
│    └────────────────────────────────────────→ Time          │
│      Jan  Feb  Mar  Apr  May  Jun  Jul  Aug                 │
│                                                              │
│  Hover tooltip shows:                                        │
│  • Date, Value                                               │
│  • Source (measured/profile/model)                           │
│  • Confidence score                                          │
│  • Anchor indicator                                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Stats Panel (below chart):                                   │
│ ┌──────────────┬──────────────┬──────────────┐             │
│ │ Current      │ Projected    │ Variance     │             │
│ │ 450g         │ 480g         │ -6.3%        │             │
│ └──────────────┴──────────────┴──────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### Components to Build

1. **GrowthAnalysisPage.tsx** (main page component)
   - Fetches combined data
   - Manages chart state (series visibility, date range, container filter)
   - Handles error states

2. **GrowthAnalysisChart.tsx** (chart component)
   - Renders 3 series using Recharts
   - Custom tooltip with provenance
   - Responsive design
   - Handles loading/empty states

3. **GrowthAnalysisControls.tsx** (control panel)
   - Series toggles (checkboxes)
   - Date range picker (shadcn DateRangePicker)
   - Container selector (dropdown)
   - Granularity toggle (Daily/Weekly)

4. **ScenarioPinDialog.tsx** (scenario selector)
   - Lists available scenarios
   - Pin button
   - Success/error toast

5. **ProvenanceTooltip.tsx** (custom tooltip)
   - Shows data source (measured/profile/model)
   - Shows confidence score (0-100%)
   - Anchor indicator (star icon)
   - Color-coded by confidence

---

## 📚 Essential Reading

### Before Starting
1. **This handover doc** - YOU ARE HERE
2. **Backend API doc**: `AquaMind/aquamind/docs/progress/batch_growth_assimilation/PHASE_6_COMPLETE.md`
3. **Frontend code guidelines**: `.cursor/rules` (already in your context)
4. **Chart component patterns**: `client/src/components/charts/` (existing examples)

### Reference Docs
- **API Standards**: `AquaMind/aquamind/docs/quality_assurance/api_standards.md`
- **RBAC Frontend**: `client/docs/RBAC_FRONTEND_IMPLEMENTATION.md` (for auth/permissions)
- **Technical Design**: `AquaMind/aquamind/docs/progress/batch_growth_assimilation/technical_design.md`

---

## 🚀 Implementation Steps

### Step 1: Regenerate TypeScript Client (15 min)

```bash
cd /path/to/AquaMind-Frontend/client
npm run generate:api
```

**What this does**:
- Fetches latest `api/openapi.yaml` from backend
- Generates TypeScript types and API service methods
- Creates `client/src/api/generated/` files

**Expected new types**:
```typescript
// Auto-generated from OpenAPI
interface ActualDailyAssignmentState { /* ... */ }
interface GrowthAnalysisCombined { /* ... */ }
```

**Verify**: Check `client/src/api/generated/services/ApiService.ts` for:
- `batchCombinedGrowthData()`
- `batchPinScenario()`
- `batchRecomputeDailyStates()`

### Step 2: Create API Hook (30 min)

**File**: `client/src/features/batch-management/api/growth-assimilation.ts`

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';

export interface GrowthDataOptions {
  startDate?: string;
  endDate?: string;
  assignmentId?: number;
  granularity?: 'daily' | 'weekly';
}

export function useCombinedGrowthData(
  batchId: number,
  options?: GrowthDataOptions
) {
  return useQuery({
    queryKey: ['batch', batchId, 'combined-growth-data', options],
    queryFn: () => ApiService.batchCombinedGrowthData(batchId, options),
    enabled: !!batchId,
  });
}

export function usePinScenario(batchId: number) {
  return useMutation({
    mutationFn: (scenarioId: number) => 
      ApiService.batchPinScenario(batchId, { scenario_id: scenarioId }),
    onSuccess: () => {
      // Invalidate combined data query to refetch
      queryClient.invalidateQueries(['batch', batchId, 'combined-growth-data']);
    },
  });
}
```

### Step 3: Create Chart Component (2-3 hours)

**File**: `client/src/features/batch-management/components/GrowthAnalysisChart.tsx`

**Charting Library**: Use Recharts (already in project per guidelines)

**Key Features**:
- 3 lines: Samples (scatter+line), Scenario (dashed line), Actual (solid line)
- X-axis: Date
- Y-axis: Weight (g)
- Legend with series toggles
- Custom tooltip (shows provenance)
- Responsive (ResponsiveContainer)
- Loading skeleton
- Empty state

**Color Palette**:
- Samples: `#10b981` (emerald) - measured truth
- Scenario: `#6366f1` (indigo) - planned
- Actual: `#f59e0b` (amber) - assimilated reality

**Reference**: Look at existing charts in `client/src/components/charts/` for patterns

### Step 4: Create Controls Component (1 hour)

**File**: `client/src/features/batch-management/components/GrowthAnalysisControls.tsx`

**Controls**:
1. **Series Toggles**: Checkboxes for Samples/Scenario/Actual
2. **Date Range**: DateRangePicker from shadcn/ui
3. **Container Selector**: Dropdown (All / Tank-001 / Tank-002)
4. **Granularity**: Radio buttons or toggle (Daily/Weekly)

**State Management**: Local React state, passed to parent via callbacks

### Step 5: Create Main Page (1 hour)

**File**: `client/src/features/batch-management/pages/GrowthAnalysisPage.tsx`

**Pattern**: Follow existing page patterns in `client/src/features/batch-management/pages/`

```typescript
export function GrowthAnalysisPage() {
  const { batchId } = useParams();
  const [options, setOptions] = useState<GrowthDataOptions>({
    granularity: 'daily',
  });
  
  const { data, isLoading, error } = useCombinedGrowthData(batchId, options);
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState />;
  
  return (
    <div className="container mx-auto py-6">
      <GrowthAnalysisHeader batch={data} />
      <GrowthAnalysisControls 
        options={options} 
        onChange={setOptions}
        containers={data.container_assignments}
      />
      <GrowthAnalysisChart data={data} options={options} />
      <GrowthAnalysisStats data={data} />
    </div>
  );
}
```

### Step 6: Add Route (15 min)

**File**: `client/src/router/index.tsx`

```typescript
{
  path: '/batch/:batchId/growth-analysis',
  element: <GrowthAnalysisPage />,
  // Or lazy load:
  element: lazy(() => import('@/features/batch-management/pages/GrowthAnalysisPage')),
}
```

### Step 7: Add Navigation Link (15 min)

**File**: Batch detail page or batch list

Add "View Growth Analysis" button/link that navigates to `/batch/{id}/growth-analysis`

### Step 8: Test (1 hour)

- Test with real batch data (use Faroe Islands test data)
- Test series toggles
- Test date range filtering
- Test container drilldown
- Test granularity switching
- Test provenance tooltips
- Test loading/error states

---

## 🧠 Critical Context for Success

### API Endpoint Details

**Endpoint**: `GET /api/v1/batch/batches/{id}/combined-growth-data/`

**Important Field Names**:
- Scenario primary key: `scenario.id` (NOT `scenario.scenario_id` - serializer handles this)
- Assignment FK: `assignment_id` (NOT `assignment.id`)
- Date fields: ISO strings `"2024-01-15"` (parse with `new Date()`)

**Date Filtering**:
```typescript
// Frontend sends ISO strings
const params = {
  start_date: startDate.toISOString().split('T')[0],  // "2024-01-15"
  end_date: endDate.toISOString().split('T')[0],
  granularity: 'daily',
};
```

**Granularity Impact**:
- `daily`: Full dataset (900 rows for 900-day batch)
- `weekly`: Downsampled (128 rows for 900-day batch, 7x smaller)
- Use `weekly` by default for long date ranges (>180 days)

### Data Shapes

**Growth Samples** (measured points):
- Scattered data (not every day)
- High confidence (1.0)
- Render as scatter plot + markers

**Scenario Projection** (planned):
- Every day (or every 7th day if weekly)
- Smooth curve
- Render as dashed line

**Actual Daily States** (assimilated):
- Every day (or every 7th day if weekly)
- Variable confidence (0.0-1.0)
- Render as solid line
- Color opacity based on confidence

**Anchors** (special points):
- `anchor_type` is not null
- Render with star icon or marker
- Tooltip shows anchor type

### Provenance & Confidence

**Sources** (where data came from):
- `measured`: Real sensor/manual data (confidence 1.0)
- `interpolated`: Between measurements (confidence 0.7)
- `profile`: Default temperature profile (confidence 0.5)
- `model`: Mortality model (confidence 0.4)
- `tgc_computed`: TGC calculation (confidence 0.8-0.4, decays over time)

**Confidence Scores**:
- 1.0 = measured truth
- 0.9-0.7 = high confidence
- 0.6-0.4 = medium confidence
- <0.4 = low confidence

**UI Representation**:
- Color opacity: Alpha channel based on confidence
- Tooltip badge: "High confidence (measured)" vs "Low confidence (model)"
- Line style: Solid for high confidence, dotted for low

---

## 🎨 Design Guidelines

### Chart Design

**Follow AquaMind UI patterns**:
- Tailwind for styling (no plain CSS)
- Shadcn/ui components for controls
- Dark mode support (use theme tokens)
- Responsive design (mobile friendly)

**Chart Libraries**:
- **Recharts** (preferred per guidelines) - React-native, composable
- Chart.js (alternative) - More features, harder to customize

**Accessibility**:
- Keyboard navigation
- ARIA labels
- Color-blind friendly palette
- Alternative text for screen readers

### Empty States

**No Scenario**:
```tsx
<EmptyState
  icon={<ChartNoDataIcon />}
  title="No Scenario Available"
  description="Pin a scenario to this batch to see growth projections and actual performance."
  action={<Button onClick={openScenarioDialog}>Select Scenario</Button>}
/>
```

**No Data Yet**:
```tsx
<EmptyState
  title="No Growth Data Available"
  description="Record growth samples to see actual performance over time."
  action={<Button onClick={goToSampling}>Record Sample</Button>}
/>
```

### Loading States

Use Suspense + skeleton loaders:
```tsx
<Suspense fallback={<ChartSkeleton />}>
  <GrowthAnalysisChart data={data} />
</Suspense>
```

---

## ⚠️ Pitfalls & Gotchas (Lessons Learned)

### From Backend Implementation

#### 1. 🐛 RBAC Geography Filtering

**Issue**: API returns 404 even though batch exists

**Cause**: User's geography doesn't match batch's geography

**Solution**:
- Admin users with `geography='ALL'` see everything
- Regular users only see their geography
- Frontend should handle 404 gracefully (show "Access Denied" not "Not Found")

**Code**:
```typescript
if (error?.status === 404) {
  // Could be not found OR permission denied
  return <AccessDeniedOrNotFound />;
}
```

#### 2. 🐛 Date Format Consistency

**Issue**: Date parsing errors

**Cause**: Backend expects `YYYY-MM-DD`, not ISO timestamps

**Solution**:
```typescript
// ✅ CORRECT
const dateStr = date.toISOString().split('T')[0];  // "2024-01-15"

// ❌ WRONG
const dateStr = date.toISOString();  // "2024-01-15T00:00:00.000Z"
```

#### 3. 🐛 Primary Key Naming

**Issue**: Scenario ID mismatches

**Backend uses**: `scenario.scenario_id` (model PK)  
**API returns**: `scenario.id` (serializer normalizes)

**Solution**: Use API response as-is, don't second-guess field names

#### 4. 🐛 Large Data Sets

**Issue**: 900-day batch = 900 rows = slow chart

**Solution**:
- Default to `weekly` for date ranges >180 days
- Show "Switch to Daily" button for zoomed views
- Use Recharts `syncId` for multi-chart coordination

**Code**:
```typescript
const granularity = (end - start) > 180 ? 'weekly' : 'daily';
```

#### 5. 🐛 No Data vs. Loading

**Issue**: Chart renders before data loads, flickers

**Solution**:
```typescript
if (isLoading) return <Skeleton />;
if (!data) return <EmptyState />;
// Now render chart - data definitely exists
```

### From Frontend Context

#### 6. 🎨 Chart Performance

**Issue**: Re-rendering entire chart on every state change

**Solution**:
- Memoize chart data: `useMemo(() => transformData(raw), [raw])`
- Lazy load chart component: `const Chart = lazy(() => import('./Chart'))`
- Use Recharts `isAnimationActive={false}` for large datasets

#### 7. 🎨 TypeScript Generated Client

**Issue**: Generated types might not match expectations

**Solution**:
- Always regenerate client after backend changes
- Check generated types: `client/src/api/generated/models/`
- Don't manually edit generated files

#### 8. 🎨 React Query Best Practices

**Issue**: Stale data after mutations

**Solution**:
```typescript
const { mutate: pinScenario } = useMutation({
  mutationFn: ApiService.batchPinScenario,
  onSuccess: () => {
    // Invalidate growth data query
    queryClient.invalidateQueries(['batch', batchId, 'combined-growth-data']);
  },
});
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest + React Testing Library)

**Test**: `GrowthAnalysisChart.test.tsx`
- Renders 3 series
- Series toggles work
- Tooltip shows provenance
- Handles empty data

**Test**: `GrowthAnalysisControls.test.tsx`
- Date picker changes trigger callback
- Container selector filters data
- Granularity toggle works

### Integration Tests

**Test**: `GrowthAnalysisPage.test.tsx`
- Fetches API data
- Renders chart with data
- Handles loading state
- Handles error state
- Handles no scenario case

**Mock Data**:
```typescript
const mockCombinedData: GrowthAnalysisCombined = {
  batch_id: 1,
  batch_number: 'TEST-001',
  scenario: { /* ... */ },
  growth_samples: [/* ... */],
  scenario_projection: [/* ... */],
  actual_daily_states: [/* ... */],
  container_assignments: [/* ... */],
  date_range: { start: '2024-01-01', end: '2024-12-31', granularity: 'daily' },
};
```

### Manual Testing

Use Faroe Islands test data (33 batches available):
1. Navigate to batch detail
2. Click "Growth Analysis"
3. Verify chart renders
4. Toggle series on/off
5. Change date range
6. Change container filter
7. Change granularity
8. Hover over points (tooltip)
9. Pin different scenario

---

## 📦 Feature Folder Structure

```
client/src/features/batch-management/
├── api/
│   └── growth-assimilation.ts       # NEW: React Query hooks
├── pages/
│   └── GrowthAnalysisPage.tsx       # NEW: Main page
├── components/
│   ├── GrowthAnalysisChart.tsx      # NEW: Recharts chart
│   ├── GrowthAnalysisControls.tsx   # NEW: Control panel
│   ├── ScenarioPinDialog.tsx        # NEW: Scenario selector
│   └── ProvenanceTooltip.tsx        # NEW: Custom tooltip
└── hooks/
    └── useGrowthAnalysis.ts         # NEW: Local state management
```

---

## 🎯 Success Criteria for Phase 7

Phase 7 is complete when:

- [ ] TypeScript client regenerated with Phase 6 endpoints
- [ ] Growth Analysis page created and routed
- [ ] Chart renders 3 series (Samples, Scenario, Actual)
- [ ] Series toggles work (show/hide individual series)
- [ ] Date range filtering works
- [ ] Container drilldown works
- [ ] Granularity toggle (daily/weekly) works
- [ ] Provenance tooltips show sources + confidence
- [ ] Anchor points marked visually
- [ ] Pin scenario dialog works
- [ ] Loading/error/empty states handled
- [ ] Manual testing with Faroe Islands batch
- [ ] Unit tests for components (>80% coverage)

**Time Estimate**: 6-8 hours

---

## 💡 Pro Tips

### Chart Performance

**For long date ranges** (>365 days):
```typescript
// Auto-switch to weekly
const autoGranularity = dateRange > 180 ? 'weekly' : 'daily';

// Or show warning
{dateRange > 365 && (
  <Alert>
    <AlertTitle>Large Date Range</AlertTitle>
    <AlertDescription>
      Consider switching to Weekly view for better performance.
      <Button onClick={() => setGranularity('weekly')}>Switch to Weekly</Button>
    </AlertDescription>
  </Alert>
)}
```

### Tooltip Content

**Show provenance clearly**:
```tsx
<TooltipContent>
  <div>Date: {formatDate(point.date)}</div>
  <div>Weight: {point.avg_weight_g}g</div>
  {point.anchor_type && (
    <Badge variant="success">Anchor: {point.anchor_type}</Badge>
  )}
  <Separator />
  <div className="text-muted-foreground text-xs">
    Source: {point.sources.weight} 
    <ConfidenceBadge score={point.confidence_scores.weight} />
  </div>
</TooltipContent>
```

### State Management

**Don't over-complicate**:
```typescript
// ✅ GOOD: Local state for UI controls
const [visibleSeries, setVisibleSeries] = useState({
  samples: true,
  scenario: true,
  actual: true,
});

// ❌ BAD: Redux for simple page state
// Not needed - local state is fine
```

### Error Handling

**Distinguish error types**:
```typescript
if (error?.status === 404 && error?.detail?.includes('scenario')) {
  return <NoScenarioState onPin={openPinDialog} />;
}

if (error?.status === 403) {
  return <PermissionDeniedState />;
}

return <GenericErrorState error={error} />;
```

---

## 🔗 Backend Reference

### How Data Flows (Recap)

```
Operator records growth sample (50g, 100 fish)
         ↓
Django Signal: on_growth_sample_saved
         ↓
Celery Task: recompute_assignment_window (date ± 2 days)
         ↓
Growth Assimilation Engine: TGC + measurements
         ↓
ActualDailyAssignmentState records created/updated
         ↓
API: GET /combined-growth-data/
         ↓
Frontend: Growth Analysis chart updates
```

### Backend Performance

**Typical Response Times** (backend):
- Small batch (30 days, 1 container): 50-150ms
- Medium batch (365 days, 3 containers): 200-500ms
- Large batch (900 days, 10 containers): 1-3 seconds

**Frontend should show loading spinner** for requests >500ms

---

## 🚧 Known Backend Limitations

### Phase 5 Not Implemented

**Impact**: Weekly granularity queries daily table (not optimized CAGGs)

**Workaround**: Weekly queries still work, just slower than optimal

**Future**: Phase 5 will add TimescaleDB continuous aggregates (7x faster)

### No Pagination

**Impact**: Large batches (>2000 days) send lots of data

**Workaround**: Use weekly granularity

**Future**: Could add pagination or cursor-based loading

### No Response Caching

**Impact**: Same query hits database each time

**Workaround**: React Query caches on frontend (5-minute default)

**Future**: Could add Redis caching on backend

---

## 🆘 If You Get Stuck

### Issue: API Returns 404

**Checks**:
1. Is batch ID valid? Check URL parameter
2. Does user have geography access? Check user profile
3. Does batch have a scenario? Check `batch.pinned_scenario`

**Solution**: Show appropriate empty state based on error message

### Issue: Chart Not Rendering

**Checks**:
1. Is data shape correct? Log `data` to console
2. Are dates parsed? Use `new Date(dateStr)`
3. Is Recharts imported? Check console for errors
4. Is container too small? Use ResponsiveContainer

**Solution**: Start with minimal chart, add features incrementally

### Issue: TypeScript Errors

**Checks**:
1. Did you regenerate client? Run `npm run generate:api`
2. Are you using generated types? Import from `@/api/generated`
3. Is type definition outdated? Check `models/` folder

**Solution**: Regenerate client, restart TypeScript server

### Issue: Performance Problems

**Checks**:
1. How many data points? Log `actual_daily_states.length`
2. Is granularity set? Should be `weekly` for >180 days
3. Are series memoized? Use `useMemo()`

**Solution**: Use weekly granularity, disable animations

---

## 📋 Pre-Flight Checklist

Before you start:
- [ ] Read this handover fully
- [ ] Read Phase 6 Complete doc (backend API details)
- [ ] Check frontend code guidelines (in .cursor/rules)
- [ ] Verify backend is running (API accessible)
- [ ] Check existing chart components for patterns

During implementation:
- [ ] Regenerate TypeScript client FIRST
- [ ] Create API hook BEFORE page component
- [ ] Test with minimal data BEFORE complex features
- [ ] Add loading/error states from START (not afterthought)
- [ ] Test with real batch data EARLY (don't wait till end)

Before declaring done:
- [ ] All success criteria met
- [ ] Manual testing with Faroe Islands batch
- [ ] Unit tests pass
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Responsive on mobile
- [ ] Dark mode works

---

## 🚀 You're Ready!

**Backend is rock solid**: APIs tested, data flowing, real-time updates working.

**Your job**: Build the beautiful, performant, user-friendly Growth Analysis page that farm managers will use daily.

**Confidence level**: 🟢 **High** - Backend APIs complete, patterns clear, path forward obvious.

**Time to completion**: 6-8 hours of focused frontend work.

---

## 📊 PR & Workflow Strategy

**Current Status**:
- Backend: Phases 1-4, 6 complete on `feature/batch-growth-assimilation-112`
- Frontend: Phase 7 starting (this handover)
- Remaining: Phase 8 (backend), Phase 9 (validation)

**Recommended Workflow**:

### Option A: Keep Branch Open (RECOMMENDED)
**Rationale**: We're returning to backend for Phase 8

1. **Now**: Work on Phase 7 (frontend) on same branch or parallel branch
2. **Next**: Return to backend for Phase 8 (Production Planner integration)
3. **Then**: Phase 9 validation (backend + frontend testing)
4. **Finally**: Single comprehensive PR with all phases

**Benefits**:
- Single feature branch for entire feature
- All related changes in one PR
- Easier code review (see full picture)
- Clean git history

**Branch Strategy**:
- Backend continues on: `feature/batch-growth-assimilation-112`
- Frontend either:
  - Same branch (if working sequentially)
  - Parallel branch: `feature/batch-growth-assimilation-112-frontend` (merge to backend branch when done)

### Option B: Merge Backend Now, Frontend Separate
**Rationale**: Backend is production-ready, frontend can follow

1. **Now**: Create PR for backend (Phases 1-4, 6)
2. **Merge**: Backend to main
3. **Then**: New PR for frontend (Phase 7)
4. **Finally**: New PR for Phase 8+9

**Benefits**:
- Backend available for other features immediately
- Smaller, focused PRs
- Faster review cycles

**Drawbacks**:
- Multiple PRs for one feature
- Harder to see full picture
- More merge conflicts if main evolves

### My Recommendation

**Keep branch open** until Phase 9 complete. Here's why:

1. **Phase 8 is backend** (Production Planner integration)
2. **Feature is incomplete** without frontend visibility
3. **UAT requires both** backend + frontend working together
4. **Single PR** shows complete feature narrative

**However**: Create a **Draft PR now** for:
- Visibility into progress
- Early feedback opportunity
- CI/CD validation
- Documentation review

```bash
# Create draft PR (keeps branch open)
gh pr create \
  --title "feat: Batch Growth Assimilation (Phases 1-7) #112" \
  --body "Backend + Frontend implementation of daily growth assimilation. See HANDOVER.md for details." \
  --draft \
  --base main \
  --head feature/batch-growth-assimilation-112
```

**Mark as "Ready for Review"** after Phase 9 complete.

---

**Good luck! This is the exciting part - bringing the data to life visually. 📈**

---

*End of Frontend Handover Document*


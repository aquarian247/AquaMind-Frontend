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

**Target**: Analytics → Growth tab (replaces existing simple growth metrics)

**Context**: Batch Detail page already has Analytics tab with sub-tabs (Performance, Growth, FCR, Environmental, Predictions, Benchmarks). The NEW Growth Analysis replaces the existing weak "Growth" sub-tab.

**Path**: `client/src/features/batch-management/pages/BatchDetailPage.tsx` → Analytics Tab → Growth Sub-tab

### Visual Design (Based on UI Proposal)

**Reference**: See `docs/progress/growth_analysis/batch_growth_proposal.png`

**Layout** (Three-panel design):
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: "Batch Growth Analysis"                                             │
│ BTH-2023-001 • Atlantic Salmon • Smolt                            [ACTIVE]  │
├────────────────────────┬────────────────────────┬─────────────────────────┤
│                        │                        │  Container Drilldown    │
│  Data Visualization    │   Main Chart Area      │  ────────────────────   │
│  Controls              │                        │  □ Tank A-01            │
│  ─────────────────     │   Weight Growth        │    Smolt                │
│                        │   Over Time            │    Since 2023-01-15   > │
│  Data Series           │   8000┐                │                         │
│  ● Growth Samples   ☑  │       │    ●           │  □ Tank A-02            │
│  ● Scenario Proj.   ☑  │   6000┤        ●       │    Smolt                │
│  ● Actual Daily     ☑  │       │  ━━━━━●━━      │    Since 2023-01-15   > │
│                        │   4000┤●━━━━━━━━━━     │                         │
│  Granularity           │       │●●              │  □ Ring B-05            │
│  [Daily        v]      │   2000┤●               │    Post-Smolt           │
│                        │       │                │    Since 2023-07-14   > │
│  Scenario              │      0└────────────    │                         │
│  [Baseline Proj. v]    │        8  31  57  78   │                         │
│  📌 Pin Scenario       │        Days            │                         │
│                        │                        │  Click container to     │
│                        │   Tooltip (on hover):  │  filter chart to that   │
│                        │   ┌──────────────────┐ │  container only         │
│                        │   │ 2023-07-29       │ │                         │
│                        │   │ Day 197          │ │                         │
│                        │   │                  │ │                         │
│                        │   │ ● Scenario 371.61g│                         │
│                        │   │ ● Actual   367.58g│                         │
│                        │   │                  │ │                         │
│                        │   │ Data Sources:    │ │                         │
│                        │   │ Temp: measured   │ │                         │
│                        │   │ Feed: actual     │ │                         │
│                        │   │ Mortality: actual│ │                         │
│                        │   │ Weight: tgc_comp.│ │                         │
│                        │   │                  │ │                         │
│                        │   │ Confidence:      │ │                         │
│                        │   │ Temp:     ████ 100%                         │
│                        │   │ Mortality:████ 100%                         │
│                        │   │ Feed:     ████ 100%                         │
│                        │   │ Weight:   ███  84%│                         │
│                        │   └──────────────────┘ │                         │
├────────────────────────┴────────────────────────┴─────────────────────────┤
│ Variance Analysis                                                          │
│ Comparing actual performance against scenario projections                  │
│                                                                             │
│ ┌───────────────────┬───────────────────┬───────────────────────────────┐ │
│ │ Current Variance  │ Average Variance  │ Maximum Variance              │ │
│ │ ↓ -99.8g         │ __ 38.6g         │ ↓ -124.2g                     │ │
│ │   -1.4%          │    1.8%          │   on 2024-10-04               │ │
│ └───────────────────┴───────────────────┴───────────────────────────────┘ │
│                                                                             │
│ ⚠️ Batch is underperforming compared to projection. The current weight     │
│    is 1.4% below the scenario projection.                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Components to Build

**Reference Design**: See `docs/progress/growth_analysis/batch_growth_proposal.png`

1. **GrowthAnalysisTabContent.tsx** (replaces Analytics → Growth tab content)
   - Three-panel layout (controls left, chart center, containers right)
   - Fetches combined data via React Query
   - Manages state (series visibility, granularity, container filter, scenario)
   - Handles error/loading/empty states

2. **DataVisualizationControls.tsx** (left panel)
   - Data Series toggles with color indicators:
     - 🔵 Growth Samples (blue)
     - 🟢 Scenario Projection (green)  
     - 🟠 Actual Daily State (orange)
   - Granularity dropdown (Daily/Weekly)
   - Scenario dropdown with Pin button
   - Styled as card/panel

3. **GrowthAnalysisChart.tsx** (center - main chart)
   - Recharts LineChart with 3 series
   - X-axis: Days (from batch start)
   - Y-axis: Weight (g)
   - Series:
     - Growth Samples: Scatter points (blue dots)
     - Scenario: Smooth line (green)
     - Actual: Line with markers (orange)
   - Custom tooltip (ProvenanceTooltip)
   - Responsive container
   - Legend at bottom

4. **ContainerDrilldown.tsx** (right panel)
   - List of active container assignments
   - Each shows: Name, lifecycle stage, "Since" date, chevron
   - Click to filter chart to that container
   - Active state highlighting
   - Styled as card/panel

5. **ProvenanceTooltip.tsx** (chart hover tooltip)
   - Date + Day number
   - Scenario value vs Actual value
   - Data Sources section (temp/feed/mortality/weight)
   - Confidence Scores with horizontal bars (0-100%)
   - Clean, readable layout

6. **VarianceAnalysis.tsx** (bottom section)
   - Three metric cards:
     - Current Variance (g + %)
     - Average Variance (g + %)
     - Maximum Variance (g + date)
   - Alert banner for significant variances
   - Red/green indicators (under/over performance)

7. **ScenarioPinButton.tsx** (in scenario dropdown or separate)
   - Opens dialog to select scenario
   - Confirms pin action
   - Shows success toast

8. **RefreshDataButton.tsx** (top toolbar, Manager+)
   - Simple button that triggers 7-day recompute
   - Shows loading spinner during refresh
   - Auto-refreshes chart after 30 seconds
   - Toast shows task ID

9. **AdminRecomputeDialog.tsx** (admin menu, optional)
   - Full modal with custom date range picker
   - For advanced admin operations
   - Can defer to Phase 8 if time-constrained

---

## 📚 Essential Reading

### Before Starting
1. **This handover doc** - YOU ARE HERE
2. **Backend API doc**: `AquaMind/aquamind/docs/progress/batch_growth_assimilation/PHASE_6_COMPLETE.md`
3. **Frontend code guidelines**: `.cursor/rules` (already in your context)
4. **Chart component patterns**: `client/src/components/charts/` (existing examples)
5. **UI proposal**: `docs/progress/growth_analysis/batch_growth_proposal.png` (interactive chart/graph example)

### Reference Docs
- **API Standards**: `AquaMind/aquamind/docs/quality_assurance/api_standards.md`
- **RBAC Frontend**: `docs/RBAC_FRONTEND_IMPLEMENTATION.md` (for auth/permissions)
- **Important Context**: `docs/CONTRIBUTING.md`
- **Technical Design**: `AquaMind/aquamind/docs/progress/batch_growth_assimilation/technical_design.md`

---

## 🚀 Implementation Steps

### Step 1: Regenerate TypeScript Client 

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

### Step 2: Create API Hook 

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

### Step 3: Create Chart Component 

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

**Color Palette** (per UI proposal PNG):
- Growth Samples: `#3b82f6` (blue) - measured truth, scatter points
- Scenario Projection: `#10b981` (green) - planned, smooth line
- Actual Daily State: `#f97316` (orange) - assimilated reality, line with markers

**Note**: These colors match the existing AquaMind design system seen in the UI proposal

**Reference**: Look at existing charts in `client/src/components/charts/` for patterns

### Step 4: Create Controls Component (1 hour)

**File**: `client/src/features/batch-management/components/GrowthAnalysisControls.tsx`

**Controls**:
1. **Series Toggles**: Checkboxes for Samples/Scenario/Actual
2. **Date Range**: DateRangePicker from shadcn/ui
3. **Container Selector**: Dropdown (All / Tank-001 / Tank-002)
4. **Granularity**: Radio buttons or toggle (Daily/Weekly)

**State Management**: Local React state, passed to parent via callbacks

### Step 5: Create Main Page 

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

### Step 6: Add Route 

**File**: `client/src/router/index.tsx`

```typescript
{
  path: '/batch/:batchId/growth-analysis',
  element: <GrowthAnalysisPage />,
  // Or lazy load:
  element: lazy(() => import('@/features/batch-management/pages/GrowthAnalysisPage')),
}
```

### Step 7: Add Navigation Link 

**File**: Batch detail page or batch list

Add "View Growth Analysis" button/link that navigates to `/batch/{id}/growth-analysis`

### Step 8: Test 

- Test with real batch data (use Faroe Islands test data)
- Test series toggles
- Test date range filtering
- Test container drilldown
- Test granularity switching
- Test provenance tooltips
- Test loading/error states

---

## 🎬 User Actions (What Users Can DO)

### Overview

**This is a REPORTING page, not a DATA ENTRY page.**

The Growth Analysis page is **mostly automatic**. The Actual Daily States are computed by Celery tasks when operational events occur (samples recorded, transfers executed, mortality logged). Users view the results and can perform only 2 actions:

### Action 1: Pin Scenario 📌 (All Users)

**Location**: Left panel → Scenario dropdown → Pin button

**Purpose**: Associate a specific scenario with the batch for growth assimilation

**User Flow**:
1. Click scenario dropdown (shows available scenarios)
2. Select desired scenario from list
3. Click "📌 Pin Scenario" button
4. Toast: "Scenario pinned successfully"
5. Chart updates with new scenario projection

**API**: `POST /api/v1/batch/batches/{id}/pin-scenario/` with `{"scenario_id": 123}`

**Component**: `ScenarioPinButton.tsx`

### Action 2: Refresh Batch Data 🔄 (Manager+)

**Location**: Top of Analytics → Growth tab, next to scenario selector

**Purpose**: Refresh recent data (last 7 days) to pick up feeding events and other recent changes

**User Flow**:
1. Click "Refresh Data" button
2. System recomputes last 7 days automatically
3. Toast: "Refreshing... Task ID: abc-123"
4. Chart auto-refreshes after 30 seconds
5. Variance Analysis shows updated FCR and metrics

**Why This Matters**:
- Feeding events happen 1000s times per day (no real-time signal for performance)
- Nightly catch-up runs at night (12-24 hour lag)
- Managers want fresh FCR variance when reviewing batch
- Batch-scoped (not company-wide) - minimal infrastructure load

**API**: `POST /api/v1/batch/batches/{id}/recompute-daily-states/` with `{"start_date": "7 days ago", "end_date": "today"}`

**Component**: Simple button with loading state

```tsx
<Button
  variant="outline"
  size="sm"
  onClick={handleRefreshBatch}
  disabled={isRefreshing}
>
  <RefreshCwIcon className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
  {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
</Button>
```

### Action 3: Full Recompute 🔧 (Admin Only)

**Location**: Admin menu (three-dot or toolbar)

**Purpose**: Full recomputation with custom date range (for debugging, backfill, or major data corrections)

**User Flow**:
1. Click "Full Recompute" (admin menu)
2. Modal opens with date range picker
3. Select start/end dates (optional: specific containers)
4. Click "Recompute"
5. Toast: "Recompute task enqueued - Task ID: abc-123"

**Difference from Refresh**:
- Admin only (Refresh is Manager+)
- Custom date range (Refresh is fixed 7 days)
- Full modal (Refresh is simple button)

**API**: Same endpoint, different parameters

**Component**: `AdminRecomputeDialog.tsx`

### What Users CANNOT Do ❌

**No Direct Editing**:
- ❌ Cannot edit Actual Daily States (they're computed, not manual)
- ❌ Cannot delete states (they're derived from events)
- ❌ Cannot adjust confidence scores (automatic based on data sources)
- ❌ Cannot override anchors (anchors come from real events)
- ❌ Cannot modify provenance (tracks actual data sources)

### Why Refresh Button Matters 🔄

**FeedingEvents and FCR Updates**:

**The Situation**:
- Feeding events happen 1000s of times per day
- Engine calculates `observed_fcr = feed / biomass_gain`
- Variance Analysis compares actual FCR vs scenario FCR
- **No real-time signal for feeding events** (too many tasks - infrastructure load)
- Nightly catch-up updates data (12-24 hour lag)

**The Compromise**:
- **Refresh Data button** = On-demand recompute (last 7 days)
- Manager clicks when they need fresh FCR variance
- Batch-scoped (not company-wide) = minimal load
- 30-second refresh time = fast enough
- Uses existing API endpoint = zero backend changes

**This balances**:
- ✅ Real-time when needed (user-triggered)
- ✅ Minimal infrastructure load (not automatic)
- ✅ Accurate FCR variance for decision-making
- ✅ Simple implementation (button + API call)

### Why It's Automatic ✅

**The Actual series updates automatically when**:
1. Operator records growth sample (Containers → Record Sample)
   → Celery signal fires
   → Engine recomputes ±2 days
   → Actual states updated
   → Chart shows new data (on next load/refresh)

2. Transfer executed with measured weight
   → Same flow

3. Mortality event logged
   → Same flow

**Timeline**: ~10-30 seconds from event to updated chart (Celery processing time)

**UI Indication**: Show "Last Updated" timestamp + refresh button

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

## 🎨 UI Proposal Alignment

### Your PNG vs. Handover Doc

**Reference**: `docs/progress/growth_analysis/batch_growth_proposal.png`

**✅ Perfect Alignment**:
- Three-panel layout (controls left, chart center, containers right) - **PNG is better!**
- 3 series with toggles (Growth Samples, Scenario, Actual)
- Provenance tooltip with sources + confidence bars
- Variance Analysis section (Current/Average/Maximum) - **Excellent addition in PNG!**
- Container drilldown sidebar
- Granularity dropdown

**🔄 PNG Enhancements** (Better than my mockup):
- **Layout**: LEFT panel for controls (cleaner than horizontal)
- **Colors**: Blue/Green/Orange (matches AquaMind palette better than my suggestion)
- **Variance Section**: Detailed metrics + alert banner (more comprehensive than my simple cards)
- **Tooltip**: Progress bars for confidence scores (better visual than text)

**📝 Minor Gaps in PNG** (Easy to Add):
- Pin Scenario button (add below scenario dropdown)
- Force Recompute action (admin menu or button)

**Recommendation**: **Follow the PNG design exactly!** It's more polished and better thought-out than my ASCII mockup. I've updated this handover to match it.

---

## 🧹 Cleanup & Existing Content (IMPORTANT!)

### Current State Analysis

**There is EXISTING growth content in two places**:

#### 1. History → Growth Analysis (KEEP, but rename)

**Location**: Batch Detail → History tab → "Growth Analysis" sub-tab

**Current Content**:
- **Chart**: "Growth Performance Analysis" - Average Weight + Condition Factor over time
- **Table**: "Growth Sample Details" - Individual sample records with date, container, weight, length, K-factor

**Purpose**: Historical records, sample-by-sample detail, health monitoring via K-factor

**K-Factor Importance**:
- Health indicator: K = 100 × (Weight / Length³)
- K < 0.9: Emaciated, very poor condition
- K 0.9-1.0: Poor condition
- K 1.0-1.1: Fair condition  
- K > 1.1: Positive performance, well-conditioned
- K > 1.6: Possible deformity (spine curvature)

**Value**: ✅ **KEEP THIS!** It's valuable for:
- Operators checking fish health (K-factor monitoring)
- Biologists reviewing sample history
- Auditing which samples were taken when

#### 2. Analytics → Growth (REPLACE)

**Location**: Batch Detail → Analytics tab → "Growth" sub-tab

**Current Content**:
- Simple cards: Growth Rate (0.00%), Condition Factor trends
- Weak visualization (just text metrics)

**Purpose**: Growth metrics (but minimal)

**Value**: ⚠️ **REPLACE THIS** - Weak content that will be superseded by new three-series chart

---

### Cleanup Actions (Zero Tech Debt)

#### Action 1: Rename History Sub-Tab (2-line change)

**File**: Find where History tabs are defined (likely `BatchTraceabilityView.tsx` or similar)

**Change**:
```tsx
// BEFORE
<TabsTrigger value="growth-analysis">Growth Analysis</TabsTrigger>
<TabsContent value="growth-analysis">
  {/* existing chart + table - NO CHANGES to content */}
</TabsContent>

// AFTER (just rename the tab)
<TabsTrigger value="growth-samples">Growth Samples</TabsTrigger>
<TabsContent value="growth-samples">
  {/* existing chart + table - NO CHANGES to content */}
</TabsContent>
```

**Why**: "Growth Samples" is more accurate and avoids confusion with Analytics → Growth

**Content**: ✅ **NO CHANGES** - Keep the existing chart and table, just rename the tab

---

#### Action 2: Replace Analytics → Growth Content

**File**: `client/src/components/batch-management/GrowthAnalyticsTab.tsx`

**Current** (110 lines):
```tsx
export function GrowthAnalyticsTab({ 
  growthMetrics, 
  latestGrowthData, 
  growthTrend 
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>Growth Rate Analysis (simple cards)</Card>
      <Card>Condition Factor (simple cards)</Card>
    </div>
  );
}
```

**After Phase 7** (400+ lines):
```tsx
export function GrowthAnalyticsTab({ batchId }: { batchId: number }) {
  const { data } = useCombinedGrowthData(batchId);
  
  return (
    <div className="space-y-6">
      {/* Optional: Keep K-factor as quick metric */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="Condition Factor" value={data.latest_k_factor} />
        <MetricCard title="Growth Rate" value={data.latest_growth_rate} />
        <MetricCard title="Current Variance" value={data.variance} />
      </div>
      
      {/* NEW: Three-panel Growth Analysis (per PNG) */}
      <div className="grid grid-cols-[280px_1fr_300px] gap-6">
        <DataVisualizationControls />
        <div className="space-y-6">
          <GrowthAnalysisChart />
          <VarianceAnalysis />
        </div>
        <ContainerDrilldown />
      </div>
    </div>
  );
}
```

**File Update**: `BatchAnalyticsView.tsx` (line ~192)
```tsx
// BEFORE
<TabsContent value="growth">
  <GrowthAnalyticsTab
    growthMetrics={growthMetrics}
    latestGrowthData={latestGrowthData}
    growthTrend={growthTrend}
  />
</TabsContent>

// AFTER (simpler props)
<TabsContent value="growth">
  <GrowthAnalyticsTab batchId={batchId} />
</TabsContent>
```

---

### Clear Separation of Concerns

**After cleanup, these two areas serve different purposes**:

| Aspect | History → Growth Samples | Analytics → Growth |
|--------|-------------------------|-------------------|
| **Purpose** | Historical records, raw data | Strategic analysis, performance |
| **Shows** | Individual samples, K-factor health | 3-series comparison, variance |
| **User** | Operators, biologists | Managers, farm planners |
| **Question** | "What samples were taken?" | "Are we on track vs plan?" |
| **Data** | Growth samples only | Samples + Scenario + Actual |
| **Health** | K-factor monitoring (detailed) | Variance alerts |
| **Action** | View historical records | Compare, pin scenario |

**No Overlap**: They complement each other!

---

### Files to Modify

**1. History Tab** (1 file, 2 lines):
- Find: `BatchTraceabilityView.tsx` or wherever History tabs defined
- Change: `"Growth Analysis"` → `"Growth Samples"`
- Content: No changes (keep existing chart + table)

**2. Analytics Tab** (2 files):
- `GrowthAnalyticsTab.tsx`: Replace content with three-panel design
- `BatchAnalyticsView.tsx`: Update props (batchId only)

**Files to DELETE**: ❌ **NONE!** Zero tech debt.

---

### K-Factor Integration Decision

**Option A**: Keep K-factor in History only (separate concern)
- History monitors health (K-factor detail)
- Analytics focuses on performance (variance)

**Option B**: Add K-factor to Analytics chart as 4th series (optional)
```tsx
// In DataVisualizationControls
● Growth Samples (weight) ☑
● Scenario Projection ☑
● Actual Daily State ☑
● Condition Factor ☐  ← Optional health overlay
```

**My Recommendation**: **Option A** for Phase 7, can add Option B later if users request it.

---

## 🎯 Updated Success Criteria

Add to Phase 7 checklist:

- [ ] Rename History → "Growth Analysis" to "Growth Samples" (2-line change)
- [ ] Verify existing History content still works (chart + table)
- [ ] Replace Analytics → Growth with three-panel design
- [ ] Verify no naming confusion between History and Analytics
- [ ] Test that K-factor monitoring still accessible in History tab
- [ ] Confirm zero dead code (no orphaned files)

---

## 📦 Feature Folder Structure

```
client/src/features/batch-management/
├── api/
│   └── growth-assimilation.ts               # NEW: React Query hooks
├── pages/
│   └── BatchDetailPage.tsx                  # MODIFIED: Add growth analysis to Analytics tab
├── components/
│   ├── growth-analysis/                     # NEW: Feature components folder
│   │   ├── GrowthAnalysisTabContent.tsx     # Main tab content component
│   │   ├── DataVisualizationControls.tsx    # Left panel (series, granularity, scenario)
│   │   ├── GrowthAnalysisChart.tsx          # Center chart (Recharts)
│   │   ├── ContainerDrilldown.tsx           # Right panel (container list)
│   │   ├── ProvenanceTooltip.tsx            # Custom Recharts tooltip
│   │   ├── VarianceAnalysis.tsx             # Bottom variance cards + alert
│   │   ├── ScenarioPinButton.tsx            # Pin scenario action
│   │   └── AdminRecomputeDialog.tsx         # Force recompute modal (admin)
└── hooks/
    └── useGrowthAnalysisState.ts            # NEW: Local state management
```

**File Locations**:
- Main content: Inside Analytics → Growth tab (not separate route)
- Components: Organized in `growth-analysis/` subfolder
- Hooks: Growth-specific state management

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
- [ ] Refresh Data button works (Manager+)
- [ ] Refresh triggers 7-day recompute and auto-updates chart
- [ ] Loading/error/empty states handled
- [ ] Manual testing with Faroe Islands batch
- [ ] Test: Record feeding event → Click Refresh → Verify FCR variance updates
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


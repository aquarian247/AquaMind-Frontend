# Freshwater Dashboard - Handover from Executive Dashboard Implementation

**From:** Executive Dashboard Team (Oct 18, 2025)  
**To:** Freshwater Dashboard Implementation Team  
**Purpose:** Share learnings, reusable patterns, and shortcuts to accelerate development

---

## 🎯 **TL;DR - Critical Success Factors**

1. ✅ **Use REAL endpoints only** - No mocks in production code
2. ✅ **Check aggregation catalog first** - 18+ endpoints already exist
3. ✅ **Reuse Executive components** - KPICard, alert utilities, formatters
4. ✅ **Test with real API structure** - Mock the actual response shape
5. ✅ **Use `undefined` not `null`** - For optional FK fields in forms

---

## 📚 **Essential Reading (15 minutes)**

**Read these FIRST before starting:**

1. **`docs/AGGREGATION_ENDPOINTS_CATALOG.md`** ⭐ **CRITICAL**
   - Lists all 18 aggregation endpoints
   - Shows what's already available vs what needs building
   - Prevents reinventing the wheel

2. **`docs/progress/executives_frontends/tracking/EXECUTIVE_DASHBOARD_AGGREGATION_ANALYSIS.md`**
   - Shows which endpoints we used vs didn't use
   - Explains batch-level vs geography-level aggregation
   - Highlights optimization opportunities

3. **Frontend Coding Guidelines** (Cursor Rules)
   - File size limits (300 LOC max)
   - Component patterns
   - Testing requirements

4. **`client/src/features/executive/`** - Working reference implementation
   - Copy patterns from here
   - Reuse utilities and types where applicable

---

## 🔄 **Reusable from Executive Dashboard**

### **Components You Can Copy/Adapt** ✅

#### **1. KPICard Component** (Highly Reusable!)
**Location:** `client/src/features/executive/components/KPICard.tsx`

```tsx
import { KPICard } from '@/features/executive/components/KPICard';

// Use directly or adapt for freshwater-specific metrics
<KPICard
  data={{
    title: 'Average TGC (90-day)',
    value: 3.8,
    unit: '',
    subtitle: 'All freshwater batches',
    trend: { direction: 'up', percentage: 5.2, period: 'vs last week' },
    alertLevel: 'success'
  }}
/>
```

**What it handles:**
- ✅ Trend indicators (↑↓ arrows)
- ✅ Color-coded alerts (green/yellow/red)
- ✅ Skeleton loading states
- ✅ Theme integration
- ✅ Mobile responsive

**Freshwater adaptation needed:**
- Different thresholds (mortality, TGC ranges)
- Additional units (smolt count, tank capacity)

---

#### **2. Alert Level Utilities** (100% Reusable!)
**Location:** `client/src/features/executive/utils/alertLevels.ts`

```tsx
import { getLiceAlertLevel, getFacilityHealthStatus } from '@/features/executive/utils/alertLevels';

// Pattern to copy for freshwater thresholds
export function getMortalityAlertLevel(
  mortalityRate: number | null,
  period: '14d' | '30d' | '90d'
): AlertLevel {
  if (mortalityRate === null) return 'info';
  
  const thresholds = {
    '14d': { yellow: 0.50, red: 0.75 },
    '30d': { yellow: 0.75, red: 1.20 },
    '90d': { yellow: 1.20, red: 3.00 },
  };
  
  const { yellow, red } = thresholds[period];
  
  if (mortalityRate >= red) return 'danger';
  if (mortalityRate >= yellow) return 'warning';
  return 'success';
}
```

**Copy the pattern, adapt the thresholds!**

---

#### **3. KPI Calculation Utilities**
**Location:** `client/src/features/executive/utils/kpiCalculations.ts`

```tsx
// Reuse these:
export function calculateAverageWeight(biomassKg, population) { ... }
export function formatKPI(data) { ... }
export function calculatePercentageChange(current, previous) { ... }
```

**Already handles:**
- Null safety
- Division by zero
- Percentage formatting
- Unit conversions

---

#### **4. Geography/Station Filter Pattern**
**Location:** `client/src/features/executive/components/GeographyFilter.tsx`

**Freshwater adaptation:**
```tsx
// Create StationFilter component (same pattern)
export function StationFilter({ value, onChange, stations }) {
  // Copy GeographyFilter implementation
  // Change "Geography" to "Station"
  // Add "All Stations" option instead of "Global"
}
```

---

### **Patterns You Can Follow** ✅

#### **1. API Hook Structure**
**Location:** `client/src/features/executive/api/api.ts`

**Copy this pattern:**
```tsx
export function useFreshwaterSummary(
  stationId: number | 'all'
): UseQueryResult<FreshwaterSummary, Error> {
  return useQuery({
    queryKey: ['freshwater-summary', stationId],
    queryFn: async (): Promise<FreshwaterSummary> => {
      const id = stationId === 'all' ? undefined : stationId;
      
      // Fetch multiple endpoints in parallel
      const [stationData, batchData, mortalityData] = await Promise.all([
        ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(id),
        ApiService.batchContainerAssignmentsSummary(undefined, undefined, undefined, undefined, true, id),
        // ... other endpoints
      ]);
      
      // Aggregate and return
      return {
        station_id: id,
        total_biomass_kg: batchData.active_biomass_kg,
        // ... map all fields
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Key patterns:**
- ✅ Parallel Promise.all for multiple endpoints
- ✅ Handle 'all' vs specific ID
- ✅ Map API responses to typed interface
- ✅ Graceful null handling
- ✅ Appropriate cache times

---

#### **2. Tab Component Structure**
**Location:** `client/src/features/executive/components/OverviewTab.tsx`

**Pattern for WeeklyReportTab:**
```tsx
export function WeeklyReportTab({ stationId }: { stationId: number | 'all' }) {
  // 1. Data hooks
  const { data: summary, isLoading } = useFreshwaterSummary(stationId);
  const { data: batchPerformance } = useBatchPerformanceKPIs(stationId);
  
  // 2. Loading state
  if (isLoading) return <SkeletonLoader />;
  
  // 3. Render sections
  return (
    <div className="space-y-6">
      <FacilityOverviewTable data={summary} />
      <GrowthPerformanceTable data={batchPerformance} />
      <SizeDistributionChart data={summary?.sizeDistribution} />
      {/* ... 8 report sections ... */}
    </div>
  );
}
```

**Keep components focused:**
- < 300 LOC per component
- Extract sub-components when needed
- Presentational components receive props (no hooks)

---

## 📊 **Available Aggregation Endpoints for Freshwater**

### **Station-Level (Already Exist!)** ✅

```typescript
// 1. Station summary
ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(stationId)
// Returns: { hall_count, tank_count, active_biomass_kg, capacity_utilization_percent }

// 2. Hall summary
ApiService.hallSummary(hallId)
// Returns: { tank_count, active_biomass_kg, population_count, avg_weight_kg }

// 3. Container assignments (filterable by station!)
ApiService.batchContainerAssignmentsSummary(
  undefined, // area
  'TANK',    // containerType (for freshwater tanks)
  undefined, // geography
  undefined, // hall
  true,      // isActive
  stationId  // station ⭐ USE THIS!
)
// Returns: { active_biomass_kg, count }
```

### **Batch Performance (Use These!)** ✅

```typescript
// Growth analysis per batch
ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId)
// Returns: { growth_metrics: [690 samples], growth_summary: { avg_growth_rate, min/max weight } }

// Performance metrics per batch
ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId)
// Returns: { mortality_metrics: { total_count, mortality_rate, by_cause }, container_metrics: [...] }
```

**DON'T fetch 690 individual growth samples!** Use `growth_analysis` endpoint!

---

## ⚠️ **Lessons Learned (Avoid These Mistakes)**

### **1. Check Aggregation Endpoints FIRST**
**What we did wrong:**
- Built Executive Dashboard without checking all available endpoints
- Missed `growth_analysis` and `performance_metrics` endpoints
- Currently NOT using them in Batch Management either!

**What you should do:**
- ✅ Read `docs/AGGREGATION_ENDPOINTS_CATALOG.md` FIRST
- ✅ Search OpenAPI spec: `grep -i summary api/openapi.yaml`
- ✅ Use batch-level aggregations for per-batch metrics
- ✅ Use station filters for station-level aggregations

---

### **2. Understand Batch vs Geography vs Station Scope**

**Executive Dashboard needs:**
- Geography-level aggregation (all batches in Faroe Islands)
- Missing endpoint → shows N/A placeholders

**Freshwater Dashboard needs:**
- Station-level aggregation (all batches in Station A)
- **Already available!** via `station` filter parameter

**Key insight:**
```typescript
// THIS WORKS for freshwater! ✅
ApiService.batchContainerAssignmentsSummary(
  undefined, undefined, undefined, undefined, true,
  stationId  // Filter by station!
)

// For per-batch details, use these: ✅
ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId)
ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId)
```

You have BETTER aggregation support than Executive Dashboard did!

---

### **3. Use `undefined` not `null` for Optional Fields**

**TypeScript/Zod expects:**
```typescript
// ✅ CORRECT
geography: area?.geography ?? undefined

// ❌ WRONG (causes type errors)
geography: area?.geography ?? null
```

**In Select onValueChange:**
```typescript
// ✅ CORRECT
onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)}

// ❌ WRONG
onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : null)}
```

---

### **4. Test with REAL API Response Structure**

**Don't do this:**
```typescript
// ❌ WRONG - using made-up field names
vi.mocked(ApiService.batchSummary).mockResolvedValue({
  total_biomass: 50000,  // API actually returns "active_biomass_kg"
  fish_count: 500000,    // API actually returns "count"
});
```

**Do this:**
```typescript
// ✅ CORRECT - check OpenAPI spec or generated types
vi.mocked(ApiService.batchContainerAssignmentsSummary).mockResolvedValue({
  active_biomass_kg: 50000,  // Match real API
  count: 500000,              // Match real API
});
```

**How to find correct structure:**
1. Search generated client: `grep -A 20 "batchContainerAssignmentsSummary" client/src/api/generated/`
2. Check OpenAPI spec
3. Look at existing API hook tests in Executive Dashboard

---

## 🚀 **Quick-Start Checklist**

### **Before You Write Any Code:**

- [ ] Read `docs/AGGREGATION_ENDPOINTS_CATALOG.md`
- [ ] Review `client/src/features/executive/` structure
- [ ] Check freshwater-specific endpoints in OpenAPI
- [ ] Map weekly report sections to endpoints (Task 0)
- [ ] Identify which Executive components can be reused

### **During Development:**

- [ ] Copy `KPICard` component (don't rebuild it!)
- [ ] Use `formatFallback` utilities from Executive
- [ ] Use aggregation endpoints (`growth_analysis`, `performance_metrics`)
- [ ] Test with real API response shapes
- [ ] Keep components < 300 LOC
- [ ] Use `undefined` for optional FK fields

### **Before PR:**

- [ ] Run `npx tsc --noEmit` (0 errors)
- [ ] Run `npm test` (all passing)
- [ ] Verify real data displays correctly
- [ ] Test with empty state (no batches)
- [ ] Test all 3 themes
- [ ] Mobile responsive check

---

## 💡 **Key Differences: Executive vs Freshwater**

| Aspect | Executive Dashboard | Freshwater Dashboard |
|--------|---------------------|----------------------|
| **Scope** | Geography-level (Global, Faroe, Scotland) | Station-level (per freshwater station) |
| **Aggregation** | Some endpoints missing (need new backend) | BETTER support (station filters available!) |
| **Data Volume** | Summary only (small payload) | Detailed weekly report (larger, more complex) |
| **Calculations** | Simple aggregations | Complex (size distribution, 90-day trends, SGR/TGC) |
| **Export** | Not required | PDF export required |
| **UI Complexity** | 4 simple tabs | 4 complex tabs (8-section weekly report!) |

**What this means:**
- ✅ You have BETTER backend support (station filters everywhere)
- ⚠️ But MORE complex calculations needed (size distribution, etc.)
- ⚠️ And MORE detailed UI (8-page report → dashboard)

---

## 🎨 **Reusable Components & Utilities**

### **Components (Copy These!)**

```typescript
// From Executive Dashboard - use as-is or adapt

import { KPICard } from '@/features/executive/components/KPICard';
import { FacilityHealthBadge } from '@/features/executive/components/FacilityHealthBadge';

// Adapt these patterns:
// - GeographyFilter → StationFilter
// - FacilityList → BatchesTable (similar table structure)
```

### **Utilities (Copy These!)**

```typescript
// From Executive Dashboard - reuse directly

import { formatFallback } from '@/lib/formatting';
import { calculateAverageWeight } from '@/features/executive/utils/kpiCalculations';

// Adapt these:
// - getLiceAlertLevel → getMortalityAlertLevel (different thresholds)
// - Executive thresholds → Freshwater thresholds
```

### **Type Patterns (Copy Structure)**

```typescript
// From executive/types.ts - copy structure

export interface FreshwaterSummary {
  station_id: number | null;
  station_name: string;
  period_start: string;
  period_end: string;
  
  // Biomass & Population
  total_biomass_kg: number | null;
  total_population: number | null;
  // ... etc
}
```

---

## 🔌 **Freshwater-Specific Endpoints Available**

### **Station Aggregations (Use These!)** ✅

```typescript
// 1. Station summary
GET /api/v1/infrastructure/freshwater-stations/{id}/summary/
Returns: {
  id, name, hall_count, tank_count,
  active_biomass_kg, capacity_utilization_percent
}

// 2. Hall summary (for each hall in station)
GET /api/v1/infrastructure/halls/{id}/summary/
Returns: {
  tank_count, active_biomass_kg,
  population_count, avg_weight_kg
}

// 3. Container assignments filtered by station
GET /api/v1/batch/container-assignments/summary/
  ?station={id}
  &container_type=TANK
  &is_active=true
Returns: { active_biomass_kg, count }
```

### **Batch Performance (Per-Batch Metrics)** ✅

```typescript
// For each active batch in station:

// 1. Growth analysis (USE THIS! Don't fetch 690 samples individually)
GET /api/v1/batch/batches/{id}/growth_analysis/
Returns: {
  growth_metrics: [{ date, avg_weight_g, condition_factor }],
  growth_summary: { avg_growth_rate, min_weight_g, max_weight_g }
}

// 2. Performance metrics (USE THIS! Don't fetch 5720 mortality events)
GET /api/v1/batch/batches/{id}/performance_metrics/
Returns: {
  mortality_metrics: { total_count, mortality_rate, by_cause },
  container_metrics: [...]
}
```

**This is MUCH better than what we had for Executive Dashboard!**

---

## 🧮 **Size Distribution Calculation**

The weekly report shows size distribution (e.g., "23% in 70-180g range").

**Option 1: Client-Side Calculation** ✅ Acceptable
```typescript
// Use growth sample mean + std_deviation
// Assume normal distribution
// Calculate percentage in each size class

export function calculateSizeDistribution(
  avgWeightG: number,
  stdDeviationG: number
): SizeDistribution {
  // Size classes: <0.1, 0.1-5, 5-70, 70-180, 180-350, >350
  // Use cumulative distribution function (CDF)
  // Formula: P(a < X < b) = CDF(b) - CDF(a)
  
  const sizeClasses = [
    { min: 0, max: 0.1 },
    { min: 0.1, max: 5 },
    { min: 5, max: 70 },
    { min: 70, max: 180 },
    { min: 180, max: 350 },
    { min: 350, max: Infinity },
  ];
  
  return sizeClasses.map(({ min, max }) => ({
    range: `${min}-${max}g`,
    percentage: calculateNormalDistributionPercentage(avgWeightG, stdDeviationG, min, max)
  }));
}
```

**Option 2: Backend Endpoint** (If calculation is complex)
- Could create `/api/v1/batch/batches/{id}/size-distribution/`
- Returns pre-calculated percentages

**Recommendation:** Start with Option 1 (simpler), move to Option 2 if performance issues

---

## 📋 **90-Day Performance Comparison**

Weekly report shows current vs 90-day average performance.

**Available data:**
```typescript
// Fetch growth analysis for batch
const { data: growthAnalysis } = useQuery({
  queryKey: ['batch/growth-analysis', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId)
});

// growth_metrics array has ALL samples with dates
// Filter to last 90 days, calculate rolling averages
const last90Days = growthAnalysis.growth_metrics.filter(
  sample => isWithinLast90Days(sample.date)
);

const avg90DayWeight = calculateAverage(last90Days.map(s => s.avg_weight_g));
const currentWeight = last90Days[last90Days.length - 1]?.avg_weight_g;

const percentChange = ((currentWeight - avg90DayWeight) / avg90DayWeight) * 100;
```

**No new endpoint needed** - just calculate from `growth_metrics` array!

---

## 🔬 **Forensic Analysis Tab (8-Panel Time Series)**

### **Data Sources**

1. **Mortality Timeline** - `ApiService.apiV1BatchMortalityEventsList({ batch: batchId })`
2. **Growth Timeline** - `growth_analysis.growth_metrics` (already aggregated!)
3. **Temperature** - `ApiService.apiV1EnvironmentalReadingsList({ container, parameter: 'TEMPERATURE' })`
4. **Oxygen** - `ApiService.apiV1EnvironmentalReadingsList({ container, parameter: 'OXYGEN' })`
5. **Feeding Events** - `ApiService.apiV1InventoryFeedingEventsList({ batch: batchId })`
6. **Health Sampling** - `ApiService.apiV1HealthHealthSamplingEventsList({ batch: batchId })`

### **Chart Library**

Use **Recharts** (already in Executive Dashboard):
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Multi-line chart for time series
<LineChart data={chartData}>
  <XAxis dataKey="date" />
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <Line yAxisId="left" dataKey="mortality_count" stroke="#ef4444" />
  <Line yAxisId="right" dataKey="temperature" stroke="#3b82f6" />
</LineChart>
```

**Pattern:** One `MultiPanelTimeSeries` component with 8 sub-charts

---

## 🚨 **Common Pitfalls (DON'T DO THIS)**

### **❌ Pitfall 1: Fetching Individual Growth Samples**
```typescript
// ❌ BAD - 35 API calls for 690 samples
const { data } = useQuery({
  queryFn: async () => {
    const allSamples = [];
    for (let page = 1; page <= 35; page++) {
      const response = await ApiService.apiV1BatchGrowthSamplesList(batchId, page);
      allSamples.push(...response.results);
    }
    return allSamples;
  }
});
```

```typescript
// ✅ GOOD - 1 API call, all samples included
const { data: growthAnalysis } = useQuery({
  queryKey: ['batch/growth-analysis', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId)
});

const growthSamples = growthAnalysis.growth_metrics; // All 690 samples!
```

---

### **❌ Pitfall 2: Using Mocks in Production Code**
```typescript
// ❌ BAD
const mockData = { biomass: 50000 };
return mockData; // In production hook!
```

```typescript
// ✅ GOOD
const { data } = useQuery({
  queryFn: () => ApiService.realEndpoint()
});
return data?.biomass || null; // Real data with fallback
```

---

### **❌ Pitfall 3: Hardcoded Values**
```typescript
// ❌ BAD
<KPICard value={1.25} /> // Hardcoded FCR

// ✅ GOOD
<KPICard value={summary?.fcr_average || null} />
// Shows "N/A" if null, real value otherwise
```

---

### **❌ Pitfall 4: Client-Side Aggregation of Large Datasets**
```typescript
// ❌ BAD - aggregate 5720 mortality events in browser
const mortalityRate = calculateFromRawEvents(5720 events);

// ✅ GOOD - use server aggregation
const { mortality_metrics } = performanceMetrics;
const mortalityRate = mortality_metrics.mortality_rate; // Already calculated!
```

---

## 📁 **Recommended File Structure**

Based on Executive Dashboard success:

```
client/src/features/freshwater/
├── api/
│   ├── api.ts                          # All API hooks
│   └── api.test.ts                     # API hook tests
├── components/
│   ├── WeeklyReportTab.tsx             # Main weekly report (< 200 LOC)
│   │   ├── FacilityOverviewSection.tsx
│   │   ├── GrowthPerformanceSection.tsx
│   │   ├── SizeDistributionSection.tsx
│   │   ├── BatchPerformanceSection.tsx
│   │   └── NinetyDayComparisonSection.tsx
│   ├── ForensicAnalysisTab.tsx
│   │   └── MultiPanelTimeSeries.tsx    # 8 charts in grid
│   ├── TransferPlanningTab.tsx
│   ├── StationDetailsTab.tsx
│   ├── StationFilter.tsx               # Copy GeographyFilter pattern
│   └── ExportToPDFButton.tsx           # react-pdf integration
├── pages/
│   └── FreshwaterDashboardPage.tsx     # Main page (< 150 LOC)
├── utils/
│   ├── sizeDistributionCalc.ts         # Normal distribution math
│   ├── performanceThresholds.ts        # Color-coding rules
│   ├── reportFormatting.ts             # Match weekly report format
│   └── *.test.ts                       # Test all utilities
├── types.ts
└── index.ts
```

**Pattern:**
- Main tabs: < 200 LOC (extract sections)
- Section components: < 150 LOC
- Utility functions: < 50 LOC each
- Test coverage: 80%+

---

## 🎯 **Recommended Implementation Order**

### **Phase 1: Foundation (Like Executive Dashboard)**
1. ✅ Task 0 - Map weekly report to endpoints
2. ✅ Task 1 - Scaffolding, types, utilities
3. ✅ Task 2 - API hooks (USE aggregation endpoints!)

### **Phase 2: UI (Reuse Executive Patterns)**
4. ✅ Copy KPICard, adapt for freshwater thresholds
5. ✅ Build WeeklyReportTab sections incrementally
6. ✅ Build ForensicAnalysisTab (8-panel chart)
7. ✅ Build TransferPlanningTab
8. ✅ Build StationDetailsTab

### **Phase 3: Integration**
9. ✅ Main page + routing
10. ✅ PDF export (react-pdf)
11. ✅ Testing & polish

---

## 📊 **Estimated Complexity Comparison**

| Task | Executive | Freshwater | Difference |
|------|-----------|------------|------------|
| **API Support** | 60% (some endpoints missing) | 90% (station filters + batch aggregations exist!) | ✅ Better |
| **Calculations** | Simple (mostly display) | Complex (size distribution, 90-day trends) | ⚠️ Harder |
| **UI Complexity** | Medium (12 KPIs, table) | High (8-section report, 8-panel chart) | ⚠️ Harder |
| **Data Volume** | Low (summary only) | Medium (weekly report data) | ⚠️ More data |
| **Export** | None | PDF export required | ⚠️ Additional work |

**Overall:** Freshwater is more complex, but has better backend support!

---

## 🚀 **Shortcuts & Time-Savers**

### **1. Copy-Paste Starter Code**

```bash
# Copy Executive Dashboard structure as template
cp -r client/src/features/executive client/src/features/freshwater

# Rename all files/components
# Replace "Executive" with "Freshwater"
# Adapt to station-level data instead of geography-level
```

### **2. Reuse Test Patterns**

```typescript
// Copy test setup from executive/api/api.test.ts
const createQueryClientWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
};

// Then adapt for freshwater hooks
```

### **3. Use Existing Chart Wrappers**

Check if chart components already exist in `components/charts/`:
- `LineChart`, `BarChart`, `PieChart` wrappers
- If not, create thin wrappers around Recharts
- Don't reinvent chart configuration

---

## 📚 **Key Documentation References**

### **Must Read**
1. ⭐ `docs/AGGREGATION_ENDPOINTS_CATALOG.md` - All available endpoints
2. ⭐ `client/src/features/executive/` - Working reference implementation
3. Frontend Coding Guidelines (Cursor Rules)
4. Frontend Testing Guide (Cursor Rules)

### **Helpful Context**
- `docs/progress/executives_frontends/tracking/EXECUTIVE_DASHBOARD_AGGREGATION_ANALYSIS.md`
- `client/docs/issues/AGGREGATION_ENDPOINT_OPPORTUNITIES.md`
- Aggregation Playbook (backend): `AquaMind/aquamind/docs/development/aggregation_playbook.md`

### **Freshwater-Specific**
- Weekly report analysis docs (in freshwater-dashboard-plan/)
- Screenshots (in freshwater-dashboard-plan/)
- Implementation plan (freshwater-dashboard-plan/IMPLEMENTATION_PLAN.md)

---

## ✅ **Success Checklist (Copy from Executive Dashboard)**

### **Functional**
- [ ] All tabs implemented and functional
- [ ] Station filtering works (All Stations, Station A, Station B, etc.)
- [ ] Real backend data displayed (no mocks)
- [ ] Honest fallbacks (N/A) for missing data
- [ ] Calculations match weekly report
- [ ] Color-coded alerts match thresholds
- [ ] PDF export works

### **Technical**
- [ ] TypeScript strict mode (0 errors)
- [ ] All tests passing (80%+ coverage)
- [ ] No linter errors
- [ ] Generated ApiService used exclusively
- [ ] Aggregation endpoints used (not individual fetches)
- [ ] formatFallback utilities used
- [ ] Theme integration (all 3 themes)
- [ ] Mobile responsive

### **Performance**
- [ ] Page loads < 3 seconds (more complex than Executive)
- [ ] Uses aggregation endpoints (not 376 individual calls!)
- [ ] Lazy loading for heavy components
- [ ] Proper caching (5-10 minute staleTime)

---

## 🎯 **Expected Timeline**

Based on Executive Dashboard experience:

**Executive Dashboard:** 11 tasks, ~2 sessions (~15 hours)  
**Freshwater Dashboard:** 13 tasks estimated

**Factors:**
- ✅ Better backend support (+20% faster)
- ✅ Reusable components from Executive (+30% faster)
- ⚠️ More complex calculations (-20% slower)
- ⚠️ 8-section weekly report (-30% slower)
- ⚠️ PDF export (-10% slower)

**Estimated:** 13-15 tasks, 3-4 sessions (~20-25 hours)

**With this handover:** Could save 3-5 hours by reusing Executive patterns! 🚀

---

## 💡 **Final Tips**

1. **Start with Task 0** - Map the weekly report thoroughly
2. **Use aggregation endpoints** - Check catalog first
3. **Copy Executive components** - Don't rebuild KPICard!
4. **Test with real API responses** - No fake field names
5. **Keep components small** - Extract early, extract often
6. **Ask for help** - Reference Executive implementation

---

## 🔗 **Quick Links**

**Code to Study:**
- `client/src/features/executive/` - Reference implementation
- `client/src/features/batch-management/` - Has some aggregation usage

**Documentation:**
- `docs/AGGREGATION_ENDPOINTS_CATALOG.md` - ⭐ START HERE
- Freshwater plan: `docs/progress/executives_frontends/freshwater-dashboard-plan/`
- Executive tracking: `docs/progress/executives_frontends/tracking/`

**Key Files:**
- KPICard: `client/src/features/executive/components/KPICard.tsx`
- API hooks: `client/src/features/executive/api/api.ts`
- Alert utilities: `client/src/features/executive/utils/alertLevels.ts`

---

**Good luck! You're starting with WAY more context than we had for Executive Dashboard! 🎊**

---

**Questions?** Reference the Executive Dashboard tracking docs or ping the team.

**Last Updated:** October 18, 2025  
**Executive Dashboard:** Completed and merged (PR #163)  
**Bugfixes:** 4 cursor bot issues fixed (committed to main)


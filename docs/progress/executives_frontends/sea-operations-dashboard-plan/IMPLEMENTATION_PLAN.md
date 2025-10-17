# Sea Area Operations Manager Dashboard - Implementation Plan

**Target Persona:** Oversight Manager of All Farming Areas (Sea-Based Operations)  
**Goal:** Replace 47-page manual weekly report (Týsdagsrapport) with real-time dashboard  
**Approach:** Extract business logic from prototype tarball, rebuild UI with AquaMind patterns  
**RBAC:** Dynamic menu based on user role (sea operations managers)

---

## Overview

Transform the 47-page Týsdagsrapport (Tuesday Report) from manual Excel/PDF creation into a live, interactive dashboard with 4 comprehensive tabs. This is the most data-intensive dashboard with 20+ KPIs, detailed lice management, market intelligence, and facility performance rankings.

### UI Reference
From prototype analysis:
- **Tab 1: Weekly Report** - 12 KPI cards + facility summary table + lice alerts
- **Tab 2: Lice Management** - Current status table + multi-year trends + 2025 goals
- **Tab 3: Market Intelligence** - Stágri Salmon Index pricing + harvest timing optimizer
- **Tab 4: Facility Comparison** - Performance rankings (TGC, FCR, Mortality, Lice)

### Source Material
- Prototype tarball: `aquamind-operations-manager-delivery.tar.gz` (extracted to `executive-dashboard/`)
- Main component: `src/pages/OperationsManager.jsx` (796 lines)
- Data modules:
  - `lib/operationsWeeklyData.js` - KPIs and facility summaries
  - `lib/liceManagementData.js` - Lice tracking and goals
  - `lib/marketPriceData.js` - Salmon pricing by size class
  - `lib/facilityComparisonData.js` - Performance rankings
- Documentation:
  - `AquaMind Operations Manager - Demo Prototype.md`
  - `AquaMind Operations Manager Enhancement - Implementation Summary.md`

---

## Prototype Analysis

### Reusable Business Logic
✅ **KPI Calculations** - Extraction formulas, aggregation logic  
✅ **Color-Coding Thresholds** - Lice alerts, performance indicators  
✅ **Ranking Algorithms** - Top performers by TGC, FCR, mortality  
✅ **Market Price Matrix** - Size class pricing structure  
✅ **Trend Calculations** - Week-over-week, year-over-year changes

### Must Rebuild
❌ **UI Components** - JSX → TypeScript + Shadcn/ui  
❌ **Data Layer** - Static JS objects → ApiService + TanStack Query  
❌ **Routing** - React Router → Wouter  
❌ **Theme** - Solarized only → Multi-theme support  
❌ **RBAC** - Custom context → useAuth hook integration

---

## Backend API Requirements

### Already Available (Verified)
1. **Area Summary** - `/api/v1/infrastructure/areas/{id}/summary/`
2. **Geography Summary** - `/api/v1/infrastructure/geographies/{id}/summary/`
3. **Batch Summary** - `/api/v1/batch/container-assignments/summary/`
4. **Lice Summary** - `/api/v1/health/lice-counts/summary/` ✅ NEW
5. **Lice Trends** - `/api/v1/health/lice-counts/trends/` ✅ NEW
6. **Feeding Events Summary** - `/api/v1/inventory/feeding-events/summary/`
7. **FCR Trends** - `/api/v1/operational/fcr-trends/`
8. **Mortality Events** - `/api/v1/batch/mortality-events/`

### May Need to Create
1. **Sea Areas Weekly Summary** - Aggregate all sea areas (not just one geography)
2. **Market Prices** - External integration (Stágri Salmon Index) or manual entry
3. **Ring Status** - Container status with lice levels per ring
4. **Treatment History** - Days since last treatment per ring
5. **Facility Performance Rankings** - May calculate client-side from available data

---

## Feature Structure

```
client/src/features/sea-operations/
├── api/
│   ├── api.ts              # TanStack Query hooks
│   └── api.test.ts
├── components/
│   ├── WeeklyReportTab.tsx          # Tab 1
│   │   ├── KPIDashboard.tsx         # 12 KPI cards
│   │   ├── FacilitySummaryTable.tsx # Facility overview
│   │   └── LiceAlertPanel.tsx       # Lice status highlights
│   ├── LiceManagementTab.tsx        # Tab 2
│   │   ├── LiceGoals2025.tsx        # Bakkafrost goals
│   │   ├── CurrentLiceStatusTable.tsx # Per-ring status
│   │   └── LiceTrendsCharts.tsx     # Multi-year trends
│   ├── MarketIntelligenceTab.tsx    # Tab 3
│   │   ├── PriceMatrix.tsx          # Stágri index by size class
│   │   ├── PriceTrendChart.tsx      # Historical trends
│   │   └── HarvestOptimizer.tsx     # Timing recommendations
│   ├── FacilityComparisonTab.tsx    # Tab 4
│   │   ├── TopPerformersTGC.tsx     # Bar chart
│   │   ├── BestFCR.tsx              # Bar chart
│   │   ├── LowestMortality.tsx      # Bar chart
│   │   └── LowestLice.tsx           # Bar chart
│   └── shared/
│       ├── KPICard.tsx              # Reusable KPI card
│       ├── TrendIndicator.tsx       # Arrow + percentage
│       └── StatusBadge.tsx          # Good/Warning/Critical
├── hooks/
│   ├── useSeaOperationsKPIs.ts      # 12 KPI calculations
│   ├── useFacilityRankings.ts       # Performance rankings
│   ├── useLiceManagementData.ts     # Lice analysis
│   └── useMarketData.ts             # Market intelligence
├── pages/
│   └── SeaOperationsDashboardPage.tsx # Main page
├── types.ts
└── utils/
    ├── kpiExtraction.ts             # Extracted from prototype
    ├── liceThresholds.ts            # Bakkafrost 2025 goals
    ├── performanceRankings.ts       # Ranking algorithms
    └── marketPricing.ts             # Price calculations
```

---

## Task Breakdown (Session-Sized)

### Task 0: Prototype Extraction & Analysis
**Scope:** Extract and analyze business logic from prototype tarball  
**Actions:**
- Extract tarball fully: `tar -xzf aquamind-operations-manager-delivery.tar.gz`
- Analyze `OperationsManager.jsx` (796 lines)
- Document all KPI calculations from `operationsWeeklyData.js`
- Document lice thresholds from `liceManagementData.js`
- Document ranking algorithms from `facilityComparisonData.js`
- Map prototype data fields → backend API responses

**Deliverables:**
- `PROTOTYPE_ANALYSIS.md` - Complete breakdown
- `KPI_CALCULATIONS.md` - All formulas documented
- `DATA_MAPPING.md` - Prototype fields → API fields

**Success Criteria:**
- Every KPI formula documented
- Every threshold value captured
- Data mapping complete

**Estimated Context:** 20-25%

---

### Task 1: Feature Scaffolding & Business Logic Extraction
**Scope:** Create structure and convert prototype logic to TypeScript  
**Actions:**
- Create `features/sea-operations/` structure
- Extract and convert to TypeScript:
  - KPI calculation functions from `operationsWeeklyData.js`
  - Lice threshold logic from `liceManagementData.js`
  - Ranking algorithms from `facilityComparisonData.js`
  - Market price utilities from `marketPriceData.js`
- Define comprehensive TypeScript interfaces
- Create utility functions with tests

**Files Created:**
- `features/sea-operations/types.ts`
- `features/sea-operations/utils/kpiExtraction.ts`
- `features/sea-operations/utils/liceThresholds.ts`
- `features/sea-operations/utils/performanceRankings.ts`
- `features/sea-operations/utils/marketPricing.ts`
- Test files for all utilities

**KPIs to Extract:**
1. Total Biomass (57,586 tons)
2. Average Weight (2.896 kg)
3. Feed This Week (3,200 tons)
4. TGC (2.95)
5. SGR (0.76%)
6. Mortality Count (30,972)
7. Mortality Biomass (106 tons)
8. Mature Lice (8.39M)
9. Movable Lice (17.63M)
10. Released from Freshwater (623,141)
11. Total Rings (175)
12. Largest Mortality Size (7,164 in 3500-4000g range)

**Success Criteria:**
- All utilities type-safe
- Tests pass (80%+ coverage)
- Calculations match prototype
- Thresholds documented

**Estimated Context:** 30-35%

---

### Task 2: API Layer - Geography & Area Summaries
**Scope:** Create hooks for geography/area level data  
**Actions:**
- Create `features/sea-operations/api/api.ts`
- Implement hooks:
  - `useSeaAreasOverview(geography?)` - All sea areas aggregated
  - `useAreaDetail(areaId)` - Individual area metrics
  - `useRingsByArea(areaId)` - Rings (containers) in area
  - `useAreaBiomass(geography?)` - Total biomass by area
- Use existing infrastructure summary endpoints

**Backend Endpoints:**
```typescript
// Geography summary
ApiService.apiV1InfrastructureGeographiesSummaryRetrieve(id)

// Area summaries
ApiService.apiV1InfrastructureAreasList({ geography })
ApiService.apiV1InfrastructureAreasSummaryRetrieve(id)

// Containers (rings) by area
ApiService.apiV1InfrastructureContainersList({ area, category: 'PEN' })
```

**Files Created:**
- `features/sea-operations/api/api.ts` (partial)
- `features/sea-operations/api/api.test.ts` (partial)

**Estimated Context:** 20-25%

---

### Task 3: API Layer - Lice & Health Data
**Scope:** Create hooks for lice management and health monitoring  
**Actions:**
- Extend `features/sea-operations/api/api.ts`
- Implement hooks:
  - `useLiceSummary(geography, area?, dateRange?)` - Current lice levels
  - `useLiceTrends(geography, interval)` - Historical trends 2021-2025
  - `useLiceByRing(geography?)` - Per-ring lice status
  - `useTreatmentHistory(geography?)` - Days since treatment
  - `useHealthAlerts(geography?)` - Critical health issues
- Use new lice endpoints from backend enhancement

**Backend Endpoints:**
```typescript
// Lice summary (NEW)
ApiService.apiV1HealthLiceCountsSummaryRetrieve({ geography, startDate, endDate })

// Lice trends (NEW)
ApiService.apiV1HealthLiceCountsTrendsRetrieve({ geography, interval: 'weekly' })

// Lice counts per ring
ApiService.apiV1HealthLiceCountsList({ container__area__geography, ordering: '-count_date' })

// Treatments
ApiService.apiV1HealthTreatmentsList({ batch__container__area__geography })
```

**Success Criteria:**
- Lice data hooks working
- Trend data formatted for charts
- Alert levels calculated correctly

**Estimated Context:** 25-30%

---

### Task 4: API Layer - Mortality, Feed, Growth
**Scope:** Complete API layer with remaining data hooks  
**Actions:**
- Complete `features/sea-operations/api/api.ts`
- Implement hooks:
  - `useMortalityData(geography, dateRange)` - Mortality tracking
  - `useFeedingData(geography, dateRange)` - Feed consumption
  - `useGrowthData(geography, dateRange)` - TGC and SGR
  - `useFCRTrends(geography)` - Feed conversion trends
  - `useReleaseData(geography)` - Smolt releases from freshwater
- Implement `useSeaOperationsKPIs(geography)` master hook
  - Aggregates all data for 12 KPIs
  - Single hook for Overview tab efficiency

**Backend Endpoints:**
```typescript
// Mortality
ApiService.apiV1BatchMortalityEventsList({ batch__container__area__geography })

// Feeding
ApiService.apiV1InventoryFeedingEventsSummaryList({ geography, startDate, endDate })

// Growth/FCR
ApiService.apiV1OperationalFcrTrendsList({ geography })
ApiService.apiV1BatchGrowthSamplesList({ assignment__container__area__geography })

// Batch transfers (for releases)
ApiService.apiV1BatchBatchTransfersList({ destinationAssignment__container__area__geography })
```

**Files Created:**
- Complete `features/sea-operations/api/api.ts`
- Complete `features/sea-operations/api/api.test.ts`
- `features/sea-operations/hooks/useSeaOperationsKPIs.ts`

**Success Criteria:**
- All 12 KPIs calculable from backend data
- Master hook tested
- Efficient data fetching (parallel queries)

**Estimated Context:** 30-35%

---

### Task 5: Shared Components (KPICard, FacilityTable, StatusBadge)
**Scope:** Create reusable components used across tabs  
**Actions:**
- Create `KPICard.tsx`
  - Props: title, value, unit, trend, subtitle, icon
  - Trend indicator with arrow and percentage
  - Supports all 3 themes (not just Solarized)
- Create `StatusBadge.tsx`
  - Props: status ('good' | 'warning' | 'critical'), label
  - Color-coded backgrounds
  - Used for lice alerts, health indicators
- Create base table component for facility data
  - Sortable columns
  - Color-coded cells
  - Responsive design

**Files Created:**
- `features/sea-operations/components/shared/KPICard.tsx`
- `features/sea-operations/components/shared/StatusBadge.tsx`
- `features/sea-operations/components/shared/DataTable.tsx`
- Tests for all components

**Success Criteria:**
- Components theme-aware
- Accessible (ARIA labels)
- Reusable across tabs
- Tests pass

**Estimated Context:** 25-30%

---

### Task 6: Weekly Report Tab - KPI Dashboard
**Scope:** Implement Tab 1 KPI cards section  
**Actions:**
- Create `WeeklyReportTab.tsx` parent
- Create `KPIDashboard.tsx` component
- Implement 12 KPI cards using prototype data:
  1. Total Biomass (57,586 tons) - from container assignments
  2. Average Weight (2.896 kg) - from batch summaries
  3. Feed This Week (3,200 tons) - from feeding events 7-day sum
  4. TGC (2.95) - from FCR trends or growth calculations
  5. SGR (0.76%) - calculated from growth samples
  6. Mortality Count (30,972) - from mortality events 7-day sum
  7. Mortality Biomass (106 tons) - calculated from mortality × avg weight
  8. Mature Lice (8.39M) - from lice summary (adult counts)
  9. Movable Lice (17.63M) - from lice summary (pre-adult + adult)
  10. Released from Freshwater (623,141) - from batch transfers
  11. Total Rings (175) - from container count (category='PEN')
  12. Largest Mortality Size (7,164 in 3500-4000g) - client-side grouping
- Use `useSeaOperationsKPIs` hook
- Calculate week-over-week trends
- Apply formatFallback for missing data

**Files Created:**
- `features/sea-operations/components/WeeklyReportTab.tsx`
- `features/sea-operations/components/KPIDashboard.tsx`
- `features/sea-operations/components/KPIDashboard.test.tsx`

**Success Criteria:**
- All 12 KPIs display correctly
- Trends calculated accurately
- N/A for unavailable metrics
- Matches prototype layout

**Estimated Context:** 30-35%

---

### Task 7: Weekly Report Tab - Facility Summary Table
**Scope:** Complete Tab 1 with facility performance table  
**Actions:**
- Implement `FacilitySummaryTable.tsx`
- Columns (from prototype):
  - Facility (e.g., "A09 Argir", "Loch Roag")
  - Biomass (tons)
  - Avg Weight (kg)
  - TGC
  - FCR
  - Mortality (%)
  - Mature Lice (per fish)
  - Rings (count)
- Color-coded lice alerts:
  - Green: < 0.5 mature lice per fish
  - Yellow: 0.5-1.0
  - Red: > 1.0
- Sortable by any column
- Use `useFacilityRankings` hook
- Export to PDF button (placeholder)

**Files Created:**
- `features/sea-operations/components/FacilitySummaryTable.tsx`
- `features/sea-operations/components/FacilitySummaryTable.test.tsx`

**Success Criteria:**
- Table renders with real data
- Color-coding matches thresholds
- Sorting works
- Performance acceptable (< 2s load)

**Estimated Context:** 25-30%

---

### Task 8: Lice Management Tab
**Scope:** Implement Tab 2 with comprehensive lice tracking  
**Actions:**
- Create `LiceManagementTab.tsx`
- Implement `LiceGoals2025.tsx` card
  - Bakkafrost 2025 targets:
    - Mature Lice: < 0.2 per fish
    - Movable Lice: < 0.1 per fish
    - Spring Period (Mar-May): < 0.8 mature per fish
  - Display current performance vs goals
- Implement `CurrentLiceStatusTable.tsx`
  - Columns: Facility, Ring, Count Date, Mature, Movable, Total, Biomass, Days Since Treatment, Status
  - Color-coded cells (green/yellow/red)
  - Status badges
  - Sortable and filterable
- Implement `LiceTrendsCharts.tsx`
  - 2 line charts: Mature lice trends, Movable lice trends
  - Multi-year overlay (2021-2025)
  - Multiple facilities on same chart
  - Solarized color palette (green, blue, cyan, violet)
- Use `useLiceTrends` and `useLiceByRing` hooks
- Data from new backend lice endpoints

**Files Created:**
- `features/sea-operations/components/LiceManagementTab.tsx`
- `features/sea-operations/components/LiceGoals2025.tsx`
- `features/sea-operations/components/CurrentLiceStatusTable.tsx`
- `features/sea-operations/components/LiceTrendsCharts.tsx`
- Tests for all components

**Success Criteria:**
- Current lice status accurate
- Trends display multi-year data
- Goals comparison clear
- Color-coding matches Bakkafrost standards

**Estimated Context:** 35-40%

---

### Task 9: Market Intelligence Tab
**Scope:** Implement Tab 3 with market pricing and harvest timing  
**Actions:**
- Create `MarketIntelligenceTab.tsx`
- Implement `PriceMatrix.tsx`
  - Stágri Salmon Index pricing by size class
  - 9 size classes: 1-2kg through 9+kg
  - 4 weeks of data (current week - 3 previous)
  - Color-coded price changes (green ↑, red ↓)
  - Average row
- Implement `PriceTrendChart.tsx`
  - Line chart: 2023-2025 average price trends
  - Weekly granularity
- Implement `HarvestOptimizer.tsx`
  - Table: Optimal harvest timing recommendations
  - Based on current fish size + growth rate + price projections
  - Calculates revenue optimization window

**Note:** If market price endpoint doesn't exist:
- Display "Market data integration pending" banner
- Use mock data with clear disclosure
- OR integrate external API (if available)

**Files Created:**
- `features/sea-operations/components/MarketIntelligenceTab.tsx`
- `features/sea-operations/components/PriceMatrix.tsx`
- `features/sea-operations/components/PriceTrendChart.tsx`
- `features/sea-operations/components/HarvestOptimizer.tsx`
- Tests

**Success Criteria:**
- Price matrix renders (real or clearly-marked mock data)
- Price changes calculated correctly
- Harvest optimizer logic sound
- Charts performant

**Estimated Context:** 30-35%

---

### Task 10: Facility Comparison Tab
**Scope:** Implement Tab 4 with performance rankings  
**Actions:**
- Create `FacilityComparisonTab.tsx`
- Implement 4 ranking charts (horizontal bar charts):
  1. **Top Performers by TGC**
     - Top 5 facilities
     - Green bars (Solarized green: #859900)
     - Higher is better
  2. **Best FCR**
     - Top 5 facilities
     - Blue bars (Solarized blue: #268bd2)
     - Lower is better
  3. **Lowest Mortality**
     - Top 5 facilities
     - Cyan bars (Solarized cyan: #2aa198)
     - Lower is better
  4. **Lowest Lice Counts**
     - Top 5 facilities
     - Violet bars (Solarized violet: #6c71c4)
     - Lower is better
- Use `useFacilityRankings` hook
- Calculate rankings from facility summary data
- Recharts for visualizations

**Ranking Algorithm:**
```typescript
// Extract from facilityComparisonData.js
const rankByTGC = facilities.sort((a, b) => b.tgc - a.tgc).slice(0, 5);
const rankByFCR = facilities.sort((a, b) => a.fcr - b.fcr).slice(0, 5); // Lower better
const rankByMortality = facilities.sort((a, b) => a.mortality - b.mortality).slice(0, 5);
const rankByLice = facilities.sort((a, b) => a.matureLice - b.matureLice).slice(0, 5);
```

**Files Created:**
- `features/sea-operations/components/FacilityComparisonTab.tsx`
- `features/sea-operations/components/PerformanceRankingChart.tsx` (reusable)
- Tests

**Success Criteria:**
- Rankings accurate
- Charts render correctly
- Color scheme consistent
- Responsive

**Estimated Context:** 25-30%

---

### Task 11: Main Dashboard Page & Routing
**Scope:** Create main page and integrate with app  
**Actions:**
- Create `SeaOperationsDashboardPage.tsx`
  - Header: "Operations Control Tower" (from prototype)
  - Week number and date range
  - Geography selector (Global/Faroe/Scotland)
  - Theme toggle
  - Tabs component (4 tabs)
- Add route: `/sea-operations` or `/operations/sea`
- Add sidebar menu item (RBAC-based)
- Lazy load heavy tabs (lice trends, market charts)

**Routes:**
- `/sea-operations` → SeaOperationsDashboardPage
- Keep existing `/infrastructure/areas/:id` for detail views

**Sidebar:**
- "Sea Operations" menu item
- Icon: `fas fa-ship`
- RBAC: Show for sea operations managers

**Files Created:**
- `features/sea-operations/pages/SeaOperationsDashboardPage.tsx`
- `features/sea-operations/pages/SeaOperationsDashboardPage.test.tsx`
- `features/sea-operations/index.ts`

**Success Criteria:**
- Page matches prototype UX
- All tabs accessible
- Geography filter updates all tabs
- Theme integration
- Mobile responsive

**Estimated Context:** 25-30%

---

### Task 12: Geography-Based Data Filtering
**Scope:** Ensure all tabs respect geography selection  
**Actions:**
- Implement geography context or prop drilling
- Update all API hooks to accept geography parameter
- Test filtering:
  - Global: All facilities (Faroe + Scotland)
  - Faroe Islands: A09 Argir, A13 Borðoyarvík, A21 Reynisarvatn S
  - Scotland: Loch Roag, Loch Eriboll
- Verify KPIs recalculate correctly
- Verify facility table filters
- Verify charts update

**Test Scenarios:**
- Switch geography → All data updates
- No data for selected geography → Shows N/A
- Mix of geographies → Global shows combined

**Success Criteria:**
- Geography filtering 100% functional
- No stale data displayed
- Smooth transitions

**Estimated Context:** 20-25%

---

### Task 13: Testing & Performance Optimization
**Scope:** Comprehensive testing and optimization  
**Actions:**
- Test all tabs with real backend data
- Test with empty/sparse data
- Test with multiple geographies
- Performance testing:
  - Lice trends with 5 years data
  - Market price matrix rendering
  - Facility rankings calculation
- Add loading skeletons for slow endpoints
- Add error boundaries
- Optimize React renders (memo, useMemo)
- Test theme switching

**Performance Targets:**
- Initial load < 3 seconds
- Tab switch < 500ms
- Geography filter < 1 second
- Charts render < 2 seconds

**Success Criteria:**
- All tests pass
- No console errors
- Lighthouse > 90
- No memory leaks

**Estimated Context:** 25-30%

---

### Task 14: Documentation & Operator Guide
**Scope:** Document feature for operators and developers  
**Actions:**
- Create `features/sea-operations/README.md`
- Document weekly report auto-generation
- Create operator guide (how to use dashboard)
- Document API dependencies
- Add screenshots
- Update main README

**Deliverables:**
- `features/sea-operations/README.md`
- `OPERATOR_GUIDE.md` for sea operations managers
- Updated `/README.md`

**Estimated Context:** 10-15%

---

## Total Estimated Tasks: 14
**Aggregate Context:** ~350-430% (requires 4-5 sessions)

---

## Success Criteria

### Functional
✅ Replaces 47-page manual weekly report  
✅ All metrics from Týsdagsrapport implemented  
✅ Geography filtering (Global, Faroe, Scotland)  
✅ Real-time data (not weekly snapshots)  
✅ 4 tabs fully functional

### Data Accuracy
✅ KPIs match prototype calculations:
  - Biomass totals accurate
  - Lice averages correct
  - Mortality calculations proper
  - Feed consumption sums right
  - TGC/SGR formulas correct
✅ Color-coding matches Bakkafrost standards:
  - Lice: < 0.5 green, 0.5-1.0 yellow, > 1.0 red
  - Mortality thresholds applied
  - FCR performance indicators
✅ Rankings accurate (top 5 performers)

### Technical
✅ TypeScript strict (0 errors)  
✅ All tests passing (80%+ coverage)  
✅ Generated ApiService only  
✅ No client-side aggregation (except rankings)  
✅ Honest fallbacks (N/A)  
✅ Performance optimized

### UX
✅ Matches prototype UX quality  
✅ Clear loading states  
✅ Error handling user-friendly  
✅ Export functionality works  
✅ Mobile responsive

---

## Known Challenges

1. **Market Price Integration**
   - Stágri Salmon Index is external data source
   - Options:
     - A) Backend scrapes/API integration
     - B) Manual data entry by ops manager
     - C) Mock data with disclosure (interim)
   - Decision: Proceed with C, backend team implements A/B

2. **Days Since Treatment Calculation**
   - Need last treatment date per ring
   - Query: Get latest treatment per container
   - Calculate: `(today - treatment_date).days`
   - Implementation: Client-side from treatment list

3. **Harvest Optimizer Logic**
   - Complex calculation: growth projection + market pricing
   - May need scenario integration
   - Fallback: Simple "Optimal" badge if market data unavailable

4. **Multi-Year Trend Data**
   - Need 5 years of lice data for meaningful trends
   - Test database may not have this
   - Solution: Display available years + message

5. **Facility Identification**
   - Prototype uses area codes (A09, A13, A21, etc.)
   - Backend uses area names
   - Solution: Display both (code + name) if code stored

---

## Migration from Prototype

### Reuse (Extract to TypeScript)
✅ `weeklyKPIs` calculation logic  
✅ `facilitySummaries` aggregation  
✅ `liceGoals2025` thresholds  
✅ `liceTrackingData` alert levels  
✅ `marketPriceData` size class mapping  
✅ `performanceRankings` algorithms  
✅ Color-coding functions  
✅ Trend calculation formulas

### Rebuild (AquaMind Patterns)
❌ `OperationsManager.jsx` (796 lines) → Split into tab components  
❌ `RBACContext.jsx` → Use existing AuthContext  
❌ Static data objects → API hooks with TanStack Query  
❌ Radix UI primitives → Shadcn/ui components  
❌ Solarized theme only → Multi-theme support  
❌ React Router → Wouter

---

## Weekly Report (Týsdagsrapport) Sections Mapping

### Page 2: YVIRLIT (Overview) → Facility Summary Table
- Current stock, mortality, feed, transfers per facility
- **Backend:** Area summaries + container assignments

### Page 3: VØKSTUR (Growth) → Growth Performance Section
- SGR, FCR, temperature by batch
- **Backend:** Growth samples + feeding events + environmental

### Page 4: FELLI (Mortality) → Mortality Tracking
- Mortality %, cumulative, deviation
- **Backend:** Mortality events aggregated

### Page 5: STØDD (Size Distribution) → Size Distribution Charts
- Size class breakdown, transfer readiness
- **Calculation:** Normal distribution from growth sample stats

### Page 6: 90-DAY PERFORMANCE → 90-Day Comparison Charts
- Multi-year trends
- **Backend:** Historical growth samples, mortality, batch transfers

### Pages 7-8: BATCH PERFORMANCE → Batch KPIs Table
- 14/30/90-day mortality and TGC per batch
- **Backend:** Mortality events + growth samples with date filtering

---

## RBAC Integration

```typescript
const canViewSeaOperations = user?.role in [
  'sea_operations_manager',
  'regional_manager_sea',
  'ceo'
];

// Sidebar.tsx
{canViewSeaOperations && (
  <Link href="/sea-operations">
    <div className="sidebar-nav-item">
      <i className="fas fa-ship mr-3" />
      Sea Operations
    </div>
  </Link>
)}
```

---

## Dependencies

**Backend:**
- Lice endpoints ✅ COMPLETE
- Infrastructure summaries ✅ EXISTS
- Batch summaries ✅ EXISTS
- Feeding summaries ✅ EXISTS
- FCR trends ✅ EXISTS
- Market prices ⚠️ TBD
- 90-day aggregations ⚠️ May need client calculation

**Frontend:**
- Generated API client ✅ EXISTS
- Multi-entity filtering ✅ EXISTS
- formatFallback ✅ EXISTS
- Theme system ✅ EXISTS
- Chart components ✅ EXISTS (Recharts)

---

## Timeline Estimate

**14 tasks** × 1.5-2 hours each = **21-28 hours** (4-5 sessions)

Factors:
- Prototype logic extraction saves time
- Complex calculations (size distribution, rankings)
- Large number of components (20+)
- Comprehensive testing required
- Performance optimization needed

---

## Data Requirements for Testing

**Minimum Test Data:**
- 3+ sea areas (2 Faroe, 1 Scotland)
- 15+ rings (containers) across areas
- 10+ active batches in sea pens
- Lice counts for at least 6 months
- Growth samples for size distribution
- Mortality events for trend calculation
- Feeding events for feed metrics

**If Insufficient:**
- Use data generation scripts (if available)
- OR accept "Insufficient data" messages with honest disclosure
- OR focus testing on available data scope

---

## Next Steps After Completion

1. UAT with sea operations manager
2. Validate KPI calculations against actual weekly report
3. Gather feedback on data presentation
4. Integrate real market price feed
5. Add PDF export (backend endpoint recommended)
6. Add email scheduling (optional)
7. Consider mobile app for on-site use

---

**Plan Ready for Execution**


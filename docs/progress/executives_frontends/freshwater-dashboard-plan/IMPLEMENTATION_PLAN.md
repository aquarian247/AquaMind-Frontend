# Freshwater Station Manager Dashboard - Implementation Plan

**Target Persona:** Oversight Manager of All Freshwater Stations  
**Goal:** Replace manual weekly reporting with real-time auto-generated dashboard  
**Approach:** Build from scratch following AquaMind patterns, guided by screenshots and weekly report analysis  
**RBAC:** Dynamic menu based on user role (freshwater managers see this dashboard)

---

## Overview

Create a comprehensive freshwater operations dashboard that auto-generates the weekly report currently created manually in Excel. The dashboard provides 4 tabs: Weekly Report, Forensic Analysis, Transfer Planning, and Station Details.

### UI Reference
Based on screenshots:
- `screencapture-...12_08_32.png` - Weekly Report tab (facility overview, growth, size distribution, batch KPIs, 90-day performance)
- `screencapture-...12_08_56.png` - Forensic Analysis tab (8-panel time series)
- `screencapture-...12_09_09.png` - Transfer Planning tab (batches ready for sea transfer)
- `screencapture-...12_09_54.png` - Station Details tab (per-station cards)

### Source Material
- Analysis: `Weekly Freshwater Report Analysis - Key Insights.md`
- Summary: `exec_and_freshwater_summary.rtf`
- Vision: `Freshwater Station Boss - Comprehensive UI_UX Vision.md`
- Prototype forensic analysis exists in current codebase (station-detail.tsx environmental tab?)

---

## Backend API Requirements

### Already Available
1. **Station Summary** - `/api/v1/infrastructure/freshwater-stations/{id}/summary/`
2. **Hall Summary** - `/api/v1/infrastructure/halls/{id}/summary/`
3. **Container Assignment Summary** - `/api/v1/batch/container-assignments/summary/`
4. **Growth Samples** - `/api/v1/batch/growth-samples/`
5. **Environmental Readings** - `/api/v1/environmental/readings/`
6. **Feeding Events** - `/api/v1/inventory/feeding-events/`
7. **Mortality Events** - `/api/v1/batch/mortality-events/`
8. **Health Sampling** - `/api/v1/health/health-sampling-events/`

### May Need to Create
1. **Facility Overview Aggregation** - All stations summary
2. **Size Distribution Calculation** - Using growth sample std_deviation
3. **90-Day Performance Comparison** - Historical batch performance
4. **Transfer Readiness Check** - Batches in 180-350g range
5. **Batch Performance KPIs** - 14/30/90-day mortality and TGC

---

## Feature Structure

```
client/src/features/freshwater/
├── api/
│   ├── api.ts              # TanStack Query hooks
│   └── api.test.ts
├── components/
│   ├── WeeklyReportTab.tsx         # Tab 1: Auto-generated report
│   │   ├── FacilityOverviewTable.tsx
│   │   ├── GrowthPerformanceTable.tsx
│   │   ├── SizeDistributionChart.tsx
│   │   ├── BatchPerformanceKPIsTable.tsx
│   │   └── NinetyDayComparisonCharts.tsx
│   ├── ForensicAnalysisTab.tsx     # Tab 2: 8-panel time series
│   │   ├── MultiPanelTimeSeries.tsx
│   │   └── EnvironmentalCorrelation.tsx
│   ├── TransferPlanningTab.tsx     # Tab 3: Transfer readiness
│   │   ├── TransferReadinessCards.tsx
│   │   └── SizeDistributionByFacility.tsx
│   ├── StationDetailsTab.tsx       # Tab 4: Per-station cards
│   │   └── StationCard.tsx
│   └── ExportToPDFButton.tsx       # Export functionality
├── hooks/
│   ├── useFreshwaterSummary.ts     # All stations KPIs
│   ├── useGrowthPerformance.ts     # Growth metrics by batch
│   ├── useSizeDistribution.ts      # Calculate from growth samples
│   ├── useBatchPerformanceKPIs.ts  # 14/30/90-day metrics
│   ├── useTransferReadiness.ts     # Batches ready for transfer
│   └── useForensicData.ts          # Environmental time-series
├── pages/
│   └── FreshwaterDashboardPage.tsx # Main page (<150 LOC)
├── types.ts
└── utils/
    ├── sizeDistributionCalc.ts     # Normal distribution modeling
    ├── performanceThresholds.ts    # Color-coding rules
    └── reportFormatting.ts         # Match weekly report format
```

---

## Task Breakdown (Session-Sized)

### Task 0: Weekly Report Analysis & Data Mapping
**Scope:** Map weekly report sections to backend data  
**Actions:**
- Analyze all 8 pages of weekly report
- Map each metric to backend endpoint
- Identify calculations needed (SGR, FCR, TGC, size distribution)
- Document thresholds for color-coding
- List any missing backend aggregations

**Deliverables:**
- `WEEKLY_REPORT_MAPPING.md` - Complete mapping document
- `BACKEND_GAPS.md` - Required endpoints/aggregations

**Success Criteria:**
- Every report metric mapped to data source
- Thresholds documented (mortality, TGC, FCR, temperature)
- Missing endpoints identified

**Estimated Context:** 15-20%

---

### Task 1: Feature Scaffolding & Calculations
**Scope:** Create structure, types, utilities  
**Actions:**
- Create `features/freshwater/` structure
- Define TypeScript interfaces for report data
- Implement size distribution calculator (using growth sample stats)
  - Formula: Normal distribution with mean, std_deviation
  - Size classes: <0.1g, 0.1-5g, 5-70g, 70-180g, 180-350g, >350g
- Implement performance threshold utilities
  - Mortality: 14d <0.50%, 30d <0.75%, 90d <1.20%
  - TGC: 90d >3.5 good, 3.0-3.5 medium, <3.0 poor
  - SGR and FCR color rules
- Implement report formatting utilities

**Files Created:**
- `features/freshwater/types.ts`
- `features/freshwater/utils/sizeDistributionCalc.ts`
- `features/freshwater/utils/sizeDistributionCalc.test.ts`
- `features/freshwater/utils/performanceThresholds.ts`
- `features/freshwater/utils/performanceThresholds.test.ts`
- `features/freshwater/utils/reportFormatting.ts`

**Success Criteria:**
- Size distribution calculation matches prototype results
- Threshold functions return correct colors
- All utilities tested (80%+ coverage)

**Estimated Context:** 25-30%

---

### Task 2: API Layer - Station Summaries
**Scope:** Create hooks for station-level data  
**Actions:**
- Create `features/freshwater/api/api.ts`
- Implement hooks:
  - `useFreshwaterStationsSummaries()` - All stations aggregated
  - `useStationDetail(id)` - Individual station metrics
  - `useHallSummaries(stationId)` - Halls within station
  - `useContainersByStation(stationId)` - Tank details
- Use existing backend summary endpoints
- Apply formatFallback for missing data

**Backend Endpoints:**
```typescript
// Get all stations
ApiService.apiV1InfrastructureFreshwaterStationsList()

// Get station summary
ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(id)

// Get halls in station
ApiService.apiV1InfrastructureHallsList({ freshwaterStation: id })

// Get hall summaries
ApiService.apiV1InfrastructureHallsSummaryRetrieve(id)
```

**Files Created:**
- `features/freshwater/api/api.ts` (partial)
- `features/freshwater/api/api.test.ts` (partial)

**Success Criteria:**
- Hooks tested with mocked ApiService
- Proper error handling
- Loading states managed

**Estimated Context:** 20-25%

---

### Task 3: API Layer - Batch Performance & Growth
**Scope:** Create hooks for batch/growth data  
**Actions:**
- Extend `features/freshwater/api/api.ts`
- Implement hooks:
  - `useGrowthPerformanceByBatch(stationId, dateRange)` - Growth metrics
  - `useBatchPerformanceKPIs(batchId, intervals: [14,30,90])` - Multi-interval KPIs
  - `useGrowthSamplesByStation(stationId)` - For size distribution
  - `useMortalityByBatch(batchId, intervals)` - Mortality tracking
  - `useFeedingEventsByBatch(batchId, dateRange)` - Feed consumption

**Backend Endpoints:**
```typescript
// Growth samples
ApiService.apiV1BatchGrowthSamplesList({ assignment__container__hall__freshwaterStation: id })

// Mortality events  
ApiService.apiV1BatchMortalityEventsList({ batch__in: [...ids] })

// Feeding events
ApiService.apiV1InventoryFeedingEventsList({ batch__in: [...ids], startDate, endDate })

// Container assignments for station
ApiService.apiV1BatchContainerAssignmentsList({ container__hall__freshwaterStation: id, isActive: true })
```

**Files Created:**
- Continue `features/freshwater/api/api.ts`
- Continue `features/freshwater/api/api.test.ts`

**Success Criteria:**
- All batch/growth hooks working
- Multi-entity filtering used correctly
- Test coverage for complex queries

**Estimated Context:** 25-30%

---

### Task 4: API Layer - Environmental & Transfer Planning
**Scope:** Create hooks for environmental data and transfer readiness  
**Actions:**
- Complete `features/freshwater/api/api.ts`
- Implement hooks:
  - `useEnvironmentalReadings(containerId, dateRange)` - For forensic analysis
  - `useHealthScores(batchId, dateRange)` - Health parameter scores
  - `useTransferReadyBatches(stationId)` - Batches 180-350g range
  - `useNinetyDayPerformance(startYear, endYear)` - Multi-year comparison
- Implement helper functions:
  - `calculateSGR(startWeight, endWeight, days, temperature)` - Specific Growth Rate
  - `calculateTGC(startWeight, endWeight, days, temperature)` - Thermal Growth Coefficient
  - `calculate90DayMetrics(batches)` - Aggregate 90-day performance

**Backend Endpoints:**
```typescript
// Environmental data for forensic analysis
ApiService.apiV1EnvironmentalReadingsList({ container, startDate, endDate })

// Health scores
ApiService.apiV1HealthIndividualFishObservationsList({ samplingEvent__assignment__batch })

// Transfer readiness (filter growth samples by weight range)
ApiService.apiV1BatchGrowthSamplesList({ avgWeightG__gte: 180, avgWeightG__lte: 350 })
```

**Files Created:**
- Complete `features/freshwater/api/api.ts`
- `features/freshwater/api/api.test.ts` (complete)
- `features/freshwater/hooks/useForensicData.ts`
- `features/freshwater/hooks/useTransferReadiness.ts`

**Success Criteria:**
- All hooks implemented and tested
- Environmental data efficiently queried
- Transfer readiness logic correct
- 90-day calculations match weekly report

**Estimated Context:** 30-35%

---

### Task 5: Weekly Report Tab - Facility Overview & Growth
**Scope:** Implement first sections of Tab 1  
**Actions:**
- Create `WeeklyReportTab.tsx` parent component
- Implement `FacilityOverviewTable.tsx`
  - Columns: Facility, Avg Weight (g), Count (M), Biomass (tons), Feed (tons), Mortality (count), Mortality (%), Mortality avg weight
  - Grand total row
  - Data from `useFreshwaterStationsSummaries`
- Implement `GrowthPerformanceTable.tsx`
  - Columns: Facility/Batch, Count, Biomass, Primo Weight, Current Weight, SGR, Growth (kg), Feed, Temp, FCR
  - Color-coded by thresholds
  - Data from `useGrowthPerformanceByBatch`
- Add "Export to PDF" button (placeholder for now)

**Files Created:**
- `features/freshwater/components/WeeklyReportTab.tsx`
- `features/freshwater/components/FacilityOverviewTable.tsx`
- `features/freshwater/components/GrowthPerformanceTable.tsx`
- `features/freshwater/components/WeeklyReportTab.test.tsx`

**Success Criteria:**
- Tables render with real data
- Color-coding works
- Calculations match weekly report
- N/A for missing data

**Estimated Context:** 30-35%

---

### Task 6: Weekly Report Tab - Size Distribution & Batch KPIs
**Scope:** Complete Tab 1 with remaining sections  
**Actions:**
- Implement `SizeDistributionChart.tsx`
  - Current distribution table (6 size classes)
  - Historical comparison (last week, same period last year)
  - Line charts: Smolt 180-350g, Smolt >350g (2021-2025)
  - Use `useSizeDistribution` hook
  - Calculate from growth sample statistics (normal distribution)
- Implement `BatchPerformanceKPIsTable.tsx`
  - Columns: Batch, Release Date, Station, Year Class, Avg Weight, Count, Biomass
  - KPIs: 14d/30d/90d mortality (%) and TGC
  - Color-coded thresholds
  - Data from `useBatchPerformanceKPIs`
- Implement `NinetyDayComparisonCharts.tsx`
  - 6 charts: avg weight, monthly avg weight, sales biomass, sales count, mortality, monthly mortality
  - Multi-year overlay (2021-2025)
  - Data from `useNinetyDayPerformance`

**Files Created:**
- `features/freshwater/components/SizeDistributionChart.tsx`
- `features/freshwater/components/BatchPerformanceKPIsTable.tsx`
- `features/freshwater/components/NinetyDayComparisonCharts.tsx`
- Tests for above components

**Success Criteria:**
- Size distribution calculated correctly (matches prototype)
- Batch KPIs match weekly report thresholds
- 90-day charts display multi-year data
- All color-coding accurate

**Estimated Context:** 35-40%

---

### Task 7: Forensic Analysis Tab - Multi-Panel Time Series
**Scope:** Implement Tab 2 with 8-panel environmental correlation view  
**Actions:**
- Create `ForensicAnalysisTab.tsx`
- Implement `MultiPanelTimeSeries.tsx`
  - 8 synchronized panels:
    1. O2 Levels (mg/L)
    2. CO2 Levels (mg/L)
    3. NO2 Levels (mg/L)
    4. NO3 Levels (mg/L)
    5. Temperature (°C)
    6. Daily Mortality (count) - marked as "Outcome Metric"
    7. Daily Feed (kg)
    8. Health Scores (Fin, Wound, Mucus, Eye) - 1-5 scale
  - Shared 500-day timeline
  - Lifecycle stage markers
  - Synchronized tooltips
  - Zoom/pan controls
- Use `useForensicData` hook
- Query environmental readings, mortality events, feeding events, health scores

**Technical Notes:**
- Use Recharts with synchronized charts
- Custom tooltip showing all 8 parameters at selected day
- Performance: Virtualization for 500 days of data
- Lazy load this tab (heavy component)

**Files Created:**
- `features/freshwater/components/ForensicAnalysisTab.tsx`
- `features/freshwater/components/MultiPanelTimeSeries.tsx`
- `features/freshwater/components/MultiPanelTimeSeries.test.tsx`

**Success Criteria:**
- All 8 panels render
- Synchronization works (hover shows data for all panels)
- Performance acceptable (< 3s load time)
- Lifecycle stage markers accurate

**Estimated Context:** 40-45% (largest single task)

---

### Task 8: Transfer Planning Tab
**Scope:** Implement Tab 3 with transfer readiness indicators  
**Actions:**
- Create `TransferPlanningTab.tsx`
- Implement `TransferReadinessCards.tsx`
  - Cards for each facility/batch ready for transfer
  - Display: Total, Avg Weight, Size Range, Mortality
  - Transfer readiness badge (color-coded)
  - "Plan Transfer" button (links to transfer form)
- Implement `SizeDistributionByFacility.tsx`
  - Bar charts showing size distribution per facility
  - Highlight 180-350g range (ideal transfer size)
- Use `useTransferReadyBatches` hook
- Filter criteria: avg_weight 180-350g, lifecycle_stage = Smolt, status = ACTIVE

**Files Created:**
- `features/freshwater/components/TransferPlanningTab.tsx`
- `features/freshwater/components/TransferReadinessCards.tsx`
- `features/freshwater/components/SizeDistributionByFacility.tsx`
- Tests for above

**Success Criteria:**
- Only transfer-ready batches shown
- Size distribution accurate
- Transfer button navigates to form
- Color-coded readiness indicators

**Estimated Context:** 25-30%

---

### Task 9: Station Details Tab
**Scope:** Implement Tab 4 with per-station overview cards  
**Actions:**
- Create `StationDetailsTab.tsx`
- Implement `StationCard.tsx` component
  - Display per station: Biomass, Count, Avg Weight, Mortality
  - Color-coded indicators
  - Click to drill into station detail page
- Grid layout (2-3 columns)
- Data from `useFreshwaterStationsSummaries`
- Link to existing station-detail.tsx pages

**Files Created:**
- `features/freshwater/components/StationDetailsTab.tsx`
- `features/freshwater/components/StationCard.tsx`
- Tests for above

**Success Criteria:**
- Card grid renders
- All stations displayed
- Color-coding works
- Navigation to station-detail works

**Estimated Context:** 20-25%

---

### Task 10: Main Dashboard Page & Integration
**Scope:** Create main page and integrate with app  
**Actions:**
- Create `FreshwaterDashboardPage.tsx`
  - Page header with station context
  - Tabs component (4 tabs)
  - Tab lazy loading
- Add route: `/freshwater` or `/operations/freshwater`
- Add sidebar menu item (RBAC-based)
- Add station selector dropdown (if user manages multiple stations)

**Routes:**
- `/freshwater` → FreshwaterDashboardPage
- Keep existing `/infrastructure/stations/:id` for detail view

**Sidebar:**
- "Freshwater Operations" menu item
- Icon: `fas fa-water`
- RBAC: Show for freshwater managers

**Files Created:**
- `features/freshwater/pages/FreshwaterDashboardPage.tsx`
- `features/freshwater/pages/FreshwaterDashboardPage.test.tsx`
- `features/freshwater/index.ts`

**Success Criteria:**
- All tabs accessible
- Station selector works (if applicable)
- Theme integration
- Mobile responsive

**Estimated Context:** 20-25%

---

### Task 11: Export to PDF Functionality
**Scope:** Implement PDF export for weekly report  
**Actions:**
- Add PDF export button to Weekly Report tab
- Options:
  - **Option A:** Frontend PDF generation (react-pdf or jsPDF)
  - **Option B:** Backend endpoint `/api/v1/freshwater/weekly-report/export/` (recommended)
  - **Option C:** Print-friendly CSS + browser print
- Implement based on available option
- Include all tables and charts from weekly report tab

**Note:** Recommend Option B for server-side generation, but Option C works immediately.

**Files Created:**
- `features/freshwater/components/ExportToPDFButton.tsx`
- `features/freshwater/utils/pdfExport.ts` (if using Option A or C)

**Success Criteria:**
- Export button works
- Generated PDF matches weekly report structure
- All data included

**Estimated Context:** 15-20%

---

### Task 12: Testing & Polish
**Scope:** Comprehensive testing and UX refinement  
**Actions:**
- Test all tabs with real backend data
- Test with empty batches (verify N/A fallbacks)
- Test forensic analysis with different date ranges
- Test size distribution calculations
- Test 90-day historical charts (may need mock data for multi-year)
- Performance testing (forensic tab with 500 days)
- Add loading skeletons
- Error boundaries for each tab

**Success Criteria:**
- All tests pass
- No console errors
- Performance acceptable
- Accessibility checks pass

**Estimated Context:** 25-30%

---

### Task 13: Documentation
**Scope:** Document feature for operators and developers  
**Actions:**
- Create `features/freshwater/README.md`
- Document weekly report auto-generation
- API dependencies documented
- User guide for freshwater managers
- Add screenshots

**Deliverables:**
- `features/freshwater/README.md`
- Updated main README

**Estimated Context:** 10-15%

---

## Total Estimated Tasks: 13
**Aggregate Context:** ~300-370% (requires 3-4 sessions)

---

## Success Criteria

### Functional
✅ Weekly report auto-generated from real-time data  
✅ All 8 sections of manual report replaced  
✅ Forensic analysis correlates environmental + outcome data  
✅ Transfer planning identifies ready batches  
✅ Station details provide quick overview  
✅ Export to PDF works

### Data Accuracy
✅ Metrics match manual weekly report calculations  
✅ Color-coding thresholds accurate:
  - Mortality: 14d <0.50%, 30d <0.75%, 90d <1.20%
  - TGC: 90d >3.5 green, 3.0-3.5 yellow, <3.0 red
  - Temperature by size class
  - FCR thresholds
✅ Size distribution calculated correctly  
✅ 90-day performance comparisons accurate

### Technical
✅ TypeScript strict (0 errors)  
✅ All tests passing (80%+ coverage)  
✅ Generated ApiService used exclusively  
✅ No client-side aggregation (use backend)  
✅ Honest fallbacks (N/A)  
✅ Performance optimized (lazy loading, caching)

---

## Known Challenges

1. **Size Distribution Calculation**
   - Requires normal distribution modeling
   - Use `avg_weight_g` and `std_deviation_weight` from growth samples
   - Need to validate calculation matches prototype

2. **90-Day Historical Data**
   - May not have 5 years of test data
   - Solution: Display available years + "Insufficient data" for missing

3. **Forensic Analysis Performance**
   - 500 days × 8 parameters = heavy data load
   - Solution: Virtualization, lazy loading, date range selector

4. **Color-Coding Complexity**
   - Temperature thresholds vary by fish size
   - Solution: Lookup table or function in performanceThresholds.ts

5. **Multi-Station Aggregation**
   - Need efficient queries to avoid N+1 problem
   - Solution: Use summary endpoints + multi-entity filtering

---

## Integration with Existing Features

**Reuse:**
- Station detail pages (link from Station Details tab)
- Hall detail pages (drill-down from facility overview)
- Batch detail pages (drill-down from batch performance table)
- Environmental monitoring components (forensic analysis may reuse)

**New:**
- Freshwater-specific KPI cards
- Weekly report auto-generation
- Size distribution visualization
- Transfer readiness indicators

---

## User Workflow

1. **Manager opens dashboard** → Sees latest weekly report auto-generated
2. **Reviews facility overview** → Identifies station with high mortality
3. **Switches to Forensic Analysis** → Correlates mortality spike with O2 drop
4. **Checks Transfer Planning** → Sees 5 batches ready for sea pen transfer
5. **Reviews Station Details** → Drills into specific station
6. **Exports to PDF** → Shares report with executives

---

**Plan Ready for Execution**


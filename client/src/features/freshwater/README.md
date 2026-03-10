# Freshwater Operations Dashboard

Real-time freshwater station management dashboard replacing manual weekly Excel reports.

## Tabs

### Weekly Report
Auto-generated weekly report with:
- **Facility Overview Table** - Per-station KPIs (biomass, population, weight, feed, mortality)
- **Growth Performance Table** - Per-batch growth metrics (SGR, FCR, primo/current weight)
- **Size Distribution Chart** - Normal distribution model across 6 weight classes
- **Batch Performance KPIs** - 14d/30d/90d mortality and TGC with color-coded thresholds

### Forensic Analysis
8-panel synchronized time series for environmental correlation:
- O2, CO2, NO2, NO3, Temperature, Mortality, Feed, Health Scores
- 500-day timeline per container

### Transfer Planning
Batches approaching sea transfer readiness:
- Uses `/api/v1/batch/forecast/sea-transfer/` endpoint
- Transfer readiness cards with confidence scoring
- KPI summary of total/ready/avg-days-to-transfer

### Station Details
Card grid of all freshwater stations with drill-down to station detail pages.

## Architecture

```
features/freshwater/
├── api/api.ts              # TanStack Query hooks (all data fetching)
├── components/
│   ├── WeeklyReportTab.tsx           # Tab 1 orchestrator
│   ├── FacilityOverviewTable.tsx     # Facility summary table
│   ├── GrowthPerformanceTable.tsx    # Batch growth table
│   ├── SizeDistributionChart.tsx     # Bar chart (Recharts)
│   ├── BatchPerformanceKPIsTable.tsx # 14/30/90d KPIs table
│   ├── ForensicAnalysisTab.tsx       # Tab 2 orchestrator
│   ├── MultiPanelTimeSeries.tsx      # 8-panel chart grid
│   ├── TransferPlanningTab.tsx       # Tab 3
│   ├── TransferReadinessCards.tsx    # Transfer batch cards
│   ├── StationDetailsTab.tsx         # Tab 4
│   ├── StationCard.tsx               # Station summary card
│   ├── StationFilter.tsx             # Station dropdown
│   ├── ExportToPDFButton.tsx         # Print-based PDF export
│   └── index.ts
├── pages/FreshwaterDashboardPage.tsx # Main page (<80 LOC)
├── utils/
│   ├── sizeDistributionCalc.ts       # Normal distribution CDF
│   ├── performanceThresholds.ts      # Color-coding rules
│   └── reportFormatting.ts           # Number/date formatting
├── types.ts
└── index.ts
```

## Backend API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `freshwater-stations/` | Station list |
| `freshwater-stations/{id}/summary/` | Station KPIs |
| `container-assignments/summary/?station={id}` | Biomass/population |
| `batches/{id}/growth_analysis/` | Growth time series |
| `batches/{id}/performance_metrics/` | Mortality, FCR |
| `feeding-events/summary/?freshwater_station={id}` | Feed totals |
| `environmental/readings/by_container/` | Environmental data |
| `forecast/sea-transfer/` | Transfer readiness |

## Color-Coding Thresholds

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Mortality 14d | <0.50% | 0.50-0.75% | >0.75% |
| Mortality 30d | <0.75% | 0.75-1.20% | >1.20% |
| Mortality 90d | <1.20% | 1.20-3.00% | >3.00% |
| TGC 90d | >3.5 | 3.0-3.5 | <3.0 |
| FCR | <1.0 | 1.0-1.15 | >1.15 |

## Reused from Executive Dashboard

- `KPICard` / `KPICardSkeleton` - KPI display
- `FacilityHealthBadge` - Health status badges
- `formatFallback` - Honest N/A display
- `calculateSGR` / `calculateTGC` / `calculateFCR` - Growth calculations

## Route

- **URL:** `/freshwater`
- **Sidebar:** "Freshwater Operations" (requires operational permission)

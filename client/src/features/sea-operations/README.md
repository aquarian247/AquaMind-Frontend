# Sea Operations Dashboard

Real-time sea operations control tower replacing the 47-page Tysdagsrapport (Tuesday Report).

## Tabs

### Weekly Report
12 KPI cards (biomass, weight, feed, TGC, SGR, mortality, lice, rings) plus a facility summary table with color-coded lice alerts per sea area.

### Lice Management
- Bakkafrost 2025 goals card (mature < 0.2, movable < 0.1, spring < 0.8)
- Per-area lice status table with Good/Warning/Critical badges
- Weekly lice trend chart (last 52 weeks)

### Market Intelligence
Placeholder for Stagri Salmon Index integration. When connected: price matrix by size class, historical trends, harvest timing optimizer.

### Facility Comparison
4 ranking bar charts (Top TGC, Best FCR, Lowest Mortality, Lowest Lice) plus comprehensive all-facilities comparison table.

## Architecture

```
features/sea-operations/
  api/api.ts                        # 5 TanStack Query hooks
  components/
    WeeklyReportTab.tsx             # Tab 1 orchestrator
    KPIDashboard.tsx                # 12 KPI cards
    FacilitySummaryTable.tsx        # Per-area table
    LiceManagementTab.tsx           # Tab 2 orchestrator
    LiceGoalsCard.tsx               # Bakkafrost 2025 goals
    LiceStatusTable.tsx             # Per-area lice status
    LiceTrendsCharts.tsx            # Recharts line chart
    MarketIntelligenceTab.tsx       # Tab 3 (placeholder)
    FacilityComparisonTab.tsx       # Tab 4 orchestrator
    PerformanceRankingChart.tsx     # Reusable horizontal bar chart
  pages/SeaOperationsDashboardPage.tsx
  utils/
    liceThresholds.ts              # Bakkafrost 2025 lice thresholds
    performanceRankings.ts         # Ranking algorithm (sort + top-N)
  types.ts
```

## Backend Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `batch/batches/geography-summary/` | Growth, mortality, feed KPIs |
| `infrastructure/areas/{id}/summary/` | Per-area biomass, population, rings |
| `batch/container-assignments/summary/` | Biomass/population totals |
| `health/lice-counts/summary/` | Lice totals + alert level |
| `health/lice-counts/trends/` | Lice time series |
| `inventory/feeding-events/summary/` | Feed totals |
| `infrastructure/areas/` | Area list by geography |
| `infrastructure/geographies/` | Geography options |

## Lice Thresholds (Bakkafrost 2025)

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Mature lice (per fish) | < 0.5 | 0.5-1.0 | >= 1.0 |
| Movable lice (per fish) | < 1.0 | 1.0-3.0 | >= 3.0 |
| Spring mature (Mar-May) | < 0.48 | 0.48-0.8 | >= 0.8 |

## Reused from Executive Dashboard

- `KPICard` / `KPICardSkeleton`, `formatKPI`
- `GeographyFilter` (Global / Faroe / Scotland)
- `FacilityHealthBadge`
- `formatFallback`

## Route

- **URL:** `/sea-operations`
- **Sidebar:** "Sea Operations" with `fas fa-ship` icon, `operational` permission

# Freshwater Dashboard - Backend API Gaps Analysis

**Date:** March 2026
**Status:** Most endpoints available; gaps can be handled client-side.

---

## Available Endpoints (Ready to Use)

| Endpoint | Station Filter | Use Case |
|----------|---------------|----------|
| `freshwater-stations/{id}/summary/` | Direct | Station KPIs |
| `container-assignments/summary/?station={id}` | Yes | Biomass/population |
| `batches/{id}/growth_analysis/` | Per-batch | Growth metrics |
| `batches/{id}/performance_metrics/` | Per-batch | Mortality, FCR |
| `feeding-events/summary/?freshwater_station={id}` | Yes | Feed totals |
| `environmental/readings/by_container/` | Per-container | Environmental data |
| `mortality-events/?batch={id}` | Per-batch | Mortality events |
| `forecast/sea-transfer/` | Geography filter | Transfer readiness |
| `health/health-sampling-events/` | Per-batch | Health scores |

## Gaps and Mitigations

### 1. All-Stations Aggregation
**Need:** Summary across all freshwater stations (grand total row).
**Gap:** No single endpoint returns aggregated data across all stations.
**Mitigation:** Fetch all stations, then fetch each station's summary and aggregate client-side. With typical 3-5 stations, this is 6-10 API calls - acceptable.

### 2. Size Distribution
**Need:** Percentage of fish in 6 weight classes.
**Gap:** No backend size distribution endpoint.
**Mitigation:** Calculate client-side using normal distribution CDF from `avg_weight_g` and `std_deviation_weight` in growth samples. This is a pure math operation.

### 3. Multi-Interval Mortality (14d/30d/90d)
**Need:** Mortality rates for 14, 30, and 90-day windows.
**Gap:** `performance_metrics` returns overall mortality, not windowed.
**Mitigation:** Use mortality events list filtered by date range, or calculate from `growth_analysis` time series. Client-side calculation from available data.

### 4. Historical 90-Day Comparison (Multi-Year)
**Need:** Charts showing 2021-2025 comparisons.
**Gap:** Depends on available historical data in the system.
**Mitigation:** Use `growth_analysis` with available date ranges. Show "Insufficient data" for missing years.

### 5. Hall Summary
**Need:** Per-hall KPIs within a station.
**Gap:** `halls/{id}/summary/` exists in backend but NOT in generated API client.
**Mitigation:** Use `apiRequest` helper for direct API call, or use `container-assignments/summary/?hall={id}`.

### 6. Environmental Parameter IDs
**Need:** Filter environmental readings by parameter type (O2, CO2, etc.).
**Gap:** Need to know parameter IDs for each environmental type.
**Mitigation:** Fetch parameter list first, then filter. Cache parameter mapping.

## Conclusion

No backend work is required to start the freshwater dashboard. All gaps can be handled with client-side calculations or by combining existing endpoints. The `forecast/sea-transfer/` endpoint is particularly useful for the Transfer Planning tab.

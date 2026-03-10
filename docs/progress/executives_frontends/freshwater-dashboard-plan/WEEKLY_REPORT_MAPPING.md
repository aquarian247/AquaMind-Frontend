# Freshwater Weekly Report - Backend Endpoint Mapping

**Purpose:** Map every metric in the weekly freshwater report to its backend data source.

---

## Tab 1: Weekly Report

### Facility Overview Table

| Metric | Endpoint | Field Path | Notes |
|--------|----------|------------|-------|
| Facility name | `GET /api/v1/infrastructure/freshwater-stations/` | `results[].name` | |
| Avg Weight (g) | `GET /api/v1/infrastructure/freshwater-stations/{id}/summary/` | `avg_weight_kg * 1000` | Convert kg to g |
| Count (M) | `GET /api/v1/batch/container-assignments/summary/?station={id}` | `total_population / 1_000_000` | |
| Biomass (tons) | `GET /api/v1/infrastructure/freshwater-stations/{id}/summary/` | `active_biomass_kg / 1000` | |
| Feed (tons) | `GET /api/v1/inventory/feeding-events/summary/?freshwater_station={id}` | `total_feed_kg / 1000` | Filter by date range |
| Mortality (count) | `GET /api/v1/batch/batches/{id}/performance_metrics/` | `mortality_metrics.total_count` | Per-batch, aggregate |
| Mortality (%) | `GET /api/v1/batch/batches/{id}/performance_metrics/` | `mortality_metrics.mortality_rate` | Per-batch, average |
| Grand Total | Client-side | Sum of all station rows | |

### Growth Performance Table

| Metric | Endpoint | Field Path | Notes |
|--------|----------|------------|-------|
| Facility/Batch | `GET /api/v1/batch/container-assignments/?isActive=true` | `batch.batch_number` | Station filter via container hierarchy |
| Count | `GET /api/v1/batch/container-assignments/summary/?station={id}` | `total_population` | |
| Biomass | Same as above | `active_biomass_kg` | |
| Primo Weight | `GET /api/v1/batch/batches/{id}/growth_analysis/` | `growth_metrics[0].avg_weight_g` | First sample |
| Current Weight | Same as above | `growth_metrics[-1].avg_weight_g` | Latest sample |
| SGR | Client-side calculation | `calculateSGR(primo, current, days)` | |
| Growth (kg) | Client-side | `current_biomass - start_biomass` | |
| Feed | `GET /api/v1/inventory/feeding-events/summary/?batch={id}` | `total_feed_kg` | |
| Temp | `GET /api/v1/environmental/readings/by_container/` | Average TEMPERATURE readings | |
| FCR | Client-side | `total_feed / biomass_gain` | |

### Size Distribution

| Metric | Endpoint | Field Path | Notes |
|--------|----------|------------|-------|
| Size classes (<0.1g to >350g) | `GET /api/v1/batch/batches/{id}/growth_analysis/` | `growth_metrics[-1].avg_weight_g` + std_deviation | Normal distribution CDF |
| Historical comparison | Same endpoint | Historical growth_metrics | Filter by date range |

### Batch Performance KPIs

| Metric | Endpoint | Field Path | Notes |
|--------|----------|------------|-------|
| Batch, Release Date, Station | `GET /api/v1/batch/batches/` + assignments | Basic batch info | |
| Avg Weight, Count, Biomass | `GET /api/v1/batch/batches/{id}/growth_analysis/` | Latest growth metric | |
| 14d/30d/90d Mortality (%) | `GET /api/v1/batch/batches/{id}/performance_metrics/` | `mortality_metrics` | Client-side interval calc |
| 14d/30d/90d TGC | `GET /api/v1/batch/batches/{id}/growth_analysis/` | `growth_metrics` | Client-side interval calc |

### 90-Day Performance Charts

| Metric | Endpoint | Notes |
|--------|----------|-------|
| Avg weight over time | `growth_analysis` | Multi-year overlay from growth_metrics array |
| Monthly avg weight | Same | Group by month |
| Mortality over time | `performance_metrics` | Multi-year overlay |
| Monthly mortality | Same | Group by month |

---

## Tab 2: Forensic Analysis

| Panel | Endpoint | Filter |
|-------|----------|--------|
| O2 Levels | `GET /api/v1/environmental/readings/by_container/?parameter_id=O2` | Container + date range |
| CO2 Levels | Same | `parameter_id=CO2` |
| NO2 Levels | Same | `parameter_id=NO2` |
| NO3 Levels | Same | `parameter_id=NO3` |
| Temperature | Same | `parameter_id=TEMPERATURE` |
| Daily Mortality | `GET /api/v1/batch/mortality-events/?batch={id}` | Date range |
| Daily Feed | `GET /api/v1/inventory/feeding-events/?batch={id}` | Date range |
| Health Scores | `GET /api/v1/health/health-sampling-events/` | Batch filter |

---

## Tab 3: Transfer Planning

| Metric | Endpoint | Notes |
|--------|----------|-------|
| Transfer-ready batches | `GET /api/v1/batch/forecast/sea-transfer/` | Has summary + upcoming batches |
| Size distribution | `growth_analysis` per batch | Normal distribution in 180-350g range |

---

## Tab 4: Station Details

| Metric | Endpoint |
|--------|----------|
| Per-station KPIs | `GET /api/v1/infrastructure/freshwater-stations/{id}/summary/` |
| Biomass, Count, Weight | `GET /api/v1/batch/container-assignments/summary/?station={id}` |

---

## Threshold Color-Coding

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Mortality 14d | <0.50% | 0.50-0.75% | >0.75% |
| Mortality 30d | <0.75% | 0.75-1.20% | >1.20% |
| Mortality 90d | <1.20% | 1.20-3.00% | >3.00% |
| TGC 90d | >3.5 | 3.0-3.5 | <3.0 |
| FCR | <1.0 (purple/excellent) | 1.0-1.15 | >1.15 |

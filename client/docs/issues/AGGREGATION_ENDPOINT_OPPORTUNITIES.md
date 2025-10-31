# Aggregation Endpoint Optimization Opportunities

**Date**: 2025-10-18  
**Status**: 🎯 OPTIMIZATION READY

---

## 🚨 **Current Performance Issue**

The History tab currently fetches:
- ❌ **690 growth samples** → 35 API calls
- ❌ **5720 mortality events** → 286 API calls
- ❌ **1100+ containers** → 55 API calls

**Total**: ~376 API calls, ~20 second load time

---

## ✅ **Available Aggregation Endpoints**

### **1. Growth Analysis (ALREADY EXISTS!)**
**Endpoint**: `GET /api/v1/batch/batches/{id}/growth_analysis/`

**Returns**:
```json
{
  "batch_number": "SCO-2024-001",
  "species": "Atlantic Salmon",
  "lifecycle_stage": "Adult",
  "start_date": "2024-03-24",
  "current_avg_weight": 1458.6,
  "growth_metrics": [
    {"date": "2024-06-23", "avg_weight_g": 0.14, "avg_length_cm": 2.6, "condition_factor": 0.8},
    {"date": "2024-06-30", "avg_weight_g": 0.42, ...},
    // ... ALL 690 samples already aggregated server-side!
  ],
  "growth_summary": {
    "total_samples": 690,
    "avg_growth_rate": 2.5,
    "min_weight_g": 0.14,
    "max_weight_g": 1458.6
  }
}
```

**Benefits**:
- ✅ **1 API call** instead of 35
- ✅ Server-side processing of 690 samples
- ✅ Pre-calculated growth rate
- ✅ Ready-to-use chart data

---

### **2. Performance Metrics (ALREADY EXISTS!)**
**Endpoint**: `GET /api/v1/batch/batches/{id}/performance_metrics/`

**Returns**:
```json
{
  "batch_number": "SCO-2024-001",
  "days_active": 573,
  "current_metrics": {
    "population_count": 2441188,
    "biomass_kg": 3560716.83,
    "avg_weight_g": 1458.6
  },
  "mortality_metrics": {
    "total_count": 696352,
    "total_biomass_kg": 48453.97,
    "mortality_rate": 22.19,
    "by_cause": [
      {"cause": "UNKNOWN", "count": 696352, "percentage": 100.0}
    ]
  },
  "container_metrics": [
    {"container_name": "S-SEA-01-Ring-11", "population": 244159, "biomass_kg": 356130.32, "density_kg_m3": 7.12},
    // ... for all 10 active containers
  ]
}
```

**Benefits**:
- ✅ **1 API call** instead of 286
- ✅ Pre-aggregated mortality stats
- ✅ Mortality rate already calculated
- ✅ Grouped by cause
- ✅ Container metrics included

---

### **3. Container Assignments Summary (ALREADY EXISTS!)**
**Endpoint**: `GET /api/v1/batch/container-assignments/summary/`

**Supports Filters**:
- `batch` - Filter by batch ID
- `is_active` - Filter by active status
- `geography`, `area`, `station`, `hall` - Location filters
- `container_type` - Container category (TANK, PEN, etc.)

**Returns**:
```json
{
  "active_biomass_kg": 3560716.83,
  "count": 10
}
```

**Benefits**:
- ✅ **1 API call** for lifecycle progression
- ✅ Can group by filters to get stage distribution
- ✅ Much faster than fetching all assignments

---

## 🎯 **Recommended Frontend Changes**

### **Replace: Growth Samples Fetching**

**BEFORE** (Current - 35 API calls):
```typescript
// Fetches 690 samples across 35 pages
const { data: growthSamples } = useQuery({
  queryFn: async () => {
    // Pagination loop fetching all 35 pages...
  }
});
```

**AFTER** (Use aggregation endpoint - 1 API call):
```typescript
const { data: growthAnalysis } = useQuery({
  queryKey: ['batch/growth-analysis', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId)
});

// Use pre-aggregated data
const growthTrendData = growthAnalysis?.growth_metrics || [];
const avgGrowthRate = growthAnalysis?.growth_summary?.avg_growth_rate || null;
```

---

### **Replace: Mortality Events Fetching**

**BEFORE** (Current - 286 API calls):
```typescript
// Fetches 5720 events across 286 pages
const { data: mortalityEvents } = useQuery({
  queryFn: async () => {
    // Pagination loop fetching all 286 pages...
  }
});
```

**AFTER** (Use aggregation endpoint - 1 API call):
```typescript
const { data: performanceMetrics } = useQuery({
  queryKey: ['batch/performance-metrics', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId)
});

// Use pre-aggregated metrics
const mortalityRate = performanceMetrics?.mortality_metrics?.mortality_rate || 0;
const mortalityByCause = performanceMetrics?.mortality_metrics?.by_cause || [];
const totalMortality = performanceMetrics?.mortality_metrics?.total_count || 0;
```

---

### **Keep: Detailed Tables (Paginated)**

For the **detail tables** showing individual records:
- ✅ **Keep** fetching latest 20 mortality events for detail table
- ✅ **Keep** fetching latest 20 growth samples for detail table
- ✅ **Use** aggregation for charts and summary metrics

**Best of both worlds**:
- Charts/summaries from aggregation endpoints (fast)
- Detail tables show recent records (no need for all 5720 events)

---

## 📊 **Performance Comparison**

| Data Source | Current Approach | With Aggregation | Time Saved |
|-------------|------------------|------------------|------------|
| **Growth Samples** | 35 API calls | 1 API call | ~5 seconds |
| **Mortality Events** | 286 API calls | 1 API call | ~10 seconds |
| **Containers** | 55 API calls | Shared/cached | ~5 seconds |
| **Total** | ~376 API calls, ~20 seconds | **~3 API calls, ~1 second** | **~19 seconds** |

---

## 🎯 **Aggregation Gaps (If Any)**

Let me check what else might be missing:

### **Lifecycle Stage Distribution**
**Need**: Aggregated assignment counts by lifecycle stage for a batch

**Current Solution**: Fetch all 60 assignments and group client-side ✅ (OK - only 60 records)

**Gap**: No dedicated endpoint, but 60 assignments is manageable

---

### **Transfer Statistics**
**Need**: Transfer counts, totals for a batch

**Current**: Fetch all transfers (batch 206 has 0) ✅ (OK - usually small dataset)

**Gap**: No dedicated endpoint, but transfers are usually <100 per batch

---

## 🚀 **Recommended Implementation**

### **Phase 1: Use Existing Aggregation Endpoints** (30 min)
1. ✅ Replace growth samples loop with `growth_analysis` endpoint
2. ✅ Replace mortality events loop with `performance_metrics` endpoint
3. ✅ Keep container/assignment fetching (only 60-100 records)

### **Phase 2: Consider New Endpoints** (If needed)
Only if specific performance issues remain:
- Lifecycle stage distribution aggregation
- Transfer statistics aggregation

---

## 📁 **Files to Modify**

**Frontend**: `components/batch-management/BatchTraceabilityView.tsx`

**Changes**:
```typescript
// Add new aggregation queries
const { data: growthAnalysis } = useQuery({
  queryKey: ['batch/growth-analysis', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId)
});

const { data: performanceMetrics } = useQuery({
  queryKey: ['batch/performance-metrics', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId)
});

// Use aggregated data for charts
const growthTrendData = growthAnalysis?.growth_metrics || [];
const mortalityRate = performanceMetrics?.mortality_metrics?.mortality_rate || 0;

// Keep detail table queries (fetch only latest 20 for display)
const { data: recentMortalityEvents } = useQuery({
  // Fetch page 1 only for detail table
});
```

---

## ✅ **Verdict**

**You have excellent aggregation endpoints already!**

1. ✅ `growth_analysis` - Replaces 35 API calls
2. ✅ `performance_metrics` - Replaces 286 API calls  
3. ✅ Infrastructure summaries - Available for other features

**No gaps for the History tab!** Just need to use what's already there.

---

**Should I implement this optimization now?** It will reduce load time from 20 seconds to <1 second! 🚀


















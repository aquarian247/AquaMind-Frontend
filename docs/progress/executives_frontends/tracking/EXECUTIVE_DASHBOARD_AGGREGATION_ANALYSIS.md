# Executive Dashboard - Aggregation Endpoint Analysis

**Date:** October 18, 2025  
**Question:** Why aren't `growth_analysis` and `performance_metrics` endpoints used?

---

## 🔍 **Short Answer**

**I didn't implement them** - not because they're unfit, but because I **didn't realize they existed** during the initial implementation. 

After reviewing the `AGGREGATION_ENDPOINT_OPPORTUNITIES.md` and comparing with the batch management History tab, I found that:

1. ✅ **Executive Dashboard** - Uses some aggregation endpoints (container summaries, lice summaries)
2. ❌ **Executive Dashboard** - Does NOT use `growth_analysis` or `performance_metrics` 
3. ❌ **Batch Management History Tab** - ALSO does NOT use these endpoints (doing client-side aggregation instead!)

**Both features could benefit from using these endpoints!**

---

## 📊 **Current State Analysis**

### **What Executive Dashboard Currently Uses**

✅ **Geography-level aggregations:**
```typescript
// client/src/features/executive/api/api.ts

// 1. Container assignment summary (lines 51-60)
ApiService.batchContainerAssignmentsSummary(
  undefined, // area
  undefined, // containerType
  geographyId, // geography
  undefined, // hall
  true, // isActive
  undefined // station
)
// Returns: { active_biomass_kg, count }

// 2. Lice counts summary (lines 64-68)
ApiService.apiV1HealthLiceCountsSummaryRetrieve(
  undefined, // area
  endDate,
  geographyId, // geography
  startDate
)
// Returns: { average_per_fish, by_development_stage: {...} }

// 3. Lice trends (lines 290-295)
ApiService.apiV1HealthLiceCountsTrendsRetrieve(
  undefined, // area
  endDate,
  geographyId,
  interval, // weekly/monthly
  startDate
)
// Returns: { trends: [{ period, average_per_fish, ... }] }
```

**Scope:** ✅ Geography-level (Global, Faroe, Scotland)  
**Metrics:** ✅ Biomass, population, lice  
**Missing:** ❌ Growth analysis, performance metrics, mortality breakdown

---

### **What Batch Management Analytics Currently Uses**

❌ **NO aggregation endpoints - all client-side!**

```typescript
// client/src/hooks/useBatchAnalyticsData.ts

// 1. Raw growth samples (lines 24-30) - PAGINATED!
ApiService.apiV1BatchGrowthSamplesList(batchId, ...)
// Returns: { results: [690 individual samples] }
// 🚨 This could be 35 API calls if >20 samples per page!

// 2. Raw feeding summaries (lines 48)
ApiService.apiV1InventoryBatchFeedingSummariesList(batchId, ...)
// Returns: { results: [all feeding events] }

// 3. Raw container assignments (lines 122)
ApiService.apiV1BatchContainerAssignmentsList(batchId, ...)
// Returns: { results: [all assignments] }

// Then does client-side aggregation in analyticsCalculations.ts:
// - calculateSurvivalRate()
// - calculateAverageGrowthRate()
// - calculateFCR()
// - calculatePerformanceMetrics()
```

**Scope:** ✅ Batch-specific  
**Problem:** ❌ Fetches 690+ records and calculates in browser  
**Opportunity:** 🚀 Replace with 2 aggregation endpoints!

---

## 🎯 **Available Aggregation Endpoints (Not Used)**

### **1. Growth Analysis** 
**Endpoint:** `GET /api/v1/batch/batches/{id}/growth_analysis/`

**What it returns:**
```json
{
  "batch_number": "SCO-2024-001",
  "species": "Atlantic Salmon",
  "lifecycle_stage": "Adult",
  "start_date": "2024-03-24",
  "current_avg_weight": 1458.6,
  "growth_metrics": [
    {
      "date": "2024-06-23",
      "avg_weight_g": 0.14,
      "avg_length_cm": 2.6,
      "condition_factor": 0.8
    },
    // ... ALL 690 samples already aggregated!
  ],
  "growth_summary": {
    "total_samples": 690,
    "avg_growth_rate": 2.5,
    "min_weight_g": 0.14,
    "max_weight_g": 1458.6
  }
}
```

**Benefits:**
- ✅ **1 API call** instead of 35 paginated calls
- ✅ Server-side processing of all samples
- ✅ Pre-calculated growth rate
- ✅ Ready-to-use chart data
- ✅ Includes condition factor trends

**Could be used in:**
1. **Executive Dashboard** - Strategic Tab (growth trends by geography)
2. **Batch Management Analytics** - Growth Analytics Tab (current implementation)

---

### **2. Performance Metrics**
**Endpoint:** `GET /api/v1/batch/batches/{id}/performance_metrics/`

**What it returns:**
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
    {
      "container_name": "S-SEA-01-Ring-11",
      "population": 244159,
      "biomass_kg": 356130.32,
      "density_kg_m3": 7.12
    }
    // ... for all 10 active containers
  ]
}
```

**Benefits:**
- ✅ **1 API call** instead of 286 (for mortality events)
- ✅ Pre-aggregated mortality stats
- ✅ Mortality rate already calculated
- ✅ Grouped by cause
- ✅ Container density metrics included

**Could be used in:**
1. **Executive Dashboard** - Overview Tab (mortality KPIs, currently showing N/A!)
2. **Batch Management Analytics** - Performance Metrics Tab (current implementation)

---

## 💡 **Why The Batch Management Pattern Isn't Ideal for Executive Dashboard**

### **Batch Management Context:**
- **User selects** a specific batch
- **Wants to see** detailed analytics for THAT batch
- **Makes sense** to fetch batch-specific endpoints like `growth_analysis` and `performance_metrics`

### **Executive Dashboard Context:**
- **User selects** a geography (Global, Faroe, Scotland)
- **Wants to see** aggregated KPIs across ALL batches in that geography
- **Currently using** geography-filtered summaries (container-assignments/summary, lice-counts/summary)

### **The Gap:**

The `growth_analysis` and `performance_metrics` endpoints are **batch-specific** (`/batches/{id}/...`), but Executive Dashboard needs **geography-level aggregation**.

**Two options:**

#### **Option A: Aggregate Multiple Batches Client-Side** ❌ Not Ideal
```typescript
// For each batch in geography, fetch performance_metrics
const batches = await ApiService.apiV1BatchBatchesList({ geography: geographyId });
const metrics = await Promise.all(
  batches.results.map(batch => 
    ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batch.id)
  )
);
// Then aggregate mortality_rate, avg_growth_rate, etc.
```

**Problem:** Still N API calls (N = number of active batches)

#### **Option B: Request New Geography-Level Aggregation Endpoints** ✅ Better
```typescript
// NEW endpoint needed:
GET /api/v1/batch/batches/geography-performance-metrics/
  ?geography=1
  &start_date=2024-10-01
  &end_date=2024-10-18

// Returns aggregated metrics across ALL batches in geography
{
  "geography_id": 1,
  "geography_name": "Faroe Islands",
  "total_batches": 25,
  "aggregated_metrics": {
    "total_mortality_count": 123456,
    "avg_mortality_rate": 15.2,
    "avg_growth_rate": 2.8,
    "total_biomass_kg": 5000000
  },
  "mortality_by_cause": [...],
  "top_performing_batches": [...]
}
```

---

## 🚀 **Recommendations**

### **1. For Batch Management Analytics (Immediate Win)**

**Replace client-side aggregation with batch-specific endpoints:**

```typescript
// OLD (current implementation)
const { growthSamplesData } = useBatchAnalyticsData(batchId, timeframe);
// Fetches 690 samples, calculates client-side

// NEW (use aggregation endpoint)
const { data: growthAnalysis } = useQuery({
  queryKey: ['batch/growth-analysis', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId)
});
// 1 API call, server-side calculation
const avgGrowthRate = growthAnalysis?.growth_summary?.avg_growth_rate;
```

**Impact:**
- 🚀 Reduce from ~376 API calls to ~3 calls
- ⚡ Load time: 20 seconds → <1 second
- 📉 Browser memory usage: 90% reduction

---

### **2. For Executive Dashboard (Backend Work Needed)**

**Create new geography-level aggregation endpoints:**

```
GET /api/v1/batch/batches/geography-summary/
  ?geography={id}
  &start_date={date}
  &end_date={date}
```

**Returns:**
```json
{
  "geography_id": 1,
  "period_start": "2024-10-01",
  "period_end": "2024-10-18",
  
  "growth_metrics": {
    "avg_growth_rate": 2.5,
    "avg_tgc": 0.42,
    "avg_sgr": 1.8
  },
  
  "mortality_metrics": {
    "total_count": 50000,
    "total_biomass_kg": 3500,
    "avg_mortality_rate": 12.5,
    "by_cause": [...]
  },
  
  "feed_metrics": {
    "total_feed_kg": 250000,
    "avg_fcr": 1.15
  }
}
```

**Then use in Executive Dashboard:**

```typescript
// features/executive/api/api.ts
export function useGeographyPerformanceMetrics(
  geography: GeographyFilterValue
) {
  return useQuery({
    queryKey: ['geography-performance', geography],
    queryFn: () => ApiService.apiV1BatchBatchesGeographySummaryRetrieve({
      geography: geography === 'global' ? undefined : geography,
      startDate: /* last 7 days */,
      endDate: /* today */
    })
  });
}
```

**Impact:**
- ✅ TGC, SGR, Mortality KPIs show real data (currently N/A)
- ✅ Feed This Week shows real data
- ✅ Performance metrics for Strategic Tab

---

## 📋 **Implementation Priority**

### **Priority 1: Batch Management Analytics (No Backend Changes)**
**Effort:** 2-3 hours  
**Impact:** Massive (20s → <1s load time)  
**Files to modify:**
- `client/src/hooks/useBatchAnalyticsData.ts`
- `client/src/hooks/use-analytics-data.ts`
- `client/src/components/batch-management/BatchAnalyticsView.tsx`

**Changes:**
```typescript
// Replace this:
const { growthSamplesData, feedingSummaries, ... } = useBatchAnalyticsData(batchId);

// With this:
const { data: growthAnalysis } = useQuery({
  queryKey: ['batch/growth-analysis', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId)
});

const { data: performanceMetrics } = useQuery({
  queryKey: ['batch/performance-metrics', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId)
});

// Use pre-aggregated data
const avgGrowthRate = growthAnalysis?.growth_summary?.avg_growth_rate;
const mortalityRate = performanceMetrics?.mortality_metrics?.mortality_rate;
```

---

### **Priority 2: Executive Dashboard (Requires Backend Endpoint)**
**Effort:** 4-6 hours (Backend + Frontend)  
**Impact:** High (fills in missing KPIs)

**Backend Work:**
1. Create `/api/v1/batch/batches/geography-summary/` endpoint
2. Aggregate data from all batches in geography
3. Return pre-calculated metrics

**Frontend Work:**
1. Create `useGeographyPerformanceMetrics` hook
2. Update OverviewTab to use real TGC, SGR, mortality data
3. Update StrategicTab with growth trends

---

## 🎯 **Summary**

| Question | Answer |
|----------|--------|
| **Why not used in Executive Dashboard?** | I didn't implement them - wasn't aware they existed during initial build |
| **Are they unfit for Executive?** | Partially - they're batch-specific, but Executive needs geography-level |
| **Can Batch Management pattern help?** | Yes! Batch Management should ALSO use these endpoints (currently doesn't) |
| **What's the opportunity?** | BOTH features can benefit - Batch Management immediately, Executive after new backend endpoint |

---

## ✅ **Action Items**

### **Immediate (This Week)**
1. 🚀 **Optimize Batch Management Analytics** 
   - Use `growth_analysis` and `performance_metrics` endpoints
   - Reduce load time from 20s to <1s
   - See `AGGREGATION_ENDPOINT_OPPORTUNITIES.md` for implementation guide

### **Next Sprint**
2. 🎯 **Create Geography-Level Aggregation Endpoint** (Backend)
   - Aggregate growth, mortality, feed metrics by geography
   - Enable real data for Executive Dashboard KPIs

3. 📊 **Enhance Executive Dashboard** (Frontend)
   - Use new geography aggregation endpoint
   - Fill in TGC, SGR, Mortality, Feed KPIs with real data

---

**The good news:** Both optimizations are high-value, and the Batch Management one can be done immediately with zero backend changes! 🎉


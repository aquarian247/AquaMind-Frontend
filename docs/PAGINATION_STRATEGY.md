# Frontend Pagination Strategy

**Date:** 2025-11-22  
**Status:** ✅ Canonical Reference

---

## 🎯 Core Principle

**NEVER fetch all pages of large datasets.** Use the right data access pattern for each use case.

---

## 📊 Data Access Patterns

### Pattern 1: **Full Fetch (< 200 records)**

**When to use:**
- Small reference data (users, geographies, species, lifecycle stages)
- Configuration data (container types, feed types)
- Data that fits in 1-10 pages

**Example:**
```typescript
// ✅ CORRECT: Batches (144 total = ~7 pages)
const allBatches = await fetchAllPages(
  (page) => ApiService.apiV1BatchBatchesList(undefined, undefined, ..., page, ..., status),
  100 // maxPages
);
```

**Datasets:**
- Batches: 144 records (7 pages) ✅
- Containers: 2,016 records (100 pages) ⚠️ Use server filter
- Users: 6 records (1 page) ✅
- Transfer Workflows: 633 records (32 pages) ⚠️ Use pagination

---

### Pattern 2: **Server-Side Pagination (> 200 records for viewing)**

**When to use:**
- Large event datasets (feeding, mortality, growth samples)
- User wants to browse/search with pagination controls
- Data is displayed in tables with page navigation

**Example:**
```typescript
// ✅ CORRECT: Feeding events (1.6M records!)
const { data } = useQuery({
  queryKey: ['feeding-events', batchId, currentPage],
  queryFn: () => ApiService.apiV1InventoryFeedingEventsList(
    ...,
    batchId,  // Server filter
    ...,
    currentPage, // Only fetch THIS page
    ...
  )
});

// User can navigate pages: 1, 2, 3, ... N
```

**Datasets:**
- Feeding Events: 1,596,240 records (79,812 pages!) ✅ Paginated
- Mortality Events: 926,900 records (46,345 pages!) ✅ Paginated
- Growth Samples: 114,400 records (5,720 pages!) ✅ Paginated

---

### Pattern 3: **Server-Side Aggregation (> 200 records for KPIs)**

**When to use:**
- Need totals, averages, or summaries
- Displaying KPIs, dashboards, or metrics
- Don't need individual records

**Example:**
```typescript
// ✅ CORRECT: Use aggregation endpoint
const { data } = useQuery({
  queryKey: ['batch-performance', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId)
});
// Returns: { mortality_metrics: { total_count, total_biomass_kg, mortality_rate, by_cause } }
```

**Available Aggregation Endpoints:**
- `/api/v1/batch/batches/{id}/performance_metrics/` - Mortality totals
- `/api/v1/batch/batches/geography-summary/` - Geography KPIs
- `/api/v1/inventory/feeding-events/summary/` - Feed totals
- `/api/v1/health/lice-counts/summary/` - Lice aggregates

---

## ⚠️ Anti-Patterns (DO NOT DO!)

### ❌ Fetching All Pages of Large Datasets

```typescript
// ❌ WRONG: Would fetch 46,345 pages!
while (hasMore) {
  const events = await ApiService.apiV1BatchMortalityEventsList(batchId, undefined, page);
  allEvents.push(...events.results);
  page++;
}
```

**Why it's bad:**
- Crashes browser with OOM
- Takes minutes to load
- Unnecessary network load
- Backend timeout risk

---

### ❌ Client-Side Aggregation of Large Datasets

```typescript
// ❌ WRONG: Fetches all 1.6M feeding events to calculate sum!
const allEvents = await fetchAllPages(...);
const total = allEvents.reduce((sum, e) => sum + e.amount_kg, 0);
```

**Why it's bad:**
- Should use server-side aggregation endpoint
- Wastes bandwidth
- Slow and inefficient

---

## 📏 Decision Matrix

| Dataset Size | User Action | Pattern | Example |
|---|---|---|---|
| < 200 records | View list | Full Fetch | Batches, Species, Users |
| > 200 records | View list | Server Pagination | Feeding Events table |
| > 200 records | View KPIs | Server Aggregation | Total feed consumed |
| > 200 records | View chart | Sample + Aggregation | Growth trend (weekly averages) |

---

## ✅ Correct Implementations

### 1. Batches (144 records)
```typescript
// ✅ Full fetch with status filter
const allBatches = await fetchAllPages(
  (page) => api.batch.getAll({ page, status: 'ACTIVE' }),
  100
);
```

### 2. Feeding Events (1.6M records)
```typescript
// ✅ Paginated view
const { data } = useQuery({
  queryKey: ['feeding-events', batchId, currentPage, dateRange],
  queryFn: () => ApiService.apiV1InventoryFeedingEventsList(
    ...,
    batchId,
    ...,
    feedingDateAfter,  // Date filter
    feedingDateBefore,
    ...,
    currentPage,       // Single page only!
    ...
  )
});

// ✅ Use summary endpoint for KPIs
const { data: summary } = useQuery({
  queryKey: ['feeding-summary', batchId],
  queryFn: () => ApiService.feedingEventsSummary({ batch: batchId })
});
// Returns: { events_count, total_feed_kg, total_cost }
```

### 3. Mortality Events (926K records)
```typescript
// ✅ Use performance_metrics aggregation endpoint
const { data } = useQuery({
  queryKey: ['batch-performance', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId)
});
// Returns: { mortality_metrics: { total_count, total_biomass_kg, by_cause } }
```

### 4. Growth Samples (114K records)
```typescript
// ✅ Use growth_analysis aggregation endpoint
const { data } = useQuery({
  queryKey: ['growth-analysis', batchId],
  queryFn: () => ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId)
});
// Returns: { growth_metrics: [...], growth_summary: { avg_growth_rate, min/max_weight } }
```

---

## 🔍 Audit Checklist

When reviewing a data-fetching hook, ask:

1. **How many records exist?** (Check database or API count)
2. **What does the user need?** (List view? KPI? Chart?)
3. **Is there an aggregation endpoint?** (Check `/docs/AGGREGATION_ENDPOINTS_CATALOG.md`)
4. **If no aggregation, is pagination implemented?** (page parameter passed? UI controls?)

---

## 🛠️ Implementation Guide

### For New Features

1. **Check data volume first**: Query the database or API `count`
2. **If < 200 records**: Use `fetchAllPages` utility
3. **If > 200 records**:
   - For **KPIs**: Use/request server aggregation endpoint
   - For **lists**: Implement pagination controls
   - For **charts**: Use aggregation or weekly/monthly rollups

### For Existing Code

1. **Search for**: `ApiService.*List()` calls without pagination
2. **Check**: `.results || []` without loop
3. **Verify**: Data volume in database
4. **Fix**: Apply appropriate pattern

---

## 🎯 Summary

| Use Case | Data Volume | Solution |
|---|---|---|
| **Batch list** | 144 | ✅ Fetch all pages (7 pages) |
| **Container list** | 2,016 | ⚠️ Filter at API, fetch filtered results |
| **Mortality KPI** | 926,900 | ✅ Use `performance_metrics` endpoint |
| **Feeding events table** | 1,596,240 | ✅ Paginated table (20/page) |
| **Growth chart** | 114,400 | ✅ Use `growth_analysis` endpoint |
| **Users admin** | 6 | ✅ Fetch all (1 page) |

---

**Key Insight:** Most large datasets already have server-side aggregation endpoints. Check `AGGREGATION_ENDPOINTS_CATALOG.md` before implementing any data fetching!






















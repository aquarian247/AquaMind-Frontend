# Frontend Integration Grind: Tips, Tricks & Pitfalls

## 🚨 Critical Issues & Quick Fixes

### 1. Double API Path Problem
**Symptom**: API calls fail with 404, but backend is running
**Root Cause**: OpenAPI.BASE configuration conflict
```typescript
// ❌ BROKEN: Creates /api/v1/api/v1/ path
OpenAPI.BASE = `${DJANGO_API_URL}/api/v1`; // in api/index.ts
OpenAPI.BASE = DJANGO_API_URL; // in config.ts

// ✅ FIXED
// Remove duplicate BASE setting, keep only in config.ts
OpenAPI.BASE = DJANGO_API_URL;
```
**Debug**: Check Network tab for double `/api/v1/api/v1/` paths

---

### 2. Filter Shows "Scotland" But No Scotland Data
**Symptom**: Hardcoded filter options don't match database
**Root Cause**: Static arrays instead of dynamic API calls
```typescript
// ❌ ANTI-PATTERN
const geographies = ['Faroe Islands', 'Scotland'];

// ✅ SOLUTION: Dynamic API-driven filters
const { data: filterOptions } = useQuery({
  queryKey: ["filter-options"],
  queryFn: () => api.getFilterOptions(),
  staleTime: 5 * 60 * 1000, // 5min cache
});

// Graceful fallback
const currentOptions = filterOptions || fallbackDefaults;
```
**Pro Tip**: Always add fallbacks for API failures

---

### 3. Pagination Returns Same 20 Containers
**Symptom**: Only 20 items show, but API says 70 total
**Root Cause**: Wrong page_size parameter or API ignoring filters
```typescript
// ❌ BROKEN: API might ignore page_size
const response = await ApiService.list({ page_size: 100 });

// ✅ SOLUTION: Use API's default page size
const response = await ApiService.list(
  undefined, undefined, undefined, undefined, // params
  undefined, undefined, page, undefined // page last
);

// Handle pagination properly
while (hasNextPage) {
  allData.push(...response.results);
  hasNextPage = response.next !== null;
}
```
**Debug**: Check Network tab for actual API parameters sent

---

### 4. 0 Containers But API Returns Data
**Symptom**: UI shows 0, but curl returns data
**Root Cause**: Authentication token issues
```typescript
// ✅ SOLUTION: Debug with AuthService
import { AuthService } from '@/services/auth.service';

console.log('Token available:', AuthService.isAuthenticated());
console.log('Access token:', AuthService.getAccessToken());
console.log('Refresh token:', AuthService.getRefreshToken());
```
**Quick Fix**: Check browser Network tab for 401 errors

---

### 5. toFixed() Errors on Coordinates/Numbers
**Symptom**: "area.coordinates.lat.toFixed is not a function"
**Root Cause**: API returns strings instead of numbers
```typescript
// ❌ BROKEN: API strings cause toFixed() errors
coordinates: {
  lat: (raw as any).latitude ?? 0,
  lng: (raw as any).longitude ?? 0,
}

// ✅ FIXED: Parse as numbers with fallbacks
coordinates: {
  lat: parseFloat((raw as any).latitude) || 0,
  lng: parseFloat((raw as any).longitude) || 0,
}

// ✅ EXTRA SAFETY: Template type checking
{typeof area.coordinates.lat === 'number' && !isNaN(area.coordinates.lat)
  ? area.coordinates.lat.toFixed(4)
  : 'N/A'
}
```
**Debug**: `console.log(typeof raw.latitude)` to check data types
**Pro Tip**: Always parse API numeric strings with `parseFloat()` or `Number()`

---

### 7. "No Data Available" Messaging
**Symptom**: UI shows hardcoded zeros or fake data instead of clear messaging
**Root Cause**: No fallback handling for missing API data
```typescript
// ❌ ANTI-PATTERN: Hardcoded values
<div className="text-2xl font-bold">{area.mortalityRate}%</div>
<div className="text-2xl font-bold">{area.feedConversion}</div>

// ✅ SOLUTION: Data-driven with fallbacks
<div className="text-2xl font-bold">
  {kpi?.hasData ? kpi.averageWeightKg.toFixed(2) : 'N/A'}
</div>
<p className="text-xs text-muted-foreground">
  {kpi?.hasData ? 'kg per fish' : 'No data available'}
</p>

// ✅ KPI Cards Pattern
{kpi?.hasData ? (
  <div className="text-2xl font-bold text-blue-600">
    {(kpi.totalBiomassKg / 1000).toFixed(1)}
  </div>
) : (
  <div className="text-2xl font-bold text-blue-600">N/A</div>
)}
<p className="text-xs text-muted-foreground">
  {kpi?.hasData ? 'tonnes' : 'No data available'}
</p>

// ✅ Environmental Data Pattern
{environmentalData?.hasData ? (
  `${environmentalData.waterTemperature}°C`
) : 'N/A'}
```
**Debug**: Add `hasData` flag to all data objects
**Pro Tip**: Never show "0" when data is actually missing - use "N/A" or "No data available"

---

### 8. FCR Trends Integration
**Symptom**: Feed Conversion Ratio shows "N/A" instead of real data
**Root Cause**: Not using the `/api/v1/operational/fcr-trends/` endpoint
```typescript
// ✅ SOLUTION: Use FCR trends endpoint with AuthService
import { AuthService, authenticatedFetch, apiConfig } from '@/services/auth.service';

const { data: fcrData } = useQuery({
  queryKey: ["area", areaId, "fcr"],
  queryFn: async () => {
    // AuthService handles authentication automatically
    if (!AuthService.isAuthenticated()) return { fcr: null, hasData: false };

    const response = await authenticatedFetch(
      `${apiConfig.baseUrl}/api/v1/operational/fcr-trends/?geography_id=${areaId}&page_size=1`
    );

    const data = await response.json();
    const fcrTrends = data.results || [];

    if (fcrTrends.length > 0) {
      const latestFcr = fcrTrends[0];
      return {
        fcr: parseFloat(latestFcr.fcr || '0'),
        hasData: true
      };
    }

    return { fcr: null, hasData: false };
  }
});

// ✅ TEMPLATE: Display FCR with proper fallbacks
{fcrData?.hasData ? (
  <div className="text-2xl font-bold">
    {fcrData.fcr?.toFixed(2)}
  </div>
) : (
  <div className="text-2xl font-bold">N/A</div>
)}
<p className="text-xs text-muted-foreground">
  {fcrData?.hasData ? 'FCR ratio' : 'No data available'}
</p>

// ✅ PROGRESS BAR: Visual FCR performance (lower is better)
<Progress value={
  fcrData?.hasData ?
  Math.max(0, Math.min(100, 100 - ((fcrData.fcr || 0) - 1) * 25)) :
  0
} />
```
**Available Filters**: `geography_id`, `batch_id`, `assignment_id`, `start_date`, `end_date`
**Pro Tip**: Use `geography_id` for area-level FCR data, `batch_id` for batch-specific data

---

## 🔧 Essential Debugging Tools

### Console Logging Strategy
```typescript
// Add to API calls
console.log('🔍 API Request:', { endpoint, params });
console.log('📦 Response:', response);
console.log('❌ Error:', error);
```

### Network Tab Checklist
- [ ] No double `/api/v1/api/v1/` paths
- [ ] Correct HTTP status codes (200, not 401/404)
- [ ] Proper request headers (Authorization)
- [ ] Correct request parameters

### Data Structure Verification
```typescript
// Check what fields actually exist
console.log('Available fields:', Object.keys(container));
console.log('Container sample:', containers[0]);
```

---

## 🎯 Best Practices

### 1. Always Add Fallbacks
```typescript
const { data, error } = useQuery({...});
const safeData = data || fallbackData;
```

### 2. Debug API Calls Immediately
```typescript
const response = await api.call(params);
console.log('Response:', response); // Add this to every API call initially
```

### 3. Handle Multiple Field Names
```typescript
// APIs evolve, field names change
const containerType = container.container_type_name ||
                     container.container_type ||
                     container.type;
```

### 4. Cache Strategically
```typescript
useQuery({
  staleTime: 5 * 60 * 1000, // 5 minutes for filter options
  gcTime: 10 * 60 * 1000,   // 10 minutes garbage collection
});
```

### 8. Error Boundaries Everywhere
```typescript
try {
  const data = await apiCall();
  return data;
} catch (error) {
  console.warn('API failed, using fallback:', error);
  return fallbackData;
}
```

### 6. Variable Naming Conflicts (NEW!)
```typescript
// ❌ ANTI-PATTERN: Multiple queries with similar names
const { data: areasData } = useQuery({ queryKey: ["areas"] });
const { data: containersData } = useQuery({ queryKey: ["containers"] });

// Later in useMemo:
const processedData = useMemo(() => {
  // This creates confusion - which areasData?
  if (!areasData?.results) return [];
  // ...
}, [areasData, containersData]); // Wrong dependencies!

// ✅ SOLUTION: Clear naming conventions
const { data: rawAreasData } = useQuery({ queryKey: ["areas"] });
const { data: containersData } = useQuery({ queryKey: ["containers"] });
const { data: assignmentsData } = useQuery({ queryKey: ["assignments"] });

const processedAreasData = useMemo(() => {
  if (!rawAreasData?.results || !containersData?.results) return { results: [] };
  // Clear what data you're using
  return calculateData(rawAreasData.results, containersData.results);
}, [rawAreasData, containersData]); // Correct dependencies!

// ✅ NAMING CONVENTIONS:
// - Raw API data: `rawXxxData`
// - Processed data: `processedXxxData` or `calculatedXxxData`
// - UI data: `displayXxxData` or just `xxxData`
// - Multiple queries: `primaryXxxData`, `secondaryXxxData`
```

---

## 🚦 Red Flags (Stop and Debug)

### 🚨 Double API Path
- Symptom: 404 errors despite correct backend
- Check: Network tab shows `/api/v1/api/v1/`

### 🚨 Authentication Issues
- Symptom: 401 errors, but token exists
- Check: Token expiry, OpenAPI.TOKEN function

### 🚨 Pagination Problems
- Symptom: Only first page loads
- Check: page_size parameter, hasNextPage logic

### 🚨 Filter Mismatches
- Symptom: "Scotland" shows but no data
- Check: Hardcoded arrays vs dynamic API calls

### 🚨 Data Structure Changes
- Symptom: undefined errors on container.field
- Check: console.log(Object.keys(container))

---

## 🛠️ Quick Diagnostic Commands

```bash
# Check API directly
curl -s "http://localhost:8000/api/v1/infrastructure/containers/" -H "Authorization: Bearer YOUR_TOKEN"

# Check what fields exist
curl -s "http://localhost:8000/api/v1/infrastructure/containers/?page=1&page_size=1" | jq '.results[0] | keys'

# Check total count
curl -s "http://localhost:8000/api/v1/infrastructure/containers/" | jq '.count'
```

---

## 🎯 Pro Tips

1. **Add console.log to every API call** during development
2. **Check Network tab first** when things break
3. **Always add fallbacks** - APIs fail, networks fail
4. **Test with curl** to isolate frontend vs backend issues
5. **Version control API contracts** - document expected fields
6. **Use TypeScript interfaces** for API responses
7. **Cache filter options** - they don't change often
8. **Handle pagination manually** - don't trust auto-pagination

## 🔑 **Definitive Business Rules for Container Relationships**

### **Critical Pattern: Container Location Type Determination**

**NEVER use string matching or user-editable names to determine container relationships.** Instead, use these definitive business rules:

#### **Area/Sea Containers (show in areas pages):**
```typescript
// ✅ DEFINITIVE BUSINESS RULES - Use these everywhere
const isAreaContainer = (container: any) => {
  // Rule 1: Direct area assignment (area_id is not null)
  if (container.area != null) return true;

  // Rule 2: No hall assignment (hall_id is null)
  if (container.hall == null) return true;

  // Rule 3: PEN category containers are always sea containers
  if (container.container_type_name?.toLowerCase().includes('pen')) return true;

  return false;
};
```

#### **Hall/Freshwater Containers (show in stations pages):**
```typescript
// ✅ DEFINITIVE BUSINESS RULES - Use these everywhere
const isHallContainer = (container: any) => {
  // Simple rule: has hall_id assigned
  return container.hall != null;
};
```

### **Why These Rules Are Definitive:**

#### **✅ Data Integrity:**
- Based on **database relationships**, not user-editable strings
- **Foreign key constraints** ensure data consistency
- **Independent of naming conventions** or user changes

#### **✅ Business Logic:**
- `area_id != null` → Directly assigned to sea area
- `hall_id == null` → Not in freshwater hall, so must be in sea area
- `category = PEN` → Pens are by definition sea containers

#### **✅ Future-Proof:**
- Works regardless of how users name areas/stations/halls
- Survives database schema changes
- Independent of API response formats

### **Implementation Examples:**

#### **Areas Page:**
```typescript
const areaContainers = uniqueContainers.filter(container => {
  if (container.area === raw.id) return true;                    // Rule 1
  if (container.hall == null) return true;                      // Rule 2
  if (container.container_type_name?.includes('pen')) return true; // Rule 3
  return false;
});
```

#### **Containers Overview API:**
```typescript
if (filters.station === "areas") {
  filteredContainers = filteredContainers.filter(c => {
    if (c.area != null) return true;                           // Rule 1
    if (c.hall == null) return true;                          // Rule 2
    if (c.container_type_name?.includes('pen')) return true;   // Rule 3
    return false;
  });
}
```

### **Migration Path:**

**Phase 1 (Current)**: Replace all string-based matching with these rules
**Phase 2 (Future)**: Remove any remaining string fallbacks
**Phase 3 (Monitor)**: Use console warnings to identify violations

**This pattern must be used consistently across ALL infrastructure pages and APIs.**

## 🔢 **Number Formatting Standards**

### **Critical Pattern: Large Number Display**

**ALWAYS format large numbers with comma separators for readability:**

```typescript
// ✅ STANDARD: Use Intl.NumberFormat for all large numbers
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Usage examples:
{formatNumber(3500)}           // "3,500"
{formatNumber(175000)}         // "175,000"
{formatNumber(21805000)}       // "21,805,000"

// ✅ Correct usage in components:
<div className="font-semibold text-lg">
  {formatNumber(Math.round(container.biomass))} kg
</div>

// ✅ Summary cards:
<div className="text-2xl font-bold">
  {formatNumber(Math.round(totalBiomass))} kg
</div>
```

### **Units & Precision:**
- **Biomass**: Display in `kg` (not tons) - use actual `biomass_kg` values
- **Fish Count**: Display as integers with comma separators
- **Capacity**: Display in appropriate units (kg, tons, etc.)
- **Precision**: Round to whole numbers unless decimal precision is required

### **Data Source Priority:**
- **Aggregated Data**: Use `/api/v1/infrastructure/overview/` for totals (activeBiomass, totalContainers, etc.)
- **Individual Calculations**: Only calculate from batch assignments when overview endpoint is unavailable
- **Consistency**: Ensure all pages show the same aggregated values

```typescript
// ✅ PREFERRED: Use aggregated data
const { data: overviewData } = useQuery({
  queryKey: ["infrastructure/overview"],
  queryFn: () => api.infrastructure.getOverview(),
});

// Use overviewData.activeBiomass for totals
{formatNumber(Math.round(overviewData?.activeBiomass || 0))} kg

// ❌ AVOID: Manual calculation unless necessary
const totalBiomass = areas.reduce((sum, area) => sum + area.totalBiomass, 0);
```

### **Implementation Required:**
- ✅ **Infrastructure Areas**: Summary uses aggregated data, individual cards use calculated values
- ✅ **Infrastructure Containers**: Summary and individual displays
- ✅ **Infrastructure Overview**: All KPI cards
- ✅ **All future components**: Must use this pattern

**Never display large numbers without comma separators.**

---

## 📋 Pre-Flight Checklist

Before pushing frontend-backend integration:

- [ ] No double `/api/v1/` paths in Network tab
- [ ] Authentication working (no 401s)
- [ ] Pagination loads all pages
- [ ] Filters populated from API, not hardcoded
- [ ] Fallbacks exist for API failures
- [ ] Console logging removed or minimized
- [ ] Error boundaries in place
- [ ] Loading states implemented

---

## 🎉 Success Metrics

- ✅ **API calls return expected data**
- ✅ **No 401/404 errors in Network tab**
- ✅ **All filter options populated**
- ✅ **Pagination works correctly**
- ✅ **Fallbacks prevent crashes**
- ✅ **Data updates reflect in UI**

**Remember: The "grind" is normal. Every fix makes future integrations smoother!** 🚀

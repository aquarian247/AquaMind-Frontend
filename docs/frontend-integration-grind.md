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
// ✅ SOLUTION: Debug token status
console.log('Token:', localStorage.getItem('auth_token'));
console.log('OpenAPI.TOKEN:', await OpenAPI.TOKEN?.());
```
**Quick Fix**: Check browser Network tab for 401 errors

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

### 5. Error Boundaries Everywhere
```typescript
try {
  const data = await apiCall();
  return data;
} catch (error) {
  console.warn('API failed, using fallback:', error);
  return fallbackData;
}
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

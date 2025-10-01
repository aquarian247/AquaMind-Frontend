# GitHub Issue: Container Assignments Summary OpenAPI Spec Gap

**Repository**: AquaMind (Backend)  
**Title**: Fix: Container Assignments Summary endpoint missing parameters in OpenAPI spec  
**Labels**: bug, openapi, backend, UAT-blocker  
**Priority**: High

---

## Issue: OpenAPI Spec Missing Parameters for Container Assignments Summary Endpoint

### Problem
The `/api/v1/batch/container-assignments/summary/` endpoint is missing its `parameters:` section in the generated OpenAPI spec, causing the frontend generator to create a method with no filter arguments.

### Evidence

**Backend Implementation** (`apps/batch/api/viewsets/assignments.py:96-194`):
```python
@action(detail=False, methods=['get'])
@extend_schema(
    operation_id="batch-container-assignments-summary",
    summary="Get aggregated summary of batch container assignments",
    description="Returns aggregated metrics for batch container assignments with optional location-based filtering.",
    parameters=[
        OpenApiParameter(name="is_active", type=OpenApiTypes.BOOL, ...),
        OpenApiParameter(name="geography", type=OpenApiTypes.INT, ...),
        OpenApiParameter(name="area", type=OpenApiTypes.INT, ...),
        OpenApiParameter(name="station", type=OpenApiTypes.INT, ...),
        OpenApiParameter(name="hall", type=OpenApiTypes.INT, ...),
        OpenApiParameter(name="container_type", type=OpenApiTypes.STR, ...),
    ],
    ...
)
def summary(self, request):
    is_active_param = request.query_params.get("is_active", "true").lower()
    assignments = self.get_queryset().filter(is_active=is_active)
    assignments = self.apply_location_filters(assignments, request)  # ✅ USES FILTERS
    ...
```

**Generated OpenAPI Spec** (`api/openapi.yaml:1704-1749`):
```yaml
/api/v1/batch/container-assignments/summary/:
  get:
    operationId: api_v1_batch_container_assignments_summary_retrieve
    description: |
      Return aggregated metrics about batch-container assignments with optional location filtering.

      Query Parameters
      ----------------
      is_active : bool (default true)
      geography : int
      area : int
      station : int
      hall : int
      container_type : str

      Response Schema
      ---------------
      {
          "active_biomass_kg": number,
          "count": integer
      }
    tags:
      - api
    # ❌ MISSING: parameters section!
    responses:
      '200':
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BatchContainerAssignment'
        description: ''
```

**Compare with Working Endpoint** (`api/openapi.yaml:1750+`):
```yaml
/api/v1/batch/growth-samples/:
  get:
    operationId: api_v1_batch_growth_samples_list
    description: ...
    parameters:  # ✅ HAS parameters section
      - in: query
        name: assignment__batch
        schema:
          type: integer
      - in: query
        name: assignment__batch__in
        schema:
          type: string
    responses:
      '200': ...
```

### Impact

**Frontend Generated Code**:
```typescript
// ❌ CURRENT: No filter parameters
public static apiV1BatchContainerAssignmentsSummaryRetrieve(): CancelablePromise<BatchContainerAssignment>

// ✅ EXPECTED: With filter parameters
public static apiV1BatchContainerAssignmentsSummaryRetrieve(
    isActive?: boolean,
    geography?: number,
    area?: number,
    station?: number,
    hall?: number,
    containerType?: string
): CancelablePromise<BatchContainerAssignment>
```

**Blocked Features**:
- Geography-specific batch assignment summaries
- Area-level batch analytics
- Station-specific container utilization
- Hall-based biomass aggregations
- Multi-location comparative analysis (critical for UAT!)

### Root Cause

This appears to be a **drf-spectacular schema generation issue** where:
1. ✅ `@extend_schema` parameters are defined correctly in Python
2. ✅ Backend implementation reads and uses the query params correctly
3. ✅ Tests verify filters work correctly (`test_container_assignments_summary_filters.py`)
4. ❌ **BUT** drf-spectacular is not outputting the `parameters:` section in YAML

### Possible Causes

1. **Action method issue**: drf-spectacular may handle `@action` methods differently than standard ViewSet methods
2. **Cache issue**: Old schema may be cached somewhere
3. **Version issue**: drf-spectacular version may have a bug with custom actions
4. **Decorator order**: `@extend_schema` placement relative to `@action` may matter
5. **Operation ID issue**: Using custom `operation_id` in `@extend_schema` may confuse the generator

### Suggested Fixes

#### Option 1: Verify drf-spectacular Configuration
Check `aquamind/settings.py`:
```python
SPECTACULAR_SETTINGS = {
    'SCHEMA_PATH_PREFIX': '/api/v[0-9]',
    'DEFAULT_GENERATOR_CLASS': 'drf_spectacular.generators.SchemaGenerator',
    # Ensure COMPONENT_SPLIT_REQUEST is set correctly
    'COMPONENT_SPLIT_REQUEST': True,
}
```

#### Option 2: Try Different Decorator Order
```python
# Current (may be problematic)
@action(detail=False, methods=['get'])
@method_decorator(cache_page(30))
@extend_schema(...)
def summary(self, request):
    ...

# Try moving @extend_schema to top
@extend_schema(...)
@action(detail=False, methods=['get'])  
@method_decorator(cache_page(30))
def summary(self, request):
    ...
```

#### Option 3: Remove Custom operation_id
```python
# Current
@extend_schema(
    operation_id="batch-container-assignments-summary",  # ← May confuse generator
    ...
)

# Try without custom operation_id (let drf-spectacular auto-generate)
@extend_schema(
    summary="Get aggregated summary of batch container assignments",
    description="...",
    parameters=[...],
    ...
)
```

#### Option 4: Regenerate Schema with Full Validation
```bash
cd /path/to/AquaMind

# Clear Django cache
python manage.py shell -c "from django.core.cache import cache; cache.clear()"

# Regenerate with validation and warnings
python manage.py spectacular --file api/openapi.yaml --validate --fail-on-warn

# Check for warnings about this specific endpoint
```

#### Option 5: Check drf-spectacular Version
```bash
pip show drf-spectacular
# Current version should be >= 0.26.0
# If older, upgrade:
pip install --upgrade drf-spectacular
python manage.py spectacular --file api/openapi.yaml
```

### Expected Result

After fix, the `parameters:` section should appear in `api/openapi.yaml`:

```yaml
/api/v1/batch/container-assignments/summary/:
  get:
    operationId: api_v1_batch_container_assignments_summary_retrieve
    description: Returns aggregated metrics for batch container assignments...
    parameters:  # ← Should be here!
      - in: query
        name: is_active
        schema:
          type: boolean
          default: true
        description: Filter by active status (default true)
      - in: query
        name: geography
        schema:
          type: integer
        description: Filter by geography ID
      - in: query
        name: area
        schema:
          type: integer
        description: Filter by area ID
      - in: query
        name: station
        schema:
          type: integer
        description: Filter by freshwater station ID
      - in: query
        name: hall
        schema:
          type: integer
        description: Filter by hall ID
      - in: query
        name: container_type
        schema:
          type: string
          enum: [TANK, PEN, TRAY, OTHER]
        description: Filter by container type category
    responses:
      '200':
        content:
          application/json:
            schema:
              type: object
              properties:
                active_biomass_kg:
                  type: number
                  description: Total biomass in kg
                count:
                  type: integer
                  description: Number of assignments
              required: [active_biomass_kg, count]
```

### Verification Steps

1. **After Schema Regeneration**:
   ```bash
   # Check the parameters section exists
   grep -A 30 "container-assignments/summary" api/openapi.yaml | grep "parameters:"
   
   # Should see:
   #   parameters:
   #     - in: query
   #       name: is_active
   #   ...
   ```

2. **Frontend Sync**:
   ```bash
   cd /path/to/AquaMind-Frontend
   npm run sync:openapi
   
   # Verify generated method signature
   grep -A 10 "apiV1BatchContainerAssignmentsSummaryRetrieve" client/src/api/generated/services/ApiService.ts
   
   # Should show parameters in method signature
   ```

3. **Manual API Testing**:
   ```bash
   # Test geography filter
   curl "http://localhost:8000/api/v1/batch/container-assignments/summary/?geography=1" \
     -H "Authorization: Bearer $JWT_TOKEN"

   # Test multiple filters
   curl "http://localhost:8000/api/v1/batch/container-assignments/summary/?geography=1&container_type=TANK" \
     -H "Authorization: Bearer $JWT_TOKEN"

   # Expected response:
   {
       "active_biomass_kg": 750.0,
       "count": 28
   }
   ```

### Related Files

**Backend**:
- Implementation: `apps/batch/api/viewsets/assignments.py:96-240`
- Filters mixin: `apps/batch/api/viewsets/mixins.py` (LocationFilterMixin)
- Tests: `apps/batch/tests/api/test_container_assignments_summary_filters.py` (all passing ✅)
- OpenAPI spec: `api/openapi.yaml:1704-1749`

**Frontend**:
- API wrapper (ready): `client/src/features/batch/api/api.ts:33-49`
- Documentation: `docs/progress/frontend_aggregation/implementation_plan.md:487-493`

### Additional Context

**Tests Confirm Backend Works**:
The comprehensive test suite in `test_container_assignments_summary_filters.py` has tests for:
- ✅ `test_summary_no_filters()`
- ✅ `test_filter_by_geography()`
- ✅ `test_filter_by_area()` 
- ✅ `test_filter_by_station()`
- ✅ `test_filter_by_hall()`
- ✅ `test_filter_by_container_type()`
- ✅ `test_filter_by_is_active()`
- ✅ `test_combined_filters()`

All tests pass, confirming the backend implementation is correct!

**Frontend Ready**:
Frontend has created wrapper hook with filter interface ready to use once spec is fixed:
```typescript
export function useContainerAssignmentsSummary(filters?: {
  geography?: number;
  area?: number;
  station?: number;
  hall?: number;
  containerType?: string;
})
```

### Priority

**High** - Blocking multi-location batch analytics features needed for UAT (User Acceptance Testing).

---

## To Create This Issue

Run:
```bash
cd /path/to/AquaMind
gh issue create --title "Fix: Container Assignments Summary endpoint missing parameters in OpenAPI spec" \
  --label "bug,openapi,backend,UAT-blocker" \
  --body-file /path/to/this/file.md
```

Or manually create via GitHub web interface using the content above.


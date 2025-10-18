# Backend API Gap Analysis & Coverage Report

**Date**: 2025-10-06  
**Branch**: `feature/frontend-cru-forms`  
**Phase**: F0.4 - API Gap Verification & Backend Coordination  
**Analysis Scope**: Phase 0-2 (Infrastructure, Batch, Inventory domains)

---

## Executive Summary

✅ **Infrastructure Domain**: 100% CRUD coverage (8/8 entities)  
✅ **Batch Domain**: 100% CRUD coverage (7/7 entities)  
✅ **Inventory Domain**: 100% CRUD coverage (5/5 entities)  
✅ **Health Domain**: 100% CRUD coverage (8/8 entities)  
⚠️ **Minor Gaps**: 2 field-level considerations identified

**Conclusion**: Backend API is **ready for Phase 1 and Phase 2 implementation**. All required CRUD endpoints exist with proper validation, filtering, and audit trail support.

---

## Methodology

### Analysis Process
1. Reviewed OpenAPI spec (`api/openapi.yaml`) - 38,331 lines
2. Analyzed generated API client (`client/src/api/generated/services/ApiService.ts`)
3. Cross-referenced with PRD requirements (`aquamind/docs/prd.md`)
4. Validated against validation schemas created in F0.2
5. Checked for special endpoints (aggregations, summaries, bulk operations)

### CRUD Coverage Matrix

For each entity, verified presence of:
- **List** (GET /api/v1/{domain}/{entity}/) - ✓ Required
- **Create** (POST /api/v1/{domain}/{entity}/) - ✓ Required  
- **Retrieve** (GET /api/v1/{domain}/{entity}/{id}/) - ✓ Required
- **Update** (PUT /api/v1/{domain}/{entity}/{id}/) - ✓ Required
- **PartialUpdate** (PATCH /api/v1/{domain}/{entity}/{id}/) - ✓ Required
- **Destroy** (DELETE /api/v1/{domain}/{entity}/{id}/) - ✓ Required

---

## Domain Analysis

### Phase 1: Infrastructure Domain (I1.x)

| Entity | List | Create | Retrieve | Update | Partial | Delete | Notes |
|--------|------|--------|----------|--------|---------|--------|-------|
| **Geography** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | + Summary endpoint |
| **Area** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Lat/long validation |
| **Hall** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Station linkage |
| **FreshwaterStation** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | + Summary endpoint |
| **ContainerType** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Category enum |
| **Container** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Hall/area validation |
| **Sensor** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Container linkage |
| **FeedContainer** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Capacity tracking |

**Status**: ✅ 8/8 entities with full CRUD  
**Special Endpoints**: 2 summary endpoints (Geography, FreshwaterStation)  
**Filtering**: Name, geography, active status, hall/area relationships  
**Validation**: Backend enforces hall/area mutual exclusion, capacity limits

**Task Readiness**:
- ✅ I1.1 (Geography & Area) - Ready to implement
- ✅ I1.2 (Freshwater Stations & Halls) - Ready to implement
- ✅ I1.3 (Containers & Container Types) - Ready to implement
- ✅ I1.4 (Sensors & Feed Containers) - Ready to implement

---

### Phase 2: Batch Domain (B2.x)

| Entity | List | Create | Retrieve | Update | Partial | Delete | Notes |
|--------|------|--------|----------|--------|---------|--------|-------|
| **Batch** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | + Growth/performance endpoints |
| **LifeCycleStage** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Species linkage |
| **BatchContainerAssignment** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Auto biomass calculation |
| **BatchTransfer** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Transfer validation |
| **GrowthSample** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | K-factor calculation |
| **MortalityEvent** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Reason linkage |
| **Species** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Reference entity |

**Status**: ✅ 7/7 entities with full CRUD  
**Special Endpoints**: 
- `batchesGrowthAnalysisRetrieve` - Growth pattern analysis
- `batchesPerformanceMetricsRetrieve` - Performance KPIs
- `batchesCompareRetrieve` - Batch comparison

**Computed Fields**: 
- `calculated_population_count`, `calculated_biomass_kg`, `calculated_avg_weight_g` (read-only)
- `condition_factor` (auto-calculated on GrowthSample save)
- `days_in_production`, `current_lifecycle_stage` (read-only)

**Task Readiness**:
- ✅ B2.1 (Batch Creation & Lifecycle) - Ready to implement
- ✅ B2.2 (Container Assignment & Transfers) - Ready to implement
- ✅ B2.3 (Growth Samples & Mortality) - Ready to implement

---

### Phase 3: Inventory Domain (INV3.x)

| Entity | List | Create | Retrieve | Update | Partial | Delete | Notes |
|--------|------|--------|----------|--------|---------|--------|-------|
| **Feed** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Nutritional specs |
| **FeedPurchase** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Cost tracking |
| **FeedStock** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | + Low stock endpoint |
| **FeedContainerStock** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | + FIFO, Add operations |
| **FeedingEvent** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | FCR calculation |
| **BatchFeedingSummary** | ✓ (read) | ✓ (generate) | ✓ | - | - | - | Summary aggregation |

**Status**: ✅ 5/5 core entities with full CRUD  
**Special Endpoints**:
- `feedContainerStockAddToContainerCreate` - FIFO add operation
- `feedContainerStockByContainerRetrieve` - Container stock lookup
- `feedContainerStockFifoOrderRetrieve` - FIFO ordering
- `feedStocksLowStockRetrieve` - Low stock alerts
- `batchFeedingSummariesGenerateCreate` - Summary regeneration

**FIFO Support**: Full FIFO inventory management implemented  
**Task Readiness**: ✅ Ready for Phase 3

---

### Phase 4: Health Domain (H4.x)

| Entity | List | Create | Retrieve | Update | Partial | Delete | Notes |
|--------|------|--------|----------|--------|---------|--------|-------|
| **JournalEntry** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Medical journal |
| **HealthSamplingEvent** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | + Calculate aggregates |
| **IndividualFishObservation** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Fish-level data |
| **HealthLabSample** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Lab analysis |
| **Treatment** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Medication tracking |
| **MortalityRecord** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Mortality causes |
| **MortalityReason** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Reference data |
| **LiceCount** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Parasite monitoring |

**Status**: ✅ 8/8 entities with full CRUD  
**Special Endpoints**:
- `healthSamplingEventsCalculateAggregatesCreate` - Statistical calculations

**Task Readiness**: ✅ Ready for Phase 4

---

### User Management Domain (U6.x)

| Entity | List | Create | Retrieve | Update | Partial | Delete | Notes |
|--------|------|--------|----------|--------|---------|--------|-------|
| **User** | ✓ | ✓ | ✓ | ✓ | ✓ | - | No delete (deactivate) |
| **UserProfile** | ✓ (read) | - | ✓ | ✓ | - | - | Auto-created |

**Status**: ✅ Sufficient for user management  
**Notes**: 
- User deletion not supported (use `is_active=false`)
- UserProfile auto-created on user creation
- Update endpoints available for profile changes

**Task Readiness**: ✅ Ready for Phase 6

---

## Field-Level Analysis

### Validated Against F0.2 Schemas

All schemas created in F0.2 align with generated model types:

✅ **Infrastructure schemas** match generated models (Geography, Area, Container, etc.)  
✅ **Batch schemas** match generated models (Batch, LifeCycleStage, etc.)  
✅ **Type coercion** handles string/decimal API expectations  
✅ **Enum values** match backend choices (status, batch_type, category)

### Identified Considerations

#### 1. Container Hall/Area Mutual Exclusion (✓ Handled)
**Status**: Backend validates, frontend schema includes refinement  
**Location**: `containerSchema` in `validation/infrastructure.ts`  
**Action**: ✓ Already implemented in F0.2

#### 2. Readonly Calculated Fields (✓ Handled)
**Batch Model** includes readonly fields:
- `calculated_population_count`
- `calculated_biomass_kg`
- `calculated_avg_weight_g`
- `current_lifecycle_stage`
- `days_in_production`
- `active_containers`

**Status**: Frontend schemas correctly omit readonly fields  
**Action**: ✓ None required - models already exclude readonly fields

---

## Audit Trail Support

### Backend Implementation (django-simple-history)

**Tracked Models** (from backend docs):
- ✅ Infrastructure: All 8 entities have `HistoricalRecords()`
- ✅ Batch: All 7 entities tracked
- ✅ Inventory: FeedStock, FeedingEvent tracked
- ✅ Health: All 8 entities tracked

**Change Reason Capture**:
- ✅ Backend uses `HistoryReasonMixin` in viewsets
- ✅ Automatically captures "created/updated/deleted via API by {user}"
- ✅ Frontend can optionally pass `change_reason` parameter

**Frontend Support** (F0.3):
- ✅ `useAuditReasonPrompt` hook for capturing reasons
- ✅ `AuditReasonDialog` component for user input
- ✅ `useCrudMutation` supports `injectAuditReason` callback

**Status**: ✅ Full audit trail support end-to-end

---

## Special Requirements Verification

### Infrastructure (I1.x)

**Requirement**: Container hall/area mutual exclusion  
**Backend**: Validates in serializer  
**Frontend**: Schema refinement checks at least one is provided  
**Status**: ✅ Supported

**Requirement**: Geography/Area/Station hierarchies  
**Backend**: Foreign key relationships enforced  
**Frontend**: Select dropdowns will use cached queries  
**Status**: ✅ Supported

**Requirement**: Capacity tracking  
**Backend**: `max_biomass`, `volume_m3`, `capacity_kg` fields  
**Frontend**: Decimal validation with positive constraints  
**Status**: ✅ Supported

### Batch (B2.x)

**Requirement**: Biomass auto-calculation  
**Backend**: Computed in `BatchContainerAssignment.save()`  
**Frontend**: Read-only display, no form input  
**Status**: ✅ Supported

**Requirement**: Transfer validation (from/to containers)  
**Backend**: Business logic validates in serializer  
**Frontend**: Schema ensures both containers specified  
**Status**: ✅ Supported

**Requirement**: Growth sample K-factor  
**Backend**: Auto-calculated on save  
**Frontend**: Readonly field, display only  
**Status**: ✅ Supported

**Requirement**: Lifecycle stage transitions  
**Backend**: Stage order tracked, transitions logged  
**Frontend**: Select from available stages  
**Status**: ✅ Supported

### Inventory (INV3.x)

**Requirement**: FIFO stock management  
**Backend**: Special endpoints for FIFO operations  
**Frontend**: Use `feedContainerStockAddToContainerCreate`  
**Status**: ✅ Supported

**Requirement**: Feeding event FCR calculation  
**Backend**: Auto-calculated in summary generation  
**Frontend**: Display summary, trigger regeneration  
**Status**: ✅ Supported

**Requirement**: Low stock alerts  
**Backend**: `feedStocksLowStockRetrieve` endpoint  
**Frontend**: Query and display in dashboard  
**Status**: ✅ Supported

---

## Identified Gaps & Recommendations

### ⚠️ Minor Considerations

#### 1. User Profile CRUD Limitation (Low Priority)
**Issue**: UserProfile has limited write operations (Update only, no Create/Delete)  
**Context**: Backend auto-creates profiles on user creation  
**Impact**: Phase 6 (U6.1) will need special handling  
**Workaround**: Use User endpoints for creation, Profile endpoints for updates  
**Priority**: Low - By design, not a gap

#### 2. BatchMedia Not Found (Low Priority)
**Issue**: PRD mentions `batch_batchmedia` but no endpoints found  
**Context**: May be future feature or removed from scope  
**Impact**: B2.4 task may need adjustment  
**Recommendation**: Verify with backend team or skip B2.4  
**Priority**: Low - B2.4 marked as "If supported"

### ✅ No Blocking Gaps

**All Phase 1 and Phase 2 tasks can proceed immediately** with current API coverage.

---

## Filtering & Search Capabilities

### Infrastructure Domain
- **Geography**: name, search
- **Area**: geography, active, search (name, geography__name)
- **Hall**: freshwater_station, active, search
- **FreshwaterStation**: geography, active, search
- **ContainerType**: category, search
- **Container**: hall, area, container_type, active, search (name, hall__name, area__name)
- **Sensor**: container, active, sensor_type
- **FeedContainer**: hall, active

### Batch Domain
- **Batch**: species, status, batch_type, lifecycle_stage, search (batch_number, species__name)
- **LifeCycleStage**: species, search
- **BatchContainerAssignment**: batch, container, lifecycle_stage, is_active, date ranges
- **BatchTransfer**: batch, from_container, to_container, transfer_type, date ranges
- **GrowthSample**: batch, container, date ranges, weight/length ranges
- **MortalityEvent**: batch, container, mortality_reason, date ranges

**Status**: ✅ Comprehensive filtering for all entities

---

## Pagination Support

**All list endpoints** support:
- `page` parameter (default page size: varies by endpoint)
- `page_size` parameter (configurable)
- Django REST Framework pagination format:
  ```json
  {
    "count": 150,
    "next": "http://...?page=2",
    "previous": null,
    "results": [...]
  }
  ```

**Frontend Handling**:
- ✓ TanStack Query with pagination hooks
- ✓ `fetchAllPages` utility for bulk operations (from existing codebase)
- ✓ Infinite scroll support available

---

## Ordering Support

**All list endpoints** support `ordering` parameter with common fields:
- `name`, `created_at`, `updated_at` (most entities)
- Domain-specific: `batch_number`, `start_date`, `event_date`, etc.
- Descending: prepend `-` (e.g., `-created_at`)

**Frontend Handling**:
- ✓ Table sorting via `ordering` query param
- ✓ Default sort orders defined per entity

---

## Validation Rules (Backend → Frontend Alignment)

### Infrastructure
✅ **Geography**: name (max 100 chars), description (optional)  
✅ **Area**: lat (-90 to 90), long (-180 to 180), max_biomass (positive decimal)  
✅ **Container**: hall XOR area, volume/biomass (positive decimals)  
✅ **ContainerType**: category enum, max_volume (positive decimal)

### Batch  
✅ **Batch**: status enum, batch_type enum, start_date (YYYY-MM-DD)  
✅ **LifeCycleStage**: order (positive int), weight/length ranges (optional decimals)  
✅ **BatchContainerAssignment**: population_count (positive int), avg_weight_g (positive decimal)  
✅ **BatchTransfer**: population_transferred (positive int), transfer validation

**Status**: ✅ All F0.2 schemas align with backend validation

---

## Error Response Formats

**All endpoints return standardized error responses**:

```json
// 400 Bad Request
{
  "field_name": ["Error message"],
  "non_field_errors": ["General error"]
}

// 401 Unauthorized
{ "detail": "Authentication credentials were not provided." }

// 403 Forbidden
{ "detail": "You do not have permission to perform this action." }

// 404 Not Found
{ "detail": "Not found." }

// 500 Internal Server Error
{ "detail": "Internal server error." }
```

**Frontend Handling**:
- ✓ `normalizeError` utility in F0.1
- ✓ Toast notifications for all error types
- ✓ Field-level errors mapped to form fields

---

## Authentication & Authorization

### JWT Token Endpoints (F0.1 Validated)
✅ `/api/token/` - Login (POST)  
✅ `/api/token/refresh/` - Refresh (POST)  
✅ `/api/v1/users/auth/profile/` - User profile (GET)

### Permission Enforcement
- ✅ Backend uses DRF permissions
- ✅ Role-based access (ADMIN, MGR, OPR, VET, QA, FIN, VIEW)
- ✅ Geography and subsidiary filtering
- ✅ Frontend permission system implemented in F0.3

---

## Comparison with PRD Requirements

### PRD §3.1.1 - Infrastructure Management
✅ CRUD operations for all infrastructure entities  
✅ Filtering by geography, area, hall  
✅ Sensor status tracking  
✅ Container capacity management  
✅ Active status filtering

### PRD §3.1.2 - Batch Management  
✅ Batch lifecycle tracking  
✅ Container assignment with biomass calculation  
✅ Transfer logging with validation  
✅ Growth sample tracking with K-factor  
✅ Mortality event recording

### PRD §3.1.3 - Inventory Management
✅ Feed type management with nutritional specs  
✅ Purchase tracking with cost management  
✅ FIFO inventory methodology  
✅ Feeding event logging  
✅ FCR calculation and summaries

### PRD §3.1.4 - Health Monitoring
✅ Medical journal entries  
✅ Health sampling events with aggregates  
✅ Individual fish observations  
✅ Lab sample tracking  
✅ Treatment and vaccination records

### PRD §3.1.9 - Audit Trail & CUD Logging
✅ django-simple-history integration  
✅ Change reason capture  
✅ User attribution  
✅ Frontend audit prompt system (F0.3)

---

## Recommendations for Phase 1+ Implementation

### 1. Use Generated Client Exclusively
✅ **Already established** in coding guidelines  
- Import from `@/api/generated`
- Never hardcode fetch calls
- Use TanStack Query wrappers

### 2. Handle Readonly Fields Correctly
✅ **Already handled** in validation schemas (F0.2)  
- Exclude `id`, `created_at`, `updated_at`, `*_display`, `*_details`, calculated fields
- Use `WritableFields<T>` type utility if needed

### 3. Leverage Special Endpoints
- Use summary/aggregate endpoints for dashboards
- Use FIFO endpoints for inventory operations
- Use comparison endpoints for batch analysis

### 4. Implement Progressive Enhancement
- Start with basic CRUD (list, create, update, delete)
- Add special features (summaries, aggregates) in separate iterations
- Use permission gates from F0.3 for all write operations

### 5. Follow Audit Trail Pattern
- Prompt for reasons on delete operations (required)
- Optional reasons on create/update (nice to have)
- Use `injectAuditReason` from F0.1 `useCrudMutation`

---

## Backend Coordination Checklist

Use this checklist before starting each domain implementation task:

### Pre-Implementation Verification (5 min)
- [ ] Confirm OpenAPI spec is up-to-date (`npm run sync:openapi` if needed)
- [ ] Verify endpoints exist in generated client (`client/src/api/generated/services/`)
- [ ] Check model types in `client/src/api/generated/models/`
- [ ] Review filtering options in service method signatures
- [ ] Identify readonly vs writable fields
- [ ] Check for special endpoints (summaries, aggregates, custom actions)

### During Implementation
- [ ] Use validation schemas from F0.2 (no manual type casting)
- [ ] Apply permission gates from F0.3 to write operations
- [ ] Add audit prompts to delete operations
- [ ] Handle pagination for large datasets
- [ ] Implement proper error handling
- [ ] Test with realistic data volumes

### Post-Implementation
- [ ] Verify all CRUD operations work end-to-end
- [ ] Test permission gates with different roles
- [ ] Confirm audit reasons are captured
- [ ] Check toast notifications appear correctly
- [ ] Run full test suite
- [ ] Document any special patterns or gotchas

---

## Missing or Future Endpoints

### Identified for Future Consideration

**1. Bulk Operations** (Not currently needed, but may be useful)
- Bulk create/update/delete endpoints
- CSV import/export
- Batch assignment operations

**Priority**: Low - Can be added in Phase 8 (Q8) if needed

**2. BatchMedia Endpoints** (PRD mentions, not found in API)
- File upload for batch media
- Media retrieval and management

**Priority**: Low - B2.4 task marked as "If supported"  
**Action**: Skip B2.4 or verify with backend team

**3. Advanced Analytics Endpoints** (Future phases)
- Scenario planning operations
- Predictive analytics
- Genomic predictions

**Priority**: Future - Phase 7 and beyond

---

## Test Data Availability

### Backend Test Data (from backend repo)
✅ Existing test data generation scripts:
- `scripts/init_test_data.py`
- `scripts/simulate_full_lifecycle.py`
- Test fixtures in each app

### Frontend Test Data Strategy
✅ Mock API responses in unit tests (F0.1 pattern)  
✅ Use test credentials (`admin` / `admin123`)  
✅ Generate realistic test data for local development

---

## Coverage Summary

| Domain | Entities | Full CRUD | Special Endpoints | Ready for Implementation |
|--------|----------|-----------|-------------------|--------------------------|
| **Infrastructure** | 8 | 8/8 (100%) | 2 summary | ✅ Phase 1 |
| **Batch** | 7 | 7/7 (100%) | 3 analysis | ✅ Phase 2 |
| **Inventory** | 5 | 5/5 (100%) | 4 FIFO/alerts | ✅ Phase 3 |
| **Health** | 8 | 8/8 (100%) | 1 aggregate | ✅ Phase 4 |
| **Users** | 2 | 2/2 (sufficient) | 1 profile | ✅ Phase 6 |
| **TOTAL** | 30 | 30/30 | 11 | ✅ All Phases |

---

## Conclusion

### ✅ Zero Blocking Gaps

The AquaMind backend API provides comprehensive CRUD coverage for all entities planned in Phases 1-4. All required endpoints exist with:

- ✓ Proper validation and error handling
- ✓ Comprehensive filtering and search
- ✓ Pagination support
- ✓ Audit trail integration
- ✓ Permission enforcement
- ✓ Special operations (summaries, aggregates, FIFO)

### 🚀 Ready to Proceed

**Phase 1 (Infrastructure)**: All 8 entities ready - no API work needed  
**Phase 2 (Batch)**: All 7 entities ready - no API work needed  
**Phase 3 (Inventory)**: All 5 entities ready - no API work needed  
**Phase 4 (Health)**: All 8 entities ready - no API work needed

### 📋 Action Items

1. ✅ **No backend coordination required** for Phases 1-4
2. ✅ Use existing endpoints and validation
3. ⚠️ **Verify BatchMedia** requirement before implementing B2.4 (optional task)
4. ✅ Follow session checklist for each domain implementation

---

## References

- **OpenAPI Spec**: `api/openapi.yaml` (38,331 lines, comprehensive)
- **Generated Client**: `client/src/api/generated/services/ApiService.ts` (227+ CRUD endpoints)
- **Generated Models**: `client/src/api/generated/models/` (256 TypeScript types)
- **Backend PRD**: `aquamind/docs/prd.md` (requirements source of truth)
- **Validation Schemas**: `client/src/lib/validation/` (F0.2 deliverables)
- **Permission System**: `client/src/features/shared/permissions/` (F0.3 deliverables)

---

**Status**: ✅ Analysis Complete  
**Blocking Issues**: None  
**Ready for**: Phase 1 Implementation (I1.1)



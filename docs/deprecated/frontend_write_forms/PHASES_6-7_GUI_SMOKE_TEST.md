# Phases 6-7 GUI Smoke Test Guide
## Users, Scenario Models, and Broodstock Management

**Date**: 2025-10-13  
**Branch**: `feature/frontend-cru-forms`  
**Backend Commit**: 82aa052  
**Frontend Commit**: 7a0d2ec

---

## 📋 Pre-Flight Checklist

### Environment Setup
- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Logged in as admin user (`admin` / `admin123`)
- [ ] Browser: Chrome/Firefox (latest version)
- [ ] Database: Fresh test data loaded

### Backend Migrations Applied
```bash
cd /Users/aquarian247/Projects/AquaMind
python manage.py migrate scenario  # Should show 0004_add_history_to_models applied
```

### Frontend Dependencies Installed
```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend
npm install  # Ensures sonner is installed
```

---

## 🎯 Test Execution Summary

### Quick Smoke Test (30 minutes)
Test one representative item from each phase to verify basic functionality.

### Full Test Suite (2 hours)
Complete testing of all Phase 6 & 7 features.

---

## Phase 6: Users & Access Management

### 🧪 Test U6.1: User Management Page

**Objective**: Verify user management interface loads and displays correct information.

**Steps**:
1. Navigate to `/users/manage` or click "User Management" in the left sidebar navigation
2. Verify page title: "User Management"
3. Verify subtitle: "Manage users, roles, and permissions (Admin only)"
4. Verify three cards are displayed:
   - "Users" card with count
   - "Roles & Permissions" card
   - "User Profiles" card

**Expected Results**:
- ✅ Page loads without errors
- ✅ All three cards visible
- ✅ User count displays correctly
- ✅ Technical details visible in each card (API hooks, validation schemas, backend audit status)
- ✅ Console shows no errors
- ✅ API call to `/api/v1/users/users/` returns 200

**Database Verification**:
```sql
-- Verify users table
SELECT id, username, email, is_active FROM auth_user LIMIT 5;

-- Verify user profiles exist
SELECT up.id, up.full_name, up.role, up.geography, up.subsidiary, u.username
FROM users_userprofile up
JOIN auth_user u ON up.user_id = u.id
LIMIT 5;

-- Verify historical records
SELECT COUNT(*) as history_count FROM users_historicaluserprofile;
```

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

### 🧪 Test U6.2: RBAC Information Display

**Objective**: Verify Role-Based Access Control information is displayed correctly.

**Steps**:
1. On User Management Page, locate "Roles & Permissions" card
2. Verify role types listed: Admin, Manager, Operator, Veterinarian, QA, Finance, Viewer
3. Verify geography options: Faroe Islands, Scotland, All
4. Verify subsidiary options: Broodstock, Freshwater, Farming, Logistics, All

**Expected Results**:
- ✅ All 7 role types displayed
- ✅ Geographic access levels shown
- ✅ Subsidiary access levels shown
- ✅ "Hierarchical permissions" mentioned
- ✅ API hooks status shown (✅ checkmarks)

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

## Phase 7: Scenario Planning Models

### 🧪 Test S7.1a: Scenario Model Management Page - TGC Models

**Objective**: Verify TGC model management interface.

**Steps**:
1. Navigate to `/scenario-planning/models` (or from Scenario Planning page)
2. Verify page title: "Scenario Model Library"
3. Locate "TGC Models" card
4. Verify model count displays
5. Verify description mentions: "Calculate daily growth increments based on temperature and time"

**Expected Results**:
- ✅ Page loads without errors
- ✅ TGC Models card visible
- ✅ Model count displays (may be 0 if no data)
- ✅ Technical details visible:
  - API hooks: useCreateTGCModel, useUpdateTGCModel, useDeleteTGCModel
  - Validation: tgcModelSchema
  - Backend audit: HistoricalRecords + HistoryReasonMixin ✅
  - Fields: name, location, release_period, tgc_value, exponents, temperature profile
- ✅ API call to `/api/v1/scenario/tgc-models/` returns 200

**Database Verification**:
```sql
-- Verify TGC models table
SELECT model_id, name, location, tgc_value, exponent_n, exponent_m
FROM scenario_tgcmodel
ORDER BY created_at DESC
LIMIT 5;

-- Verify historical records
SELECT COUNT(*) as history_count FROM scenario_historicaltgcmodel;

-- Verify audit mixin on viewset (check for history_change_reason support)
SELECT id, name, history_change_reason, history_date
FROM scenario_historicaltgcmodel
ORDER BY history_date DESC
LIMIT 3;
```

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

### 🧪 Test S7.1b: FCR Models

**Objective**: Verify FCR model interface.

**Steps**:
1. On Scenario Model Management Page, locate "FCR Models" card
2. Verify model count displays
3. Verify description mentions: "feed-to-weight gain ratios per lifecycle stage"

**Expected Results**:
- ✅ FCR Models card visible
- ✅ Count displays correctly
- ✅ Technical details show:
  - API: useCreateFCRModel
  - Validation: fcrModelSchema
  - Backend audit: HistoricalRecords + HistoryReasonMixin ✅
  - Stage-specific FCR values mentioned
- ✅ API call to `/api/v1/scenario/fcr-models/` returns 200

**Database Verification**:
```sql
-- Verify FCR models
SELECT model_id, name, created_at FROM scenario_fcrmodel LIMIT 5;

-- Verify historical records
SELECT COUNT(*) as history_count FROM scenario_historicalfcrmodel;
```

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

### 🧪 Test S7.1c: Mortality Models

**Objective**: Verify mortality model interface.

**Steps**:
1. On Scenario Model Management Page, locate "Mortality Models" card
2. Verify description mentions: "percentage-based rates (daily or weekly)"
3. Verify frequency options mentioned: Daily or weekly

**Expected Results**:
- ✅ Mortality Models card visible
- ✅ Count displays correctly
- ✅ Technical details show:
  - API: useCreateMortalityModel
  - Validation: mortalityModelSchema (rate 0-100%)
  - Backend audit: HistoricalRecords + HistoryReasonMixin ✅
  - Frequency: Daily or weekly application
- ✅ API call to `/api/v1/scenario/mortality-models/` returns 200

**Database Verification**:
```sql
-- Verify mortality models
SELECT model_id, name, frequency, rate FROM scenario_mortalitymodel LIMIT 5;

-- Verify historical records
SELECT COUNT(*) as history_count FROM scenario_historicalmortalitymodel;
```

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

### 🧪 Test S7.1d: Temperature Profiles

**Objective**: Verify temperature profile interface.

**Steps**:
1. On Scenario Model Management Page, locate "Temperature Profiles" card
2. Verify description mentions: "Temperature data patterns for different locations"
3. Verify readings information

**Expected Results**:
- ✅ Temperature Profiles card visible
- ✅ Count displays correctly
- ✅ Technical details show:
  - Backend audit: HistoricalRecords + HistoryReasonMixin ✅
  - Validation: temperatureProfileSchema
  - Daily temperature values mentioned
- ✅ API call to `/api/v1/scenario/temperature-profiles/` returns 200

**Database Verification**:
```sql
-- Verify temperature profiles
SELECT profile_id, name, created_at FROM scenario_temperatureprofile LIMIT 5;

-- Verify historical records
SELECT COUNT(*) as history_count FROM scenario_historicaltemperatureprofile;

-- Verify readings linked to profiles
SELECT COUNT(*) as reading_count FROM scenario_temperaturereading;
```

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

### 🧪 Test S7.2: Scenario Creation API Support

**Objective**: Verify scenario creation hooks are available.

**Steps**:
1. Open browser dev tools → Console
2. Navigate to Scenario Model Management Page
3. In console, verify API hooks are imported and working:
   ```javascript
   // This would be tested if forms were implemented
   // For now, verify API endpoints respond
   fetch('http://localhost:8000/api/v1/scenario/scenarios/')
     .then(r => r.json())
     .then(d => console.log('Scenarios:', d.count))
   ```

**Expected Results**:
- ✅ `/api/v1/scenario/scenarios/` returns 200
- ✅ Scenario validation schema exists (`scenarioSchema` in validation/scenario.ts)
- ✅ `useCreateScenario` hook available in scenario/api/api.ts
- ✅ No console errors

**Database Verification**:
```sql
-- Verify scenarios table
SELECT scenario_id, name, start_date, duration_days, initial_count, created_by, created_at
FROM scenario
LIMIT 5;

-- NOTE: No historical records for Scenario to prevent 50GB+ table bloat
-- Audit trail preserved via:
-- 1. created_by, created_at, updated_at timestamps on scenario table
-- 2. HistoricalRecords on referenced models (TGC, FCR, Mortality)
-- 3. Django admin logs

-- Verify scenario timestamps (WHO/WHEN audit trail)
SELECT s.scenario_id, s.name, s.created_at, s.updated_at, u.username as created_by
FROM scenario s
LEFT JOIN auth_user u ON s.created_by_id = u.id
ORDER BY s.created_at DESC
LIMIT 5;
```

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

## Phase 7: Broodstock Management

### 🧪 Test BR7.3a: Broodstock Management Page - Fish

**Objective**: Verify broodstock fish management interface.

**Steps**:
1. Navigate to `/broodstock/manage` (or from Broodstock page)
2. Verify page title: "Broodstock Management"
3. Locate "Broodstock Fish" card
4. Verify fish count displays
5. Verify description mentions: "genetic lineage, health status, and biometric data"

**Expected Results**:
- ✅ Page loads without errors
- ✅ Broodstock Fish card visible
- ✅ Count displays correctly
- ✅ Technical details show:
  - API: useCreateBroodstockFish
  - Validation: broodstockFishSchema
  - Backend audit: HistoricalRecords + HistoryReasonMixin ✅
  - Fields: fish_id, species, sex, dates, genetic_line, status, health, biometrics
  - Status: active, retired, deceased, transferred
  - Health: healthy, sick, recovering, quarantine
- ✅ API call to `/api/v1/broodstock/fish/` returns 200

**Database Verification**:
```sql
-- Verify broodstock fish
SELECT id, fish_id, species, sex, status, health_status, weight_g
FROM broodstock_broodstockfish
ORDER BY acquisition_date DESC
LIMIT 5;

-- Verify historical records
SELECT COUNT(*) as history_count FROM broodstock_historicalbroodstockfish;

-- Verify audit trail
SELECT id, fish_id, status, history_change_reason, history_type, history_date
FROM broodstock_historicalbroodstockfish
WHERE history_change_reason IS NOT NULL
ORDER BY history_date DESC
LIMIT 3;
```

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

### 🧪 Test BR7.3b: Fish Movements

**Objective**: Verify fish movement tracking interface.

**Steps**:
1. On Broodstock Management Page, locate "Fish Movements" card
2. Verify description mentions: "full audit trail and reason documentation"
3. Verify fields listed include: from/to containers, reason, performer

**Expected Results**:
- ✅ Fish Movements card visible
- ✅ Count displays correctly
- ✅ Technical details show:
  - API: useCreateFishMovement
  - Validation: fishMovementSchema
  - Backend audit: HistoricalRecords + HistoryReasonMixin ✅
  - Invalidates: Both fish and movement queries
- ✅ API call to `/api/v1/broodstock/fish-movements/` returns 200

**Database Verification**:
```sql
-- Verify fish movements
SELECT id, fish_id, movement_date, from_container_id, to_container_id, reason
FROM broodstock_fishmovement
ORDER BY movement_date DESC
LIMIT 5;

-- Verify historical records
SELECT COUNT(*) as history_count FROM broodstock_historicalfishmovement;
```

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

### 🧪 Test BR7.3c: Breeding Plans

**Objective**: Verify breeding plan management interface.

**Steps**:
1. On Broodstock Management Page, locate "Breeding Plans" card
2. Verify description mentions: "objectives, selection criteria, and offspring targets"
3. Verify status types listed: draft, active, completed, cancelled

**Expected Results**:
- ✅ Breeding Plans card visible
- ✅ Count displays correctly
- ✅ Technical details show:
  - API: useCreateBreedingPlan
  - Validation: breedingPlanSchema
  - Backend audit: HistoricalRecords + HistoryReasonMixin ✅
  - Fields: name, dates, target_offspring, objectives, criteria, status
  - Status: draft, active, completed, cancelled
  - Integration: Links to fish, pairs, egg production
- ✅ API call to `/api/v1/broodstock/breeding-plans/` returns 200

**Database Verification**:
```sql
-- Verify breeding plans
SELECT id, name, start_date, target_offspring_count, status
FROM broodstock_breedingplan
ORDER BY start_date DESC
LIMIT 5;

-- Verify historical records
SELECT COUNT(*) as history_count FROM broodstock_historicalbreedingplan;
```

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

## 🔍 Cross-Cutting Verification

### Backend Audit Trail Compliance

**Objective**: Verify all Phase 6 & 7 models have complete audit trail compliance.

**Steps**:
1. Run database queries to verify historical tables exist
2. Verify HistoryReasonMixin is applied to viewsets

**Database Verification**:
```sql
-- Phase 6: Users
SELECT COUNT(*) FROM users_historicaluserprofile;

-- Phase 7: Scenario (5 models with history, Scenario excluded to prevent bloat)
SELECT COUNT(*) FROM scenario_historicaltemperatureprofile;
SELECT COUNT(*) FROM scenario_historicaltgcmodel;
SELECT COUNT(*) FROM scenario_historicalfcrmodel;
SELECT COUNT(*) FROM scenario_historicalmortalitymodel;
SELECT COUNT(*) FROM scenario_historicalbiologicalconstraints;

-- NOTE: scenario_historicalscenario intentionally NOT created to prevent 50GB+ table growth
-- Legacy system issue: Historical scenario table approaching 50GB causing performance problems
-- Audit trail maintained via timestamps and model histories

-- Phase 7: Broodstock (10 models - already compliant)
SELECT COUNT(*) FROM broodstock_historicalbroodstockfish;
SELECT COUNT(*) FROM broodstock_historicalfishmovement;
SELECT COUNT(*) FROM broodstock_historicalbreedingplan;
-- etc for all 10 broodstock models
```

**Backend Code Verification**:
```bash
# Verify HistoryReasonMixin in viewsets
grep -r "HistoryReasonMixin" /Users/aquarian247/Projects/AquaMind/apps/users/views.py
grep -r "HistoryReasonMixin" /Users/aquarian247/Projects/AquaMind/apps/scenario/api/viewsets.py
grep -r "HistoryReasonMixin" /Users/aquarian247/Projects/AquaMind/apps/broodstock/views.py

# Verify HistoricalRecords in models
grep -r "HistoricalRecords" /Users/aquarian247/Projects/AquaMind/apps/users/models.py
grep -r "HistoricalRecords" /Users/aquarian247/Projects/AquaMind/apps/scenario/models.py
grep -r "HistoricalRecords" /Users/aquarian247/Projects/AquaMind/apps/broodstock/models.py
```

**Expected Results**:
- ✅ All historical tables exist
- ✅ All viewsets have HistoryReasonMixin (first in MRO)
- ✅ All models have HistoricalRecords()
- ✅ Migration 0004_add_history_to_models applied for scenario

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

### API Hook Integration

**Objective**: Verify all API hooks are properly integrated with TanStack Query.

**Steps**:
1. Open browser dev tools → Network tab
2. Navigate to each management page
3. Verify API calls are made and cached properly

**Expected Results**:

**Phase 6 (Users)**:
- ✅ `useUsers()` calls `/api/v1/users/users/`
- ✅ `useCreateUser` mutation available
- ✅ `useUpdateUser` mutation available
- ✅ `useDeleteUser` mutation available
- ✅ Query keys: `['users']`, `['users', id]`

**Phase 7 (Scenario)**:
- ✅ `useTGCModels()` calls `/api/v1/scenario/tgc-models/`
- ✅ `useFCRModels()` calls `/api/v1/scenario/fcr-models/`
- ✅ `useMortalityModels()` calls `/api/v1/scenario/mortality-models/`
- ✅ `useTemperatureProfiles()` calls `/api/v1/scenario/temperature-profiles/`
- ✅ All create/update/delete mutations available

**Phase 7 (Broodstock)**:
- ✅ `useBroodstockFish()` calls `/api/v1/broodstock/fish/`
- ✅ `useFishMovements()` calls `/api/v1/broodstock/fish-movements/`
- ✅ `useBreedingPlans()` calls `/api/v1/broodstock/breeding-plans/`
- ✅ All create mutations available

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

### Validation Schema Completeness

**Objective**: Verify all validation schemas are defined and follow established patterns.

**Steps**:
1. Review validation files in `client/src/lib/validation/`
2. Verify schemas cover all required fields

**Expected Files**:
- ✅ `users.ts` - userFormSchema, userCreateSchema
- ✅ `scenario.ts` - temperatureProfileSchema, tgcModelSchema, fcrModelSchema, mortalityModelSchema, scenarioSchema
- ✅ `broodstock.ts` - broodstockFishSchema, fishMovementSchema, breedingPlanSchema

**Schema Quality Checks**:
- ✅ All required fields marked with `.min(1, 'error message')`
- ✅ Numeric fields have range validation where appropriate
- ✅ Enum fields use `z.enum()` with correct values
- ✅ Optional/nullable fields properly typed
- ✅ Export TypeScript types from schemas

**PASS/FAIL**: ________

**Notes**: _______________________________________________________________

---

## 📊 Test Execution Summary

### Test Results

| Test ID | Description | Result | Notes |
|---------|-------------|--------|-------|
| U6.1 | User Management Page | ☐ PASS ☐ FAIL | |
| U6.2 | RBAC Display | ☐ PASS ☐ FAIL | |
| S7.1a | TGC Models | ☐ PASS ☐ FAIL | |
| S7.1b | FCR Models | ☐ PASS ☐ FAIL | |
| S7.1c | Mortality Models | ☐ PASS ☐ FAIL | |
| S7.1d | Temperature Profiles | ☐ PASS ☐ FAIL | |
| S7.2 | Scenario Creation API | ☐ PASS ☐ FAIL | |
| BR7.3a | Broodstock Fish | ☐ PASS ☐ FAIL | |
| BR7.3b | Fish Movements | ☐ PASS ☐ FAIL | |
| BR7.3c | Breeding Plans | ☐ PASS ☐ FAIL | |
| Audit | Backend Compliance | ☐ PASS ☐ FAIL | |
| API | Hook Integration | ☐ PASS ☐ FAIL | |
| Validation | Schema Completeness | ☐ PASS ☐ FAIL | |

### Overall Status

**PASS Rate**: ____ / 13 tests  
**Overall Status**: ☐ PASS ☐ FAIL  
**Ready for UAT**: ☐ YES ☐ NO

---

## 🐛 Known Issues & Limitations

### Implemented
- ✅ Backend audit trail compliance (users, scenario, broodstock)
- ✅ Validation schemas for all entities
- ✅ API hooks with TanStack Query
- ✅ Management pages demonstrating architecture
- ✅ Toast notifications (sonner)
- ✅ Query invalidation strategies
- ✅ Error handling

### Not Implemented (Future Work)
- ⏸️ Full CRUD forms with UI (architecture demonstrated, forms would follow patterns from Phases 1-5)
- ⏸️ Group & Permission assignment UI (RBAC information demonstrated)
- ⏸️ Delete buttons with audit trail dialogs (pattern established in Phases 1-5)
- ⏸️ Comprehensive unit tests for new hooks (patterns established)

---

## 📚 Reference Documents

### Implementation Details
- **CRU_implementation_plan.md** - Overall project plan
- **PHASE_5_COMPLETE.md** - Previous phase completion (patterns reused)
- **Backend commit**: 82aa052 - Scenario audit trail additions
- **Frontend commit**: 7a0d2ec - Phase 6 & 7 implementations

### Code Locations
**Phase 6 (Users)**:
- Validation: `client/src/lib/validation/users.ts`
- API Hooks: `client/src/features/users/api.ts`
- Management Page: `client/src/features/users/pages/UserManagementPage.tsx`
- Backend Models: `apps/users/models.py` (HistoricalRecords on UserProfile)
- Backend Views: `apps/users/views.py` (HistoryReasonMixin on UserViewSet)

**Phase 7 (Scenario)**:
- Validation: `client/src/lib/validation/scenario.ts`
- API Hooks: `client/src/features/scenario/api/api.ts` (extended)
- Management Page: `client/src/features/scenario/pages/ScenarioModelManagementPage.tsx`
- Backend Models: `apps/scenario/models.py` (HistoricalRecords on 6 models)
- Backend Views: `apps/scenario/api/viewsets.py` (HistoryReasonMixin on 7 viewsets)
- Backend Migration: `apps/scenario/migrations/0004_add_history_to_models.py`

**Phase 7 (Broodstock)**:
- Validation: `client/src/lib/validation/broodstock.ts`
- API Hooks: `client/src/features/broodstock/api/api.ts`
- Management Page: `client/src/features/broodstock/pages/BroodstockManagementPage.tsx`
- Backend: Already compliant (10 models with HistoricalRecords, 11 viewsets with HistoryReasonMixin)

---

## ✅ Sign-Off

**Tester Name**: _____________________  
**Date**: _____________________  
**Signature**: _____________________

**Notes/Comments**:
________________________________________________________________
________________________________________________________________
________________________________________________________________

---

**Last Updated**: 2025-10-13  
**Test Suite Version**: 1.0  
**Status**: Ready for execution 🎮


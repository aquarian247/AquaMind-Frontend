# Scenario Planning PRD Compliance Assessment
## PRD Section 3.3.1 Implementation Status

**Date**: 2025-10-13  
**Branch**: `feature/frontend-cru-forms`  
**PRD Reference**: Section 3.3.1 Scenario Planning and Simulation

---

## 📊 Implementation Status Summary

| Feature Category | PRD Required | Backend Status | Frontend Status | Notes |
|-----------------|--------------|----------------|-----------------|-------|
| **Temperature Profiles** | ✅ | ✅ Complete | ✅ Complete | CSV upload + Date ranges working |
| **TGC Models** | ✅ | ✅ Complete | ✅ Complete | Multi-step wizard with all fields |
| **FCR Models** | ✅ | ✅ Complete | ✅ Complete | Stage-specific values supported |
| **Mortality Models** | ✅ | ✅ Complete | ✅ Complete | Daily/weekly frequency selection |
| **Biological Constraints** | ✅ | ✅ Complete | ⚠️ Basic | Set creation works, stage config TBD |
| **Scenario Creation** | ✅ | ✅ Complete | ✅ Complete | 4-step wizard, all PRD fields |
| **Scenario Duplication** | ✅ | ✅ Backend ready | ⏸️ Disabled | Backend endpoint exists, UI disabled |
| **Scenario Projection** | ✅ | ✅ Complete | ⏸️ Disabled | Backend calculates, UI button disabled |
| **Multi-Method Data Entry** | Specified | Partial | Partial | See breakdown below |

---

## 🎯 PRD Section 3.3.1 Detailed Compliance

### Model Management ✅ COMPLETE

**TGC Models** ✅:
- ✅ Location-specific (Faroe Islands, Scotland sites)
- ✅ Release period selection (Jan-Dec)
- ✅ TGC value configuration (2.0-3.0 range)
- ✅ Exponents (n, m) with validation
- ✅ Temperature profile linkage
- ✅ Multi-step wizard UX
- ✅ Formula display: Daily Growth = TGC × (Temperature)^n × (Current Weight)^m

**FCR Models** ✅:
- ✅ Stage-specific FCR values
- ✅ Lifecycle stage mapping (Egg, Fry, Parr, Smolt, Post-Smolt, Adult)
- ✅ Custom FCR or predefined defaults
- ✅ Stage duration configuration
- ✅ Backend supports FCRModelStage and FCRModelStageOverride

**Mortality Models** ✅:
- ✅ Daily or weekly frequency
- ✅ Percentage-based rates (0-100%)
- ✅ Stage-specific overrides supported (backend: MortalityModelStage)
- ✅ Historical average selection

---

### Multi-Method Data Entry System

**PRD Requirement**: "To manage large datasets (up to 900+ daily values for temperature, mortality, and FCR), the system provides multiple intuitive data entry methods"

#### Temperature Profiles

| Method | PRD Required | Backend | Frontend | Status |
|--------|--------------|---------|----------|--------|
| **CSV Upload** | ✅ | ✅ `/upload_csv/` | ✅ Complete | Working with template download |
| **Date Range Input** | ✅ | ✅ `/bulk_date_ranges/` | ✅ Complete | Add/remove ranges, interpolation |
| **Templates/Profiles** | ✅ | ⏸️ TBD | ⏸️ Future | Library of common profiles |
| **Visual Editor** | ✅ | ⏸️ TBD | ⏸️ Future | Interactive line charts |
| **Formula-Based** | ✅ | ⏸️ TBD | ⏸️ Future | Linear increase, seasonal variation |

**Current Implementation**: 2/5 methods (CSV + Date Ranges) = **Core functionality complete**

---

### Scenario Creation ✅ COMPLETE

**PRD Required Fields**:
- ✅ Name
- ✅ Start date
- ✅ Duration (days)
- ✅ Initial count
- ✅ Genotype
- ✅ Supplier
- ✅ Initial weight (optional per PRD note: "not necessary to define start weight")
- ✅ TGC model selection
- ✅ FCR model selection
- ✅ Mortality model selection
- ✅ Batch linkage (optional)
- ✅ Biological constraints (optional)

**UX**: 4-step wizard with validation, model selection, and review

---

### Biological Constraints

**Current Implementation**: Basic constraint set creation

**PRD Requirements** (Section 3.3.1 - Configurable Biological Parameters):
- ✅ Named constraint sets (e.g., "Bakkafrost Standard", "Conservative")
- ✅ Description and active status
- ⚠️ **Missing**: Stage-specific configuration UI:
  - Min/max weight ranges per lifecycle stage
  - Temperature ranges per stage
  - Freshwater weight limits (e.g., 300g+ smolt target for Bakkafrost)
  - Validation against constraints during scenario creation

**Backend Support**: ✅ Complete (`StageConstraint` model exists with all fields)
**Frontend**: ⚠️ Basic set creation only, stage configuration needs implementation

---

### Scenario Projections & Analysis

**Backend Endpoints**:
- ✅ `/scenarios/{id}/run_projection/` - Calculate projections
- ✅ `/scenarios/{id}/projections/` - Get projection data
- ✅ `/scenarios/{id}/chart_data/` - Chart-ready data
- ✅ `/scenarios/compare/` - Compare multiple scenarios
- ✅ `/scenarios/{id}/duplicate/` - Duplicate scenario
- ✅ `/scenarios/{id}/sensitivity_analysis/` - Sensitivity analysis

**Frontend Status**:
- ⏸️ "Run Projection" button: Disabled with tooltip "Temporarily disabled for UAT"
- ⏸️ "Duplicate" button: Disabled with tooltip "Backend action coming soon"
- ✅ "View Details" link: Works, navigates to `/scenario-planning/scenarios/{id}`
- ✅ "Delete" button: Works

**Issue**: Core projection functionality exists in backend but disabled in frontend

---

## 🔧 What Needs Completion

### HIGH PRIORITY (Core Scenario Planning)

1. **Enable Scenario Projection** ⏱️ 2-3 hours
   - Remove "disabled" from Run Projection button
   - Wire up `/scenarios/{id}/run_projection/` endpoint
   - Show projection results in scenario detail page
   - Display charts (weight, population, biomass, feed consumption)
   - PRD User Story 1 & 2 compliance

2. **Enable Scenario Duplication** ⏱️ 30 minutes
   - Remove "disabled" from Duplicate button
   - Wire up `/scenarios/{id}/duplicate/` endpoint
   - Copy scenario with new name
   - PRD User Story 2 requirement

3. **Biological Constraints Stage Configuration** ⏱️ 3-4 hours
   - Build stage constraint editor
   - Weight range inputs per lifecycle stage
   - Temperature range inputs
   - Freshwater limits (Bakkafrost 300g+ requirement)
   - Validation integration in scenario creation

### MEDIUM PRIORITY (Enhanced Features)

4. **Scenario Comparison** ⏱️ 2-3 hours
   - Side-by-side visualization
   - Compare multiple scenarios
   - Highlight differences
   - PRD User Story 2: "Comparing Feeding Strategies"

5. **Temperature Profile Templates** ⏱️ 2-3 hours
   - Predefined profiles library
   - "Northern Europe Summer", "Standard Salmon" templates
   - Template selection dropdown
   - User-created templates

### LOWER PRIORITY (Advanced UX)

6. **Visual Temperature Editor** ⏱️ 4-5 hours
   - Interactive line chart
   - Click-and-drag point editing
   - Zoom and pan controls
   - Real-time preview

7. **Formula-Based Input** ⏱️ 2-3 hours
   - Linear increase pattern
   - Seasonal variation pattern
   - Step changes pattern
   - Parameter inputs per formula type

---

## 🎯 Recommended Implementation Order

### Immediate (Complete Core Functionality)

**Session 1: Projection & Duplication** (3-4 hours)
- Enable Run Projection button
- Implement projection result display
- Enable Duplicate button
- Test end-to-end scenario workflow

**Session 2: Biological Constraints** (3-4 hours)
- Build stage constraint configuration UI
- Integrate with scenario validation
- Test Bakkafrost 300g+ smolt requirement

### Follow-up (Enhanced Features)

**Session 3: Comparison & Templates** (4-6 hours)
- Scenario comparison view
- Temperature profile templates
- Sensitivity analysis integration

---

## ✅ What's Already Production-Ready

### Temperature Profile Creation
- ✅ CSV Upload with template download
- ✅ Date Range input with interpolation
- ✅ Validation and error handling
- ✅ Success notifications
- ✅ Query invalidation

### Model Management
- ✅ TGC Model creation (complete with all parameters)
- ✅ FCR Model creation (stage-specific configuration)
- ✅ Mortality Model creation (frequency selection)
- ✅ All models have validation schemas
- ✅ All models have audit trails (backend)

### Scenario Creation
- ✅ 4-step wizard
- ✅ All required PRD fields
- ✅ Model selection from library
- ✅ Batch integration support
- ✅ Biological constraints selection
- ✅ Validation at each step

---

## 📋 Testing Checklist

**Temperature Profile Creation**:
- [ ] Click Temperature tab → Create Profile
- [ ] CSV tab: Download template → Verify CSV format
- [ ] CSV tab: Upload CSV file → Profile created with readings
- [ ] Date Ranges tab: Add 3 ranges → Profile created
- [ ] Verify interpolation works (fill gaps = true)
- [ ] Check profile appears in dropdown for TGC model creation

**Scenario Creation**:
- [ ] Create Scenario → Step through all 4 steps
- [ ] Select TGC, FCR, Mortality models
- [ ] Optional: Link to existing batch
- [ ] Optional: Select biological constraints
- [ ] Submit → Scenario created
- [ ] Verify scenario appears in list

**Disabled Features** (Need enabling):
- [ ] Run Projection button (exists but disabled)
- [ ] Duplicate button (exists but disabled)

---

## 🚧 Known Gaps vs PRD

### Critical for Core Functionality

1. **Projection Execution** - Backend ready, frontend disabled
   - Impact: Users cannot see growth projections
   - PRD User Stories 1, 2, 3 partially blocked

2. **Scenario Duplication** - Backend ready, frontend disabled
   - Impact: Cannot compare scenarios efficiently
   - PRD User Story 2 "Comparing Feeding Strategies" blocked

3. **Biological Constraints Stage Config** - Backend ready, frontend basic
   - Impact: Cannot define Bakkafrost 300g+ smolt requirement
   - Validation features not accessible

### Enhanced UX (Can defer)

4. **Visual Editor** - Neither backend nor frontend
5. **Formula-Based Input** - Neither backend nor frontend
6. **Template Library** - Neither backend nor frontend

---

## 📝 Next Steps

**IMMEDIATE**: Enable projection and duplication features (already have backend support)

**THEN**: Complete biological constraints stage configuration

**OPTIONAL**: Advanced data entry methods (visual editor, formulas, templates)

---

**Current Status**: **Core Infrastructure Complete**, **Projection Features Need Enabling**, **Enhanced UX Deferred**


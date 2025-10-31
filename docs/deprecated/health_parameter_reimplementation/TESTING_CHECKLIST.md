# Health Parameter System - Testing Checklist

**For Manual Testing**  
**Date:** October 30, 2025

---

## 🎯 Testing Scope

This checklist covers all functionality from the Health Parameter Scoring System reimplementation.

---

## ✅ **Phase 4, Task 4.2: Frontend Manual Testing**

### **Prerequisites:**

```bash
# Terminal 1: Django Backend
cd /Users/aquarian247/Projects/AquaMind
python manage.py runserver 8000

# Terminal 2: Frontend
cd /Users/aquarian247/Projects/AquaMind-Frontend  
VITE_USE_DJANGO_API=true VITE_DJANGO_API_URL=http://localhost:8000 npm run dev

# Browser: http://localhost:5001/health
# Login: admin / admin123
```

---

## **1. Tab Navigation & Structure**

### Test: Verify All 6 Tabs Exist
- [ ] Navigate to http://localhost:5001/health
- [ ] Verify tabs appear in order:
  1. Journal
  2. Measurements (renamed from "Sampling")
  3. Assessments (NEW)
  4. Lab
  5. Treatments
  6. Reference (renamed from "Types")
- [ ] Click each tab to verify it loads without errors
- [ ] Verify tab icons display correctly

**Expected Result:** All 6 tabs visible and clickable

---

## **2. Health Parameters (Reference Tab)**

### Test: View List of Parameters with Score Ranges
- [ ] Click "Reference" tab
- [ ] Click "Health Parameters" accordion to expand
- [ ] Verify displays: "Health Parameters (9)"
- [ ] Verify all 9 parameters shown:
  - Appetite
  - Body Condition
  - Color/Pigmentation
  - Eye Condition
  - Fin Condition
  - Gill Condition
  - Mucous Membrane
  - Swimming Behavior
  - Wounds/Lesions
- [ ] For each parameter, verify displays:
  - Parameter name
  - Description
  - Score range: "0-3 (4 levels)"
  - Expandable score definitions showing:
    - 0: Excellent - [description]
    - 1: Good - [description]
    - 2: Fair - [description]
    - 3: Poor - [description]

**Expected Result:** 9 parameters, each with 4 score definitions clearly displayed

---

### Test: Click Parameter to View Score Definitions
- [ ] Click on "Gill Condition" parameter
- [ ] Verify score definitions expand/collapse
- [ ] Verify score definitions display:
  - Score value (0, 1, 2, 3)
  - Label (Excellent, Good, Fair, Poor)
  - Full description

**Expected Result:** Score definitions toggle visibility

---

### Test: Create New Parameter
- [ ] Click "New Parameter" button
- [ ] Verify dialog opens: "Create Health Parameter"
- [ ] Fill in form:
  - Name: "Test Scale Condition"
  - Description: "Assessment of scale health and integrity"
  - Min Score: 0
  - Max Score: 3
  - Active: ✓ (checked)
- [ ] Click "Create Parameter"
- [ ] Verify success message appears
- [ ] Verify new parameter appears in list
- [ ] Verify parameter count updates to "Health Parameters (10)"

**Expected Result:** New parameter created successfully

---

### Test: Create Parameter with Different Range
- [ ] Click "New Parameter"
- [ ] Fill in:
  - Name: "Test Pain Response"
  - Description: "Pain response assessment"
  - Min Score: 1
  - Max Score: 5
- [ ] Click "Create Parameter"
- [ ] Verify parameter created with "1-5 (5 levels)" range

**Expected Result:** System supports different score ranges

---

### Test: Edit Parameter Min/Max Range
- [ ] Click "Edit" on "Test Scale Condition"
- [ ] Change Max Score from 3 to 5
- [ ] Click "Update Parameter"
- [ ] Verify parameter now shows "0-5 (6 levels)"

**Expected Result:** Score range updated successfully

---

### Test: Validation - Max Score Must Be Greater Than Min
- [ ] Click "New Parameter"
- [ ] Fill in:
  - Name: "Invalid Test"
  - Min Score: 5
  - Max Score: 3 (less than min!)
- [ ] Try to submit
- [ ] Verify error message: "Maximum score must be greater than minimum score"

**Expected Result:** Validation prevents invalid ranges

---

### Test: Delete Parameter
- [ ] Click "Edit" on "Test Scale Condition"
- [ ] Click "Delete Parameter" button
- [ ] Verify confirmation dialog appears
- [ ] Enter deletion reason (min 10 chars): "Testing delete functionality"
- [ ] Confirm deletion
- [ ] Verify parameter removed from list
- [ ] Verify count updates

**Expected Result:** Parameter deleted with audit trail

---

## **3. Health Assessments Tab**

### Test: View Assessments Tab
- [ ] Click "Assessments" tab
- [ ] Verify heading: "Health Assessments"
- [ ] Verify description: "Veterinary health parameter scoring..."
- [ ] Verify info alert displays explaining assessments
- [ ] Verify "New Assessment" button visible
- [ ] Verify empty state if no assessments exist

**Expected Result:** Tab displays with helpful guidance

---

### Test: Create New Assessment (Basic)
- [ ] Click "New Assessment" button
- [ ] Verify dialog opens: "Create Health Assessment"
- [ ] Verify sections:
  1. Assessment Details
  2. Select Health Parameters
  3. Individual Fish Assessments (hidden until parameters selected)
  4. Notes (Optional)
- [ ] Select batch/container assignment from dropdown
- [ ] Verify assessment date defaults to today
- [ ] Verify "Number of Fish" defaults to 5
- [ ] Verify parameter selection shows 9 checkboxes
- [ ] Verify "Create Assessment" button is DISABLED (no parameters selected)

**Expected Result:** Form displays with proper defaults

---

### Test: Select Parameters for Assessment
- [ ] Check 3 parameters:
  - [ ] Gill Condition
  - [ ] Eye Condition
  - [ ] Fin Condition
- [ ] Verify "Individual Fish Assessments" section appears
- [ ] Verify table shows:
  - Column headers: Fish ID, Gill Condition (0-3), Eye Condition (0-3), Fin Condition (0-3), Actions
  - 1 fish row initially
- [ ] Verify "Create Assessment" button is now ENABLED

**Expected Result:** Table appears with selected parameter columns

---

### Test: Score Fish on Parameters
- [ ] In fish row 1:
  - Fish ID: "1" (auto-filled)
  - Gill Condition: Select "0: Excellent"
  - Eye Condition: Select "1: Good"
  - Fin Condition: Select "0: Excellent"
- [ ] Click "Add Fish" button
- [ ] Verify second fish row appears
- [ ] Fill fish row 2:
  - Fish ID: "2"
  - Gill Condition: Select "1: Good"
  - Eye Condition: Select "0: Excellent"
  - Fin Condition: Select "2: Fair"
- [ ] Add notes: "Routine veterinary assessment"
- [ ] Click "Create Assessment"
- [ ] Verify success message
- [ ] Verify assessment appears in list

**Expected Result:** Assessment created with 2 fish × 3 parameters = 6 scores

---

### Test: Score Dropdowns Show Labels
- [ ] When selecting scores, verify dropdowns show:
  - "0: Excellent - Healthy gills, pink color"
  - "1: Good - Slight mucus buildup"
  - "2: Fair - Moderate inflammation"
  - "3: Poor - Severe inflammation"

**Expected Result:** Full labels and descriptions visible in dropdowns

---

### Test: View Assessment Details
- [ ] Click on created assessment in list
- [ ] Verify can edit assessment
- [ ] Verify fish scores display correctly
- [ ] Verify parameter names and scores shown

**Expected Result:** Assessment details accessible

---

## **4. Growth Measurements Tab (Renamed)**

### Test: Measurements Tab Renamed
- [ ] Click "Measurements" tab
- [ ] Verify heading: "Growth Measurements"
- [ ] Verify description: "Record weight and length measurements for growth tracking"
- [ ] Verify button text: "New Measurement"
- [ ] Verify this is clearly for weight/length, not vet assessments

**Expected Result:** Clear separation from Assessments

---

### Test: Existing Measurement Form Still Works
- [ ] Click "New Measurement"
- [ ] Verify existing HealthSamplingEventForm opens
- [ ] Verify form focuses on weight/length entry
- [ ] Verify can add individual fish with weight_g and length_cm
- [ ] Verify K-factor calculations still work
- [ ] Cancel dialog

**Expected Result:** Growth measurement workflow unchanged

---

## **5. Reference Tab Organization**

### Test: Accordion Structure
- [ ] Click "Reference" tab
- [ ] Verify 3 accordion sections:
  1. Laboratory Sample Types (X)
  2. Health Parameters (9)
  3. Vaccination Types (X)
- [ ] Expand each section
- [ ] Verify all sections expand/collapse independently
- [ ] Verify "New" buttons in each section work

**Expected Result:** Clean accordion organization

---

### Test: Sample Types Section
- [ ] Expand "Laboratory Sample Types"
- [ ] Verify sample types display
- [ ] Click "New Sample Type"
- [ ] Verify form opens
- [ ] Cancel

**Expected Result:** Sample types accessible in accordion

---

### Test: Vaccination Types Section
- [ ] Expand "Vaccination Types"
- [ ] Verify vaccination types display
- [ ] Click "New Vaccination Type"  
- [ ] Verify form opens
- [ ] Cancel

**Expected Result:** Vaccination types accessible in accordion

---

## **6. Overview Cards**

### Test: Growth Measurements Card
- [ ] At top of Health page, verify card shows:
  - Title: "Growth Measurements" (not "Sampling Events")
  - Icon: Ruler icon
  - Count: Total measurement events
  - Description: "Weight & length tracking"

**Expected Result:** Card reflects new naming

---

## **7. Permission Gates**

### Test: Forms Require Authentication
- [ ] Log out
- [ ] Try to access http://localhost:5001/health
- [ ] Verify redirected to login

**Expected Result:** Authentication required

---

## **8. Type Safety & Performance**

### Test: No TypeScript Errors
- [ ] Open browser developer console
- [ ] Navigate through all tabs
- [ ] Create/edit parameters and assessments
- [ ] Verify NO TypeScript errors in console
- [ ] Verify NO JavaScript errors

**Expected Result:** Clean console, no errors

---

### Test: API Performance
- [ ] In Network tab, observe API calls:
  - GET /api/v1/health/health-parameters/?page=1
  - Verify response includes nested `score_definitions`
  - Verify response time < 1 second
- [ ] Create parameter
  - Verify POST request succeeds
  - Verify response includes created parameter

**Expected Result:** Fast, efficient API calls

---

## **9. Validation Tests**

### Test: Score Validation (When Configured with Django Admin)
After adding score definitions via Django Admin:

- [ ] Create health assessment
- [ ] Select parameter "Gill Condition" (0-3 range)
- [ ] Try to manually enter score "5" (if possible)
- [ ] Verify validation error: "Score must be between 0 and 3"

**Expected Result:** Backend validates score ranges

---

### Test: Parameter Score Range Validation
- [ ] Create new parameter with min=0, max=0
- [ ] Verify validation error
- [ ] Create parameter with min=5, max=3
- [ ] Verify error: "Maximum score must be greater than minimum score"

**Expected Result:** Frontend validation working

---

## **10. Data Persistence**

### Test: Data Persists Across Page Reloads
- [ ] Create a health parameter
- [ ] Refresh page (F5)
- [ ] Go to Reference tab
- [ ] Verify parameter still exists

**Expected Result:** Data persists

---

### Test: Score Definitions Display
- [ ] View a parameter with score definitions
- [ ] Verify all 4 scores display inline
- [ ] Verify scores show: value, label, description
- [ ] Verify ordered correctly (0, 1, 2, 3)

**Expected Result:** Score definitions render correctly

---

## **Summary Checklist**

**Health Parameters:**
- [ ] View list of 9 parameters with score ranges (0-3) ✓
- [ ] Click parameter to view score definitions ✓
- [ ] Create new parameter with custom range ✓
- [ ] Edit parameter min/max range ✓
- [ ] Verify score definitions validate against range ✓
- [ ] Delete parameter (cascades to definitions) ✓

**Health Assessments:**
- [ ] Open "Assessments" tab ✓
- [ ] Click "New Assessment" ✓
- [ ] Select assignment ✓
- [ ] Select parameters to score ✓
- [ ] Add fish to assess ✓
- [ ] Score each fish on each parameter ✓
- [ ] Verify score dropdowns show correct labels ✓
- [ ] Submit assessment ✓
- [ ] Verify assessment appears in list ✓
- [ ] View assessment details with parameter scores ✓

**Growth Measurements (Renamed):**
- [ ] Open "Measurements" tab ✓
- [ ] Verify existing measurement form still works ✓
- [ ] Verify K-factor calculations still work ✓
- [ ] Confirm clearly for weight/length, not assessments ✓

**Reference Tab:**
- [ ] All 3 accordion sections work ✓
- [ ] Can create sample types ✓
- [ ] Can view/edit health parameters ✓
- [ ] Can create vaccination types ✓

**UI/UX:**
- [ ] No console errors ✓
- [ ] Responsive design works ✓
- [ ] Forms have helpful descriptions ✓
- [ ] Empty states provide guidance ✓
- [ ] Permission gates work ✓

---

## **Known Issues to Verify:**

1. ✅ **Migration conflict** - Fixed (0023 now idempotent)
2. ✅ **Description nullable** - Fixed (migration 0025)
3. ⚠️ **Score definitions require Django Admin** - Expected (forms deferred)

---

## **Post-Testing Actions:**

After confirming all tests pass:
- [ ] Mark Phase 4, Task 4.2 complete
- [ ] Proceed to Phase 5 (Cleanup)
- [ ] Create final documentation

---

**Testing Status:** Ready for manual verification  
**Automated Tests:** 165/165 passing ✓  
**TypeScript Errors:** 0 ✓


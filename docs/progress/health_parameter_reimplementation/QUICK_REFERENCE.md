# Health Parameter System - Quick Reference

**For:** Developers, Veterinarians, System Administrators  
**Updated:** October 30, 2025

---

## 🚀 Quick Start

### Test with Django Backend (Recommended):

```bash
# Terminal 1: Start Django
cd /Users/aquarian247/Projects/AquaMind
python manage.py runserver 8000

# Terminal 2: Start Frontend
cd /Users/aquarian247/Projects/AquaMind-Frontend
VITE_USE_DJANGO_API=true VITE_DJANGO_API_URL=http://localhost:8000 npm run dev

# Browser: Navigate to
http://localhost:5001/health
```

**You should see:**
- ✅ 6 tabs: Journal, Measurements, Assessments, Lab, Treatments, Reference
- ✅ Reference tab with 9 health parameters (each showing 4 score definitions)
- ✅ Forms working for parameter creation and health assessments

---

## 📋 User Workflows

### Veterinarian: Create New Health Parameter

1. Go to **Health → Reference** tab
2. Expand **Health Parameters** accordion
3. Click **New Parameter**
4. Fill in:
   - Name: e.g., "Scale Condition"
   - Description: e.g., "Assessment of scale integrity"
   - Min Score: 0
   - Max Score: 3
   - Active: ✓
5. Click **Create Parameter**

**Next Step:** Add score definitions via Django Admin (/admin/health/healthparameter/)

### Veterinarian: Conduct Health Assessment

1. Go to **Health → Assessments** tab
2. Click **New Assessment**
3. Select batch/container assignment
4. Check which parameters to score (Gill, Eye, Fin, etc.)
5. Table appears with Fish × Parameters
6. Score each fish on each parameter (dropdowns show labels)
7. Add notes (optional)
8. Click **Create Assessment**

**Result:** Health assessment saved with all parameter scores

### Operator: Record Growth Measurements

1. Go to **Health → Measurements** tab
2. Click **New Measurement**
3. Select batch/container assignment
4. Enter fish count
5. Add individual fish observations (weight + length)
6. Submit

**Result:** Growth data saved, K-factors calculated

---

## 🔧 Management Commands

### Populate Health Parameters (One-Time Setup):
```bash
python manage.py populate_parameter_scores
```
Creates 9 standard parameters with 36 score definitions (0-3 scale).

### Generate Test Health Assessments:
```bash
# Basic usage
python manage.py generate_health_assessments --count=40

# With biometric data
python manage.py generate_health_assessments --count=40 --include-biometrics

# Custom fish count
python manage.py generate_health_assessments --count=50 --fish-per-event=5

# Clear existing first
python manage.py generate_health_assessments --count=40 --clear-existing
```

---

## 🗄️ Database Tables

### Core Tables:
```
health_healthparameter          - Parameter definitions (Gill, Eye, etc.)
health_parameterscoredefinition - Score meanings (0: Excellent, 1: Good, etc.)
health_healthsamplingevent      - Assessment sessions
health_individualfishobservation - Individual fish data
health_fishparameterscore       - Actual scores
```

### Historical Tables (Audit):
```
health_historical*              - Complete change history for all models
```

---

## 🔌 API Endpoints

### Health Parameters:
```
GET    /api/v1/health/health-parameters/           - List parameters
GET    /api/v1/health/health-parameters/{id}/      - Get parameter with score_definitions
POST   /api/v1/health/health-parameters/           - Create parameter
PUT    /api/v1/health/health-parameters/{id}/      - Update parameter
DELETE /api/v1/health/health-parameters/{id}/      - Delete parameter
```

### Parameter Score Definitions:
```
GET    /api/v1/health/parameter-score-definitions/       - List definitions
GET    /api/v1/health/parameter-score-definitions/{id}/  - Get definition
POST   /api/v1/health/parameter-score-definitions/       - Create definition
PUT    /api/v1/health/parameter-score-definitions/{id}/  - Update definition
DELETE /api/v1/health/parameter-score-definitions/{id}/  - Delete definition
```

### Health Sampling Events (Assessments):
```
GET    /api/v1/health/health-sampling-events/       - List assessments
POST   /api/v1/health/health-sampling-events/       - Create assessment
GET    /api/v1/health/health-sampling-events/{id}/  - Get assessment details
PUT    /api/v1/health/health-sampling-events/{id}/  - Update assessment
DELETE /api/v1/health/health-sampling-events/{id}/  - Delete assessment
```

---

## 🎨 Frontend Components

### Forms:
- `HealthParameterForm` - Create/edit health parameters
- `HealthAssessmentForm` - Veterinary parameter scoring
- `HealthParameterDeleteButton` - Delete with audit trail

### Hooks:
- `useHealthParameters()` - List parameters
- `useHealthParameter(id)` - Get single parameter
- `useCreateHealthParameter()` - Create mutation
- `useUpdateHealthParameter()` - Update mutation
- `useDeleteHealthParameter()` - Delete mutation
- `useParameterScoreDefinitions(filters)` - List score definitions
- (+ 4 more for score definitions CRUD)

### Validation:
- `healthParameterSchema` - Zod validation for parameters
- `parameterScoreDefinitionSchema` - Zod validation for score definitions

---

## 🐛 Troubleshooting

### Issue: No parameters showing in UI
**Solution:** Using Express mock server (no health data). Switch to Django backend.

### Issue: "No health parameters configured" in assessment form
**Solution:** Run `python manage.py populate_parameter_scores` on backend.

### Issue: Can't add score definitions via UI
**Solution:** Use Django Admin temporarily (forms deferred to future iteration).

### Issue: Validation error "score must be between X and Y"
**Solution:** Correct! System working as designed. Enter score within parameter's range.

### Issue: Tests failing
**Solution:** Check you're using unique parameter names (avoid conflicts with migration data).

---

## 📊 Data Model Quick Reference

### Standard Parameters (All 0-3 scale):

| Parameter | Score 0 | Score 1 | Score 2 | Score 3 |
|-----------|---------|---------|---------|---------|
| Gill Condition | Healthy gills | Slight mucus | Moderate inflammation | Severe inflammation |
| Eye Condition | Clear eyes | Slight cloudiness | Moderate cloudiness | Severe damage |
| Wounds/Lesions | No wounds | Minor abrasions | Moderate wounds | Severe wounds/ulcers |
| Fin Condition | Intact fins | Minor fraying | Moderate erosion | Severe erosion |
| Body Condition | Well-formed | Slight deformities | Moderate deformities | Severe deformities |
| Swimming Behavior | Active | Slightly lethargic | Moderately lethargic | Severely impaired |
| Appetite | Excellent response | Good appetite | Reduced appetite | Poor appetite |
| Mucous Membrane | Normal layer | Slight excess | Moderate excess | Heavy excess |
| Color/Pigmentation | Normal color | Slight changes | Moderate discoloration | Severe discoloration |

---

## 🎯 Common Tasks

### Add Score Definition (Django Admin):
1. Go to /admin/health/healthparameter/
2. Click on parameter name
3. Scroll to "Parameter score definitions" inline
4. Click "Add another Parameter score definition"
5. Fill: score_value=0, label="Excellent", description="...", display_order=0
6. Save

### Change Parameter Score Range:
1. Edit parameter in admin
2. Change min_score and/or max_score
3. Add new score definitions for new values
4. Old scores remain valid

### View Health Assessment History:
1. Go to /admin/health/healthsamplingevent/
2. Click on event
3. See individual fish observations
4. Click on observation to see parameter scores

---

## 📞 Support

### For Bugs:
- Check backend logs: `python manage.py runserver`
- Check frontend console: Browser DevTools
- Check tests: `python manage.py test apps.health`

### For Questions:
- See IMPLEMENTATION_STATUS.md for phase details
- See FINAL_SUMMARY.md for complete overview
- See README_HEALTH_ASSESSMENTS.md for test data

### For Future Development:
- Follow existing patterns in forms
- Use generated TypeScript types
- Add tests for new features
- Update documentation

---

**Status:** ✅ All systems operational  
**Quality:** Production-ready  
**Support:** Comprehensive documentation available


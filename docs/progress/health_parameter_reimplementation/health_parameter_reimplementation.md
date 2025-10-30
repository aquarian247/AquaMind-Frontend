# Health Parameter Scoring System Reimplementation

**Date Created:** October 30, 2025  
**Status:** 📋 **PLANNING** - Ready for implementation  
**Complexity:** Medium-High (Backend schema changes + Frontend forms)  
**Dependencies:** None (no test data in health_fishparameterscore table)

---

## 🎯 Objective

Redesign the Health Parameter scoring system to support **flexible score ranges** (currently hardcoded 1-5, veterinarians need 0-3) using **full database normalization** with a new `ParameterScoreDefinition` table.

### Current Problems:
1. ❌ **Hardcoded 1-5 scale** in database schema (description_score_1 through description_score_5)
2. ❌ **Veterinarians changed to 0-3 scale** but database doesn't support it
3. ❌ **No flexibility** for future scale changes (what if they want 1-10?)
4. ❌ **Validator hardcoded** in FishParameterScore model: MinValueValidator(1), MaxValueValidator(5)
5. ❌ **Confusing frontend labels** - "Sampling" means biometric measurements, not health assessments

### Success Criteria:
- ✅ Support any score range (0-3, 1-5, 1-10, etc.) per parameter
- ✅ Veterinarians can configure score ranges and descriptions via frontend
- ✅ Current 9 parameters migrated to 0-3 scale
- ✅ No data loss (health_fishparameterscore is empty, safe to change)
- ✅ Clean normalized database schema
- ✅ Clear frontend UI distinguishing measurements from assessments

---

## 📊 Current State Analysis

### Database Schema (Current):

**`health_healthparameter`** (9 records):
```sql
Table: health_healthparameter
Columns:
- id (PK)
- name (varchar 100, unique) 
- description_score_1 (text)  ← Hardcoded, inflexible
- description_score_2 (text)  ← Hardcoded, inflexible
- description_score_3 (text)  ← Hardcoded, inflexible
- description_score_4 (text)  ← Hardcoded, inflexible
- description_score_5 (text)  ← Hardcoded, inflexible
- is_active (boolean, default=true)
- created_at (timestamptz)
- updated_at (timestamptz)
```

**`health_fishparameterscore`** (0 records - EMPTY):
```sql
Table: health_fishparameterscore
Columns:
- id (PK)
- individual_fish_observation_id (FK)
- parameter_id (FK to health_healthparameter)
- score (smallint, validators: 1-5)  ← Hardcoded validator
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Current 9 Health Parameters:

| Parameter | Score 1 | Score 2 | Score 3 | Score 4 | Score 5 |
|-----------|---------|---------|---------|---------|---------|
| Gill Condition | Healthy gills, pink color | Slight mucus buildup | Moderate inflammation | Severe inflammation | Critical damage, necrosis |
| Eye Condition | Clear, bright eyes | Slight cloudiness | Moderate cloudiness | Severe cloudiness/damage | Blind or missing |
| Wounds/Lesions | No wounds | Minor abrasions | Moderate wounds | Severe wounds/ulcers | Extensive necrotic lesions |
| Fin Condition | Intact, healthy fins | Minor fraying | Moderate erosion | Severe erosion | Complete fin loss |
| Body Condition | Robust, well-formed | Slight deformities | Moderate deformities | Severe deformities | Critical malformation |
| Swimming Behavior | Active, normal swimming | Slightly lethargic | Moderately lethargic | Severely impaired | Unable to swim |
| Appetite | Excellent feeding response | Good appetite | Reduced appetite | Poor appetite | No feeding response |
| Mucous Membrane | Normal mucus layer | Slight excess mucus | Moderate excess mucus | Heavy excess mucus | Absent or damaged |
| Color/Pigmentation | Normal coloration | Slight color changes | Moderate discoloration | Severe discoloration | Extreme color abnormalities |

### Target State (0-3 Scale):

**Remove Score 5** (worst case) and shift to 0-based indexing:
```
Current (1-5) → Target (0-3)
Score 1 → Score 0 (Best)
Score 2 → Score 1 (Good)
Score 3 → Score 2 (Moderate)
Score 4 → Score 3 (Worst)
Score 5 → REMOVED
```

---

## 🏗️ Proposed Architecture

### New Normalized Schema:

```python
class HealthParameter(models.Model):
    """Defines a health parameter type (e.g., Gill Condition)"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(
        blank=True,
        help_text="General description of this health parameter"
    )
    min_score = models.IntegerField(
        default=0,
        help_text="Minimum score value (inclusive)"
    )
    max_score = models.IntegerField(
        default=3,
        help_text="Maximum score value (inclusive)"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    history = HistoricalRecords()
    
    def clean(self):
        if self.min_score >= self.max_score:
            raise ValidationError("min_score must be less than max_score")
    
    class Meta:
        verbose_name = "Health Parameter"
        verbose_name_plural = "Health Parameters"
        ordering = ['name']


class ParameterScoreDefinition(models.Model):
    """Defines what each score value means for a parameter"""
    parameter = models.ForeignKey(
        HealthParameter,
        on_delete=models.CASCADE,
        related_name='score_definitions'
    )
    score_value = models.IntegerField(
        help_text="The numeric score value (e.g., 0, 1, 2, 3)"
    )
    label = models.CharField(
        max_length=50,
        help_text="Short label for this score (e.g., 'Excellent', 'Good')"
    )
    description = models.TextField(
        help_text="Detailed description of what this score indicates"
    )
    display_order = models.IntegerField(
        default=0,
        help_text="Order to display this score (for sorting)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    history = HistoricalRecords()
    
    def clean(self):
        # Validate score_value is within parameter's range
        if self.parameter:
            if not (self.parameter.min_score <= self.score_value <= self.parameter.max_score):
                raise ValidationError(
                    f"Score value must be between {self.parameter.min_score} "
                    f"and {self.parameter.max_score}"
                )
    
    class Meta:
        verbose_name = "Parameter Score Definition"
        verbose_name_plural = "Parameter Score Definitions"
        unique_together = [['parameter', 'score_value']]
        ordering = ['parameter', 'display_order', 'score_value']


class FishParameterScore(models.Model):
    """Records a specific parameter score for an individual fish observation"""
    individual_fish_observation = models.ForeignKey(
        IndividualFishObservation,
        on_delete=models.CASCADE,
        related_name='parameter_scores'
    )
    parameter = models.ForeignKey(
        HealthParameter,
        on_delete=models.PROTECT,
        related_name='fish_scores'
    )
    score = models.SmallIntegerField(
        help_text="Score value - range defined by parameter's min_score/max_score"
    )
    # NO hardcoded validators - validation in clean() method
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    history = HistoricalRecords()
    
    def clean(self):
        # Dynamic validation based on parameter's score range
        if self.parameter:
            if not (self.parameter.min_score <= self.score <= self.parameter.max_score):
                raise ValidationError(
                    f"{self.parameter.name} score must be between "
                    f"{self.parameter.min_score} and {self.parameter.max_score}. "
                    f"You entered {self.score}."
                )
    
    class Meta:
        unique_together = [['individual_fish_observation', 'parameter']]
        ordering = ['individual_fish_observation', 'parameter']
```

### Database Relationships:
```
HealthParameter (1) ← (N) ParameterScoreDefinition
    ↓ (1)
    ↓
    ↓ (N)
FishParameterScore → (1) IndividualFishObservation
```

---

## 📋 Implementation Plan

### **PHASE 1: Backend Schema Restructuring**

#### Task 1.1: Create New Model
**File:** `apps/health/models/health_observation.py`

**Actions:**
1. Add `ParameterScoreDefinition` model class (see architecture above)
2. Update `HealthParameter` model:
   - Add `description` field (general parameter description)
   - Add `min_score` field (default=0)
   - Add `max_score` field (default=3)
   - Add `clean()` method for validation
   - Keep description_score_1-5 temporarily (will be removed after migration)
3. Update `FishParameterScore` model:
   - Remove hardcoded validators from `score` field
   - Add `clean()` method for dynamic validation
4. Update model imports in `apps/health/models/__init__.py`

**Validation:**
- Run `python manage.py check` - should pass
- No migrations created yet

---

#### Task 1.2: Create Migration
**Command:** `python manage.py makemigrations health --name restructure_health_parameters`

**Expected Migration:**
1. Create `health_parameterscoredefinition` table
2. Create `health_historicalparameterscoredefinition` table (auto via HistoricalRecords)
3. Add `description`, `min_score`, `max_score` to `health_healthparameter`
4. Keep `description_score_1-5` (not removed yet for safety)
5. Remove validators from `health_fishparameterscore.score` field

**Verification:**
- Check migration file SQL
- Ensure no data loss warnings
- Ensure historical tables created

---

#### Task 1.3: Data Population Script
**File:** Create `apps/health/management/commands/populate_parameter_scores.py`

**Purpose:** Convert current 9 parameters from 1-5 scale to 0-3 scale with new normalized structure

**Script Logic:**
```python
from django.core.management.base import BaseCommand
from apps.health.models import HealthParameter, ParameterScoreDefinition

class Command(BaseCommand):
    help = 'Populate ParameterScoreDefinition with 0-3 scale from existing parameters'
    
    PARAMETERS = {
        'Gill Condition': [
            (0, 'Excellent', 'Healthy gills, pink color'),
            (1, 'Good', 'Slight mucus buildup'),
            (2, 'Fair', 'Moderate inflammation'),
            (3, 'Poor', 'Severe inflammation'),
        ],
        'Eye Condition': [
            (0, 'Excellent', 'Clear, bright eyes'),
            (1, 'Good', 'Slight cloudiness'),
            (2, 'Fair', 'Moderate cloudiness'),
            (3, 'Poor', 'Severe cloudiness/damage'),
        ],
        'Wounds/Lesions': [
            (0, 'Excellent', 'No wounds'),
            (1, 'Good', 'Minor abrasions'),
            (2, 'Fair', 'Moderate wounds'),
            (3, 'Poor', 'Severe wounds/ulcers'),
        ],
        'Fin Condition': [
            (0, 'Excellent', 'Intact, healthy fins'),
            (1, 'Good', 'Minor fraying'),
            (2, 'Fair', 'Moderate erosion'),
            (3, 'Poor', 'Severe erosion'),
        ],
        'Body Condition': [
            (0, 'Excellent', 'Robust, well-formed'),
            (1, 'Good', 'Slight deformities'),
            (2, 'Fair', 'Moderate deformities'),
            (3, 'Poor', 'Severe deformities'),
        ],
        'Swimming Behavior': [
            (0, 'Excellent', 'Active, normal swimming'),
            (1, 'Good', 'Slightly lethargic'),
            (2, 'Fair', 'Moderately lethargic'),
            (3, 'Poor', 'Severely impaired'),
        ],
        'Appetite': [
            (0, 'Excellent', 'Excellent feeding response'),
            (1, 'Good', 'Good appetite'),
            (2, 'Fair', 'Reduced appetite'),
            (3, 'Poor', 'Poor appetite'),
        ],
        'Mucous Membrane': [
            (0, 'Excellent', 'Normal mucus layer'),
            (1, 'Good', 'Slight excess mucus'),
            (2, 'Fair', 'Moderate excess mucus'),
            (3, 'Poor', 'Heavy excess mucus'),
        ],
        'Color/Pigmentation': [
            (0, 'Excellent', 'Normal coloration'),
            (1, 'Good', 'Slight color changes'),
            (2, 'Fair', 'Moderate discoloration'),
            (3, 'Poor', 'Severe discoloration'),
        ],
    }
    
    def handle(self, *args, **options):
        for param_name, scores in self.PARAMETERS.items():
            param = HealthParameter.objects.get(name=param_name)
            
            # Update parameter to 0-3 range
            param.min_score = 0
            param.max_score = 3
            param.description = f"Visual assessment of {param_name.lower()}"
            param.save()
            
            # Create score definitions
            for score_value, label, description in scores:
                ParameterScoreDefinition.objects.create(
                    parameter=param,
                    score_value=score_value,
                    label=label,
                    description=description,
                    display_order=score_value
                )
            
            self.stdout.write(
                self.style.SUCCESS(f'✓ Populated {param_name} with {len(scores)} score definitions')
            )
```

**Usage:**
```bash
python manage.py populate_parameter_scores
```

**Expected Output:**
```
✓ Populated Gill Condition with 4 score definitions
✓ Populated Eye Condition with 4 score definitions
... (9 total)
```

---

#### Task 1.4: Update Serializers
**File:** `apps/health/api/serializers/health_observation.py`

**Create ParameterScoreDefinitionSerializer:**
```python
class ParameterScoreDefinitionSerializer(HealthBaseSerializer):
    """Serializer for parameter score definitions."""
    
    class Meta:
        model = ParameterScoreDefinition
        fields = [
            'id', 'parameter', 'score_value', 'label', 
            'description', 'display_order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
```

**Update HealthParameterSerializer:**
```python
class HealthParameterSerializer(HealthBaseSerializer):
    """Serializer for health parameters with nested score definitions."""
    
    score_definitions = ParameterScoreDefinitionSerializer(
        many=True, 
        read_only=True
    )
    
    class Meta:
        model = HealthParameter
        fields = [
            'id', 'name', 'description', 'min_score', 'max_score',
            'score_definitions',  # NEW - nested
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
```

**Remove:** All references to description_score_1-5

---

#### Task 1.5: Update ViewSets
**File:** `apps/health/api/viewsets/health_observation.py`

**Update HealthParameterViewSet:**
```python
class HealthParameterViewSet(HistoryReasonMixin, StandardFilterMixin, viewsets.ModelViewSet):
    queryset = HealthParameter.objects.prefetch_related('score_definitions').all()
    serializer_class = HealthParameterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    filterset_fields = {
        'is_active': ['exact'],
        'name': ['exact', 'icontains'],
        'min_score': ['exact', 'gte', 'lte'],
        'max_score': ['exact', 'gte', 'lte'],
    }
    search_fields = ['name', 'description']  # Remove description_score_1-5
```

**Add ParameterScoreDefinitionViewSet:**
```python
class ParameterScoreDefinitionViewSet(HistoryReasonMixin, StandardFilterMixin, 
                                     viewsets.ModelViewSet):
    """API endpoint for managing parameter score definitions."""
    queryset = ParameterScoreDefinition.objects.select_related('parameter').all()
    serializer_class = ParameterScoreDefinitionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    filterset_fields = {
        'parameter': ['exact'],
        'score_value': ['exact', 'gte', 'lte'],
    }
    search_fields = ['label', 'description']
```

---

#### Task 1.6: Register Routes
**File:** `apps/health/api/routers.py`

**Add:**
```python
from apps.health.api.viewsets import (
    # ... existing imports
    ParameterScoreDefinitionViewSet,
)

router.register(
    r'parameter-score-definitions',
    ParameterScoreDefinitionViewSet,
    basename='parameter-score-definitions'
)
```

---

#### Task 1.7: Update Admin
**File:** `apps/health/admin.py`

**Update HealthParameterAdmin:**
```python
class ParameterScoreDefinitionInline(admin.TabularInline):
    model = ParameterScoreDefinition
    extra = 1
    fields = ('score_value', 'label', 'description', 'display_order')
    ordering = ['display_order', 'score_value']

@admin.register(HealthParameter)
class HealthParameterAdmin(SimpleHistoryAdmin):
    list_display = ('name', 'min_score', 'max_score', 'is_active', 'updated_at')
    list_filter = ('is_active', 'min_score', 'max_score')
    search_fields = ('name', 'description')
    inlines = [ParameterScoreDefinitionInline]
    
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Score Range', {
            'fields': ('min_score', 'max_score'),
            'description': 'Define the valid score range for this parameter.'
        }),
        ('Deprecated Fields (Hidden)', {
            'fields': ('description_score_1', 'description_score_2', 
                      'description_score_3', 'description_score_4', 
                      'description_score_5'),
            'classes': ('collapse',),
            'description': 'Legacy fields - do not use. Will be removed in future migration.'
        }),
    )
```

**Add ParameterScoreDefinitionAdmin:**
```python
@admin.register(ParameterScoreDefinition)
class ParameterScoreDefinitionAdmin(SimpleHistoryAdmin):
    list_display = ('parameter', 'score_value', 'label', 'display_order')
    list_filter = ('parameter',)
    search_fields = ('label', 'description', 'parameter__name')
    autocomplete_fields = ['parameter']
    ordering = ['parameter', 'display_order', 'score_value']
```

---

#### Task 1.8: Update Tests
**File:** `apps/health/tests/api/test_serializers.py`

**Update HealthParameterSerializerTestCase:**
```python
class HealthParameterSerializerTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create parameter with new schema
        cls.parameter = HealthParameter.objects.create(
            name='Test Parameter',
            description='Test health parameter',
            min_score=0,
            max_score=3,
            is_active=True
        )
        
        # Create score definitions
        ParameterScoreDefinition.objects.create(
            parameter=cls.parameter,
            score_value=0,
            label='Excellent',
            description='No issues detected',
            display_order=0
        )
        ParameterScoreDefinition.objects.create(
            parameter=cls.parameter,
            score_value=1,
            label='Good',
            description='Minor issues',
            display_order=1
        )
        # ... scores 2 and 3
    
    def test_parameter_with_score_definitions(self):
        """Test serialization includes nested score definitions"""
        serializer = HealthParameterSerializer(instance=self.parameter)
        data = serializer.data
        
        self.assertEqual(data['name'], 'Test Parameter')
        self.assertEqual(data['min_score'], 0)
        self.assertEqual(data['max_score'], 3)
        self.assertEqual(len(data['score_definitions']), 4)
        self.assertEqual(data['score_definitions'][0]['score_value'], 0)
        self.assertEqual(data['score_definitions'][0]['label'], 'Excellent')
```

**Add new test file:** `apps/health/tests/api/test_parameter_score_definitions.py`
- Test CRUD operations
- Test validation (score_value within parameter range)
- Test unique_together constraint
- Test ordering

---

#### Task 1.9: Run Migrations
**Commands:**
```bash
# 1. Create migration
python manage.py makemigrations health --name restructure_health_parameters

# 2. Review migration file
cat apps/health/migrations/XXXX_restructure_health_parameters.py

# 3. Apply migration
python manage.py migrate health

# 4. Populate score definitions
python manage.py populate_parameter_scores

# 5. Verify data
python manage.py shell -c "
from apps.health.models import HealthParameter, ParameterScoreDefinition
print(f'Parameters: {HealthParameter.objects.count()}')
print(f'Score Definitions: {ParameterScoreDefinition.objects.count()}')
for p in HealthParameter.objects.prefetch_related('score_definitions'):
    print(f'{p.name}: {p.min_score}-{p.max_score}, {p.score_definitions.count()} definitions')
"
```

**Expected Output:**
```
Parameters: 9
Score Definitions: 36 (9 parameters × 4 scores each)
Gill Condition: 0-3, 4 definitions
Eye Condition: 0-3, 4 definitions
... (9 total)
```

---

#### Task 1.10: Regenerate OpenAPI Schema
**Commands:**
```bash
cd /Users/aquarian247/Projects/AquaMind

# Generate schema
python manage.py spectacular --file api/openapi.yaml --validate --settings=aquamind.settings_ci

# Verify new endpoints
grep -A 10 "parameter-score-definitions" api/openapi.yaml

# Verify HealthParameter schema includes score_definitions
grep -A 20 "HealthParameter:" api/openapi.yaml
```

**Validation:**
- Check schema has `parameter-score-definitions` endpoints
- Check HealthParameter schema includes `score_definitions` array
- Check `min_score`, `max_score` fields present
- 0 errors, minimal warnings

---

### **PHASE 2: Frontend API Integration**

#### Task 2.1: Sync OpenAPI Spec
**Commands:**
```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend

# Copy updated schema
cp /Users/aquarian247/Projects/AquaMind/api/openapi.yaml api/openapi.yaml
cp api/openapi.yaml tmp/openapi/openapi.yaml

# Regenerate TypeScript client
npm run generate:api
```

**Verification:**
- Check `client/src/api/generated/models/ParameterScoreDefinition.ts` exists
- Check `HealthParameter` type includes `score_definitions` array
- Check `min_score`, `max_score` fields in HealthParameter type
- Run `npm run type-check` - should pass

---

#### Task 2.2: Add API Hooks
**File:** `client/src/features/health/api.ts`

**Add ParameterScoreDefinition hooks:**
```typescript
// ==========================================
// Parameter Score Definitions
// ==========================================

export function useParameterScoreDefinitions(filters?: {
  parameterId?: number;
  scoreValue?: number;
  page?: number;
}): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["health", "parameter-score-definitions", filters],
    queryFn: () => ApiService.apiV1HealthParameterScoreDefinitionsList(
      filters?.parameterId,
      filters?.scoreValue,
      filters?.page,
    ),
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useParameterScoreDefinition(
  id: number | undefined
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["health", "parameter-score-definitions", id],
    queryFn: () => ApiService.apiV1HealthParameterScoreDefinitionsRetrieve(id!),
    enabled: !!id,
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useCreateParameterScoreDefinition() {
  return useCrudMutation<any, any>({
    mutationFn: (data) => ApiService.apiV1HealthParameterScoreDefinitionsCreate(data),
    description: "Score definition created successfully",
    invalidateQueries: ["health", "parameter-score-definitions", "health-parameters"],
  });
}

export function useUpdateParameterScoreDefinition() {
  return useCrudMutation<any & { id: number }, any>({
    mutationFn: ({ id, ...data }) => 
      ApiService.apiV1HealthParameterScoreDefinitionsUpdate(id, data as any),
    description: "Score definition updated successfully",
    invalidateQueries: ["health", "parameter-score-definitions", "health-parameters"],
  });
}

export function useDeleteParameterScoreDefinition() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => 
      ApiService.apiV1HealthParameterScoreDefinitionsDestroy(id),
    description: "Score definition deleted successfully",
    invalidateQueries: ["health", "parameter-score-definitions", "health-parameters"],
  });
}
```

**Update useHealthParameters hook:**
Ensure it prefetches score_definitions in the query

---

#### Task 2.3: Create Validation Schemas
**File:** `client/src/lib/validation/health.ts`

**Add schemas:**
```typescript
/**
 * Parameter score definition schema (for configuring what each score means)
 */
export const parameterScoreDefinitionSchema = z.object({
  parameter: z.coerce.number().int().positive('Parameter is required'),
  score_value: z.coerce.number().int().min(0).max(10, 'Score value must be between 0-10'),
  label: nonEmptyString.max(50, 'Label must be 50 characters or less'),
  description: nonEmptyString,
  display_order: z.coerce.number().int().min(0).optional(),
})

export type ParameterScoreDefinitionFormValues = z.infer<typeof parameterScoreDefinitionSchema>

/**
 * Health parameter schema (updated with min/max scores)
 */
export const healthParameterSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  description: optionalString,
  min_score: z.coerce.number().int().min(0, 'Minimum score must be 0 or greater'),
  max_score: z.coerce.number().int().min(0, 'Maximum score must be 0 or greater'),
  is_active: z.boolean().default(true),
}).refine(
  (data) => data.max_score > data.min_score,
  {
    message: "Maximum score must be greater than minimum score",
    path: ["max_score"],
  }
)

export type HealthParameterFormValues = z.infer<typeof healthParameterSchema>
```

---

### **PHASE 3: Frontend UI Restructuring**

#### Task 3.1: Rename Health Page Tabs
**File:** `client/src/pages/health.tsx`

**Changes:**
```typescript
// Update tab structure
<TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
  <TabsTrigger value="journal">
    <FileText className="h-4 w-4 mr-2" />
    {!isMobile && "Journal"}
  </TabsTrigger>
  <TabsTrigger value="measurements">  {/* RENAMED from "sampling" */}
    <Ruler className="h-4 w-4 mr-2" />  {/* Changed icon */}
    {!isMobile && "Measurements"}
  </TabsTrigger>
  <TabsTrigger value="assessments">  {/* NEW TAB */}
    <Stethoscope className="h-4 w-4 mr-2" />
    {!isMobile && "Assessments"}
  </TabsTrigger>
  <TabsTrigger value="lab">
    <Beaker className="h-4 w-4 mr-2" />
    {!isMobile && "Lab"}
  </TabsTrigger>
  <TabsTrigger value="treatments">
    <Pill className="h-4 w-4 mr-2" />
    {!isMobile && "Treatments"}
  </TabsTrigger>
  <TabsTrigger value="reference">  {/* RENAMED from "sample-types" */}
    <BookOpen className="h-4 w-4 mr-2" />
    {!isMobile && "Reference"}
  </TabsTrigger>
</TabsList>
```

**Update tab content titles:**
```typescript
// Measurements Tab (renamed from Sampling)
<TabsContent value="measurements">
  <h2>Growth Measurements</h2>
  <p>Record weight and length measurements for growth tracking</p>
  <Button onClick={() => openCreateDialog('samplingEvent')}>
    <Plus /> New Measurement
  </Button>
  {/* Existing HealthSamplingEventForm - emphasizes weight/length */}
</TabsContent>

// NEW: Assessments Tab
<TabsContent value="assessments">
  <h2>Health Assessments</h2>
  <p>Veterinary health parameter scoring (gill condition, fin condition, etc.)</p>
  <Button onClick={() => openCreateDialog('healthAssessment')}>
    <Plus /> New Assessment
  </Button>
  {/* Will show HealthAssessmentForm - emphasizes parameter scoring */}
</TabsContent>

// Reference Tab (reorganized)
<TabsContent value="reference">
  <Accordion type="multiple">
    <AccordionItem value="sample-types">
      <AccordionTrigger>Laboratory Sample Types ({sampleTypesCount})</AccordionTrigger>
      <AccordionContent>
        {/* Existing SampleType list */}
      </AccordionContent>
    </AccordionItem>
    
    <AccordionItem value="health-parameters">
      <AccordionTrigger>Health Parameters ({healthParametersCount})</AccordionTrigger>
      <AccordionContent>
        {/* NEW: HealthParameter list with score range */}
      </AccordionContent>
    </AccordionItem>
    
    <AccordionItem value="vaccination-types">
      <AccordionTrigger>Vaccination Types ({vaccinationTypesCount})</AccordionTrigger>
      <AccordionContent>
        {/* Existing VaccinationType list */}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</TabsContent>
```

---

#### Task 3.2: Create HealthParameterForm Component
**File:** `client/src/features/health/components/HealthParameterForm.tsx`

**Features:**
- Name field (required)
- Description field (optional general description)
- Min Score field (number, default 0)
- Max Score field (number, default 3)
- Validation: max > min
- Is Active checkbox
- Permission gate (Veterinarian+ only for create/edit)

**Pattern:** Simple reference data form (like SampleTypeForm)

**Estimated LOC:** ~200 lines

---

#### Task 3.3: Create ParameterScoreDefinitionForm Component
**File:** `client/src/features/health/components/ParameterScoreDefinitionForm.tsx`

**Features:**
- Parameter dropdown (FK to HealthParameter)
- Score Value field (number input, validated against parameter's min/max)
- Label field (e.g., "Excellent", "Good", "Fair", "Poor")
- Description field (detailed explanation)
- Display Order field (for sorting, optional)
- Real-time validation against parameter's score range

**Pattern:** FK dropdown with validation

**Estimated LOC:** ~250 lines

---

#### Task 3.4: Enhanced HealthParameterForm with Score Builder
**File:** `client/src/features/health/components/HealthParameterFormEnhanced.tsx`

**Alternative approach:** Combined form that creates parameter + all score definitions in one wizard

**Features:**
1. **Step 1: Parameter Details**
   - Name, description, is_active
   - Min/max score range

2. **Step 2: Score Definitions Builder**
   - Dynamic UI based on score range
   - If range is 0-3, show 4 text fields:
     - Score 0: [Label] [Description]
     - Score 1: [Label] [Description]
     - Score 2: [Label] [Description]
     - Score 3: [Label] [Description]
   - Template dropdown (pre-fill common patterns)

3. **Step 3: Review & Submit**
   - Shows full parameter configuration
   - Creates parameter + all definitions in sequence

**Pattern:** Multi-step wizard (similar to scenario creation)

**Estimated LOC:** ~400 lines

**Recommendation:** Start with separate forms (Task 3.2 + 3.3), add wizard later if needed

---

#### Task 3.5: Create Health Assessment Entry Form
**File:** `client/src/features/health/components/HealthAssessmentForm.tsx`

**Purpose:** Allow veterinarians to score fish on health parameters (separate from weight/length measurements)

**Features:**
- Uses same HealthSamplingEvent model but different UX
- Assignment dropdown (batch + container)
- Sampling date
- Number of fish assessed
- **Table with parameter scoring** (not weight/length):
  ```
  | Fish ID | Gill Condition | Eye Condition | Wounds | Fin | Body | ... |
  |---------|----------------|---------------|--------|-----|------|-----|
  | 1       | [0-3 dropdown] | [0-3 dropdown]| [0-3]  | ... | ...  | ... |
  | 2       | [0-3 dropdown] | [0-3 dropdown]| [0-3]  | ... | ...  | ... |
  ```
- Dynamic dropdowns per parameter (reads min/max from parameter definition)
- Optionally include weight/length (but not required for vet assessments)
- Validation: All selected parameters must have scores
- Permission gate: Veterinarian+ only

**API Payload:**
```json
{
  "assignment": 5,
  "sampling_date": "2025-10-30",
  "number_of_fish_sampled": 2,
  "notes": "Routine veterinary health check",
  "individual_fish_observations": [
    {
      "fish_identifier": "1",
      "weight_g": null,  // Optional for vet assessments
      "length_cm": null, // Optional for vet assessments
      "parameter_scores": [
        { "parameter": 1, "score": 0 },  // Gill: Excellent
        { "parameter": 2, "score": 1 },  // Eye: Good
        { "parameter": 3, "score": 0 },  // Wounds: None
        // ... all 9 parameters
      ]
    },
    {
      "fish_identifier": "2",
      "parameter_scores": [ /* ... */ ]
    }
  ]
}
```

**Pattern:** Complex nested form (similar to HealthSamplingEventForm but different focus)

**Estimated LOC:** ~500 lines

---

### **PHASE 4: Testing & Validation**

#### Task 4.1: Backend Testing
**Run all health tests:**
```bash
python manage.py test apps.health --settings=aquamind.settings_ci
```

**Expected:**
- All existing tests pass
- New ParameterScoreDefinition tests pass
- Updated HealthParameter tests pass
- Validator tests with different score ranges pass

---

#### Task 4.2: Frontend Testing
**Manual testing checklist:**

**Health Parameters:**
- [ ] View list of 9 parameters with score ranges (0-3)
- [ ] Click parameter to view score definitions
- [ ] Create new parameter with custom range (e.g., 0-5)
- [ ] Create score definitions for new parameter
- [ ] Edit parameter min/max range
- [ ] Verify score definitions validate against range
- [ ] Delete parameter (should cascade delete definitions)

**Health Assessments:**
- [ ] Open "Health Assessments" tab
- [ ] Click "New Assessment"
- [ ] Select assignment
- [ ] Add 2 fish to assess
- [ ] Score each fish on all 9 parameters (0-3 dropdowns)
- [ ] Verify score dropdowns show correct labels
- [ ] Submit assessment
- [ ] Verify assessment appears in list
- [ ] View assessment details with parameter scores

**Growth Measurements (renamed):**
- [ ] Open "Measurements" tab (renamed from Sampling)
- [ ] Verify existing measurement form still works
- [ ] Verify K-factor calculations still work
- [ ] Confirm this is clearly for weight/length, not vet assessments

---

### **PHASE 5: Cleanup & Documentation**

#### Task 5.1: Remove Legacy Fields (Final Migration)
**After Phase 4 testing passes:**

Create migration to remove `description_score_1-5` from HealthParameter:
```bash
python manage.py makemigrations health --name remove_legacy_score_descriptions
```

**Migration will:**
1. Drop columns: description_score_1, description_score_2, description_score_3, description_score_4, description_score_5
2. Update historical table (django-simple-history handles this)

**Verification:**
- All tests still pass
- OpenAPI schema no longer shows legacy fields
- Admin interface clean (no deprecated fields)

---

#### Task 5.2: Update Documentation
**Files to update:**

1. **`docs/database/data_model.md`** (section 4.4):
   ```markdown
   - **`health_healthparameter`**
     - id: bigint (PK, auto-increment)
     - name: varchar(100) (Unique)
     - description: text (nullable, general parameter description)
     - min_score: integer (default=0, minimum score value)
     - max_score: integer (default=3, maximum score value)
     - is_active: boolean (default=True)
     - created_at: timestamptz
     - updated_at: timestamptz
   
   - **`health_parameterscoredefinition`** (NEW)
     - id: bigint (PK, auto-increment)
     - parameter_id: bigint (FK to health_healthparameter, CASCADE)
     - score_value: integer (the numeric score, e.g., 0, 1, 2, 3)
     - label: varchar(50) (short label, e.g., "Excellent")
     - description: text (detailed description of this score)
     - display_order: integer (for UI sorting)
     - created_at: timestamptz
     - updated_at: timestamptz
     - Meta: unique_together = ['parameter', 'score_value']
   ```

2. **`docs/prd.md`** (section 3.1.4 Health Monitoring):
   - Update to reflect flexible scoring system
   - Document 0-3 as current standard but note it's configurable

3. **Create:** `docs/progress/health_parameter_migration_complete.md`
   - Document what was changed
   - List all 9 parameters with new 0-3 definitions
   - Performance notes
   - Migration steps executed

---

## 📐 Database Schema Summary

### Before (Inflexible):
```
health_healthparameter
├── name
├── description_score_1  ❌ Hardcoded
├── description_score_2  ❌ Hardcoded  
├── description_score_3  ❌ Hardcoded
├── description_score_4  ❌ Hardcoded
├── description_score_5  ❌ Hardcoded
└── is_active

health_fishparameterscore
├── parameter_id
├── score  ❌ Validator: 1-5 hardcoded
└── ...
```

### After (Fully Normalized):
```
health_healthparameter
├── name
├── description (NEW - general description)
├── min_score (NEW - configurable min)
├── max_score (NEW - configurable max)
└── is_active

health_parameterscoredefinition (NEW TABLE)
├── parameter_id (FK)
├── score_value (e.g., 0, 1, 2, 3)
├── label (e.g., "Excellent")
├── description (e.g., "Healthy gills, pink color")
└── display_order

health_fishparameterscore
├── parameter_id
├── score  ✅ Dynamic validation via clean()
└── ...
```

---

## 🎨 Frontend UI Changes Summary

### Health Page Tab Structure:

#### Before:
```
├── Journal         (observations)
├── Sampling        ← CONFUSING NAME (actually measurements)
├── Lab            (lab samples)
├── Treatments     (medications)
├── Types          ← UNCLEAR (sample types only)
└── Vaccines       (vaccination types)
```

#### After:
```
├── Journal         (general observations - anyone)
├── Measurements    ✅ RENAMED (weight/length - operators)
├── Assessments     ✅ NEW (health parameter scoring - veterinarians)
├── Lab            (external lab tests)
├── Treatments     (medications/vaccines)
└── Reference       ✅ REORGANIZED (accordion with 3 sections):
    ├── Sample Types
    ├── Health Parameters ✅ ENHANCED (with score management)
    └── Vaccination Types
```

### Overview Cards:
```
Update card for Sampling Events → Growth Measurements
Add card for Health Assessments (NEW)
```

---

## 🔧 Migration Data Mapping

### Example: Color/Pigmentation Parameter

**Current (1-5 scale):**
```
score 1: Normal coloration
score 2: Slight color changes
score 3: Moderate discoloration
score 4: Severe discoloration
score 5: Extreme color abnormalities  ← REMOVE
```

**Target (0-3 scale):**
```sql
-- HealthParameter record
name: 'Color/Pigmentation'
description: 'Visual assessment of fish skin color and pigmentation'
min_score: 0
max_score: 3

-- ParameterScoreDefinition records (4 rows)
(parameter_id, score_value, label, description, display_order)
(X, 0, 'Excellent', 'Normal coloration', 0)
(X, 1, 'Good', 'Slight color changes', 1)
(X, 2, 'Fair', 'Moderate discoloration', 2)
(X, 3, 'Poor', 'Severe discoloration', 3)
```

### All 9 Parameters Mapping:

| Parameter | Min | Max | Score 0 | Score 1 | Score 2 | Score 3 |
|-----------|-----|-----|---------|---------|---------|---------|
| Gill Condition | 0 | 3 | Healthy gills, pink color | Slight mucus buildup | Moderate inflammation | Severe inflammation |
| Eye Condition | 0 | 3 | Clear, bright eyes | Slight cloudiness | Moderate cloudiness | Severe cloudiness/damage |
| Wounds/Lesions | 0 | 3 | No wounds | Minor abrasions | Moderate wounds | Severe wounds/ulcers |
| Fin Condition | 0 | 3 | Intact, healthy fins | Minor fraying | Moderate erosion | Severe erosion |
| Body Condition | 0 | 3 | Robust, well-formed | Slight deformities | Moderate deformities | Severe deformities |
| Swimming Behavior | 0 | 3 | Active, normal swimming | Slightly lethargic | Moderately lethargic | Severely impaired |
| Appetite | 0 | 3 | Excellent feeding response | Good appetite | Reduced appetite | Poor appetite |
| Mucous Membrane | 0 | 3 | Normal mucus layer | Slight excess mucus | Moderate excess mucus | Heavy excess mucus |
| Color/Pigmentation | 0 | 3 | Normal coloration | Slight color changes | Moderate discoloration | Severe discoloration |

**Total rows in `health_parameterscoredefinition`:** 36 (9 parameters × 4 scores)

---

## 🚨 Important Notes

### Data Safety:
- ✅ **health_fishparameterscore is EMPTY** - safe to change validator
- ✅ **No user data to migrate** - can restructure freely
- ✅ **9 parameters exist** - will be updated with new structure
- ✅ **Historical tables handled** - django-simple-history creates historical versions automatically

### Permission Requirements:
- **Health Parameter CRUD:** Veterinarian or Admin only
- **Score Definition CRUD:** Veterinarian or Admin only
- **View parameters:** All authenticated users (for dropdown population)
- **Health Assessments:** Veterinarian or Admin only
- **Growth Measurements:** Operators, Managers, Veterinarians

### UI/UX Considerations:
- **Clear separation:** Measurements (operators) vs Assessments (veterinarians)
- **Parameter scoring:** Use same IndividualFishObservation model but different form UX
- **Flexible scoring:** Frontend reads min/max from API, renders appropriate dropdown
- **Score labels:** Display "Excellent (0)" not just "0" for clarity
- **Accordion for reference data:** Reduces clutter, groups related config

---

## ✅ Acceptance Criteria

### Backend:
- [ ] New `ParameterScoreDefinition` model created
- [ ] Migration applied successfully
- [ ] All 9 parameters updated with min_score=0, max_score=3
- [ ] 36 score definitions created (9 parameters × 4 scores)
- [ ] FishParameterScore validator dynamic (not hardcoded)
- [ ] All existing tests pass
- [ ] OpenAPI schema includes new endpoints
- [ ] Admin interface updated

### Frontend:
- [ ] "Sampling" tab renamed to "Measurements"
- [ ] "Types" tab reorganized as "Reference" accordion
- [ ] New "Assessments" tab added
- [ ] HealthParameter CRUD form created
- [ ] ParameterScoreDefinition CRUD form created
- [ ] Health Assessment entry form created
- [ ] All dropdowns show correct score ranges
- [ ] Score labels display properly ("Excellent (0)", etc.)
- [ ] Permission gates on all forms
- [ ] Type safety (0 TypeScript errors)

### Testing:
- [ ] Create parameter with 0-3 range
- [ ] Create parameter with 1-5 range (test flexibility)
- [ ] Create parameter with 0-10 range (test wide range)
- [ ] Enter health assessment with scores
- [ ] Verify validation catches out-of-range scores
- [ ] Verify score labels display in UI
- [ ] All CRUD operations working

---

## 📦 Deliverables Checklist

### Backend Files:
- [ ] `apps/health/models/health_observation.py` - Updated models
- [ ] `apps/health/migrations/XXXX_restructure_health_parameters.py` - Schema migration
- [ ] `apps/health/management/commands/populate_parameter_scores.py` - Data population script
- [ ] `apps/health/api/serializers/health_observation.py` - Updated serializers
- [ ] `apps/health/api/viewsets/health_observation.py` - Updated viewsets
- [ ] `apps/health/api/routers.py` - New route registration
- [ ] `apps/health/admin.py` - Updated admin classes
- [ ] `apps/health/tests/api/test_parameter_score_definitions.py` - New tests
- [ ] `apps/health/tests/api/test_serializers.py` - Updated tests
- [ ] `api/openapi.yaml` - Regenerated schema

### Frontend Files:
- [ ] `client/src/pages/health.tsx` - Renamed tabs, new structure
- [ ] `client/src/lib/validation/health.ts` - New schemas
- [ ] `client/src/features/health/api.ts` - New hooks
- [ ] `client/src/features/health/components/HealthParameterForm.tsx` - NEW
- [ ] `client/src/features/health/components/ParameterScoreDefinitionForm.tsx` - NEW
- [ ] `client/src/features/health/components/HealthAssessmentForm.tsx` - NEW
- [ ] `client/src/features/health/components/HealthParameterDeleteButton.tsx` - NEW
- [ ] `client/src/features/health/components/ParameterScoreDefinitionDeleteButton.tsx` - NEW
- [ ] `client/src/api/generated/*` - Regenerated from OpenAPI

### Documentation:
- [ ] `docs/database/data_model.md` - Updated section 4.4
- [ ] `docs/prd.md` - Updated section 3.1.4
- [ ] `docs/progress/health_parameter_migration_complete.md` - NEW (completion doc)

---

## 🎓 Key Patterns to Follow

### Backend:
1. **Model validation in clean() methods** - Not in field validators
2. **Nested serializers** - ParameterScoreDefinition nested in HealthParameter
3. **Prefetch related** - Always prefetch score_definitions with parameters
4. **Cascade deletes** - ParameterScoreDefinition CASCADE on parameter delete
5. **Historical tracking** - Both models use HistoricalRecords()

### Frontend:
1. **Nested data display** - Show parameter with its score definitions
2. **Dynamic form fields** - Number of score inputs based on min/max range
3. **Dropdown population** - Read score definitions from API, not hardcoded
4. **Permission gates** - Veterinarian+ for parameter management
5. **Clear labeling** - "Excellent (0)" not just "0"

---

## 🚀 Execution Order

### Recommended Sequence:

**Day 1: Backend Foundation**
1. Phase 1, Task 1.1 - Create new models ✓
2. Phase 1, Task 1.2 - Create migration ✓
3. Phase 1, Task 1.3 - Create data population script ✓
4. Phase 1, Task 1.9 - Run migrations & populate ✓
5. Phase 1, Task 1.4 - Update serializers ✓

**Day 2: Backend API & Testing**
6. Phase 1, Task 1.5 - Update viewsets ✓
7. Phase 1, Task 1.6 - Register routes ✓
8. Phase 1, Task 1.7 - Update admin ✓
9. Phase 1, Task 1.8 - Update tests ✓
10. Phase 4, Task 4.1 - Run backend tests ✓

**Day 3: Frontend Integration**
11. Phase 1, Task 1.10 - Regenerate OpenAPI ✓
12. Phase 2, Task 2.1 - Sync OpenAPI to frontend ✓
13. Phase 2, Task 2.2 - Add API hooks ✓
14. Phase 2, Task 2.3 - Create validation schemas ✓

**Day 4: Frontend Forms - Reference Data**
15. Phase 3, Task 3.1 - Rename tabs ✓
16. Phase 3, Task 3.2 - Create HealthParameterForm ✓
17. Phase 3, Task 3.3 - Create ParameterScoreDefinitionForm ✓
18. Phase 4, Task 4.2 - Test parameter management ✓

**Day 5: Frontend Forms - Health Assessments**
19. Phase 3, Task 3.5 - Create HealthAssessmentForm ✓
20. Phase 4, Task 4.2 - Test health assessments ✓
21. Phase 5, Task 5.1 - Remove legacy fields migration ✓
22. Phase 5, Task 5.2 - Update documentation ✓

**Note:** "Days" are conceptual - proceed at your own pace based on task completion, not time

---

## 💡 Design Decisions & Rationale

### Why Full Normalization (Not JSON)?
- ✅ **Queryable** - Can filter/search by score value or label
- ✅ **Relational integrity** - Foreign keys enforce data consistency
- ✅ **Type safety** - Database enforces integer scores
- ✅ **Historical tracking** - django-simple-history works seamlessly
- ✅ **Performance** - Indexed lookups faster than JSON parsing
- ✅ **Flexibility** - Easy to add fields later (e.g., color coding, icons)

### Why Keep min_score/max_score on HealthParameter?
- ✅ **Validation** - Single source of truth for valid range
- ✅ **Frontend efficiency** - Don't need to query all definitions to know range
- ✅ **API clarity** - GET /health-parameters/ shows range immediately
- ✅ **User feedback** - Can show "Valid range: 0-3" before user enters score

### Why display_order Field?
- ✅ **UI flexibility** - Score 0 might not always be "best" (depends on parameter semantics)
- ✅ **Cultural preferences** - Some users prefer low=best, others high=best
- ✅ **Sorting control** - Admin can reorder how scores appear in dropdowns

### Why Separate Forms (Measurements vs Assessments)?
- ✅ **User clarity** - Operators don't need to see vet-only features
- ✅ **Permission control** - Different user roles
- ✅ **Workflow optimization** - Different data entry patterns
- ✅ **Data quality** - Veterinarians focus on health, operators on growth

---

## 🎯 Frontend UX Specification

### Health Parameter List View (Reference Data Tab)

**Display:**
```
┌─────────────────────────────────────────────────────────────┐
│ Health Parameters (9)                                       │
│ Configure health assessment scoring types                   │
│                                                    [+ New]  │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐    │
│ │ Gill Condition                              [Edit]  │    │
│ │ Visual assessment of gill health                    │    │
│ │ Score range: 0-3 (4 levels)                         │    │
│ │ • 0: Excellent - Healthy gills, pink color          │    │
│ │ • 1: Good - Slight mucus buildup                    │    │
│ │ • 2: Fair - Moderate inflammation                   │    │
│ │ • 3: Poor - Severe inflammation                     │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ Eye Condition                               [Edit]  │    │
│ │ Visual assessment of eye clarity                    │    │
│ │ Score range: 0-3 (4 levels)                         │    │
│ │ • 0: Excellent - Clear, bright eyes                 │    │
│ │ ... (collapsed, click to expand)                    │    │
│ └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Health Assessment Entry Form

**UI Flow:**
1. Select batch/container assignment
2. Enter number of fish to assess
3. Table with fish and parameter columns:

```
┌──────────────────────────────────────────────────────────────────┐
│ Individual Fish Health Assessments                               │
├──────────────────────────────────────────────────────────────────┤
│ Fish ID │ Gill    │ Eye     │ Wounds  │ Fin     │ Body    │ ... │
│         │ (0-3)   │ (0-3)   │ (0-3)   │ (0-3)   │ (0-3)   │     │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│ 1       │ [▾ 0]   │ [▾ 0]   │ [▾ 0]   │ [▾ 1]   │ [▾ 0]   │ ... │
│         │ Exc.    │ Exc.    │ Exc.    │ Good    │ Exc.    │     │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│ 2       │ [▾ 1]   │ [▾ 0]   │ [▾ 2]   │ [▾ 0]   │ [▾ 0]   │ ... │
│         │ Good    │ Exc.    │ Fair    │ Exc.    │ Exc.    │     │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────┘
                                                       [+ Add Fish]
```

**Dropdown content** (per parameter):
```
Gill Condition
  ○ 0 - Excellent (Healthy gills, pink color)
  ○ 1 - Good (Slight mucus buildup)
  ○ 2 - Fair (Moderate inflammation)  
  ○ 3 - Poor (Severe inflammation)
```

---

## 📊 API Endpoints Summary

### New Endpoints:
```
GET    /api/v1/health/parameter-score-definitions/
POST   /api/v1/health/parameter-score-definitions/
GET    /api/v1/health/parameter-score-definitions/{id}/
PUT    /api/v1/health/parameter-score-definitions/{id}/
PATCH  /api/v1/health/parameter-score-definitions/{id}/
DELETE /api/v1/health/parameter-score-definitions/{id}/
```

### Updated Endpoints:
```
GET /api/v1/health/health-parameters/
Response now includes:
{
  "id": 1,
  "name": "Gill Condition",
  "description": "Visual assessment of gill health",
  "min_score": 0,
  "max_score": 3,
  "score_definitions": [  ← NEW nested array
    {
      "id": 1,
      "score_value": 0,
      "label": "Excellent",
      "description": "Healthy gills, pink color",
      "display_order": 0
    },
    // ... 3 more
  ],
  "is_active": true
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Create Custom Parameter Range
```
1. Veterinarian creates new parameter "Scale Condition"
2. Sets min_score=1, max_score=5 (different from standard 0-3)
3. Creates 5 score definitions (1-5)
4. Uses in health assessment
5. Verifies dropdown shows 1-5, not 0-3
```

### Scenario 2: Score Validation
```
1. Operator tries to enter score=5 for Gill Condition (max=3)
2. Backend validation rejects (clean() method)
3. Frontend shows error: "Gill Condition score must be between 0 and 3"
4. User corrects to score=2
5. Saves successfully
```

### Scenario 3: Change Score Range
```
1. Veterinarian decides Appetite needs finer granularity
2. Changes Appetite from 0-3 to 0-5
3. Adds 2 new score definitions (scores 4 and 5)
4. Existing historical scores (0-3) remain valid
5. New assessments can use full 0-5 range
```

---

## ⚠️ Migration Safety Notes

### Before Running Migrations:
1. ✅ **Backup database** (always)
2. ✅ **Verify health_fishparameterscore is empty**:
   ```sql
   SELECT COUNT(*) FROM health_fishparameterscore;
   -- Expected: 0
   ```
3. ✅ **Export current parameter data** (for reference):
   ```bash
   python manage.py dumpdata health.healthparameter > health_parameters_backup.json
   ```

### Migration Steps:
```bash
# 1. Check current state
python manage.py showmigrations health

# 2. Create migration
python manage.py makemigrations health --name restructure_health_parameters

# 3. Review migration (DRY RUN)
python manage.py sqlmigrate health XXXX

# 4. Apply migration
python manage.py migrate health

# 5. Populate new structure
python manage.py populate_parameter_scores

# 6. Verify
python manage.py shell -c "
from apps.health.models import HealthParameter, ParameterScoreDefinition
print(f'Parameters: {HealthParameter.objects.count()}')
print(f'Definitions: {ParameterScoreDefinition.objects.count()}')
print(f'Expected: 9 parameters, 36 definitions')
"
```

### Rollback Plan:
If issues occur, rollback is simple since no user data exists:
```bash
# Rollback migration
python manage.py migrate health XXXX_previous_migration_name

# Re-apply if needed after fixing
python manage.py migrate health
```

---

## 📚 Reference Information

### Related Documentation:
- **Data Model:** `docs/database/data_model.md` section 4.4 (Health Monitoring)
- **PRD:** `docs/prd.md` section 3.1.4 (Health Monitoring requirements)
- **API Standards:** `docs/quality_assurance/api_standards.md`
- **Form Patterns:** `docs/deprecated/frontend_write_forms/H4.2_implementation_summary.md` (nested data)

### Similar Implementations:
- **Nested creation:** HealthSamplingEvent with IndividualFishObservations (already working)
- **Dynamic validation:** Scenario constraints (min/max weight per stage)
- **Reference data with sub-items:** FCR model with stage overrides
- **Permission-gated forms:** All existing health forms use WriteGate/DeleteGate

### Code Examples:
- **Dynamic dropdown:** See `FeedingEventForm.tsx` for cascading selects
- **Nested table form:** See `HealthSamplingEventForm.tsx` for useFieldArray pattern
- **Validation with min/max:** See `scenario` models StageConstraint.clean()
- **Nested serializers:** See `HealthSamplingEventSerializer` with observations

---

## 🎯 Success Metrics

### Backend Success:
- ✅ All health tests pass (120+ tests)
- ✅ OpenAPI schema validates (0 errors)
- ✅ Migration applied without errors
- ✅ 36 score definitions created
- ✅ Can create parameters with any score range

### Frontend Success:
- ✅ 0 TypeScript errors
- ✅ 0 linting errors
- ✅ All 6 tabs functional
- ✅ Parameter management working
- ✅ Health assessments working
- ✅ Score dropdowns dynamic

### User Experience:
- ✅ Veterinarians can configure their own parameters
- ✅ Clear distinction between measurements and assessments
- ✅ Score labels make sense ("Excellent" not "1")
- ✅ Validation prevents invalid scores
- ✅ Reference data well-organized

---

## 🔮 Future Enhancements (Post-Implementation)

### Phase 2 Improvements:
1. **Score color coding** - Add `color` field to ParameterScoreDefinition (green=good, red=bad)
2. **Parameter templates** - Pre-built parameter sets for common use cases
3. **Batch comparison** - Compare health scores across batches
4. **Trend analysis** - Track parameter scores over time
5. **Alert thresholds** - Notify when average score exceeds threshold
6. **Parameter grouping** - Group related parameters (External, Internal, Behavioral)

### Advanced Features:
1. **Weighted scoring** - Some parameters more important than others
2. **Composite health index** - Overall health score from all parameters
3. **ML prediction** - Predict health issues based on historical parameter trends
4. **Mobile optimization** - Tablet-optimized scoring interface for field vets
5. **Photo attachment** - Link photos to specific parameter scores
6. **Video scoring** - Score swimming behavior from video clips

---

## 📝 Notes for Implementation Agent

### Critical Success Factors:
1. **Follow the order** - Backend first, then frontend (schema must exist before types generate)
2. **Test incrementally** - After each phase, verify previous work still functions
3. **Prefetch score_definitions** - Always include in queries (avoid N+1)
4. **Dynamic validation** - Never hardcode score ranges in frontend
5. **Clear naming** - "Measurements" vs "Assessments" distinction must be obvious

### Common Pitfalls to Avoid:
- ❌ **Don't hardcode 0-3** in frontend - read from parameter.min_score/max_score
- ❌ **Don't create health_fishparameterscore without checking range** - use clean()
- ❌ **Don't forget to invalidate** "health-parameters" cache when score definitions change
- ❌ **Don't mix** growth measurements with health assessments in UI
- ❌ **Don't skip** the populate script - frontend depends on score definitions existing

### Quick Wins:
- ✅ Rename tabs FIRST - immediate UX clarity
- ✅ Use existing form patterns - don't reinvent
- ✅ Test with 0-3 range initially - don't try all ranges at once
- ✅ Start with read-only parameter view - CRUD can come after

### When Stuck:
- **Model issues?** Check django-simple-history documentation for nested models
- **Serializer issues?** See HealthSamplingEventSerializer for nested pattern
- **Form issues?** See HealthSamplingEventForm for dynamic field arrays
- **Validation issues?** Check scenario models for min/max validation examples

---

### **PHASE 6: Documentation & Test Data Generation**

#### Task 6.1: Update Data Model Documentation
**File:** `AquaMind/aquamind/docs/database/data_model.md`

**Section 4.4 - Health Monitoring Tables**

**Replace `health_healthparameter` definition with:**
```markdown
- **`health_healthparameter`**
  - `id`: bigint (PK, auto-increment)
  - `name`: varchar(100) (Unique, help_text="Name of the health parameter (e.g., Gill Condition)")
  - `description`: text (nullable, blank=True, help_text="General description of this health parameter")
  - `min_score`: integer (default=0, help_text="Minimum score value (inclusive)")
  - `max_score`: integer (default=3, help_text="Maximum score value (inclusive)")
  - `is_active`: boolean (default=True, help_text="Is this parameter currently in use?")
  - `created_at`: timestamptz (auto_now_add=True)
  - `updated_at`: timestamptz (auto_now=True)
  - Meta: `verbose_name_plural = "Health Parameters"`, `ordering = ['name']`
```

**Add new `health_parameterscoredefinition` definition:**
```markdown
- **`health_parameterscoredefinition`**
  - `id`: bigint (PK, auto-increment)
  - `parameter_id`: bigint (FK to `health_healthparameter`.id, on_delete=CASCADE, related_name='score_definitions')
  - `score_value`: integer (help_text="The numeric score value (e.g., 0, 1, 2, 3)")
  - `label`: varchar(50) (help_text="Short label for this score (e.g., 'Excellent', 'Good')")
  - `description`: text (help_text="Detailed description of what this score indicates")
  - `display_order`: integer (default=0, help_text="Order to display this score (for sorting)")
  - `created_at`: timestamptz (auto_now_add=True)
  - `updated_at`: timestamptz (auto_now=True)
  - Meta: `unique_together = [['parameter', 'score_value']]`, `ordering = ['parameter', 'display_order', 'score_value']`, `verbose_name = "Parameter Score Definition"`
```

**Update Relationships section:**
```markdown
#### Relationships
- `health_healthparameter` ← `health_parameterscoredefinition` (CASCADE, related_name='score_definitions')
- `health_healthparameter` ← `health_fishparameterscore` (PROTECT, related_name='fish_scores')
- `health_individualfishobservation` ← `health_fishparameterscore` (CASCADE, related_name='parameter_scores')
```

**Update Historical Tables section:**
Add:
```markdown
- **`health_historicalparameterscoredefinition`**
  - All fields from `health_parameterscoredefinition` plus history tracking fields
  - `history_id`: integer (PK, auto-increment)
  - `history_date`: timestamptz (timestamp of change)
  - `history_change_reason`: varchar (optional reason for change, nullable)
  - `history_type`: varchar (+, ~, - for create/update/delete)
  - `history_user_id`: integer (FK to user who made change, nullable)
```

**Important:** Remove ALL references to `description_score_1` through `description_score_5`. This is a greenfield project - document the current state only.

---

#### Task 6.2: Update PRD Documentation
**File:** `AquaMind/aquamind/docs/prd.md`

**Section 3.1.4 - Health Monitoring**

**Update the health parameter scoring description:**

Find and replace the entire "Common Health Parameters" subsection with:

```markdown
  - **Health Parameter Scoring System**:
    - The system supports flexible health parameter assessment with configurable score ranges.
    - Health parameters are defined in `health_healthparameter` with customizable min/max score values (default 0-3).
    - Each parameter has multiple score definitions (`health_parameterscoredefinition`) that define what each numeric score means.
    - Current standard uses 0-3 scale:
      - 0: Excellent (no issues)
      - 1: Good (minor issues)
      - 2: Fair (moderate issues)
      - 3: Poor (severe issues)
    - Veterinarians can configure new parameters with different score ranges (e.g., 1-5, 0-10) as needed.
    
  - **Standard Health Parameters** (9 default parameters, each with 0-3 scoring):
    - **Gill Condition**: Evaluates gill health and respiratory function
      - 0: Healthy gills, pink color
      - 1: Slight mucus buildup
      - 2: Moderate inflammation
      - 3: Severe inflammation
    - **Eye Condition**: Evaluates eye clarity and damage
      - 0: Clear, bright eyes
      - 1: Slight cloudiness
      - 2: Moderate cloudiness
      - 3: Severe cloudiness/damage
    - **Wounds/Lesions**: Measures skin lesions and severity
      - 0: No wounds
      - 1: Minor abrasions
      - 2: Moderate wounds
      - 3: Severe wounds/ulcers
    - **Fin Condition**: Assesses fin integrity and erosion
      - 0: Intact, healthy fins
      - 1: Minor fraying
      - 2: Moderate erosion
      - 3: Severe erosion
    - **Body Condition**: Evaluates overall physical shape and deformities
      - 0: Robust, well-formed
      - 1: Slight deformities
      - 2: Moderate deformities
      - 3: Severe deformities
    - **Swimming Behavior**: Monitors activity levels and movement patterns
      - 0: Active, normal swimming
      - 1: Slightly lethargic
      - 2: Moderately lethargic
      - 3: Severely impaired
    - **Appetite**: Assesses feeding response
      - 0: Excellent feeding response
      - 1: Good appetite
      - 2: Reduced appetite
      - 3: Poor appetite
    - **Mucous Membrane**: Evaluates mucus layer on skin
      - 0: Normal mucus layer
      - 1: Slight excess mucus
      - 2: Moderate excess mucus
      - 3: Heavy excess mucus
    - **Color/Pigmentation**: Monitors pigmentation and color abnormalities
      - 0: Normal coloration
      - 1: Slight color changes
      - 2: Moderate discoloration
      - 3: Severe discoloration
```

**Important:** Use present tense only. Remove any historical context like "was changed from 1-5" or "veterinarians decided". Document the system as it is, not how it evolved.

---

#### Task 6.3: Update Test Data Generation Scripts
**Files to update:** `scripts/data_generation/`

**Identify scripts that need updates:**
```bash
cd /Users/aquarian247/Projects/AquaMind/scripts/data_generation
grep -r "FishParameterScore\|HealthParameter" *.py
```

**Expected files:**
- Likely: `generate_health_data.py` or similar
- Possibly: `simulate_full_lifecycle.py` if it includes health sampling

---

#### Task 6.3.1: Update Health Data Generation Script
**File:** `scripts/data_generation/generate_health_data.py` (or equivalent)

**Current issue:** Scripts likely reference old 1-5 scale or hardcoded parameter IDs

**Required changes:**

1. **Fetch parameters dynamically:**
```python
from apps.health.models import HealthParameter, ParameterScoreDefinition

# Get all active parameters
parameters = HealthParameter.objects.filter(is_active=True).prefetch_related('score_definitions')

# Create mapping for easy access
parameter_map = {p.name: p for p in parameters}
```

2. **Generate scores within valid ranges:**
```python
def generate_parameter_scores(individual_observation, parameters):
    """Generate realistic parameter scores for a fish observation."""
    from random import randint, choices
    
    for param in parameters:
        # Weight scores toward better health (0-1 more common than 2-3)
        # 60% excellent (0), 25% good (1), 10% fair (2), 5% poor (3)
        weights = [0.60, 0.25, 0.10, 0.05]
        
        # Ensure weights match actual score range
        available_scores = range(param.min_score, param.max_score + 1)
        if len(available_scores) < len(weights):
            weights = weights[:len(available_scores)]
        elif len(available_scores) > len(weights):
            # Pad with small probabilities
            weights.extend([0.01] * (len(available_scores) - len(weights)))
        
        # Normalize weights
        total = sum(weights)
        weights = [w/total for w in weights]
        
        # Select score
        score_value = choices(available_scores, weights=weights)[0]
        
        FishParameterScore.objects.create(
            individual_fish_observation=individual_observation,
            parameter=param,
            score=score_value
        )
```

3. **Generate realistic test scenarios:**
```python
# Example: Healthy batch - most fish score 0-1
def generate_healthy_batch_assessment(assignment):
    event = HealthSamplingEvent.objects.create(
        assignment=assignment,
        sampling_date=timezone.now().date(),
        number_of_fish_sampled=10
    )
    
    parameters = HealthParameter.objects.filter(is_active=True)
    
    for i in range(1, 11):
        observation = IndividualFishObservation.objects.create(
            sampling_event=event,
            fish_identifier=str(i),
            weight_g=Decimal(random.uniform(200, 300)),
            length_cm=Decimal(random.uniform(20, 25))
        )
        
        # Healthy fish: 80% score 0, 20% score 1
        for param in parameters:
            score = random.choices([0, 1], weights=[0.8, 0.2])[0]
            FishParameterScore.objects.create(
                individual_fish_observation=observation,
                parameter=param,
                score=score
            )
    
    event.calculate_aggregate_metrics()
    return event

# Example: Stressed batch - higher scores
def generate_stressed_batch_assessment(assignment):
    # Similar but with weights=[0.2, 0.3, 0.3, 0.2] for scores [0,1,2,3]
    pass
```

4. **Generate diverse assessment scenarios:**
```python
def populate_health_assessments():
    """Generate realistic health assessment test data."""
    
    # Get active batch assignments
    assignments = BatchContainerAssignment.objects.filter(
        is_active=True
    ).select_related('batch', 'container')[:20]  # Sample 20 assignments
    
    parameters = list(HealthParameter.objects.filter(is_active=True))
    
    for assignment in assignments:
        # Determine batch health status based on lifecycle stage
        stage = assignment.lifecycle_stage.name
        
        if stage in ['Egg&Alevin', 'Fry']:
            # Early stages: generally healthy
            assessment = generate_healthy_batch_assessment(assignment, parameters)
        elif stage in ['Parr', 'Smolt']:
            # Growing stages: mostly healthy with some variation
            assessment = generate_moderate_batch_assessment(assignment, parameters)
        elif stage in ['Post-Smolt', 'Adult']:
            # Later stages: more variation, some stress
            assessment = generate_varied_batch_assessment(assignment, parameters)
        
        print(f"✓ Created assessment for {assignment.batch.batch_number} in {assignment.container.name}")
```

**Full script structure:**
```python
#!/usr/bin/env python
"""
Generate realistic health assessment test data.

This script creates HealthSamplingEvent records with IndividualFishObservation
and FishParameterScore data using the new normalized parameter scoring system.

Usage:
    python manage.py shell < scripts/data_generation/generate_health_assessments.py
    
    Or as management command:
    python manage.py generate_health_assessments --count=50
"""

import os
import sys
import django
from decimal import Decimal
from random import randint, uniform, choices, random
from datetime import timedelta

# Django setup
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aquamind.settings')
django.setup()

from django.utils import timezone
from apps.health.models import (
    HealthParameter, ParameterScoreDefinition,
    HealthSamplingEvent, IndividualFishObservation, FishParameterScore
)
from apps.batch.models import BatchContainerAssignment

def generate_parameter_scores_for_fish(observation, parameters, health_profile='healthy'):
    """
    Generate parameter scores based on health profile.
    
    Args:
        observation: IndividualFishObservation instance
        parameters: List of HealthParameter objects
        health_profile: 'healthy', 'moderate', 'stressed', or 'critical'
    """
    # Define score distribution weights for each profile
    profiles = {
        'healthy':   [0.70, 0.25, 0.04, 0.01],  # Mostly 0s and 1s
        'moderate':  [0.40, 0.40, 0.15, 0.05],  # Balanced across 0-2
        'stressed':  [0.10, 0.30, 0.40, 0.20],  # Higher scores more common
        'critical':  [0.05, 0.10, 0.30, 0.55],  # Mostly 2s and 3s
    }
    
    weights = profiles.get(health_profile, profiles['healthy'])
    
    for param in parameters:
        # Get valid score range for this parameter
        score_range = list(range(param.min_score, param.max_score + 1))
        
        # Adjust weights if parameter has different range
        param_weights = weights[:len(score_range)]
        if len(param_weights) < len(score_range):
            param_weights.extend([0.01] * (len(score_range) - len(param_weights)))
        
        # Normalize weights
        total = sum(param_weights)
        param_weights = [w/total for w in param_weights]
        
        # Select score
        score_value = choices(score_range, weights=param_weights)[0]
        
        FishParameterScore.objects.create(
            individual_fish_observation=observation,
            parameter=param,
            score=score_value
        )

def generate_assessment_event(assignment, num_fish=10, health_profile='healthy', include_biometrics=False):
    """
    Generate a complete health assessment event.
    
    Args:
        assignment: BatchContainerAssignment instance
        num_fish: Number of fish to assess
        health_profile: Overall health status
        include_biometrics: Whether to include weight/length measurements
    """
    # Create sampling event
    event = HealthSamplingEvent.objects.create(
        assignment=assignment,
        sampling_date=timezone.now().date() - timedelta(days=randint(0, 30)),
        number_of_fish_sampled=num_fish,
        notes=f"Veterinary health assessment - {health_profile} batch"
    )
    
    # Get all active parameters
    parameters = list(HealthParameter.objects.filter(is_active=True))
    
    # Generate individual fish observations
    for i in range(1, num_fish + 1):
        observation = IndividualFishObservation.objects.create(
            sampling_event=event,
            fish_identifier=str(i),
            weight_g=Decimal(uniform(150, 350)) if include_biometrics else None,
            length_cm=Decimal(uniform(18, 28)) if include_biometrics else None
        )
        
        # Generate parameter scores
        generate_parameter_scores_for_fish(observation, parameters, health_profile)
    
    # Calculate aggregates if biometrics included
    if include_biometrics:
        event.calculate_aggregate_metrics()
    
    return event

def main():
    """Main test data generation function."""
    
    print("🔍 Fetching active batch assignments...")
    assignments = BatchContainerAssignment.objects.filter(
        is_active=True
    ).select_related(
        'batch', 'container', 'lifecycle_stage'
    ).order_by('-assignment_date')[:30]  # Get 30 most recent assignments
    
    print(f"📊 Found {len(assignments)} active assignments")
    
    print("\n🏥 Generating health assessments...")
    
    # Verify parameters exist
    param_count = HealthParameter.objects.filter(is_active=True).count()
    if param_count == 0:
        print("❌ ERROR: No health parameters found!")
        print("   Run: python manage.py populate_parameter_scores")
        return
    
    print(f"✓ Found {param_count} active health parameters")
    
    # Generate diverse assessments
    profiles = ['healthy', 'healthy', 'healthy', 'moderate', 'stressed']  # 60% healthy
    
    created_count = 0
    for idx, assignment in enumerate(assignments):
        # Select health profile (weighted toward healthy)
        profile = choices(profiles, weights=[0.50, 0.20, 0.10, 0.15, 0.05])[0]
        
        # Vary number of fish sampled
        num_fish = choices([5, 10, 15, 20], weights=[0.1, 0.6, 0.2, 0.1])[0]
        
        # 30% of assessments include biometrics (combined measurement + assessment)
        include_biometrics = random() < 0.3
        
        try:
            event = generate_assessment_event(
                assignment=assignment,
                num_fish=num_fish,
                health_profile=profile,
                include_biometrics=include_biometrics
            )
            
            created_count += 1
            print(f"  ✓ {assignment.batch.batch_number} in {assignment.container.name}: "
                  f"{num_fish} fish, {profile} profile"
                  f"{' (with biometrics)' if include_biometrics else ''}")
        
        except Exception as e:
            print(f"  ❌ Failed for {assignment.batch.batch_number}: {e}")
    
    print(f"\n✅ Created {created_count} health assessment events")
    
    # Summary statistics
    total_observations = IndividualFishObservation.objects.count()
    total_scores = FishParameterScore.objects.count()
    
    print(f"\n📈 Summary:")
    print(f"   • Health sampling events: {created_count}")
    print(f"   • Individual fish observations: {total_observations}")
    print(f"   • Parameter scores recorded: {total_scores}")
    print(f"   • Avg scores per fish: {total_scores / total_observations if total_observations > 0 else 0:.1f}")

if __name__ == "__main__":
    main()
```

**Save as:** `scripts/data_generation/generate_health_assessments.py`

**Usage:**
```bash
# Method 1: Direct execution
cd /Users/aquarian247/Projects/AquaMind
python scripts/data_generation/generate_health_assessments.py

# Method 2: Via management command (create wrapper)
python manage.py generate_health_assessments --count=30
```

---

#### Task 6.3.2: Create Management Command Wrapper
**File:** `apps/health/management/commands/generate_health_assessments.py`

```python
from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
from random import randint, uniform, choices, random

from apps.health.models import (
    HealthParameter, HealthSamplingEvent, 
    IndividualFishObservation, FishParameterScore
)
from apps.batch.models import BatchContainerAssignment


class Command(BaseCommand):
    help = 'Generate realistic health assessment test data with parameter scoring'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=30,
            help='Number of assessment events to create (default: 30)'
        )
        parser.add_argument(
            '--fish-per-event',
            type=int,
            default=10,
            help='Average number of fish per assessment event (default: 10)'
        )
        parser.add_argument(
            '--include-biometrics',
            action='store_true',
            help='Include weight/length measurements in 30% of assessments'
        )
    
    def handle(self, *args, **options):
        count = options['count']
        avg_fish = options['fish_per_event']
        include_biometrics_flag = options['include_biometrics']
        
        self.stdout.write("🔍 Fetching active batch assignments...")
        
        assignments = list(
            BatchContainerAssignment.objects.filter(
                is_active=True
            ).select_related('batch', 'container', 'lifecycle_stage')
            .order_by('-assignment_date')[:count]
        )
        
        if not assignments:
            self.stdout.write(self.style.ERROR('❌ No active batch assignments found'))
            return
        
        self.stdout.write(f"✓ Found {len(assignments)} assignments")
        
        # Verify parameters exist
        parameters = list(HealthParameter.objects.filter(is_active=True))
        if not parameters:
            self.stdout.write(self.style.ERROR(
                '❌ No health parameters found. Run: python manage.py populate_parameter_scores'
            ))
            return
        
        self.stdout.write(f"✓ Found {len(parameters)} active health parameters")
        
        self.stdout.write(f"\n🏥 Generating {len(assignments)} health assessments...\n")
        
        # Generate assessments
        created_count = 0
        total_fish = 0
        total_scores = 0
        
        for assignment in assignments:
            num_fish = randint(avg_fish - 5, avg_fish + 5)
            num_fish = max(5, num_fish)  # Minimum 5 fish
            
            # Weighted health profiles (most batches healthy)
            profile = choices(
                ['healthy', 'moderate', 'stressed'],
                weights=[0.70, 0.20, 0.10]
            )[0]
            
            # Maybe include biometrics
            include_bio = random() < 0.3 if include_biometrics_flag else False
            
            try:
                event = self._generate_event(
                    assignment, num_fish, parameters, profile, include_bio
                )
                
                created_count += 1
                total_fish += num_fish
                total_scores += num_fish * len(parameters)
                
                self.stdout.write(
                    f"  ✓ {assignment.batch.batch_number} / {assignment.container.name}: "
                    f"{num_fish} fish, {profile}"
                )
            
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f"  ❌ {assignment.batch.batch_number}: {e}"
                ))
        
        # Summary
        self.stdout.write(self.style.SUCCESS(f"\n✅ Complete!"))
        self.stdout.write(f"   • Events created: {created_count}")
        self.stdout.write(f"   • Fish assessed: {total_fish}")
        self.stdout.write(f"   • Parameter scores: {total_scores}")
    
    def _generate_event(self, assignment, num_fish, parameters, profile, include_bio):
        """Generate a single assessment event."""
        from datetime import timedelta
        
        # Create event
        days_ago = randint(1, 60)
        event = HealthSamplingEvent.objects.create(
            assignment=assignment,
            sampling_date=timezone.now().date() - timedelta(days=days_ago),
            number_of_fish_sampled=num_fish,
            notes=f"Veterinary assessment - {profile} batch"
        )
        
        # Score weights by profile
        weights_map = {
            'healthy':  [0.70, 0.25, 0.04, 0.01],
            'moderate': [0.40, 0.40, 0.15, 0.05],
            'stressed': [0.10, 0.30, 0.40, 0.20],
        }
        base_weights = weights_map[profile]
        
        # Generate fish observations
        for i in range(1, num_fish + 1):
            obs = IndividualFishObservation.objects.create(
                sampling_event=event,
                fish_identifier=str(i),
                weight_g=Decimal(uniform(150, 400)) if include_bio else None,
                length_cm=Decimal(uniform(18, 32)) if include_bio else None
            )
            
            # Score each parameter
            for param in parameters:
                score_range = list(range(param.min_score, param.max_score + 1))
                param_weights = base_weights[:len(score_range)]
                
                # Normalize
                total = sum(param_weights)
                param_weights = [w/total for w in param_weights]
                
                score = choices(score_range, weights=param_weights)[0]
                
                FishParameterScore.objects.create(
                    individual_fish_observation=obs,
                    parameter=param,
                    score=score
                )
        
        # Calculate aggregates if biometrics present
        if include_bio:
            event.calculate_aggregate_metrics()
        
        return event
```

**Save as:** `apps/health/management/commands/generate_health_assessments.py`

---

#### Task 6.3.3: Update Main Test Data Script
**File:** `scripts/data_generation/init_test_data.py` (or main generation script)

**Add health assessment generation step:**
```python
def generate_all_test_data():
    """Generate complete test data set."""
    
    # ... existing steps (infrastructure, batches, etc.)
    
    # Health data generation
    print("\n" + "="*50)
    print("HEALTH DATA GENERATION")
    print("="*50)
    
    # 1. Ensure health parameters exist
    from apps.health.models import HealthParameter
    param_count = HealthParameter.objects.count()
    
    if param_count == 0:
        print("📋 No health parameters found - creating standard set...")
        from django.core.management import call_command
        call_command('populate_parameter_scores')
        print(f"✓ Created {HealthParameter.objects.count()} parameters with score definitions")
    else:
        print(f"✓ Using existing {param_count} health parameters")
    
    # 2. Generate journal entries (existing logic)
    print("\n📝 Generating journal entries...")
    # ... existing code
    
    # 3. Generate health assessments (NEW)
    print("\n🏥 Generating veterinary health assessments...")
    from django.core.management import call_command
    call_command('generate_health_assessments', count=40, include_biometrics=True)
    
    # 4. Generate lab samples (existing logic if any)
    # ... existing code
```

---

#### Task 6.4: Update Test Data README
**File:** `scripts/data_generation/README.md` (or create if doesn't exist)

**Add section:**
```markdown
## Health Assessment Data Generation

### Overview
Health assessment test data uses the normalized parameter scoring system with configurable score ranges.

### Prerequisites
1. Health parameters must exist (run `populate_parameter_scores` first)
2. Active batch assignments must exist
3. Django admin user must exist (for user attribution)

### Generation Scripts

#### 1. Populate Health Parameters (Required First)
```bash
python manage.py populate_parameter_scores
```
**Creates:**
- 9 standard health parameters (Gill, Eye, Wounds, Fin, Body, Swimming, Appetite, Mucous, Color)
- 36 score definitions (4 per parameter, 0-3 scale)

#### 2. Generate Health Assessments
```bash
# Generate 40 assessment events
python manage.py generate_health_assessments --count=40

# With biometric data included
python manage.py generate_health_assessments --count=40 --include-biometrics

# Fewer fish per event
python manage.py generate_health_assessments --count=50 --fish-per-event=5
```

**Creates:**
- HealthSamplingEvent records (linked to batch assignments)
- IndividualFishObservation records (fish being assessed)
- FishParameterScore records (scores for each parameter per fish)
- Realistic distribution: 70% healthy, 20% moderate, 10% stressed

### Data Characteristics

**Health Profiles:**
- **Healthy (70%):** Scores mostly 0-1 (excellent to good)
- **Moderate (20%):** Scores distributed 0-2 (some fair conditions)
- **Stressed (10%):** Scores skewed toward 2-3 (fair to poor)

**Fish Sample Sizes:**
- Typical: 10 fish per assessment
- Range: 5-20 fish (varied for realism)
- Distribution: 60% use 10 fish, 20% use 15, 10% use 5, 10% use 20

**Biometric Inclusion:**
- 30% of assessments include weight/length measurements
- 70% are pure health assessments (vet-only, no biometrics)
- This reflects real workflow: operators measure growth, vets assess health

### Validation

After generation, verify data integrity:
```bash
python manage.py shell -c "
from apps.health.models import HealthSamplingEvent, IndividualFishObservation, FishParameterScore
events = HealthSamplingEvent.objects.count()
fish = IndividualFishObservation.objects.count()
scores = FishParameterScore.objects.count()
params = 9  # Standard parameter count

print(f'Events: {events}')
print(f'Fish observed: {fish}')
print(f'Parameter scores: {scores}')
print(f'Expected scores: {fish * params}')
print(f'Match: {scores == fish * params}')
"
```

**Expected output:**
```
Events: 40
Fish observed: 400 (40 events × avg 10 fish)
Parameter scores: 3,600 (400 fish × 9 parameters)
Expected scores: 3,600
Match: True ✓
```
```

---

#### Task 6.5: Document Completed Migration
**File:** `docs/progress/health_parameter_migration_complete.md`

Create completion documentation:
```markdown
# Health Parameter Scoring System Migration - Complete

**Date Completed:** [Date]  
**Status:** ✅ **COMPLETE**  
**Migration:** Full normalization from hardcoded 1-5 to flexible 0-N scoring

---

## Summary

Successfully migrated health parameter scoring system from inflexible hardcoded schema to fully normalized, flexible architecture supporting any score range.

### What Changed:
- ✅ New `ParameterScoreDefinition` table for flexible score descriptions
- ✅ Added `min_score`, `max_score` to HealthParameter model
- ✅ Removed hardcoded 1-5 validators from FishParameterScore
- ✅ Migrated 9 parameters from 1-5 scale to 0-3 scale
- ✅ Created 36 score definitions (9 parameters × 4 scores)
- ✅ Updated all serializers, viewsets, admin interfaces
- ✅ Created frontend forms for parameter management
- ✅ Added "Health Assessments" tab for veterinary scoring
- ✅ Renamed "Sampling" to "Measurements" for clarity
- ✅ Updated test data generation scripts

### Data Migration Results:
- Parameters migrated: 9
- Score definitions created: 36
- Test assessments generated: [N]
- Fish observations: [N]
- Parameter scores: [N]
- Data loss: 0 (health_fishparameterscore was empty)

### Current Configuration:
All parameters use 0-3 scale (4 levels):
- Score 0: Excellent (no issues)
- Score 1: Good (minor issues)
- Score 2: Fair (moderate issues)  
- Score 3: Poor (severe issues)

### Performance Impact:
- No performance degradation
- Prefetch queries optimized
- Frontend caches parameter definitions
- Score validation at model level (clean())

---

## Files Modified

[List will be populated during implementation]

---

## Testing Performed

[Checklist will be completed during implementation]

---

## Future Flexibility

System now supports:
- Custom score ranges per parameter (0-10, 1-5, etc.)
- Dynamic score labels and descriptions
- Easy addition of new parameters
- No code changes needed for scale adjustments
```

---

## ✅ Definition of Done

### This task is complete when:
1. ✅ All 9 parameters migrated to 0-3 scale
2. ✅ 36 score definitions created and queryable
3. ✅ Veterinarians can create new parameters via frontend
4. ✅ Veterinarians can configure score definitions via frontend
5. ✅ Health assessments can be entered with parameter scoring
6. ✅ Growth measurements clearly separate from health assessments
7. ✅ All tests passing (backend + frontend)
8. ✅ **Documentation updated** (data_model.md + prd.md - greenfield style, no historical references)
9. ✅ **Test data generation scripts updated** (generate_health_assessments.py working)
10. ✅ No TypeScript/linting errors
11. ✅ Code reviewed and approved

### NOT required for "done":
- ⏸️ Advanced features (color coding, templates, trends)
- ⏸️ Mobile optimization (can come later)
- ⏸️ Photo/video integration (Phase 3 feature)
- ⏸️ ML predictions (Phase 3 feature)
- ⏸️ Removal of description_score_1-5 (cleanup migration deferred to Phase 5, Task 5.1)

---

## 📚 Quick Start Guide for Implementation Agent

### Step-by-Step Execution:

**1. Backend Setup (Phases 1-4):**
```bash
cd /Users/aquarian247/Projects/AquaMind

# Create models and migration
# (Follow Phase 1, Tasks 1.1-1.2)

# Apply migration
python manage.py migrate health

# Populate parameters and score definitions
python manage.py populate_parameter_scores

# Verify
python manage.py shell -c "from apps.health.models import HealthParameter, ParameterScoreDefinition; print(f'Params: {HealthParameter.objects.count()}, Defs: {ParameterScoreDefinition.objects.count()}')"
# Expected: Params: 9, Defs: 36

# Update serializers, viewsets, admin (Phase 1, Tasks 1.4-1.7)

# Run tests
python manage.py test apps.health --settings=aquamind.settings_ci

# Regenerate OpenAPI
python manage.py spectacular --file api/openapi.yaml --validate --settings=aquamind.settings_ci
```

**2. Frontend Setup (Phases 2-3):**
```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend

# Sync OpenAPI
cp /Users/aquarian247/Projects/AquaMind/api/openapi.yaml api/openapi.yaml
cp api/openapi.yaml tmp/openapi/openapi.yaml
npm run generate:api

# Verify types generated
ls -la client/src/api/generated/models/ParameterScoreDefinition.ts

# Add hooks (Phase 2, Task 2.2)
# Create forms (Phase 3, Tasks 3.1-3.5)

# Type check
npm run type-check
```

**3. Test Data Generation (Phase 6):**
```bash
cd /Users/aquarian247/Projects/AquaMind

# Generate health assessments
python manage.py generate_health_assessments --count=40 --include-biometrics

# Verify data
python manage.py shell -c "from apps.health.models import HealthSamplingEvent, FishParameterScore; print(f'Events: {HealthSamplingEvent.objects.count()}, Scores: {FishParameterScore.objects.count()}')"
```

**4. Documentation (Phase 6):**
- Update `docs/database/data_model.md` (remove all description_score_1-5 references)
- Update `docs/prd.md` (present tense only, no "was changed" language)
- Create `docs/progress/health_parameter_migration_complete.md`

**5. Final Verification:**
```bash
# Backend
cd /Users/aquarian247/Projects/AquaMind
python manage.py test apps.health
python manage.py check

# Frontend  
cd /Users/aquarian247/Projects/AquaMind-Frontend
npm run type-check
npm run lint

# Browser test
# Navigate to http://localhost:5001/health
# Test all tabs, create parameter, create assessment
```

---

## 🎯 Critical Reminders

### For Backend Agent:
1. **No JSON fields** - Use full normalization with ParameterScoreDefinition table
2. **Dynamic validation** - Use clean() methods, not hardcoded validators
3. **Prefetch score_definitions** - Always include in queries
4. **Historical tracking** - Both models use HistoricalRecords()
5. **Greenfield docs** - Remove all "changed from" language

### For Frontend Agent:
1. **Read min/max from API** - Never hardcode score ranges
2. **Rename tabs clearly** - Measurements vs Assessments distinction
3. **Separate workflows** - Different forms for operators vs veterinarians
4. **Dynamic dropdowns** - Render scores based on parameter.score_definitions
5. **Permission gates** - Veterinarian+ for parameter management

### For Test Data Agent:
1. **Parameters first** - Must run populate_parameter_scores before assessments
2. **Dynamic score generation** - Read param.min_score/max_score, don't hardcode
3. **Realistic distributions** - 70% healthy, 20% moderate, 10% stressed
4. **Varied sample sizes** - 5-20 fish per event
5. **Biometric mixing** - 30% with weight/length, 70% health-only

---

**Last Updated:** October 30, 2025  
**Created By:** AI Assistant (Cursor)  
**For:** Health parameter scoring system redesign  
**Status:** 📋 **READY FOR IMPLEMENTATION**  
**Phases:** 6 phases (Backend → Frontend → Testing → Cleanup → Documentation → Test Data)  
**Complexity:** Medium-High  
**Estimated LOC:** ~1,800 lines (backend + frontend + tests + scripts)  
**No Shortcuts:** Full normalization, no JSON fields, clean greenfield documentation


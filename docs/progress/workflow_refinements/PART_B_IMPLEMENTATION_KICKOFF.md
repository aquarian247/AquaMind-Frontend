# Part B Implementation Kickoff - Batch Creation Workflow

**Session Goal**: Implement timeline-aware container selection and batch creation workflow architecture  
**Estimated Duration**: 12 days (7 phases)  
**Status**: Ready to Begin  
**Previous Session**: Part A (immediate fixes) completed and deployed

---

## Context: What Has Been Done

### Part A: Immediate Fixes ✅ COMPLETED (Nov 11, 2025)

**Frontend Changes**:
1. ✅ Removed redundant Step 3 from `CreateWorkflowWizard` (3-step → 2-step)
2. ✅ Fixed React controlled/uncontrolled Select warnings (`?? ""` pattern)
3. ✅ Made workflow cancellation reason mandatory with validation
4. ✅ Removed `PARTIAL_HARVEST` workflow type from UI

**Backend Changes**:
1. ✅ Removed `PARTIAL_HARVEST` from `BatchTransferWorkflow.WORKFLOW_TYPE_CHOICES`
2. ✅ Created migration `0028_remove_partial_harvest_workflow_type.py` with safety checks
3. ✅ Applied all pending migrations (including scenario app migrations)

**Git Status**:
- Both repos on `main` branch
- All changes committed and pushed
- Clean working tree
- No unapplied migrations

**Test Results**: 
- Workflow creation now smooth (2 steps)
- No console warnings
- Cancellation validation working

---

## Your Mission: Implement Part B - Batch Creation & Container Enhancements

### High-Level Goals

1. **Enhance Container Selection** (applies to BOTH transfer and creation workflows)
   - Add timeline-aware availability forecasting
   - Show occupied containers with "will be empty by X date" intelligence
   - Prevent mixed batch creation with timing validation
   - Rich visual labels with occupancy context

2. **Implement Batch Creation Workflow** (new parallel architecture)
   - Separate `BatchCreationWorkflow` model (not extending `BatchTransferWorkflow`)
   - `CreationAction` model for egg delivery tracking
   - 3-step wizard for workflow creation
   - Execute delivery actions (mobile-friendly)
   - Finance integration (internal vs external eggs)
   - Broodstock linkage (compliance traceability)

---

## Critical Documents - Read These First

### 1. **@WORKFLOW_ARCHITECTURE_REFINEMENT_PLAN.md** (THIS REPO - 2,353 lines)
**Location**: `AquaMind-Frontend/docs/progress/workflow_refinements/WORKFLOW_ARCHITECTURE_REFINEMENT_PLAN.md`

**Key Sections**:
- **Part A**: Completed (reference only)
- **Part B: Batch Creation Workflow** (lines 56-450) - YOUR IMPLEMENTATION GUIDE
- **Container Selection Improvements** (lines 451-750) - CRITICAL UX ENHANCEMENT
- **Data Model Specifications** (lines 100-450) - Complete model code
- **API Specification** (lines 800-1000) - Request/response examples
- **Implementation Timeline** (lines 1200-1400) - 7-phase breakdown

**Read Priority**: HIGH - This is your complete specification

---

### 2. **@data_model.md** (BACKEND REPO)
**Location**: `AquaMind/aquamind/docs/database/data_model.md`

**Key Sections**:
- Section 4.2: Batch Management models (lines 266-447)
- Section 4.6: Finance Management (lines 906-1062)
- Section 4.8: Broodstock Management (lines 1174-1297)
- Table: `batch_batchcontainerassignment` (lines 297-311) - CRITICAL for understanding assignments
- Table: `broodstock_batchparentage` (lines 1268-1274) - Egg linkage

**Context**: Understand existing data relationships before adding new models

---

### 3. **@prd.md** (BACKEND REPO)
**Location**: `AquaMind/aquamind/docs/prd.md`

**Key Sections**:
- Section 3.1.2: Batch Management (lines 66-104)
- Section 3.1.2.1: Transfer Workflow Architecture (lines 105-143) - EXISTING PATTERN
- Section 3.1.8: Broodstock Management (lines 546-704) - Egg production tracking

**Context**: Product requirements and business logic rationale

---

### 4. **@TRANSFER_WORKFLOW_FINANCE_GUIDE.md** (BACKEND REPO)
**Location**: `AquaMind/aquamind/docs/user_guides/TRANSFER_WORKFLOW_FINANCE_GUIDE.md`

**Key Sections**:
- Finance integration patterns (lines 35-68)
- IntercompanyPolicy usage (lines 332-353)
- Transaction creation flow (lines 164-228)

**Context**: Understand proven finance integration pattern to replicate for batch creation

---

### 5. **@personas.md** (BACKEND REPO)
**Location**: `AquaMind/aquamind/docs/personas.md`

**Key Sections**:
- Oversight Manager of All Freshwater Stations (lines 746-872) - PRIMARY USER
- Freshwater Station Operator (lines 874-1004) - EXECUTION USER

**Context**: Understand who will use this feature and their needs

---

## Critical Design Decisions Already Made

### Decision 1: Parallel Architecture (Not Extending Transfer)

**Rationale**: Batch creation and transfer are semantically different
- Creation: Batch doesn't exist yet OR exists in PLANNED status
- Transfer: Batch must exist and be ACTIVE
- Creation: No source container (eggs from external)
- Transfer: Both source and destination containers

**Implementation**: Create new models, don't extend existing ones

---

### Decision 2: Timeline-Aware Container Selection

**Core Innovation**: When planning actions weeks/months ahead, show:
- ✅ **Empty containers** (immediately available)
- ✅ **Occupied containers** with "available from DATE" (will be empty in time)
- ⚠️ **Conflicting containers** (still occupied at execution date - disabled)

**Algorithm**:
```
For each container:
  1. Get active assignments
  2. Calculate expected_departure_date (assignment_date + lifecycle_stage.typical_duration_days)
  3. Compare with action's expected_execution_date
  4. If execution_date > expected_departure: AVAILABLE ✅
  5. If execution_date ≤ expected_departure: CONFLICT ⚠️ (disable)
```

**Applies To**:
- Transfer workflows (enhance existing `AddActionsDialog`)
- Batch creation workflows (new `AddCreationActionsDialog`)

---

### Decision 3: Finance Integration (Reuse Existing `finance` App)

**NO DEPENDENCY on `finance_core` app** (still in planning)

**Use Existing Models**:
- `finance.DimCompany` (legal entities)
- `finance.IntercompanyPolicy` (pricing rules)
- `finance.IntercompanyTransaction` (actual transactions)

**New Pricing Basis for Eggs**:
```python
IntercompanyPolicy.PricingBasis.choices += [
    ('EGG_DELIVERY', 'Egg Delivery (Creation)')
]

# New field:
price_per_thousand_eggs = DecimalField(...)
```

**Transaction Flow**:
- Internal eggs: Auto-create transaction on workflow completion (like Post-Smolt → Adult)
- External eggs: Store cost on workflow, export manually to NAV (until finance_core ready)

---

### Decision 4: Batch Creation Timing

**When is Batch created?** 
- ✅ **When workflow is created** (not when first action executes)
- Initial status: `PLANNED`
- Allows actions to reference batch.id
- Allows broodstock_batchparentage linkage immediately

**Status Transitions**:
```
PLANNED (workflow created, batch exists, no eggs yet)
  ↓ First action executed
RECEIVING (eggs arriving, partial delivery)
  ↓ All actions completed
ACTIVE (all eggs received, normal operations)

OR

PLANNED → CANCELLED (if workflow cancelled BEFORE any actions executed)
```

---

### Decision 5: Cancellation Logic

**Rule**: Can only cancel if NO actions have been executed

**Rationale**: Once eggs physically arrive in containers, they must be managed (feed, monitor, or destroy if diseased). Cancelling a workflow doesn't make physical eggs disappear!

**Implementation**:
```python
def can_cancel(self):
    return self.status in ['DRAFT', 'PLANNED'] and self.actions_completed == 0

def cancel(self, reason):
    if not self.can_cancel():
        raise ValidationError(
            "Cannot cancel workflow - eggs already delivered to containers"
        )
    self.status = 'CANCELLED'
    self.batch.status = 'CANCELLED'
    # Keep broodstock_batchparentage for audit trail
```

---

### Decision 6: Bakkafrost Lifecycle Stages

**Important**: Bakkafrost combines Egg and Alevin into one ~90-day stage

**Lifecycle Stages**:
- Egg/Alevin: ~90 days (incubation trays, alevin gradually moved to fry tanks)
- Fry: 90 days
- Parr: 90 days
- Smolt: 90 days
- Post-Smolt: 90 days
- Adult: 400 days

**Data Needed**: Add `typical_duration_days` field to `LifeCycleStage` model

---

## Implementation Sequence (Follow This Order)

### Phase 2: Container Availability Backend (START HERE)

**Duration**: 1 day

**Tasks**:
1. **Add `typical_duration_days` to LifeCycleStage**
   - File: `AquaMind/apps/batch/models/species.py`
   - Migration: `0029_add_lifecycle_stage_duration.py`
   - Seed data: Egg/Alevin=90, Fry=90, Parr=90, Smolt=90, Post-Smolt=90, Adult=400

2. **Add `expected_departure_date` property to BatchContainerAssignment**
   - File: `AquaMind/apps/batch/models/assignment.py`
   - Logic: `assignment_date + lifecycle_stage.typical_duration_days`
   - Use `departure_date` if set (actual > expected)

3. **Create Container Availability ViewSet**
   - File: `AquaMind/apps/batch/api/viewsets/container_availability.py` (NEW)
   - Endpoint: `GET /api/v1/batch/containers/availability/`
   - Query params: `geography`, `delivery_date`, `container_type`
   - Response: Enriched containers with availability forecast
   - See specification in refinement plan lines 451-700

4. **Register Router**
   - File: `AquaMind/apps/batch/api/routers.py`
   - Add: `router.register('containers/availability', ContainerAvailabilityViewSet)`

5. **Write Tests**
   - File: `AquaMind/apps/batch/tests/test_container_availability.py`
   - Test: Empty container (status: EMPTY)
   - Test: Occupied but will be empty (status: AVAILABLE)
   - Test: Occupied beyond delivery date (status: CONFLICT)
   - Test: Multiple assignments in one container
   - Test: Edge cases (same day, next day)

**Acceptance Criteria**:
- `/api/v1/batch/containers/availability/?geography=1&delivery_date=2026-01-31` returns enriched data
- Containers sorted by availability priority (empty first, conflicts last)
- `expected_departure_date` calculated correctly
- Tests pass with >85% coverage

---

### Phase 3: Transfer Workflow Enhancement (Do This Second)

**Duration**: 1 day

**Tasks**:
1. **Create `useContainerAvailability` hook**
   - File: `client/src/features/batch-management/workflows/hooks/useContainerAvailability.ts` (NEW)
   - TanStack Query hook calling availability endpoint
   - Include delivery_date in query key

2. **Update `AddActionsDialog` to use availability**
   - File: `client/src/features/batch-management/workflows/components/AddActionsDialog.tsx`
   - Replace simple container fetch with availability hook
   - Add "Expected Execution Date" field to form
   - Update destination container dropdown with rich labels
   - Show status icons: ✅ (empty), ⏰ (will be empty), ⚠️ (conflict)
   - Disable containers with CONFLICT status

3. **Create formatting utilities**
   - File: `client/src/features/batch-management/workflows/utils/container-availability.ts` (NEW)
   - Helper functions for availability messages, icons, colors
   - Format "Available from DATE (X days before delivery)"

4. **Test the enhancement**
   - Try adding action with future date → see occupied containers with availability
   - Try selecting container that will be empty → works
   - Try selecting conflicting container → disabled with warning

**Acceptance Criteria**:
- Existing transfer workflows can see container availability timeline
- Occupied containers show when they'll be available
- Conflicts automatically disabled
- UX clear and intuitive
- No breaking changes to existing workflows

---

### Phase 4: Batch Creation Backend (Core Implementation)

**Duration**: 3 days

**Day 1: Models & Migrations**

1. **Create `BatchCreationWorkflow` model**
   - File: `AquaMind/apps/batch/models/workflow_creation.py` (NEW)
   - See specification in refinement plan (lines 100-250)
   - Fields: egg_source_type, egg_production, external_supplier, external_cost, etc.
   - Methods: can_add_actions(), can_plan(), can_cancel(), check_completion()

2. **Create `CreationAction` model**
   - File: `AquaMind/apps/batch/models/workflow_creation_action.py` (NEW)
   - See specification in refinement plan (lines 260-400)
   - Fields: dest_assignment (only), egg_count_planned, mortality_on_arrival, etc.
   - Method: execute(**execution_data)

3. **Update Batch model statuses**
   - File: `AquaMind/apps/batch/models/batch.py`
   - Add to BATCH_STATUS_CHOICES: 'PLANNED', 'RECEIVING', 'CANCELLED'

4. **Create migration**
   - File: `AquaMind/apps/batch/migrations/0030_batch_creation_workflow.py`
   - Create both new tables
   - Add new batch status choices
   - Add indexes

5. **Update `__init__.py`**
   - File: `AquaMind/apps/batch/models/__init__.py`
   - Export new models

**Day 2: Serializers & ViewSets**

1. **Create serializers**
   - File: `AquaMind/apps/batch/api/serializers/workflow_creation.py` (NEW)
   - `BatchCreationWorkflowSerializer` (list view)
   - `BatchCreationWorkflowDetailSerializer` (detail view with nested batch info)
   - `BatchCreationWorkflowCreateSerializer` (creates batch on workflow creation!)
   - See existing `workflow.py` serializers as reference

2. **Create action serializers**
   - File: `AquaMind/apps/batch/api/serializers/workflow_creation_action.py` (NEW)
   - `CreationActionSerializer` (list/detail)
   - `CreationActionExecuteSerializer` (execution payload)
   - Validation: Prevent mixed batches with timing check

3. **Create ViewSets**
   - File: `AquaMind/apps/batch/api/viewsets/workflow_creation.py` (NEW)
   - `BatchCreationWorkflowViewSet` with custom actions: `plan()`, `cancel()`
   - File: `AquaMind/apps/batch/api/viewsets/workflow_creation_action.py` (NEW)
   - `CreationActionViewSet` with custom actions: `execute()`, `skip()`

4. **Register routers**
   - File: `AquaMind/apps/batch/api/routers.py`
   - Add both ViewSets

5. **Update OpenAPI schema**
   - Run backend, verify `/api/schema/` includes new endpoints
   - Verify no schema generation errors

**Day 3: Business Logic & Validation**

1. **Implement batch creation on workflow creation**
   - In `BatchCreationWorkflowCreateSerializer.create()`:
     - Create Batch record (status: PLANNED, lifecycle_stage: Egg/Alevin)
     - Link to egg_production OR create external egg record
     - Create broodstock_batchparentage link
     - Generate workflow_number (CRT-YYYY-XXX format)

2. **Implement action execution logic**
   - Update destination assignment population
   - Track mortality on arrival
   - Update workflow progress
   - Auto-complete workflow when all actions done

3. **Add mixed batch prevention**
   - In `CreationActionSerializer.validate()`:
     - Check if dest_container has other active batches
     - If yes: Check timing (expected_departure vs delivery_date)
     - If conflict: Raise ValidationError with helpful message

4. **Write comprehensive tests**
   - File: `AquaMind/apps/batch/tests/test_creation_workflow.py`
   - Test workflow creation creates batch
   - Test action execution updates populations
   - Test completion triggers batch status change
   - Test cancellation prevents if actions executed
   - Test mixed batch prevention
   - Test broodstock linkage

---

### Phase 5: Finance Integration

**Duration**: 1 day

**Tasks**:

1. **Extend IntercompanyPolicy**
   - File: `AquaMind/apps/finance/models.py`
   - Add to `PricingBasis.choices`: `('EGG_DELIVERY', 'Egg Delivery (Creation)')`
   - Add field: `price_per_thousand_eggs` (DecimalField, nullable)
   - Update validation: `_validate_pricing_basis()` to handle EGG_DELIVERY

2. **Create migration**
   - File: `AquaMind/apps/finance/migrations/0007_add_egg_delivery_pricing.py`
   - Add pricing basis choice
   - Add price_per_thousand_eggs field

3. **Extend TransferFinanceService**
   - File: `AquaMind/apps/finance/services/transfer_finance.py`
   - Add method: `create_egg_delivery_transaction(creation_workflow)`
   - Calculate: (total_eggs_received / 1000) × price_per_thousand_eggs
   - Create IntercompanyTransaction with generic FK to BatchCreationWorkflow
   - Called from `BatchCreationWorkflow.check_completion()` (if internal eggs)

4. **Test finance integration**
   - Internal egg workflow → completes → transaction created (PENDING)
   - External egg workflow → completes → no transaction (just expense tracking)

**Acceptance Criteria**:
- Internal egg workflows create intercompany transactions
- Amount calculated correctly from egg count × price
- Transaction state: PENDING (awaits approval)
- External workflows don't create transactions

---

### Phase 6: Batch Creation Frontend

**Duration**: 4 days

**Day 1: Wizard Component**

1. **Create `CreateBatchCreationWizard`**
   - File: `client/src/features/batch-management/batch-creation/components/CreateBatchCreationWizard.tsx` (NEW)
   - 3-step wizard: Basic Info → Egg Source → Review & Create
   - Step 1: batch_number, species, total_eggs, dates
   - Step 2a (internal): Select egg_production, shows estimated value
   - Step 2b (external): Select supplier, batch number, cost per thousand
   - Step 3: Review summary, warnings (intercompany if internal)
   - See UI specification in refinement plan (lines 600-800)

2. **Create form schema**
   - Zod validation for all fields
   - Conditional validation: egg_production OR (external_supplier + cost)

**Day 2: Action Dialogs**

1. **Create `AddCreationActionsDialog`**
   - File: `client/src/features/batch-management/batch-creation/components/AddCreationActionsDialog.tsx` (NEW)
   - Similar to AddActionsDialog but:
     - NO source container (only destination)
     - Field: `egg_count_planned` (not transferred_count)
     - Field: `expected_delivery_date` (not execution_date)
   - Uses `useContainerAvailability` hook with delivery_date
   - Rich container labels with timeline

2. **Create `ExecuteCreationActionDialog`**
   - File: `client/src/features/batch-management/batch-creation/components/ExecuteCreationActionDialog.tsx` (NEW)
   - Fields: mortality_on_arrival, delivery_method, water_temp, quality_score
   - Shows planned vs actual egg counts
   - Calculates: actual_received = planned - mortality

**Day 3: Pages**

1. **Create `CreationWorkflowDetailPage`**
   - File: `client/src/features/batch-management/batch-creation/pages/CreationWorkflowDetailPage.tsx` (NEW)
   - Similar layout to WorkflowDetailPage
   - Show: Progress, timeline, finance summary (if internal), action list
   - Actions: Plan, Cancel, Execute

2. **Create `CreationWorkflowListPage`**
   - File: `client/src/features/batch-management/batch-creation/pages/CreationWorkflowListPage.tsx` (NEW)
   - Filters: status, egg_source_type, date ranges
   - Table: workflow_number, batch, source, status, progress, actions

3. **Replace Batch Setup Page**
   - Option A: Replace `/batch-setup` entirely with wizard
   - Option B: Add "Create with Workflow" button, keep simple form temporarily
   - **Recommendation**: Option A (Big Bang rollout decision already made)

**Day 4: API Integration & Polish**

1. **Create TanStack Query hooks**
   - File: `client/src/features/batch-management/batch-creation/api.ts` (NEW)
   - `useCreationWorkflows()` - list with filters
   - `useCreationWorkflow(id)` - detail
   - `useCreateCreationWorkflow()` - mutation
   - `useCreationActions()` - list for workflow
   - `useExecuteCreationAction()` - mutation

2. **Add routes**
   - File: `client/src/router/index.tsx`
   - Add routes: `/batch-creation-workflows`, `/batch-creation-workflows/:id`
   - Update: `/batch-setup` → redirect to creation wizard OR replace component

3. **Add navigation**
   - Update sidebar to include "Batch Creation" link (or make it prominent in Batch Management section)

4. **Test complete flow**
   - Create workflow → Add actions → Plan → Execute → Complete
   - Verify all state transitions
   - Verify finance transaction (internal)
   - Verify broodstock linkage

---

## Important Code References

### Existing Transfer Workflow (Use as Template)

**Backend**:
- Model: `AquaMind/apps/batch/models/workflow.py` (BatchTransferWorkflow)
- Action model: `AquaMind/apps/batch/models/workflow_action.py` (TransferAction)
- Serializers: `AquaMind/apps/batch/api/serializers/workflow.py`
- ViewSets: `AquaMind/apps/batch/api/viewsets/workflows.py`

**Frontend**:
- Wizard: `client/src/features/batch-management/workflows/components/CreateWorkflowWizard.tsx`
- Add Actions: `client/src/features/batch-management/workflows/components/AddActionsDialog.tsx`
- Execute: `client/src/features/batch-management/workflows/components/ExecuteActionDialog.tsx`
- Detail Page: `client/src/features/batch-management/workflows/pages/WorkflowDetailPage.tsx`
- API hooks: `client/src/features/batch-management/workflows/api.ts`

**Pattern to Follow**: Copy-paste-adapt approach is RECOMMENDED. The creation workflow should mirror the transfer workflow structure.

---

### Finance Integration (Use as Pattern)

**Service**: `AquaMind/apps/finance/services/transfer_finance.py`
- Method: `create_transfer_transaction()` - COPY THIS PATTERN
- Add: `create_egg_delivery_transaction()` - NEW METHOD

**Key Logic**:
```python
# Get companies from workflow
broodstock_company = get_company_from_egg_production(workflow.egg_production)
freshwater_company = get_company_from_destination_containers(workflow.actions)

# Get pricing policy
policy = IntercompanyPolicy.objects.get(
    from_company=broodstock_company,
    to_company=freshwater_company,
    pricing_basis='EGG_DELIVERY'
)

# Calculate amount
total_eggs = workflow.total_eggs_received
amount = (total_eggs / 1000) * policy.price_per_thousand_eggs

# Create transaction (using generic FK to BatchCreationWorkflow)
IntercompanyTransaction.objects.create(
    content_type=ContentType.objects.get_for_model(BatchCreationWorkflow),
    object_id=workflow.id,
    policy=policy,
    amount=amount,
    currency=broodstock_company.currency,
    state='PENDING'
)
```

---

## Testing Checklist

### Backend Tests (Run After Phase 4 & 5)

```bash
cd AquaMind
python manage.py test apps.batch.tests.test_creation_workflow
python manage.py test apps.batch.tests.test_container_availability
python manage.py test apps.finance.tests.test_egg_delivery_finance

# Expected results:
# - All creation workflow CRUD operations work
# - Batch created with status PLANNED on workflow creation
# - Actions execute and update populations correctly
# - Workflow completes and batch becomes ACTIVE
# - Cancellation prevents if actions executed
# - Mixed batch prevention works
# - Finance transaction created for internal eggs
```

### Frontend Tests (Run After Phase 6)

```bash
cd AquaMind-Frontend/client
npm run test -- batch-creation

# Expected results:
# - Wizard renders and navigates between steps
# - Form validation works
# - Container dropdown shows availability info
# - Action execution dialog works
# - All state management correct
```

### Manual UAT Testing

**Scenario 1: Create External Egg Batch**
1. Navigate to `/batch-setup` (or `/batch-creation-workflows`)
2. Click "Create Batch Creation Workflow"
3. Fill wizard:
   - Batch number: FT-FI-2026-TEST
   - Species: Atlantic Salmon
   - Total eggs: 500,000
   - Source: External - AquaGen Norway
   - Cost: €120.00 per 1000 eggs
4. Create workflow → Verify batch created (status: PLANNED)
5. Add 5 actions to different trays over 3 days
6. Plan workflow → Verify status: PLANNED
7. Execute action 1 → Verify batch status: RECEIVING
8. Execute all actions → Verify workflow: COMPLETED, batch: ACTIVE
9. Verify no finance transaction (external eggs)

**Scenario 2: Create Internal Egg Batch**
1. Same as above but select "Internal Broodstock"
2. Select egg production from dropdown
3. Complete workflow
4. Verify: IntercompanyTransaction created (PENDING)
5. Verify: broodstock_batchparentage link exists

**Scenario 3: Container Availability**
1. Create workflow with delivery date 30 days in future
2. Open "Add Actions" dialog
3. Verify: See occupied containers with "Available from DATE"
4. Verify: Conflicts disabled with warning
5. Select occupied-but-available container → Creates action successfully

**Scenario 4: Cancellation**
1. Create workflow, add actions, DON'T execute
2. Cancel workflow → Works (no actions executed)
3. Verify: Batch status: CANCELLED, broodstock link preserved
4. Create another workflow, execute 1 action
5. Try to cancel → Error: "Cannot cancel - eggs already delivered"

---

## Common Pitfalls & How to Avoid Them

### Pitfall 1: Circular Import (batch ↔ broodstock)

**Problem**: BatchCreationWorkflow imports EggProduction, but broodstock might import Batch

**Solution**:
```python
# In workflow_creation.py
from apps.broodstock.models import EggProduction, EggSupplier  # Direct import OK

# Avoid importing BatchCreationWorkflow in broodstock models
# Use string FK if needed: 'batch.BatchCreationWorkflow'
```

---

### Pitfall 2: Assignment Creation Timing

**Problem**: When to create `BatchContainerAssignment` for destination?

**Solution**: Create when action is added (matches transfer pattern)
```python
# In CreationAction serializer create():
dest_assignment, created = BatchContainerAssignment.objects.get_or_create(
    batch=workflow.batch,
    container=validated_data['dest_container'],
    lifecycle_stage=workflow.batch.lifecycle_stage,  # Egg/Alevin
    defaults={
        'population_count': 0,
        'assignment_date': workflow.planned_start_date,
        'is_active': False,  # Becomes True on execution
    }
)
```

**Why**: Allows multiple actions to same container (Action 8 & 13 to Tray 08 example)

---

### Pitfall 3: Generic Foreign Key Setup

**Problem**: IntercompanyTransaction needs to link to BatchCreationWorkflow

**Solution**: Already handled by ContentType framework
```python
# Transaction automatically supports any model
content_type = ContentType.objects.get_for_model(BatchCreationWorkflow)
IntercompanyTransaction.objects.create(
    content_type=content_type,
    object_id=workflow.id,
    # ... other fields
)
```

**Verify**: Check `finance/models.py` line 264+ for existing pattern

---

### Pitfall 4: Frontend API Client Not Updating

**Problem**: After backend changes, frontend doesn't see new endpoints

**Solution**:
```bash
cd AquaMind-Frontend/client
npm run generate:api  # Regenerate from OpenAPI schema

# Verify new services exist:
# - BatchCreationWorkflowService
# - CreationActionService
```

---

## Key Files You'll Create

### Backend (AquaMind repo)
```
apps/batch/models/
  └── workflow_creation.py                    (NEW - 250 lines)
  └── workflow_creation_action.py             (NEW - 200 lines)

apps/batch/api/serializers/
  └── workflow_creation.py                    (NEW - 300 lines)
  └── workflow_creation_action.py             (NEW - 200 lines)

apps/batch/api/viewsets/
  └── workflow_creation.py                    (NEW - 150 lines)
  └── workflow_creation_action.py             (NEW - 150 lines)
  └── container_availability.py               (NEW - 200 lines)

apps/batch/migrations/
  └── 0029_add_lifecycle_stage_duration.py    (NEW)
  └── 0030_batch_creation_workflow.py         (NEW)

apps/batch/tests/
  └── test_creation_workflow.py               (NEW - 500 lines)
  └── test_container_availability.py          (NEW - 300 lines)

apps/finance/migrations/
  └── 0007_add_egg_delivery_pricing.py        (NEW)
```

### Frontend (AquaMind-Frontend repo)
```
client/src/features/batch-management/batch-creation/     (NEW DIRECTORY)
├── components/
│   ├── CreateBatchCreationWizard.tsx        (NEW - 500 lines)
│   ├── AddCreationActionsDialog.tsx         (NEW - 400 lines)
│   └── ExecuteCreationActionDialog.tsx      (NEW - 300 lines)
├── pages/
│   ├── CreationWorkflowDetailPage.tsx       (NEW - 400 lines)
│   └── CreationWorkflowListPage.tsx         (NEW - 300 lines)
├── hooks/
│   └── useContainerAvailability.ts          (NEW - 100 lines)
├── utils/
│   └── container-availability.ts            (NEW - 150 lines)
└── api.ts                                    (NEW - 200 lines)

client/src/features/batch-management/workflows/
└── components/
    └── AddActionsDialog.tsx                  (MODIFY - add availability)
```

**Total New Code**: ~5,000 lines across both repos

---

## Success Metrics

### Phase Completion Checklist

**Phase 2** (Container Availability Backend):
- [ ] `typical_duration_days` added to LifeCycleStage
- [ ] Migration applied with seed data
- [ ] `/api/v1/batch/containers/availability/` endpoint works
- [ ] Returns enriched data with expected_departure_date
- [ ] Tests pass (>85% coverage)

**Phase 3** (Transfer Enhancement):
- [ ] `useContainerAvailability` hook created
- [ ] AddActionsDialog shows timeline-aware containers
- [ ] Occupied containers visible with availability message
- [ ] Conflicts disabled automatically
- [ ] UX validated with test user

**Phase 4** (Creation Backend):
- [ ] BatchCreationWorkflow model created
- [ ] CreationAction model created
- [ ] Batch created on workflow creation
- [ ] Actions execute and update populations
- [ ] Workflow completes and batch becomes ACTIVE
- [ ] Cancellation logic works correctly
- [ ] Tests pass (>85% coverage)

**Phase 5** (Finance):
- [ ] EGG_DELIVERY pricing basis added
- [ ] IntercompanyTransaction created for internal eggs
- [ ] External eggs tracked as expense
- [ ] Tests pass

**Phase 6** (Creation Frontend):
- [ ] CreateBatchCreationWizard functional
- [ ] AddCreationActionsDialog functional
- [ ] ExecuteCreationActionDialog functional
- [ ] Detail and List pages functional
- [ ] Complete flow tested end-to-end
- [ ] No console errors

**Phase 7** (Integration & UAT):
- [ ] All scenarios tested manually
- [ ] Performance acceptable (<2s for 100+ containers)
- [ ] Finance Manager can approve internal egg transactions
- [ ] Audit trail complete (django-simple-history)
- [ ] Documentation updated

---

## Questions You Might Have

### Q: Should I implement all phases sequentially?

**A**: Yes, follow the sequence. Each phase depends on previous phases. Don't skip ahead.

### Q: What if I find issues with the specification?

**A**: Document and discuss with user before implementing. The spec is detailed but may have edge cases.

### Q: Can I parallelize any work?

**A**: Limited parallelization:
- Phase 2 & 4 can partially overlap (both backend)
- Phase 3 & 6 can partially overlap (both frontend)
- But maintain dependencies (Phase 6 needs Phase 4 API)

### Q: How to handle egg/alevin combined stage?

**A**: Treat as single lifecycle stage named "Egg/Alevin" with 90-day duration. When creating batch, use this stage. When alevin move to fry tanks, that's a separate lifecycle transition workflow (Egg/Alevin → Fry).

---

## Critical Context from Discussion

### User Insights (Preserve These)

1. **"3.2 million eggs is typical"** - System must handle large numbers efficiently
2. **"Maybe 2-3 people create batches"** - Low user count, high expertise, complex operations
3. **"Eggs spread across 42 containers over weeks"** - Multi-delivery planning is the norm
4. **"Action 8 and 13 both add to Tray 08"** - Multiple deliveries to same container is normal
5. **"We combine egg and alevin into 90-day stage"** - Bakkafrost-specific, respect this
6. **"Direct tube transfer to factory"** - Harvest doesn't need workflow (confirmed PARTIAL_HARVEST removal)

### Finance Clarifications

- **Internal eggs**: Intercompany (Broodstock sells to Freshwater) - create transaction
- **External eggs**: Expense (Freshwater buys from supplier) - no transaction, just cost tracking
- **No finance_core dependency**: Use existing `finance` app IntercompanyPolicy/Transaction

### Timeline-Aware Selection Rationale

- **Planners work weeks ahead**: Containers occupied today will be empty later
- **Timing validation**: Prevent delivering eggs to occupied containers
- **Rich UX**: Show "Available from DATE (X days buffer)" vs "Conflict (X days after)"
- **Mixed batch prevention**: Hard validation (prevent accidental mixing)

---

## Getting Started Commands

```bash
# 1. Ensure you're on latest main
cd /Users/aquarian247/Projects/AquaMind
git pull origin main

cd /Users/aquarian247/Projects/AquaMind-Frontend
git pull origin main

# 2. Create feature branch (or work on main per user preference)
cd /Users/aquarian247/Projects/AquaMind
git checkout -b feature/batch-creation-workflow

cd /Users/aquarian247/Projects/AquaMind-Frontend
git checkout -b feature/batch-creation-workflow

# 3. Start with Phase 2: Container Availability
# Read specification: WORKFLOW_ARCHITECTURE_REFINEMENT_PLAN.md (lines 451-750)
# Implement: typical_duration_days field
# Create: container availability endpoint

# 4. Test as you go
python manage.py test apps.batch.tests.test_container_availability
npm run test -- container-availability
```

---

## Final Checklist Before Starting

- [ ] Read refinement plan completely (at least sections for Phase 2-6)
- [ ] Understand existing transfer workflow code structure
- [ ] Understand finance integration pattern from TRANSFER_WORKFLOW_FINANCE_GUIDE.md
- [ ] Verify servers running (Django + Node)
- [ ] Verify migrations all applied
- [ ] Ready to create feature branch (or work on main)
- [ ] Have test credentials: admin/admin123

---

## Your First Task

**Start Here**: Phase 2, Task 1

**File to Edit**: `AquaMind/apps/batch/models/species.py`

**Change to Make**:
```python
class LifeCycleStage(models.Model):
    # ... existing fields ...
    
    typical_duration_days = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Typical duration for this stage (days) - used for capacity planning"
    )
```

**Next**: Create migration and seed with Bakkafrost durations

---

**Good luck! You have everything you need. The architecture is solid, the patterns are proven, and the specification is complete. Follow the phases sequentially and you'll ship this feature successfully.** 🚀

---

**Document Version**: 1.0  
**Created**: November 11, 2025  
**For**: Claude Sonnet 4.5 (next session)  
**By**: Claude Sonnet 4.5 (current session) & User collaborative design


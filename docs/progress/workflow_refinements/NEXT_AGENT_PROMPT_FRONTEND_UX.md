# Agent Prompt: Batch Creation Frontend UX/UI Implementation

**Task**: Implement wizard and action dialogs for batch creation workflows  
**Estimated Time**: 4-6 hours  
**Prerequisites**: Part B backend complete, test data available  
**Branch**: Create `feature/batch-creation-ui`

---

## 🎯 What's Already Done

✅ **Complete Backend** - All APIs working, 1208 tests passing  
✅ **Frontend Navigation** - List/Detail pages functional  
✅ **API Hooks** - All TanStack Query hooks ready (`client/src/features/batch-management/batch-creation/api.ts`)  
✅ **Test Data** - 5 workflows available for testing  
✅ **Container Availability Hook** - Timeline-aware selection ready (`useContainerAvailability`)

---

## 📋 Your Tasks

### 1. Create Batch Creation Wizard (3-Step)

**File**: `client/src/features/batch-management/batch-creation/components/CreateBatchCreationWizard.tsx`

**Pattern**: Copy from `client/src/features/batch-management/workflows/components/CreateWorkflowWizard.tsx` (transfer workflow wizard)

**Steps**:
- **Step 1**: Basic Info (batch_number, species, total_eggs, planned dates)
- **Step 2**: Egg Source
  - **Option A** (Internal): Select egg_production from dropdown, show estimated value
  - **Option B** (External): Select supplier, supplier batch number, cost per thousand
- **Step 3**: Review & Create (summary, warnings if intercompany)

**API Call**: Use `useCreateCreationWorkflow()` hook (already built)

---

### 2. Create Add Actions Dialog

**File**: `client/src/features/batch-management/batch-creation/components/AddCreationActionsDialog.tsx`

**Pattern**: Similar to `client/src/features/batch-management/workflows/components/AddActionsDialog.tsx` but:
- **NO source container** (eggs from external)
- Field: `egg_count_planned` (not transferred_count)
- Field: `expected_delivery_date` (not execution_date)
- **Use timeline-aware selection**: Call `useContainerAvailability` with delivery_date
- Rich container labels: "Tray-01 ✅ Empty" vs "Tray-02 ⏰ Available from 2026-01-13"
- Disable CONFLICT containers

**API Call**: Use `useCreateCreationAction()` hook

---

### 3. Create Execute Action Dialog

**File**: `client/src/features/batch-management/batch-creation/components/ExecuteCreationActionDialog.tsx`

**Pattern**: Similar to `client/src/features/batch-management/workflows/components/ExecuteActionDialog.tsx`

**Fields**:
- `mortality_on_arrival` (required)
- `delivery_method` (dropdown: TRANSPORT, HELICOPTER, BOAT, INTERNAL_TRANSFER)
- `water_temp_on_arrival` (decimal, °C)
- `egg_quality_score` (1-5 rating)
- `execution_duration_minutes` (integer)
- `notes` (textarea)

**Display**: Show planned vs actual (planned - mortality = actual)

**API Call**: Use `useExecuteCreationAction()` hook

---

### 4. Integrate into Detail Page

**File**: `client/src/features/batch-management/batch-creation/pages/CreationWorkflowDetailPage.tsx`

**Add**:
- "Add Actions" button → opens `AddCreationActionsDialog` (if status = DRAFT)
- "Plan Workflow" button → calls `usePlanCreationWorkflow()` (if status = DRAFT && actions > 0)
- "Cancel" button → opens cancel dialog (if can_cancel)
- "Execute" button on each PENDING action → opens `ExecuteCreationActionDialog`

---

## 🔑 Critical Patterns to Follow

### Container Selection with Timeline Awareness

```tsx
// In AddCreationActionsDialog:
const { data: containers } = useContainerAvailability({
  geography: geographyId,
  deliveryDate: formData.expected_delivery_date, // User inputs this!
  containerType: 'TRAY',
  enabled: !!geographyId && !!formData.expected_delivery_date
});

// Render with status indicators:
{containers?.results.map(container => (
  <SelectItem 
    value={container.id.toString()} 
    disabled={container.availability_status === 'CONFLICT'}
  >
    {container.name} {getAvailabilityIcon(container.availability_status)} 
    {container.availability_message}
  </SelectItem>
))}
```

### Form Validation

Use Zod schemas (see `client/src/features/batch-management/workflows/schemas.ts` for pattern):
- Required fields validation
- Date range validation (completion_date > start_date)
- Conditional validation (egg_production OR external_supplier)
- Egg count > 0

---

## 🧪 Testing

**Run Test Data Generator** (if not already done):
```bash
cd /Users/aquarian247/Projects/AquaMind
python scripts/data_generation/05_quick_create_test_creation_workflows.py
```

**Test Scenarios**:
1. Navigate to `/batch-creation-workflows`
2. Click "Create Workflow" → wizard opens
3. Fill 3 steps, submit → workflow created
4. Click workflow → detail page
5. Add 5 actions with various delivery dates
6. Plan workflow
7. Execute first action → updates progress
8. Verify batch status changes (PLANNED → RECEIVING)

---

## 📚 Reference Files

**Existing Patterns** (Copy-Paste-Adapt):
- Transfer wizard: `client/src/features/batch-management/workflows/components/CreateWorkflowWizard.tsx`
- Add actions: `client/src/features/batch-management/workflows/components/AddActionsDialog.tsx`
- Execute dialog: `client/src/features/batch-management/workflows/components/ExecuteActionDialog.tsx`

**Backend Spec**:
- Full details: `docs/progress/workflow_refinements/WORKFLOW_ARCHITECTURE_REFINEMENT_PLAN.md`
- Implementation log: `docs/progress/workflow_refinements/PART_B_IMPLEMENTATION_COMPLETE.md`

**Already Built**:
- API hooks: `client/src/features/batch-management/batch-creation/api.ts`
- Container hook: `client/src/features/batch-management/workflows/hooks/useContainerAvailability.ts`

---

## ✅ Success Criteria

- [ ] Wizard creates workflow successfully
- [ ] Add Actions dialog uses timeline-aware selection
- [ ] Containers show availability messages (✅ ⏰ ⚠️ ❌)
- [ ] Conflict containers are disabled
- [ ] Execute dialog records all fields
- [ ] Progress updates in real-time
- [ ] Batch status changes (PLANNED → RECEIVING → ACTIVE)
- [ ] No TypeScript errors
- [ ] No console warnings

---

## ⚡ Quick Start

```bash
# 1. Create branch
cd /Users/aquarian247/Projects/AquaMind-Frontend
git checkout -b feature/batch-creation-ui

# 2. Start with wizard (easiest)
# Copy CreateWorkflowWizard.tsx → CreateBatchCreationWizard.tsx
# Adapt steps for egg source selection

# 3. Test immediately
npm run dev
# Navigate to /batch-creation-workflows, click "Create Workflow"

# 4. Commit when each component works
```

---

**Estimated LOC**: ~1,200 lines across 3 components  
**Complexity**: Medium (copy-paste-adapt pattern)  
**Blocker**: None - everything you need is ready!

Good luck! 🚀


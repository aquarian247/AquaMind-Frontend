# Transfer Workflow Frontend Implementation Plan

**Created**: October 18, 2024  
**Updated**: October 19, 2024  
**Purpose**: Build UI for BatchTransferWorkflow and TransferAction execution  
**Dependencies**: 
- Backend Transfer Workflow API (completed)
- Finance integration (backend in progress)
- Shared Finance Components (see `finance_features_alignment.md`)

**Tech Stack**: React, TanStack Query, shadcn/ui, wouter, Recharts

---

## 🔗 Related Documents

**IMPORTANT**: Read these first for context and shared components:
1. **`finance_features_alignment.md`** - Shared components, styling, integration points
2. **Backend Implementation**: `AquaMind/docs/progress/TRANSFER_WORKFLOW_IMPLEMENTATION_COMPLETE.md`
3. **Finance Integration Plan**: `AquaMind/docs/progress/transfer_finance_integration_plan.md`

**Shared with Finance Reporting**:
- DateRangeFilter component
- GeographicFilters component  
- FinanceKpiCard component
- StatusBadge component
- Recharts theme & ChartWrapper
- Currency/date formatting utilities

---

## 📚 Context for AI Agents

### Backend API Endpoints (Already Built)
```
# Workflows
GET    /api/batch/transfer-workflows/
POST   /api/batch/transfer-workflows/
GET    /api/batch/transfer-workflows/{id}/
PATCH  /api/batch/transfer-workflows/{id}/
POST   /api/batch/transfer-workflows/{id}/plan/
POST   /api/batch/transfer-workflows/{id}/cancel/
POST   /api/batch/transfer-workflows/{id}/complete/
POST   /api/batch/transfer-workflows/{id}/approve_finance/

# Actions
GET    /api/batch/transfer-actions/
POST   /api/batch/transfer-actions/
GET    /api/batch/transfer-actions/{id}/
PATCH  /api/batch/transfer-actions/{id}/
POST   /api/batch/transfer-actions/{id}/execute/
POST   /api/batch/transfer-actions/{id}/skip/
POST   /api/batch/transfer-actions/{id}/rollback/
POST   /api/batch/transfer-actions/{id}/retry/

# Finance (if integrated)
GET    /api/finance/intercompany-transactions/pending_approvals/
POST   /api/batch/transfer-workflows/{id}/approve_finance/
```

### Required Reading
1. **Backend Models**: `apps/batch/models/workflow.py` - Understand state machine, fields
2. **Existing Frontend**: `client/src/features/batch-management/` - Follow established patterns
3. **API Types**: `client/src/api/generated/` - Auto-generated TypeScript types (if available)
4. **Shared Components**: `client/src/features/shared/` - Reusable components, hooks
5. **Theme**: shadcn/ui components for consistency

### Frontend Architecture Patterns
- **Feature folders**: `/features/batch-management/workflows/` for new workflow code
- **API hooks**: TanStack Query for data fetching
- **Forms**: react-hook-form + zod validation
- **Routing**: wouter (lightweight router)
- **State**: React Query cache + local component state
- **Mobile-first**: Responsive design, especially for ship crew execution

---

## 🎨 UI/UX Design Philosophy

### User Personas & Needs
1. **Freshwater Manager** (Desktop) - Plans multi-day transfers, monitors progress
2. **Ship Crew** (Mobile) - Executes actions during voyage, fills reports
3. **Farming Manager** (Desktop) - Approves incoming transfers, reviews finance

### Screen Flow
```
[Batch Details Page]
     ↓ "Plan Transfer" button
[Create Workflow Wizard] → Multi-step form (MOBILE-FRIENDLY)
  Step 1: Transfer Type & Destination
  Step 2: Add Actions (source/dest container pairs)
  Step 3: Review & Plan
     ↓
[Workflow List Page] → Shows all workflows (filterable by status)
     ↓ Click workflow
[Workflow Detail Page] → Progress tracker, action list, timeline
     ↓ "Execute" button on action (MOBILE-OPTIMIZED)
[Execute Action Dialog] → Simple form for ship crew
  - Mortality count
  - Environmental conditions
  - Notes
     ↓ Submit
[Workflow Detail Page] → Updated progress (e.g., 2/4 actions done)
     ↓ All actions complete
[Workflow Auto-Completes] → Status: COMPLETED
     ↓ If intercompany
[Finance Approval Page] → Farming Manager dashboard
     ↓ "Approve" button
[Transaction POSTED]
```

---

## 📋 Implementation Phases

---

## **PHASE 0: Shared Components Prerequisites**

**Note**: These components are built as part of the shared finance library (see `finance_features_alignment.md`)

**Required Before Starting Phase 1**:
- ✅ DateRangeFilter component
- ✅ GeographicFilters component
- ✅ FinanceKpiCard component
- ✅ StatusBadge component
- ✅ Recharts theme configuration
- ✅ ChartWrapper component
- ✅ Currency/date formatting utilities

**If shared components are not ready**: Implement inline first, refactor to shared later.

---

## **PHASE 1: Data Layer & Types**

### Task 1.1: Extend API Client Types
**File**: `client/src/api/generated/` (auto-generated or manual)

**Ensure types exist for**:
```typescript
interface BatchTransferWorkflow {
  id: number;
  workflow_number: string;
  batch: number;
  batch_details?: {
    batch_number: string;
    species_name: string;
  };
  workflow_type: 'LIFECYCLE_TRANSITION' | 'CONTAINER_REDISTRIBUTION' | 'EMERGENCY_CASCADE' | 'HARVEST_PREP';
  status: 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  source_lifecycle_stage?: number;
  dest_lifecycle_stage?: number;
  planned_start_date: string;
  actual_start_date?: string;
  actual_completion_date?: string;
  total_actions_planned: number;
  actions_completed: number;
  completion_percentage: string;
  is_intercompany: boolean;
  estimated_total_value?: string;
  finance_transaction?: number;
  initiated_by: number;
  created_at: string;
  updated_at: string;
}

interface TransferAction {
  id: number;
  workflow: number;
  action_number: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  source_assignment: number;
  dest_assignment: number;
  source_assignment_details?: {
    container_name: string;
    population_count: number;
  };
  dest_assignment_details?: {
    container_name: string;
  };
  source_population_before: number;
  transferred_count: number;
  transferred_biomass_kg: string;
  mortality_during_transfer?: number;
  transfer_method?: 'NET' | 'PUMP' | 'GRAVITY' | 'MANUAL';
  water_temp_c?: string;
  oxygen_level?: string;
  execution_duration_minutes?: number;
  actual_execution_date?: string;
  executed_by?: number;
  notes?: string;
}
```

---

### Task 1.2: Create API Hooks
**File**: `client/src/features/batch-management/workflows/api.ts` (new)

**Implement hooks following existing patterns**:
```typescript
// Workflows
export function useWorkflows(filters?: WorkflowFilters)
export function useWorkflow(id: number)
export function useCreateWorkflow()
export function useUpdateWorkflow()
export function usePlanWorkflow()
export function useCancelWorkflow()
export function useApproveWorkflowFinance()

// Actions
export function useWorkflowActions(workflowId: number)
export function useCreateAction()
export function useExecuteAction()
export function useSkipAction()
export function useRollbackAction()
```

**Example Implementation**:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { useToast } from '@/hooks/use-toast';

export function useWorkflows(filters?: {
  status?: string;
  batch?: number;
  workflowType?: string;
}) {
  return useQuery({
    queryKey: ['transfer-workflows', filters],
    queryFn: () => ApiService.apiV1BatchTransferWorkflowsList(
      filters?.status,
      filters?.batch,
      filters?.workflowType,
      // ... other params
    ),
  });
}

export function useExecuteAction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: { id: number; payload: ExecuteActionPayload }) =>
      ApiService.apiV1BatchTransferActionsExecuteCreate(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
      toast({ title: 'Action executed successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to execute action',
        description: error.message,
        variant: 'destructive'
      });
    },
  });
}
```

---

### Task 1.3: Create Validation Schemas
**File**: `client/src/features/batch-management/workflows/schemas.ts` (new)

**Zod schemas for forms**:
```typescript
import { z } from 'zod';

export const createWorkflowSchema = z.object({
  batch: z.number().int().positive(),
  workflow_type: z.enum(['LIFECYCLE_TRANSITION', 'CONTAINER_REDISTRIBUTION', 'EMERGENCY_CASCADE', 'HARVEST_PREP']),
  source_lifecycle_stage: z.number().int().positive().optional(),
  dest_lifecycle_stage: z.number().int().positive().optional(),
  planned_start_date: z.string().datetime(),
  notes: z.string().optional(),
});

export const addActionSchema = z.object({
  source_assignment: z.number().int().positive(),
  dest_assignment: z.number().int().positive(),
  transferred_count: z.number().int().positive(),
  transferred_biomass_kg: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export const executeActionSchema = z.object({
  mortality_during_transfer: z.number().int().min(0).default(0),
  transfer_method: z.enum(['NET', 'PUMP', 'GRAVITY', 'MANUAL']).optional(),
  water_temp_c: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  oxygen_level: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  execution_duration_minutes: z.number().int().positive().optional(),
  notes: z.string().optional(),
});
```

---

## **PHASE 2: Create Workflow Wizard**

### Task 2.1: Multi-Step Wizard Component
**File**: `client/src/features/batch-management/workflows/components/CreateWorkflowWizard.tsx`

**Structure**:
```typescript
// Wizard with 3 steps: Basic Info → Add Actions → Review
// Uses react-hook-form with zod validation
// Stores state in wizard context

interface WizardState {
  currentStep: number;
  workflowData: CreateWorkflowFormData;
  actions: ActionFormData[];
}

export function CreateWorkflowWizard({ batchId, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [workflowData, setWorkflowData] = useState({});
  const [actions, setActions] = useState([]);
  
  return (
    <Dialog open>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Transfer Workflow</DialogTitle>
          <WorkflowStepIndicator currentStep={step} totalSteps={3} />
        </DialogHeader>
        
        {step === 1 && <WorkflowBasicInfoStep onNext={handleStep1} />}
        {step === 2 && <WorkflowActionsStep onNext={handleStep2} onBack={() => setStep(1)} />}
        {step === 3 && <WorkflowReviewStep onSubmit={handleSubmit} onBack={() => setStep(2)} />}
      </DialogContent>
    </Dialog>
  );
}
```

---

### Task 2.2: Step 1 - Basic Info Form
**File**: `client/src/features/batch-management/workflows/components/WorkflowBasicInfoStep.tsx`

**Fields**:
- Workflow Type (dropdown)
- Source Lifecycle Stage (if LIFECYCLE_TRANSITION)
- Dest Lifecycle Stage (if LIFECYCLE_TRANSITION)
- Planned Start Date (use **DateRangeFilter** shared component - single date mode)
- Notes (textarea)

**Features**:
- Auto-detects intercompany status (show badge using **StatusBadge** shared component)
- Shows estimated financial value using **FinanceKpiCard** (if finance integration complete)
- Validates: dest stage must be > source stage order

**Shared Components Used**:
- ✅ DateRangeFilter (for planned start date)
- ✅ StatusBadge (for intercompany indicator)
- ✅ FinanceKpiCard (for estimated value display)

---

### Task 2.3: Step 2 - Add Actions
**File**: `client/src/features/batch-management/workflows/components/WorkflowActionsStep.tsx`

**Interface**:
- List of added actions (editable)
- "Add Action" button → opens AddActionRow
- Each action shows: Container A → Container B, Transfer Count, Biomass
- Validation: source container must have sufficient population

**AddActionRow Component**:
```tsx
function AddActionRow({ batchId, onAdd }: Props) {
  // Dropdowns for source/dest assignments (filtered by batch)
  // Inputs for transferred_count, biomass
  // Real-time validation: count ≤ source population
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <Select label="Source Container" />
      <Select label="Dest Container" />
      <Input label="Count" type="number" />
      <Input label="Biomass (kg)" type="number" step="0.01" />
      <Button onClick={handleAdd}>Add</Button>
    </div>
  );
}
```

---

### Task 2.4: Step 3 - Review & Plan
**File**: `client/src/features/batch-management/workflows/components/WorkflowReviewStep.tsx`

**Display**:
- Workflow summary card
- Table of all actions
- Total statistics: X actions, Y total biomass, Z total count
- Finance preview (if intercompany): "Est. value: €15,625"
- Warning badges: "This workflow will create an intercompany transaction"

**Actions**:
- "Back" button
- "Plan Workflow" button → Creates workflow + actions + calls plan()

---

## **PHASE 3: Workflow List & Detail Pages**

### Task 3.1: Workflow List Page
**File**: `client/src/features/batch-management/workflows/pages/WorkflowListPage.tsx`

**Features**:
- Table with columns: Workflow #, Batch, Type, Status, Progress, Started, Completion %
- Filters: Status (dropdown), Batch (search), Type (dropdown), Date range using **DateRangeFilter**
- Status badges using **StatusBadge** shared component
- Click row → navigate to detail page
- Mobile-responsive: Cards instead of table on small screens

**Shared Components Used**:
- ✅ DateRangeFilter (for date range filtering)
- ✅ StatusBadge (for workflow status display)

**Example**:
```tsx
export function WorkflowListPage() {
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useWorkflows(filters);
  
  return (
    <div className="space-y-6">
      <PageHeader>
        <h1>Transfer Workflows</h1>
        <Button onClick={() => navigate('/batches')}>
          Back to Batches
        </Button>
      </PageHeader>
      
      <WorkflowFilters value={filters} onChange={setFilters} />
      
      <WorkflowTable 
        workflows={data?.results ?? []}
        isLoading={isLoading}
        onRowClick={(id) => navigate(`/transfer-workflows/${id}`)}
      />
    </div>
  );
}
```

---

### Task 3.2: Workflow Detail Page
**File**: `client/src/features/batch-management/workflows/pages/WorkflowDetailPage.tsx`

**Layout (Desktop)**:
```
┌─────────────────────────────────────────────────────┐
│ Header: Workflow #TRF-2024-001 [StatusBadge]        │
│ Batch: BATCH-001 | Type: Lifecycle Transition       │
│ Progress: 2/4 actions (50%)                          │
│                                     [Cancel] [Plan]  │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────┐ ┌──────────────────────────┐│
│ │ Timeline Card       │ │ FinanceKpiCard (if IC)   ││
│ │ • Planned: Oct 20   │ │ Status: Pending Approval ││
│ │ • Started: Oct 21   │ │ Amount: €15,625          ││
│ │ • Expected: Oct 23  │ │ [Approve] (if manager)   ││
│ └─────────────────────┘ └──────────────────────────┘│
├─────────────────────────────────────────────────────┤
│ Actions Table                                        │
│ #  StatusBadge  Source    Dest      Count  Executed │
│ 1  COMPLETED    Tank-A1   Pen-B1    490    Oct 21  │
│ 2  COMPLETED    Tank-A2   Pen-B2    495    Oct 22  │
│ 3  PENDING      Tank-A3   Pen-B3    500    —       │
│ 4  PENDING      Tank-A4   Pen-B4    500    —       │
│    Each row has [View Details] [Execute] buttons    │
└─────────────────────────────────────────────────────┘
```

**Shared Components Used**:
- ✅ StatusBadge (for workflow and action statuses)
- ✅ FinanceKpiCard (for financial summary)
- ✅ formatCurrency, formatDate utilities

**Mobile Layout**:
- Simplified cards
- Execute button prominent (large, bottom-fixed)
- Swipe actions for quick access

---

### Task 3.3: Action Execution Dialog
**File**: `client/src/features/batch-management/workflows/components/ExecuteActionDialog.tsx`

**Mobile-First Design**:
```tsx
export function ExecuteActionDialog({ action, open, onClose }: Props) {
  const form = useForm({ schema: executeActionSchema });
  const executeAction = useExecuteAction();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Execute Transfer Action #{action.action_number}</DialogTitle>
          <DialogDescription>
            Transfer from {action.source_assignment_details.container_name}
            to {action.dest_assignment_details.container_name}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <FormField
            name="mortality_during_transfer"
            label="Mortality Count"
            type="number"
            defaultValue={0}
            help="Fish lost during transfer"
          />
          
          <FormField
            name="transfer_method"
            label="Transfer Method"
            type="select"
            options={[
              { value: 'NET', label: 'Net' },
              { value: 'PUMP', label: 'Pump' },
              { value: 'GRAVITY', label: 'Gravity' },
              { value: 'MANUAL', label: 'Manual' },
            ]}
          />
          
          <FormField
            name="water_temp_c"
            label="Water Temperature (°C)"
            type="number"
            step="0.1"
          />
          
          <FormField
            name="oxygen_level"
            label="Oxygen Level (mg/L)"
            type="number"
            step="0.1"
          />
          
          <FormField
            name="notes"
            label="Notes"
            type="textarea"
          />
        </Form>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={form.handleSubmit(handleExecute)}>
            Execute Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Mobile Optimizations**:
- Large touch targets (buttons min 44x44px)
- Number inputs use native mobile keyboards
- Optional fields collapsed by default ("Advanced" section)
- Works offline with optimistic updates (if PWA)

---

## **PHASE 4: Finance Integration UI**

### Task 4.1: Finance Summary Card
**File**: `client/src/features/batch-management/workflows/components/FinanceSummaryCard.tsx`

**Display** (on workflow detail page using shared components):
```tsx
import { FinanceKpiCard } from '@/features/shared/finance/FinanceKpiCard';
import { StatusBadge } from '@/features/shared/finance/StatusBadge';
import { formatCurrency } from '@/features/shared/finance/charts/theme';

export function FinanceSummaryCard({ workflow }: Props) {
  const { data: transaction } = useIntercompanyTransaction(workflow.finance_transaction);
  
  if (!workflow.is_intercompany) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Intercompany Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Status</Label>
          <StatusBadge status={transaction?.state || 'PENDING'} />
        </div>
        
        {/* Use shared FinanceKpiCard for value display */}
        <FinanceKpiCard
          title="Estimated Value"
          value={formatCurrency(workflow.estimated_total_value || 0)}
          icon={DollarSign}
          iconColor="text-green-600"
          subtitle={transaction?.policy_details && (
            `${transaction.policy_details.from_company_name} → ${transaction.policy_details.to_company_name}`
          )}
          isLoading={!workflow.estimated_total_value}
        />
        
        {transaction?.policy_details && (
          <div className="text-sm text-muted-foreground">
            Price: {formatCurrency(transaction.policy_details.price_per_kg)}/kg
          </div>
        )}
        
        {canApprove && (
          <Button 
            onClick={handleApprove}
            className="w-full"
          >
            Approve Transaction
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

**Shared Components Used**:
- ✅ FinanceKpiCard (for value display with icon)
- ✅ StatusBadge (for transaction status)
- ✅ formatCurrency utility

---

### Task 4.2: Pending Approvals Dashboard
**File**: `client/src/features/batch-management/workflows/pages/PendingApprovalsPage.tsx`

**For Farming Managers**:
```tsx
export function PendingApprovalsPage() {
  const { data: pendingTransactions } = usePendingApprovals();
  
  return (
    <div className="space-y-6">
      <PageHeader>
        <h1>Pending Transfer Approvals</h1>
        <Badge variant="secondary">{pendingTransactions?.length || 0} pending</Badge>
      </PageHeader>
      
      {pendingTransactions?.map((tx) => (
        <PendingApprovalCard
          key={tx.tx_id}
          transaction={tx}
          onApprove={handleApprove}
          onReview={handleReview}
        />
      ))}
    </div>
  );
}
```

---

## **PHASE 5: Integration & Testing**

### Task 5.1: Add to Batch Detail Page
**File**: `client/src/pages/batch-details.tsx` (existing)

**Add Section**:
```tsx
// In BatchDetailPage component
<Tabs>
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="transfers">Transfers</TabsTrigger> {/* NEW */}
    {/* existing tabs */}
  </TabsList>
  
  <TabsContent value="transfers">
    <BatchTransferWorkflowsSection batchId={batch.id} />
  </TabsContent>
</Tabs>
```

---

### Task 5.2: Add Navigation
**File**: `client/src/App.tsx`

```tsx
// Add routes
<Route path="/transfer-workflows" component={WorkflowListPage} />
<Route path="/transfer-workflows/:id" component={WorkflowDetailPage} />
<Route path="/transfer-workflows/approvals" component={PendingApprovalsPage} />
```

**Update Sidebar** (if exists):
```tsx
<NavItem 
  icon={ArrowRightLeft} 
  label="Transfer Workflows" 
  href="/transfer-workflows"
/>
```

---

### Task 5.3: E2E Tests
**File**: `e2e/transfer-workflows.spec.ts`

**Test Scenarios**:
1. Create workflow wizard (all 3 steps)
2. Plan workflow
3. Execute action (mobile viewport)
4. View workflow progress
5. Cancel workflow
6. Approve finance transaction (if integrated)

**Example**:
```typescript
test('Create and execute transfer workflow', async ({ page }) => {
  // Navigate to batch
  await page.goto('/batches/123');
  
  // Open wizard
  await page.click('text=Plan Transfer');
  
  // Step 1: Basic info
  await page.selectOption('[name="workflow_type"]', 'LIFECYCLE_TRANSITION');
  await page.fill('[name="planned_start_date"]', '2024-10-20');
  await page.click('text=Next');
  
  // Step 2: Add actions
  await page.selectOption('[name="source_assignment"]', '1');
  await page.selectOption('[name="dest_assignment"]', '2');
  await page.fill('[name="transferred_count"]', '500');
  await page.click('text=Add Action');
  await page.click('text=Next');
  
  // Step 3: Review & plan
  await page.click('text=Plan Workflow');
  
  // Verify redirect to detail page
  await expect(page).toHaveURL(/\/transfer-workflows\/\d+/);
  await expect(page.locator('text=PLANNED')).toBeVisible();
});
```

---

## **PHASE 6: Polish & Mobile UX**

### Task 6.1: Mobile Optimizations
- Test all screens on mobile viewports (320px, 375px, 414px)
- Ensure execute dialog is thumb-friendly
- Add pull-to-refresh on workflow list (if PWA)
- Test offline behavior (queue mutations)

---

### Task 6.2: Loading States & Errors
- Add skeleton loaders for tables/cards
- Handle API errors gracefully (show toast, retry button)
- Optimistic updates for execute action (instant feedback)
- Loading indicators on buttons during mutations

---

### Task 6.3: Accessibility
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader announcements (status changes)
- Focus management (dialog open → focus first field)
- ARIA labels on all interactive elements

---

## 📊 Success Criteria

- ✅ Freshwater manager can create workflow via wizard (desktop)
- ✅ Ship crew can execute actions via mobile-optimized dialog
- ✅ Progress updates in real-time (or on refresh)
- ✅ Farming manager can view and approve finance transactions
- ✅ All forms have validation with helpful error messages
- ✅ Mobile viewport < 768px fully functional
- ✅ E2E tests cover critical paths
- ✅ No accessibility violations (axe/WAVE audit)

---

## 🚀 Implementation Order Recommendation

**CRITICAL**: See `finance_features_alignment.md` for complete implementation strategy.

### **Recommended Sequence**

**Phase 0: Shared Finance Components** (Build FIRST)
- Create `features/shared/finance/` library
- Implement 6 shared components
- Write tests and Storybook stories
- **Benefit**: Used by BOTH Transfer Workflows and Finance Reporting

**Phase 1-3: Core Transfer Workflow UI**
- Uses shared components from Phase 0
- Works independently (no finance integration required)

**Phase 4: Finance Integration UI** (Optional - can be added later)
- Requires backend finance integration to be complete
- If backend not ready: Skip this phase, implement later

**Phase 5-6: Integration & Polish**
- Add to navigation
- E2E tests
- Mobile optimization

### **Coordination with Finance Reporting**

**If Finance Reporting is being built concurrently**:
- Coordinate on shared components (Phase 0)
- Share filter patterns and chart configurations
- Ensure consistent navigation structure

**If Finance Reporting is built first**:
- Reuse its shared components
- Follow established UI patterns
- Reference its implementation for consistency

---

## 🎯 File Structure Summary

```
client/src/features/batch-management/workflows/
├── api.ts                              # TanStack Query hooks
├── schemas.ts                          # Zod validation schemas
├── types.ts                            # TypeScript interfaces
├── components/
│   ├── CreateWorkflowWizard.tsx        # Main wizard dialog
│   ├── WorkflowBasicInfoStep.tsx       # Step 1 form
│   ├── WorkflowActionsStep.tsx         # Step 2 form
│   ├── WorkflowReviewStep.tsx          # Step 3 review
│   ├── AddActionRow.tsx                # Add action component
│   ├── WorkflowTable.tsx               # List table
│   ├── WorkflowFilters.tsx             # Filter form
│   ├── WorkflowProgressCard.tsx        # Progress visualization
│   ├── ExecuteActionDialog.tsx         # Mobile-friendly execute form
│   ├── FinanceSummaryCard.tsx          # Finance integration
│   └── PendingApprovalCard.tsx         # Approval card
├── pages/
│   ├── WorkflowListPage.tsx            # List page
│   ├── WorkflowDetailPage.tsx          # Detail page
│   └── PendingApprovalsPage.tsx        # Finance approvals
└── utils/
    ├── workflowHelpers.ts              # Status colors, formatting
    └── progressCalculations.ts         # Progress % logic
```

---

## 💡 Key Design Decisions

### 1. Wizard vs Single Form
**Decision**: Multi-step wizard ✅  
**Reason**: Transfer workflows are complex (5+ fields + multiple actions). Wizard reduces cognitive load, especially on mobile.

### 2. Inline Action Execution vs Dedicated Page
**Decision**: Dialog for execution ✅  
**Reason**: Ship crew needs quick access. Dialog keeps context visible (workflow progress) while executing.

### 3. Real-Time Updates vs Manual Refresh
**Decision**: Manual refresh with React Query cache ✅  
**Reason**: Transfer actions are infrequent (hours apart). WebSocket overhead not justified. Optimistic updates provide instant feedback.

### 4. Mobile-First vs Desktop-First
**Decision**: Mobile-first for execution, desktop for planning ✅  
**Reason**: Ship crew executes on mobile, managers plan on desktop. Design for primary use case per persona.

### 5. Shared Components vs Feature-Specific
**Decision**: Use shared finance components ✅  
**Reason**: Consistency with Finance Reporting feature, reduced code duplication, unified UX across finance features.  
**Reference**: See `finance_features_alignment.md` for complete shared component library.

---

## 🔗 Integration Points

**With Backend**:
- All API endpoints documented above
- Auto-generated TypeScript types (if OpenAPI spec available)

**With Shared Finance Components**:
- `features/shared/finance/DateRangeFilter` - Date filtering
- `features/shared/finance/GeographicFilters` - Geographic filtering
- `features/shared/finance/FinanceKpiCard` - Financial metrics display
- `features/shared/finance/StatusBadge` - Workflow/transaction status
- `features/shared/finance/charts/` - Recharts theme, formatters

**With Other Frontend Features**:
- `features/batch-management/` - Batch context, container selection
- `features/shared/` - Reusable hooks, components
- `features/audit-trail/` - History tracking (future)
- `features/finance-reporting/` - Cross-linking to feed cost reports

**With Finance Backend** (if integrated):
- Display estimated value on workflow creation
- Show pending approval badge
- Approve transaction button (Farming Manager only)
- Link to intercompany transaction details

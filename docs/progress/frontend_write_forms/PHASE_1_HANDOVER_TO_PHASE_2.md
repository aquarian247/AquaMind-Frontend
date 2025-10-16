# Phase 1 → Phase 2 Handover Document
## AquaMind Frontend CRU Forms

**Date**: 2025-10-06  
**Branch**: `feature/frontend-cru-forms`  
**Status**: Phase 1 COMPLETE ✅ → Phase 2 READY 🚀

---

## 📊 What Was Delivered in Phase 1

### Complete Infrastructure CRUD (8 Entities, 100%)

| Entity | Form | Delete | Hooks | Special Features |
|---|---|---|---|---|
| Geography | ✅ | ✅ | ✅ | Simple baseline |
| Area | ✅ | ✅ | ✅ | Lat/long, geography FK |
| FreshwaterStation | ✅ | ✅ | ✅ | Station type enum, lat/long |
| Hall | ✅ | ✅ | ✅ | Station FK, area_sqm |
| ContainerType | ✅ | ✅ | ✅ | Category enum |
| Container | ✅ | ✅ | ✅ | **XOR hall/area**, multiple FKs |
| Sensor | ✅ | ✅ | ✅ | **Cascading filters**, sensor type enum, dates |
| FeedContainer | ✅ | ✅ | ✅ | **XOR hall/area**, container type enum, cascading filters |

**Total Deliverables**:
- 16 Components (8 forms + 8 delete buttons)
- 40 API Hooks (5 per entity)
- 22 Total infrastructure components
- ~5,000 lines of production code
- ~3,000 lines of documentation
- 100% type safety (0 errors)
- Clean console (all warnings fixed)

---

## 🎯 Phase 2: Batch Management Forms

### What You'll Build (B2.1 - B2.4)

**B2.1 - Batch & Lifecycle Stages**
- Batch form (name, species FK, dates, status enum, type enum)
- Lifecycle stage form (stage_name, order, weight/length ranges)

**B2.2 - Container Assignments & Transfers**
- Assignment form (batch FK, container FK, population, weight)
- Transfer form (batch FK, from/to containers, quantity, reason)

**B2.3 - Growth Samples & Mortality Events**
- Growth sample form (batch FK, dates, weight, length, count)
- Mortality event form (batch FK, date, count, cause, description)

**B2.4 - Batch Media & Attachments** (if needed)
- File upload integration

---

## 🏗️ Proven Patterns from Phase 1

### Pattern 1: Simple Entity (Geography, ContainerType)

**When to use**: Entity with basic fields, no FKs or complex logic

**Example**:
```typescript
// 1. Validation schema (already exists in lib/validation/batch.ts)
export const myEntitySchema = z.object({
  name: nonEmptyString.max(100),
  description: optionalString,
})

// 2. API Hooks
export function useMyEntities() {
  return useQuery({
    queryKey: ['my-entities'],
    queryFn: () => ApiService.apiV1BatchMyEntitiesList(),
  })
}

export function useCreateMyEntity() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1BatchMyEntitiesCreate,
    description: 'Entity created successfully',
    invalidateQueries: ['my-entities'],
  })
}

// 3. Form Component (100-150 lines)
export function MyEntityForm({ entity, onSuccess, onCancel }) {
  const form = useForm({
    resolver: zodResolver(myEntitySchema),
    defaultValues: { name: entity?.name || '', description: entity?.description || '' }
  })
  
  const createMutation = useCreateMyEntity()
  
  return (
    <FormLayout form={form} onSubmit={handleSubmit} header={...} actions={...}>
      <FormSection title="Details">
        <FormField name="name" /> 
        <FormField name="description" />
      </FormSection>
    </FormLayout>
  )
}

// 4. Delete Button (80-90 lines)
export function MyEntityDeleteButton({ entity, onSuccess }) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteMyEntity()
  
  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete',
      required: true,
      minLength: 10
    })
    if (confirmed) {
      await deleteMutation.mutateAsync({ id: entity.id, __auditReason: reason })
      onSuccess?.()
    }
  }
  
  return (
    <>
      <DeleteGate fallback={null}>
        <Button onClick={handleDelete}>Delete</Button>
      </DeleteGate>
      <AuditReasonDialog open={dialogState.isOpen} options={dialogState.options} onConfirm={dialogState.onConfirm} onCancel={dialogState.onCancel} />
    </>
  )
}
```

**Time estimate**: 1-2 hours per entity

---

### Pattern 2: FK Dropdown (Area, Hall, FeedContainer)

**When to use**: Entity with parent FK relationship

**Key points**:
- Load parent entities with query hook
- Use empty string `|| ''` for controlled Select
- Parse string to number in `onValueChange`
- Show loading state while parent data loads

**Example**:
```typescript
const { data: parentsData, isLoading: parentsLoading } = useParents()

<FormField
  control={form.control}
  name="parent_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Parent *</FormLabel>
      <Select
        onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : ('' as any))}
        value={field.value?.toString() || ''}
        disabled={parentsLoading}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a parent..." />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {parentsData?.results?.map((parent) => (
            <SelectItem key={parent.id} value={parent.id.toString()}>
              {parent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### Pattern 3: Enum Dropdown (Status, Type, Category)

**When to use**: Field with predefined options

**Key points**:
- Export enum from validation schema
- Map over `enum.options` in Select
- No parsing needed (string values)

**Example**:
```typescript
export const batchStatusEnum = z.enum(['PLANNING', 'ACTIVE', 'HARVESTED'])

<FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Status *</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectContent>
          {batchStatusEnum.options.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### Pattern 4: XOR Fields (Container, FeedContainer)

**When to use**: Entity must be in field1 OR field2, not both

**Implementation (4 levels)**:

**Level 1 - Schema** (Zod refinement):
```typescript
export const mySchema = z
  .object({
    field1: z.coerce.number().nullable().optional(),
    field2: z.coerce.number().nullable().optional(),
  })
  .refine(
    (data) => data.field1 !== null || data.field2 !== null,
    { message: 'Either field1 or field2 must be specified', path: ['field1'] }
  )
```

**Level 2 - UI** (useEffect):
```typescript
const field1Value = form.watch('field1')
const field2Value = form.watch('field2')

useEffect(() => {
  if (field1Value && field2Value) {
    form.setValue('field2', null) // Clear field2 when field1 selected
  }
}, [field1Value, field2Value, form])
```

**Level 3 - Interaction** (onChange):
```typescript
<Select
  onValueChange={(value) => {
    field.onChange(value)
    form.setValue('otherField', null) // Clear other field
  }}
  disabled={!!otherFieldValue}
>
```

**Level 4 - Visual** (Alert + disabled state):
```typescript
<Alert>
  <AlertDescription>
    Must select <strong>either</strong> field1 <strong>or</strong> field2, not both.
  </AlertDescription>
</Alert>

<SelectTrigger>
  <SelectValue placeholder={otherField ? "Other field selected (disabled)" : "Select..."} />
</SelectTrigger>
```

---

### Pattern 5: Cascading Filters (Sensor, FeedContainer)

**When to use**: Large dropdown (1000+ items) needs drill-down filtering

**Implementation**:
```typescript
// State for filters
const [filterParent, setFilterParent] = useState<number | undefined>(undefined)

// Load parent options
const { data: parentsData } = useParents()

// Load child options filtered by parent
const { data: childrenData } = useChildren(
  filterParent ? { parent_id: filterParent } : undefined
)

// Clear target when changing filter
<Select
  value={filterParent?.toString() || 'none'}
  onValueChange={(value) => {
    if (value === 'none') {
      setFilterParent(undefined)
    } else {
      setFilterParent(parseInt(value, 10))
      form.setValue('targetField', '' as any) // Clear target
    }
  }}
>
  <SelectContent>
    <SelectItem value="none">No filter</SelectItem>
    {parentsData?.results?.map(...)}
  </SelectContent>
</Select>

// Show count feedback
<div className="text-sm text-green-700 bg-green-50 rounded p-2">
  ✓ Showing {childrenData?.results?.length} items in selected parent
</div>
```

---

### Pattern 6: Date Pickers (Sensor)

**When to use**: Date fields in YYYY-MM-DD format

**Implementation**:
```typescript
<FormField
  control={form.control}
  name="start_date"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Start Date</FormLabel>
      <FormControl>
        <Input type="date" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Notes**:
- HTML5 date input is simplest
- Returns YYYY-MM-DD string
- Use `optionalString` in schema for optional dates

---

## 🛠️ Foundation Utilities (Phase 0)

### Form Primitives

**Location**: `client/src/features/shared/components/form/`

```typescript
import { FormLayout, FormSection, FormActions } from '@/features/shared/components/form'

<FormLayout
  form={form}
  onSubmit={handleSubmit}
  header={{ title: 'Create Entity', description: 'Form description' }}
  actions={{
    primaryAction: { type: 'submit', children: 'Save' },
    secondaryAction: { type: 'button', variant: 'outline', children: 'Cancel', onClick: onCancel }
  }}
>
  <FormSection title="Details" description="Section description">
    {/* Fields */}
  </FormSection>
</FormLayout>
```

### Mutation Hook

**Location**: `client/src/features/shared/hooks/useCrudMutation.ts`

```typescript
import { useCrudMutation } from '@/features/shared/hooks/useCrudMutation'

const mutation = useCrudMutation({
  mutationFn: ApiService.apiV1BatchEntitiesCreate,
  description: 'Entity created successfully',
  invalidateQueries: ['entities'],
  // For delete with audit:
  injectAuditReason: (vars, reason) => ({ ...vars, change_reason: reason })
})
```

### Validation Schemas

**Location**: `client/src/lib/validation/`

All batch schemas already exist in `batch.ts`:
- `batchSchema`
- `lifeCycleStageSchema`
- `batchContainerAssignmentSchema`
- `batchTransferSchema`
- `growthSampleSchema`
- `mortalityEventSchema`

**Just import and use**:
```typescript
import { batchSchema, type BatchFormValues } from '@/lib/validation'
```

### Permission Gates

**Location**: `client/src/features/shared/permissions/`

```typescript
import { WriteGate, DeleteGate } from '@/features/shared/permissions'

// Wrap create/edit operations
<WriteGate fallback={<div>Read-only view</div>}>
  <Button type="submit">Save</Button>
</WriteGate>

// Wrap delete operations (Manager+ only)
<DeleteGate fallback={null}>
  <Button onClick={handleDelete}>Delete</Button>
</DeleteGate>
```

### Audit Trail

**Location**: `client/src/features/shared/audit/`

```typescript
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'

const { promptReason, dialogState } = useAuditReasonPrompt()

const handleDelete = async () => {
  const { confirmed, reason } = await promptReason({
    title: 'Confirm Delete',
    required: true,
    minLength: 10
  })
  if (confirmed) {
    await deleteMutation.mutateAsync({ id, __auditReason: reason })
  }
}

// Don't forget to render:
<AuditReasonDialog
  open={dialogState.isOpen}
  options={dialogState.options}
  onConfirm={dialogState.onConfirm}
  onCancel={dialogState.onCancel}
/>
```

---

## 🚀 Quick Start for Phase 2

### Step 1: Pick an Entity (e.g., Batch)

1. **Check API model**: `client/src/api/generated/models/Batch.ts`
2. **Check validation schema**: `client/src/lib/validation/batch.ts` (already exists!)
3. **Plan complexity**: Simple? FK dropdown? XOR? Cascading filters?

### Step 2: Create API Hooks

**File**: `client/src/features/batch-management/api.ts` (may already exist - extend it)

```typescript
import { useCrudMutation } from '@/features/shared/hooks/useCrudMutation'
import { ApiService } from '@/api/generated'

export function useBatches(filters?) {
  return useQuery({
    queryKey: ['batches', filters],
    queryFn: () => ApiService.apiV1BatchBatchesList(/* params */)
  })
}

export function useCreateBatch() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1BatchBatchesCreate,
    description: 'Batch created successfully',
    invalidateQueries: ['batches'],
  })
}

// ... update, delete, etc.
```

### Step 3: Create Form Component

**File**: `client/src/features/batch-management/components/BatchForm.tsx`

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { batchSchema, type BatchFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { WriteGate } from '@/features/shared/permissions'

export function BatchForm({ batch, onSuccess, onCancel }) {
  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: { /* ... */ }
  })
  
  const createMutation = useCreateBatch()
  
  // Follow Pattern 1, 2, or 3 depending on complexity
}
```

### Step 4: Create Delete Button

Copy from any Phase 1 delete button, adjust entity name.

### Step 5: Add to Management Page (Optional)

Add to `InfrastructureManagementPage` pattern or create `BatchManagementPage`.

---

## 📋 Pre-Implementation Checklist

**Before coding ANY entity**:

1. ✅ Check `client/src/api/generated/models/{Entity}.ts` for exact fields
2. ✅ Verify validation schema in `client/src/lib/validation/batch.ts`
3. ✅ Identify pattern: Simple / FK / Enum / XOR / Cascading
4. ✅ Plan permission requirements (Write vs Delete)
5. ✅ Determine if audit trail needed (yes for deletes)

**Common mistakes to avoid**:
- ❌ Don't assume schema matches API (ALWAYS check generated types)
- ❌ Don't use `undefined` for Select defaultValues (use empty string)
- ❌ Don't forget DialogDescription for accessibility
- ❌ Don't use empty string in SelectItem value (use 'none' instead)

---

## 🔧 Technical Reference

### Always Check Generated Types First

**Before creating a form**, open:
```
client/src/api/generated/models/{Entity}.ts
```

Look for:
- Required vs optional fields
- Enums (check exact values)
- FK relationships (check field names)
- Readonly fields (don't include in form)

### Validation Schema Must Match API

**Phase 1 lessons**:
- FreshwaterStation: Had `location_address`, actually has `station_type`, `latitude`, `longitude`
- Sensor: Had `sensor_id`, actually has `name` + `sensor_type` enum
- FeedContainer: Thought it was just `hall`, actually has `hall` XOR `area`

**Prevention**: Reference generated types FIRST, then create/fix schema.

### Select Component Rules

**Controlled component** - Must have consistent value:
```typescript
// ✅ CORRECT
defaultValues: {
  parent_id: entity?.parent_id || ('' as any),  // Not undefined!
}

value={field.value?.toString() || ''}  // Always fallback to empty string
onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : ('' as any))}
```

**No empty string in SelectItem**:
```typescript
// ❌ WRONG
<SelectItem value="">None</SelectItem>

// ✅ CORRECT
<SelectItem value="none">No filter</SelectItem>
// Then handle in onValueChange:
if (value === 'none') {
  setFilter(undefined)
}
```

### Dialog Accessibility

**Always include both**:
```typescript
<DialogContent>
  <DialogHeader className="sr-only">
    <DialogTitle>Create Entity</DialogTitle>
    <DialogDescription>Form for creating entity</DialogDescription>
  </DialogHeader>
  <YourForm />
</DialogContent>
```

---

## 📁 File Organization

### Where to Put Things

```
client/src/
├── features/
│   ├── batch-management/           # Phase 2 domain
│   │   ├── api.ts                  # Query/mutation hooks
│   │   ├── components/             # Forms and UI components
│   │   │   ├── BatchForm.tsx
│   │   │   ├── BatchDeleteButton.tsx
│   │   │   └── ...
│   │   ├── pages/                  # Page components (if needed)
│   │   └── __tests__/              # Tests
│   ├── shared/                     # Reusable utilities (Phase 0)
│   │   ├── components/form/        # FormLayout, FormSection
│   │   ├── hooks/                  # useCrudMutation
│   │   ├── permissions/            # WriteGate, DeleteGate
│   │   └── audit/                  # Audit prompts
│   └── infrastructure/             # Phase 1 (reference)
├── lib/
│   └── validation/                 # All schemas here
│       ├── batch.ts                # Batch domain schemas (ready!)
│       └── ...
└── api/generated/                  # Generated client (don't edit)
```

---

## 🧪 Testing Strategy

### What to Test

**Essential** (must have):
- Form renders without crashing
- Required field validation
- Submit success flow
- API error handling

**Important** (should have):
- Edit mode pre-fills data
- Cancel button works
- Permission gates work
- Enum dropdowns populated

**Nice to have**:
- FK dropdown loading states
- XOR logic validation
- Cascading filter behavior

### Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock API hooks
vi.mock('../api', () => ({
  useCreateEntity: vi.fn(),
  useUpdateEntity: vi.fn(),
}))

// Mock permissions (allow all by default for testing)
vi.mock('@/features/shared/permissions', () => ({
  WriteGate: ({ children }: any) => <>{children}</>,
}))

describe('EntityForm', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } }
    })
    vi.clearAllMocks()
  })

  const renderForm = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <EntityForm {...props} />
      </QueryClientProvider>
    )
  }

  it('renders create form', () => {
    const mockCreate = { mutateAsync: vi.fn(), isPending: false }
    vi.mocked(api.useCreateEntity).mockReturnValue(mockCreate as any)
    
    renderForm()
    
    expect(screen.getByRole('heading', { name: 'Create Entity' })).toBeInTheDocument()
  })

  it('submits valid data', async () => {
    const user = userEvent.setup()
    const mockCreate = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }
    const mockOnSuccess = vi.fn()
    vi.mocked(api.useCreateEntity).mockReturnValue(mockCreate as any)

    renderForm({ onSuccess: mockOnSuccess })

    await user.type(screen.getByLabelText('Name'), 'Test Entity')
    await user.click(screen.getByRole('button', { name: 'Create Entity' }))

    await waitFor(() => {
      expect(mockCreate.mutateAsync).toHaveBeenCalled()
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})
```

---

## ⚠️ Common Pitfalls (Learned from Phase 1)

### 1. Schema Mismatches

**Problem**: Validation schema doesn't match generated API model  
**Solution**: ALWAYS check `client/src/api/generated/models/` first  
**Example**: FreshwaterStation had wrong fields, Sensor had wrong field names

### 2. Undefined in Select

**Problem**: React warning about controlled/uncontrolled  
**Solution**: Use `|| ('' as any)` in defaultValues, `|| ''` in value prop

### 3. Missing Dialog Accessibility

**Problem**: Radix UI warnings about missing DialogTitle/Description  
**Solution**: Always include both (can hide with `sr-only` class)

### 4. Empty SelectItem Value

**Problem**: Radix doesn't allow `value=""` in SelectItem  
**Solution**: Use `value="none"` and handle in onValueChange

### 5. XOR Logic Incomplete

**Problem**: Only implementing at one level  
**Solution**: Implement at 4 levels (schema, UI, interaction, visual)

---

## 📊 Quality Gates

**Every commit must**:
- ✅ Pass `npm run type-check` (0 errors)
- ✅ Have clean console (no warnings)
- ✅ Follow established patterns
- ✅ Include proper permission gates
- ✅ Include audit trails on deletes

**Before phase completion**:
- ✅ All entities have CRUD forms
- ✅ Manual QA performed
- ✅ Documentation updated
- ✅ Commit messages clear

---

## 🎓 Key Learnings from Phase 1

### What Worked Well

1. **Foundation is solid** - Phase 0 utilities saved massive time
2. **Patterns are reusable** - Copied and adapted for each entity
3. **Type safety catches errors** - Schema/API mismatches caught at compile time
4. **Iterative approach** - Started simple (Geography), built complexity gradually
5. **User feedback critical** - Cascading filters came from testing with realistic data

### What to Replicate

1. **Always check generated types first** - Don't assume, verify
2. **Start with simplest entity** - Build confidence with easy wins
3. **Test as you go** - Don't wait until end
4. **Fix warnings immediately** - Clean console = better UX
5. **Document special patterns** - Help future developers

### What to Avoid

1. **Don't reinvent patterns** - Use what Phase 1 established
2. **Don't skip type checking** - Run `npm run type-check` frequently
3. **Don't assume schemas are correct** - We fixed 3 in Phase 1
4. **Don't use undefined in Select** - Use empty string
5. **Don't forget DialogDescription** - Accessibility matters

---

## 📦 Commit Strategy

### Commit Message Format

```
feat(domain): implement Entity CRUD forms (TaskID)

Brief description of what was implemented.

Components Added:
- EntityForm: Features and fields
- EntityDeleteButton: Audit trail details

Features:
- List key features
- Mention special patterns (XOR, cascading, etc.)

Quality:
- Type-check clean
- Patterns followed
```

### When to Commit

- After each entity is complete (form + delete + hooks)
- After fixing bugs from manual testing
- After consolidating documentation
- At task completion (e.g., after B2.1)

---

## 🎯 Phase 2 Task Breakdown

### B2.1 - Batch & Lifecycle Stages (Start Here)

**Complexity**: Medium  
**Estimated effort**: 2-3 hours

**Batch Form**:
- Pattern: FK dropdown (species)
- Pattern: Enum dropdown (status, type)
- Pattern: Date pickers (start_date, harvest_date)
- Special: Date validation (harvest > start)

**Lifecycle Stage Form**:
- Pattern: Simple entity
- Pattern: FK dropdown (batch)
- Fields: stage_name, stage_order, min/max weight/length

**Tips**:
- Load species for dropdown
- Show batch type options clearly
- Validate date ranges

### B2.2 - Container Assignments & Transfers

**Complexity**: High  
**Estimated effort**: 3-4 hours

**Assignment Form**:
- Pattern: FK dropdowns (batch, container)
- Pattern: Cascading filter (filter containers like Sensor form)
- Special: Population and weight validation

**Transfer Form**:
- Pattern: FK dropdowns (batch, from_container, to_container)
- Special: Capacity validation (don't exceed target capacity)
- Special: Reason field (audit trail)

**Tips**:
- Use cascading filters for container selection
- Validate capacity constraints
- Show current vs target capacity

### B2.3 - Growth Samples & Mortality Events

**Complexity**: Low-Medium  
**Estimated effort**: 2-3 hours

**Growth Sample Form**:
- Pattern: FK dropdown (batch)
- Pattern: Date picker
- Fields: weight, length, sample_count, notes

**Mortality Event Form**:
- Pattern: FK dropdown (batch)
- Pattern: Date picker
- Pattern: Enum dropdown (cause)
- Fields: count, description

**Tips**:
- Simple forms, no XOR or cascading
- Focus on validation (positive numbers, valid dates)

### B2.4 - Batch Media & Attachments

**Complexity**: TBD (depends on requirements)  
**Estimated effort**: 2-4 hours

Evaluate if needed. If file upload required, research existing upload patterns.

---

## 📚 Commands Reference

```bash
# Start Phase 2
cd /Users/aquarian247/Projects/AquaMind-Frontend
git checkout feature/frontend-cru-forms
git pull origin feature/frontend-cru-forms

# Development
npm run type-check          # Run frequently
npm run test -- batch       # Targeted tests

# Verification
npm run type-check          # Must pass (0 errors)
npm run test                # All tests must pass

# Commit
git add .
git commit -m "feat(batch): implement Batch CRUD forms (B2.1)"
git push origin feature/frontend-cru-forms
```

---

## 🎉 You're Set Up for Success!

**What's ready**:
- ✅ All foundation utilities (Phase 0)
- ✅ All infrastructure patterns (Phase 1)
- ✅ Batch validation schemas (Phase 0)
- ✅ Clean starting point (all tests passing)
- ✅ Established patterns for every scenario

**What you need to do**:
- Follow the patterns from Phase 1
- Check generated types before coding
- Test as you go
- Keep console clean

**Estimated Phase 2 timeline**:
- B2.1: 2-3 hours
- B2.2: 3-4 hours
- B2.3: 2-3 hours
- B2.4: 2-4 hours (if needed)
- **Total**: 9-14 hours (2-3 sessions)

---

## 📞 Support

**Questions about patterns?**  
→ Search Phase 1 code for similar examples

**Questions about foundation?**  
→ Check `client/src/features/shared/` for utilities

**API unclear?**  
→ Check `client/src/api/generated/`

**Type errors?**  
→ Run `npm run type-check` to see exactly what's wrong

---

**Phase 1 Complete**: 8/8 infrastructure entities ✅  
**Phase 2 Ready**: All tools and patterns established 🚀  
**Expected outcome**: High-quality batch management forms using proven patterns

Good luck! You've got this! 🎉

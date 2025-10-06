# Phase 1 (I1.1) - Ready to Start: Geography & Area Management Forms

**Repository**: `AquaMind-Frontend`  
**Branch**: `feature/frontend-cru-forms` (already exists, pushed)  
**Task**: I1.1 - Geography & Area Management Forms  
**Estimated Effort**: 1-2 sessions

---

## Context

Phase 0 is **complete and tested** ✅. All foundation utilities are ready:
- ✅ Mutation hook (`useCrudMutation`)
- ✅ Form primitives (`FormLayout`, `FormSection`, `FormActions`)
- ✅ Validation schemas (`geographySchema`, `areaSchema`)
- ✅ Permission system (`usePermissionGuard`, `WriteGate`, `DeleteGate`)
- ✅ Audit system (`useAuditReasonPrompt`, `AuditReasonDialog`)
- ✅ API verified (100% coverage, zero gaps)

**All tests passing (746)**, **type-check clean**, **documentation complete**.

---

## Your Task: Implement Geography & Area CRUD Forms

### Scope (I1.1)

Build complete create, update, and delete workflows for:

**1. Geography Management** (`infrastructure_geography`)
- Simple entity: name (required, max 100 chars) + description (optional)
- Modal or inline forms for create/edit
- Delete with audit reason prompt (required)
- List view with inline actions (edit, delete)
- Permission gates: Write for create/edit, Manager for delete

**2. Area Management** (`infrastructure_area`)
- More complex: name, geography (FK), latitude (-90 to 90), longitude (-180 to 180), max_biomass (positive decimal), active (boolean)
- Modal or inline forms for create/edit
- Delete with audit reason prompt (required)
- List view with geography filtering
- Permission gates: Write for create/edit, Manager for delete

### Deliverables

**Required**:
1. Geography create/edit/delete forms
2. Area create/edit/delete forms
3. Query hooks in `features/infrastructure/api.ts`
4. Mutation integration with `useCrudMutation`
5. Permission gates on all write operations
6. Audit prompts on delete operations
7. Component tests for forms (validation, submission, error handling)
8. Type-check and full test suite passing

**Optional** (if time permits):
- Bulk operations
- Advanced filtering UI
- Export/import functionality

---

## Pre-Implementation Checklist (5 min)

Before coding, verify the foundation:

### 1. API Verification ✅ (Already Done)
```bash
# Geography endpoints exist:
# - apiV1InfrastructureGeographiesList
# - apiV1InfrastructureGeographiesCreate
# - apiV1InfrastructureGeographiesRetrieve
# - apiV1InfrastructureGeographiesUpdate
# - apiV1InfrastructureGeographiesPartialUpdate
# - apiV1InfrastructureGeographiesDestroy
# - apiV1InfrastructureGeographiesSummaryRetrieve (bonus)

# Area endpoints exist:
# - apiV1InfrastructureAreasList
# - apiV1InfrastructureAreasCreate
# - apiV1InfrastructureAreasRetrieve
# - apiV1InfrastructureAreasUpdate
# - apiV1InfrastructureAreasPartialUpdate
# - apiV1InfrastructureAreasDestroy
```

**Status**: ✅ Confirmed in `docs/progress/frontend_write_forms/backend_gaps.md`

### 2. Validation Schemas ✅ (Already Done)
```typescript
// client/src/lib/validation/infrastructure.ts
import { geographySchema, areaSchema, GeographyFormValues, AreaFormValues } from '@/lib/validation'
```

**Status**: ✅ Created in F0.2, tested (24 tests)

### 3. Permission Requirements
- **Create/Edit**: `canWrite` (excludes VIEW role)
- **Delete**: `canDelete` (Manager or higher)
- **View**: All authenticated users

**Components**: ✅ `WriteGate`, `DeleteGate` ready (F0.3)

### 4. Form Primitives ✅
```typescript
import { FormLayout, FormSection, FormActions } from '@/features/shared/components/form'
import { useCrudMutation } from '@/features/shared/hooks/useCrudMutation'
```

**Status**: ✅ Created in F0.1, tested

---

## Implementation Guide

### Step 1: Create Feature Structure

```bash
# Create infrastructure feature folders (if not exist)
mkdir -p client/src/features/infrastructure/components
mkdir -p client/src/features/infrastructure/pages
mkdir -p client/src/features/infrastructure/__tests__
```

### Step 2: Create Query Hooks

**File**: `client/src/features/infrastructure/api.ts`

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { ApiService } from '@/api/generated'
import { useCrudMutation } from '@/features/shared/hooks/useCrudMutation'

// Geography hooks
export function useGeographies() {
  return useQuery({
    queryKey: ['geographies'],
    queryFn: () => ApiService.apiV1InfrastructureGeographiesList()
  })
}

export function useGeography(id: number) {
  return useQuery({
    queryKey: ['geography', id],
    queryFn: () => ApiService.apiV1InfrastructureGeographiesRetrieve(id),
    enabled: !!id
  })
}

export function useCreateGeography() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureGeographiesCreate,
    description: 'Geography created successfully',
    invalidateQueries: ['geographies']
  })
}

export function useUpdateGeography() {
  return useCrudMutation({
    mutationFn: ({ id, ...data }) => 
      ApiService.apiV1InfrastructureGeographiesUpdate(id, data),
    description: 'Geography updated successfully',
    invalidateQueries: ['geographies']
  })
}

export function useDeleteGeography() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureGeographiesDestroy,
    description: 'Geography deleted',
    invalidateQueries: ['geographies'],
    injectAuditReason: (vars, reason) => ({
      ...vars,
      change_reason: reason
    })
  })
}

// Similar pattern for Areas...
```

### Step 3: Create Geography Form Component

**File**: `client/src/features/infrastructure/components/GeographyForm.tsx`

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { geographySchema, type GeographyFormValues } from '@/lib/validation'
import { FormLayout, FormSection, FormActions } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { WriteGate } from '@/features/shared/permissions'

interface GeographyFormProps {
  geography?: Geography
  onSuccess?: () => void
  onCancel?: () => void
}

export function GeographyForm({ geography, onSuccess, onCancel }: GeographyFormProps) {
  const isEdit = !!geography

  const form = useForm<GeographyFormValues>({
    resolver: zodResolver(geographySchema),
    defaultValues: geography || { name: '', description: '' }
  })

  const createMutation = useCreateGeography()
  const updateMutation = useUpdateGeography()

  const handleSubmit = async (data: GeographyFormValues) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: geography.id, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
    onSuccess?.()
  }

  return (
    <FormLayout
      form={form}
      onSubmit={form.handleSubmit(handleSubmit)}
      header={{
        title: isEdit ? 'Edit Geography' : 'Create Geography',
        description: 'Manage geographical regions for aquaculture operations.'
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEdit ? 'Save Changes' : 'Create',
          disabled: form.formState.isSubmitting
        },
        secondaryAction: onCancel ? {
          type: 'button',
          onClick: onCancel,
          children: 'Cancel'
        } : undefined
      }}
    >
      <FormSection title="Details" description="Basic geography information">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Faroe Islands" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional description..."
                  rows={3}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>
    </FormLayout>
  )
}
```

### Step 4: Create Delete Button with Audit

**File**: `client/src/features/infrastructure/components/GeographyDeleteButton.tsx`

```typescript
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { DeleteGate } from '@/features/shared/permissions'
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useDeleteGeography } from '../api'

interface GeographyDeleteButtonProps {
  geography: Geography
  onSuccess?: () => void
}

export function GeographyDeleteButton({ geography, onSuccess }: GeographyDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteGeography()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Delete Geography',
      description: `Are you sure you want to delete "${geography.name}"? This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Reason for deletion (e.g., duplicate entry, no longer in use)...'
    })

    if (confirmed) {
      await deleteMutation.mutateAsync({ id: geography.id, __auditReason: reason })
      onSuccess?.()
    }
  }

  return (
    <>
      <DeleteGate>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </DeleteGate>
      <AuditReasonDialog {...dialogState} />
    </>
  )
}
```

### Step 5: Write Tests

**File**: `client/src/features/infrastructure/__tests__/GeographyForm.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GeographyForm } from '../components/GeographyForm'
import * as api from '../api'

vi.mock('../api')

describe('GeographyForm', () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('renders create form', () => {
    render(<GeographyForm />, { wrapper })
    expect(screen.getByText('Create Geography')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<GeographyForm />, { wrapper })

    await user.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument()
    })
  })

  it('submits valid data', async () => {
    const user = userEvent.setup()
    const mockMutate = vi.fn().mockResolvedValue({})
    vi.mocked(api.useCreateGeography).mockReturnValue({
      mutateAsync: mockMutate,
      isPending: false
    } as any)

    render(<GeographyForm />, { wrapper })

    await user.type(screen.getByLabelText(/name/i), 'Faroe Islands')
    await user.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: 'Faroe Islands',
        description: undefined
      })
    })
  })
})
```

---

## Quick Reference

### Foundation Utilities (Already Built)

```typescript
// Validation
import { geographySchema, areaSchema } from '@/lib/validation'

// Forms
import { FormLayout, FormSection, FormActions } from '@/features/shared/components/form'

// Mutations
import { useCrudMutation } from '@/features/shared/hooks/useCrudMutation'

// Permissions
import { WriteGate, DeleteGate, usePermissionGuard } from '@/features/shared/permissions'

// Audit
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'

// API
import { ApiService } from '@/api/generated'
```

### Documentation to Review (10 min)

**Essential**:
1. `docs/progress/frontend_write_forms/README.md` - Start here
2. `docs/progress/frontend_write_forms/frontend_forms.md` - Patterns guide
3. `docs/progress/frontend_write_forms/session_checklist.md` - Implementation workflow

**Reference**:
4. `docs/progress/frontend_write_forms/backend_gaps.md` - API coverage
5. `client/src/features/shared/pages/SpeciesExampleForm.tsx` - Reference implementation
6. `client/src/lib/validation/README.md` - Validation library guide

---

## Success Criteria

- [ ] Geography create form works (validation, submission, success toast)
- [ ] Geography edit form works (pre-fills data, updates correctly)
- [ ] Geography delete works (audit prompt, confirmation, success)
- [ ] Area create form works (includes lat/long validation, geography dropdown)
- [ ] Area edit form works (pre-fills all fields including geography)
- [ ] Area delete works (audit prompt with required reason)
- [ ] List views show data with inline actions
- [ ] Permission gates hide/show based on user role
- [ ] All tests pass (existing + new)
- [ ] Type-check passes
- [ ] No lint errors (note: no `npm run lint` script exists)
- [ ] Forms work in light and dark themes
- [ ] Responsive layout on mobile/tablet/desktop

---

## Commands to Run

```bash
# 1. Start in the right place
cd /Users/aquarian247/Projects/AquaMind-Frontend
git checkout feature/frontend-cru-forms
git pull origin feature/frontend-cru-forms

# 2. During development
npm run type-check  # Run frequently
npm run test -- infrastructure  # Targeted tests

# 3. Before commit
npm run type-check
npm run test  # Full suite

# 4. Commit work
git add .
git commit -m "feat(infrastructure): implement Geography and Area CRUD forms (I1.1)"
git push origin feature/frontend-cru-forms
```

---

## Common Patterns (Copy-Paste Ready)

### Geography Dropdown for Area Form
```typescript
const { data: geographies } = useQuery({
  queryKey: ['geographies'],
  queryFn: () => ApiService.apiV1InfrastructureGeographiesList()
})

<FormField
  control={form.control}
  name="geography"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Geography *</FormLabel>
      <Select
        onValueChange={field.onChange}
        value={field.value?.toString()}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select geography" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {geographies?.results?.map(g => (
            <SelectItem key={g.id} value={g.id.toString()}>
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Lat/Long Inputs
```typescript
<FormField
  control={form.control}
  name="latitude"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Latitude *</FormLabel>
      <FormControl>
        <Input
          type="number"
          step="0.000001"
          placeholder="60.123456"
          {...field}
        />
      </FormControl>
      <FormDescription>-90 to 90</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Delete with Audit
```typescript
const handleDelete = async () => {
  const { confirmed, reason } = await promptReason({
    title: 'Confirm Delete',
    description: 'This action cannot be undone.',
    required: true,
    minLength: 10
  })
  
  if (confirmed) {
    await deleteMutation.mutateAsync({ id: item.id, __auditReason: reason })
  }
}

// Don't forget:
<AuditReasonDialog {...dialogState} />
```

---

## Tips for Success

### 1. Start Simple
- Build Geography form first (simpler)
- Get create working, then edit, then delete
- Test each step before moving on

### 2. Use Existing Patterns
- Copy from `SpeciesExampleForm` as template
- Follow same structure as other forms
- Reuse query hook patterns

### 3. Test As You Go
```bash
npm run test -- GeographyForm
npm run type-check
```

### 4. Handle Edge Cases
- Empty dropdown options (loading state)
- API errors (toast notifications automatic)
- Validation errors (FormMessage displays automatically)
- Permission denial (gates hide buttons)

### 5. Modal vs Inline
Consider using Shadcn Dialog for create/edit:
```typescript
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <GeographyForm onSuccess={() => setIsOpen(false)} />
  </DialogContent>
</Dialog>
```

---

## Troubleshooting

**Issue**: Type errors  
**Fix**: Check `client/src/api/generated/models/Geography.ts` for exact types

**Issue**: Validation not working  
**Fix**: Ensure `zodResolver(geographySchema)` in useForm

**Issue**: Permission gate not hiding  
**Fix**: Check AuthContext user role, verify `canWrite`/`canDelete` flags

**Issue**: Audit dialog not showing  
**Fix**: Ensure `<AuditReasonDialog {...dialogState} />` is rendered

**Issue**: Tests failing  
**Fix**: Mock API hooks, provide QueryClient wrapper

---

## Example File Structure After I1.1

```
features/infrastructure/
├── api.ts                          # Query/mutation hooks (NEW)
├── components/
│   ├── GeographyForm.tsx          # NEW
│   ├── GeographyDeleteButton.tsx  # NEW
│   ├── AreaForm.tsx               # NEW
│   └── AreaDeleteButton.tsx       # NEW
├── pages/
│   ├── GeographiesPage.tsx        # NEW (or extend existing)
│   └── AreasPage.tsx              # NEW (or extend existing)
└── __tests__/
    ├── GeographyForm.test.tsx     # NEW
    └── AreaForm.test.tsx           # NEW
```

---

## Expected Deliverables Summary

**Code**:
- 8-10 new component files
- 6+ new test files
- Query/mutation hooks in api.ts
- Integration with existing pages

**Tests**:
- Form validation tests
- Submit success/error tests
- Permission gate tests
- Audit prompt tests
- Target: 20-30 new tests

**Quality**:
- All tests passing
- Type-check clean
- Manual QA performed (light/dark, responsive)

---

## Context for Next Agent

You're taking over a **well-architected foundation**:
- 746 tests passing (no regressions allowed)
- TypeScript strict mode (no type errors)
- Clear patterns established (follow them)
- Comprehensive documentation (read it)

**Your goal**: Build on this foundation to deliver production-quality Geography and Area CRUD forms that work seamlessly with existing infrastructure pages.

**Expected output**: Clean, tested, documented implementation that matches the quality bar set in Phase 0.

---

## Final Checklist Before Starting

- [ ] Read `docs/progress/frontend_write_forms/README.md`
- [ ] Review `SpeciesExampleForm` for reference
- [ ] Check `session_checklist.md` workflow
- [ ] Verify you're on `feature/frontend-cru-forms` branch
- [ ] Run `npm run test` to confirm starting state is clean
- [ ] Review `backend_gaps.md` section on Infrastructure

---

**Ready to implement?** Start with Geography (simpler) → then Area → then delete buttons → then tests → then manual QA.

**Good luck! 🚀**

# Frontend Form Foundations

## Shared Mutation Utility

- `useCrudMutation` centralizes mutation orchestration for TanStack Query. It maps backend errors into UI-friendly messages, triggers design system toasts, and invalidates query keys. Pass `mutationFn`, `description`, and `invalidateQueries`. Example:
  ```tsx
  const createSpecies = useCrudMutation({
    mutationFn: ApiService.apiV1BatchSpeciesCreate,
    description: 'Species created successfully',
    invalidateQueries: [speciesQueryKey],
  })
  ```

## Form Layout Primitives

- `FormLayout`: wraps `react-hook-form` instance with shared header, body, and action slot.
- `FormSection`: border + spacing consistent with Shadcn cards; use to group inputs.
- `FormActions`: handles sticky submit/cancel button layout with responsive behavior.

### Composition pattern

```tsx
<FormLayout
  form={form}
  onSubmit={handleSubmit}
  header={{ title: 'Create Species', description: 'Defines taxonomy metadata.' }}
  actions={{ primaryAction: { type: 'submit', children: 'Save' } }}
>
  <FormSection title="Details" description="Basic identification fields.">
    <FormField ... />
  </FormSection>
</FormLayout>
```

- Spacing uses Tailwind `space-y-6` and theme tokens. Works in dark/light modes.
- Integrate `FormField`, `FormItem`, `FormControl`, `FormMessage` from `@/components/ui/form` for consistent validation display.

## Validation Schema Library

### Organization

Validation schemas are organized by domain in `client/src/lib/validation/`:

```
validation/
├── index.ts              # Main export barrel
├── schemas.ts            # Species schema (F0.1 reference)
├── infrastructure.ts     # Infrastructure domain schemas
├── batch.ts             # Batch domain schemas
├── utils/
│   ├── common.ts        # Common validators (nonEmptyString, etc.)
│   ├── coercion.ts      # Type coercion utilities (decimalString, etc.)
│   └── types.ts         # TypeScript helper types
└── __tests__/           # Test coverage for all schemas
```

### Core Utilities

**Common Validators** (`utils/common.ts`):
- `nonEmptyString` - Required string with whitespace trimming
- `optionalString` - Converts empty strings to undefined
- `optionalNumericString` - Coerces strings to numbers
- `booleanWithDefault` - Handles boolean/string boolean conversion
- `dateString` - Validates YYYY-MM-DD format

**Coercion Utilities** (`utils/coercion.ts`):
- `decimalString` - String-based decimal with range validation
- `optionalDecimalString` - Optional decimal fields
- `latitudeString` / `longitudeString` - Geographic coordinates
- `positiveDecimalString` - Non-negative decimals

**Type Helpers** (`utils/types.ts`):
- `FormValues<T>` - Extract form type from schema
- `PartialBy<T, K>` - Make specific fields optional
- `WritableFields<T>` - Filter readonly fields from generated models

### Domain Schemas

**Infrastructure** (`infrastructure.ts`):
- `geographySchema` - Geography regions
- `areaSchema` - Sea areas with lat/long validation
- `containerTypeSchema` - Container types with category enum
- `containerSchema` - Containers with hall/area mutual exclusion
- `hallSchema` - Production halls
- `freshwaterStationSchema` - Freshwater facilities
- `sensorSchema` - Sensor devices
- `feedContainerSchema` - Feed storage containers

**Batch** (`batch.ts`):
- `batchSchema` - Batch lifecycle management
- `lifeCycleStageSchema` - Growth stages with weight/length ranges
- `batchContainerAssignmentSchema` - Population assignments
- `batchTransferSchema` - Inter-container transfers
- `growthSampleSchema` - Growth measurements
- `mortalityEventSchema` - Mortality tracking

### Adding New Schemas

1. **Create domain file** (e.g., `inventory.ts`)
2. **Import utilities**:
   ```ts
   import { nonEmptyString, optionalString } from './utils/common'
   import { positiveDecimalString } from './utils/coercion'
   ```
3. **Reference generated model** from `client/src/api/generated/models/`
4. **Define schema with type export**:
   ```ts
   export const myEntitySchema = z.object({
     name: nonEmptyString.max(100),
     quantity: positiveDecimalString({ required: true })
   })
   export type MyEntityFormValues = z.infer<typeof myEntitySchema>
   ```
5. **Add to index exports**: Update `validation/index.ts`
6. **Write tests**: Add test file in `__tests__/`

### Type Safety Bridge

Schemas bridge form inputs (strings) to API expectations:

```ts
// Generated model (from API)
type Area = {
  name: string
  latitude: string  // API expects string representation
  max_biomass: string
  active?: boolean
}

// Form schema validates and coerces
const areaSchema = z.object({
  name: nonEmptyString,
  latitude: latitudeString,  // Validates -90 to 90, returns formatted string
  max_biomass: positiveDecimalString({ required: true }),
  active: booleanWithDefault(true)
})

// Type-safe form values
type AreaFormValues = z.infer<typeof areaSchema>
```

### Testing Patterns

Tests cover:
- **Required field validation** - Empty string rejection
- **Trimming and transformation** - Whitespace handling
- **Range constraints** - Min/max enforcement
- **Enum validation** - Valid option acceptance
- **Coercion accuracy** - String-to-number conversion
- **Edge cases** - Empty strings, undefined, invalid formats

Example test structure:
```ts
describe('mySchema', () => {
  it('validates required fields', () => {
    const result = mySchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('accepts valid data', () => {
    const result = mySchema.parse({ name: 'Test', value: '123.45' })
    expect(result.value).toBe('123.45')
  })
})
```

### Tests

- Unit tests live under `client/src/lib/validation/__tests__` covering:
  - Common validators and coercion utilities
  - Infrastructure domain schemas
  - Batch domain schemas
  - Edge cases (empty strings, invalid numbers, date formats)

## Reference Implementation

- `SpeciesExampleForm` (Phase 0 reference) demonstrates:
  - Generated client usage (`ApiService.apiV1BatchSpeciesCreate/List`).
  - Shared mutation hook integration.
  - Query invalidation and optimistic UX via toast.
  - Duplicate name guard using cached results.
  - Layout primitives, Shadcn components, and responsive structure.

### Usage

- Import `SpeciesExampleForm` into any page or storybook entry for reference when building domain-specific forms.
- Extend by replacing schema + mutation functions; keep layout primitives.

## OpenAPI Verification Checklist (Phase 0)

1. Run `npm run sync:openapi` if backend changes are suspected.
2. Locate endpoints in `api/openapi.yaml` using operationId (e.g., `api_v1_batch_species_create`).
3. Confirm generated client method exists (`client/src/api/generated/services/ApiService.ts`).
4. Check request/response types in `client/src/api/generated/models` for accurate typing.

## Testing

- Unit tests for the hook (`useCrudMutation.test.ts`) verify normalization and invalidation.
- Form component test covers submission and duplicate validation.
- Validation schema tests ensure required fields behave correctly.

## Permission System (Phase F0.3)

### Overview

Role-based access control (RBAC) implemented with hierarchical roles, geography, and subsidiary filtering.

### Usage

```tsx
import { usePermissionGuard, PermissionGate, WriteGate } from '@/features/shared/permissions'

function MyComponent() {
  const { can, isAdmin, canWrite, canDelete } = usePermissionGuard()
  
  if (!canWrite) {
    return <ReadOnlyView />
  }
  
  return (
    <>
      <Form />
      <WriteGate>
        <Button>Save</Button>
      </WriteGate>
      <DeleteGate>
        <Button variant="destructive">Delete</Button>
      </DeleteGate>
    </>
  )
}
```

### Role Hierarchy

- `ADMIN` - Full system access
- `MGR` - Manager (can delete)
- `OPR` - Operator (write access)
- `VET` - Veterinarian
- `QA` - Quality Assurance
- `FIN` - Finance
- `VIEW` - Read-only

Higher roles inherit permissions from lower roles (hierarchical).

### Components

- `<PermissionGate>` - Conditional rendering with role/geography/subsidiary checks
- `<AdminGate>` - Admin-only content
- `<WriteGate>` - Write permission content (excludes VIEW)
- `<DeleteGate>` - Delete permission content (MGR+)

## Audit Trail System (Phase F0.3)

### Overview

Capture change reasons for audit trails on create/update/delete operations.

### Usage

```tsx
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useCrudMutation } from '@/features/shared/hooks/useCrudMutation'

function DeleteButton({ item }) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  
  const deleteMutation = useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureContainersDestroy,
    description: 'Container deleted',
    invalidateQueries: ['containers'],
    injectAuditReason: (variables, reason) => ({
      ...variables,
      change_reason: reason
    })
  })
  
  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete',
      description: 'This action cannot be undone. Please provide a reason.',
      required: true,
      minLength: 10
    })
    
    if (confirmed) {
      await deleteMutation.mutateAsync({
        id: item.id,
        __auditReason: reason
      })
    }
  }
  
  return (
    <>
      <Button onClick={handleDelete} variant="destructive">
        Delete
      </Button>
      <AuditReasonDialog {...dialogState} />
    </>
  )
}
```

### Features

- Promise-based dialog prompt
- Required/optional reasons
- Min/max length validation
- Character counter
- Keyboard shortcuts (Ctrl+Enter to confirm)

## Next Steps

- Extend schemas per domain after Phase 0.
- Apply permission gates to forms (Phase 1+).
- Add audit reason prompts to delete operations (Phase 1+).
- Document domain-specific form variations by appending to this guide.

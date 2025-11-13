# Validation Schema Library

Type-safe Zod validation schemas for all AquaMind domain entities. This library bridges form inputs (strings) to API-compatible types while providing comprehensive validation.

## Quick Start

```ts
import { geographySchema, type GeographyFormValues } from '@/lib/validation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function GeographyForm() {
  const form = useForm<GeographyFormValues>({
    resolver: zodResolver(geographySchema),
    defaultValues: { name: '', description: '' }
  })
  
  const onSubmit = (data: GeographyFormValues) => {
    // data is type-safe and validated
    console.log(data.name) // guaranteed to be non-empty string
  }
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

## Structure

```
validation/
├── index.ts              # Barrel export (import from here)
├── schemas.ts            # Species schema (reference)
├── infrastructure.ts     # Infrastructure domain (8 schemas)
├── batch.ts             # Batch domain (6 schemas)
├── utils/
│   ├── common.ts        # Common validators
│   ├── coercion.ts      # Type coercion utilities
│   └── types.ts         # TypeScript helper types
└── __tests__/           # Comprehensive test coverage
```

## Core Utilities

### Common Validators (`utils/common.ts`)

- **`nonEmptyString`** - Required string with trimming
- **`optionalString`** - Converts empty strings to undefined
- **`optionalNumericString`** - String to number coercion
- **`requiredNumericString`** - Required numeric coercion
- **`booleanWithDefault`** - Boolean/string boolean handling
- **`dateString`** - YYYY-MM-DD validation
- **`optionalDateString`** - Optional date validation

### Coercion Utilities (`utils/coercion.ts`)

- **`decimalString`** - String-based decimal with range validation and formatting
- **`optionalDecimalString`** - Optional decimal fields
- **`latitudeString`** - Latitude validation (-90 to 90)
- **`longitudeString`** - Longitude validation (-180 to 180)
- **`positiveDecimalString`** - Non-negative decimals

### Type Helpers (`utils/types.ts`)

- **`FormValues<T>`** - Extract form type from schema
- **`PartialBy<T, K>`** - Make specific fields optional
- **`RequiredBy<T, K>`** - Make specific fields required
- **`WritableFields<T>`** - Filter readonly fields from generated models

## Available Schemas

### Infrastructure Domain

| Schema | Purpose | Key Features |
|--------|---------|--------------|
| `geographySchema` | Geographic regions | Basic name/description |
| `areaSchema` | Sea areas | Lat/long validation, biomass capacity |
| `containerTypeSchema` | Container types | Category enum (TANK/PEN/TRAY/OTHER) |
| `containerSchema` | Production containers | Hall/area mutual exclusion validation |
| `hallSchema` | Production halls | Station association |
| `freshwaterStationSchema` | Freshwater facilities | Geography linkage |
| `sensorSchema` | Sensor devices | Container assignment |
| `feedContainerSchema` | Feed storage | Capacity validation |

### Batch Domain

| Schema | Purpose | Key Features |
|--------|---------|--------------|
| `batchSchema` | Batch lifecycle | Status/type enums, date validation |
| `lifeCycleStageSchema` | Growth stages | Optional weight/length ranges |
| `batchContainerAssignmentSchema` | Population placement | Population count validation |
| `batchTransferSchema` | Inter-container moves | Source/destination validation |
| `growthSampleSchema` | Growth measurements | Sample size validation |
| `mortalityEventSchema` | Mortality tracking | Optional reason/weight |

## Type Safety Bridge

The library handles the impedance mismatch between HTML form inputs (strings) and API expectations:

```ts
// Generated API model expects strings for decimals
type Area = {
  name: string
  latitude: string  // API wants "60.123456"
  max_biomass: string  // API wants "100000.00"
}

// Schema validates and formats correctly
const areaSchema = z.object({
  name: nonEmptyString,
  latitude: latitudeString,  // Validates range, returns formatted string
  max_biomass: positiveDecimalString({ required: true })
})

// Form values are type-safe and API-compatible
type AreaFormValues = z.infer<typeof areaSchema>
// { name: string, latitude: string, max_biomass: string }
```

## Adding New Schemas

### 1. Create Domain File

Create `client/src/lib/validation/inventory.ts`:

```ts
import { z } from 'zod'
import { nonEmptyString, optionalString } from './utils/common'
import { positiveDecimalString } from './utils/coercion'

export const feedSchema = z.object({
  name: nonEmptyString.max(100),
  protein_content: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Protein content'
  }),
  notes: optionalString
})

export type FeedFormValues = z.infer<typeof feedSchema>
```

### 2. Add to Index Exports

Update `client/src/lib/validation/index.ts`:

```ts
export {
  feedSchema,
  type FeedFormValues,
} from './inventory'
```

### 3. Write Tests

Create `client/src/lib/validation/__tests__/inventory.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { feedSchema } from '../inventory'

describe('feedSchema', () => {
  it('validates required fields', () => {
    const result = feedSchema.safeParse({ name: '', protein_content: '' })
    expect(result.success).toBe(false)
  })
  
  it('accepts valid feed', () => {
    const result = feedSchema.parse({
      name: 'Premium Feed',
      protein_content: '45.50'
    })
    expect(result.name).toBe('Premium Feed')
    expect(result.protein_content).toBe('45.50')
  })
})
```

### 4. Reference Generated Models

Always check `client/src/api/generated/models/` for the exact field types and names:

```ts
import type { Feed } from '@/api/generated'
// Use this as reference when creating your schema
```

## Testing Patterns

Our test suite covers:

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
  
  it('rejects out-of-range values', () => {
    const result = mySchema.safeParse({ name: 'Test', value: '-10' })
    expect(result.success).toBe(false)
  })
})
```

## Design Principles

1. **API-First**: Schemas match generated API models exactly
2. **Type Safety**: Strong typing prevents runtime errors
3. **User Experience**: Clear, actionable error messages
4. **Reusability**: Common patterns extracted as utilities
5. **Testability**: Comprehensive test coverage for all schemas
6. **Documentation**: Self-documenting code with inline comments

## Common Patterns

### Optional Numeric Fields

```ts
// Backend expects string or null for optional decimals
avg_weight_g: optionalDecimalString({
  min: 0,
  decimalPlaces: 2,
  label: 'Average weight'
})
```

### Enums from Generated Models

```ts
// Extract enum from generated model
export const batchStatusEnum = z.enum([
  'PLANNED',
  'RECEIVING',
  'ACTIVE',
  'COMPLETED',
  'TERMINATED',
  'CANCELLED',
])

// Use in schema
status: batchStatusEnum.default('ACTIVE')
```

### Foreign Key References

```ts
// Backend expects numeric ID
species: z.coerce.number().int().positive('Species is required')
```

### Conditional Fields

```ts
// Use refinement for business rules
.refine(
  (data) => data.hall !== null || data.area !== null,
  { message: 'Either hall or area must be specified', path: ['hall'] }
)
```

## Integration with React Hook Form

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { areaSchema, type AreaFormValues } from '@/lib/validation'

function AreaForm() {
  const form = useForm<AreaFormValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: '',
      geography: 0,
      latitude: '',
      longitude: '',
      max_biomass: '',
      active: true
    }
  })
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

## Coverage

Current test coverage for validation library:

- **86 tests** across 4 test suites
- **Common utilities**: 40 tests
- **Infrastructure schemas**: 24 tests  
- **Batch schemas**: 20 tests
- **Species schema**: 2 tests

All tests passing with comprehensive edge case coverage.

## References

- **Implementation Plan**: `docs/progress/frontend_write_forms/CRU_implementation_plan.md`
- **Form Guidelines**: `docs/progress/frontend_write_forms/frontend_forms.md`
- **Generated Models**: `client/src/api/generated/models/`
- **OpenAPI Spec**: `api/openapi.yaml` (single source of truth)

---

**Phase**: F0.2 (Validation Schema Library & Type Safety)  
**Status**: Complete  
**Last Updated**: 2025-10-06

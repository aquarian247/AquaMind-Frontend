# Frontend Issue: Move Growth Sample Form to Batch Detail Page and Add Read-Only View to Health

**Priority:** Medium  
**Complexity:** Medium  
**Estimated Effort:** 6-8 hours  
**Depends On:** Backend individual growth observation implementation

---

## Overview

Relocate growth sampling workflow to batch management (where operators work) and provide read-only access for veterinarians in health section for reference.

---

## Requirements

### 1. Batch Detail Page - Add Growth Sample Recording

**Location:** Batch Detail Page → Containers Tab → Container Card

**Add Button:**
```tsx
<Button onClick={() => openGrowthSampleDialog(container.id, assignment.id)}>
  <Ruler className="h-4 w-4 mr-2" />
  Record Growth Sample
</Button>
```

**Create `GrowthSampleForm` Component:**

Features:
- Assignment pre-selected (from container card context)
- Sample date picker (defaults to today)
- Number of fish field (default 10)
- **Dynamic table** for individual fish:
  - Fish ID (auto-numbered: 1, 2, 3...)
  - Weight (g) - decimal input
  - Length (cm) - decimal input  
  - K-factor - calculated and displayed (read-only)
- Add/Remove fish rows
- Validation: `number_of_fish === fish_observations.length`
- Submit creates growth sample + all observations in one API call

**Pattern to Follow:**
- Reference: `client/src/features/health/components/HealthAssessmentForm.tsx`
- Use `useFieldArray` for dynamic fish rows
- Show mismatch warning if declared count ≠ actual count
- Calculate K-factor per fish for preview

**API Integration:**
```tsx
import { useCreateGrowthSample } from '@/features/batch-management/api'

const onSubmit = async (values) => {
  await createMutation.mutateAsync({
    assignment: assignmentId,
    sample_date: values.sample_date,
    notes: values.notes,
    individual_observations: values.fish_observations.map(f => ({
      fish_identifier: f.fish_identifier,
      weight_g: f.weight_g,
      length_cm: f.length_cm,
    })),
  })
}
```

---

### 2. Health Page - Measurements Tab (Convert to Read-Only)

**Changes to `client/src/pages/health.tsx`:**

**Tab Label:** Keep "Measurements" but add subtitle

**Tab Content:**
```tsx
<TabsContent value="measurements">
  <div className="flex justify-between items-center">
    <div>
      <h2>Growth Measurements (View Only)</h2>
      <p className="text-sm text-muted-foreground">
        View growth samples recorded by operators on batch detail pages
      </p>
    </div>
    {/* NO "New Measurement" button */}
  </div>
  
  <Alert className="mb-4">
    <Info className="h-4 w-4" />
    <AlertDescription>
      <strong>Note:</strong> Growth samples are created on the Batch Detail page 
      by operators. This view is for veterinarian reference only.
    </AlertDescription>
  </Alert>
  
  {/* List of growth samples with eye icon to view details */}
</TabsContent>
```

**Data Source:**
- Change from: `useHealthSamplingEvents()`
- To: `useGrowthSamples()` from batch-management API

**List Items:**
```tsx
{growthSamples.map(sample => (
  <div key={sample.id}>
    <div>
      <Badge>{sample.sample_size} fish sampled</Badge>
      <p>Avg: {sample.avg_weight_g}g, {sample.avg_length_cm}cm</p>
      <p>K-factor: {sample.condition_factor}</p>
    </div>
    <Button 
      variant="ghost" 
      size="sm"
      onClick={() => navigate(`/batch/growth-samples/${sample.id}`)}
    >
      <Eye className="h-4 w-4" />
    </Button>
  </div>
))}
```

---

### 3. Growth Sample Detail Page

**Route:** `/batch/growth-samples/:id`

**Create:** `client/src/features/batch-management/pages/GrowthSampleDetailPage.tsx`

**Layout:**
```tsx
<div>
  {/* Header */}
  <h1>Growth Sample #{sample.id}</h1>
  <p>Batch {batch.batch_number} - Container {container.name}</p>
  <p>Date: {sample.sample_date}</p>
  
  {/* Aggregate Stats Cards */}
  <div className="grid grid-cols-4">
    <Card>
      <CardTitle>Avg Weight</CardTitle>
      <CardContent>{sample.avg_weight_g}g ± {sample.std_deviation_weight}g</CardContent>
    </Card>
    <Card>
      <CardTitle>Avg Length</CardTitle>
      <CardContent>{sample.avg_length_cm}cm ± {sample.std_deviation_length}cm</CardContent>
    </Card>
    <Card>
      <CardTitle>K-Factor</CardTitle>
      <CardContent>{sample.condition_factor}</CardContent>
    </Card>
    <Card>
      <CardTitle>Sample Size</CardTitle>
      <CardContent>{sample.sample_size} fish</CardContent>
    </Card>
  </div>
  
  {/* Individual Fish Table */}
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Fish ID</TableHead>
        <TableHead>Weight (g)</TableHead>
        <TableHead>Length (cm)</TableHead>
        <TableHead>K-Factor</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sample.fish_observations.map(fish => (
        <TableRow>
          <TableCell>{fish.fish_identifier}</TableCell>
          <TableCell>{fish.weight_g}g</TableCell>
          <TableCell>{fish.length_cm}cm</TableCell>
          <TableCell>{fish.calculated_k_factor}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

---

## Reference Implementation

✅ **Form Pattern:** `client/src/features/health/components/HealthAssessmentForm.tsx`
- Two-step dropdown (batch → assignment)
- Dynamic table with Add/Remove fish
- Validation: declared count = actual count
- Nested data submission

✅ **Detail Page Pattern:** `client/src/features/health/pages/AssessmentDetailPage.tsx`
- Metadata cards
- Individual observations table
- Aggregate statistics
- Back button to return

✅ **API Hooks Pattern:** `client/src/features/health/api.ts`
- useGrowthSamples(), useGrowthSample(id), useCreateGrowthSample()

---

## API Integration

**Hooks to Add (in `client/src/features/batch-management/api.ts`):**

```typescript
export function useGrowthSamples(filters?: {
  assignmentId?: number;
  sampleDate?: string;
}) {
  return useQuery({
    queryKey: ['batch', 'growth-samples', filters],
    queryFn: () => ApiService.apiV1BatchGrowthSamplesList(...)
  })
}

export function useCreateGrowthSample() {
  return useMutation({
    mutationFn: (data) => ApiService.apiV1BatchGrowthSamplesCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['batch', 'growth-samples'])
      queryClient.invalidateQueries(['batch', 'batches'])
    }
  })
}
```

---

## Validation Schema (Zod)

```typescript
const individualFishSchema = z.object({
  fish_identifier: z.string().min(1).max(50),
  weight_g: z.coerce.number().positive(),
  length_cm: z.coerce.number().positive(),
})

const growthSampleSchema = z.object({
  assignment: z.coerce.number().int().positive(),
  sample_date: dateString,
  sample_size: z.coerce.number().int().positive(),
  notes: z.string().optional(),
  individual_observations: z.array(individualFishSchema).min(1),
}).refine(
  (data) => data.sample_size === data.individual_observations.length,
  {
    message: "Sample size must match number of individual fish",
    path: ["sample_size"],
  }
)
```

---

## User Workflows

### Operator Records Growth Sample:
1. Navigate to Batch Detail → Containers tab
2. Click "Record Growth Sample" on container card
3. Dialog opens with assignment pre-selected
4. Enter 10 fish measurements (weight + length)
5. See K-factor calculated per fish (preview)
6. Submit → Creates batch_growthsample + 10 individual_observations
7. Aggregates auto-calculate

### Veterinarian Views Growth Data:
1. Navigate to Health → Measurements tab
2. See list of growth samples (read-only)
3. Click eye icon on sample
4. Navigate to `/batch/growth-samples/:id`
5. See detailed view with all individual fish
6. Can reference growth data for health correlation

---

## Testing Checklist

- [ ] Create growth sample with 10 fish
- [ ] Verify K-factor calculated per fish
- [ ] Verify aggregates match manual calculation
- [ ] Verify validation prevents count mismatch
- [ ] View growth sample detail page
- [ ] Verify read-only view in Health → Measurements
- [ ] Verify no "New Measurement" button for operators in health
- [ ] TypeScript 0 errors

---

## Success Criteria

- ✅ Operators can record growth samples from batch detail page
- ✅ Individual fish weights/lengths stored
- ✅ Aggregates auto-calculate correctly
- ✅ Veterinarians can view (read-only) in Health section
- ✅ Clear separation: Batch app = create, Health app = view
- ✅ No confusion between health assessments and growth samples

---

## Notes

- This removes the confusing "Measurements" creation from Health page
- Aligns with user roles: Operators do growth, Vets do health
- Maintains access control: Operators don't need health app write access
- Health sampling events remain for vet-only detailed assessments (with parameter scores)


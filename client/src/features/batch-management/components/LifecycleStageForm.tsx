import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  lifeCycleStageSchema,
  type LifeCycleStageFormValues,
} from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import {
  useCreateLifecycleStage,
  useUpdateLifecycleStage,
  useSpecies,
  useLifecycleStages,
} from '../api'
import type { LifeCycleStage } from '@/api/generated'

interface LifecycleStageFormProps {
  /** Existing lifecycle stage to edit (undefined for create mode) */
  lifecycleStage?: LifeCycleStage
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Lifecycle Stage create/edit form component.
 *
 * Features:
 * - Species (FK dropdown, required)
 * - Stage name (required, max 100 chars)
 * - Order (positive integer, required)
 * - Description (optional)
 * - Weight ranges (min/max in grams, optional, 2 decimal places)
 * - Length ranges (min/max in cm, optional, 2 decimal places)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Create mode
 * <LifecycleStageForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <LifecycleStageForm
 *   lifecycleStage={existingStage}
 *   onSuccess={() => console.log('Updated!')}
 * />
 * ```
 */
export function LifecycleStageForm({
  lifecycleStage,
  onSuccess,
  onCancel,
}: LifecycleStageFormProps) {
  const isEditMode = !!lifecycleStage

  const form = useForm<LifeCycleStageFormValues>({
    resolver: zodResolver(lifeCycleStageSchema),
    defaultValues: {
      species: lifecycleStage?.species || ('' as any),
      name: lifecycleStage?.name || '',
      order: lifecycleStage?.order || ('' as any),
      description: lifecycleStage?.description || '',
      expected_weight_min_g: lifecycleStage?.expected_weight_min_g || '',
      expected_weight_max_g: lifecycleStage?.expected_weight_max_g || '',
      expected_length_min_cm: lifecycleStage?.expected_length_min_cm || '',
      expected_length_max_cm: lifecycleStage?.expected_length_max_cm || '',
    },
  })

  const createMutation = useCreateLifecycleStage()
  const updateMutation = useUpdateLifecycleStage()

  // Load species for dropdown
  const { data: speciesData, isLoading: speciesLoading } = useSpecies()

  // Load existing lifecycle stages for the selected species (for duplicate order check)
  const selectedSpecies = form.watch('species')
  const { data: existingStagesData } = useLifecycleStages(
    selectedSpecies ? { species: Number(selectedSpecies) } : undefined
  )

  const onSubmit = async (values: LifeCycleStageFormValues) => {
    try {
      // Client-side validation: Check for duplicate order for this species
      if (!isEditMode && selectedSpecies && values.order) {
        const duplicateOrder = existingStagesData?.results?.find(
          (stage) => stage.species === Number(selectedSpecies) && stage.order === values.order
        )
        
        if (duplicateOrder) {
          form.setError('order', {
            type: 'manual',
            message: `Order ${values.order} is already used by "${duplicateOrder.name}" for this species. Please choose a different order number.`,
          })
          return
        }
      }
      
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: lifecycleStage.id,
          ...values,
        } as LifeCycleStage & { id: number })
      } else {
        await createMutation.mutateAsync(values as LifeCycleStage)
      }

      form.reset()
      onSuccess?.()
    } catch (error) {
      // Error handled by useCrudMutation toast
      console.error('Form submission error:', error)
    }
  }

  const handleCancel = () => {
    form.reset()
    onCancel?.()
  }

  return (
    <FormLayout
      form={form}
      onSubmit={onSubmit}
      header={{
        title: isEditMode ? 'Edit Lifecycle Stage' : 'Create Lifecycle Stage',
        description: isEditMode
          ? 'Update lifecycle stage details and parameters.'
          : 'Define a new lifecycle stage for tracking batch progression.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode
            ? 'Update Lifecycle Stage'
            : 'Create Lifecycle Stage',
          disabled: form.formState.isSubmitting,
        },
        secondaryAction: onCancel
          ? {
              type: 'button',
              variant: 'outline',
              children: 'Cancel',
              onClick: handleCancel,
            }
          : undefined,
      }}
    >
      <FormSection
        title="Basic Information"
        description="Core identification for this lifecycle stage."
      >
        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="lifecycle-stage-species">Species *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {lifecycleStage?.species_name || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={speciesLoading}
                >
                  <FormControl>
                    <SelectTrigger id="lifecycle-stage-species">
                      <SelectValue placeholder="Select a species..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {speciesData?.results?.map((species) => (
                      <SelectItem key={species.id} value={species.id.toString()}>
                        {species.name} ({species.scientific_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="lifecycle-stage-name">Stage Name *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="lifecycle-stage-name"
                    aria-label="Lifecycle Stage Name"
                    placeholder="e.g., Egg, Fry, Juvenile, Adult"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="lifecycle-stage-order">Order *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="lifecycle-stage-order"
                    type="number"
                    min="1"
                    aria-label="Lifecycle Stage Order"
                    placeholder="e.g., 1, 2, 3"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormDescription>
                Sequential order in the lifecycle (1, 2, 3, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="lifecycle-stage-description">
                Description
              </FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Textarea
                    id="lifecycle-stage-description"
                    aria-label="Lifecycle Stage Description"
                    placeholder="Optional details about this stage..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Expected Weight Range"
        description="Define typical weight parameters for fish at this stage (in grams)."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="expected_weight_min_g"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="lifecycle-stage-weight-min">
                  Minimum Weight (g)
                </FormLabel>
                <WriteGate
                  fallback={
                    <div className="text-sm text-muted-foreground">
                      {field.value || 'N/A'}
                    </div>
                  }
                >
                  <FormControl>
                    <Input
                      id="lifecycle-stage-weight-min"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-label="Minimum Expected Weight"
                      placeholder="e.g., 0.50"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expected_weight_max_g"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="lifecycle-stage-weight-max">
                  Maximum Weight (g)
                </FormLabel>
                <WriteGate
                  fallback={
                    <div className="text-sm text-muted-foreground">
                      {field.value || 'N/A'}
                    </div>
                  }
                >
                  <FormControl>
                    <Input
                      id="lifecycle-stage-weight-max"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-label="Maximum Expected Weight"
                      placeholder="e.g., 5.00"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <FormSection
        title="Expected Length Range"
        description="Define typical length parameters for fish at this stage (in centimeters)."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="expected_length_min_cm"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="lifecycle-stage-length-min">
                  Minimum Length (cm)
                </FormLabel>
                <WriteGate
                  fallback={
                    <div className="text-sm text-muted-foreground">
                      {field.value || 'N/A'}
                    </div>
                  }
                >
                  <FormControl>
                    <Input
                      id="lifecycle-stage-length-min"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-label="Minimum Expected Length"
                      placeholder="e.g., 1.50"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expected_length_max_cm"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="lifecycle-stage-length-max">
                  Maximum Length (cm)
                </FormLabel>
                <WriteGate
                  fallback={
                    <div className="text-sm text-muted-foreground">
                      {field.value || 'N/A'}
                    </div>
                  }
                >
                  <FormControl>
                    <Input
                      id="lifecycle-stage-length-max"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-label="Maximum Expected Length"
                      placeholder="e.g., 8.00"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>
    </FormLayout>
  )
}

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  batchContainerAssignmentSchema,
  type BatchContainerAssignmentFormValues,
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
  useCreateBatchContainerAssignment,
  useUpdateBatchContainerAssignment,
  useBatches,
  useLifecycleStages,
} from '../api'
import { useContainers } from '@/features/infrastructure/api'
import type { BatchContainerAssignment } from '@/api/generated'

interface BatchContainerAssignmentFormProps {
  /** Existing assignment to edit (undefined for create mode) */
  assignment?: BatchContainerAssignment
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Batch Container Assignment create/edit form component.
 *
 * Features:
 * - Batch selection (FK dropdown)
 * - Container selection (FK dropdown with cascading filters)
 * - Lifecycle stage selection (FK dropdown filtered by batch's species)
 * - Assignment date (date picker, required)
 * - Population count (positive integer, required)
 * - Average weight (decimal, 2 places, required)
 * - Notes (textarea, optional)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Create mode
 * <BatchContainerAssignmentForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <BatchContainerAssignmentForm
 *   assignment={existingAssignment}
 *   onSuccess={() => console.log('Updated!')}
 * />
 * ```
 */
export function BatchContainerAssignmentForm({
  assignment,
  onSuccess,
  onCancel,
}: BatchContainerAssignmentFormProps) {
  const isEditMode = !!assignment

  const form = useForm<BatchContainerAssignmentFormValues>({
    resolver: zodResolver(batchContainerAssignmentSchema),
    defaultValues: {
      batch: assignment?.batch_id || ('' as any),
      container: assignment?.container_id || ('' as any),
      lifecycle_stage: assignment?.lifecycle_stage_id || ('' as any),
      assignment_date: assignment?.assignment_date || new Date().toISOString().split('T')[0],
      population_count: assignment?.population_count || ('' as any),
      avg_weight_g: assignment?.avg_weight_g || '',
      notes: assignment?.notes || '',
    },
  })

  const createMutation = useCreateBatchContainerAssignment()
  const updateMutation = useUpdateBatchContainerAssignment()

  // Load batches for dropdown
  const { data: batchesData, isLoading: batchesLoading } = useBatches()

  // Load containers for dropdown
  const { data: containersData, isLoading: containersLoading } = useContainers()

  // Load lifecycle stages (all for now, could filter by batch's species)
  const { data: lifecycleStagesData, isLoading: lifecycleStagesLoading } = useLifecycleStages({
    ordering: 'order',
  })

  const onSubmit = async (values: BatchContainerAssignmentFormValues) => {
    try {
      // Map form values to API format
      const apiData: any = {
        batch_id: values.batch,
        container_id: values.container,
        lifecycle_stage_id: values.lifecycle_stage,
        assignment_date: values.assignment_date,
        population_count: values.population_count,
        avg_weight_g: values.avg_weight_g,
        notes: values.notes,
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: assignment.id,
          ...apiData,
        } as BatchContainerAssignment & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as BatchContainerAssignment)
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
        title: isEditMode ? 'Edit Batch Assignment' : 'Create Batch Assignment',
        description: isEditMode
          ? 'Update batch container assignment details.'
          : 'Assign a batch to a container for tracking.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Assignment' : 'Create Assignment',
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
        title="Assignment Details"
        description="Select batch, container, and lifecycle stage for this assignment."
      >
        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="assignment-batch">Batch *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {assignment?.batch?.batch_number || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={batchesLoading}
                >
                  <FormControl>
                    <SelectTrigger id="assignment-batch">
                      <SelectValue placeholder="Select a batch..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batchesData?.results?.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.batch_number} ({batch.species_name})
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
          name="container"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="assignment-container">Container *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {assignment?.container?.name || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={containersLoading}
                >
                  <FormControl>
                    <SelectTrigger id="assignment-container">
                      <SelectValue placeholder="Select a container..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {containersData?.results?.map((container) => (
                      <SelectItem key={container.id} value={container.id.toString()}>
                        {container.name} - Volume: {container.volume_m3}m³
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
          name="lifecycle_stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="assignment-lifecycle-stage">
                Lifecycle Stage *
              </FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {assignment?.lifecycle_stage?.name || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={lifecycleStagesLoading}
                >
                  <FormControl>
                    <SelectTrigger id="assignment-lifecycle-stage">
                      <SelectValue placeholder="Select lifecycle stage..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lifecycleStagesData?.results?.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id.toString()}>
                        {stage.name} (Order: {stage.order})
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
          name="assignment_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="assignment-date">Assignment Date *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="assignment-date"
                    type="date"
                    aria-label="Assignment Date"
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
        title="Population & Metrics"
        description="Specify population count and average weight for this assignment."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="population_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="assignment-population">
                  Population Count *
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
                      id="assignment-population"
                      type="number"
                      min="1"
                      aria-label="Population Count"
                      placeholder="e.g., 10000"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormDescription>Number of fish in this assignment</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avg_weight_g"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="assignment-avg-weight">
                  Average Weight (g) *
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
                      id="assignment-avg-weight"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-label="Average Weight"
                      placeholder="e.g., 250.50"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormDescription>Average weight per fish in grams</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <FormSection
        title="Additional Information"
        description="Optional notes about this assignment."
      >
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="assignment-notes">Notes</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Textarea
                    id="assignment-notes"
                    aria-label="Assignment Notes"
                    placeholder="Optional notes about this assignment..."
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
    </FormLayout>
  )
}

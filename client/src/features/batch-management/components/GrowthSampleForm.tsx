import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  growthSampleSchema,
  type GrowthSampleFormValues,
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
  useCreateGrowthSample,
  useUpdateGrowthSample,
  useBatchContainerAssignments,
} from '../api'
import type { GrowthSample } from '@/api/generated'

interface GrowthSampleFormProps {
  /** Existing growth sample to edit (undefined for create mode) */
  growthSample?: GrowthSample
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Growth Sample create/edit form component.
 *
 * Note: API uses 'assignment' FK (BatchContainerAssignment),
 * but form uses batch+container for better UX.
 *
 * Features:
 * - Assignment selection (FK dropdown showing batch + container)
 * - Sample date (date picker, defaults to today)
 * - Sample size (positive integer, required)
 * - Average weight (decimal, 2 places, required)
 * - Average length (decimal, 2 places, optional)
 * - Notes (textarea, optional)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Create mode
 * <GrowthSampleForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <GrowthSampleForm
 *   growthSample={existingSample}
 *   onSuccess={() => console.log('Updated!')}
 * />
 * ```
 */
export function GrowthSampleForm({
  growthSample,
  onSuccess,
  onCancel,
}: GrowthSampleFormProps) {
  const isEditMode = !!growthSample

  const form = useForm<GrowthSampleFormValues>({
    resolver: zodResolver(growthSampleSchema),
    defaultValues: {
      batch: ('' as any),
      container: ('' as any),
      sample_date: growthSample?.sample_date || new Date().toISOString().split('T')[0],
      sample_size: growthSample?.sample_size || ('' as any),
      avg_weight_g: growthSample?.avg_weight_g || '',
      avg_length_cm: growthSample?.avg_length_cm || '',
      notes: growthSample?.notes || '',
    },
  })

  const createMutation = useCreateGrowthSample()
  const updateMutation = useUpdateGrowthSample()

  // Load assignments for dropdown (shows batch + container)
  const { data: assignmentsData, isLoading: assignmentsLoading } = useBatchContainerAssignments({
    isActive: true, // Only show active assignments
  })

  const onSubmit = async (values: GrowthSampleFormValues) => {
    try {
      // Find the assignment that matches batch + container
      const assignment = assignmentsData?.results?.find(
        (a) => a.batch_id === values.batch && a.container_id === values.container
      )

      if (!assignment && !isEditMode) {
        throw new Error('No active assignment found for selected batch and container')
      }

      // Map form to API format (uses assignment FK, not batch+container)
      const apiData: any = {
        assignment: assignment?.id || growthSample?.assignment,
        sample_date: values.sample_date,
        sample_size: values.sample_size,
        avg_weight_g: values.avg_weight_g,
        avg_length_cm: values.avg_length_cm || null,
        notes: values.notes || null,
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: growthSample.id,
          ...apiData,
        } as GrowthSample & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as GrowthSample)
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
        title: isEditMode ? 'Edit Growth Sample' : 'Record Growth Sample',
        description: isEditMode
          ? 'Update growth measurement details.'
          : 'Record weight and length measurements for batch monitoring.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Sample' : 'Record Sample',
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
        title="Assignment Selection"
        description="Select the batch and container for this growth sample."
      >
        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="growth-sample-assignment">
                Active Assignment *
              </FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {growthSample?.assignment_details?.batch_number || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) => {
                    // Parse assignment value as "batch_id-container_id"
                    const [batchId, containerId] = value.split('-').map(Number)
                    field.onChange(batchId)
                    form.setValue('container', containerId)
                  }}
                  value={
                    field.value && form.watch('container')
                      ? `${field.value}-${form.watch('container')}`
                      : ''
                  }
                  disabled={assignmentsLoading}
                >
                  <FormControl>
                    <SelectTrigger id="growth-sample-assignment">
                      <SelectValue placeholder="Select active assignment..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assignmentsData?.results
                      ?.filter((a) => a.batch_id && a.container_id) // Filter out invalid assignments
                      .map((assignment) => (
                        <SelectItem
                          key={assignment.id}
                          value={`${assignment.batch_id}-${assignment.container_id}`}
                        >
                          {assignment.batch?.batch_number || `Batch ${assignment.batch_id}`} in{' '}
                          {assignment.container?.name || `Container ${assignment.container_id}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormDescription>
                Only active batch-container assignments are shown
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sample_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="growth-sample-date">Sample Date *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="growth-sample-date"
                    type="date"
                    aria-label="Sample Date"
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
        title="Sample Measurements"
        description="Enter sample size and average measurements."
      >
        <FormField
          control={form.control}
          name="sample_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="growth-sample-size">Sample Size *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="growth-sample-size"
                    type="number"
                    min="1"
                    aria-label="Sample Size"
                    placeholder="e.g., 30"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormDescription>Number of fish sampled</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="avg_weight_g"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="growth-sample-weight">
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
                      id="growth-sample-weight"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-label="Average Weight"
                      placeholder="e.g., 250.50"
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
            name="avg_length_cm"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="growth-sample-length">
                  Average Length (cm)
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
                      id="growth-sample-length"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-label="Average Length"
                      placeholder="e.g., 15.50"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormDescription>Optional length measurement</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <FormSection
        title="Additional Information"
        description="Optional notes about this sample."
      >
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="growth-sample-notes">Notes</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Textarea
                    id="growth-sample-notes"
                    aria-label="Growth Sample Notes"
                    placeholder="Optional notes about this sample..."
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




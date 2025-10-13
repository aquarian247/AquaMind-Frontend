import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  batchSchema,
  type BatchFormValues,
  batchStatusEnum,
  batchTypeEnum,
} from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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
  useCreateBatch,
  useUpdateBatch,
  useSpecies,
  useLifecycleStages,
} from '../api'
import type { Batch } from '@/api/generated'

interface BatchFormProps {
  /** Existing batch to edit (undefined for create mode) */
  batch?: Batch
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * @deprecated For creating NEW batches, use BatchCreationForm instead (includes inline container assignments).
 * This component is now only used for EDITING existing batches.
 * 
 * Batch create/edit form component.
 *
 * Features:
 * - Batch number (required, max 50 chars)
 * - Species (FK dropdown, required)
 * - Lifecycle stage (FK dropdown, filtered by species, required)
 * - Status (enum dropdown: ACTIVE, COMPLETED, TERMINATED)
 * - Batch type (enum dropdown: STANDARD, MIXED)
 * - Start date (date picker, required)
 * - Expected end date (date picker, optional)
 * - Notes (textarea, optional)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Edit mode (ONLY)
 * <BatchForm batch={existingBatch} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function BatchForm({ batch, onSuccess, onCancel }: BatchFormProps) {
  const isEditMode = !!batch

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batch_number: batch?.batch_number || '',
      species: batch?.species || ('' as any),
      lifecycle_stage: batch?.lifecycle_stage || ('' as any),
      status: batch?.status || 'ACTIVE',
      batch_type: batch?.batch_type || 'STANDARD',
      start_date: batch?.start_date || '',
      expected_end_date: batch?.expected_end_date || '',
      notes: batch?.notes || '',
    },
  })

  const createMutation = useCreateBatch()
  const updateMutation = useUpdateBatch()

  // Load species for dropdown
  const { data: speciesData, isLoading: speciesLoading } = useSpecies()

  // Load lifecycle stages filtered by selected species
  const selectedSpeciesId = form.watch('species')
  const { data: lifecycleStagesData, isLoading: lifecycleStagesLoading } =
    useLifecycleStages(
      selectedSpeciesId
        ? { species: Number(selectedSpeciesId), ordering: 'order' }
        : undefined
    )

  const onSubmit = async (values: BatchFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: batch.id,
          ...values,
        } as Batch & { id: number })
      } else {
        await createMutation.mutateAsync(values as Batch)
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
        title: isEditMode ? 'Edit Batch' : 'Create Batch',
        description: isEditMode
          ? 'Update batch details and lifecycle information.'
          : 'Create a new aquaculture batch to track throughout its lifecycle.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Batch' : 'Create Batch',
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
        description="Core identification and classification details."
      >
        <FormField
          control={form.control}
          name="batch_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="batch-number">Batch Number *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="batch-number"
                    aria-label="Batch Number"
                    placeholder="e.g., BATCH2025-001"
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
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="batch-species">Species *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {batch?.species_name || 'N/A'}
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
                    <SelectTrigger id="batch-species">
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
          name="lifecycle_stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="batch-lifecycle-stage">
                Lifecycle Stage *
              </FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {(batch?.current_lifecycle_stage as any)?.name || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={lifecycleStagesLoading || !selectedSpeciesId}
                >
                  <FormControl>
                    <SelectTrigger id="batch-lifecycle-stage">
                      <SelectValue
                        placeholder={
                          !selectedSpeciesId
                            ? 'Select species first...'
                            : 'Select a lifecycle stage...'
                        }
                      />
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
              {!selectedSpeciesId && (
                <p className="text-sm text-muted-foreground">
                  Please select a species to see available lifecycle stages.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="batch-status">Status</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger id="batch-status">
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batchStatusEnum.options.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
          name="batch_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="batch-type">Batch Type</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger id="batch-type">
                      <SelectValue placeholder="Select batch type..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batchTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'STANDARD' ? 'Standard' : 'Mixed Population'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Timeline"
        description="Track batch start and expected completion dates."
      >
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="batch-start-date">Start Date *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="batch-start-date"
                    type="date"
                    aria-label="Batch Start Date"
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
          name="expected_end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="batch-expected-end-date">
                Expected End Date
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
                    id="batch-expected-end-date"
                    type="date"
                    aria-label="Batch Expected End Date"
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
        title="Additional Information"
        description="Optional notes and comments."
      >
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="batch-notes">Notes</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Textarea
                    id="batch-notes"
                    aria-label="Batch Notes"
                    placeholder="Optional notes about this batch..."
                    rows={4}
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

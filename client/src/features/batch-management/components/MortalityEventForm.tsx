import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  mortalityEventSchema,
  type MortalityEventFormValues,
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
  useCreateMortalityEvent,
  useUpdateMortalityEvent,
  useBatches,
} from '../api'
import type { MortalityEvent } from '@/api/generated'

interface MortalityEventFormProps {
  /** Existing mortality event to edit (undefined for create mode) */
  mortalityEvent?: MortalityEvent
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

const mortalityCauseEnum = ['DISEASE', 'HANDLING', 'PREDATION', 'ENVIRONMENTAL', 'UNKNOWN', 'OTHER'] as const

/**
 * Mortality Event create/edit form component.
 *
 * Features:
 * - Batch selection (FK dropdown)
 * - Event date (date picker, defaults to today)
 * - Mortality count (positive integer, required)
 * - Cause (enum dropdown, optional)
 * - Description (textarea, optional)
 *
 * Uses permission gates to protect write operations.
 */
export function MortalityEventForm({
  mortalityEvent,
  onSuccess,
  onCancel,
}: MortalityEventFormProps) {
  const isEditMode = !!mortalityEvent

  const form = useForm<MortalityEventFormValues>({
    resolver: zodResolver(mortalityEventSchema),
    defaultValues: {
      batch: mortalityEvent?.batch || ('' as any),
      container: ('' as any), // Not used by API, but required by schema
      event_date: mortalityEvent?.event_date || new Date().toISOString().split('T')[0],
      mortality_count: mortalityEvent?.count || ('' as any),
      mortality_reason: ('' as any),
      avg_weight_g: '',
      notes: mortalityEvent?.description || '',
    },
  })

  const createMutation = useCreateMortalityEvent()
  const updateMutation = useUpdateMortalityEvent()

  // Load batches for dropdown
  const { data: batchesData, isLoading: batchesLoading } = useBatches({ status: 'ACTIVE' })

  const onSubmit = async (values: MortalityEventFormValues) => {
    try {
      // Map form to API format
      const apiData: any = {
        batch: values.batch,
        event_date: values.event_date,
        count: values.mortality_count,
        cause: form.watch('notes')?.includes('DISEASE') ? 'DISEASE' : 'OTHER', // Simplified mapping
        description: values.notes,
        biomass_kg: '0.00', // Would need calculation
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: mortalityEvent.id,
          ...apiData,
        } as MortalityEvent & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as MortalityEvent)
      }

      form.reset()
      onSuccess?.()
    } catch (error) {
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
        title: isEditMode ? 'Edit Mortality Event' : 'Record Mortality Event',
        description: isEditMode
          ? 'Update mortality event details.'
          : 'Record fish mortalities for batch tracking.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Event' : 'Record Event',
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
        title="Event Details"
        description="Select batch and specify when the mortality occurred."
      >
        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="mortality-batch">Batch *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {mortalityEvent?.batch_number || 'N/A'}
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
                    <SelectTrigger id="mortality-batch">
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
          name="event_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="mortality-date">Event Date *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="mortality-date"
                    type="date"
                    aria-label="Event Date"
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
          name="mortality_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="mortality-count">Mortality Count *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="mortality-count"
                    type="number"
                    min="1"
                    aria-label="Mortality Count"
                    placeholder="e.g., 15"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormDescription>Number of fish mortalities</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Additional Information"
        description="Optional notes about this mortality event."
      >
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="mortality-notes">Description</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Textarea
                    id="mortality-notes"
                    aria-label="Mortality Event Description"
                    placeholder="Describe the cause and circumstances..."
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



import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  journalEntrySchema,
  journalEntryCategoryEnum,
  journalEntrySeverityEnum,
  type JournalEntryFormValues,
} from '@/lib/validation/health'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateJournalEntry, useUpdateJournalEntry } from '../api'
import { useBatches } from '@/features/batch-management/api'
import { useContainers } from '@/features/infrastructure/api'
import type { JournalEntry } from '@/api/generated'

interface JournalEntryFormProps {
  /** Existing journal entry to edit (undefined for create mode) */
  journalEntry?: JournalEntry
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * JournalEntry create/edit form component.
 *
 * Features:
 * - Batch (FK dropdown, required)
 * - Container (FK dropdown, optional - applies to entire batch if not specified)
 * - Entry date (date picker, required)
 * - Category (enum dropdown: observation, issue, action, etc.)
 * - Severity (enum dropdown: low, medium, high)
 * - Description (textarea, required)
 * - Resolution status (checkbox)
 * - Resolution notes (textarea, optional)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Create mode
 * <JournalEntryForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <JournalEntryForm journalEntry={existingEntry} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function JournalEntryForm({
  journalEntry,
  onSuccess,
  onCancel,
}: JournalEntryFormProps) {
  const isEditMode = !!journalEntry

  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      batch: 0, // Placeholder, required field
      container: undefined,
      entry_date: new Date().toISOString().split('T')[0],
      category: 'observation',
      severity: 'low',
      description: '',
      resolution_status: false,
      resolution_notes: '',
    },
  })

  // Update form with journal entry data if in edit mode
  React.useEffect(() => {
    if (journalEntry) {
      form.reset({
        batch: journalEntry.batch,
        container: journalEntry.container || undefined,
        entry_date: journalEntry.entry_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        category: journalEntry.category as JournalEntryFormValues['category'],
        severity: journalEntry.severity as JournalEntryFormValues['severity'],
        description: journalEntry.description,
        // Convert string to boolean (resolution_status is string|null in API)
        resolution_status: journalEntry.resolution_status === 'true' || journalEntry.resolution_status === 'True',
        resolution_notes: journalEntry.resolution_notes || '',
      })
    }
  }, [journalEntry, form])

  const createMutation = useCreateJournalEntry()
  const updateMutation = useUpdateJournalEntry()

  // Load batches for dropdown (active batches only)
  const { data: batchesData, isLoading: batchesLoading } = useBatches({
    status: 'ACTIVE',
  })

  // Load containers for dropdown (active containers only)
  const { data: containersData, isLoading: containersLoading } = useContainers({
    active: true,
  })

  const onSubmit = async (values: JournalEntryFormValues) => {
    try {
      // Prepare data for API (omit readonly fields, convert types as needed)
      const apiData: Partial<JournalEntry> = {
        batch: values.batch,
        container: values.container || null,
        entry_date: values.entry_date,
        category: values.category,
        severity: values.severity,
        description: values.description,
        // Convert boolean to string for API (backend expects string|null)
        resolution_status: String(values.resolution_status) as any,
        resolution_notes: values.resolution_notes,
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: journalEntry.id,
          ...apiData,
        } as JournalEntry & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as JournalEntry)
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

  const resolutionStatus = form.watch('resolution_status')

  return (
    <FormLayout
      form={form}
      onSubmit={onSubmit}
      header={{
        title: isEditMode ? 'Edit Journal Entry' : 'Create Journal Entry',
        description: isEditMode
          ? 'Update health journal entry details.'
          : 'Record a new health observation, issue, or action for a batch.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Entry' : 'Create Entry',
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
      <WriteGate>
        <FormSection
          title="Entry Details"
          description="Specify the batch, container, and date for this journal entry."
        >
          {/* Batch - Required FK */}
          <FormField
            control={form.control}
            name="batch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : ''}
                  disabled={batchesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batchesData?.results?.map((batch) => (
                      <SelectItem key={batch.id} value={String(batch.id)}>
                        {batch.batch_number || `Batch ${batch.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the batch this entry applies to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Container - Optional FK */}
          <FormField
            control={form.control}
            name="container"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Container (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : ''}
                  disabled={containersLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select container (or leave blank for entire batch)..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None (applies to entire batch)</SelectItem>
                    {containersData?.results?.map((container) => (
                      <SelectItem key={container.id} value={String(container.id)}>
                        {container.name || `Container ${container.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Optional: Specify a container, or leave blank if entry applies to entire batch.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Entry Date */}
          <FormField
            control={form.control}
            name="entry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Date when the observation or incident occurred.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Observation Details"
          description="Categorize and describe the health observation or issue."
        >
          {/* Category - Required Enum */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {journalEntryCategoryEnum.options.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Type of entry (observation, issue, treatment, etc.).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Severity - Required Enum */}
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {journalEntrySeverityEnum.options.map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Severity level (low, medium, or high).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description - Required Textarea */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the observation or issue in detail..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description of the health observation or incident.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Resolution"
          description="Track resolution status and notes."
        >
          {/* Resolution Status - Boolean Checkbox */}
          <FormField
            control={form.control}
            name="resolution_status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Mark as Resolved</FormLabel>
                  <FormDescription>
                    Check if this issue has been resolved or addressed.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Resolution Notes - Optional Textarea (only shown if resolved) */}
          {resolutionStatus && (
            <FormField
              control={form.control}
              name="resolution_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolution Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe how the issue was resolved..."
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Notes on how the issue was resolved or is being addressed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </FormSection>
      </WriteGate>
    </FormLayout>
  )
}


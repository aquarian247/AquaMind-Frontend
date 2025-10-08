import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  feedingEventSchema,
  type FeedingEventFormValues,
  feedingMethodEnum,
} from '@/lib/validation/inventory'
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
import { useCreateFeedingEvent, useUpdateFeedingEvent, useFeeds } from '../api'
import { useBatches, useBatchContainerAssignments } from '@/features/batch-management/api'
import type { FeedingEvent } from '@/api/generated'
import { Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FeedingEventFormProps {
  /** Existing feeding event to edit (undefined for create mode) */
  feedingEvent?: FeedingEvent
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * FeedingEvent create/edit form component.
 *
 * Features:
 * - Batch (FK dropdown, required)
 * - Container (FK dropdown, cascading filter - shows only containers where batch is assigned)
 * - Feed (FK dropdown, required)
 * - Feeding date & time (date/time pickers, required)
 * - Amount kg (decimal, required)
 * - Batch biomass (optional, auto-populated from latest assignment if available)
 * - Method (enum dropdown: MANUAL, AUTOMATIC, BROADCAST)
 * - Notes (textarea, optional)
 * - Auto-calculated feeding percentage and cost (displayed after submission)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Create mode
 * <FeedingEventForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <FeedingEventForm feedingEvent={existing} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function FeedingEventForm({
  feedingEvent,
  onSuccess,
  onCancel,
}: FeedingEventFormProps) {
  const isEditMode = !!feedingEvent

  const form = useForm<FeedingEventFormValues>({
    resolver: zodResolver(feedingEventSchema),
    defaultValues: {
      batch: feedingEvent?.batch || ('' as any),
      container: feedingEvent?.container || ('' as any),
      feed: feedingEvent?.feed || ('' as any),
      feeding_date:
        feedingEvent?.feeding_date || new Date().toISOString().split('T')[0],
      feeding_time: feedingEvent?.feeding_time || '08:00',
      amount_kg: feedingEvent?.amount_kg || '',
      batch_biomass_kg: feedingEvent?.batch_biomass_kg || '',
      method: feedingEvent?.method || 'MANUAL',
      notes: feedingEvent?.notes || '',
    },
  })

  const createMutation = useCreateFeedingEvent()
  const updateMutation = useUpdateFeedingEvent()

  // Load batches for dropdown (only active batches)
  const { data: batchesData, isLoading: batchesLoading } = useBatches({
    status: 'ACTIVE',
  })

  // Load feeds for dropdown (only active feeds)
  const { data: feedsData, isLoading: feedsLoading } = useFeeds({
    isActive: true,
    ordering: 'name',
  })

  // Cascading filter: Load containers filtered by selected batch
  const selectedBatchId = form.watch('batch')
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useBatchContainerAssignments(
      selectedBatchId
        ? {
            batch: Number(selectedBatchId),
            // Note: Not filtering by isActive to get all containers for batch
            // User can see all historical locations
          }
        : undefined
    )

  // Get unique containers from assignments (a batch may be in multiple containers)
  const availableContainers = React.useMemo(() => {
    if (!assignmentsData?.results || assignmentsData.results.length === 0) {
      console.log('No assignment results available', assignmentsData)
      return []
    }
    
    console.log(`Processing ${assignmentsData.results.length} assignments for batch ${selectedBatchId}`)
    
    // Create map to deduplicate containers
    const containerMap = new Map()
    assignmentsData.results.forEach((assignment) => {
      // Check both container_id and nested container object
      const containerId = assignment.container_id || assignment.container?.id
      const containerName = assignment.container?.name || `Container ${containerId}`
      
      if (containerId && !containerMap.has(containerId)) {
        console.log(`Adding container: ${containerId} - ${containerName}`)
        containerMap.set(containerId, {
          id: containerId,
          name: containerName,
        })
      }
    })
    
    const containers = Array.from(containerMap.values())
    console.log(`Found ${containers.length} unique containers`, containers)
    return containers
  }, [assignmentsData, selectedBatchId])

  // Auto-populate biomass from latest assignment if available
  React.useEffect(() => {
    if (!selectedBatchId || !assignmentsData?.results?.length) return

    // Get latest assignment for selected batch
    const latestAssignment = assignmentsData.results
      .filter((a) => a.batch_id === Number(selectedBatchId))
      .sort((a, b) => {
        const dateA = a.assignment_date ? new Date(a.assignment_date).getTime() : 0
        const dateB = b.assignment_date ? new Date(b.assignment_date).getTime() : 0
        return dateB - dateA
      })[0]

    if (latestAssignment?.biomass_kg && !form.getValues('batch_biomass_kg')) {
      form.setValue('batch_biomass_kg', latestAssignment.biomass_kg)
    }
  }, [selectedBatchId, assignmentsData, form])

  const onSubmit = async (values: FeedingEventFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: feedingEvent.id,
          ...values,
        } as FeedingEvent & { id: number })
      } else {
        await createMutation.mutateAsync(values as FeedingEvent)
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

  // Calculate feeding percentage for display (if biomass available)
  const amountKg = form.watch('amount_kg')
  const biomassKg = form.watch('batch_biomass_kg')
  const feedingPercentage =
    amountKg && biomassKg
      ? ((parseFloat(amountKg) / parseFloat(biomassKg)) * 100).toFixed(2)
      : null

  return (
    <FormLayout
      form={form}
      onSubmit={onSubmit}
      header={{
        title: isEditMode ? 'Edit Feeding Event' : 'Record Feeding Event',
        description: isEditMode
          ? 'Update feeding event details.'
          : 'Record a feeding event with amount and timing information.',
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
        title="Batch & Location"
        description="Select batch and feeding location."
      >
        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feeding-batch">Batch *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {feedingEvent?.batch_name || 'N/A'}
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
                    <SelectTrigger id="feeding-batch" aria-label="Batch">
                      <SelectValue
                        placeholder={
                          batchesLoading ? 'Loading batches...' : 'Select batch'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batchesData?.results?.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.batch_number} - {batch.species_name}
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
              <FormLabel htmlFor="feeding-container">Container *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {feedingEvent?.container_name || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={assignmentsLoading || !selectedBatchId}
                >
                  <FormControl>
                    <SelectTrigger id="feeding-container" aria-label="Container">
                      <SelectValue
                        placeholder={
                          !selectedBatchId
                            ? 'Select batch first...'
                            : assignmentsLoading
                            ? 'Loading containers...'
                            : 'Select container'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableContainers.map((container) => (
                      <SelectItem key={container.id} value={container.id.toString()}>
                        {container.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              {!selectedBatchId && (
                <FormDescription>
                  Please select a batch to see available containers
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feed"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feeding-feed">Feed *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {feedingEvent?.feed_name || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={feedsLoading}
                >
                  <FormControl>
                    <SelectTrigger id="feeding-feed" aria-label="Feed">
                      <SelectValue
                        placeholder={
                          feedsLoading ? 'Loading feeds...' : 'Select feed'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feedsData?.results?.map((feed) => (
                      <SelectItem key={feed.id} value={feed.id.toString()}>
                        {feed.name} ({feed.size_category})
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
        title="Feeding Details"
        description="Date, time, and amount information."
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="feeding_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="feeding-date">Feeding Date *</FormLabel>
                <WriteGate
                  fallback={
                    <div className="text-sm text-muted-foreground">
                      {field.value || 'N/A'}
                    </div>
                  }
                >
                  <FormControl>
                    <Input
                      id="feeding-date"
                      type="date"
                      aria-label="Feeding Date"
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
            name="feeding_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="feeding-time">Feeding Time *</FormLabel>
                <WriteGate
                  fallback={
                    <div className="text-sm text-muted-foreground">
                      {field.value || 'N/A'}
                    </div>
                  }
                >
                  <FormControl>
                    <Input
                      id="feeding-time"
                      type="time"
                      aria-label="Feeding Time"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feeding-amount">Amount (kg) *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value ? `${field.value} kg` : 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="feeding-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-label="Amount"
                    placeholder="e.g., 50.00"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormDescription>Amount of feed given in kilograms</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="batch_biomass_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feeding-biomass">Batch Biomass (kg)</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value ? `${field.value} kg` : 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="feeding-biomass"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-label="Batch Biomass"
                    placeholder="e.g., 1000.00"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormDescription>
                Batch biomass at feeding time (auto-populated from assignment if available)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feeding-method">Feeding Method *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger id="feeding-method" aria-label="Feeding Method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feedingMethodEnum.options.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feeding Percentage Preview */}
        {feedingPercentage && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Feeding Percentage:</strong> {feedingPercentage}% of biomass
            </AlertDescription>
          </Alert>
        )}
      </FormSection>

      <FormSection
        title="Additional Information"
        description="Optional notes about this feeding event."
      >
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feeding-notes">Notes</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Textarea
                    id="feeding-notes"
                    aria-label="Notes"
                    placeholder="Additional notes about this feeding..."
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

import React, { useMemo } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  healthSamplingEventSchema,
  type HealthSamplingEventFormValues,
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
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Info } from 'lucide-react'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateHealthSamplingEvent, useUpdateHealthSamplingEvent } from '../api'
import { useBatchContainerAssignments } from '@/features/batch-management/api'
import type { HealthSamplingEvent } from '@/api/generated'

interface HealthSamplingEventFormProps {
  /** Existing sampling event to edit (undefined for create mode) */
  samplingEvent?: HealthSamplingEvent
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * HealthSamplingEvent create/edit form component with nested fish observations.
 *
 * Features:
 * - Assignment (FK dropdown showing batch + container)
 * - Sampling date (date picker, defaults to today)
 * - Number of fish sampled (positive integer)
 * - Dynamic list of individual fish observations
 * - Real-time aggregate calculations (avg weight, avg length, K-factor)
 * - Add/remove fish observation rows
 * - Notes (textarea, optional)
 *
 * Uses permission gates to protect write operations.
 * Supports nested creation (event + observations in one API call).
 *
 * @example
 * ```tsx
 * // Create mode
 * <HealthSamplingEventForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <HealthSamplingEventForm samplingEvent={existingEvent} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function HealthSamplingEventForm({
  samplingEvent,
  onSuccess,
  onCancel,
}: HealthSamplingEventFormProps) {
  const isEditMode = !!samplingEvent

  const form = useForm<HealthSamplingEventFormValues>({
    resolver: zodResolver(healthSamplingEventSchema),
    defaultValues: {
      assignment: 0,
      sampling_date: new Date().toISOString().split('T')[0],
      number_of_fish_sampled: 10, // Default to 10 fish
      notes: '',
      individual_fish_observations: [
        { fish_identifier: '1', weight_g: '', length_cm: '' },
      ],
    },
  })

  // Dynamic field array for fish observations
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'individual_fish_observations',
  })

  // Update form with sampling event data if in edit mode
  React.useEffect(() => {
    if (samplingEvent) {
      form.reset({
        assignment: samplingEvent.assignment,
        sampling_date: samplingEvent.sampling_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        number_of_fish_sampled: samplingEvent.number_of_fish_sampled,
        notes: samplingEvent.notes || '',
        individual_fish_observations: (samplingEvent.individual_fish_observations || []).map(obs => ({
          ...obs,
          weight_g: obs.weight_g ?? undefined,
          length_cm: obs.length_cm ?? undefined,
        })),
      })
    }
  }, [samplingEvent, form])

  const createMutation = useCreateHealthSamplingEvent()
  const updateMutation = useUpdateHealthSamplingEvent()

  // Load batch container assignments for dropdown
  const { data: assignmentsData, isLoading: assignmentsLoading } = useBatchContainerAssignments({
    isActive: true,
  })

  const onSubmit = async (values: HealthSamplingEventFormValues) => {
    try {
      // Prepare data for API
      const apiData: Partial<HealthSamplingEvent> = {
        assignment: values.assignment,
        sampling_date: values.sampling_date,
        number_of_fish_sampled: values.number_of_fish_sampled,
        notes: values.notes || undefined,
        individual_fish_observations: values.individual_fish_observations.map(obs => ({
          ...obs,
          weight_g: obs.weight_g ?? undefined,
          length_cm: obs.length_cm ?? undefined,
        })),
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: samplingEvent.id,
          ...apiData,
        } as HealthSamplingEvent & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as HealthSamplingEvent)
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

  // Add new fish observation row
  const handleAddFish = () => {
    const nextId = (fields.length + 1).toString()
    append({ fish_identifier: nextId, weight_g: '', length_cm: '' })
  }

  // Calculate aggregates from fish observations in real-time
  const fishObservations = form.watch('individual_fish_observations')
  const aggregates = useMemo(() => {
    const validObservations = fishObservations.filter(
      (obs) => obs.weight_g && obs.length_cm
    )

    if (validObservations.length === 0) {
      return null
    }

    const weights = validObservations.map((obs) => parseFloat(obs.weight_g))
    const lengths = validObservations.map((obs) => parseFloat(obs.length_cm))

    const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length
    const avgLength = lengths.reduce((sum, l) => sum + l, 0) / lengths.length

    // Calculate K-factors (condition factor: K = (weight_g / (length_cm^3)) * 100)
    const kFactors = validObservations.map((obs) => {
      const w = parseFloat(obs.weight_g)
      const l = parseFloat(obs.length_cm)
      return (w / Math.pow(l, 3)) * 100
    })
    const avgKFactor = kFactors.reduce((sum, k) => sum + k, 0) / kFactors.length

    return {
      count: validObservations.length,
      avgWeight: avgWeight.toFixed(2),
      avgLength: avgLength.toFixed(2),
      avgKFactor: avgKFactor.toFixed(4),
      minWeight: Math.min(...weights).toFixed(2),
      maxWeight: Math.max(...weights).toFixed(2),
      minLength: Math.min(...lengths).toFixed(2),
      maxLength: Math.max(...lengths).toFixed(2),
    }
  }, [fishObservations])

  return (
    <FormLayout
      form={form}
      onSubmit={onSubmit}
      header={{
        title: isEditMode ? 'Edit Health Sampling Event' : 'Create Health Sampling Event',
        description: isEditMode
          ? 'Update health sampling event and fish measurements.'
          : 'Record a health sampling event with individual fish observations and measurements.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Event' : 'Create Event',
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
          title="Sampling Event Details"
          description="Specify the batch container assignment and sampling date."
        >
          {/* Assignment - Required FK */}
          <FormField
            control={form.control}
            name="assignment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Container Assignment</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : ''}
                  disabled={assignmentsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch container assignment..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assignmentsData?.results?.map((assignment) => (
                      <SelectItem key={assignment.id} value={String(assignment.id)}>
                        Batch {assignment.batch?.batch_number || assignment.batch_id} → Container{' '}
                        {assignment.container?.name || assignment.container_id} ({assignment.population_count} fish)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the batch and container assignment being sampled.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sampling Date */}
          <FormField
            control={form.control}
            name="sampling_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sampling Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Date when the health sampling was conducted.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Fish Sampled */}
          <FormField
            control={form.control}
            name="number_of_fish_sampled"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Fish Sampled</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormDescription>
                  Target number of fish to be sampled in this event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Individual Fish Observations"
          description="Record weight and length measurements for each sampled fish."
        >
          <div className="space-y-4">
            {/* Fish observations table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Fish ID</TableHead>
                    <TableHead>Weight (g)</TableHead>
                    <TableHead>Length (cm)</TableHead>
                    <TableHead className="w-[80px]">K-Factor</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const weight = form.watch(`individual_fish_observations.${index}.weight_g`)
                    const length = form.watch(`individual_fish_observations.${index}.length_cm`)
                    const kFactor =
                      weight && length
                        ? ((parseFloat(weight) / Math.pow(parseFloat(length), 3)) * 100).toFixed(4)
                        : null

                    return (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`individual_fish_observations.${index}.fish_identifier`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Fish ID" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`individual_fish_observations.${index}.weight_g`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`individual_fish_observations.${index}.length_cm`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {kFactor || '-'}
                        </TableCell>
                        <TableCell>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              aria-label={`Remove fish ${index + 1}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Add fish button */}
            <Button type="button" variant="outline" onClick={handleAddFish} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Fish
            </Button>

            {/* Real-time aggregate calculations */}
            {aggregates && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Sample Size:</strong> {aggregates.count} fish with complete measurements
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <strong>Avg Weight:</strong> {aggregates.avgWeight} g
                      </div>
                      <div>
                        <strong>Avg Length:</strong> {aggregates.avgLength} cm
                      </div>
                      <div>
                        <strong>Weight Range:</strong> {aggregates.minWeight} - {aggregates.maxWeight} g
                      </div>
                      <div>
                        <strong>Length Range:</strong> {aggregates.minLength} - {aggregates.maxLength} cm
                      </div>
                      <div>
                        <strong>Avg K-Factor:</strong> {aggregates.avgKFactor}
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </FormSection>

        <FormSection
          title="Additional Notes"
          description="Optional notes about the sampling event."
        >
          {/* Notes - Optional Textarea */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any observations or notes about the sampling event..."
                    className="min-h-[80px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Additional observations or context about the sampling event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>
      </WriteGate>
    </FormLayout>
  )
}


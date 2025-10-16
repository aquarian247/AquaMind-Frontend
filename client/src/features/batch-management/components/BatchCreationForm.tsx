import React, { useMemo, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import {
  batchCreationSchema,
  type BatchCreationFormValues,
  batchStatusEnum,
  batchTypeEnum,
} from '@/lib/validation/batch'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import {
  Form,
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WriteGate } from '@/features/shared/permissions'
import {
  useCreateBatchWithAssignments,
  useSpecies,
  useLifecycleStages,
} from '../api'
import {
  useGeographies,
  useFreshwaterStations,
} from '@/features/infrastructure/api'
import { BatchCreationAssignmentRow } from './BatchCreationAssignmentRow'

interface BatchCreationFormProps {
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Batch creation form with inline container assignments.
 * 
 * Creates batch + assignments atomically with rollback on failure.
 * 
 * Features:
 * - Basic batch information (number, species, dates)
 * - Fixed Egg&Alevin lifecycle stage (auto-selected)
 * - Shared Geography → FreshwaterStation selection
 * - Dynamic container assignments (Hall → Container cascade per row)
 * - Real-time population and biomass totals
 * - Prevents duplicate container selection
 * - Minimum 1 assignment required
 * - Atomic creation with automatic rollback
 */
export function BatchCreationForm({ onSuccess, onCancel }: BatchCreationFormProps) {
  // Load data for dropdowns first (needed for default values)
  const { data: speciesData, isLoading: speciesLoading } = useSpecies()
  const { data: stagesData, isLoading: stagesLoading } = useLifecycleStages({ ordering: 'order' })
  const { data: geographiesData, isLoading: geographiesLoading } = useGeographies()

  // Get Egg&Alevin stage (should be order 1)
  const eggAlevinStage = stagesData?.results?.find((s) => s.name === 'Egg&Alevin')

  const form = useForm<BatchCreationFormValues>({
    resolver: zodResolver(batchCreationSchema),
    defaultValues: {
      batch_number: '',
      species: undefined as any,
      lifecycle_stage: eggAlevinStage?.id || undefined,
      status: 'ACTIVE',
      batch_type: 'STANDARD',
      start_date: new Date().toISOString().split('T')[0],
      expected_end_date: '',
      notes: '',
      geography: undefined as any,
      freshwater_station: undefined as any,
      assignments: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'assignments',
  })

  const createMutation = useCreateBatchWithAssignments()

  // Watch for cascading filters
  const selectedGeographyId = form.watch('geography')
  const selectedStationId = form.watch('freshwater_station')
  const assignments = form.watch('assignments')

  // Load stations filtered by geography
  const { data: stationsData, isLoading: stationsLoading } = useFreshwaterStations(
    selectedGeographyId ? { geography: selectedGeographyId, active: true } : undefined
  )

  // Calculate real-time totals
  const totalPopulation = useMemo(
    () => assignments.reduce((sum, a) => sum + (a.population_count || 0), 0),
    [assignments]
  )

  const totalBiomass = useMemo(
    () => assignments.reduce((sum, a) => sum + (a.biomass_kg || 0), 0),
    [assignments]
  )

  // Get selected container IDs to prevent duplicates
  const selectedContainerIds = useMemo(
    () => assignments.map((a) => a.container).filter((id): id is number => !!id),
    [assignments]
  )

  // Set lifecycle_stage when Egg&Alevin stage loads
  useEffect(() => {
    if (eggAlevinStage && !form.getValues('lifecycle_stage')) {
      form.setValue('lifecycle_stage', eggAlevinStage.id, { shouldValidate: true })
    }
  }, [eggAlevinStage, form])

  const handleAddAssignment = () => {
    append({
      tempId: `assignment-${Date.now()}-${Math.random()}`,
      hall: undefined as any,
      container: undefined as any,
      population_count: undefined as any,
      avg_weight_g: '0.50', // Default egg weight (2 decimal places)
      notes: '',
    })
  }

  const onSubmit = async (values: BatchCreationFormValues) => {
    try {
      // Ensure lifecycle_stage is set to Egg&Alevin
      if (eggAlevinStage) {
        values.lifecycle_stage = eggAlevinStage.id
      }

      console.log('Submitting batch creation with values:', {
        ...values,
        assignments: values.assignments.length,
      })

      await createMutation.mutateAsync(values)
      form.reset()
      onSuccess?.()
    } catch (error) {
      // Error handled by mutation hook (toast)
      console.error('Form submission error:', error)
      console.error('Error details:', error)
    }
  }

  const handleCancel = () => {
    form.reset()
    onCancel?.()
  }

  const species = speciesData?.results || []
  const geographies = geographiesData?.results || []
  const stations = stationsData?.results || []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create Batch with Assignments</h2>
          <p className="text-sm text-muted-foreground">
            Create a new Egg & Alevin batch and assign it to containers in one step
          </p>
        </div>

        {/* Section 1: Basic Batch Info */}
        <FormSection
          title="Batch Information"
          description="Basic details about the new batch"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* Batch Number */}
            <FormField
              control={form.control}
              name="batch_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. TEST-2025-001" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Species */}
            <FormField
              control={form.control}
              name="species"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Species*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ''}
                    disabled={speciesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={speciesLoading ? 'Loading...' : 'Select species'}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {species.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name} ({s.scientific_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Lifecycle Stage (Fixed to Egg&Alevin) */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Lifecycle Stage
              </label>
              <Input
                value={eggAlevinStage?.name || 'Loading...'}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                New batches always start at Egg & Alevin stage
              </p>
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'ACTIVE'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Start Date */}
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected End Date */}
            <FormField
              control={form.control}
              name="expected_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription className="text-xs">Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Optional notes about this batch..."
                    className="resize-none"
                    rows={3}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Section 2: Location Context */}
        <FormSection
          title="Location"
          description="Select geography and freshwater station (shared across all assignments)"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* Geography */}
            <FormField
              control={form.control}
              name="geography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geography*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ''}
                    disabled={geographiesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={geographiesLoading ? 'Loading...' : 'Select geography'}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {geographies.map((geo) => (
                        <SelectItem key={geo.id} value={geo.id.toString()}>
                          {geo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Freshwater Station */}
            <FormField
              control={form.control}
              name="freshwater_station"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Freshwater Station*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ''}
                    disabled={stationsLoading || !selectedGeographyId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedGeographyId
                              ? 'Select geography first'
                              : stationsLoading
                              ? 'Loading stations...'
                              : 'Select station'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id.toString()}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Section 3: Container Assignments */}
        <FormSection
          title="Container Assignments"
          description="Assign this batch to Egg & Alevin trays. At least one assignment is required."
        >
          {/* Running totals */}
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Total Fish: {totalPopulation.toLocaleString()}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Total Biomass: {totalBiomass.toFixed(2)} kg
            </Badge>
          </div>

          {/* Assignment rows */}
          <div className="space-y-4">
            {fields.length === 0 && (
              <Alert>
                <AlertDescription>
                  No assignments yet. Click "Add Container Assignment" to begin.
                </AlertDescription>
              </Alert>
            )}

            {fields.map((field, index) => (
              <BatchCreationAssignmentRow
                key={field.id}
                index={index}
                freshwaterStationId={selectedStationId}
                selectedContainerIds={selectedContainerIds}
                onRemove={() => remove(index)}
              />
            ))}
          </div>

          {/* Add assignment button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddAssignment}
            disabled={!selectedStationId}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Container Assignment
          </Button>

          {!selectedStationId && (
            <p className="text-sm text-muted-foreground text-center">
              Select a freshwater station to add assignments
            </p>
          )}

          {form.formState.errors.assignments?.root && (
            <p className="text-sm text-destructive text-center">
              {form.formState.errors.assignments.root.message}
            </p>
          )}
        </FormSection>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <WriteGate>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || fields.length === 0}
              onClick={() => {
                console.log('Form state:', {
                  isValid: form.formState.isValid,
                  errors: form.formState.errors,
                  values: form.getValues(),
                })
              }}
            >
              {form.formState.isSubmitting ? 'Creating...' : 'Create Batch with Assignments'}
            </Button>
          </WriteGate>
        </div>
      </form>
    </Form>
  )
}


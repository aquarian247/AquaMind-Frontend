import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { freshwaterStationSchema, stationTypeEnum, type FreshwaterStationFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateFreshwaterStation, useUpdateFreshwaterStation, useGeographies } from '../api'
import type { FreshwaterStation } from '@/api/generated'

interface FreshwaterStationFormProps {
  /** Existing station to edit (undefined for create mode) */
  station?: FreshwaterStation
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Freshwater Station create/edit form component.
 * 
 * Form fields:
 * - Name (required, max 100 chars)
 * - Station Type (required, enum: FRESHWATER or BROODSTOCK)
 * - Geography (FK dropdown, required)
 * - Latitude (-90 to 90, required)
 * - Longitude (-180 to 180, required)
 * - Description (optional, multiline)
 * - Active (boolean, defaults to true)
 * 
 * Uses permission gates to protect write operations.
 * 
 * @example
 * ```tsx
 * // Create mode
 * <FreshwaterStationForm onSuccess={() => console.log('Created!')} />
 * 
 * // Edit mode
 * <FreshwaterStationForm station={existingStation} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function FreshwaterStationForm({ station, onSuccess, onCancel }: FreshwaterStationFormProps) {
  const isEditMode = !!station

  const form = useForm<FreshwaterStationFormValues>({
    resolver: zodResolver(freshwaterStationSchema),
    defaultValues: {
      name: station?.name || '',
      station_type: station?.station_type || 'FRESHWATER',
      geography: station?.geography || undefined,
      latitude: station?.latitude || '',
      longitude: station?.longitude || '',
      description: station?.description || '',
      active: station?.active ?? true,
    },
  })

  const createMutation = useCreateFreshwaterStation()
  const updateMutation = useUpdateFreshwaterStation()
  const { data: geographiesData, isLoading: geographiesLoading } = useGeographies()

  const onSubmit = async (values: FreshwaterStationFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: station.id,
          ...values,
        } as FreshwaterStation)
      } else {
        await createMutation.mutateAsync(values as FreshwaterStation)
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
        title: isEditMode ? 'Edit Freshwater Station' : 'Create Freshwater Station',
        description: isEditMode
          ? 'Update freshwater station details and location.'
          : 'Define a new freshwater station for fish production.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Station' : 'Create Station',
          disabled: form.formState.isSubmitting,
        },
        secondaryAction: onCancel ? {
          type: 'button',
          variant: 'outline',
          children: 'Cancel',
          onClick: handleCancel,
        } : undefined,
      }}
    >
      <FormSection
        title="Basic Information"
        description="Provide identification and location details for this freshwater station."
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="station-name">Name *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="station-name"
                    aria-label="Station Name"
                    placeholder="e.g., Smolt Unit 1, Hatchery A"
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
          name="station_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="station-type">Station Type *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value}</div>
              }>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="station-type" aria-label="Station Type">
                      <SelectValue placeholder="Select station type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stationTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
          name="geography"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="station-geography">Geography *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {geographiesData?.results?.find(g => g.id === field.value)?.name || 'N/A'}
                </div>
              }>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value?.toString()}
                  disabled={geographiesLoading}
                >
                  <FormControl>
                    <SelectTrigger id="station-geography" aria-label="Geography">
                      <SelectValue placeholder="Select a geography" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {geographiesData?.results?.map((geography) => (
                      <SelectItem key={geography.id} value={geography.id.toString()}>
                        {geography.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="station-latitude">Latitude * (-90 to 90)</FormLabel>
                <WriteGate fallback={
                  <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
                }>
                  <FormControl>
                    <Input
                      id="station-latitude"
                      aria-label="Latitude"
                      type="text"
                      placeholder="e.g., 62.000000"
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
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="station-longitude">Longitude * (-180 to 180)</FormLabel>
                <WriteGate fallback={
                  <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
                }>
                  <FormControl>
                    <Input
                      id="station-longitude"
                      aria-label="Longitude"
                      type="text"
                      placeholder="e.g., -6.783333"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="station-description">Description</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Textarea
                    id="station-description"
                    aria-label="Station Description"
                    placeholder="Optional details about this station..."
                    rows={3}
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
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {field.value ? 'Active' : 'Inactive'}
                </div>
              }>
                <FormControl>
                  <input
                    type="checkbox"
                    id="station-active"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormLabel htmlFor="station-active" className="font-normal">
                  Active
                </FormLabel>
              </WriteGate>
            </FormItem>
          )}
        />
      </FormSection>
    </FormLayout>
  )
}

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { hallSchema, type HallFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateHall, useUpdateHall, useFreshwaterStations } from '../api'
import type { Hall } from '@/api/generated'

interface HallFormProps {
  /** Existing hall to edit (undefined for create mode) */
  hall?: Hall
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Hall create/edit form component.
 * 
 * Form fields:
 * - Name (required, max 100 chars)
 * - Freshwater Station (FK dropdown, required)
 * - Description (optional, multiline)
 * - Active (boolean, defaults to true)
 * 
 * Uses permission gates to protect write operations.
 * 
 * @example
 * ```tsx
 * // Create mode
 * <HallForm onSuccess={() => console.log('Created!')} />
 * 
 * // Edit mode
 * <HallForm hall={existingHall} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function HallForm({ hall, onSuccess, onCancel }: HallFormProps) {
  const isEditMode = !!hall

  const form = useForm<HallFormValues>({
    resolver: zodResolver(hallSchema),
    defaultValues: {
      name: hall?.name || '',
      freshwater_station: hall?.freshwater_station || ('' as any),
      description: hall?.description || '',
      area_sqm: hall?.area_sqm || '',
      active: hall?.active ?? true,
    },
  })

  const createMutation = useCreateHall()
  const updateMutation = useUpdateHall()
  const { data: stationsData, isLoading: stationsLoading } = useFreshwaterStations()

  const onSubmit = async (values: HallFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: hall.id,
          ...values,
        } as Hall)
      } else {
        await createMutation.mutateAsync(values as Hall)
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
        title: isEditMode ? 'Edit Hall' : 'Create Hall',
        description: isEditMode
          ? 'Update production hall details and assignment.'
          : 'Define a new production hall within a freshwater station.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Hall' : 'Create Hall',
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
        title="Hall Details"
        description="Provide identification and location details for this production hall."
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="hall-name">Name *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="hall-name"
                    aria-label="Hall Name"
                    placeholder="e.g., Hall 1, Tank Room A"
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
          name="freshwater_station"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="hall-station">Freshwater Station *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {stationsData?.results?.find(s => s.id === field.value)?.name || 'N/A'}
                </div>
              }>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : ('' as any))}
                  value={field.value?.toString() || ''}
                  disabled={stationsLoading}
                >
                  <FormControl>
                    <SelectTrigger id="hall-station" aria-label="Freshwater Station">
                      <SelectValue placeholder="Select a freshwater station" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stationsData?.results?.map((station) => (
                      <SelectItem key={station.id} value={station.id.toString()}>
                        {station.name}
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
          name="area_sqm"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="hall-area-sqm">Area (m²)</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'} m²</div>
              }>
                <FormControl>
                  <Input
                    id="hall-area-sqm"
                    aria-label="Area Square Meters"
                    type="text"
                    placeholder="e.g., 500.75"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="hall-description">Description</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Textarea
                    id="hall-description"
                    aria-label="Hall Description"
                    placeholder="Optional details about this hall..."
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
                    id="hall-active"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormLabel htmlFor="hall-active" className="font-normal">
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

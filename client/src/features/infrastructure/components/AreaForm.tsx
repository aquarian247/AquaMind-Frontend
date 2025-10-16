import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { areaSchema, type AreaFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateArea, useUpdateArea, useGeographies } from '../api'
import type { Area } from '@/api/generated'

interface AreaFormProps {
  /** Existing area to edit (undefined for create mode) */
  area?: Area
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Area create/edit form component.
 * 
 * More complex form with:
 * - Name (required, max 100 chars)
 * - Geography (FK dropdown, required)
 * - Latitude (-90 to 90, required)
 * - Longitude (-180 to 180, required)
 * - Max Biomass (positive decimal, required)
 * - Active (boolean, defaults to true)
 * 
 * Uses permission gates to protect write operations.
 * 
 * @example
 * ```tsx
 * // Create mode
 * <AreaForm onSuccess={() => console.log('Created!')} />
 * 
 * // Edit mode
 * <AreaForm area={existingArea} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function AreaForm({ area, onSuccess, onCancel }: AreaFormProps) {
  const isEditMode = !!area

  const form = useForm<AreaFormValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: area?.name || '',
      geography: area?.geography || ('' as any),
      latitude: area?.latitude || '',
      longitude: area?.longitude || '',
      max_biomass: area?.max_biomass || '',
      active: area?.active ?? true,
    },
  })

  const createMutation = useCreateArea()
  const updateMutation = useUpdateArea()
  const { data: geographiesData, isLoading: geographiesLoading } = useGeographies()

  const onSubmit = async (values: AreaFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: area.id,
          ...values,
        } as Area)
      } else {
        await createMutation.mutateAsync(values as Area)
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
        title: isEditMode ? 'Edit Area' : 'Create Area',
        description: isEditMode
          ? 'Update sea area details and location.'
          : 'Define a new sea area with geographic coordinates.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Area' : 'Create Area',
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
        description="Provide identification and location details for this area."
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="area-name">Name *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="area-name"
                    aria-label="Area Name"
                    placeholder="e.g., Site Alpha, North Bay"
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
          name="geography"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="area-geography">Geography *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {geographiesData?.results?.find(g => g.id === field.value)?.name || 'N/A'}
                </div>
              }>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : ('' as any))}
                  value={field.value?.toString() || ''}
                  disabled={geographiesLoading}
                >
                  <FormControl>
                    <SelectTrigger id="area-geography" aria-label="Geography">
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
                    id="area-active"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormLabel htmlFor="area-active" className="font-normal">
                  Active
                </FormLabel>
              </WriteGate>
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Geographic Coordinates"
        description="Specify the precise location of this area."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="area-latitude">Latitude * (-90 to 90)</FormLabel>
                <WriteGate fallback={
                  <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
                }>
                  <FormControl>
                    <Input
                      id="area-latitude"
                      aria-label="Latitude"
                      type="text"
                      placeholder="e.g., 59.9139"
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
                <FormLabel htmlFor="area-longitude">Longitude * (-180 to 180)</FormLabel>
                <WriteGate fallback={
                  <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
                }>
                  <FormControl>
                    <Input
                      id="area-longitude"
                      aria-label="Longitude"
                      type="text"
                      placeholder="e.g., 10.7522"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <FormSection
        title="Capacity"
        description="Define the maximum biomass capacity for this area."
      >
        <FormField
          control={form.control}
          name="max_biomass"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="area-max-biomass">Maximum Biomass (tonnes) *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'} tonnes</div>
              }>
                <FormControl>
                  <Input
                    id="area-max-biomass"
                    aria-label="Maximum Biomass"
                    type="text"
                    placeholder="e.g., 100000.00"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormMessage />
              <p className="text-xs text-muted-foreground">Enter value in tonnes (stored as kg internally)</p>
            </FormItem>
          )}
        />
      </FormSection>
    </FormLayout>
  )
}

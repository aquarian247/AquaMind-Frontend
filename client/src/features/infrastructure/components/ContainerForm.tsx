import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { containerSchema, type ContainerFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateContainer, useUpdateContainer, useContainerTypes, useHalls, useAreas } from '../api'
import type { Container } from '@/api/generated'

interface ContainerFormProps {
  /** Existing container to edit (undefined for create mode) */
  container?: Container
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Container create/edit form component.
 * 
 * Features:
 * - Name (required, max 100 chars)
 * - Container Type (FK dropdown, required)
 * - Hall (FK dropdown, nullable) - XOR with area
 * - Area (FK dropdown, nullable) - XOR with hall
 * - Volume M3 (positive decimal, 2 places, required)
 * - Max Biomass Kg (positive decimal, 2 places, required)
 * - Feed Recommendations Enabled (boolean, defaults false)
 * - Active (boolean, defaults true)
 * 
 * **Mutual Exclusion**: Container must be assigned to EITHER a hall OR an area, not both.
 * When one is selected, the other is automatically cleared.
 * 
 * Uses permission gates to protect write operations.
 * 
 * @example
 * ```tsx
 * // Create mode
 * <ContainerForm onSuccess={() => console.log('Created!')} />
 * 
 * // Edit mode
 * <ContainerForm container={existingContainer} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function ContainerForm({ container, onSuccess, onCancel }: ContainerFormProps) {
  const isEditMode = !!container

  const form = useForm<ContainerFormValues>({
    resolver: zodResolver(containerSchema),
    defaultValues: {
      name: container?.name || '',
      container_type: container?.container_type || ('' as any),
      hall: container?.hall || null,
      area: container?.area || null,
      volume_m3: container?.volume_m3 || '',
      max_biomass_kg: container?.max_biomass_kg || '',
      feed_recommendations_enabled: container?.feed_recommendations_enabled ?? false,
      active: container?.active ?? true,
    },
  })

  const createMutation = useCreateContainer()
  const updateMutation = useUpdateContainer()
  const { data: containerTypesData, isLoading: containerTypesLoading } = useContainerTypes()
  const { data: hallsData, isLoading: hallsLoading } = useHalls()
  const { data: areasData, isLoading: areasLoading } = useAreas()

  // Watch hall and area fields for mutual exclusion
  const hallValue = form.watch('hall')
  const areaValue = form.watch('area')

  // Implement mutual exclusion: if one is set, clear the other
  useEffect(() => {
    if (hallValue && areaValue) {
      // Both are set, clear area (hall was selected last)
      form.setValue('area', null)
    }
  }, [hallValue, areaValue, form])

  const onSubmit = async (values: ContainerFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: container.id,
          ...values,
        })
      } else {
        await createMutation.mutateAsync(values as any)
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
        title: isEditMode ? 'Edit Container' : 'Create Container',
        description: isEditMode
          ? 'Update container details and assignment.'
          : 'Define a new container for fish production.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Container' : 'Create Container',
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
        description="Provide identification and type details for this container."
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="container-name">Name *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="container-name"
                    aria-label="Container Name"
                    placeholder="e.g., Tank 1A, Ring 24"
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
          name="container_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="container-type">Container Type *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {containerTypesData?.results?.find(t => t.id === field.value)?.name || 'N/A'}
                </div>
              }>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : ('' as any))}
                  value={field.value?.toString() || ''}
                  disabled={containerTypesLoading}
                >
                  <FormControl>
                    <SelectTrigger id="container-type" aria-label="Container Type">
                      <SelectValue placeholder="Select a container type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {containerTypesData?.results?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name} ({type.category})
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
        title="Location Assignment"
        description="Assign this container to either a production hall (freshwater) OR a sea area. Not both."
      >
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            A container must be assigned to <strong>either</strong> a hall (freshwater) <strong>or</strong> an area (sea).
            Selecting one will clear the other.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="hall"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="container-hall">Hall (Freshwater)</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {field.value ? hallsData?.results?.find(h => h.id === field.value)?.name || 'N/A' : 'Not assigned to hall'}
                </div>
              }>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value ? parseInt(value, 10) : null)
                    // Clear area when hall is selected
                    form.setValue('area', null)
                  }}
                  value={field.value?.toString() || ''}
                  disabled={hallsLoading || !!areaValue}
                >
                  <FormControl>
                    <SelectTrigger id="container-hall" aria-label="Hall">
                      <SelectValue placeholder={areaValue ? "Area selected (hall disabled)" : "Select a hall"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None (clear selection)</SelectItem>
                    {hallsData?.results?.map((hall) => (
                      <SelectItem key={hall.id} value={hall.id.toString()}>
                        {hall.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormDescription>
                Production hall for freshwater containers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="container-area">Area (Sea)</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {field.value ? areasData?.results?.find(a => a.id === field.value)?.name || 'N/A' : 'Not assigned to area'}
                </div>
              }>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value ? parseInt(value, 10) : null)
                    // Clear hall when area is selected
                    form.setValue('hall', null)
                  }}
                  value={field.value?.toString() || ''}
                  disabled={areasLoading || !!hallValue}
                >
                  <FormControl>
                    <SelectTrigger id="container-area" aria-label="Area">
                      <SelectValue placeholder={hallValue ? "Hall selected (area disabled)" : "Select an area"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None (clear selection)</SelectItem>
                    {areasData?.results?.map((area) => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormDescription>
                Sea area for marine containers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Capacity Specifications"
        description="Define the physical capacity and biomass limits for this container."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="volume_m3"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="container-volume">Volume (m³) *</FormLabel>
                <WriteGate fallback={
                  <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
                }>
                  <FormControl>
                    <Input
                      id="container-volume"
                      aria-label="Volume"
                      type="text"
                      placeholder="e.g., 100.00"
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
            name="max_biomass_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="container-max-biomass">Max Biomass (kg) *</FormLabel>
                <WriteGate fallback={
                  <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
                }>
                  <FormControl>
                    <Input
                      id="container-max-biomass"
                      aria-label="Maximum Biomass"
                      type="text"
                      placeholder="e.g., 50000.00"
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
        title="Settings"
        description="Configure operational settings for this container."
      >
        <FormField
          control={form.control}
          name="feed_recommendations_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {field.value ? 'Feed recommendations enabled' : 'Feed recommendations disabled'}
                </div>
              }>
                <FormControl>
                  <input
                    type="checkbox"
                    id="container-feed-recs"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormLabel htmlFor="container-feed-recs" className="font-normal">
                  Enable Feed Recommendations
                </FormLabel>
              </WriteGate>
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
                    id="container-active"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormLabel htmlFor="container-active" className="font-normal">
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

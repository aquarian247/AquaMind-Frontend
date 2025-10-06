import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feedContainerSchema, feedContainerTypeEnum, type FeedContainerFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateFeedContainer, useUpdateFeedContainer, useHalls, useAreas, useFreshwaterStations } from '../api'
import type { FeedContainer } from '@/api/generated'

interface FeedContainerFormProps {
  /** Existing feed container to edit (undefined for create mode) */
  feedContainer?: FeedContainer
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Feed Container create/edit form component.
 * 
 * Form fields:
 * - Name (required, max 100 chars)
 * - Container Type (required, enum: SILO, BARGE, TANK, OTHER)
 * - Hall (FK dropdown, nullable) - XOR with area - for silos in freshwater
 * - Area (FK dropdown, nullable) - XOR with hall - for barges at sea
 * - Capacity Kg (positive decimal, 2 places, required)
 * - Active (boolean, defaults to true)
 * 
 * **Mutual Exclusion**: Feed container must be assigned to EITHER a hall OR an area, not both.
 * - Silos typically go in halls (freshwater stations)
 * - Barges typically go in areas (sea)
 * 
 * Includes cascading filters:
 * - For hall: Select station first, then hall
 * - For area: Direct selection
 * 
 * Uses permission gates to protect write operations.
 * 
 * @example
 * ```tsx
 * // Create mode
 * <FeedContainerForm onSuccess={() => console.log('Created!')} />
 * 
 * // Edit mode
 * <FeedContainerForm feedContainer={existingContainer} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function FeedContainerForm({ feedContainer, onSuccess, onCancel }: FeedContainerFormProps) {
  const isEditMode = !!feedContainer

  // Filter state for cascading station → hall selection
  const [filterStation, setFilterStation] = useState<number | undefined>(undefined)

  const form = useForm<FeedContainerFormValues>({
    resolver: zodResolver(feedContainerSchema),
    defaultValues: {
      name: feedContainer?.name || '',
      container_type: feedContainer?.container_type || 'SILO',
      hall: feedContainer?.hall || null,
      area: feedContainer?.area || null,
      capacity_kg: feedContainer?.capacity_kg || '',
      active: feedContainer?.active ?? true,
    },
  })

  const createMutation = useCreateFeedContainer()
  const updateMutation = useUpdateFeedContainer()
  
  // Load filter options
  const { data: stationsData, isLoading: stationsLoading } = useFreshwaterStations()
  const { data: areasData, isLoading: areasLoading } = useAreas()
  
  // Load halls filtered by selected station
  const { data: hallsData, isLoading: hallsLoading } = useHalls(
    filterStation ? { freshwater_station: filterStation } : undefined
  )

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

  const onSubmit = async (values: FeedContainerFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: feedContainer.id,
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
        title: isEditMode ? 'Edit Feed Container' : 'Create Feed Container',
        description: isEditMode
          ? 'Update feed storage container details.'
          : 'Define a new feed storage container (silo in hall or barge in area).',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Feed Container' : 'Create Feed Container',
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
        description="Provide identification and type details for this feed container."
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feedcontainer-name">Name *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="feedcontainer-name"
                    aria-label="Feed Container Name"
                    placeholder="e.g., Silo 1, Feed Barge Alpha"
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
              <FormLabel htmlFor="feedcontainer-type">Container Type *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value}</div>
              }>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="feedcontainer-type" aria-label="Container Type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feedContainerTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormDescription>
                SILO/TANK for halls (freshwater), BARGE for areas (sea)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feedcontainer-capacity">Capacity (kg) *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="feedcontainer-capacity"
                    aria-label="Capacity"
                    type="text"
                    placeholder="e.g., 5000.00"
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
        title="Location Assignment"
        description="Assign this feed container to either a production hall (silo) OR a sea area (barge). Not both."
      >
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Feed containers can be:
            <br />
            <strong>Silos/Tanks</strong> in Halls (select Station → Hall)
            <br />
            <strong>Barges</strong> in Sea Areas (select Area)
          </AlertDescription>
        </Alert>

        {/* Freshwater path: Station → Hall */}
        <div className="space-y-3">
          <FormLabel className="text-base font-semibold">
            Freshwater (Silos/Tanks) - Select Station & Hall
          </FormLabel>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel htmlFor="filter-station">1. Freshwater Station</FormLabel>
              <Select
                value={filterStation?.toString() || 'none'}
                onValueChange={(value) => {
                  if (value === 'none') {
                    setFilterStation(undefined)
                    form.setValue('hall', null) // Clear hall when station cleared
                  } else {
                    setFilterStation(parseInt(value, 10))
                    form.setValue('hall', null) // Clear hall when changing station
                  }
                }}
                disabled={stationsLoading || !!areaValue}
              >
                <SelectTrigger id="filter-station">
                  <SelectValue placeholder={areaValue ? "Area selected (station disabled)" : "Select a station..."} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No selection</SelectItem>
                  {stationsData?.results?.map((station) => (
                    <SelectItem key={station.id} value={station.id.toString()}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                Choose the freshwater station
              </FormDescription>
            </div>

            <FormField
              control={form.control}
              name="hall"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="feedcontainer-hall">2. Hall in Station</FormLabel>
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
                      disabled={hallsLoading || !filterStation || !!areaValue}
                    >
                      <FormControl>
                        <SelectTrigger id="feedcontainer-hall" aria-label="Hall">
                          <SelectValue placeholder={
                            !filterStation 
                              ? "Select a station first..." 
                              : areaValue
                              ? "Area selected (hall disabled)"
                              : hallsData?.results?.length === 0
                              ? "No halls in this station"
                              : "Select a hall..."
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hallsData?.results?.map((hall) => (
                          <SelectItem key={hall.id} value={hall.id.toString()}>
                            {hall.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </WriteGate>
                  <FormDescription className="text-xs">
                    {!filterStation 
                      ? "Choose a station first"
                      : hallsData?.results?.length 
                      ? `${hallsData.results.length} hall${hallsData.results.length !== 1 ? 's' : ''} in this station`
                      : "No halls found"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="pt-3 border-t">
          <FormLabel className="text-base font-semibold">
            Sea (Barges) - Select Area
          </FormLabel>
          
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="feedcontainer-area">Area</FormLabel>
                <WriteGate fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value ? areasData?.results?.find(a => a.id === field.value)?.name || 'N/A' : 'Not assigned to area'}
                  </div>
                }>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value ? parseInt(value, 10) : null)
                      // Clear hall and station when area is selected
                      form.setValue('hall', null)
                      setFilterStation(undefined)
                    }}
                    value={field.value?.toString() || ''}
                    disabled={areasLoading || !!hallValue}
                  >
                    <FormControl>
                      <SelectTrigger id="feedcontainer-area" aria-label="Area">
                        <SelectValue placeholder={hallValue ? "Hall selected (area disabled)" : "Select an area..."} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areasData?.results?.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </WriteGate>
                <FormDescription>
                  Sea area for feed barges
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <FormSection
        title="Settings"
        description="Configure operational settings for this feed container."
      >
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
                    id="feedcontainer-active"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormLabel htmlFor="feedcontainer-active" className="font-normal">
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
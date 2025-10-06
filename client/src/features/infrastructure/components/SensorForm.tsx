import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sensorSchema, sensorTypeEnum, type SensorFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateSensor, useUpdateSensor, useContainers, useAreas, useHalls } from '../api'
import type { Sensor } from '@/api/generated'

interface SensorFormProps {
  /** Existing sensor to edit (undefined for create mode) */
  sensor?: Sensor
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Sensor create/edit form component.
 * 
 * Form fields:
 * - Name (required, max 100 chars) - User-defined name
 * - Sensor Type (required, enum: TEMPERATURE, OXYGEN, PH, SALINITY, CO2, OTHER)
 * - Container (FK dropdown, required)
 * - Serial Number (optional) - Manufacturer serial number
 * - Manufacturer (optional) - Device manufacturer
 * - Installation Date (optional) - When installed
 * - Last Calibration Date (optional) - Last calibrated
 * - Active (boolean, defaults to true)
 * 
 * Uses permission gates to protect write operations.
 * 
 * @example
 * ```tsx
 * // Create mode
 * <SensorForm onSuccess={() => console.log('Created!')} />
 * 
 * // Edit mode
 * <SensorForm sensor={existingSensor} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function SensorForm({ sensor, onSuccess, onCancel }: SensorFormProps) {
  const isEditMode = !!sensor

  // Filter state for narrowing down container selection
  const [filterArea, setFilterArea] = useState<number | undefined>(undefined)
  const [filterHall, setFilterHall] = useState<number | undefined>(undefined)

  const form = useForm<SensorFormValues>({
    resolver: zodResolver(sensorSchema),
    defaultValues: {
      name: sensor?.name || '',
      sensor_type: sensor?.sensor_type || 'TEMPERATURE',
      container: sensor?.container || ('' as any),
      serial_number: sensor?.serial_number || '',
      manufacturer: sensor?.manufacturer || '',
      installation_date: sensor?.installation_date || '',
      last_calibration_date: sensor?.last_calibration_date || '',
      active: sensor?.active ?? true,
    },
  })

  const createMutation = useCreateSensor()
  const updateMutation = useUpdateSensor()
  
  // Load filter options
  const { data: areasData, isLoading: areasLoading } = useAreas()
  const { data: hallsData, isLoading: hallsLoading } = useHalls()
  
  // Load containers with filters applied
  const { data: containersData, isLoading: containersLoading } = useContainers({
    area: filterArea,
    hall: filterHall,
  })

  // Count filtered containers
  const containerCount = containersData?.results?.length || 0

  const onSubmit = async (values: SensorFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: sensor.id,
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
        title: isEditMode ? 'Edit Sensor' : 'Create Sensor',
        description: isEditMode
          ? 'Update sensor identification and assignment.'
          : 'Register a new sensor device for environmental monitoring.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Sensor' : 'Create Sensor',
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
        title="Container Filter"
        description="Narrow down container selection by location (optional but recommended)."
      >
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            With 1000+ containers, use these filters to find the right one. Select an <strong>Area</strong> (for sea containers) <strong>or</strong> a <strong>Hall</strong> (for freshwater containers).
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FormLabel htmlFor="filter-area">Filter by Area (Sea)</FormLabel>
            <Select
              value={filterArea?.toString() || 'none'}
              onValueChange={(value) => {
                if (value === 'none') {
                  setFilterArea(undefined)
                } else {
                  setFilterArea(parseInt(value, 10))
                  setFilterHall(undefined) // Clear hall when area selected
                }
                form.setValue('container', '' as any) // Clear container selection
              }}
              disabled={areasLoading}
            >
              <SelectTrigger id="filter-area">
                <SelectValue placeholder="Select an area..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No filter (all areas)</SelectItem>
                {areasData?.results?.map((area) => (
                  <SelectItem key={area.id} value={area.id.toString()}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <FormLabel htmlFor="filter-hall">Filter by Hall (Freshwater)</FormLabel>
            <Select
              value={filterHall?.toString() || 'none'}
              onValueChange={(value) => {
                if (value === 'none') {
                  setFilterHall(undefined)
                } else {
                  setFilterHall(parseInt(value, 10))
                  setFilterArea(undefined) // Clear area when hall selected
                }
                form.setValue('container', '' as any) // Clear container selection
              }}
              disabled={hallsLoading}
            >
              <SelectTrigger id="filter-hall">
                <SelectValue placeholder="Select a hall..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No filter (all halls)</SelectItem>
                {hallsData?.results?.map((hall) => (
                  <SelectItem key={hall.id} value={hall.id.toString()}>
                    {hall.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(filterArea || filterHall) && (
          <div className="text-sm text-muted-foreground">
            Showing {containerCount} container{containerCount !== 1 ? 's' : ''} {filterArea ? 'in selected area' : 'in selected hall'}
          </div>
        )}
      </FormSection>

      <FormSection
        title="Sensor Details"
        description="Provide identification and assignment details for this sensor device."
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="sensor-name">Name *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="sensor-name"
                    aria-label="Sensor Name"
                    placeholder="e.g., Tank 1 Temp Sensor, Oxygen Probe - Pen 5"
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
          name="sensor_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="sensor-type">Sensor Type *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value}</div>
              }>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="sensor-type" aria-label="Sensor Type">
                      <SelectValue placeholder="Select sensor type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sensorTypeEnum.options.map((type) => (
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
          name="container"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="sensor-container">Container *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {containersData?.results?.find(c => c.id === field.value)?.name || 'N/A'}
                </div>
              }>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : ('' as any))}
                  value={field.value?.toString() || ''}
                  disabled={containersLoading}
                >
                  <FormControl>
                    <SelectTrigger id="sensor-container" aria-label="Container">
                      <SelectValue placeholder={
                        containerCount === 0 
                          ? "Use filters above to narrow down containers"
                          : `Select from ${containerCount} container${containerCount !== 1 ? 's' : ''}...`
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {containerCount > 100 && (
                      <div className="px-2 py-1 text-sm text-orange-600 bg-orange-50">
                        {containerCount} containers - consider using filters above
                      </div>
                    )}
                    {containersData?.results?.map((container) => (
                      <SelectItem key={container.id} value={container.id.toString()}>
                        {container.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormDescription>
                {!filterArea && !filterHall && containerCount > 50 
                  ? "💡 Tip: Use Area or Hall filters above to reduce the list"
                  : `${containerCount} container${containerCount !== 1 ? 's' : ''} available`
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serial_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="sensor-serial">Serial Number</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="sensor-serial"
                    aria-label="Serial Number"
                    placeholder="e.g., SN-123456789"
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
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="sensor-manufacturer">Manufacturer</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="sensor-manufacturer"
                    aria-label="Manufacturer"
                    placeholder="e.g., AquaSense, OxyTech"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="installation_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="sensor-install-date">Installation Date</FormLabel>
                <WriteGate fallback={
                  <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
                }>
                  <FormControl>
                    <Input
                      id="sensor-install-date"
                      aria-label="Installation Date"
                      type="date"
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
            name="last_calibration_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="sensor-cal-date">Last Calibration Date</FormLabel>
                <WriteGate fallback={
                  <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
                }>
                  <FormControl>
                    <Input
                      id="sensor-cal-date"
                      aria-label="Last Calibration Date"
                      type="date"
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
                    id="sensor-active"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormLabel htmlFor="sensor-active" className="font-normal">
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

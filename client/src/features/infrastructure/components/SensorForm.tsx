import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sensorSchema, sensorTypeEnum, type SensorFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateSensor, useUpdateSensor, useContainers } from '../api'
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
  const { data: containersData, isLoading: containersLoading } = useContainers()

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
                      <SelectValue placeholder="Select a container" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {containersData?.results?.map((container) => (
                      <SelectItem key={container.id} value={container.id.toString()}>
                        {container.name}
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

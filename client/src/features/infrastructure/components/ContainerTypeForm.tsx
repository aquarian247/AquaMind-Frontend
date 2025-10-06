import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { containerTypeSchema, containerCategoryEnum, type ContainerTypeFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateContainerType, useUpdateContainerType } from '../api'
import type { ContainerType } from '@/api/generated'

interface ContainerTypeFormProps {
  /** Existing container type to edit (undefined for create mode) */
  containerType?: ContainerType
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Container Type create/edit form component.
 * 
 * Form fields:
 * - Name (required, max 100 chars)
 * - Category (required, enum: TANK, PEN, TRAY, OTHER)
 * - Max Volume M3 (positive decimal, 2 places, required)
 * - Description (optional, multiline)
 * 
 * Uses permission gates to protect write operations.
 * 
 * @example
 * ```tsx
 * // Create mode
 * <ContainerTypeForm onSuccess={() => console.log('Created!')} />
 * 
 * // Edit mode
 * <ContainerTypeForm containerType={existingType} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function ContainerTypeForm({ containerType, onSuccess, onCancel }: ContainerTypeFormProps) {
  const isEditMode = !!containerType

  const form = useForm<ContainerTypeFormValues>({
    resolver: zodResolver(containerTypeSchema),
    defaultValues: {
      name: containerType?.name || '',
      category: containerType?.category || 'TANK',
      max_volume_m3: containerType?.max_volume_m3 || '',
      description: containerType?.description || '',
    },
  })

  const createMutation = useCreateContainerType()
  const updateMutation = useUpdateContainerType()

  const onSubmit = async (values: ContainerTypeFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: containerType.id,
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
        title: isEditMode ? 'Edit Container Type' : 'Create Container Type',
        description: isEditMode
          ? 'Update container type specifications and capacity.'
          : 'Define a new container type template for use across facilities.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Container Type' : 'Create Container Type',
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
        title="Container Type Details"
        description="Define the specifications and capacity for this container type."
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="type-name">Name *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="type-name"
                    aria-label="Container Type Name"
                    placeholder="e.g., 100m3 Tank, Net Pen 24m"
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="type-category">Category *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value}</div>
              }>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="type-category" aria-label="Container Category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {containerCategoryEnum.options.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
          name="max_volume_m3"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="type-max-volume">Maximum Volume (m³) *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="type-max-volume"
                    aria-label="Maximum Volume"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="type-description">Description</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Textarea
                    id="type-description"
                    aria-label="Container Type Description"
                    placeholder="Optional specifications or notes about this container type..."
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

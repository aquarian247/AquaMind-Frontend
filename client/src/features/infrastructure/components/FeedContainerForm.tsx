import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feedContainerSchema, type FeedContainerFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateFeedContainer, useUpdateFeedContainer, useHalls } from '../api'
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
 * - Hall (FK dropdown, required)
 * - Capacity Kg (positive decimal, 2 places, required)
 * - Active (boolean, defaults to true)
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

  const form = useForm<FeedContainerFormValues>({
    resolver: zodResolver(feedContainerSchema),
    defaultValues: {
      name: feedContainer?.name || '',
      hall: feedContainer?.hall || undefined,
      capacity_kg: feedContainer?.capacity_kg || '',
      active: feedContainer?.active ?? true,
    },
  })

  const createMutation = useCreateFeedContainer()
  const updateMutation = useUpdateFeedContainer()
  const { data: hallsData, isLoading: hallsLoading } = useHalls()

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
          : 'Define a new feed storage container within a production hall.',
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
        title="Feed Container Details"
        description="Provide identification, location, and capacity details for this feed container."
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
                    placeholder="e.g., Silo 1, Feed Tank A"
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
          name="hall"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feedcontainer-hall">Hall *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">
                  {hallsData?.results?.find(h => h.id === field.value)?.name || 'N/A'}
                </div>
              }>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value?.toString()}
                  disabled={hallsLoading}
                >
                  <FormControl>
                    <SelectTrigger id="feedcontainer-hall" aria-label="Hall">
                      <SelectValue placeholder="Select a hall" />
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

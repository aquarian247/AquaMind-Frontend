import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { geographySchema, type GeographyFormValues } from '@/lib/validation'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateGeography, useUpdateGeography } from '../api'
import type { Geography } from '@/api/generated'

interface GeographyFormProps {
  /** Existing geography to edit (undefined for create mode) */
  geography?: Geography
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Geography create/edit form component.
 * 
 * Simple form with name (required, max 100 chars) and description (optional).
 * Uses permission gates to protect write operations.
 * 
 * @example
 * ```tsx
 * // Create mode
 * <GeographyForm onSuccess={() => console.log('Created!')} />
 * 
 * // Edit mode
 * <GeographyForm geography={existingGeography} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function GeographyForm({ geography, onSuccess, onCancel }: GeographyFormProps) {
  const isEditMode = !!geography

  const form = useForm<GeographyFormValues>({
    resolver: zodResolver(geographySchema),
    defaultValues: {
      name: geography?.name || '',
      description: geography?.description || '',
    },
  })

  const createMutation = useCreateGeography()
  const updateMutation = useUpdateGeography()

  const onSubmit = async (values: GeographyFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: geography.id,
          ...values,
        } as Geography)
      } else {
        await createMutation.mutateAsync(values as Geography)
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
        title: isEditMode ? 'Edit Geography' : 'Create Geography',
        description: isEditMode
          ? 'Update geographic region details.'
          : 'Define a new geographic region for organizing areas.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Geography' : 'Create Geography',
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
        title="Geography Details"
        description="Provide basic information about this geographic region."
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="geography-name">Name *</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Input
                    id="geography-name"
                    aria-label="Geography Name"
                    placeholder="e.g., Norwegian Coast, North Sea"
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
              <FormLabel htmlFor="geography-description">Description</FormLabel>
              <WriteGate fallback={
                <div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>
              }>
                <FormControl>
                  <Textarea
                    id="geography-description"
                    aria-label="Geography Description"
                    placeholder="Optional details about this region..."
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

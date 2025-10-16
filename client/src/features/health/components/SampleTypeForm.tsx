import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  sampleTypeSchema,
  type SampleTypeFormValues,
} from '@/lib/validation/health'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateSampleType, useUpdateSampleType } from '../api'
import type { SampleType } from '@/api/generated'

interface SampleTypeFormProps {
  /** Existing sample type to edit (undefined for create mode) */
  sampleType?: SampleType
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * SampleType create/edit form component (reference data).
 *
 * Features:
 * - Name (required, max 100 chars)
 * - Description (required)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * <SampleTypeForm onSuccess={() => console.log('Created!')} />
 * ```
 */
export function SampleTypeForm({
  sampleType,
  onSuccess,
  onCancel,
}: SampleTypeFormProps) {
  const isEditMode = !!sampleType

  const form = useForm<SampleTypeFormValues>({
    resolver: zodResolver(sampleTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // Update form with sample type data if in edit mode
  React.useEffect(() => {
    if (sampleType) {
      form.reset({
        name: sampleType.name,
        description: sampleType.description,
      })
    }
  }, [sampleType, form])

  const createMutation = useCreateSampleType()
  const updateMutation = useUpdateSampleType()

  const onSubmit = async (values: SampleTypeFormValues) => {
    try {
      const apiData: Partial<SampleType> = {
        name: values.name,
        description: values.description,
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: sampleType.id,
          ...apiData,
        } as SampleType & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as SampleType)
      }

      form.reset()
      onSuccess?.()
    } catch (error) {
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
        title: isEditMode ? 'Edit Sample Type' : 'Create Sample Type',
        description: isEditMode
          ? 'Update sample type details.'
          : 'Define a new type of laboratory sample.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Sample Type' : 'Create Sample Type',
          disabled: form.formState.isSubmitting,
        },
        secondaryAction: onCancel
          ? {
              type: 'button',
              variant: 'outline',
              children: 'Cancel',
              onClick: handleCancel,
            }
          : undefined,
      }}
    >
      <WriteGate>
        <FormSection
          title="Sample Type Details"
          description="Define the sample type name and description."
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Gill Swab, Blood Sample" {...field} />
                </FormControl>
                <FormDescription>
                  Name of the sample type (e.g., "Gill Swab", "Blood Sample").
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of the sample type, including collection methods and purpose..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description including collection methods and purpose.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>
      </WriteGate>
    </FormLayout>
  )
}





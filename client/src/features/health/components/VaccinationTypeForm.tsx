import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  vaccinationTypeSchema,
  type VaccinationTypeFormValues,
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
import { useCreateVaccinationType, useUpdateVaccinationType } from '../api'
import type { VaccinationType } from '@/api/generated'

interface VaccinationTypeFormProps {
  /** Existing vaccination type to edit (undefined for create mode) */
  vaccinationType?: VaccinationType
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * VaccinationType create/edit form component (reference data).
 *
 * Features:
 * - Name (required, max 100 chars)
 * - Manufacturer (required, max 100 chars)
 * - Dosage (optional)
 * - Description (required)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * <VaccinationTypeForm onSuccess={() => console.log('Created!')} />
 * ```
 */
export function VaccinationTypeForm({
  vaccinationType,
  onSuccess,
  onCancel,
}: VaccinationTypeFormProps) {
  const isEditMode = !!vaccinationType

  const form = useForm<VaccinationTypeFormValues>({
    resolver: zodResolver(vaccinationTypeSchema),
    defaultValues: {
      name: '',
      manufacturer: '',
      dosage: '',
      description: '',
    },
  })

  // Update form with vaccination type data if in edit mode
  React.useEffect(() => {
    if (vaccinationType) {
      form.reset({
        name: vaccinationType.name,
        manufacturer: vaccinationType.manufacturer,
        dosage: vaccinationType.dosage || '',
        description: vaccinationType.description,
      })
    }
  }, [vaccinationType, form])

  const createMutation = useCreateVaccinationType()
  const updateMutation = useUpdateVaccinationType()

  const onSubmit = async (values: VaccinationTypeFormValues) => {
    try {
      const apiData: Partial<VaccinationType> = {
        name: values.name,
        manufacturer: values.manufacturer,
        dosage: values.dosage,
        description: values.description,
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: vaccinationType.id,
          ...apiData,
        } as VaccinationType & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as VaccinationType)
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
        title: isEditMode ? 'Edit Vaccination Type' : 'Create Vaccination Type',
        description: isEditMode
          ? 'Update vaccination type details.'
          : 'Define a new vaccination type for treatments.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Vaccination Type' : 'Create Vaccination Type',
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
          title="Vaccination Type Details"
          description="Define the vaccination type, manufacturer, and dosage information."
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., PD Vaccine, IPN Vaccine" {...field} />
                </FormControl>
                <FormDescription>
                  Name of the vaccination type.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Pharmaq, Elanco" {...field} />
                </FormControl>
                <FormDescription>
                  Manufacturer or supplier of the vaccine.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 0.1 mL per fish" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Standard dosage information for this vaccine.
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
                    placeholder="Detailed description including diseases targeted and efficacy information..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description including diseases targeted and efficacy.
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


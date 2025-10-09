import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  treatmentSchema,
  treatmentTypeEnum,
  type TreatmentFormValues,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateTreatment, useUpdateTreatment, useVaccinationTypes } from '../api'
import { useBatches } from '@/features/batch-management/api'
import { useContainers } from '@/features/infrastructure/api'
import type { Treatment } from '@/api/generated'

interface TreatmentFormProps {
  /** Existing treatment to edit (undefined for create mode) */
  treatment?: Treatment
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Treatment create/edit form component.
 *
 * Features:
 * - Batch (FK dropdown, required)
 * - Container (FK dropdown, required)
 * - Treatment type (enum: medication, vaccination, physical, other)
 * - Vaccination type (FK dropdown, CONDITIONAL - only if treatment_type is 'vaccination')
 * - Description (required)
 * - Dosage (optional)
 * - Duration days (optional integer)
 * - Withholding period days (optional integer)
 * - Outcome (optional textarea)
 *
 * Uses permission gates to protect write operations.
 * Conditional field: vaccination_type only shown when treatment_type is 'vaccination'.
 *
 * @example
 * ```tsx
 * <TreatmentForm onSuccess={() => console.log('Created!')} />
 * ```
 */
export function TreatmentForm({
  treatment,
  onSuccess,
  onCancel,
}: TreatmentFormProps) {
  const isEditMode = !!treatment

  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      batch: 0,
      container: 0,
      batch_assignment: undefined,
      treatment_type: 'medication',
      vaccination_type: undefined,
      description: '',
      dosage: '',
      duration_days: undefined,
      withholding_period_days: undefined,
      outcome: '',
    },
  })

  // Update form with treatment data if in edit mode
  React.useEffect(() => {
    if (treatment) {
      form.reset({
        batch: treatment.batch,
        container: treatment.container,
        batch_assignment: treatment.batch_assignment || undefined,
        treatment_type: treatment.treatment_type,
        vaccination_type: treatment.vaccination_type || undefined,
        description: treatment.description,
        dosage: treatment.dosage || '',
        duration_days: treatment.duration_days || undefined,
        withholding_period_days: treatment.withholding_period_days || undefined,
        outcome: treatment.outcome || '',
      })
    }
  }, [treatment, form])

  const createMutation = useCreateTreatment()
  const updateMutation = useUpdateTreatment()

  // Load data for dropdowns
  const { data: batchesData, isLoading: batchesLoading } = useBatches({ status: 'ACTIVE' })
  const { data: containersData, isLoading: containersLoading } = useContainers({ active: true })
  const { data: vaccinationTypesData, isLoading: vaccinationTypesLoading } = useVaccinationTypes()

  // Watch treatment type to conditionally show vaccination_type
  const treatmentType = form.watch('treatment_type')
  const showVaccinationType = treatmentType === 'vaccination'

  // Calculate withholding end date if both fields present
  const withholdingPeriodDays = form.watch('withholding_period_days')
  const withholdingEndDate = withholdingPeriodDays
    ? new Date(Date.now() + withholdingPeriodDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
    : null

  const onSubmit = async (values: TreatmentFormValues) => {
    try {
      const apiData: Partial<Treatment> = {
        batch: values.batch,
        container: values.container,
        batch_assignment: values.batch_assignment || null,
        treatment_type: values.treatment_type,
        vaccination_type: values.vaccination_type || null,
        description: values.description,
        dosage: values.dosage,
        duration_days: values.duration_days || null,
        withholding_period_days: values.withholding_period_days || null,
        outcome: values.outcome,
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: treatment.id,
          ...apiData,
        } as Treatment & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as Treatment)
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
        title: isEditMode ? 'Edit Treatment' : 'Record Treatment',
        description: isEditMode
          ? 'Update treatment details.'
          : 'Record a treatment administered to a batch in a container.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Treatment' : 'Record Treatment',
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
          title="Treatment Details"
          description="Specify the batch, container, and treatment type."
        >
          {/* Batch - Required FK */}
          <FormField
            control={form.control}
            name="batch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : ''}
                  disabled={batchesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batchesData?.results?.map((batch) => (
                      <SelectItem key={batch.id} value={String(batch.id)}>
                        {batch.batch_number || `Batch ${batch.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Batch that received the treatment.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Container - Required FK */}
          <FormField
            control={form.control}
            name="container"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Container</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : ''}
                  disabled={containersLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select container..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {containersData?.results?.map((container) => (
                      <SelectItem key={container.id} value={String(container.id)}>
                        {container.name || `Container ${container.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Container where the treatment was administered.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Treatment Type - Required Enum */}
          <FormField
            control={form.control}
            name="treatment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatment Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment type..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {treatmentTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Type of treatment (medication, vaccination, physical, or other).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vaccination Type - CONDITIONAL FK (only if treatment_type is 'vaccination') */}
          {showVaccinationType && (
            <FormField
              control={form.control}
              name="vaccination_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccination Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? String(field.value) : ''}
                    disabled={vaccinationTypesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vaccination type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vaccinationTypesData?.results?.map((vaccType) => (
                        <SelectItem key={vaccType.id} value={String(vaccType.id)}>
                          {vaccType.name} - {vaccType.manufacturer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specific vaccination type (required for vaccination treatments).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </FormSection>

        <FormSection
          title="Treatment Information"
          description="Describe the treatment and its parameters."
        >
          {/* Description - Required Textarea */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of the treatment administered..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description of the treatment administered.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Dosage - Optional */}
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
                    Dosage amount with units.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration Days - Optional Integer */}
            <FormField
              control={form.control}
              name="duration_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Days, Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Treatment duration in days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Withholding Period Days - Optional Integer */}
          <FormField
            control={form.control}
            name="withholding_period_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Withholding Period (Days, Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>
                  Number of days fish must be withheld from harvest after treatment.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Withholding End Date Calculation (Display Only) */}
          {withholdingEndDate && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Withholding End Date:</strong> {withholdingEndDate}
                <br />
                <span className="text-sm text-muted-foreground">
                  Fish from this batch can be harvested after this date.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Outcome - Optional Textarea */}
          <FormField
            control={form.control}
            name="outcome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outcome (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Outcome or result of the treatment..."
                    className="min-h-[80px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Outcome or result of the treatment.
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


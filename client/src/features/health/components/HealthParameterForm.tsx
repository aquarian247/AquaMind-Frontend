import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  healthParameterSchema,
  type HealthParameterFormValues,
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
import { Checkbox } from '@/components/ui/checkbox'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateHealthParameter, useUpdateHealthParameter } from '../api'
import { HealthParameterDeleteButton } from './HealthParameterDeleteButton'
import type { HealthParameter } from '@/api/generated'

interface HealthParameterFormProps {
  /** Existing health parameter to edit (undefined for create mode) */
  healthParameter?: HealthParameter
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * HealthParameter create/edit form component (reference data).
 *
 * Features:
 * - Name (required, max 100 chars)
 * - Description (optional)
 * - Min Score (required, default 0)
 * - Max Score (required, default 3)
 * - Is Active (checkbox, default true)
 * - Validation: max_score must be > min_score
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * <HealthParameterForm onSuccess={() => console.log('Created!')} />
 * ```
 */
export function HealthParameterForm({
  healthParameter,
  onSuccess,
  onCancel,
}: HealthParameterFormProps) {
  const isEditMode = !!healthParameter

  const form = useForm<HealthParameterFormValues>({
    resolver: zodResolver(healthParameterSchema),
    defaultValues: {
      name: '',
      description: '',
      min_score: 0,
      max_score: 3,
      is_active: true,
    },
  })

  // Update form with health parameter data if in edit mode
  React.useEffect(() => {
    if (healthParameter) {
      form.reset({
        name: healthParameter.name,
        description: healthParameter.description || '',
        min_score: healthParameter.min_score ?? 0,
        max_score: healthParameter.max_score ?? 3,
        is_active: healthParameter.is_active ?? true,
      })
    }
  }, [healthParameter, form])

  const createMutation = useCreateHealthParameter()
  const updateMutation = useUpdateHealthParameter()

  const onSubmit = async (values: HealthParameterFormValues) => {
    try {
      const apiData: Partial<HealthParameter> = {
        name: values.name,
        description: values.description || '',
        min_score: values.min_score,
        max_score: values.max_score,
        is_active: values.is_active,
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: healthParameter.id,
          ...apiData,
        } as HealthParameter & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as HealthParameter)
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
        title: isEditMode ? 'Edit Health Parameter' : 'Create Health Parameter',
        description: isEditMode
          ? 'Update health parameter configuration.'
          : 'Define a new health parameter for veterinary assessments.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Parameter' : 'Create Parameter',
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
          title="Parameter Details"
          description="Define the health parameter name and description."
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parameter Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Gill Condition, Eye Clarity" {...field} />
                </FormControl>
                <FormDescription>
                  Name of the health parameter (e.g., "Gill Condition", "Fin Integrity").
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
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="General description of this health parameter..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  General description of what this parameter assesses.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Score Range Configuration"
          description="Define the valid score range for this parameter."
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="min_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Lowest score value (e.g., 0 for best condition)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="3"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Highest score value (e.g., 3 for worst condition)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
            <p className="font-medium mb-1">Score Range Example:</p>
            <p>
              For a 0-3 range: 0 (Excellent), 1 (Good), 2 (Fair), 3 (Poor)
            </p>
            <p className="mt-1">
              You'll define the specific labels and descriptions for each score value after creating the parameter.
            </p>
          </div>
        </FormSection>

        <FormSection
          title="Status"
          description="Set whether this parameter is currently in use."
        >
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>
                    Enable this parameter for use in health assessments
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </FormSection>

        {isEditMode && healthParameter && (
          <FormSection
            title="Delete Parameter"
            description="Permanently delete this health parameter and all associated score definitions."
          >
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="font-medium text-destructive mb-2">⚠️ Warning: Irreversible Action</p>
                <p className="mb-2">
                  Deleting this parameter will:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Remove all associated score definitions ({healthParameter.score_definitions?.length || 0} definitions)</li>
                  <li>Prevent this parameter from being used in future health assessments</li>
                  <li>NOT delete existing fish parameter scores (historical data preserved)</li>
                </ul>
                <p className="mt-2 text-xs">
                  Note: Existing health assessments using this parameter will retain their scores, 
                  but the parameter cannot be used for new assessments.
                </p>
              </div>
              
              <HealthParameterDeleteButton
                healthParameter={healthParameter}
                onSuccess={onSuccess}
              />
            </div>
          </FormSection>
        )}
      </WriteGate>
    </FormLayout>
  )
}





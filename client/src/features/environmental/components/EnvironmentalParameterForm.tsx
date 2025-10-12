import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  environmentalParameterSchema,
  type EnvironmentalParameterFormValues,
} from '@/lib/validation/environmental';
import { FormLayout, FormSection } from '@/features/shared/components/form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WriteGate } from '@/features/shared/permissions';
import {
  useCreateEnvironmentalParameter,
  useUpdateEnvironmentalParameter,
} from '../api';
import type { EnvironmentalParameter } from '@/api/generated';

interface EnvironmentalParameterFormProps {
  /** Existing parameter to edit (undefined for create mode) */
  parameter?: EnvironmentalParameter;
  /** Callback when form submission succeeds */
  onSuccess?: () => void;
  /** Callback when user cancels */
  onCancel?: () => void;
}

/**
 * EnvironmentalParameter create/edit form component (reference data).
 *
 * Features:
 * - Name (required, max 100 chars)
 * - Unit (required, max 20 chars)
 * - Description (optional)
 * - Min/max acceptable values (optional)
 * - Optimal range values (optional)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * <EnvironmentalParameterForm onSuccess={() => console.log('Created!')} />
 * ```
 */
export function EnvironmentalParameterForm({
  parameter,
  onSuccess,
  onCancel,
}: EnvironmentalParameterFormProps) {
  const isEditMode = !!parameter;

  const form = useForm<EnvironmentalParameterFormValues>({
    resolver: zodResolver(environmentalParameterSchema),
    defaultValues: {
      name: '',
      unit: '',
      description: '',
      min_value: '',
      max_value: '',
      optimal_min: '',
      optimal_max: '',
    },
  });

  // Update form with parameter data if in edit mode
  React.useEffect(() => {
    if (parameter) {
      form.reset({
        name: parameter.name,
        unit: parameter.unit,
        description: parameter.description || '',
        min_value: parameter.min_value || '',
        max_value: parameter.max_value || '',
        optimal_min: parameter.optimal_min || '',
        optimal_max: parameter.optimal_max || '',
      });
    }
  }, [parameter, form]);

  const createMutation = useCreateEnvironmentalParameter();
  const updateMutation = useUpdateEnvironmentalParameter(parameter?.id ?? 0);

  const onSubmit = async (values: EnvironmentalParameterFormValues) => {
    try {
      const apiData: Partial<EnvironmentalParameter> = {
        name: values.name,
        unit: values.unit,
        description: values.description || null,
        min_value: values.min_value || null,
        max_value: values.max_value || null,
        optimal_min: values.optimal_min || null,
        optimal_max: values.optimal_max || null,
      };

      if (isEditMode) {
        await updateMutation.mutateAsync(apiData);
      } else {
        await createMutation.mutateAsync(apiData as EnvironmentalParameter);
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <FormLayout
      form={form}
      onSubmit={onSubmit}
      header={{
        title: isEditMode ? 'Edit Environmental Parameter' : 'Create Environmental Parameter',
        description: isEditMode
          ? 'Update environmental parameter details.'
          : 'Define a new environmental parameter with acceptable and optimal ranges.',
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
          title="Basic Information"
          description="Define the parameter name, unit, and description."
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Dissolved Oxygen, Temperature" {...field} />
                </FormControl>
                <FormDescription>
                  Name of the environmental parameter (e.g., "Dissolved Oxygen", "Temperature").
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., mg/L, °C, ppt" {...field} />
                </FormControl>
                <FormDescription>
                  Unit of measurement (e.g., "mg/L", "°C", "ppt").
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
                    placeholder="Detailed description of the parameter and its importance..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description of the parameter and its importance in aquaculture.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Acceptable Range (Optional)"
          description="Define the minimum and maximum acceptable values. Values outside this range trigger alerts."
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="min_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5.0"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum acceptable value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 12.0"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum acceptable value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection
          title="Optimal Range (Optional)"
          description="Define the optimal range for this parameter. Values in this range are ideal for fish health."
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="optimal_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optimal Minimum</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 7.0"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum optimal value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="optimal_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optimal Maximum</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 10.0"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum optimal value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>
      </WriteGate>
    </FormLayout>
  );
}


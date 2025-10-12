import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  photoperiodDataSchema,
  type PhotoperiodDataFormValues,
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WriteGate } from '@/features/shared/permissions';
import {
  useCreatePhotoperiodData,
  useUpdatePhotoperiodData,
} from '../api';
import { useAreas } from '@/features/infrastructure/api';
import type { PhotoperiodData } from '@/api/generated';

interface PhotoperiodDataFormProps {
  /** Existing photoperiod data to edit (undefined for create mode) */
  photoperiodData?: PhotoperiodData;
  /** Callback when form submission succeeds */
  onSuccess?: () => void;
  /** Callback when user cancels */
  onCancel?: () => void;
}

/**
 * PhotoperiodData create/edit form component.
 *
 * Features:
 * - Area (FK dropdown, required)
 * - Date (date picker, required)
 * - Day length hours (0-24, required)
 * - Light intensity (optional)
 * - Is interpolated (checkbox)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Create mode
 * <PhotoperiodDataForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <PhotoperiodDataForm photoperiodData={existingData} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function PhotoperiodDataForm({
  photoperiodData,
  onSuccess,
  onCancel,
}: PhotoperiodDataFormProps) {
  const isEditMode = !!photoperiodData;

  const form = useForm<PhotoperiodDataFormValues>({
    resolver: zodResolver(photoperiodDataSchema),
    defaultValues: {
      area: 0,
      date: new Date().toISOString().split('T')[0],
      day_length_hours: '',
      light_intensity: '',
      is_interpolated: false,
    },
  });

  // Update form with photoperiod data if in edit mode
  React.useEffect(() => {
    if (photoperiodData) {
      form.reset({
        area: photoperiodData.area,
        date: photoperiodData.date?.split('T')[0] || new Date().toISOString().split('T')[0],
        day_length_hours: photoperiodData.day_length_hours,
        light_intensity: photoperiodData.light_intensity || '',
        is_interpolated: photoperiodData.is_interpolated || false,
      });
    }
  }, [photoperiodData, form]);

  const createMutation = useCreatePhotoperiodData();
  const updateMutation = useUpdatePhotoperiodData(photoperiodData?.id ?? 0);

  // Load areas for dropdown
  const { data: areasData, isLoading: areasLoading } = useAreas({});

  const onSubmit = async (values: PhotoperiodDataFormValues) => {
    try {
      const apiData: Partial<PhotoperiodData> = {
        area: values.area,
        date: values.date,
        day_length_hours: values.day_length_hours,
        light_intensity: values.light_intensity || null,
        is_interpolated: values.is_interpolated,
      };

      if (isEditMode) {
        await updateMutation.mutateAsync(apiData);
      } else {
        await createMutation.mutateAsync(apiData as PhotoperiodData);
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
        title: isEditMode ? 'Edit Photoperiod Data' : 'Create Photoperiod Data',
        description: isEditMode
          ? 'Update photoperiod data details.'
          : 'Record photoperiod (day length) data for an area.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Photoperiod Data' : 'Create Photoperiod Data',
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
          title="Location and Date"
          description="Select the area and date for this photoperiod data."
        >
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value ? String(field.value) : ''}
                  disabled={areasLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {areasData?.results?.map((area) => (
                      <SelectItem key={area.id} value={String(area.id)}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The area where this photoperiod data applies.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Date for which this photoperiod data is recorded.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Photoperiod Details"
          description="Define the day length and light intensity."
        >
          <FormField
            control={form.control}
            name="day_length_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day Length (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="24"
                    placeholder="e.g., 16.5"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Natural day length in hours (0-24). Important for fish growth and maturation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="light_intensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Light Intensity (lux) (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 500.0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Light intensity in lux (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_interpolated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Interpolated Data</FormLabel>
                  <FormDescription>
                    Check if this data point was interpolated rather than measured.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </FormSection>
      </WriteGate>
    </FormLayout>
  );
}


import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  healthLabSampleSchema,
  type HealthLabSampleFormValues,
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
import { WriteGate } from '@/features/shared/permissions'
import { useCreateHealthLabSample, useUpdateHealthLabSample, useSampleTypes } from '../api'
import { useBatches } from '@/features/batch-management/api'
import { useContainers } from '@/features/infrastructure/api'
import type { HealthLabSample } from '@/api/generated'

interface HealthLabSampleFormProps {
  /** Existing lab sample to edit (undefined for create mode) */
  labSample?: HealthLabSample
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * HealthLabSample create/edit form component.
 *
 * Features:
 * - Batch (FK dropdown, required)
 * - Container (FK dropdown, required)
 * - Sample type (FK dropdown, required)
 * - Sample date (date picker, required)
 * - Date sent to lab (optional date)
 * - Date results received (optional date)
 * - Lab reference ID (optional text)
 * - Findings summary (optional textarea)
 * - Notes (optional textarea)
 * - File attachment (TODO: file upload component)
 *
 * Uses permission gates to protect write operations.
 * Backend auto-populates batch_container_assignment based on batch_id, container_id, and sample_date.
 *
 * @example
 * ```tsx
 * <HealthLabSampleForm onSuccess={() => console.log('Created!')} />
 * ```
 */
export function HealthLabSampleForm({
  labSample,
  onSuccess,
  onCancel,
}: HealthLabSampleFormProps) {
  const isEditMode = !!labSample

  const form = useForm<HealthLabSampleFormValues>({
    resolver: zodResolver(healthLabSampleSchema),
    defaultValues: {
      batch_id: 0,
      container_id: 0,
      sample_type: 0,
      sample_date: new Date().toISOString().split('T')[0],
      date_sent_to_lab: '',
      date_results_received: '',
      lab_reference_id: '',
      findings_summary: '',
      notes: '',
    },
  })

  // Update form with lab sample data if in edit mode
  React.useEffect(() => {
    if (labSample) {
      form.reset({
        batch_id: labSample.batch_id,
        container_id: labSample.container_id,
        sample_type: labSample.sample_type,
        sample_date: labSample.sample_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        date_sent_to_lab: labSample.date_sent_to_lab?.split('T')[0] || '',
        date_results_received: labSample.date_results_received?.split('T')[0] || '',
        lab_reference_id: labSample.lab_reference_id || '',
        findings_summary: labSample.findings_summary || '',
        notes: labSample.notes || '',
      })
    }
  }, [labSample, form])

  const createMutation = useCreateHealthLabSample()
  const updateMutation = useUpdateHealthLabSample()

  // Load data for dropdowns
  const { data: batchesData, isLoading: batchesLoading } = useBatches({ status: 'ACTIVE' })
  const { data: containersData, isLoading: containersLoading } = useContainers({ active: true })
  const { data: sampleTypesData, isLoading: sampleTypesLoading } = useSampleTypes()

  const onSubmit = async (values: HealthLabSampleFormValues) => {
    try {
      const apiData: Partial<HealthLabSample> = {
        batch_id: values.batch_id,
        container_id: values.container_id,
        sample_type: values.sample_type,
        sample_date: values.sample_date,
        date_sent_to_lab: values.date_sent_to_lab || null,
        date_results_received: values.date_results_received || null,
        lab_reference_id: values.lab_reference_id,
        findings_summary: values.findings_summary,
        notes: values.notes,
        // TODO: File upload - attachment field
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: labSample.id,
          ...apiData,
        } as HealthLabSample & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as HealthLabSample)
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
        title: isEditMode ? 'Edit Lab Sample' : 'Record Lab Sample',
        description: isEditMode
          ? 'Update laboratory sample details and results.'
          : 'Record a laboratory sample for testing and analysis.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Lab Sample' : 'Record Lab Sample',
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
          title="Sample Details"
          description="Specify the batch, container, and sample type."
        >
          {/* Batch - Required FK */}
          <FormField
            control={form.control}
            name="batch_id"
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
                  Batch from which the sample was taken.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Container - Required FK */}
          <FormField
            control={form.control}
            name="container_id"
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
                  Container from which the sample was taken.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sample Type - Required FK */}
          <FormField
            control={form.control}
            name="sample_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : ''}
                  disabled={sampleTypesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample type..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sampleTypesData?.results?.map((sampleType) => (
                      <SelectItem key={sampleType.id} value={String(sampleType.id)}>
                        {sampleType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Type of sample collected.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sample Date - Required */}
          <FormField
            control={form.control}
            name="sample_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Date when the sample was collected.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Laboratory Processing"
          description="Track the laboratory processing timeline and reference ID."
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Date Sent to Lab - Optional */}
            <FormField
              control={form.control}
              name="date_sent_to_lab"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Sent to Lab (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Date sent to laboratory for analysis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Results Received - Optional */}
            <FormField
              control={form.control}
              name="date_results_received"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Results Received (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Date results were received from laboratory.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Lab Reference ID - Optional */}
          <FormField
            control={form.control}
            name="lab_reference_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lab Reference ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., LAB-2025-001234" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Reference ID assigned by the laboratory for tracking.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Results & Notes"
          description="Record laboratory findings and additional notes."
        >
          {/* Findings Summary - Optional Textarea */}
          <FormField
            control={form.control}
            name="findings_summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Findings Summary (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Summary of laboratory findings and results..."
                    className="min-h-[100px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Summary of the laboratory findings and results.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes - Optional Textarea */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about the sample or results..."
                    className="min-h-[80px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Additional notes about the sample or results.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TODO: File Upload Component
              Backend expects FormData with 'attachment' field
              Implementation requires multipart/form-data handling
              Reference: apps/health/api/viewsets/lab_sample.py uses MultiPartParser
              
              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab Report Attachment (Optional)</FormLabel>
                    <FormControl>
                      <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                    </FormControl>
                    <FormDescription>
                      Upload lab report (PDF or Word document).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          */}
        </FormSection>
      </WriteGate>
    </FormLayout>
  )
}





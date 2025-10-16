import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  batchTransferSchema,
  type BatchTransferFormValues,
} from '@/lib/validation'
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
import { InfoIcon } from 'lucide-react'
import { WriteGate } from '@/features/shared/permissions'
import {
  useCreateBatchTransfer,
  useBatches,
  useBatchContainerAssignments,
} from '../api'
import { useContainers } from '@/features/infrastructure/api'

interface BatchTransferFormProps {
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Batch Transfer create form component.
 *
 * NOTE: This is a simplified transfer form. The full BatchTransfer API model
 * supports complex operations (splits, merges, lifecycle changes). This form
 * handles simple container-to-container transfers.
 *
 * Features:
 * - Batch selection (FK dropdown)
 * - Source container selection (FK dropdown)
 * - Destination container selection (FK dropdown, different from source)
 * - Transfer date (date picker, required)
 * - Population transferred (positive integer, required)
 * - Average weight (decimal, 2 places, required)
 * - Notes (textarea, optional)
 *
 * @example
 * ```tsx
 * <BatchTransferForm onSuccess={() => console.log('Transferred!')} />
 * ```
 */
export function BatchTransferForm({
  onSuccess,
  onCancel,
}: BatchTransferFormProps) {
  const form = useForm<BatchTransferFormValues>({
    resolver: zodResolver(batchTransferSchema),
    defaultValues: {
      batch: '' as any,
      from_container: '' as any,
      to_container: '' as any,
      transfer_date: new Date().toISOString().split('T')[0],
      population_transferred: '' as any,
      avg_weight_g: '',
      notes: '',
    },
  })

  const createMutation = useCreateBatchTransfer()

  // Load batches for dropdown
  const { data: batchesData, isLoading: batchesLoading } = useBatches()

  // Load containers for dropdowns
  const { data: containersData, isLoading: containersLoading } = useContainers()

  // Watch form values for validation
  const fromContainerId = form.watch('from_container')
  const toContainerId = form.watch('to_container')

  const onSubmit = async (values: BatchTransferFormValues) => {
    try {
      // Map simplified form to full API format
      // Note: This creates a basic CONTAINER transfer type
      const apiData: any = {
        source_batch: values.batch,
        transfer_type: 'CONTAINER',
        transfer_date: values.transfer_date,
        source_count: values.population_transferred,
        transferred_count: values.population_transferred,
        mortality_count: 0,
        source_biomass_kg: (values.population_transferred * parseFloat(values.avg_weight_g) / 1000).toFixed(2),
        transferred_biomass_kg: (values.population_transferred * parseFloat(values.avg_weight_g) / 1000).toFixed(2),
        notes: values.notes,
        // These might need to be set properly - depends on backend implementation
        source_lifecycle_stage: 1, // Placeholder - should come from batch
      }

      await createMutation.mutateAsync(apiData as any)

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
        title: 'Transfer Batch',
        description: 'Move fish from one container to another.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: 'Transfer Batch',
          disabled: form.formState.isSubmitting || fromContainerId === toContainerId,
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
      <Alert className="mb-4">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> This form handles simple container transfers. For batch splits,
          merges, or lifecycle changes, use the advanced transfer workflow.
        </AlertDescription>
      </Alert>

      <FormSection
        title="Transfer Details"
        description="Select batch and source/destination containers."
      >
        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="transfer-batch">Batch *</FormLabel>
              <WriteGate fallback={<div className="text-sm text-muted-foreground">N/A</div>}>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={batchesLoading}
                >
                  <FormControl>
                    <SelectTrigger id="transfer-batch">
                      <SelectValue placeholder="Select batch to transfer..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batchesData?.results?.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.batch_number} ({batch.species_name})
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
          name="from_container"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="transfer-from-container">From Container *</FormLabel>
              <WriteGate fallback={<div className="text-sm text-muted-foreground">N/A</div>}>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={containersLoading}
                >
                  <FormControl>
                    <SelectTrigger id="transfer-from-container">
                      <SelectValue placeholder="Select source container..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {containersData?.results?.map((container) => (
                      <SelectItem key={container.id} value={container.id.toString()}>
                        {container.name} - Volume: {container.volume_m3}m³
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
          name="to_container"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="transfer-to-container">To Container *</FormLabel>
              <WriteGate fallback={<div className="text-sm text-muted-foreground">N/A</div>}>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={containersLoading}
                >
                  <FormControl>
                    <SelectTrigger id="transfer-to-container">
                      <SelectValue placeholder="Select destination container..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {containersData?.results
                      ?.filter((c) => c.id !== fromContainerId)
                      .map((container) => (
                        <SelectItem key={container.id} value={container.id.toString()}>
                          {container.name} - Volume: {container.volume_m3}m³
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              {fromContainerId && toContainerId === fromContainerId && (
                <p className="text-sm text-destructive">
                  Destination must be different from source container
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transfer_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="transfer-date">Transfer Date *</FormLabel>
              <WriteGate fallback={<div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>}>
                <FormControl>
                  <Input
                    id="transfer-date"
                    type="date"
                    aria-label="Transfer Date"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Transfer Metrics"
        description="Specify population and weight details."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="population_transferred"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="transfer-population">Population Transferred *</FormLabel>
                <WriteGate fallback={<div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>}>
                  <FormControl>
                    <Input
                      id="transfer-population"
                      type="number"
                      min="1"
                      aria-label="Population Transferred"
                      placeholder="e.g., 5000"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormDescription>Number of fish to transfer</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avg_weight_g"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="transfer-avg-weight">Average Weight (g) *</FormLabel>
                <WriteGate fallback={<div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>}>
                  <FormControl>
                    <Input
                      id="transfer-avg-weight"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-label="Average Weight"
                      placeholder="e.g., 250.50"
                      {...field}
                    />
                  </FormControl>
                </WriteGate>
                <FormDescription>Average weight per fish in grams</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <FormSection
        title="Additional Information"
        description="Optional notes about this transfer."
      >
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="transfer-notes">Notes</FormLabel>
              <WriteGate fallback={<div className="text-sm text-muted-foreground">{field.value || 'N/A'}</div>}>
                <FormControl>
                  <Textarea
                    id="transfer-notes"
                    aria-label="Transfer Notes"
                    placeholder="Optional notes about this transfer..."
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

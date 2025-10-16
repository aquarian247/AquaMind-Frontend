import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  feedPurchaseSchema,
  type FeedPurchaseFormValues,
} from '@/lib/validation/inventory'
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
import { useCreateFeedPurchase, useUpdateFeedPurchase, useFeeds } from '../api'
import type { FeedPurchase } from '@/api/generated'

interface FeedPurchaseFormProps {
  /** Existing feed purchase to edit (undefined for create mode) */
  feedPurchase?: FeedPurchase
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * FeedPurchase create/edit form component.
 *
 * Features:
 * - Feed (FK dropdown, required)
 * - Purchase date (date picker, required)
 * - Quantity (decimal in kg, required)
 * - Cost per kg (decimal, required)
 * - Supplier (required, max 200 chars)
 * - Batch number (optional)
 * - Expiry date (optional date picker)
 * - Notes (textarea, optional)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Create mode
 * <FeedPurchaseForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <FeedPurchaseForm feedPurchase={existingPurchase} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function FeedPurchaseForm({
  feedPurchase,
  onSuccess,
  onCancel,
}: FeedPurchaseFormProps) {
  const isEditMode = !!feedPurchase

  const form = useForm<FeedPurchaseFormValues>({
    resolver: zodResolver(feedPurchaseSchema),
    defaultValues: {
      feed: feedPurchase?.feed || ('' as any),
      purchase_date:
        feedPurchase?.purchase_date || new Date().toISOString().split('T')[0],
      quantity_kg: feedPurchase?.quantity_kg || '',
      cost_per_kg: feedPurchase?.cost_per_kg || '',
      supplier: feedPurchase?.supplier || '',
      batch_number: feedPurchase?.batch_number || '',
      expiry_date: feedPurchase?.expiry_date || '',
      notes: feedPurchase?.notes || '',
    },
  })

  const createMutation = useCreateFeedPurchase()
  const updateMutation = useUpdateFeedPurchase()

  // Load feeds for dropdown (only active feeds)
  const { data: feedsData, isLoading: feedsLoading } = useFeeds({
    isActive: true,
    ordering: 'name',
  })

  const onSubmit = async (values: FeedPurchaseFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: feedPurchase.id,
          ...values,
        } as FeedPurchase & { id: number })
      } else {
        await createMutation.mutateAsync(values as FeedPurchase)
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

  // Calculate total cost for display
  const quantityKg = form.watch('quantity_kg')
  const costPerKg = form.watch('cost_per_kg')
  const totalCost =
    quantityKg && costPerKg
      ? (parseFloat(quantityKg) * parseFloat(costPerKg)).toFixed(2)
      : '0.00'

  return (
    <FormLayout
      form={form}
      onSubmit={onSubmit}
      header={{
        title: isEditMode ? 'Edit Feed Purchase' : 'Record Feed Purchase',
        description: isEditMode
          ? 'Update feed purchase details and costs.'
          : 'Record a new feed purchase with quantity and cost information.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Purchase' : 'Record Purchase',
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
      <FormSection
        title="Purchase Details"
        description="Feed selection and purchase information."
      >
        <FormField
          control={form.control}
          name="feed"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="purchase-feed">Feed *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {feedPurchase?.feed_name || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={feedsLoading}
                >
                  <FormControl>
                    <SelectTrigger id="purchase-feed" aria-label="Feed">
                      <SelectValue
                        placeholder={
                          feedsLoading ? 'Loading feeds...' : 'Select feed'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feedsData?.results?.map((feed) => (
                      <SelectItem key={feed.id} value={feed.id.toString()}>
                        {feed.name} ({feed.brand})
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
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="purchase-supplier">Supplier *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="purchase-supplier"
                    aria-label="Supplier"
                    placeholder="e.g., BioMar AS"
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
          name="purchase_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="purchase-date">Purchase Date *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="purchase-date"
                    type="date"
                    aria-label="Purchase Date"
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
          name="batch_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="purchase-batch-number">
                Supplier Batch Number
              </FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="purchase-batch-number"
                    aria-label="Batch Number"
                    placeholder="e.g., LOT-2025-0001"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormDescription>
                Supplier's batch/lot identification number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiry_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="purchase-expiry-date">Expiry Date</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="purchase-expiry-date"
                    type="date"
                    aria-label="Expiry Date"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormDescription>
                Feed expiration or best-before date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Quantity & Cost"
        description="Purchase quantities and pricing information."
      >
        <FormField
          control={form.control}
          name="quantity_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="purchase-quantity">Quantity (kg) *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value ? `${field.value} kg` : 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="purchase-quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-label="Quantity"
                    placeholder="e.g., 1000.00"
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
          name="cost_per_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="purchase-cost">Cost per kg *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value ? `$${field.value}` : 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="purchase-cost"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-label="Cost per kg"
                    placeholder="e.g., 2.50"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />

        {quantityKg && costPerKg && (
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm font-medium">Total Cost</div>
            <div className="text-2xl font-bold">{totalCost} DKK</div>
          </div>
        )}
      </FormSection>

      <FormSection
        title="Additional Information"
        description="Optional notes about this purchase."
      >
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="purchase-notes">Notes</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Textarea
                    id="purchase-notes"
                    aria-label="Notes"
                    placeholder="Additional notes about this purchase..."
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


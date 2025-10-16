import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  feedContainerStockSchema,
  type FeedContainerStockFormValues,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import {
  useCreateFeedContainerStock,
  useUpdateFeedContainerStock,
  useFeedContainerStock,
  useFeedPurchases,
} from '../api'
import { useFeedContainers } from '@/features/infrastructure/api'
import type { FeedContainerStock, FeedContainerStockCreate } from '@/api/generated'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FeedContainerStockFormProps {
  /** Existing stock entry to edit (undefined for create mode) */
  feedContainerStock?: FeedContainerStock
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * FeedContainerStock create/edit form component.
 *
 * Features:
 * - Feed container (FK dropdown, required)
 * - Feed purchase (FK dropdown, required)
 * - Quantity kg (decimal, required)
 * - Entry date (date picker, required)
 * - FIFO validation (warns if date is earlier than existing entries)
 * - Auto-calculated total value display
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Create mode
 * <FeedContainerStockForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <FeedContainerStockForm feedContainerStock={existing} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function FeedContainerStockForm({
  feedContainerStock,
  onSuccess,
  onCancel,
}: FeedContainerStockFormProps) {
  const isEditMode = !!feedContainerStock

  const form = useForm<FeedContainerStockFormValues>({
    resolver: zodResolver(feedContainerStockSchema),
    defaultValues: {
      feed_container: feedContainerStock?.feed_container || ('' as any),
      feed_purchase: feedContainerStock?.feed_purchase || ('' as any),
      quantity_kg: feedContainerStock?.quantity_kg || '',
      entry_date:
        feedContainerStock?.entry_date?.split('T')[0] ||
        new Date().toISOString().split('T')[0],
    },
  })

  const createMutation = useCreateFeedContainerStock()
  const updateMutation = useUpdateFeedContainerStock()

  // Load feed containers for dropdown (only active)
  const { data: feedContainersData, isLoading: feedContainersLoading } =
    useFeedContainers({ active: true })

  // Load feed purchases for dropdown
  const { data: feedPurchasesData, isLoading: feedPurchasesLoading } =
    useFeedPurchases({ ordering: '-purchase_date' })

  // Watch selected container to load existing stock for FIFO validation
  const selectedContainerId = form.watch('feed_container')
  const selectedEntryDate = form.watch('entry_date')

  // Load existing stock entries for selected container (for FIFO validation)
  const { data: existingStockData } = useFeedContainerStock(
    selectedContainerId
      ? {
          feedContainer: Number(selectedContainerId),
          ordering: 'entry_date',
        }
      : undefined
  )

  // FIFO validation: Check if entry date is earlier than any existing entries
  const [fifoWarning, setFifoWarning] = React.useState<string | null>(null)

  useEffect(() => {
    if (!selectedContainerId || !selectedEntryDate || !existingStockData?.results?.length) {
      setFifoWarning(null)
      return
    }

    // Find the earliest existing entry date
    const earliestEntry = existingStockData.results[0]
    const earliestDate = earliestEntry?.entry_date?.split('T')[0]

    if (earliestDate && selectedEntryDate < earliestDate) {
      setFifoWarning(
        `⚠️ FIFO Warning: Entry date ${selectedEntryDate} is earlier than the oldest existing entry (${earliestDate}). This may cause FIFO ordering issues.`
      )
    } else {
      setFifoWarning(null)
    }
  }, [selectedContainerId, selectedEntryDate, existingStockData])

  // Calculate total value for display
  const quantityKg = form.watch('quantity_kg')
  const selectedPurchaseId = form.watch('feed_purchase')
  const selectedPurchase = feedPurchasesData?.results?.find(
    (p) => p.id === Number(selectedPurchaseId)
  )
  const totalValue =
    quantityKg && selectedPurchase?.cost_per_kg
      ? (parseFloat(quantityKg) * parseFloat(selectedPurchase.cost_per_kg)).toFixed(2)
      : '0.00'

  const onSubmit = async (values: FeedContainerStockFormValues) => {
    try {
      const apiData: FeedContainerStockCreate = {
        feed_container: values.feed_container as number,
        feed_purchase: values.feed_purchase as number,
        quantity_kg: values.quantity_kg,
        entry_date: values.entry_date,
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: feedContainerStock.id,
          ...apiData,
        } as FeedContainerStock & { id: number })
      } else {
        await createMutation.mutateAsync(apiData)
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
        title: isEditMode ? 'Edit Feed Container Stock' : 'Add Feed to Container',
        description: isEditMode
          ? 'Update feed container stock details.'
          : 'Add feed batch to a container with FIFO tracking.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Stock' : 'Add to Container',
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
        title="Container & Purchase Selection"
        description="Select destination container and source purchase batch."
      >
        <FormField
          control={form.control}
          name="feed_container"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="stock-container">Feed Container *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {feedContainerStock?.feed_container_name || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={feedContainersLoading}
                >
                  <FormControl>
                    <SelectTrigger id="stock-container" aria-label="Feed Container">
                      <SelectValue
                        placeholder={
                          feedContainersLoading
                            ? 'Loading containers...'
                            : 'Select feed container'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feedContainersData?.results?.map((container) => (
                      <SelectItem key={container.id} value={container.id.toString()}>
                        {container.name} ({container.container_type})
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
          name="feed_purchase"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="stock-purchase">Feed Purchase *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {feedContainerStock?.feed_purchase_batch || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : ('' as any))
                  }
                  value={field.value?.toString() || ''}
                  disabled={feedPurchasesLoading}
                >
                  <FormControl>
                    <SelectTrigger id="stock-purchase" aria-label="Feed Purchase">
                      <SelectValue
                        placeholder={
                          feedPurchasesLoading
                            ? 'Loading purchases...'
                            : 'Select feed purchase batch'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feedPurchasesData?.results?.map((purchase) => (
                      <SelectItem key={purchase.id} value={purchase.id.toString()}>
                        {purchase.feed_name} - {purchase.supplier} (
                        {purchase.purchase_date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </WriteGate>
              <FormDescription>
                Select the purchase batch to add to container
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Quantity & Entry Date"
        description="Specify quantity and FIFO entry date."
      >
        <FormField
          control={form.control}
          name="quantity_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="stock-quantity">Quantity (kg) *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value ? `${field.value} kg` : 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="stock-quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-label="Quantity"
                    placeholder="e.g., 500.00"
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
          name="entry_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="stock-entry-date">Entry Date *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="stock-entry-date"
                    type="date"
                    aria-label="Entry Date"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormDescription>
                Date when feed was added to container (FIFO ordering)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FIFO Warning Alert */}
        {fifoWarning && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{fifoWarning}</AlertDescription>
          </Alert>
        )}

        {/* Existing Stock Info (if container selected) */}
        {selectedContainerId &&
          existingStockData &&
          existingStockData.results.length > 0 && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="text-sm font-medium">
                Existing Stock in Container (FIFO Order)
              </div>
              <div className="text-xs space-y-1">
                {existingStockData.results.slice(0, 3).map((stock, idx) => (
                  <div key={stock.id} className="flex justify-between">
                    <span>
                      {idx + 1}. {stock.feed_type} - {stock.entry_date.split('T')[0]}
                    </span>
                    <span>{stock.quantity_kg} kg</span>
                  </div>
                ))}
                {existingStockData.results.length > 3 && (
                  <div className="text-muted-foreground">
                    +{existingStockData.results.length - 3} more...
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Total Value Display */}
        {quantityKg && selectedPurchase && (
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm font-medium">Calculated Stock Value</div>
            <div className="text-2xl font-bold">{totalValue} DKK</div>
            <div className="text-xs text-muted-foreground">
              {quantityKg} kg × {selectedPurchase.cost_per_kg} DKK/kg
            </div>
          </div>
        )}
      </FormSection>
    </FormLayout>
  )
}


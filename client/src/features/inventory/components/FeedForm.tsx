import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  feedSchema,
  type FeedFormValues,
  feedSizeCategoryEnum,
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateFeed, useUpdateFeed } from '../api'
import type { Feed } from '@/api/generated'

interface FeedFormProps {
  /** Existing feed to edit (undefined for create mode) */
  feed?: Feed
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Feed create/edit form component.
 *
 * Features:
 * - Name (required, max 200 chars)
 * - Brand (required, max 100 chars)
 * - Size category (enum dropdown: MICRO, SMALL, MEDIUM, LARGE)
 * - Pellet size (optional decimal, mm)
 * - Protein percentage (optional, 0-100)
 * - Fat percentage (optional, 0-100)
 * - Carbohydrate percentage (optional, 0-100)
 * - Description (textarea, optional)
 * - Is active (checkbox, defaults to true)
 *
 * Uses permission gates to protect write operations.
 *
 * @example
 * ```tsx
 * // Create mode
 * <FeedForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <FeedForm feed={existingFeed} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function FeedForm({ feed, onSuccess, onCancel }: FeedFormProps) {
  const isEditMode = !!feed

  const form = useForm<FeedFormValues>({
    resolver: zodResolver(feedSchema),
    defaultValues: {
      name: feed?.name || '',
      brand: feed?.brand || '',
      size_category: feed?.size_category || ('MEDIUM' as any),
      pellet_size_mm: feed?.pellet_size_mm || '',
      protein_percentage: feed?.protein_percentage || '',
      fat_percentage: feed?.fat_percentage || '',
      carbohydrate_percentage: feed?.carbohydrate_percentage || '',
      description: feed?.description || '',
      is_active: feed?.is_active ?? true,
    },
  })

  const createMutation = useCreateFeed()
  const updateMutation = useUpdateFeed()

  const onSubmit = async (values: FeedFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: feed.id,
          ...values,
        } as Feed & { id: number })
      } else {
        await createMutation.mutateAsync(values as Feed)
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
        title: isEditMode ? 'Edit Feed' : 'Create Feed',
        description: isEditMode
          ? 'Update feed specifications and nutritional information.'
          : 'Create a new feed type with nutritional specifications.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Feed' : 'Create Feed',
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
        title="Basic Information"
        description="Core feed identification and specifications."
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feed-name">Feed Name *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="feed-name"
                    aria-label="Feed Name"
                    placeholder="e.g., Salmon Starter 2mm"
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
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feed-brand">Brand *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="feed-brand"
                    aria-label="Brand"
                    placeholder="e.g., BioMar"
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
          name="size_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feed-size-category">Size Category *</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger id="feed-size-category" aria-label="Size Category">
                      <SelectValue placeholder="Select size category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feedSizeCategoryEnum.options.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
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
          name="pellet_size_mm"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feed-pellet-size">Pellet Size (mm)</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="feed-pellet-size"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-label="Pellet Size"
                    placeholder="e.g., 2.0"
                    {...field}
                  />
                </FormControl>
              </WriteGate>
              <FormDescription>
                Actual pellet diameter in millimeters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Nutritional Information"
        description="Feed composition and nutritional content."
      >
        <FormField
          control={form.control}
          name="protein_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feed-protein">Protein (%)</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value ? `${field.value}%` : 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="feed-protein"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    aria-label="Protein Percentage"
                    placeholder="e.g., 45.0"
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
          name="fat_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feed-fat">Fat (%)</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value ? `${field.value}%` : 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="feed-fat"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    aria-label="Fat Percentage"
                    placeholder="e.g., 15.0"
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
          name="carbohydrate_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feed-carbohydrate">Carbohydrate (%)</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    {field.value ? `${field.value}%` : 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Input
                    id="feed-carbohydrate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    aria-label="Carbohydrate Percentage"
                    placeholder="e.g., 12.0"
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
        title="Additional Details"
        description="Optional description and status information."
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="feed-description">Description</FormLabel>
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {field.value || 'N/A'}
                  </div>
                }
              >
                <FormControl>
                  <Textarea
                    id="feed-description"
                    aria-label="Description"
                    placeholder="Additional notes about this feed type..."
                    rows={3}
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
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <WriteGate
                fallback={
                  <div className="text-sm text-muted-foreground">
                    Status: {field.value ? 'Active' : 'Inactive'}
                  </div>
                }
              >
                <FormControl>
                  <Checkbox
                    id="feed-is-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Is Active"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="feed-is-active">Active</FormLabel>
                  <FormDescription>
                    Inactive feeds are hidden from selection dropdowns
                  </FormDescription>
                </div>
              </WriteGate>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>
    </FormLayout>
  )
}



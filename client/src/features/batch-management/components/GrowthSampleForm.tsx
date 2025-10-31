/**
 * Growth Sample Form Component
 * 
 * Allows operators to record growth samples with individual fish measurements.
 * Features dynamic table for entering weight/length per fish with real-time K-factor calculation.
 */

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormLayout, FormSection } from '@/features/shared/components/form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Ruler } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCreateGrowthSample } from '../api'
import { growthSampleSchema, type GrowthSampleFormValues } from '@/lib/validation/growth-sample'

interface GrowthSampleFormProps {
  /** Pre-selected assignment ID (from container card context) */
  assignmentId: number

  /** Callback when form submission succeeds */
  onSuccess?: () => void

  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Calculate K-factor for display
 * K = 100 * (weight_g / length_cm³)
 */
function calculateKFactor(weight: number | string, length: number | string): string {
  const w = typeof weight === 'string' ? parseFloat(weight) : weight
  const l = typeof length === 'string' ? parseFloat(length) : length

  if (isNaN(w) || isNaN(l) || l <= 0) {
    return '-'
  }

  const kFactor = (100 * w) / Math.pow(l, 3)
  return kFactor.toFixed(2)
}

/**
 * Growth Sample Form for recording individual fish measurements.
 * 
 * Operators record weight and length for each fish, and the system automatically
 * calculates aggregates (avg, std dev, min, max, K-factor) on the backend.
 */
export function GrowthSampleForm({
  assignmentId,
  onSuccess,
  onCancel,
}: GrowthSampleFormProps) {
  const createMutation = useCreateGrowthSample()

  const form = useForm<GrowthSampleFormValues>({
    resolver: zodResolver(growthSampleSchema),
    defaultValues: {
      assignment: assignmentId,
      sample_date: new Date().toISOString().split('T')[0],
      notes: '',
      individual_observations: Array.from({ length: 10 }, (_, i) => ({
        fish_identifier: String(i + 1),
        weight_g: 0,
        length_cm: 0,
      })),
    },
  })

  // Dynamic field array for fish observations
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'individual_observations',
  })

  const onSubmit = async (values: GrowthSampleFormValues) => {
    try {
      await createMutation.mutateAsync({
        assignment: values.assignment,
        sample_date: values.sample_date,
        notes: values.notes || null,
        individual_observations: values.individual_observations.map(fish => ({
          fish_identifier: fish.fish_identifier,
          weight_g: String(fish.weight_g),
          length_cm: String(fish.length_cm),
        })),
      } as any)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create growth sample:', error)
    }
  }

  const addFishRow = () => {
    const nextFishNumber = fields.length + 1
    append({
      fish_identifier: String(nextFishNumber),
      weight_g: 0,
      length_cm: 0,
    })
  }

  const removeFishRow = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <FormLayout
      form={form}
      onSubmit={onSubmit}
      header={{
        title: 'Record Growth Sample',
        description: 'Enter individual fish measurements. Aggregates will be calculated automatically.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: 'Save Growth Sample',
          disabled: createMutation.isPending,
        },
        secondaryAction: onCancel
          ? {
              type: 'button',
              variant: 'outline',
              children: 'Cancel',
              onClick: onCancel,
            }
          : undefined,
      }}
    >
      <FormSection
        title="Sample Details"
        description="Record the sampling date and any additional notes."
      >
        {/* Sample Date */}
        <FormField
          control={form.control}
          name="sample_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sample Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional observations or comments..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Individual Fish Measurements"
        description={`Recording ${fields.length} fish. Aggregates will be calculated automatically.`}
      >
        <div className="space-y-4">
          {/* Info Alert */}
          <Alert>
            <Ruler className="h-4 w-4" />
            <AlertDescription>
              Enter weight (g) and length (cm) for each fish. K-factor will be calculated
              automatically. Aggregates (average, std dev, min, max) are calculated on the
              backend.
            </AlertDescription>
          </Alert>

          {/* Fish observations table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Fish ID</TableHead>
                  <TableHead>Weight (g)</TableHead>
                  <TableHead>Length (cm)</TableHead>
                  <TableHead className="w-[100px]">K-Factor</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const weight = form.watch(`individual_observations.${index}.weight_g`)
                  const length = form.watch(`individual_observations.${index}.length_cm`)
                  const kFactor = calculateKFactor(weight, length)

                  return (
                    <TableRow key={field.id}>
                      {/* Fish ID */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`individual_observations.${index}.fish_identifier`}
                          render={({ field }) => (
                            <Input
                              placeholder={`${index + 1}`}
                              className="w-full"
                              {...field}
                            />
                          )}
                        />
                      </TableCell>

                      {/* Weight */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`individual_observations.${index}.weight_g`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                            />
                          )}
                        />
                      </TableCell>

                      {/* Length */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`individual_observations.${index}.length_cm`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                            />
                          )}
                        />
                      </TableCell>

                      {/* Calculated K-Factor */}
                      <TableCell className="text-center font-mono text-sm">
                        {kFactor}
                      </TableCell>

                      {/* Remove button */}
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFishRow(index)}
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Add fish button */}
          <Button type="button" variant="outline" onClick={addFishRow} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Fish
          </Button>
        </div>
      </FormSection>
    </FormLayout>
  )
}

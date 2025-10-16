import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useHalls, useContainers } from '@/features/infrastructure/api'
import type { BatchCreationFormValues } from '@/lib/validation/batch'

interface BatchCreationAssignmentRowProps {
  /** Index of this assignment in the assignments array */
  index: number
  /** Selected freshwater station ID (shared across all assignments) */
  freshwaterStationId: number | undefined
  /** Container IDs already selected in other rows */
  selectedContainerIds: number[]
  /** Callback when remove button is clicked */
  onRemove: () => void
}

/**
 * Single assignment row for batch creation form.
 * 
 * Features:
 * - Hall dropdown (filtered by station)
 * - Container dropdown (filtered by hall + TRAY category, excludes selected)
 * - Population count input
 * - Average weight input (grams, 3 decimal places)
 * - Auto-calculated biomass badge
 * - Remove button
 * - Optional notes textarea
 */
export function BatchCreationAssignmentRow({
  index,
  freshwaterStationId,
  selectedContainerIds,
  onRemove,
}: BatchCreationAssignmentRowProps) {
  const form = useFormContext<BatchCreationFormValues>()

  // Watch this assignment's hall and values for container filtering and biomass calc
  const selectedHallId = form.watch(`assignments.${index}.hall`)
  const selectedContainerId = form.watch(`assignments.${index}.container`)
  const populationCount = form.watch(`assignments.${index}.population_count`) || 0
  const avgWeightG = form.watch(`assignments.${index}.avg_weight_g`) || '0'

  // Check if this container is selected in another row
  const isDuplicate = selectedContainerId && selectedContainerIds.filter((_, i) => i !== index).includes(selectedContainerId)

  // Load halls filtered by freshwater station
  const { data: hallsData, isLoading: hallsLoading } = useHalls(
    freshwaterStationId ? { freshwater_station: freshwaterStationId, active: true } : undefined
  )

  // Load containers filtered by hall + TRAY category, excluding already selected
  const { data: containersData, isLoading: containersLoading } = useContainers(
    selectedHallId
      ? {
          hall: selectedHallId,
          container_type__category: 'TRAY',
          active: true,
          exclude_ids: selectedContainerIds.filter((_, i) => i !== index), // Exclude others, not self
        }
      : undefined
  )

  // Calculate biomass (population * avg_weight_g / 1000)
  const biomassKg = (populationCount * parseFloat(avgWeightG || '0')) / 1000

  // Update biomass_kg field when calculation changes
  useEffect(() => {
    form.setValue(`assignments.${index}.biomass_kg`, biomassKg, { shouldValidate: false })
  }, [biomassKg, form, index])

  const halls = hallsData?.results || []
  const containers = containersData?.results || []

  return (
    <div className="grid gap-4 p-4 border rounded-lg bg-card relative">
      {/* Remove button (top right) */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={onRemove}
        title="Remove assignment"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>

      {/* Row 1: Hall + Container */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Hall selection */}
        <FormField
          control={form.control}
          name={`assignments.${index}.hall`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hall</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString() || ''}
                disabled={hallsLoading || !freshwaterStationId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !freshwaterStationId
                          ? 'Select station first'
                          : hallsLoading
                          ? 'Loading halls...'
                          : 'Select hall'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {halls.map((hall) => (
                    <SelectItem key={hall.id} value={hall.id.toString()}>
                      {hall.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Container selection */}
        <FormField
          control={form.control}
          name={`assignments.${index}.container`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Container (Egg & Alevin Tray)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString() || ''}
                disabled={containersLoading || !selectedHallId}
              >
                <FormControl>
                  <SelectTrigger className={isDuplicate ? 'border-destructive' : ''}>
                    <SelectValue
                      placeholder={
                        !selectedHallId
                          ? 'Select hall first'
                          : containersLoading
                          ? 'Loading containers...'
                          : containers.length === 0
                          ? 'No available trays'
                          : 'Select container'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {containers.map((container) => (
                    <SelectItem key={container.id} value={container.id.toString()}>
                      {container.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Duplicate container warning */}
      {isDuplicate && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This container is already selected in another assignment. Please choose a different container.
          </AlertDescription>
        </Alert>
      )}

      {/* Row 2: Population + Weight + Biomass badge */}
      <div className="grid gap-4 md:grid-cols-3 items-end">
        {/* Population count */}
        <FormField
          control={form.control}
          name={`assignments.${index}.population_count`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Population Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 350000"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Average weight */}
        <FormField
          control={form.control}
          name={`assignments.${index}.avg_weight_g`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avg Weight (grams)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 0.01"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Calculated biomass badge */}
        <div className="flex items-center">
          <Badge variant="secondary" className="text-sm px-3 py-2">
            Biomass: {biomassKg.toFixed(2)} kg
          </Badge>
        </div>
      </div>

      {/* Row 3: Notes (optional, collapsible) */}
      <FormField
        control={form.control}
        name={`assignments.${index}.notes`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-muted-foreground">Notes (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Optional notes for this assignment..."
                className="resize-none"
                rows={2}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}


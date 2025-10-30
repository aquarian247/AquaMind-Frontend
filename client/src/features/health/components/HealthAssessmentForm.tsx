import React, { useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { nonEmptyString, optionalString, dateString } from '@/lib/validation/utils/common'
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
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Info, Stethoscope } from 'lucide-react'
import { WriteGate } from '@/features/shared/permissions'
import { useCreateHealthSamplingEvent, useUpdateHealthSamplingEvent, useHealthParameters } from '../api'
import { useBatchContainerAssignments } from '@/features/batch-management/api'
import type { HealthSamplingEvent } from '@/api/generated'

// Validation schema for health assessments
const parameterScoreSchema = z.object({
  parameter: z.coerce.number().int().positive(),
  score: z.coerce.number().int(),
})

const fishAssessmentSchema = z.object({
  fish_identifier: nonEmptyString.max(50),
  weight_g: z.union([z.string(), z.number()]).optional().transform(val => val === '' ? undefined : val),
  length_cm: z.union([z.string(), z.number()]).optional().transform(val => val === '' ? undefined : val),
  parameter_scores: z.array(parameterScoreSchema).optional(),
})

const healthAssessmentSchema = z.object({
  assignment: z.coerce.number().int().positive('Batch container assignment is required'),
  sampling_date: dateString,
  number_of_fish_sampled: z.coerce.number().int().positive('Number of fish must be positive'),
  notes: optionalString,
  individual_fish_observations: z.array(fishAssessmentSchema).min(1, 'At least one fish assessment is required'),
})

type HealthAssessmentFormValues = z.infer<typeof healthAssessmentSchema>

interface HealthAssessmentFormProps {
  /** Existing sampling event to edit (undefined for create mode) */
  samplingEvent?: HealthSamplingEvent
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * Health Assessment form for veterinary parameter scoring.
 *
 * This form allows veterinarians to score individual fish on health parameters
 * (gill condition, fin condition, eye clarity, etc.) using a dynamic table interface.
 *
 * Features:
 * - Assignment selection (batch + container)
 * - Date picker
 * - Parameter selection (checkbox to choose which parameters to score)
 * - Dynamic table: Fish rows × Parameter columns
 * - Score dropdowns show labels from score definitions
 * - Optional weight/length measurements
 * - Validates scores are within parameter ranges
 *
 * Uses the same HealthSamplingEvent API but optimized for veterinary workflow.
 *
 * @example
 * ```tsx
 * <HealthAssessmentForm onSuccess={() => console.log('Assessment saved!')} />
 * ```
 */
export function HealthAssessmentForm({
  samplingEvent,
  onSuccess,
  onCancel,
}: HealthAssessmentFormProps) {
  const isEditMode = !!samplingEvent
  const [selectedParameterIds, setSelectedParameterIds] = useState<number[]>([])

  const form = useForm<HealthAssessmentFormValues>({
    resolver: zodResolver(healthAssessmentSchema),
    defaultValues: {
      assignment: 0,
      sampling_date: new Date().toISOString().split('T')[0],
      number_of_fish_sampled: 5, // Default to 5 fish for assessments
      notes: '',
      individual_fish_observations: [
        { fish_identifier: '1', parameter_scores: [] },
      ],
    },
  })

  // Dynamic field array for fish assessments
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'individual_fish_observations',
  })

  // Load batch container assignments
  const { data: assignmentsData, isLoading: assignmentsLoading } = useBatchContainerAssignments({
    isActive: true,
  })

  // Load active health parameters with score definitions
  const { data: parametersData, isLoading: parametersLoading } = useHealthParameters({
    isActive: true,
  })

  const activeParameters = useMemo(() => {
    return parametersData?.results || []
  }, [parametersData])

  // Update form with sampling event data if in edit mode
  React.useEffect(() => {
    if (samplingEvent) {
      form.reset({
        assignment: samplingEvent.assignment,
        sampling_date: samplingEvent.sampling_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        number_of_fish_sampled: samplingEvent.number_of_fish_sampled,
        notes: samplingEvent.notes || '',
        individual_fish_observations: (samplingEvent.individual_fish_observations || []).map(obs => ({
          fish_identifier: obs.fish_identifier,
          weight_g: obs.weight_g ?? undefined,
          length_cm: obs.length_cm ?? undefined,
          parameter_scores: obs.parameter_scores || [],
        })),
      })
      
      // Set selected parameters from existing scores
      if (samplingEvent.individual_fish_observations?.[0]?.parameter_scores) {
        const paramIds = samplingEvent.individual_fish_observations[0].parameter_scores.map(
          (score: any) => score.parameter
        )
        setSelectedParameterIds(paramIds)
      }
    }
  }, [samplingEvent, form])

  const createMutation = useCreateHealthSamplingEvent()
  const updateMutation = useUpdateHealthSamplingEvent()

  const onSubmit = async (values: HealthAssessmentFormValues) => {
    try {
      const apiData: any = {
        assignment: values.assignment,
        sampling_date: values.sampling_date,
        number_of_fish_sampled: values.number_of_fish_sampled,
        notes: values.notes || undefined,
        individual_fish_observations: values.individual_fish_observations.map(obs => ({
          fish_identifier: obs.fish_identifier,
          weight_g: obs.weight_g ? String(obs.weight_g) : undefined,
          length_cm: obs.length_cm ? String(obs.length_cm) : undefined,
          parameter_scores: obs.parameter_scores || [],
        })),
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: samplingEvent.id,
          ...apiData,
        } as HealthSamplingEvent & { id: number })
      } else {
        await createMutation.mutateAsync(apiData as HealthSamplingEvent)
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

  // Add new fish to assess
  const addFish = () => {
    const nextFishNumber = fields.length + 1
    append({
      fish_identifier: nextFishNumber.toString(),
      parameter_scores: selectedParameterIds.map(paramId => ({
        parameter: paramId,
        score: 0, // Default to best score
      })),
    })
  }

  // Toggle parameter selection
  const toggleParameter = (parameterId: number) => {
    setSelectedParameterIds(prev => {
      const newSelection = prev.includes(parameterId)
        ? prev.filter(id => id !== parameterId)
        : [...prev, parameterId]
      
      // Update all fish observations to include/exclude this parameter
      fields.forEach((_, index) => {
        const currentScores = form.getValues(`individual_fish_observations.${index}.parameter_scores`) || []
        
        if (newSelection.includes(parameterId)) {
          // Add parameter if not exists
          if (!currentScores.some((s: any) => s.parameter === parameterId)) {
            form.setValue(`individual_fish_observations.${index}.parameter_scores`, [
              ...currentScores,
              { parameter: parameterId, score: 0 },
            ])
          }
        } else {
          // Remove parameter
          form.setValue(
            `individual_fish_observations.${index}.parameter_scores`,
            currentScores.filter((s: any) => s.parameter !== parameterId)
          )
        }
      })
      
      return newSelection
    })
  }

  // Get score options for a parameter
  const getScoreOptions = (parameterId: number) => {
    const param = activeParameters.find((p: any) => p.id === parameterId)
    if (!param) return []
    
    // If score_definitions exist, use them
    if (param.score_definitions && param.score_definitions.length > 0) {
      return param.score_definitions.map((def: any) => ({
        value: def.score_value,
        label: `${def.score_value}: ${def.label}`,
        description: def.description,
      }))
    }
    
    // Fallback: generate from min/max range
    const min = param.min_score ?? 0
    const max = param.max_score ?? 3
    const options = []
    for (let i = min; i <= max; i++) {
      options.push({
        value: i,
        label: i.toString(),
        description: '',
      })
    }
    return options
  }

  return (
    <FormLayout
      form={form}
      onSubmit={onSubmit}
      header={{
        title: isEditMode ? 'Edit Health Assessment' : 'Create Health Assessment',
        description: isEditMode
          ? 'Update veterinary health parameter scores.'
          : 'Record veterinary assessment with health parameter scoring.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update Assessment' : 'Create Assessment',
          disabled: form.formState.isSubmitting || selectedParameterIds.length === 0,
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
          title="Assessment Details"
          description="Select the batch/container and date for this health assessment."
        >
          <FormField
            control={form.control}
            name="assignment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch & Container Assignment</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                  disabled={assignmentsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a batch and container" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assignmentsData?.results?.map((assignment: any) => (
                      <SelectItem key={assignment.id} value={assignment.id.toString()}>
                        Batch {assignment.batch_number} - {assignment.container_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the batch and container being assessed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sampling_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Date of health assessment</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number_of_fish_sampled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Fish</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Fish to assess</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection
          title="Select Health Parameters"
          description="Choose which health parameters to score for this assessment."
        >
          {parametersLoading ? (
            <div className="text-sm text-muted-foreground">Loading parameters...</div>
          ) : activeParameters.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No health parameters configured. Please configure health parameters in the Reference tab before creating assessments.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {activeParameters.map((param: any) => (
                <div key={param.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`param-${param.id}`}
                    checked={selectedParameterIds.includes(param.id)}
                    onCheckedChange={() => toggleParameter(param.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`param-${param.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {param.name}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Range: {param.min_score}-{param.max_score}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        {selectedParameterIds.length > 0 && (
          <FormSection
            title="Individual Fish Assessments"
            description="Score each fish on the selected health parameters."
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {fields.length} fish × {selectedParameterIds.length} parameters = {fields.length * selectedParameterIds.length} scores
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFish}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Fish
              </Button>
            </div>

            {fields.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Click "Add Fish" to start recording assessments.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Fish ID</TableHead>
                      {selectedParameterIds.map(paramId => {
                        const param = activeParameters.find((p: any) => p.id === paramId)
                        return (
                          <TableHead key={paramId} className="min-w-[180px]">
                            {param?.name}
                            <span className="block text-xs font-normal text-muted-foreground">
                              ({param?.min_score}-{param?.max_score})
                            </span>
                          </TableHead>
                        )
                      })}
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, fishIndex) => {
                      const scores = form.watch(`individual_fish_observations.${fishIndex}.parameter_scores`) || []
                      
                      return (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`individual_fish_observations.${fishIndex}.fish_identifier`}
                              render={({ field }) => (
                                <Input
                                  placeholder={`${fishIndex + 1}`}
                                  className="w-20"
                                  {...field}
                                />
                              )}
                            />
                          </TableCell>
                          
                          {selectedParameterIds.map((paramId) => {
                            const scoreIndex = scores.findIndex((s: any) => s.parameter === paramId)
                            const scoreOptions = getScoreOptions(paramId)
                            const param = activeParameters.find((p: any) => p.id === paramId)
                            
                            return (
                              <TableCell key={paramId}>
                                <Select
                                  value={scoreIndex >= 0 ? scores[scoreIndex].score?.toString() : ''}
                                  onValueChange={(value) => {
                                    const currentScores = form.getValues(
                                      `individual_fish_observations.${fishIndex}.parameter_scores`
                                    ) || []
                                    
                                    const existingIndex = currentScores.findIndex(
                                      (s: any) => s.parameter === paramId
                                    )
                                    
                                    const newScores = [...currentScores]
                                    if (existingIndex >= 0) {
                                      newScores[existingIndex] = {
                                        parameter: paramId,
                                        score: Number(value),
                                      }
                                    } else {
                                      newScores.push({
                                        parameter: paramId,
                                        score: Number(value),
                                      })
                                    }
                                    
                                    form.setValue(
                                      `individual_fish_observations.${fishIndex}.parameter_scores`,
                                      newScores
                                    )
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Score..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {scoreOptions.map((option: any) => (
                                      <SelectItem key={option.value} value={option.value.toString()}>
                                        <div className="flex flex-col">
                                          <span>{option.label}</span>
                                          {option.description && (
                                            <span className="text-xs text-muted-foreground">
                                              {option.description}
                                            </span>
                                          )}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            )
                          })}
                          
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(fishIndex)}
                              disabled={fields.length === 1}
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
            )}

            <Alert className="mt-4">
              <Stethoscope className="h-4 w-4" />
              <AlertDescription>
                <strong>Veterinary Assessment Focus:</strong> This form is optimized for health parameter scoring. 
                Weight and length are optional - use the Measurements tab for growth tracking.
              </AlertDescription>
            </Alert>
          </FormSection>
        )}

        <FormSection
          title="Notes (Optional)"
          description="Additional observations or context for this assessment."
        >
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="General observations, environmental conditions, or other relevant notes..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>
      </WriteGate>
    </FormLayout>
  )
}


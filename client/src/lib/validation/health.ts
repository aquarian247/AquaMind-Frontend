import { z } from 'zod'
import {
  nonEmptyString,
  optionalString,
  dateString,
  booleanWithDefault,
} from './utils/common'
import { optionalDecimalString, positiveDecimalString } from './utils/coercion'

/**
 * Health domain validation schemas.
 * These schemas validate form input for JournalEntry and related health entities.
 */

/**
 * Journal entry category enum.
 * Maps to the JournalEntry.category field from the generated API.
 */
export const journalEntryCategoryEnum = z.enum([
  'observation',
  'issue',
  'action',
  'diagnosis',
  'treatment',
  'vaccination',
  'sample',
])

/**
 * Journal entry severity enum.
 * Maps to the JournalEntry.severity field from the generated API.
 */
export const journalEntrySeverityEnum = z.enum(['low', 'medium', 'high'])

/**
 * Journal entry creation/update form schema.
 * Maps to the JournalEntry model from generated API.
 * 
 * Note: resolution_status is stored as boolean in backend but API type says string|null.
 * We use boolean in forms and convert when needed.
 */
export const journalEntrySchema = z.object({
  batch: z.coerce.number().int().positive('Batch is required'),
  container: z
    .union([
      z.coerce.number().int().positive(),
      z.literal(''),
      z.null(),
      z.undefined(),
    ])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      return val as number
    })
    .optional(),
  entry_date: dateString,
  category: journalEntryCategoryEnum,
  severity: journalEntrySeverityEnum.default('low'),
  description: nonEmptyString,
  resolution_status: booleanWithDefault(false),
  resolution_notes: optionalString,
})

export type JournalEntryFormValues = z.infer<typeof journalEntrySchema>

/**
 * Individual fish observation schema (nested within HealthSamplingEvent).
 * Maps to the IndividualFishObservation model from generated API.
 */
export const individualFishObservationSchema = z.object({
  fish_identifier: nonEmptyString.max(50, 'Fish identifier must be 50 characters or less'),
  weight_g: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Weight (g)',
  }),
  length_cm: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Length (cm)',
  }),
  parameter_scores: z.array(z.object({
    parameter: z.coerce.number().int().positive(),
    score: z.coerce.number().int().min(1).max(5),
  })).optional(),
})

export type IndividualFishObservationFormValues = z.infer<typeof individualFishObservationSchema>

/**
 * Health sampling event creation/update form schema.
 * Maps to the HealthSamplingEvent model from generated API.
 * 
 * Note: Aggregate fields (avg_weight_g, std_dev_weight_g, etc.) are auto-calculated
 * by the backend from individual fish observations.
 */
export const healthSamplingEventSchema = z.object({
  assignment: z.coerce.number().int().positive('Batch container assignment is required'),
  sampling_date: dateString,
  number_of_fish_sampled: z.coerce.number().int().positive('Number of fish sampled must be positive'),
  notes: optionalString,
  individual_fish_observations: z.array(individualFishObservationSchema).min(1, 'At least one fish observation is required'),
})

export type HealthSamplingEventFormValues = z.infer<typeof healthSamplingEventSchema>

/**
 * Sample type creation/update form schema (reference data).
 * Maps to the SampleType model from generated API.
 */
export const sampleTypeSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  description: nonEmptyString,
})

export type SampleTypeFormValues = z.infer<typeof sampleTypeSchema>

/**
 * Vaccination type creation/update form schema (reference data).
 * Maps to the VaccinationType model from generated API.
 */
export const vaccinationTypeSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  manufacturer: nonEmptyString.max(100, 'Manufacturer must be 100 characters or less'),
  dosage: optionalString,
  description: nonEmptyString,
})

export type VaccinationTypeFormValues = z.infer<typeof vaccinationTypeSchema>

/**
 * Treatment type enum.
 * Maps to the Treatment.treatment_type field from the generated API.
 */
export const treatmentTypeEnum = z.enum(['medication', 'vaccination', 'physical', 'other'])

/**
 * Treatment creation/update form schema.
 * Maps to the Treatment model from generated API.
 * 
 * Note: vaccination_type is conditional - required if treatment_type is 'vaccination'
 */
export const treatmentSchema = z.object({
  batch: z.coerce.number().int().positive('Batch is required'),
  container: z.coerce.number().int().positive('Container is required'),
  batch_assignment: z
    .union([
      z.coerce.number().int().positive(),
      z.literal(''),
      z.null(),
      z.undefined(),
    ])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      return val as number
    })
    .optional(),
  treatment_type: treatmentTypeEnum,
  vaccination_type: z
    .union([
      z.coerce.number().int().positive(),
      z.literal(''),
      z.null(),
      z.undefined(),
    ])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      return val as number
    })
    .optional(),
  description: nonEmptyString,
  dosage: optionalString,
  duration_days: z
    .union([
      z.coerce.number().int().nonnegative(),
      z.literal(''),
      z.null(),
      z.undefined(),
    ])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      return val as number
    })
    .optional(),
  withholding_period_days: z
    .union([
      z.coerce.number().int().nonnegative(),
      z.literal(''),
      z.null(),
      z.undefined(),
    ])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      return val as number
    })
    .optional(),
  outcome: optionalString,
})

export type TreatmentFormValues = z.infer<typeof treatmentSchema>

/**
 * Health lab sample creation/update form schema.
 * Maps to the HealthLabSample model from generated API.
 * 
 * Note: batch_container_assignment is auto-populated by backend based on batch_id, container_id, and sample_date
 */
export const healthLabSampleSchema = z.object({
  batch_id: z.coerce.number().int().positive('Batch is required'),
  container_id: z.coerce.number().int().positive('Container is required'),
  sample_type: z.coerce.number().int().positive('Sample type is required'),
  sample_date: dateString,
  date_sent_to_lab: z
    .union([dateString, z.literal('')])
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  date_results_received: z
    .union([dateString, z.literal('')])
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  lab_reference_id: optionalString,
  findings_summary: optionalString,
  notes: optionalString,
  // File upload handled separately in form component
})

export type HealthLabSampleFormValues = z.infer<typeof healthLabSampleSchema>

/**
 * Parameter score definition schema (for configuring what each score means)
 */
export const parameterScoreDefinitionSchema = z.object({
  parameter: z.coerce.number().int().positive('Parameter is required'),
  score_value: z.coerce.number().int().min(0).max(10, 'Score value must be between 0-10'),
  label: nonEmptyString.max(50, 'Label must be 50 characters or less'),
  description: nonEmptyString,
  display_order: z.coerce.number().int().min(0).optional(),
})

export type ParameterScoreDefinitionFormValues = z.infer<typeof parameterScoreDefinitionSchema>

/**
 * Health parameter schema (updated with min/max scores)
 */
export const healthParameterSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  description: optionalString,
  min_score: z.coerce.number().int().min(0, 'Minimum score must be 0 or greater'),
  max_score: z.coerce.number().int().min(0, 'Maximum score must be 0 or greater'),
  is_active: z.boolean().default(true),
}).refine(
  (data) => data.max_score > data.min_score,
  {
    message: "Maximum score must be greater than minimum score",
    path: ["max_score"],
  }
)

export type HealthParameterFormValues = z.infer<typeof healthParameterSchema>


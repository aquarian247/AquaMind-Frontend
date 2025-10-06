import { z } from 'zod'
import {
  nonEmptyString,
  optionalString,
  dateString,
  optionalDateString,
} from './utils/common'
import { optionalDecimalString, positiveDecimalString } from './utils/coercion'

/**
 * Batch domain validation schemas.
 * These schemas validate form input for Batch, LifeCycleStage, and related entities.
 */

/**
 * Batch status enum.
 */
export const batchStatusEnum = z.enum(['ACTIVE', 'COMPLETED', 'TERMINATED'])

/**
 * Batch type enum.
 */
export const batchTypeEnum = z.enum(['STANDARD', 'MIXED'])

/**
 * Batch creation/update form schema.
 * Maps to the Batch model from generated API.
 */
export const batchSchema = z.object({
  batch_number: nonEmptyString.max(50, 'Batch number must be 50 characters or less'),
  species: z.coerce.number().int().positive('Species is required'),
  lifecycle_stage: z.coerce.number().int().positive('Lifecycle stage is required'),
  status: batchStatusEnum.default('ACTIVE'),
  batch_type: batchTypeEnum.default('STANDARD'),
  start_date: dateString,
  expected_end_date: optionalDateString,
  notes: optionalString,
})

export type BatchFormValues = z.infer<typeof batchSchema>

/**
 * LifeCycleStage creation/update form schema.
 * Maps to the LifeCycleStage model from generated API.
 */
export const lifeCycleStageSchema = z.object({
  species: z.coerce.number().int().positive('Species is required'),
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  order: z.coerce.number().int().positive('Order must be a positive integer'),
  description: optionalString,
  expected_weight_min_g: optionalDecimalString({
    min: 0,
    decimalPlaces: 2,
    label: 'Minimum expected weight',
  }),
  expected_weight_max_g: optionalDecimalString({
    min: 0,
    decimalPlaces: 2,
    label: 'Maximum expected weight',
  }),
  expected_length_min_cm: optionalDecimalString({
    min: 0,
    decimalPlaces: 2,
    label: 'Minimum expected length',
  }),
  expected_length_max_cm: optionalDecimalString({
    min: 0,
    decimalPlaces: 2,
    label: 'Maximum expected length',
  }),
})

export type LifeCycleStageFormValues = z.infer<typeof lifeCycleStageSchema>

/**
 * Batch Container Assignment creation/update form schema.
 * Maps to the BatchContainerAssignment model from generated API.
 */
export const batchContainerAssignmentSchema = z.object({
  batch: z.coerce.number().int().positive('Batch is required'),
  container: z.coerce.number().int().positive('Container is required'),
  lifecycle_stage: z.coerce.number().int().positive('Lifecycle stage is required'),
  population_count: z.coerce.number().int().positive('Population count must be positive'),
  assignment_date: dateString,
  removal_date: optionalDateString,
  avg_weight_g: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Average weight',
  }),
  notes: optionalString,
})

export type BatchContainerAssignmentFormValues = z.infer<
  typeof batchContainerAssignmentSchema
>

/**
 * Batch Transfer creation form schema.
 * Maps to the BatchTransfer model from generated API.
 */
export const batchTransferSchema = z.object({
  batch: z.coerce.number().int().positive('Batch is required'),
  from_container: z.coerce.number().int().positive('Source container is required'),
  to_container: z.coerce.number().int().positive('Destination container is required'),
  transfer_date: dateString,
  population_transferred: z.coerce
    .number()
    .int()
    .positive('Population transferred must be positive'),
  avg_weight_g: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Average weight',
  }),
  notes: optionalString,
})

export type BatchTransferFormValues = z.infer<typeof batchTransferSchema>

/**
 * Growth Sample creation/update form schema.
 * Maps to the GrowthSample model from generated API.
 */
export const growthSampleSchema = z.object({
  batch: z.coerce.number().int().positive('Batch is required'),
  container: z.coerce.number().int().positive('Container is required'),
  sample_date: dateString,
  sample_size: z.coerce.number().int().positive('Sample size must be positive'),
  avg_weight_g: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Average weight',
  }),
  avg_length_cm: optionalDecimalString({
    min: 0,
    decimalPlaces: 2,
    label: 'Average length',
  }),
  notes: optionalString,
})

export type GrowthSampleFormValues = z.infer<typeof growthSampleSchema>

/**
 * Mortality Event creation/update form schema.
 * Maps to the MortalityEvent model from generated API.
 */
export const mortalityEventSchema = z.object({
  batch: z.coerce.number().int().positive('Batch is required'),
  container: z.coerce.number().int().positive('Container is required'),
  event_date: dateString,
  mortality_count: z.coerce.number().int().positive('Mortality count must be positive'),
  mortality_reason: z.coerce.number().int().positive().optional(),
  avg_weight_g: optionalDecimalString({
    min: 0,
    decimalPlaces: 2,
    label: 'Average weight',
  }),
  notes: optionalString,
})

export type MortalityEventFormValues = z.infer<typeof mortalityEventSchema>

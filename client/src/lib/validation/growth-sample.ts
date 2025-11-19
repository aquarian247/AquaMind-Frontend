/**
 * Validation schemas for growth sample forms.
 * 
 * Defines Zod schemas for creating growth samples with individual fish observations.
 */

import { z } from 'zod'
import { dateString, nonEmptyString, optionalString } from './utils/common'

/**
 * Schema for individual fish observation input
 */
export const individualFishObservationSchema = z.object({
  fish_identifier: nonEmptyString.max(50),
  weight_g: z.coerce.number().positive({
    message: 'Weight must be a positive number',
  }),
  length_cm: z.coerce.number().positive({
    message: 'Length must be a positive number',
  }),
})

/**
 * Schema for creating a growth sample with individual observations
 */
export const growthSampleSchema = z.object({
  assignment: z.coerce.number().int().positive(),
  sample_date: dateString,
  notes: optionalString,
  individual_observations: z.array(individualFishObservationSchema).min(1, {
    message: 'At least one fish observation is required',
  }),
}).refine(
  (data) => {
    // If individual_observations are provided, we don't need separate sample_size
    return data.individual_observations && data.individual_observations.length > 0
  },
  {
    message: 'Individual observations are required',
    path: ['individual_observations'],
  }
)

export type GrowthSampleFormValues = z.infer<typeof growthSampleSchema>
export type IndividualFishObservationValues = z.infer<typeof individualFishObservationSchema>


















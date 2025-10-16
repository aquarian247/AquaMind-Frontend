import { z } from 'zod'
import { nonEmptyString, optionalString } from './utils/common'

/**
 * Species creation/update form schema.
 * Maps to the Species model from generated API.
 *
 * This is the reference schema from Phase 0 (F0.1).
 */
export const speciesSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  scientific_name: nonEmptyString.max(150, 'Scientific name must be 150 characters or less'),
  description: optionalString,
  optimal_temperature_min: optionalString,
  optimal_temperature_max: optionalString,
  optimal_oxygen_min: optionalString,
  optimal_ph_min: optionalString,
  optimal_ph_max: optionalString,
})

export type SpeciesFormValues = z.infer<typeof speciesSchema>

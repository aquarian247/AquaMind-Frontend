import { z } from 'zod'

/**
 * Validation primitives used across all domain schemas.
 * These enforce consistent validation patterns and type coercion.
 */

/**
 * Required string field that trims whitespace and enforces minimum length.
 */
export const nonEmptyString = z.string().trim().min(1, 'This field is required')

/**
 * Optional string that converts empty strings to undefined.
 * Use for truly optional text fields.
 */
export const optionalString = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? undefined : value))
  .optional()

/**
 * Coerces string input to number, accepting empty strings as undefined.
 * Use for optional numeric inputs from forms.
 */
export const optionalNumericString = z
  .string()
  .trim()
  .transform((value) => {
    if (value === '') return undefined
    const parsed = parseFloat(value)
    return isNaN(parsed) ? undefined : parsed
  })
  .optional()

/**
 * Coerces string input to number, rejecting empty/invalid values.
 * Use for required numeric inputs.
 */
export const requiredNumericString = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .transform((value) => {
    const parsed = parseFloat(value)
    if (isNaN(parsed)) {
      throw new Error('Must be a valid number')
    }
    return parsed
  })

/**
 * Boolean with default false, accepts string "true"/"false" from forms.
 */
export const booleanWithDefault = (defaultValue: boolean = false) =>
  z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .transform((value) => {
      if (typeof value === 'string') {
        return value === 'true'
      }
      return value
    })
    .default(defaultValue)

/**
 * Date string validator that ensures YYYY-MM-DD format.
 */
export const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

/**
 * Optional date string.
 */
export const optionalDateString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .optional()
  .or(z.literal('').transform(() => undefined))

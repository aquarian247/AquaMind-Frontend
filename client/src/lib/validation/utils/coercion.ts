import { z } from 'zod'

/**
 * Coercion utilities for form data transformation.
 * These handle type conversion between form inputs (strings) and API expectations.
 */

/**
 * Creates a decimal string validator with range constraints.
 * Backend expects string representation of decimals (e.g., "123.45").
 *
 * @param options - Min/max constraints and decimal places
 */
export function decimalString(options?: {
  min?: number
  max?: number
  decimalPlaces?: number
  required?: boolean
  label?: string
}) {
  const {
    min,
    max,
    decimalPlaces = 2,
    required = false,
    label = 'Value',
  } = options || {}

  let schema = z.string().trim()

  if (required) {
    schema = schema.min(1, `${label} is required`)
  }

  return schema
    .refine(
      (val) => {
        if (!required && val === '') return true
        const num = parseFloat(val)
        return !isNaN(num)
      },
      { message: `${label} must be a valid number` }
    )
    .refine(
      (val) => {
        if (!required && val === '') return true
        if (min !== undefined) {
          const num = parseFloat(val)
          return num >= min
        }
        return true
      },
      { message: `${label} must be at least ${min}` }
    )
    .refine(
      (val) => {
        if (!required && val === '') return true
        if (max !== undefined) {
          const num = parseFloat(val)
          return num <= max
        }
        return true
      },
      { message: `${label} must be at most ${max}` }
    )
    .transform((val) => {
      if (!required && val === '') return ''
      const num = parseFloat(val)
      return num.toFixed(decimalPlaces)
    })
}

/**
 * Creates an optional decimal string validator.
 * Returns undefined for empty strings, formatted decimal otherwise.
 */
export function optionalDecimalString(options?: {
  min?: number
  max?: number
  decimalPlaces?: number
  label?: string
}) {
  const { min, max, decimalPlaces = 2, label = 'Value' } = options || {}

  return z
    .string()
    .trim()
    .refine(
      (val) => {
        if (val === '') return true
        const num = parseFloat(val)
        return !isNaN(num)
      },
      { message: `${label} must be a valid number` }
    )
    .refine(
      (val) => {
        if (val === '' || min === undefined) return true
        const num = parseFloat(val)
        return num >= min
      },
      { message: `${label} must be at least ${min}` }
    )
    .refine(
      (val) => {
        if (val === '' || max === undefined) return true
        const num = parseFloat(val)
        return num <= max
      },
      { message: `${label} must be at most ${max}` }
    )
    .transform((val) => {
      if (val === '') return undefined
      const num = parseFloat(val)
      return num.toFixed(decimalPlaces)
    })
    .optional()
}

/**
 * Latitude validator (-90 to 90).
 * Returns string representation for API compatibility.
 */
export const latitudeString = decimalString({
  min: -90,
  max: 90,
  decimalPlaces: 6,
  required: true,
  label: 'Latitude',
})

/**
 * Longitude validator (-180 to 180).
 * Returns string representation for API compatibility.
 */
export const longitudeString = decimalString({
  min: -180,
  max: 180,
  decimalPlaces: 6,
  required: true,
  label: 'Longitude',
})

/**
 * Positive decimal string for weights, volumes, etc.
 */
export function positiveDecimalString(options?: {
  decimalPlaces?: number
  required?: boolean
  label?: string
}) {
  return decimalString({
    ...options,
    min: 0,
  })
}

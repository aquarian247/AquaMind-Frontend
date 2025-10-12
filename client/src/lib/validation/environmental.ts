import { z } from 'zod';
import { nonEmptyString, optionalString, dateString } from './utils/common';
import { decimalString, optionalDecimalString } from './utils/coercion';

/**
 * Validation schema for EnvironmentalParameter
 * 
 * Reference data entity defining environmental parameters and their acceptable/optimal ranges.
 */
export const environmentalParameterSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  unit: nonEmptyString.max(20, 'Unit must be 20 characters or less'),
  description: optionalString,
  min_value: optionalDecimalString({
    decimalPlaces: 2,
    label: 'Minimum value',
  }),
  max_value: optionalDecimalString({
    decimalPlaces: 2,
    label: 'Maximum value',
  }),
  optimal_min: optionalDecimalString({
    decimalPlaces: 2,
    label: 'Optimal minimum',
  }),
  optimal_max: optionalDecimalString({
    decimalPlaces: 2,
    label: 'Optimal maximum',
  }),
});

/**
 * Validation schema for PhotoperiodData
 * 
 * Records photoperiod (day length) data for areas, important for fish growth and maturation.
 */
export const photoperiodDataSchema = z.object({
  area: z.coerce.number().int().positive('Area is required'),
  date: dateString,
  day_length_hours: decimalString({
    min: 0,
    max: 24,
    decimalPlaces: 2,
    required: true,
    label: 'Day length',
  }),
  light_intensity: optionalDecimalString({
    decimalPlaces: 2,
    label: 'Light intensity',
  }),
  is_interpolated: z.boolean().default(false),
});

export type EnvironmentalParameterFormValues = z.infer<typeof environmentalParameterSchema>;
export type PhotoperiodDataFormValues = z.infer<typeof photoperiodDataSchema>;


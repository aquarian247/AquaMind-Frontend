import { z } from 'zod';

/**
 * Validation schemas for scenario planning
 */

export const temperatureProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or fewer'),
});

export const tgcModelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or fewer'),
  location: z.string().min(1, 'Location is required').max(255, 'Location must be 255 characters or fewer'),
  release_period: z.string().min(1, 'Release period is required').max(255, 'Release period must be 255 characters or fewer'),
  tgc_value: z.number().min(0, 'TGC value must be non-negative'),
  exponent_n: z.number().default(0.33),
  exponent_m: z.number().default(0.66),
  profile_id: z.number().int().positive('Temperature profile is required'),
});

export const fcrModelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or fewer'),
});

export const mortalityModelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or fewer'),
  frequency: z.enum(['daily', 'weekly']),
  rate: z.number().min(0, 'Rate must be non-negative').max(100, 'Rate must be 100 or less'),
});

export const scenarioSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or fewer'),
  start_date: z.string().min(1, 'Start date is required'),
  duration_days: z.number().int().min(1, 'Duration must be at least 1 day'),
  initial_count: z.number().int().min(1, 'Initial count must be at least 1'),
  genotype: z.string().min(1, 'Genotype is required').max(255, 'Genotype must be 255 characters or fewer'),
  supplier: z.string().min(1, 'Supplier is required').max(255, 'Supplier must be 255 characters or fewer'),
  initial_weight: z.number().min(0, 'Initial weight must be non-negative').optional().nullable(),
  tgc_model_id: z.number().int().positive('TGC model is required'),
  fcr_model_id: z.number().int().positive('FCR model is required'),
  mortality_model_id: z.number().int().positive('Mortality model is required'),
  batch_id: z.number().int().positive().optional().nullable(),
  biological_constraints_id: z.number().int().positive().optional().nullable(),
});

export type TemperatureProfileFormData = z.infer<typeof temperatureProfileSchema>;
export type TGCModelFormData = z.infer<typeof tgcModelSchema>;
export type FCRModelFormData = z.infer<typeof fcrModelSchema>;
export type MortalityModelFormData = z.infer<typeof mortalityModelSchema>;
export type ScenarioFormData = z.infer<typeof scenarioSchema>;


import { z } from 'zod';

/**
 * Validation schemas for broodstock management
 */

export const broodstockFishSchema = z.object({
  fish_id: z.string().min(1, 'Fish ID is required').max(50, 'Fish ID must be 50 characters or fewer'),
  species: z.string().min(1, 'Species is required').max(100, 'Species must be 100 characters or fewer'),
  sex: z.enum(['M', 'F', 'U']),
  birth_date: z.string().optional().nullable(),
  acquisition_date: z.string().min(1, 'Acquisition date is required'),
  source: z.string().optional(),
  genetic_line: z.string().optional(),
  container_id: z.number().int().positive().optional().nullable(),
  status: z.enum(['active', 'retired', 'deceased', 'transferred']).default('active'),
  health_status: z.enum(['healthy', 'sick', 'recovering', 'quarantine']).default('healthy'),
  weight_g: z.number().min(0, 'Weight must be non-negative').optional().nullable(),
  length_cm: z.number().min(0, 'Length must be non-negative').optional().nullable(),
  notes: z.string().optional(),
});

export const fishMovementSchema = z.object({
  fish_id: z.number().int().positive('Fish is required'),
  movement_date: z.string().min(1, 'Movement date is required'),
  from_container_id: z.number().int().positive().optional().nullable(),
  to_container_id: z.number().int().positive('Destination container is required'),
  reason: z.string().min(1, 'Reason is required'),
  performed_by_id: z.number().int().positive().optional().nullable(),
  notes: z.string().optional(),
});

export const breedingPlanSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or fewer'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().nullable(),
  target_offspring_count: z.number().int().min(1, 'Target offspring must be at least 1'),
  breeding_objectives: z.string().optional(),
  selection_criteria: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']).default('draft'),
});

export type BroodstockFishFormData = z.infer<typeof broodstockFishSchema>;
export type FishMovementFormData = z.infer<typeof fishMovementSchema>;
export type BreedingPlanFormData = z.infer<typeof breedingPlanSchema>;



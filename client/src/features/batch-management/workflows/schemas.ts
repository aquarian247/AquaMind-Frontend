/**
 * Validation schemas for transfer workflow forms.
 * 
 * Uses Zod for runtime validation and type inference.
 */

import { z } from 'zod';

// ============================================================================
// Execute Action Schema
// ============================================================================

export const executeActionSchema = z.object({
  mortality_during_transfer: z.coerce
    .number()
    .int()
    .min(0, 'Mortality cannot be negative')
    .default(0),
  
  transfer_method: z.enum(['NET', 'PUMP', 'GRAVITY', 'MANUAL']).optional(),
  
  water_temp_c: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid temperature format')
    .optional()
    .or(z.literal('')),
  
  oxygen_level: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid oxygen level format')
    .optional()
    .or(z.literal('')),
  
  execution_duration_minutes: z.coerce
    .number()
    .int()
    .positive('Duration must be positive')
    .optional(),
  
  notes: z.string().optional(),
});

export type ExecuteActionFormData = z.infer<typeof executeActionSchema>;

// ============================================================================
// Skip Action Schema
// ============================================================================

export const skipActionSchema = z.object({
  reason: z.string()
    .min(10, 'Please provide a detailed reason (min 10 characters)')
    .max(500, 'Reason too long (max 500 characters)'),
});

export type SkipActionFormData = z.infer<typeof skipActionSchema>;

// ============================================================================
// Cancel Workflow Schema
// ============================================================================

export const cancelWorkflowSchema = z.object({
  cancellation_reason: z.string()
    .min(10, 'Please provide a detailed reason (min 10 characters)')
    .max(500, 'Reason too long (max 500 characters)'),
});

export type CancelWorkflowFormData = z.infer<typeof cancelWorkflowSchema>;


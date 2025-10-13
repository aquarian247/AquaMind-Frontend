import { z } from 'zod';

/**
 * Validation schemas for user management
 */

export const userFormSchema = z.object({
  username: z.string().min(1, 'Username is required').max(150, 'Username must be 150 characters or fewer'),
  email: z.string().email('Invalid email address'),
  full_name: z.string().optional(),
  phone: z.string().optional(),
  geography: z.enum(['FO', 'SC', 'ALL']).optional(),
  subsidiary: z.enum(['BS', 'FW', 'FM', 'LG', 'ALL']).optional(),
  role: z.enum(['ADMIN', 'MGR', 'OPR', 'VET', 'QA', 'FIN', 'VIEW']).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  is_active: z.boolean().optional(),
});

export const userCreateSchema = userFormSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type UserFormData = z.infer<typeof userFormSchema>;
export type UserCreateData = z.infer<typeof userCreateSchema>;


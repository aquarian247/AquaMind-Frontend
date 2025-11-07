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

export const userCreateSchema = z.object({
  username: z.string().min(1, 'Username is required').max(150, 'Username must be 150 characters or fewer'),
  email: z.string().email('Invalid email address'),
  full_name: z.string().optional(),
  phone: z.string().optional(),
  geography: z.enum(['FO', 'SC', 'ALL']).optional(),
  subsidiary: z.enum(['BS', 'FW', 'FM', 'LG', 'ALL']).optional(),
  role: z.enum(['ADMIN', 'MGR', 'OPR', 'VET', 'QA', 'FIN', 'VIEW']).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(8, 'Password confirmation must be at least 8 characters'),
  is_active: z.boolean().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
});

export type UserFormData = z.infer<typeof userFormSchema>;
export type UserCreateData = z.infer<typeof userCreateSchema>;



import { z } from 'zod';

/**
 * Validation schemas for user management
 */

const optionalNonBlankString = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  },
  z.string().optional()
);

const optionalPassword = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(8, 'Password must be at least 8 characters').optional()
);

export const userFormSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(150, 'Username must be 150 characters or fewer'),
  email: z.string().trim().email('Invalid email address'),
  full_name: optionalNonBlankString,
  phone: optionalNonBlankString,
  geography: z.enum(['FO', 'SC', 'ALL']).optional(),
  subsidiary: z.enum(['BS', 'FW', 'FM', 'LG', 'ALL']).optional(),
  role: z.enum(['ADMIN', 'MGR', 'OPR', 'SHIP_CREW', 'VET', 'QA', 'FIN', 'VIEW']).optional(),
  password: optionalPassword,
  is_active: z.boolean().optional(),
});

export const userCreateSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(150, 'Username must be 150 characters or fewer'),
  email: z.string().trim().email('Invalid email address'),
  full_name: optionalNonBlankString,
  phone: optionalNonBlankString,
  geography: z.enum(['FO', 'SC', 'ALL']).optional(),
  subsidiary: z.enum(['BS', 'FW', 'FM', 'LG', 'ALL']).optional(),
  role: z.enum(['ADMIN', 'MGR', 'OPR', 'SHIP_CREW', 'VET', 'QA', 'FIN', 'VIEW']).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(8, 'Password confirmation must be at least 8 characters'),
  is_active: z.boolean().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
});

export type UserFormData = z.infer<typeof userFormSchema>;
export type UserCreateData = z.infer<typeof userCreateSchema>;

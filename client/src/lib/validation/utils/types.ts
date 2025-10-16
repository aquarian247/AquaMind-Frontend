import type { z } from 'zod'

/**
 * Type utilities for bridging Zod schemas to generated API types.
 */

/**
 * Utility type to extract form values from a Zod schema.
 * Use this to create type-safe form data structures.
 *
 * @example
 * const mySchema = z.object({ name: z.string() })
 * type MyFormValues = FormValues<typeof mySchema>
 */
export type FormValues<T extends z.ZodTypeAny> = z.infer<T>

/**
 * Utility type to make specific fields optional.
 * Useful when transforming API models to form schemas.
 *
 * @example
 * type UserForm = PartialBy<User, 'id' | 'created_at'>
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Utility type to make specific fields required.
 * Useful when enforcing stricter validation than API expects.
 *
 * @example
 * type StrictForm = RequiredBy<ApiModel, 'description'>
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Extracts writable fields from a generated model type.
 * Filters out readonly fields like id, created_at, updated_at.
 *
 * Note: This is a best-effort type; manually verify for complex models.
 */
export type WritableFields<T> = Omit<
  T,
  'id' | 'created_at' | 'updated_at' | Extract<keyof T, `readonly ${string}`>
>

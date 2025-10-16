import { z } from 'zod'
import {
  nonEmptyString,
  optionalString,
  dateString,
  optionalDateString,
  booleanWithDefault,
} from './utils/common'
import { optionalDecimalString, positiveDecimalString } from './utils/coercion'

/**
 * Inventory domain validation schemas.
 * These schemas validate form input for Feed, FeedPurchase, and related entities.
 */

/**
 * Feed size category enum.
 * Maps to the Feed.size_category field from the generated API.
 */
export const feedSizeCategoryEnum = z.enum(['MICRO', 'SMALL', 'MEDIUM', 'LARGE'])

/**
 * Feed creation/update form schema.
 * Maps to the Feed model from generated API.
 */
export const feedSchema = z.object({
  name: nonEmptyString.max(200, 'Name must be 200 characters or less'),
  brand: nonEmptyString.max(100, 'Brand must be 100 characters or less'),
  size_category: feedSizeCategoryEnum,
  pellet_size_mm: optionalDecimalString({
    min: 0,
    decimalPlaces: 2,
    label: 'Pellet size',
  }),
  protein_percentage: optionalDecimalString({
    min: 0,
    max: 100,
    decimalPlaces: 2,
    label: 'Protein percentage',
  }),
  fat_percentage: optionalDecimalString({
    min: 0,
    max: 100,
    decimalPlaces: 2,
    label: 'Fat percentage',
  }),
  carbohydrate_percentage: optionalDecimalString({
    min: 0,
    max: 100,
    decimalPlaces: 2,
    label: 'Carbohydrate percentage',
  }),
  description: optionalString,
  is_active: booleanWithDefault(true),
})

export type FeedFormValues = z.infer<typeof feedSchema>

/**
 * FeedPurchase creation/update form schema.
 * Maps to the FeedPurchase model from generated API.
 */
export const feedPurchaseSchema = z.object({
  feed: z.coerce.number().int().positive('Feed is required'),
  purchase_date: dateString,
  quantity_kg: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Quantity (kg)',
  }),
  cost_per_kg: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Cost per kg',
  }),
  supplier: nonEmptyString.max(200, 'Supplier must be 200 characters or less'),
  batch_number: optionalString,
  expiry_date: optionalDateString,
  notes: optionalString,
})

export type FeedPurchaseFormValues = z.infer<typeof feedPurchaseSchema>

/**
 * FeedContainerStock creation/update form schema.
 * Maps to the FeedContainerStock model from generated API.
 * 
 * FIFO Constraint: Entry dates for a feed container should follow FIFO ordering
 * (First In, First Out). The form will validate that new entries don't pre-date
 * existing entries for the same container (handled in component logic).
 */
export const feedContainerStockSchema = z.object({
  feed_container: z.coerce.number().int().positive('Feed container is required'),
  feed_purchase: z.coerce.number().int().positive('Feed purchase is required'),
  quantity_kg: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Quantity (kg)',
  }),
  entry_date: dateString,
})

export type FeedContainerStockFormValues = z.infer<typeof feedContainerStockSchema>

/**
 * Feeding method enum.
 * Maps to the FeedingEvent.method field from the generated API.
 */
export const feedingMethodEnum = z.enum(['MANUAL', 'AUTOMATIC', 'BROADCAST'])

/**
 * FeedingEvent creation/update form schema.
 * Maps to the FeedingEvent model from generated API.
 * 
 * Note: feeding_percentage and feed_cost are auto-calculated by backend.
 */
export const feedingEventSchema = z.object({
  batch: z.coerce.number().int().positive('Batch is required'),
  container: z.coerce.number().int().positive('Container is required'),
  feed: z.coerce.number().int().positive('Feed is required'),
  feeding_date: dateString,
  feeding_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  amount_kg: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Amount (kg)',
  }),
  batch_biomass_kg: optionalDecimalString({
    min: 0,
    decimalPlaces: 2,
    label: 'Batch biomass',
  }),
  method: feedingMethodEnum.default('MANUAL'),
  notes: optionalString,
})

export type FeedingEventFormValues = z.infer<typeof feedingEventSchema>

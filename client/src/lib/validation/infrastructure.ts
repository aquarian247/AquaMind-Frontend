import { z } from 'zod'
import {
  nonEmptyString,
  optionalString,
  booleanWithDefault,
} from './utils/common'
import {
  decimalString,
  optionalDecimalString,
  latitudeString,
  longitudeString,
  positiveDecimalString,
} from './utils/coercion'

/**
 * Infrastructure domain validation schemas.
 * These schemas validate form input for Geography, Area, Container, and related entities.
 */

/**
 * Geography creation/update form schema.
 * Maps to the Geography model from generated API.
 */
export const geographySchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  description: optionalString,
})

export type GeographyFormValues = z.infer<typeof geographySchema>

/**
 * Area creation/update form schema.
 * Maps to the Area model from generated API.
 */
export const areaSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  geography: z.coerce.number().int().positive('Geography is required'),
  latitude: latitudeString,
  longitude: longitudeString,
  max_biomass: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Maximum biomass',
  }),
  active: booleanWithDefault(true),
})

export type AreaFormValues = z.infer<typeof areaSchema>

/**
 * Container Type category enum.
 */
export const containerCategoryEnum = z.enum(['TANK', 'PEN', 'TRAY', 'OTHER'])

/**
 * Container Type creation/update form schema.
 * Maps to the ContainerType model from generated API.
 */
export const containerTypeSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  category: containerCategoryEnum,
  max_volume_m3: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Maximum volume',
  }),
  description: optionalString,
})

export type ContainerTypeFormValues = z.infer<typeof containerTypeSchema>

/**
 * Container creation/update form schema.
 * Maps to the Container model from generated API.
 *
 * Note: hall and area are mutually exclusive (enforced by backend).
 * Frontend should disable one when the other is selected.
 */
export const containerSchema = z
  .object({
    name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
    container_type: z.coerce.number().int().positive('Container type is required'),
    hall: z.coerce
      .number()
      .int()
      .positive()
      .nullable()
      .optional()
      .or(z.literal('').transform(() => null)),
    area: z.coerce
      .number()
      .int()
      .positive()
      .nullable()
      .optional()
      .or(z.literal('').transform(() => null)),
    volume_m3: positiveDecimalString({
      decimalPlaces: 2,
      required: true,
      label: 'Volume',
    }),
    max_biomass_kg: positiveDecimalString({
      decimalPlaces: 2,
      required: true,
      label: 'Maximum biomass',
    }),
    feed_recommendations_enabled: booleanWithDefault(false),
    active: booleanWithDefault(true),
  })
  .refine(
    (data) => {
      // At least one of hall or area must be provided
      return data.hall !== null || data.area !== null
    },
    {
      message: 'Either hall or area must be specified',
      path: ['hall'],
    }
  )

export type ContainerFormValues = z.infer<typeof containerSchema>

/**
 * Hall creation/update form schema.
 * Maps to the Hall model from generated API.
 */
export const hallSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  freshwater_station: z.coerce.number().int().positive('Freshwater station is required'),
  description: optionalString,
  active: booleanWithDefault(true),
})

export type HallFormValues = z.infer<typeof hallSchema>

/**
 * Freshwater Station station_type enum.
 */
export const stationTypeEnum = z.enum(['FRESHWATER', 'BROODSTOCK'])

/**
 * Freshwater Station creation/update form schema.
 * Maps to the FreshwaterStation model from generated API.
 */
export const freshwaterStationSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  station_type: stationTypeEnum,
  geography: z.coerce.number().int().positive('Geography is required'),
  latitude: latitudeString,
  longitude: longitudeString,
  description: optionalString,
  active: booleanWithDefault(true),
})

export type FreshwaterStationFormValues = z.infer<typeof freshwaterStationSchema>

/**
 * Sensor type enum.
 */
export const sensorTypeEnum = z.enum(['TEMPERATURE', 'OXYGEN', 'PH', 'SALINITY', 'CO2', 'OTHER'])

/**
 * Sensor creation/update form schema.
 * Maps to the Sensor model from generated API.
 */
export const sensorSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  sensor_type: sensorTypeEnum,
  container: z.coerce.number().int().positive('Container is required'),
  serial_number: optionalString,
  manufacturer: optionalString,
  installation_date: optionalString,
  last_calibration_date: optionalString,
  active: booleanWithDefault(true),
})

export type SensorFormValues = z.infer<typeof sensorSchema>

/**
 * Feed Container creation/update form schema.
 * Maps to the FeedContainer model from generated API.
 */
export const feedContainerSchema = z.object({
  name: nonEmptyString.max(100, 'Name must be 100 characters or less'),
  hall: z.coerce.number().int().positive('Hall is required'),
  capacity_kg: positiveDecimalString({
    decimalPlaces: 2,
    required: true,
    label: 'Capacity',
  }),
  active: booleanWithDefault(true),
})

export type FeedContainerFormValues = z.infer<typeof feedContainerSchema>

/**
 * Validation Schema Library - Main Export
 *
 * This module provides type-safe Zod schemas for all domain entities in AquaMind.
 * Schemas are organized by domain and handle coercion from form inputs (strings)
 * to API-compatible types.
 *
 * ## Usage
 *
 * ```ts
 * import { geographySchema, GeographyFormValues } from '@/lib/validation'
 * import { useForm } from 'react-hook-form'
 * import { zodResolver } from '@hookform/resolvers/zod'
 *
 * function GeographyForm() {
 *   const form = useForm<GeographyFormValues>({
 *     resolver: zodResolver(geographySchema),
 *     defaultValues: { name: '', description: '' }
 *   })
 *   // ...
 * }
 * ```
 *
 * ## Adding New Schemas
 *
 * 1. Create a new file under `validation/` named after the domain (e.g., `inventory.ts`)
 * 2. Import utilities from `validation/utils/common` and `validation/utils/coercion`
 * 3. Define schemas using the generated models as reference (see `client/src/api/generated/models/`)
 * 4. Export the schema and its inferred type (e.g., `MyEntityFormValues`)
 * 5. Add exports to this index file
 * 6. Write tests in `validation/__tests__/`
 *
 * ## Type Bridge
 *
 * Use `FormValues<T>` utility type to extract form value types from schemas.
 * Use `WritableFields<T>` to filter readonly fields from generated models.
 */

// Utility exports
export * from './utils/common'
export * from './utils/coercion'
export * from './utils/types'

// Domain schemas - Species (reference from F0.1)
export { speciesSchema, type SpeciesFormValues } from './schemas'

// Domain schemas - Infrastructure
export {
  geographySchema,
  type GeographyFormValues,
  areaSchema,
  type AreaFormValues,
  containerTypeSchema,
  type ContainerTypeFormValues,
  containerCategoryEnum,
  containerSchema,
  type ContainerFormValues,
  hallSchema,
  type HallFormValues,
  freshwaterStationSchema,
  type FreshwaterStationFormValues,
  stationTypeEnum,
  sensorSchema,
  type SensorFormValues,
  sensorTypeEnum,
  feedContainerSchema,
  type FeedContainerFormValues,
} from './infrastructure'

// Domain schemas - Batch
export {
  batchSchema,
  type BatchFormValues,
  batchStatusEnum,
  batchTypeEnum,
  lifeCycleStageSchema,
  type LifeCycleStageFormValues,
  batchContainerAssignmentSchema,
  type BatchContainerAssignmentFormValues,
  batchTransferSchema,
  type BatchTransferFormValues,
  growthSampleSchema,
  type GrowthSampleFormValues,
  mortalityEventSchema,
  type MortalityEventFormValues,
} from './batch'
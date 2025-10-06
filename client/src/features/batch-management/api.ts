/**
 * Batch Management API Hooks
 * 
 * CRUD operations for Batch, LifeCycleStage, and related entities.
 * All hooks use TanStack Query for caching and state management.
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiService } from '@/api/generated'
import { useCrudMutation } from '@/features/shared/hooks/useCrudMutation'
import type {
  Batch,
  LifeCycleStage,
  PaginatedBatchList,
  PaginatedLifeCycleStageList,
  PaginatedSpeciesList,
} from '@/api/generated'

// ========================================
// SPECIES HOOKS (for FK dropdowns)
// ========================================

/**
 * Fetch all species for dropdown selection
 */
export function useSpecies(filters?: {
  nameContains?: string
  search?: string
}): UseQueryResult<PaginatedSpeciesList, Error> {
  return useQuery({
    queryKey: ['species', filters],
    queryFn: () =>
      ApiService.apiV1BatchSpeciesList(
        filters?.nameContains,
        undefined, // descriptionContains
        undefined, // limit
        undefined, // offset
        undefined, // ordering
        filters?.search
      ),
  })
}

// ========================================
// BATCH HOOKS
// ========================================

/**
 * Fetch all batches with optional filtering
 */
export function useBatches(filters?: {
  batchNumber?: string
  batchNumberIcontains?: string
  species?: number
  status?: 'ACTIVE' | 'COMPLETED' | 'TERMINATED'
  search?: string
}): UseQueryResult<PaginatedBatchList, Error> {
  return useQuery({
    queryKey: ['batches', filters],
    queryFn: () =>
      ApiService.apiV1BatchBatchesList(
        filters?.batchNumber,
        filters?.batchNumberIcontains,
        undefined, // batchType
        undefined, // batchTypeIn
        undefined, // biomassMax
        undefined, // biomassMin
        undefined, // endDateAfter
        undefined, // endDateBefore
        undefined, // lifecycleStage
        undefined, // lifecycleStageIn
        undefined, // ordering
        undefined, // page
        undefined, // populationMax
        undefined, // populationMin
        filters?.search,
        filters?.species,
        undefined, // speciesIn
        undefined, // startDateAfter
        undefined, // startDateBefore
        filters?.status
      ),
  })
}

/**
 * Fetch a single batch by ID
 */
export function useBatch(id: number | undefined): UseQueryResult<Batch, Error> {
  return useQuery({
    queryKey: ['batches', id],
    queryFn: () => {
      if (!id) throw new Error('Batch ID is required')
      return ApiService.apiV1BatchBatchesRetrieve(id)
    },
    enabled: !!id,
  })
}

/**
 * Create a new batch
 */
export function useCreateBatch() {
  return useCrudMutation<Batch, Batch>({
    mutationFn: (data) => ApiService.apiV1BatchBatchesCreate(data),
    description: 'Batch created successfully',
    invalidateQueries: ['batches', 'batch/batches', 'batch/lifecycle-stages'],
  })
}

/**
 * Update an existing batch
 */
export function useUpdateBatch() {
  return useCrudMutation<Batch & { id: number }, Batch>({
    mutationFn: ({ id, ...data }) => ApiService.apiV1BatchBatchesUpdate(id, data as Batch),
    description: 'Batch updated successfully',
    invalidateQueries: ['batches', 'batch/batches'],
  })
}

/**
 * Delete a batch
 */
export function useDeleteBatch() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1BatchBatchesDestroy(id),
    description: 'Batch deleted successfully',
    invalidateQueries: ['batches', 'batch/batches'],
    injectAuditReason: (vars, reason) => ({ ...vars, change_reason: reason }),
  })
}

// ========================================
// LIFECYCLE STAGE HOOKS
// ========================================

/**
 * Fetch all lifecycle stages with optional filtering
 */
export function useLifecycleStages(filters?: {
  name?: string
  nameContains?: string
  species?: number
  ordering?: string
}): UseQueryResult<PaginatedLifeCycleStageList, Error> {
  return useQuery({
    queryKey: ['lifecycle-stages', filters],
    queryFn: () =>
      ApiService.apiV1BatchLifecycleStagesList(
        filters?.name,
        filters?.nameContains,
        undefined, // order
        undefined, // orderMax
        undefined, // orderMin
        filters?.ordering,
        undefined, // page
        undefined, // search
        filters?.species,
        undefined // speciesName
      ),
  })
}

/**
 * Fetch a single lifecycle stage by ID
 */
export function useLifecycleStage(id: number | undefined): UseQueryResult<LifeCycleStage, Error> {
  return useQuery({
    queryKey: ['lifecycle-stages', id],
    queryFn: () => {
      if (!id) throw new Error('Lifecycle stage ID is required')
      return ApiService.apiV1BatchLifecycleStagesRetrieve(id)
    },
    enabled: !!id,
  })
}

/**
 * Create a new lifecycle stage
 */
export function useCreateLifecycleStage() {
  return useCrudMutation<LifeCycleStage, LifeCycleStage>({
    mutationFn: (data) => ApiService.apiV1BatchLifecycleStagesCreate(data),
    description: 'Lifecycle stage created successfully',
    invalidateQueries: ['lifecycle-stages', 'batch/lifecycle-stages'],
  })
}

/**
 * Update an existing lifecycle stage
 */
export function useUpdateLifecycleStage() {
  return useCrudMutation<LifeCycleStage & { id: number }, LifeCycleStage>({
    mutationFn: ({ id, ...data }) =>
      ApiService.apiV1BatchLifecycleStagesUpdate(id, data as LifeCycleStage),
    description: 'Lifecycle stage updated successfully',
    invalidateQueries: ['lifecycle-stages', 'batch/lifecycle-stages'],
  })
}

/**
 * Delete a lifecycle stage
 */
export function useDeleteLifecycleStage() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1BatchLifecycleStagesDestroy(id),
    description: 'Lifecycle stage deleted successfully',
    invalidateQueries: ['lifecycle-stages', 'batch/lifecycle-stages'],
    injectAuditReason: (vars, reason) => ({ ...vars, change_reason: reason }),
  })
}

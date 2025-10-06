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
  BatchContainerAssignment,
  BatchTransfer,
  PaginatedBatchList,
  PaginatedLifeCycleStageList,
  PaginatedSpeciesList,
  PaginatedBatchContainerAssignmentList,
  PaginatedBatchTransferList,
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

// ========================================
// BATCH CONTAINER ASSIGNMENT HOOKS
// ========================================

/**
 * Fetch all batch container assignments with optional filtering
 */
export function useBatchContainerAssignments(filters?: {
  batch?: number
  container?: number
  isActive?: boolean
}): UseQueryResult<PaginatedBatchContainerAssignmentList, Error> {
  return useQuery({
    queryKey: ['batch-container-assignments', filters],
    queryFn: () =>
      ApiService.apiV1BatchContainerAssignmentsList(
        undefined, // assignmentDate
        undefined, // assignmentDateAfter
        undefined, // assignmentDateBefore
        filters?.batch,
        undefined, // batchIn
        undefined, // batchNumber
        undefined, // biomassMax
        undefined, // biomassMin
        filters?.container,
        undefined, // containerIn
        undefined, // containerName
        undefined, // containerType
        filters?.isActive,
        undefined, // lifecycleStage
        undefined, // ordering
        undefined, // page
        undefined, // populationMax
        undefined, // populationMin
        undefined, // search
        undefined  // species
      ),
  })
}

/**
 * Fetch a single batch container assignment by ID
 */
export function useBatchContainerAssignment(
  id: number | undefined
): UseQueryResult<BatchContainerAssignment, Error> {
  return useQuery({
    queryKey: ['batch-container-assignments', id],
    queryFn: () => {
      if (!id) throw new Error('Assignment ID is required')
      return ApiService.apiV1BatchContainerAssignmentsRetrieve(id)
    },
    enabled: !!id,
  })
}

/**
 * Create a new batch container assignment
 */
export function useCreateBatchContainerAssignment() {
  return useCrudMutation<BatchContainerAssignment, BatchContainerAssignment>({
    mutationFn: (data) => ApiService.apiV1BatchContainerAssignmentsCreate(data),
    description: 'Batch assigned to container successfully',
    invalidateQueries: ['batch-container-assignments', 'batches', 'batch/batches'],
  })
}

/**
 * Update an existing batch container assignment
 */
export function useUpdateBatchContainerAssignment() {
  return useCrudMutation<
    BatchContainerAssignment & { id: number },
    BatchContainerAssignment
  >({
    mutationFn: ({ id, ...data }) =>
      ApiService.apiV1BatchContainerAssignmentsUpdate(id, data as BatchContainerAssignment),
    description: 'Assignment updated successfully',
    invalidateQueries: ['batch-container-assignments', 'batches', 'batch/batches'],
  })
}

/**
 * Delete a batch container assignment
 */
export function useDeleteBatchContainerAssignment() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1BatchContainerAssignmentsDestroy(id),
    description: 'Assignment deleted successfully',
    invalidateQueries: ['batch-container-assignments', 'batches', 'batch/batches'],
    injectAuditReason: (vars, reason) => ({ ...vars, change_reason: reason }),
  })
}

// ========================================
// BATCH TRANSFER HOOKS
// ========================================

/**
 * Fetch all batch transfers with optional filtering
 */
export function useBatchTransfers(filters?: {
  sourceBatch?: number
  destinationBatch?: number
}): UseQueryResult<PaginatedBatchTransferList, Error> {
  return useQuery({
    queryKey: ['batch-transfers', filters],
    queryFn: () =>
      ApiService.apiV1BatchTransfersList(
        undefined, // biomassMax
        undefined, // biomassMin
        undefined, // destinationAssignment
        filters?.destinationBatch,
        undefined, // destinationBatchNumber
        undefined, // destinationLifecycleStage
        undefined, // ordering
        undefined, // page
        undefined, // populationMax
        undefined, // populationMin
        undefined, // search
        undefined, // sourceAssignment
        filters?.sourceBatch,
        undefined, // sourceBatchNumber
        undefined, // sourceLifecycleStage
        undefined, // transferDateAfter
        undefined, // transferDateBefore
        undefined, // transferType
        undefined  // transferTypeIn
      ),
  })
}

/**
 * Fetch a single batch transfer by ID
 */
export function useBatchTransfer(
  id: number | undefined
): UseQueryResult<BatchTransfer, Error> {
  return useQuery({
    queryKey: ['batch-transfers', id],
    queryFn: () => {
      if (!id) throw new Error('Transfer ID is required')
      return ApiService.apiV1BatchTransfersRetrieve(id)
    },
    enabled: !!id,
  })
}

/**
 * Create a new batch transfer
 */
export function useCreateBatchTransfer() {
  return useCrudMutation<BatchTransfer, BatchTransfer>({
    mutationFn: (data) => ApiService.apiV1BatchTransfersCreate(data),
    description: 'Batch transferred successfully',
    invalidateQueries: ['batch-transfers', 'batch-container-assignments', 'batches', 'batch/batches'],
  })
}

/**
 * Delete a batch transfer
 */
export function useDeleteBatchTransfer() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1BatchTransfersDestroy(id),
    description: 'Transfer deleted successfully',
    invalidateQueries: ['batch-transfers', 'batch-container-assignments', 'batches', 'batch/batches'],
    injectAuditReason: (vars, reason) => ({ ...vars, change_reason: reason }),
  })
}

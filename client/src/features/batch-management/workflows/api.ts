/**
 * API hooks for BatchTransferWorkflow and TransferAction.
 * 
 * Uses TanStack Query for data fetching and mutations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import type {
  BatchTransferWorkflowCreate,
  BatchTransferWorkflowDetail,
  BatchTransferWorkflowList,
  TransferActionDetail,
  TransferActionExecute,
  TransferActionList,
  TransferActionSkip,
} from '@/api/generated';

// ============================================================================
// Workflow Hooks
// ============================================================================

export interface WorkflowFilters {
  status?: string;
  workflow_type?: string;
  batch?: number;
  is_intercompany?: boolean;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

/**
 * List transfer workflows with optional filters.
 */
export function useWorkflows(filters?: WorkflowFilters) {
  return useQuery({
    queryKey: ['transfer-workflows', filters],
    queryFn: async () => {
      console.log('useWorkflows: Fetching with filters:', filters);
      
      // Generated API uses positional parameters, not object
      const result = await ApiService.apiV1BatchTransferWorkflowsList(
        undefined, // actualStartAfter
        undefined, // actualStartBefore
        filters?.batch, // batch
        undefined, // batchNumber
        undefined, // completedBy
        undefined, // completionMax
        undefined, // completionMin
        undefined, // destLifecycleStage
        undefined, // destSubsidiary
        undefined, // initiatedBy
        filters?.is_intercompany, // isIntercompany
        undefined, // ordering
        filters?.page, // page
        undefined, // plannedStartAfter
        undefined, // plannedStartBefore
        undefined, // search
        undefined, // sourceLifecycleStage
        undefined, // sourceSubsidiary
        filters?.status, // status
        undefined, // statusIn
        filters?.workflow_type, // workflowType
        undefined, // workflowTypeIn
      );
      
      console.log('useWorkflows: API returned', result.count, 'workflows for batch', filters?.batch);
      return result;
    },
    // Force refetch on mount to avoid stale cache
    staleTime: 0,
  });
}

/**
 * Get single workflow by ID.
 */
export function useWorkflow(id: number | undefined) {
  return useQuery({
    queryKey: ['transfer-workflow', id],
    queryFn: () => ApiService.apiV1BatchTransferWorkflowsRetrieve(id!),
    enabled: !!id,
  });
}

/**
 * Create new transfer workflow.
 */
export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchTransferWorkflowCreate) =>
      ApiService.apiV1BatchTransferWorkflowsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
    },
  });
}

/**
 * Update workflow (PATCH).
 */
export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BatchTransferWorkflowDetail> }) =>
      ApiService.apiV1BatchTransferWorkflowsPartialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
    },
  });
}

/**
 * Plan workflow (DRAFT → PLANNED).
 */
export function usePlanWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      ApiService.apiV1BatchTransferWorkflowsPlanCreate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow', id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
    },
  });
}

/**
 * Cancel workflow.
 */
export function useCancelWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      ApiService.apiV1BatchTransferWorkflowsCancelCreate(id, { cancellation_reason: reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
    },
  });
}

/**
 * Complete workflow manually.
 */
export function useCompleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      ApiService.apiV1BatchTransferWorkflowsCompleteCreate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow', id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
    },
  });
}

/**
 * Delete workflow.
 */
export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      ApiService.apiV1BatchTransferWorkflowsDestroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
    },
  });
}

// ============================================================================
// Action Hooks
// ============================================================================

export interface ActionFilters {
  workflow?: number;
  status?: string;
  page?: number;
  page_size?: number;
}

/**
 * List transfer actions with optional filters.
 */
export function useActions(filters?: ActionFilters) {
  return useQuery({
    queryKey: ['transfer-actions', filters],
    queryFn: () => ApiService.apiV1BatchTransferActionsList({
      workflow: filters?.workflow,
      status: filters?.status,
      page: filters?.page,
      pageSize: filters?.page_size,
    }),
  });
}

/**
 * Get single action by ID.
 */
export function useAction(id: number | undefined) {
  return useQuery({
    queryKey: ['transfer-action', id],
    queryFn: () => ApiService.apiV1BatchTransferActionsRetrieve(id!),
    enabled: !!id,
  });
}

/**
 * Execute transfer action.
 */
export function useExecuteAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TransferActionExecute }) =>
      ApiService.apiV1BatchTransferActionsExecuteCreate(id, data),
    onSuccess: (_, variables) => {
      // Invalidate action
      queryClient.invalidateQueries({ queryKey: ['transfer-action', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
      
      // Invalidate workflows (progress updated)
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow'] });
    },
  });
}

/**
 * Skip action.
 */
export function useSkipAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TransferActionSkip }) =>
      ApiService.apiV1BatchTransferActionsSkipCreate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-action', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow'] });
    },
  });
}

/**
 * Rollback failed action.
 */
export function useRollbackAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      ApiService.apiV1BatchTransferActionsRollbackCreate(id, { notes: reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-action', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
    },
  });
}

/**
 * Retry failed action.
 */
export function useRetryAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      ApiService.apiV1BatchTransferActionsRetryCreate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-action', id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
    },
  });
}

// ============================================================================
// Finance Integration Hooks
// ============================================================================

/**
 * Get pending intercompany transactions for approval.
 */
export function usePendingApprovals() {
  return useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => ApiService.apiV1FinanceIntercompanyTransactionsPendingApprovalsList(),
  });
}

/**
 * Approve intercompany transaction.
 */
export function useApproveTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (txId: number) =>
      ApiService.apiV1FinanceIntercompanyTransactionsApproveCreate(txId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow'] });
      queryClient.invalidateQueries({ queryKey: ['intercompany-transactions'] });
    },
  });
}


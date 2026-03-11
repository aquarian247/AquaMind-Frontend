/**
 * API hooks for BatchTransferWorkflow and TransferAction.
 * 
 * Uses TanStack Query for data fetching and mutations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { getApiUrl, getAuthToken } from '@/lib/config';
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

async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let payload: any = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const errorMessage =
      payload?.error ||
      payload?.detail ||
      JSON.stringify(payload) ||
      `Request failed (${response.status})`;
    throw new Error(errorMessage);
  }
  return payload as T;
}

/**
 * List transfer workflows with optional filters.
 */
export function useWorkflows(filters?: WorkflowFilters) {
  return useQuery({
    queryKey: ['transfer-workflows', filters],
    queryFn: async () => {
      
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
        undefined, // dynamicRouteMode
        undefined, // initiatedBy
        undefined, // isDynamicExecution
        filters?.is_intercompany, // isIntercompany
        undefined, // ordering
        filters?.page, // page
        undefined, // plannedStartAfter
        undefined, // plannedStartBefore
        undefined, // search
        undefined, // sourceLifecycleStage
        undefined, // sourceSubsidiary
        filters?.status as 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | undefined, // status
        undefined, // statusIn
        filters?.workflow_type as 'LIFECYCLE_TRANSITION' | 'CONTAINER_REDISTRIBUTION' | 'EMERGENCY_CASCADE' | undefined, // workflowType
        undefined, // workflowTypeIn
      );
      
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
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow-execution-context', id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
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
      ApiService.apiV1BatchTransferWorkflowsCancelCreate(id, { reason: reason || '' }),
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
 * Complete dynamic workflow explicitly.
 */
export function useCompleteDynamicWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completion_note }: { id: number; completion_note?: string }) =>
      requestJson<any>(
        getApiUrl(`/batch/transfer-workflows/${id}/complete-dynamic/`),
        {
          method: 'POST',
          body: JSON.stringify({ completion_note: completion_note || '' }),
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow-execution-context', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
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

export interface TransferWorkflowExecutionContext {
  workflow_id: number;
  workflow_number: string;
  status: string;
  dynamic_route_mode: 'DIRECT_STATION_TO_VESSEL' | 'VIA_TRUCK_TO_VESSEL';
  allowed_leg_types: string[];
  sources: Record<string, any[]>;
  destinations: Record<string, any[]>;
  in_progress_actions: any[];
  recent_actions: any[];
  progress: Record<string, any>;
}

export interface StartTransferPayload {
  leg_type: string;
  source_assignment_id: number;
  dest_container_id: number;
  planned_transferred_count: number;
  planned_transferred_biomass_kg: string;
  transfer_method?: string;
  allow_mixed?: boolean;
  notes?: string;
  allow_compliance_override?: boolean;
  compliance_override_note?: string;
  source_manual_readings?: {
    oxygen?: string;
    temperature?: string;
    co2?: string;
  };
  dest_manual_readings?: {
    oxygen?: string;
    temperature?: string;
    co2?: string;
  };
}

export interface CompleteTransferPayload {
  transferred_count: number;
  transferred_biomass_kg: string;
  mortality_during_transfer?: number;
  transfer_method?: string;
  water_temp_c?: string;
  oxygen_level?: string;
  execution_duration_minutes?: number;
  notes?: string;
}

/**
 * List transfer actions with optional filters.
 */
export function useActions(filters?: ActionFilters) {
  return useQuery({
    queryKey: ['transfer-actions', filters],
    queryFn: () => ApiService.apiV1BatchTransferActionsList(
      undefined, // biomassMax (1)
      undefined, // biomassMin (2)
      undefined, // destAssignment (3)
      undefined, // destContainer (4)
      undefined, // executedBy (5)
      undefined, // executionDateAfter (6)
      undefined, // executionDateBefore (7)
      undefined, // ordering (8)
      filters?.page, // page (9)
      undefined, // plannedDateAfter (10)
      undefined, // plannedDateBefore (11)
      undefined, // search (12)
      undefined, // sourceAssignment (13)
      undefined, // sourceContainer (14)
      filters?.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | undefined, // status (15)
      undefined, // statusIn (16)
      undefined, // transferMethod (17)
      undefined, // transferMethodIn (18)
      undefined, // transferredCountMax (19)
      undefined, // transferredCountMin (20)
      filters?.workflow, // workflow (21)
    ),
  });
}

/**
 * Dynamic execution page context.
 */
export function useWorkflowExecutionContext(workflowId: number | undefined) {
  return useQuery({
    queryKey: ['transfer-workflow-execution-context', workflowId],
    enabled: !!workflowId,
    queryFn: () =>
      requestJson<TransferWorkflowExecutionContext>(
        getApiUrl(`/batch/transfer-workflows/${workflowId}/execution-context/`)
      ),
    refetchInterval: 15000,
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
 * Start dynamic transfer handoff.
 */
export function useStartTransferHandoff(workflowId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StartTransferPayload) =>
      requestJson<any>(
        getApiUrl(`/batch/transfer-workflows/${workflowId}/handoffs/start/`),
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow-execution-context', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
    },
  });
}

/**
 * Complete dynamic transfer handoff.
 */
export function useCompleteTransferHandoff(workflowId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ actionId, payload }: { actionId: number; payload: CompleteTransferPayload }) =>
      requestJson<any>(
        getApiUrl(`/batch/transfer-actions/${actionId}/complete-handoff/`),
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow-execution-context', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
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
      ApiService.apiV1BatchTransferActionsRollbackCreate(id, { reason: reason || '' }),
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

/**
 * Create transfer action.
 */
export function useCreateAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferActionDetail) =>
      ApiService.apiV1BatchTransferActionsCreate(data),
    onSuccess: (_, variables) => {
      // Invalidate actions
      queryClient.invalidateQueries({ queryKey: ['transfer-actions'] });
      
      // Invalidate the workflow (total_actions_planned updated)
      queryClient.invalidateQueries({ queryKey: ['transfer-workflow'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-workflows'] });
    },
  });
}

// ============================================================================
// Finance Integration Hooks
// ============================================================================

// TODO: These endpoints exist in backend but not yet in generated OpenAPI client
// Uncomment when OpenAPI spec is regenerated

// /**
//  * Get pending intercompany transactions for approval.
//  */
// export function usePendingApprovals() {
//   return useQuery({
//     queryKey: ['pending-approvals'],
//     queryFn: () => ApiService.apiV1FinanceIntercompanyTransactionsPendingApprovalsList(),
//   });
// }

// /**
//  * Approve intercompany transaction.
//  */
// export function useApproveTransaction() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (txId: number) =>
//       ApiService.apiV1FinanceIntercompanyTransactionsApproveCreate(txId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
//       queryClient.invalidateQueries({ queryKey: ['transfer-workflow'] });
//       queryClient.invalidateQueries({ queryKey: ['intercompany-transactions'] });
//     },
//   });
// }

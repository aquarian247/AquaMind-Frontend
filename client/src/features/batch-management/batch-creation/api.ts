/**
 * API hooks for Batch Creation Workflows
 * 
 * TanStack Query hooks for managing batch creation workflows and actions.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/fetch';

// ============================================================================
// Types (will be replaced by generated types once API is regenerated)
// ============================================================================

export interface BatchCreationWorkflow {
  id: number;
  workflow_number: string;
  batch: number;
  batch_number: string;
  species_name: string;
  lifecycle_stage_name: string;
  status: 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  status_display: string;
  egg_source_type: 'INTERNAL' | 'EXTERNAL';
  egg_source_display: string;
  egg_production?: number;
  external_supplier?: number;
  external_supplier_batch_number?: string;
  external_cost_per_thousand?: string;
  total_eggs_planned: number;
  total_eggs_received: number;
  total_mortality_on_arrival: number;
  total_actions: number;
  actions_completed: number;
  progress_percentage: string;
  planned_start_date: string;
  actual_start_date?: string;
  planned_completion_date: string;
  actual_completion_date?: string;
  created_by_username?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreationAction {
  id: number;
  workflow: number;
  action_number: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  status_display: string;
  dest_assignment: number;
  dest_container_name: string;
  dest_container_type: string;
  egg_count_planned: number;
  egg_count_actual?: number;
  mortality_on_arrival: number;
  eggs_actually_received?: number;
  mortality_rate_percentage?: number;
  expected_delivery_date: string;
  actual_delivery_date?: string;
  days_since_expected?: number;
  delivery_method?: string;
  delivery_method_display?: string;
  water_temp_on_arrival?: string;
  egg_quality_score?: number;
  execution_duration_minutes?: number;
  executed_by_username?: string;
  notes?: string;
}

// ============================================================================
// Workflow Queries
// ============================================================================

export function useCreationWorkflows(filters?: {
  status?: string;
  egg_source_type?: string;
  batch?: number;
}) {
  return useQuery({
    queryKey: ['creation-workflows', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.egg_source_type) params.set('egg_source_type', filters.egg_source_type);
      if (filters?.batch) params.set('batch', filters.batch.toString());
      
      const url = `/api/v1/batch/creation-workflows/${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetchApi(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch creation workflows');
      }
      
      return response.json();
    },
  });
}

export function useCreationWorkflow(id?: number) {
  return useQuery({
    queryKey: ['creation-workflow', id],
    queryFn: async () => {
      if (!id) throw new Error('Workflow ID required');
      
      const response = await fetchApi(`/api/v1/batch/creation-workflows/${id}/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch creation workflow');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

// ============================================================================
// Workflow Mutations
// ============================================================================

export function useCreateCreationWorkflow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetchApi('/api/v1/batch/creation-workflows/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to create workflow' }));
        throw new Error(JSON.stringify(errorData));
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creation-workflows'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function usePlanCreationWorkflow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workflowId: number) => {
      const response = await fetchApi(`/api/v1/batch/creation-workflows/${workflowId}/plan/`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to plan workflow' }));
        throw new Error(JSON.stringify(errorData));
      }
      
      return response.json();
    },
    onSuccess: (_, workflowId) => {
      queryClient.invalidateQueries({ queryKey: ['creation-workflow', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['creation-workflows'] });
    },
  });
}

export function useCancelCreationWorkflow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ workflowId, reason }: { workflowId: number; reason: string }) => {
      const response = await fetchApi(`/api/v1/batch/creation-workflows/${workflowId}/cancel/`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to cancel workflow' }));
        throw new Error(JSON.stringify(errorData));
      }
      
      return response.json();
    },
    onSuccess: (_, { workflowId }) => {
      queryClient.invalidateQueries({ queryKey: ['creation-workflow', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['creation-workflows'] });
    },
  });
}

// ============================================================================
// Action Queries
// ============================================================================

export function useCreationActions(workflowId?: number) {
  return useQuery({
    queryKey: ['creation-actions', workflowId],
    queryFn: async () => {
      if (!workflowId) throw new Error('Workflow ID required');
      
      const response = await fetchApi(`/api/v1/batch/creation-actions/?workflow=${workflowId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch creation actions');
      }
      
      return response.json();
    },
    enabled: !!workflowId,
  });
}

// ============================================================================
// Action Mutations
// ============================================================================

export function useCreateCreationAction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetchApi('/api/v1/batch/creation-actions/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to create action' }));
        throw new Error(JSON.stringify(errorData));
      }
      
      return response.json();
    },
    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['creation-actions', variables.workflow] });
      queryClient.invalidateQueries({ queryKey: ['creation-workflow', variables.workflow] });
    },
  });
}

export function useExecuteCreationAction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ actionId, data }: { actionId: number; data: any }) => {
      const response = await fetchApi(`/api/v1/batch/creation-actions/${actionId}/execute/`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to execute action' }));
        throw new Error(JSON.stringify(errorData));
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const workflowId = data.workflow;
      queryClient.invalidateQueries({ queryKey: ['creation-actions', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['creation-workflow', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useSkipCreationAction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ actionId, reason }: { actionId: number; reason: string }) => {
      const response = await fetchApi(`/api/v1/batch/creation-actions/${actionId}/skip/`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to skip action' }));
        throw new Error(JSON.stringify(errorData));
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const workflowId = data.workflow;
      queryClient.invalidateQueries({ queryKey: ['creation-actions', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['creation-workflow', workflowId] });
    },
  });
}


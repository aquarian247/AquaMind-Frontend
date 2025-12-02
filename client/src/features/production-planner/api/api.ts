/**
 * Production Planner API Layer
 *
 * TanStack Query hooks for Planned Activities API operations.
 * Uses generated ApiService for all network calls.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import type {
  PlannedActivity,
  ActivityTemplate,
  PaginatedPlannedActivityList,
} from '../types';
import type { ActivityStatus, ActivityType, SpawnWorkflowRequest } from '../types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const plannedActivityKeys = {
  all: ['planned-activities'] as const,
  lists: () => [...plannedActivityKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...plannedActivityKeys.lists(), filters] as const,
  details: () => [...plannedActivityKeys.all, 'detail'] as const,
  detail: (id: number) => [...plannedActivityKeys.details(), id] as const,
  byScenario: (scenarioId: number) =>
    [...plannedActivityKeys.all, 'scenario', scenarioId] as const,
  byBatch: (batchId: number) =>
    [...plannedActivityKeys.all, 'batch', batchId] as const,
};

export const activityTemplateKeys = {
  all: ['activity-templates'] as const,
  lists: () => [...activityTemplateKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...activityTemplateKeys.lists(), filters] as const,
  details: () => [...activityTemplateKeys.all, 'detail'] as const,
  detail: (id: number) => [...activityTemplateKeys.details(), id] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Fetch all planned activities with optional filters
 */
export function usePlannedActivities(params?: {
  scenario?: number;
  batch?: number;
  activityType?: ActivityType;
  status?: ActivityStatus;
  container?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: plannedActivityKeys.list(params),
    queryFn: () =>
      ApiService.apiV1PlanningPlannedActivitiesList(
        params?.activityType,
        params?.batch,
        params?.container,
        undefined, // ordering
        params?.page,
        params?.scenario,
        undefined, // search
        params?.status
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single planned activity by ID
 */
export function usePlannedActivity(id: number) {
  return useQuery({
    queryKey: plannedActivityKeys.detail(id),
    queryFn: () => ApiService.apiV1PlanningPlannedActivitiesRetrieve(id),
    enabled: !!id,
  });
}

/**
 * Fetch planned activities for a specific scenario
 */
export function usePlannedActivitiesByScenario(scenarioId: number) {
  return useQuery({
    queryKey: plannedActivityKeys.byScenario(scenarioId),
    queryFn: () =>
      ApiService.apiV1ScenarioScenariosPlannedActivitiesRetrieve(scenarioId),
    enabled: !!scenarioId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch planned activities for a specific batch
 */
export function usePlannedActivitiesByBatch(batchId: number) {
  return useQuery({
    queryKey: plannedActivityKeys.byBatch(batchId),
    queryFn: () =>
      ApiService.apiV1BatchBatchesPlannedActivitiesRetrieve(batchId),
    enabled: !!batchId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch activity templates
 */
export function useActivityTemplates() {
  return useQuery({
    queryKey: activityTemplateKeys.lists(),
    queryFn: () => ApiService.apiV1PlanningActivityTemplatesList(),
    staleTime: 10 * 60 * 1000, // 10 minutes (templates don't change often)
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new planned activity
 */
export function useCreatePlannedActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PlannedActivity>) =>
      ApiService.apiV1PlanningPlannedActivitiesCreate(data as PlannedActivity),
    onSuccess: (newActivity) => {
      // Invalidate all list queries
      queryClient.invalidateQueries({ queryKey: plannedActivityKeys.lists() });
      // Invalidate scenario-specific query
      if (newActivity.scenario) {
        queryClient.invalidateQueries({
          queryKey: plannedActivityKeys.byScenario(newActivity.scenario),
        });
      }
      // Invalidate batch-specific query
      if (newActivity.batch) {
        queryClient.invalidateQueries({
          queryKey: plannedActivityKeys.byBatch(newActivity.batch),
        });
      }
    },
  });
}

/**
 * Update an existing planned activity
 */
export function useUpdatePlannedActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<PlannedActivity>;
    }) =>
      ApiService.apiV1PlanningPlannedActivitiesPartialUpdate(
        id,
        data as PlannedActivity
      ),
    onSuccess: (updatedActivity, { id }) => {
      // Invalidate detail query
      queryClient.invalidateQueries({
        queryKey: plannedActivityKeys.detail(id),
      });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: plannedActivityKeys.lists() });
      // Invalidate scenario and batch queries
      if (updatedActivity.scenario) {
        queryClient.invalidateQueries({
          queryKey: plannedActivityKeys.byScenario(updatedActivity.scenario),
        });
      }
      if (updatedActivity.batch) {
        queryClient.invalidateQueries({
          queryKey: plannedActivityKeys.byBatch(updatedActivity.batch),
        });
      }
    },
  });
}

/**
 * Delete a planned activity
 */
export function useDeletePlannedActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      ApiService.apiV1PlanningPlannedActivitiesDestroy(id),
    onSuccess: () => {
      // Invalidate all queries
      queryClient.invalidateQueries({ queryKey: plannedActivityKeys.all });
    },
  });
}

/**
 * Mark activity as completed
 */
export function useMarkActivityCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      // Backend expects empty body, but generated API requires PlannedActivity type
      // Using 'any' cast as workaround for generated type signature
      ApiService.apiV1PlanningPlannedActivitiesMarkCompletedCreate(id, {} as any),
    onSuccess: (completedActivity, id) => {
      // Invalidate ALL planned activities queries to ensure UI updates
      // This is more aggressive but guarantees the timeline/KPIs refresh
      queryClient.invalidateQueries({ queryKey: plannedActivityKeys.all });
      
      // Also invalidate scenario and batch queries if available
      if (completedActivity.scenario) {
        queryClient.invalidateQueries({
          queryKey: plannedActivityKeys.byScenario(completedActivity.scenario),
        });
      }
      if (completedActivity.batch) {
        queryClient.invalidateQueries({
          queryKey: plannedActivityKeys.byBatch(completedActivity.batch),
        });
      }
    },
  });
}

/**
 * Spawn workflow from TRANSFER activity
 */
export function useSpawnWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: SpawnWorkflowRequest;
    }) =>
      // Backend expects SpawnWorkflowRequest, but generated API requires PlannedActivity type
      // Using 'any' cast as workaround for generated type signature
      ApiService.apiV1PlanningPlannedActivitiesSpawnWorkflowCreate(id, data as any),
    onSuccess: (_, { id }) => {
      // Invalidate detail query (activity now has transfer_workflow link)
      queryClient.invalidateQueries({
        queryKey: plannedActivityKeys.detail(id),
      });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: plannedActivityKeys.lists() });
      // Invalidate workflow queries (if they exist)
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}


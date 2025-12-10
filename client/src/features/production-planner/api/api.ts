/**
 * Production Planner API Layer
 *
 * TanStack Query hooks for Planned Activities API operations.
 * Uses generated ApiService for all network calls.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { getAuthToken } from '@/lib/config';
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

export const varianceReportKeys = {
  all: ['variance-report'] as const,
  report: (filters?: Record<string, any>) =>
    [...varianceReportKeys.all, filters] as const,
};

export const projectionPreviewKeys = {
  all: ['projection-preview'] as const,
  activity: (activityId: number) =>
    [...projectionPreviewKeys.all, activityId] as const,
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
 * Fetch activity templates with optional filters
 */
export function useActivityTemplates(params?: {
  activityType?: 'VACCINATION' | 'TREATMENT' | 'CULL' | 'HARVEST' | 'SALE' | 'FEED_CHANGE' | 'TRANSFER' | 'MAINTENANCE' | 'SAMPLING' | 'OTHER';
  triggerType?: 'DAY_OFFSET' | 'WEIGHT_THRESHOLD' | 'STAGE_TRANSITION';
  isActive?: boolean;
  page?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: activityTemplateKeys.list(params),
    queryFn: () => ApiService.apiV1PlanningActivityTemplatesList(
      params?.activityType,
      params?.isActive,
      undefined, // ordering
      params?.page,
      params?.search,
      params?.triggerType,
    ),
    staleTime: 10 * 60 * 1000, // 10 minutes (templates don't change often)
  });
}

/**
 * Fetch single activity template by ID
 */
export function useActivityTemplate(id: number) {
  return useQuery({
    queryKey: activityTemplateKeys.detail(id),
    queryFn: () => ApiService.apiV1PlanningActivityTemplatesRetrieve(id),
    enabled: !!id,
  });
}

// ============================================================================
// PROJECTION PREVIEW (Phase 8.5)
// ============================================================================

/**
 * Response type for projection preview endpoint
 */
export interface ProjectionPreviewResponse {
  activity_id: number;
  due_date: string;
  scenario_id: number;
  scenario_name: string;
  projected_weight_g: number | null;
  projected_population: number | null;
  projected_biomass_kg: number | null;
  day_number: number | null;
  rationale: string;
}

/**
 * Fetch projection preview for a planned activity
 * 
 * Returns scenario-based rationale for the activity's due date,
 * including projected weight and population from the scenario.
 * Used by the ProjectionPreviewTooltip component.
 */
export function useProjectionPreview(activityId: number, enabled = true) {
  return useQuery({
    queryKey: projectionPreviewKeys.activity(activityId),
    queryFn: async (): Promise<ProjectionPreviewResponse> => {
      // Build headers with JWT auth token (same pattern as ApiService)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/planning/planned-activities/${activityId}/projection-preview/`, {
        headers,
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projection preview');
      }
      return response.json();
    },
    enabled: enabled && !!activityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

// ============================================================================
// TEMPLATE MUTATIONS
// ============================================================================

/**
 * Create a new activity template
 */
export function useCreateActivityTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ActivityTemplate>) =>
      ApiService.apiV1PlanningActivityTemplatesCreate(data as ActivityTemplate),
    onSuccess: () => {
      // Invalidate all template queries
      queryClient.invalidateQueries({ queryKey: activityTemplateKeys.all });
    },
  });
}

/**
 * Update an existing activity template
 */
export function useUpdateActivityTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ActivityTemplate>;
    }) =>
      ApiService.apiV1PlanningActivityTemplatesPartialUpdate(
        id,
        data as ActivityTemplate
      ),
    onSuccess: (_, { id }) => {
      // Invalidate detail query
      queryClient.invalidateQueries({
        queryKey: activityTemplateKeys.detail(id),
      });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: activityTemplateKeys.lists() });
    },
  });
}

/**
 * Delete an activity template
 */
export function useDeleteActivityTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      ApiService.apiV1PlanningActivityTemplatesDestroy(id),
    onSuccess: () => {
      // Invalidate all template queries
      queryClient.invalidateQueries({ queryKey: activityTemplateKeys.all });
    },
  });
}

/**
 * Generate planned activity from a template
 */
export function useGenerateFromTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: number;
      data: { scenario: number; batch: number; override_due_date?: string };
    }) =>
      // Backend expects scenario and batch IDs
      ApiService.apiV1PlanningActivityTemplatesGenerateForBatchCreate(
        templateId,
        data as any
      ),
    onSuccess: () => {
      // Invalidate planned activities queries (new activity created)
      queryClient.invalidateQueries({ queryKey: plannedActivityKeys.all });
    },
  });
}

// ============================================================================
// VARIANCE REPORT QUERIES
// ============================================================================

/**
 * Fetch variance report for planned vs actual activity execution
 */
export function useVarianceReport(params?: {
  scenario?: number;
  activityType?: ActivityType;
  dueDateAfter?: string;
  dueDateBefore?: string;
  groupBy?: 'month' | 'week';
  includeDetails?: boolean;
}) {
  return useQuery({
    queryKey: varianceReportKeys.report(params),
    queryFn: () =>
      ApiService.apiV1PlanningPlannedActivitiesVarianceReportRetrieve(
        params?.activityType,
        params?.dueDateAfter,
        params?.dueDateBefore,
        params?.groupBy ?? 'month',
        params?.includeDetails ?? false,
        params?.scenario
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}


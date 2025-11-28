/**
 * Scenario API Wrappers
 * Server-side aggregation endpoints for scenario KPIs and summaries
 * 
 * TASK 7: Scenario Stage Summary and Stats Implementation
 * - Uses backend summary_stats endpoint for scenario KPIs
 * - Supports FCR model stage summaries
 * - Environmental data integration with area filtering
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import { FcrService, TrendsService } from "@/api/generated";
import type { 
  FCRModel,
  PaginatedScenarioList,
  Scenario,
  PaginatedFCRTrendsList,
  PhotoperiodData,
  WeatherData,
  TGCModel,
  MortalityModel,
  TemperatureProfile,
} from "@/api/generated";
import { toast } from 'sonner';

// Common query options for scenario operations
const SCENARIO_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
  retryDelay: 1000,
} as const;

// Interface for scenario summary statistics (backend aggregated)
export interface ScenarioSummaryStats {
  totalActiveScenarios: number;
  scenariosInProgress: number;
  completedProjections: number;
  averageProjectionDuration: number;
}

/**
 * Hook to fetch FCR model stage summary
 * @param modelId - The FCR model ID
 * @returns Query result with FCR model stage summary
 */
export function useFCRModelStageSummary(
  modelId: number | undefined
): UseQueryResult<FCRModel, Error> {
  return useQuery({
    queryKey: ["scenario", "fcr-model-stage-summary", modelId],
    queryFn: async () => {
      if (!modelId) throw new Error("Model ID is required");
      return await ApiService.apiV1ScenarioFcrModelsStageSummaryRetrieve(modelId);
    },
    enabled: !!modelId,
    ...SCENARIO_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch all scenarios with pagination
 * @param page - Page number
 * @param pageSize - Number of items per page
 * @returns Query result with paginated scenarios
 */
export function useScenarios(
  page: number = 1,
  pageSize: number = 20
): UseQueryResult<PaginatedScenarioList, Error> {
  return useQuery({
    queryKey: ["scenario", "scenarios", { page, pageSize }],
    queryFn: async () => {
      return await ApiService.apiV1ScenarioScenariosList(
        false,     // all
        undefined, // createdBy
        undefined, // ordering
        page,
        undefined, // search
        undefined, // startDate
        undefined  // tgcModelLocation
      );
    },
    ...SCENARIO_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch a single scenario by ID
 * @param scenarioId - The scenario ID
 * @returns Query result with the scenario details
 */
export function useScenario(
  scenarioId: number | undefined
): UseQueryResult<Scenario, Error> {
  return useQuery({
    queryKey: ["scenario", "scenario", scenarioId],
    queryFn: async () => {
      if (!scenarioId) throw new Error("Scenario ID is required");
      return await ApiService.apiV1ScenarioScenariosRetrieve(scenarioId);
    },
    enabled: !!scenarioId,
    ...SCENARIO_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch scenario FCR trends using the FcrService
 * This can be used to get predicted FCR values for scenarios
 * @param options - Options for FCR trends query with scenario context
 * @returns Query result with FCR trends
 */
export function useScenarioFCRTrends(options?: {
  batchId?: number;
  geographyId?: number;
  interval?: "DAILY" | "WEEKLY" | "MONTHLY";
  startDate?: string;
  endDate?: string;
  includePredicted?: boolean;
  page?: number;
}): UseQueryResult<PaginatedFCRTrendsList, Error> {
  return useQuery({
    queryKey: ["scenario", "fcr-trends", options],
    queryFn: async () => {
      return await FcrService.apiV1OperationalFcrTrendsList(
        undefined, // assignmentId
        options?.batchId,
        options?.endDate,
        options?.geographyId,
        options?.includePredicted ?? true, // Default to including predicted values for scenarios
        options?.interval ?? "DAILY",
        undefined, // ordering
        options?.page,
        undefined, // search
        options?.startDate
      );
    },
    ...SCENARIO_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch scenarios filtered by batch
 * @param batchIds - Array of batch IDs to filter by
 * @param page - Page number
 * @returns Query result with filtered scenarios
 */
export function useScenariosByBatch(
  batchIds: number[],
  page: number = 1
): UseQueryResult<PaginatedScenarioList, Error> {
  return useQuery({
    queryKey: ["scenario", "scenarios-by-batch", { batchIds, page }],
    queryFn: async () => {
      // Note: The new API doesn't support batch filtering directly
      // This would need a different endpoint or backend support
      return await ApiService.apiV1ScenarioScenariosList(
        false,     // all
        undefined, // createdBy
        undefined, // ordering
        page,
        undefined, // search
        undefined, // startDate
        undefined  // tgcModelLocation
      );
    },
    enabled: batchIds.length > 0,
    ...SCENARIO_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch scenarios within a date range
 * @param startDate - Start date (ISO format)
 * @param endDate - End date (ISO format)
 * @param page - Page number
 * @returns Query result with filtered scenarios
 */
export function useScenariosByDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
  page: number = 1
): UseQueryResult<PaginatedScenarioList, Error> {
  return useQuery({
    queryKey: ["scenario", "scenarios-by-date", { startDate, endDate, page }],
    queryFn: async () => {
      return await ApiService.apiV1ScenarioScenariosList(
        false,     // all
        undefined, // createdBy
        undefined, // ordering
        page,
        undefined, // search
        startDate, // Only startDate is supported now
        undefined  // tgcModelLocation
      );
    },
    enabled: !!startDate && !!endDate,
    ...SCENARIO_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch active scenarios (those currently in progress)
 * Active scenarios are those where current date is between start and end date
 * @param page - Page number
 * @returns Query result with active scenarios
 */
export function useActiveScenarios(
  page: number = 1
): UseQueryResult<PaginatedScenarioList, Error> {
  const today = new Date().toISOString().split("T")[0];
  
  return useQuery({
    queryKey: ["scenario", "active-scenarios", { page }],
    queryFn: async () => {
      // Get scenarios where today is between start and end date
      // This might need backend support for proper filtering
      return await ApiService.apiV1ScenarioScenariosList(
        false,     // all
        undefined, // createdBy
        undefined, // ordering
        page,
        undefined, // search
        today,     // startDate - scenarios that have started
        undefined  // tgcModelLocation
      );
    },
    ...SCENARIO_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch scenario summary statistics (server-side aggregation)
 * Replaces client-side KPI calculations with backend aggregation
 * 
 * @returns Query result with aggregated scenario statistics
 * 
 * NOTE: Backend endpoint returns Scenario type per OpenAPI spec (may contain summary fields)
 * If backend returns standard Scenario, we'll need to compute stats client-side with honest fallbacks
 */
export function useScenarioSummaryStats(): UseQueryResult<Scenario, Error> {
  return useQuery({
    queryKey: ["scenario", "summary-stats"],
    queryFn: async () => {
      return await ApiService.apiV1ScenarioScenariosSummaryStatsRetrieve();
    },
    ...SCENARIO_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch environmental photoperiod data with area filtering
 * Used for scenario environmental integration
 * 
 * @param areaIds - Array of area IDs to filter by
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Query result with photoperiod data
 */
export function usePhotoperiodData(
  areaIds?: number[],
  startDate?: string,
  endDate?: string
): UseQueryResult<PhotoperiodData[], Error> {
  return useQuery({
    queryKey: ["scenario", "photoperiod", { areaIds, startDate, endDate }],
    queryFn: async () => {
      // Fetch photoperiod data for selected areas
      // API signature: apiV1EnvironmentalPhotoperiodList(area?, areaIn?, date?, isInterpolated?, ordering?, page?, search?)
      if (areaIds && areaIds.length > 0) {
        // Use area__in parameter for multi-area filtering
        const response = await ApiService.apiV1EnvironmentalPhotoperiodList(
          undefined, // area (single)
          areaIds,   // areaIn (multi)
          endDate,   // date
          undefined, // isInterpolated
          undefined, // ordering
          undefined, // page
          undefined  // search
        );
        return response.results || [];
      }
      // Fetch all photoperiod data if no area filter
      const response = await ApiService.apiV1EnvironmentalPhotoperiodList(
        undefined, // area
        undefined, // areaIn
        endDate,   // date
        undefined, // isInterpolated
        undefined, // ordering
        undefined, // page
        undefined  // search
      );
      return response.results || [];
    },
    enabled: (areaIds?.length ?? 0) > 0 || (!areaIds),
    ...SCENARIO_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch weather data for areas
 * Used for scenario environmental analysis
 * 
 * @param areaIds - Array of area IDs
 * @returns Query result with weather data
 */
export function useWeatherDataByAreas(
  areaIds?: number[]
): UseQueryResult<WeatherData[], Error> {
  return useQuery({
    queryKey: ["scenario", "weather", { areaIds }],
    queryFn: async () => {
      // Fetch weather data with area filtering
      // API signature: apiV1EnvironmentalWeatherList(area?, areaIn?, ordering?, page?, search?)
      if (areaIds && areaIds.length > 0) {
        const response = await ApiService.apiV1EnvironmentalWeatherList(
          undefined, // area (single)
          areaIds,   // areaIn (multi)
          undefined, // ordering
          undefined, // page
          undefined  // search
        );
        return response.results || [];
      }
      
      // Fetch all weather data if no area filter
      const response = await ApiService.apiV1EnvironmentalWeatherList(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      return response.results || [];
    },
    enabled: (areaIds?.length ?? 0) > 0 || (!areaIds),
    ...SCENARIO_QUERY_OPTIONS,
  });
}

// Export utility to invalidate scenario queries
export function getScenarioQueryKeys() {
  return {
    all: ["scenario"] as const,
    scenarios: ["scenario", "scenarios"] as const,
    scenario: (id: number) => ["scenario", "scenario", id] as const,
    fcrModelStageSummary: (modelId: number) => ["scenario", "fcr-model-stage-summary", modelId] as const,
    scenariosByBatch: (batchIds: number[]) => ["scenario", "scenarios-by-batch", { batchIds }] as const,
    scenariosByDate: (startDate: string, endDate: string) => 
      ["scenario", "scenarios-by-date", { startDate, endDate }] as const,
    activeScenarios: ["scenario", "active-scenarios"] as const,
    fcrTrends: ["scenario", "fcr-trends"] as const,
    summaryStats: ["scenario", "summary-stats"] as const,
    photoperiod: (areaIds?: number[]) => ["scenario", "photoperiod", { areaIds }] as const,
    weather: (areaIds?: number[]) => ["scenario", "weather", { areaIds }] as const,
  };
}

// ============================================================================
// Mutation Hooks for CRUD Operations (Phase 7)
// ============================================================================

export function useTGCModels() {
  return useQuery({
    queryKey: ['scenario', 'tgc-models'],
    queryFn: () => ApiService.apiV1ScenarioTgcModelsList(),
  });
}

export function useCreateTGCModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ApiService.apiV1ScenarioTgcModelsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenario', 'tgc-models'] });
      toast.success('TGC model created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to create TGC model');
    },
  });
}

export function useUpdateTGCModel(modelId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ApiService.apiV1ScenarioTgcModelsPartialUpdate(modelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenario', 'tgc-models'] });
      toast.success('TGC model updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to update TGC model');
    },
  });
}

export function useDeleteTGCModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modelId: number) => ApiService.apiV1ScenarioTgcModelsDestroy(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenario', 'tgc-models'] });
      toast.success('TGC model deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to delete TGC model');
    },
  });
}

export function useFCRModels() {
  return useQuery({
    queryKey: ['scenario', 'fcr-models'],
    queryFn: () => ApiService.apiV1ScenarioFcrModelsList(),
  });
}

export function useCreateFCRModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ApiService.apiV1ScenarioFcrModelsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenario', 'fcr-models'] });
      toast.success('FCR model created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to create FCR model');
    },
  });
}

export function useMortalityModels() {
  return useQuery({
    queryKey: ['scenario', 'mortality-models'],
    queryFn: () => ApiService.apiV1ScenarioMortalityModelsList(),
  });
}

export function useCreateMortalityModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ApiService.apiV1ScenarioMortalityModelsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenario', 'mortality-models'] });
      toast.success('Mortality model created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to create mortality model');
    },
  });
}

export function useCreateScenario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ApiService.apiV1ScenarioScenariosCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenario', 'scenarios'] });
      toast.success('Scenario created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to create scenario');
    },
  });
}

export function useTemperatureProfiles() {
  return useQuery({
    queryKey: ['scenario', 'temperature-profiles'],
    queryFn: () => ApiService.apiV1ScenarioTemperatureProfilesList(),
  });
}

// ============================================================================
// ProjectionRun API Hooks
// ============================================================================

// Type for ProjectionRun (matches backend serializer)
export interface ProjectionRun {
  run_id: number;
  scenario: number;
  scenario_name: string;
  run_number: number;
  label: string;
  run_date: string;
  total_projections: number;
  final_weight_g: number | null;
  final_biomass_kg: number | null;
  pinned_batch_count: number;
  parameters_snapshot?: Record<string, any>;
  notes?: string;
  created_by_name?: string;
}

/**
 * Hook to fetch projection runs for a scenario
 * @param scenarioId - The scenario ID to fetch runs for
 * @returns Query result with projection runs
 */
export function useScenarioProjectionRuns(scenarioId: number | undefined) {
  return useQuery({
    queryKey: ['scenario', scenarioId, 'projection-runs'],
    queryFn: async () => {
      if (!scenarioId) throw new Error('Scenario ID required');
      // The API returns an array, but TypeScript thinks it's a Scenario
      const result = await ApiService.apiV1ScenarioScenariosProjectionRunsRetrieve(scenarioId);
      return result as unknown as ProjectionRun[];
    },
    enabled: !!scenarioId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single projection run
 * @param runId - The projection run ID
 * @returns Query result with projection run details
 */
export function useProjectionRun(runId: number | undefined) {
  return useQuery({
    queryKey: ['projection-run', runId],
    queryFn: async () => {
      if (!runId) throw new Error('Run ID required');
      return await ApiService.apiV1ScenarioProjectionRunsRetrieve(runId);
    },
    enabled: !!runId,
  });
}

/**
 * Hook to run projections (creates new run)
 * @param scenarioId - The scenario ID to run projections for
 * @returns Mutation hook for running projections
 */
export function useRunProjection(scenarioId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (label?: string) => {
      // The API actually accepts {label?: string} but generated client types it as Scenario
      // This is a known OpenAPI schema generation issue - the endpoint works correctly
      return await ApiService.apiV1ScenarioScenariosRunProjectionCreate(
        scenarioId,
        { label: label || '' } as unknown as any
      );
    },
    onSuccess: () => {
      // Invalidate projection runs list
      queryClient.invalidateQueries({
        queryKey: ['scenario', scenarioId, 'projection-runs'],
      });
      toast.success('Projection run created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to run projection');
    },
  });
}

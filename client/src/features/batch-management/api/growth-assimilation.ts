/**
 * Growth Assimilation API Integration
 * 
 * React Query hooks for Growth Analysis feature (Phase 7)
 * Backend: Batch Growth Assimilation (Phases 1-6 complete)
 * Issue: #112
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import type { GrowthAnalysisCombined, PinScenario } from '@/api/generated';
import { toast } from 'sonner';

// ============================================================================
// TypeScript Interfaces (Properly typed from backend schema)
// ============================================================================

export interface GrowthSample {
  date: string;
  avg_weight_g: number;
  sample_size: number;
  assignment_id: number;
  container_name: string;
  condition_factor?: number;
  std_deviation_weight?: number;
  min_weight_g?: number;
  max_weight_g?: number;
}

export interface ScenarioInfo {
  id: number;
  name: string;
  start_date: string;
  duration_days: number;
  initial_count: number;
  initial_weight: number;
  // NEW: Projection run info
  projection_run: {
    run_id: number;
    run_number: number;
    label: string;
    run_date: string;
  } | null;
}

export interface ScenarioProjectionDay {
  date: string;
  day_number: number;
  avg_weight_g: number;
  population: number;
  biomass_kg: number;
}

export interface ActualDailyState {
  date: string;
  day_number: number;
  avg_weight_g: number;
  population: number;
  biomass_kg: number;
  temp_c?: number;
  mortality_count?: number;
  feed_kg?: number;
  observed_fcr?: number;
  anchor_type: 'growth_sample' | 'transfer' | 'vaccination' | 'manual' | null;
  assignment_id: number;
  container_name: string;
  lifecycle_stage?: string;
  sources: {
    temp: 'measured' | 'interpolated' | 'profile';
    mortality: 'actual' | 'model';
    feed: 'actual' | 'none';
    weight: 'growth_sample' | 'transfer' | 'vaccination' | 'tgc_computed' | 'manual';
  };
  confidence_scores: {
    temp: number;      // 0.0-1.0
    mortality: number; // 0.0-1.0
    feed: number;      // 0.0-1.0
    weight: number;    // 0.0-1.0
  };
}

export interface ContainerAssignment {
  id: number;
  container_name: string;
  container_type: string;
  arrival_date: string;
  departure_date?: string;
  population_count: number;
  avg_weight_g: number;
  biomass_kg: number;
  lifecycle_stage: string;
}

export interface DateRange {
  start: string;
  end: string;
  granularity: 'daily' | 'weekly';
}

export interface GrowthAnalysisData {
  batch_id: number;
  batch_number: string;
  species: string;
  lifecycle_stage: string;
  start_date: string;
  status: string;
  scenario: ScenarioInfo | null;
  growth_samples: GrowthSample[];
  scenario_projection: ScenarioProjectionDay[];
  actual_daily_states: ActualDailyState[];
  container_assignments: ContainerAssignment[];
  date_range: DateRange;
}

// ============================================================================
// Query Options
// ============================================================================

export interface GrowthDataOptions {
  startDate?: string;     // ISO date YYYY-MM-DD
  endDate?: string;       // ISO date YYYY-MM-DD
  assignmentId?: number;  // Filter to specific container
  granularity?: 'daily' | 'weekly';
}

export interface PinScenarioRequest {
  scenario_id: number;
}

export interface RecomputeRequest {
  start_date: string;
  end_date?: string;
  assignment_ids?: number[];
}

// ============================================================================
// React Query Hooks
// ============================================================================

/**
 * Fetch combined growth data for a batch
 * 
 * Returns all data needed for Growth Analysis chart:
 * - Growth samples (measured points)
 * - Scenario projection (planned)
 * - Actual daily states (assimilated reality)
 * - Container assignments (for drilldown)
 * 
 * @param batchId - Batch ID
 * @param options - Query parameters (date range, granularity, container filter)
 */
export function useCombinedGrowthData(
  batchId: number | undefined,
  options?: GrowthDataOptions
) {
  return useQuery({
    queryKey: ['batch', batchId, 'combined-growth-data', options],
    queryFn: async () => {
      if (!batchId) throw new Error('Batch ID is required');
      
      // Convert Date objects to ISO strings if needed
      const params = {
        assignmentId: options?.assignmentId,
        startDate: options?.startDate,
        endDate: options?.endDate,
        granularity: options?.granularity || 'daily',
      };
      
      const data = await ApiService.batchCombinedGrowthData(
        batchId,
        params.assignmentId,
        params.endDate,
        params.granularity,
        params.startDate
      );
      
      // Cast to properly typed interface
      return data as unknown as GrowthAnalysisData;
    },
    enabled: !!batchId,
    staleTime: 5 * 60 * 1000, // 5 minutes (data updates via Celery tasks)
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes
  });
}

/**
 * Pin a scenario to a batch
 * 
 * DEPRECATED: Backend endpoint removed. Use usePinProjectionRun instead.
 * 
 * @param batchId - Batch ID
 * @deprecated Use usePinProjectionRun for explicit version control
 */
/* COMMENTED OUT - pin-scenario endpoint removed in backend
export function usePinScenario(batchId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: PinScenarioRequest) => {
      return ApiService.batchPinScenario(batchId, request);
    },
    onSuccess: () => {
      // Invalidate combined data query to refetch with new scenario
      queryClient.invalidateQueries({
        queryKey: ['batch', batchId, 'combined-growth-data'],
      });
      
      // Also invalidate batch detail (pinned scenario is part of batch data)
      queryClient.invalidateQueries({
        queryKey: ['batch', batchId],
      });
    },
  });
}
*/

/**
 * Trigger manual recomputation of daily states
 * 
 * Manager+ action to recompute actual daily states for a date range.
 * Enqueues Celery task(s) for background processing.
 * 
 * RBAC: Manager + Admin only (backend enforces geography filtering)
 * 
 * @param batchId - Batch ID
 */
export function useRecomputeBatch(batchId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: RecomputeRequest) => {
      return ApiService.batchRecomputeDailyStates(batchId, request);
    },
    onSuccess: () => {
      // Wait a bit for Celery task to complete, then refetch
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['batch', batchId, 'combined-growth-data'],
        });
      }, 30000); // 30 seconds
    },
  });
}

/**
 * Refresh recent data (7-day shortcut for Manager+)
 * 
 * Convenience hook for refreshing the last 7 days of data.
 * Commonly used after feeding events or other operational changes.
 * 
 * @param batchId - Batch ID
 */
export function useRefreshBatchData(batchId: number) {
  const recomputeMutation = useRecomputeBatch(batchId);
  
  return {
    ...recomputeMutation,
    refreshLast7Days: () => {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      return recomputeMutation.mutate({
        start_date: sevenDaysAgo.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
      });
    },
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate variance between actual and scenario projection
 */
export function calculateVariance(
  actual: ActualDailyState | undefined,
  projected: ScenarioProjectionDay | undefined
): { grams: number; percent: number } | null {
  if (!actual || !projected) return null;
  
  const variance = actual.avg_weight_g - projected.avg_weight_g;
  const percent = (variance / projected.avg_weight_g) * 100;
  
  return { grams: variance, percent };
}

/**
 * Format confidence score for display
 */
export function formatConfidence(score: number): string {
  if (score >= 0.9) return 'High';
  if (score >= 0.6) return 'Medium';
  return 'Low';
}

/**
 * Get confidence color for UI
 */
export function getConfidenceColor(score: number): string {
  if (score >= 0.9) return 'text-green-600 dark:text-green-400';
  if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * Format data source for display
 */
export function formatSource(source: string): string {
  const sourceMap: Record<string, string> = {
    measured: 'Measured',
    interpolated: 'Interpolated',
    profile: 'Temperature Profile',
    actual: 'Actual',
    model: 'Model',
    none: 'None',
    growth_sample: 'Growth Sample',
    transfer: 'Transfer',
    vaccination: 'Vaccination',
    tgc_computed: 'TGC Calculated',
    manual: 'Manual Entry',
  };
  
  return sourceMap[source] || source;
}

/**
 * Auto-determine granularity based on date range
 */
export function determineGranularity(startDate: Date, endDate: Date): 'daily' | 'weekly' {
  const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return days > 180 ? 'weekly' : 'daily';
}

/**
 * Parse ISO date string to Date object
 * Handles backend YYYY-MM-DD format
 */
export function parseISODate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

/**
 * Format Date object to ISO date string for API
 */
export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ============================================================================
// ProjectionRun Pin Mutation
// ============================================================================

export interface PinProjectionRunRequest {
  projection_run_id: number;
}

/**
 * Hook to pin a projection run to a batch
 * @param batchId - The batch ID to pin to
 * @returns Mutation hook for pinning projection run
 */
export function usePinProjectionRun(batchId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: PinProjectionRunRequest) => {
      // OpenAPI currently reuses PinScenario schema even though the backend expects projection_run_id.
      // Cast the payload until the backend publishes the corrected schema.
      return await ApiService.batchPinScenario(
        batchId,
        request as unknown as PinScenario
      );
    },
    onSuccess: () => {
      // Invalidate all batch-related queries
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
      queryClient.invalidateQueries({ 
        queryKey: ['batch', batchId, 'combined-growth-data'] 
      });
      toast.success('Projection run pinned successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.error || 'Failed to pin projection run');
    },
  });
}


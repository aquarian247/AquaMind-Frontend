/**
 * Batch API Wrappers
 * Server-side aggregation endpoints for batch KPIs and trends
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import { FcrService, TrendsService } from "@/api/generated";
import type { 
  BatchContainerAssignment,
  PaginatedFCRTrendsList,
} from "@/api/generated";

// Common query options for batch operations
const BATCH_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
  retryDelay: 1000,
} as const;

// Time interval types for FCR trends
export type TimeInterval = "DAILY" | "WEEKLY" | "MONTHLY";

// Aggregation level types for FCR trends
export type AggregationLevel = "batch" | "assignment" | "geography";

/**
 * Hook to fetch container assignments summary with filters
 * @param filters - Optional filters for the summary
 * @returns Query result with container assignments summary
 */
export function useContainerAssignmentsSummary(filters?: {
  geography?: number;
  area?: number;
  station?: number;
  hall?: number;
  containerType?: string;
  isActive?: boolean;
}): UseQueryResult<{ active_biomass_kg: number; count: number; total_population: number }, Error> {
  return useQuery({
    queryKey: ["batch", "container-assignments-summary", filters],
    queryFn: async () => {
      // ✅ FIXED: Backend Issue #76 resolved - parameters now available!
      return await ApiService.batchContainerAssignmentsSummary(
        filters?.area,
        filters?.containerType,
        filters?.geography,
        filters?.hall,
        filters?.isActive ?? true, // Default to active assignments
        filters?.station
      );
    },
    ...BATCH_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch FCR trends with various aggregation options
 * @param options - Options for FCR trends query
 * @returns Query result with paginated FCR trends
 */
export function useFCRTrends(options?: {
  batchId?: number;
  assignmentId?: number;
  geographyId?: number;
  interval?: TimeInterval;
  startDate?: string;
  endDate?: string;
  includePredicted?: boolean;
  page?: number;
}): UseQueryResult<PaginatedFCRTrendsList, Error> {
  return useQuery({
    queryKey: ["batch", "fcr-trends", options],
    queryFn: async () => {
      return await FcrService.apiV1OperationalFcrTrendsList(
        options?.assignmentId,
        options?.batchId,
        options?.endDate,
        options?.geographyId,
        options?.includePredicted ?? true,
        options?.interval,
        undefined, // ordering
        options?.page,
        undefined, // search
        options?.startDate
      );
    },
    ...BATCH_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch batch-level FCR trends
 * @param batchId - The batch ID to get trends for
 * @param interval - Time interval for aggregation
 * @param dateRange - Optional date range
 * @returns Query result with FCR trends for the batch
 */
export function useBatchFCRTrends(
  batchId: number | undefined,
  interval: TimeInterval = "DAILY",
  dateRange?: { startDate: string; endDate: string }
): UseQueryResult<PaginatedFCRTrendsList, Error> {
  return useFCRTrends({
    batchId,
    interval,
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
  });
}

/**
 * Hook to fetch geography-level FCR trends (default aggregation)
 * @param geographyId - Optional geography ID
 * @param interval - Time interval for aggregation
 * @param dateRange - Optional date range
 * @returns Query result with FCR trends for the geography
 */
export function useGeographyFCRTrends(
  geographyId?: number,
  interval: TimeInterval = "DAILY",
  dateRange?: { startDate: string; endDate: string }
): UseQueryResult<PaginatedFCRTrendsList, Error> {
  return useFCRTrends({
    geographyId,
    interval,
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
  });
}

/**
 * Hook to fetch FCR trends for the last N days
 * @param days - Number of days to look back (default: 30)
 * @param options - Additional options for the query
 * @returns Query result with FCR trends
 */
export function useFCRTrendsLastDays(
  days: number = 30,
  options?: {
    batchId?: number;
    geographyId?: number;
    interval?: TimeInterval;
  }
): UseQueryResult<PaginatedFCRTrendsList, Error> {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return useFCRTrends({
    ...options,
    startDate,
    endDate,
  });
}

/**
 * Hook to fetch weekly FCR trends for a batch
 * @param batchId - The batch ID
 * @param weeks - Number of weeks to fetch (default: 12)
 * @returns Query result with weekly FCR trends
 */
export function useWeeklyFCRTrends(
  batchId: number | undefined,
  weeks: number = 12
): UseQueryResult<PaginatedFCRTrendsList, Error> {
  const days = weeks * 7;
  return useFCRTrendsLastDays(days, {
    batchId,
    interval: "WEEKLY",
  });
}

/**
 * Hook to fetch monthly FCR trends for a geography
 * @param geographyId - The geography ID
 * @param months - Number of months to fetch (default: 12)
 * @returns Query result with monthly FCR trends
 */
export function useMonthlyFCRTrends(
  geographyId: number | undefined,
  months: number = 12
): UseQueryResult<PaginatedFCRTrendsList, Error> {
  const days = months * 30; // Approximate
  return useFCRTrendsLastDays(days, {
    geographyId,
    interval: "MONTHLY",
  });
}

/**
 * Alternative hook using TrendsService (same functionality as FcrService)
 * @param options - Options for trends query
 * @returns Query result with paginated FCR trends
 */
export function useTrends(options?: {
  batchId?: number;
  assignmentId?: number;
  geographyId?: number;
  interval?: TimeInterval;
  startDate?: string;
  endDate?: string;
  includePredicted?: boolean;
  page?: number;
}): UseQueryResult<PaginatedFCRTrendsList, Error> {
  return useQuery({
    queryKey: ["batch", "trends", options],
    queryFn: async () => {
      return await TrendsService.apiV1OperationalFcrTrendsList(
        options?.assignmentId,
        options?.batchId,
        options?.endDate,
        options?.geographyId,
        options?.includePredicted ?? true,
        options?.interval,
        undefined, // ordering
        options?.page,
        undefined, // search
        options?.startDate
      );
    },
    ...BATCH_QUERY_OPTIONS,
  });
}

// Export utility to invalidate batch queries
export function getBatchQueryKeys() {
  return {
    all: ["batch"] as const,
    containerAssignmentsSummary: ["batch", "container-assignments-summary"] as const,
    fcrTrends: ["batch", "fcr-trends"] as const,
    fcrTrendsByBatch: (batchId: number) => ["batch", "fcr-trends", { batchId }] as const,
    fcrTrendsByGeography: (geographyId: number) => ["batch", "fcr-trends", { geographyId }] as const,
    trends: ["batch", "trends"] as const,
  };
}

/**
 * Infrastructure API Wrappers
 * Server-side aggregation endpoints for infrastructure KPIs
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import type {
  Area,
  FreshwaterStation,
  Hall,
  Geography,
} from "@/api/generated";

// Extended types for summary endpoints that include aggregated data
export type AreaSummary = Area & {
  container_count?: number;
  ring_count?: number;
  active_biomass_kg?: number;
  population_count?: number;
  avg_weight_kg?: number;
};

export type FreshwaterStationSummary = FreshwaterStation & {
  hall_count?: number;
  container_count?: number;
  active_biomass_kg?: number;
  population_count?: number;
  avg_weight_kg?: number;
};

export type HallSummary = Hall & {
  container_count?: number;
  active_biomass_kg?: number;
  population_count?: number;
  avg_weight_kg?: number;
};

export type GeographySummary = Geography & {
  container_count?: number;
  ring_count?: number;
  active_biomass_kg?: number;
  population_count?: number;
  avg_weight_kg?: number;
};

// Common query options for infrastructure
const INFRASTRUCTURE_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
  retryDelay: 1000,
} as const;

/**
 * Hook to fetch area summary with server-side aggregation
 * @param areaId - The area ID to fetch summary for
 * @returns Query result with area summary data
 */
export function useAreaSummary(areaId: number | undefined): UseQueryResult<AreaSummary, Error> {
  return useQuery({
    queryKey: ["infrastructure", "area-summary", areaId],
    queryFn: async () => {
      if (!areaId) throw new Error("Area ID is required");
      return await ApiService.apiV1InfrastructureAreasSummaryRetrieve(areaId);
    },
    enabled: !!areaId,
    ...INFRASTRUCTURE_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch freshwater station summary with server-side aggregation
 * @param stationId - The station ID to fetch summary for
 * @returns Query result with station summary data
 */
export function useStationSummary(stationId: number | undefined): UseQueryResult<FreshwaterStationSummary, Error> {
  return useQuery({
    queryKey: ["infrastructure", "station-summary", stationId],
    queryFn: async () => {
      if (!stationId) throw new Error("Station ID is required");
      return await ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(stationId);
    },
    enabled: !!stationId,
    ...INFRASTRUCTURE_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch hall summary with server-side aggregation
 * @param hallId - The hall ID to fetch summary for
 * @returns Query result with hall summary data
 */
export function useHallSummary(hallId: number | undefined): UseQueryResult<HallSummary, Error> {
  return useQuery({
    queryKey: ["infrastructure", "hall-summary", hallId],
    queryFn: async () => {
      if (!hallId) throw new Error("Hall ID is required");
      return await ApiService.apiV1InfrastructureHallsSummaryRetrieve(hallId);
    },
    enabled: !!hallId,
    ...INFRASTRUCTURE_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch geography summary with server-side aggregation
 * @param geographyId - The geography ID to fetch summary for
 * @returns Query result with geography summary data
 */
export function useGeographySummary(geographyId: number | undefined): UseQueryResult<Geography, Error> {
  return useQuery({
    queryKey: ["infrastructure", "geography-summary", geographyId],
    queryFn: async () => {
      if (!geographyId) throw new Error("Geography ID is required");
      return await ApiService.apiV1InfrastructureGeographiesSummaryRetrieve(geographyId);
    },
    enabled: !!geographyId,
    ...INFRASTRUCTURE_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch multiple area summaries
 * Useful for listing pages that need summaries for multiple areas
 * @param areaIds - Array of area IDs to fetch summaries for
 * @returns Array of query results
 */
export function useAreaSummaries(areaIds: number[]): UseQueryResult<AreaSummary[], Error> {
  return useQuery({
    queryKey: ["infrastructure", "area-summaries", areaIds],
    queryFn: async () => {
      const summaries = await Promise.all(
        areaIds.map(id => ApiService.apiV1InfrastructureAreasSummaryRetrieve(id))
      );
      return summaries;
    },
    enabled: areaIds.length > 0,
    ...INFRASTRUCTURE_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch multiple station summaries
 * Useful for listing pages that need summaries for multiple stations
 * @param stationIds - Array of station IDs to fetch summaries for
 * @returns Array of query results
 */
export function useStationSummaries(stationIds: number[]): UseQueryResult<FreshwaterStationSummary[], Error> {
  return useQuery({
    queryKey: ["infrastructure", "station-summaries", stationIds],
    queryFn: async () => {
      const summaries = await Promise.all(
        stationIds.map(id => ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(id))
      );
      return summaries;
    },
    enabled: stationIds.length > 0,
    ...INFRASTRUCTURE_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch multiple hall summaries
 * Useful for listing pages that need summaries for multiple halls
 * @param hallIds - Array of hall IDs to fetch summaries for
 * @returns Array of query results
 */
export function useHallSummaries(hallIds: number[]): UseQueryResult<HallSummary[], Error> {
  return useQuery({
    queryKey: ["infrastructure", "hall-summaries", hallIds],
    queryFn: async () => {
      const summaries = await Promise.all(
        hallIds.map(id => ApiService.apiV1InfrastructureHallsSummaryRetrieve(id))
      );
      return summaries;
    },
    enabled: hallIds.length > 0,
    ...INFRASTRUCTURE_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch multiple geography summaries
 * Useful for overview pages that need summaries for multiple geographies
 * @param geographyIds - Array of geography IDs to fetch summaries for
 * @returns Array of query results
 */
export function useGeographySummaries(geographyIds: number[]): UseQueryResult<GeographySummary[], Error> {
  return useQuery({
    queryKey: ["infrastructure", "geography-summaries", geographyIds],
    queryFn: async () => {
      const summaries = await Promise.all(
        geographyIds.map(id => ApiService.apiV1InfrastructureGeographiesSummaryRetrieve(id))
      );
      return summaries;
    },
    enabled: geographyIds.length > 0,
    ...INFRASTRUCTURE_QUERY_OPTIONS,
  });
}

// Export utility to invalidate infrastructure queries
export function getInfrastructureQueryKeys() {
  return {
    all: ["infrastructure"] as const,
    areas: ["infrastructure", "area-summary"] as const,
    area: (id: number) => ["infrastructure", "area-summary", id] as const,
    stations: ["infrastructure", "station-summary"] as const,
    station: (id: number) => ["infrastructure", "station-summary", id] as const,
    halls: ["infrastructure", "hall-summary"] as const,
    hall: (id: number) => ["infrastructure", "hall-summary", id] as const,
    geographies: ["infrastructure", "geography-summary"] as const,
    geography: (id: number) => ["infrastructure", "geography-summary", id] as const,
  };
}

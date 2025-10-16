/**
 * Infrastructure API Wrappers
 * Server-side aggregation endpoints for infrastructure KPIs
 * Plus CRUD operations for Geography and Area entities
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import { useCrudMutation } from "@/features/shared/hooks/useCrudMutation";
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
 * Note: Backend does not have summary endpoint for areas yet.
 * Returns base area data without aggregated metrics.
 * @param areaId - The area ID to fetch summary for
 * @returns Query result with area summary data
 */
export function useAreaSummary(areaId: number | undefined): UseQueryResult<AreaSummary, Error> {
  return useQuery({
    queryKey: ["infrastructure", "area-summary", areaId],
    queryFn: async () => {
      if (!areaId) throw new Error("Area ID is required");
      return await ApiService.apiV1InfrastructureAreasRetrieve(areaId);
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
 * Note: Backend does not have summary endpoint for halls yet.
 * Returns base hall data without aggregated metrics.
 * @param hallId - The hall ID to fetch summary for
 * @returns Query result with hall summary data
 */
export function useHallSummary(hallId: number | undefined): UseQueryResult<HallSummary, Error> {
  return useQuery({
    queryKey: ["infrastructure", "hall-summary", hallId],
    queryFn: async () => {
      if (!hallId) throw new Error("Hall ID is required");
      return await ApiService.apiV1InfrastructureHallsRetrieve(hallId);
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
 * Area summary data structure (from /areas/{id}/summary/ endpoint)
 */
export type AreaSummaryData = {
  container_count: number;
  ring_count: number;
  active_biomass_kg: number;
  population_count: number;
  avg_weight_kg: number;
};

/**
 * Hook to fetch multiple area summaries
 * Useful for listing pages that need summaries for multiple areas
 * Uses the /areas/{id}/summary/ endpoint to get aggregated metrics.
 * @param areaIds - Array of area IDs to fetch summaries for
 * @returns Array of query results with ring_count, biomass, population
 */
export function useAreaSummaries(areaIds: number[]): UseQueryResult<AreaSummaryData[], Error> {
  return useQuery({
    queryKey: ["infrastructure", "area-summaries", areaIds],
    queryFn: async () => {
      const summaries = await Promise.all(
        areaIds.map(id => ApiService.areaSummary(id))
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
 * Note: Backend does not have summary endpoint for halls yet.
 * Returns base hall data without aggregated metrics.
 * @param hallIds - Array of hall IDs to fetch summaries for
 * @returns Array of query results
 */
export function useHallSummaries(hallIds: number[]): UseQueryResult<HallSummary[], Error> {
  return useQuery({
    queryKey: ["infrastructure", "hall-summaries", hallIds],
    queryFn: async () => {
      const summaries = await Promise.all(
        hallIds.map(id => ApiService.apiV1InfrastructureHallsRetrieve(id))
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

// ===== GEOGRAPHY CRUD HOOKS =====

/**
 * Hook to fetch all geographies
 * @returns Query result with geographies list
 */
export function useGeographies() {
  return useQuery({
    queryKey: ["geographies"],
    queryFn: () => ApiService.apiV1InfrastructureGeographiesList(),
  });
}

/**
 * Hook to fetch a single geography by ID
 * @param id - The geography ID to fetch
 * @returns Query result with geography data
 */
export function useGeography(id: number | undefined) {
  return useQuery({
    queryKey: ["geography", id],
    queryFn: () => {
      if (!id) throw new Error("Geography ID is required");
      return ApiService.apiV1InfrastructureGeographiesRetrieve(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new geography
 * @returns Mutation hook for creating geography
 */
export function useCreateGeography() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureGeographiesCreate,
    description: "Geography created successfully",
    invalidateQueries: ["geographies"],
  });
}

/**
 * Hook to update an existing geography
 * @returns Mutation hook for updating geography
 */
export function useUpdateGeography() {
  return useCrudMutation({
    mutationFn: ({ id, ...data }: Geography) =>
      ApiService.apiV1InfrastructureGeographiesUpdate(id, data as Geography),
    description: "Geography updated successfully",
    invalidateQueries: ["geographies"],
  });
}

/**
 * Hook to delete a geography with audit trail support
 * @returns Mutation hook for deleting geography
 */
export function useDeleteGeography() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InfrastructureGeographiesDestroy(id),
    description: "Geography deleted",
    invalidateQueries: ["geographies"],
    injectAuditReason: (vars, reason) => ({
      ...vars,
      change_reason: reason,
    }),
  });
}

// ===== FRESHWATER STATION CRUD HOOKS =====

/**
 * Hook to fetch all freshwater stations with optional filtering
 * @param filters - Optional filter parameters
 * @returns Query result with stations list
 */
export function useFreshwaterStations(filters?: { geography?: number; active?: boolean }) {
  return useQuery({
    queryKey: ["freshwater-stations", filters],
    queryFn: () =>
      ApiService.apiV1InfrastructureFreshwaterStationsList(
        filters?.active,
        filters?.geography,
        undefined, // ordering
        undefined // page
      ),
  });
}

/**
 * Hook to fetch a single freshwater station by ID
 * @param id - The station ID to fetch
 * @returns Query result with station data
 */
export function useFreshwaterStation(id: number | undefined) {
  return useQuery({
    queryKey: ["freshwater-station", id],
    queryFn: () => {
      if (!id) throw new Error("Freshwater station ID is required");
      return ApiService.apiV1InfrastructureFreshwaterStationsRetrieve(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new freshwater station
 * @returns Mutation hook for creating station
 */
export function useCreateFreshwaterStation() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureFreshwaterStationsCreate,
    description: "Freshwater station created successfully",
    invalidateQueries: ["freshwater-stations"],
  });
}

/**
 * Hook to update an existing freshwater station
 * @returns Mutation hook for updating station
 */
export function useUpdateFreshwaterStation() {
  return useCrudMutation({
    mutationFn: ({ id, ...data }: FreshwaterStation) =>
      ApiService.apiV1InfrastructureFreshwaterStationsUpdate(id, data as FreshwaterStation),
    description: "Freshwater station updated successfully",
    invalidateQueries: ["freshwater-stations"],
  });
}

/**
 * Hook to delete a freshwater station with audit trail support
 * @returns Mutation hook for deleting station
 */
export function useDeleteFreshwaterStation() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InfrastructureFreshwaterStationsDestroy(id),
    description: "Freshwater station deleted",
    invalidateQueries: ["freshwater-stations"],
    injectAuditReason: (vars, reason) => ({
      ...vars,
      change_reason: reason,
    }),
  });
}

// ===== HALL CRUD HOOKS =====

/**
 * Hook to fetch all halls with optional filtering
 * @param filters - Optional filter parameters
 * @returns Query result with halls list
 */
export function useHalls(filters?: { freshwater_station?: number; active?: boolean }) {
  return useQuery({
    queryKey: ["halls", filters],
    queryFn: () =>
      ApiService.apiV1InfrastructureHallsList(
        filters?.active,
        filters?.freshwater_station,
        undefined, // ordering
        undefined // page
      ),
  });
}

/**
 * Hook to fetch a single hall by ID
 * @param id - The hall ID to fetch
 * @returns Query result with hall data
 */
export function useHall(id: number | undefined) {
  return useQuery({
    queryKey: ["hall", id],
    queryFn: () => {
      if (!id) throw new Error("Hall ID is required");
      return ApiService.apiV1InfrastructureHallsRetrieve(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new hall
 * @returns Mutation hook for creating hall
 */
export function useCreateHall() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureHallsCreate,
    description: "Hall created successfully",
    invalidateQueries: ["halls"],
  });
}

/**
 * Hook to update an existing hall
 * @returns Mutation hook for updating hall
 */
export function useUpdateHall() {
  return useCrudMutation({
    mutationFn: ({ id, ...data }: Hall) =>
      ApiService.apiV1InfrastructureHallsUpdate(id, data as Hall),
    description: "Hall updated successfully",
    invalidateQueries: ["halls"],
  });
}

/**
 * Hook to delete a hall with audit trail support
 * @returns Mutation hook for deleting hall
 */
export function useDeleteHall() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InfrastructureHallsDestroy(id),
    description: "Hall deleted",
    invalidateQueries: ["halls"],
    injectAuditReason: (vars, reason) => ({
      ...vars,
      change_reason: reason,
    }),
  });
}

// ===== CONTAINER TYPE CRUD HOOKS =====

/**
 * Hook to fetch all container types with optional filtering
 * @param filters - Optional filter parameters
 * @returns Query result with container types list
 */
export function useContainerTypes(filters?: { category?: 'TANK' | 'PEN' | 'TRAY' | 'OTHER' }) {
  return useQuery({
    queryKey: ["container-types", filters],
    queryFn: () =>
      ApiService.apiV1InfrastructureContainerTypesList(
        filters?.category,
        undefined, // name
        undefined, // ordering
        undefined  // page
      ),
  });
}

/**
 * Hook to fetch a single container type by ID
 * @param id - The container type ID to fetch
 * @returns Query result with container type data
 */
export function useContainerType(id: number | undefined) {
  return useQuery({
    queryKey: ["container-type", id],
    queryFn: () => {
      if (!id) throw new Error("Container type ID is required");
      return ApiService.apiV1InfrastructureContainerTypesRetrieve(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new container type
 * @returns Mutation hook for creating container type
 */
export function useCreateContainerType() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureContainerTypesCreate,
    description: "Container type created successfully",
    invalidateQueries: ["container-types"],
  });
}

/**
 * Hook to update an existing container type
 * @returns Mutation hook for updating container type
 */
export function useUpdateContainerType() {
  return useCrudMutation({
    mutationFn: ({ id, ...data }: any) =>
      ApiService.apiV1InfrastructureContainerTypesUpdate(id, data),
    description: "Container type updated successfully",
    invalidateQueries: ["container-types"],
  });
}

/**
 * Hook to delete a container type with audit trail support
 * @returns Mutation hook for deleting container type
 */
export function useDeleteContainerType() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InfrastructureContainerTypesDestroy(id),
    description: "Container type deleted",
    invalidateQueries: ["container-types"],
    injectAuditReason: (vars, reason) => ({
      ...vars,
      change_reason: reason,
    }),
  });
}

// ===== CONTAINER CRUD HOOKS =====

/**
 * Hook to fetch all containers with optional filtering
 * @param filters - Optional filter parameters
 * @returns Query result with containers list
 */
export function useContainers(filters?: { 
  hall?: number; 
  area?: number; 
  containerType?: number;
  container_type__category?: 'TANK' | 'PEN' | 'TRAY' | 'OTHER';
  active?: boolean;
  exclude_ids?: number[];
}) {
  return useQuery({
    queryKey: ["containers", filters],
    queryFn: async () => {
      const response = await ApiService.apiV1InfrastructureContainersList(
        filters?.active,
        filters?.area,
        undefined, // areaIn
        filters?.containerType,
        filters?.hall,
        undefined, // hallIn
        undefined, // name
        undefined, // ordering
        undefined, // page
        undefined  // search
      );
      
      let filteredResults = response.results || [];
      
      // Client-side filtering for category (filter by container_type_name)
      if (filters?.container_type__category && filteredResults) {
        // For TRAY category, filter by name containing "Tray" or "Egg"
        if (filters.container_type__category === 'TRAY') {
          filteredResults = filteredResults.filter(
            c => c.container_type_name?.toLowerCase().includes('tray') || 
                 c.container_type_name?.toLowerCase().includes('egg')
          );
        }
        // Could add other category filters here if needed
      }
      
      // Client-side filtering for excluded IDs
      if (filters?.exclude_ids?.length && filteredResults) {
        filteredResults = filteredResults.filter(
          c => !filters.exclude_ids?.includes(c.id)
        );
      }
      
      return {
        ...response,
        results: filteredResults,
      };
    },
    enabled: !!filters?.hall || !!filters?.area,
  });
}

/**
 * Hook to fetch a single container by ID
 * @param id - The container ID to fetch
 * @returns Query result with container data
 */
export function useContainer(id: number | undefined) {
  return useQuery({
    queryKey: ["container", id],
    queryFn: () => {
      if (!id) throw new Error("Container ID is required");
      return ApiService.apiV1InfrastructureContainersRetrieve(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new container
 * @returns Mutation hook for creating container
 */
export function useCreateContainer() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureContainersCreate,
    description: "Container created successfully",
    invalidateQueries: ["containers"],
  });
}

/**
 * Hook to update an existing container
 * @returns Mutation hook for updating container
 */
export function useUpdateContainer() {
  return useCrudMutation({
    mutationFn: ({ id, ...data }: any) =>
      ApiService.apiV1InfrastructureContainersUpdate(id, data),
    description: "Container updated successfully",
    invalidateQueries: ["containers"],
  });
}

/**
 * Hook to delete a container with audit trail support
 * @returns Mutation hook for deleting container
 */
export function useDeleteContainer() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InfrastructureContainersDestroy(id),
    description: "Container deleted",
    invalidateQueries: ["containers"],
    injectAuditReason: (vars, reason) => ({
      ...vars,
      change_reason: reason,
    }),
  });
}

// ===== SENSOR CRUD HOOKS =====

/**
 * Hook to fetch all sensors with optional filtering
 * @param filters - Optional filter parameters
 * @returns Query result with sensors list
 */
export function useSensors(filters?: { container?: number; active?: boolean }) {
  return useQuery({
    queryKey: ["sensors", filters],
    queryFn: () =>
      ApiService.apiV1InfrastructureSensorsList(
        filters?.active,
        filters?.container,
        undefined, // ordering
        undefined // page
      ),
  });
}

/**
 * Hook to fetch a single sensor by ID
 * @param id - The sensor ID to fetch
 * @returns Query result with sensor data
 */
export function useSensor(id: number | undefined) {
  return useQuery({
    queryKey: ["sensor", id],
    queryFn: () => {
      if (!id) throw new Error("Sensor ID is required");
      return ApiService.apiV1InfrastructureSensorsRetrieve(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new sensor
 * @returns Mutation hook for creating sensor
 */
export function useCreateSensor() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureSensorsCreate,
    description: "Sensor created successfully",
    invalidateQueries: ["sensors"],
  });
}

/**
 * Hook to update an existing sensor
 * @returns Mutation hook for updating sensor
 */
export function useUpdateSensor() {
  return useCrudMutation({
    mutationFn: ({ id, ...data }: any) =>
      ApiService.apiV1InfrastructureSensorsUpdate(id, data),
    description: "Sensor updated successfully",
    invalidateQueries: ["sensors"],
  });
}

/**
 * Hook to delete a sensor with audit trail support
 * @returns Mutation hook for deleting sensor
 */
export function useDeleteSensor() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InfrastructureSensorsDestroy(id),
    description: "Sensor deleted",
    invalidateQueries: ["sensors"],
    injectAuditReason: (vars, reason) => ({
      ...vars,
      change_reason: reason,
    }),
  });
}

// ===== FEED CONTAINER CRUD HOOKS =====

/**
 * Hook to fetch all feed containers with optional filtering
 * @param filters - Optional filter parameters
 * @returns Query result with feed containers list
 */
export function useFeedContainers(filters?: { hall?: number; active?: boolean }) {
  return useQuery({
    queryKey: ["feed-containers", filters],
    queryFn: () =>
      ApiService.apiV1InfrastructureFeedContainersList(
        filters?.active,
        filters?.hall,
        undefined, // ordering
        undefined // page
      ),
  });
}

/**
 * Hook to fetch a single feed container by ID
 * @param id - The feed container ID to fetch
 * @returns Query result with feed container data
 */
export function useFeedContainer(id: number | undefined) {
  return useQuery({
    queryKey: ["feed-container", id],
    queryFn: () => {
      if (!id) throw new Error("Feed container ID is required");
      return ApiService.apiV1InfrastructureFeedContainersRetrieve(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new feed container
 * @returns Mutation hook for creating feed container
 */
export function useCreateFeedContainer() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureFeedContainersCreate,
    description: "Feed container created successfully",
    invalidateQueries: ["feed-containers"],
  });
}

/**
 * Hook to update an existing feed container
 * @returns Mutation hook for updating feed container
 */
export function useUpdateFeedContainer() {
  return useCrudMutation({
    mutationFn: ({ id, ...data }: any) =>
      ApiService.apiV1InfrastructureFeedContainersUpdate(id, data),
    description: "Feed container updated successfully",
    invalidateQueries: ["feed-containers"],
  });
}

/**
 * Hook to delete a feed container with audit trail support
 * @returns Mutation hook for deleting feed container
 */
export function useDeleteFeedContainer() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InfrastructureFeedContainersDestroy(id),
    description: "Feed container deleted",
    invalidateQueries: ["feed-containers"],
    injectAuditReason: (vars, reason) => ({
      ...vars,
      change_reason: reason,
    }),
  });
}

// ===== AREA CRUD HOOKS =====

/**
 * Hook to fetch all areas with optional filtering
 * @param filters - Optional filter parameters
 * @returns Query result with areas list
 */
export function useAreas(filters?: { geography?: number; active?: boolean }) {
  return useQuery({
    queryKey: ["areas", filters],
    queryFn: () =>
      ApiService.apiV1InfrastructureAreasList(
        filters?.active,
        filters?.geography,
        undefined, // ordering
        undefined // page
      ),
  });
}

/**
 * Hook to fetch a single area by ID
 * @param id - The area ID to fetch
 * @returns Query result with area data
 */
export function useArea(id: number | undefined) {
  return useQuery({
    queryKey: ["area", id],
    queryFn: () => {
      if (!id) throw new Error("Area ID is required");
      return ApiService.apiV1InfrastructureAreasRetrieve(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new area
 * @returns Mutation hook for creating area
 */
export function useCreateArea() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1InfrastructureAreasCreate,
    description: "Area created successfully",
    invalidateQueries: ["areas"],
  });
}

/**
 * Hook to update an existing area
 * @returns Mutation hook for updating area
 */
export function useUpdateArea() {
  return useCrudMutation({
    mutationFn: ({ id, ...data }: Area) =>
      ApiService.apiV1InfrastructureAreasUpdate(id, data as Area),
    description: "Area updated successfully",
    invalidateQueries: ["areas"],
  });
}

/**
 * Hook to delete an area with audit trail support
 * @returns Mutation hook for deleting area
 */
export function useDeleteArea() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InfrastructureAreasDestroy(id),
    description: "Area deleted",
    invalidateQueries: ["areas"],
    injectAuditReason: (vars, reason) => ({
      ...vars,
      change_reason: reason,
    }),
  });
}

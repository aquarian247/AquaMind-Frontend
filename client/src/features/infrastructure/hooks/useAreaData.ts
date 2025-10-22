/**
 * useAreaData Hook
 * 
 * Central data-fetching hook for Area Detail page.
 * Integrates server-side aggregation via useAreaSummary for KPIs.
 * 
 * @module features/infrastructure/hooks/useAreaData
 */

import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import { useAreaSummary, type AreaSummaryData } from "@/features/infrastructure/api";
import { AuthService, authenticatedFetch } from "@/services/auth.service";
import { apiConfig } from "@/config/api.config";

/**
 * Container/Ring data structure
 */
export interface Ring {
  id: number;
  name: string;
  areaId: number;
  areaName: string;
  status: string;
  biomass: number;
  capacity: number;
  fishCount: number;
  averageWeight: number;
  waterDepth: number;
  netCondition: string;
  lastInspection: string;
  coordinates: { lat: number; lng: number };
  environmentalStatus: string;
}

/**
 * Area detail structure (client-side)
 */
export interface AreaDetail {
  id: number;
  name: string;
  geography: string;
  type: string;
  rings: number;
  coordinates: { lat: number; lng: number };
  status: string;
  waterDepth: number;
  lastInspection: string;
  capacity: number;
}

/**
 * Environmental data structure
 */
export interface EnvironmentalData {
  waterTemperature: number | null;
  oxygenLevel: number | null;
  salinity: number | null;
  currentSpeed: number | null;
  hasData: boolean;
}

/**
 * Hook return value
 */
export interface UseAreaDataReturn {
  area: AreaDetail | undefined;
  areaSummary: AreaSummaryData | undefined;
  rings: Ring[];
  environmentalData: EnvironmentalData | undefined;
  isLoading: boolean;
  isAreaSummaryLoading: boolean;
  isLoadingRings: boolean;
  error: Error | null;
  areaSummaryError: Error | null;
}

/**
 * Fetch and aggregate all area-related data
 * 
 * Uses server-side aggregation for KPIs (biomass, population, etc.)
 * and combines with detail data for comprehensive area view.
 * 
 * @param areaId - Area ID to fetch data for
 * @returns Aggregated area data with loading/error states
 * 
 * @example
 * ```typescript
 * const { area, areaSummary, rings, isLoading } = useAreaData(123);
 * 
 * if (isLoading) return <LoadingSpinner />;
 * 
 * // areaSummary contains server-side aggregated KPIs
 * const biomass = areaSummary?.active_biomass_kg;
 * ```
 */
export function useAreaData(areaId: number): UseAreaDataReturn {
  // 1. Fetch area details
  const {
    data: areaRaw,
    isLoading: isLoadingArea,
    error: areaError,
  } = useQuery({
    queryKey: ["area", areaId],
    queryFn: async () => {
      const raw = await ApiService.apiV1InfrastructureAreasRetrieve(areaId);
      return {
        ...raw,
        geography: (raw as any).geography_name ?? (raw as any).geography ?? "Unknown",
        type: (raw as any).area_type_name ?? (raw as any).type ?? "Sea",
        rings: 0, // Will be updated from rings count or summary
        coordinates: {
          lat: parseFloat((raw as any).latitude) || 0,
          lng: parseFloat((raw as any).longitude) || 0,
        },
        status: (raw as any).active ? "active" : "inactive",
        waterDepth: 0, // Default, can be updated if API provides
        lastInspection: new Date().toISOString(), // Default
        capacity: 0, // Default, can be updated if API provides
      } as AreaDetail;
    },
  });

  // 2. Fetch server-side aggregated KPIs (primary data source)
  const {
    data: areaSummary,
    isPending: isAreaSummaryLoading,
    error: areaSummaryError,
  } = useAreaSummary(areaId);

  // 3. Fetch containers/rings for detailed view
  const { data: ringsData, isLoading: isLoadingRings } = useQuery({
    queryKey: ["area", areaId, "rings"],
    queryFn: async () => {
      try {
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          console.warn("No auth token found for area rings data");
          return { results: [] };
        }

        // Fetch containers for this area
        const containersResponse = await authenticatedFetch(
          `${apiConfig.baseUrl}${apiConfig.endpoints.containers}?area=${areaId}&page_size=100`
        );

        const containersData = await containersResponse.json();
        const containers = containersData.results || [];

        if (containers.length === 0) {
          return { results: [] };
        }

        // Fetch active batch assignments for these containers
        const containerIds = containers.map((c: any) => c.id).join(",");
        const assignmentsResponse = await authenticatedFetch(
          `${apiConfig.baseUrl}/api/v1/batch/container-assignments/?container__in=${containerIds}&is_active=true&page_size=100`
        );

        const assignmentsData = await assignmentsResponse.json();
        const assignments = assignmentsData.results || [];

        // Create a map of container assignments by container_id
        // Sum up metrics if multiple batches in same container
        const containerMetrics: Record<number, { 
          biomass: number; 
          fishCount: number; 
          totalWeightG: number; 
          assignmentCount: number;
        }> = {};

        assignments.forEach((assignment: any) => {
          // Container can be nested object {id, name} or just id
          const containerId = typeof assignment.container === 'object' 
            ? assignment.container.id 
            : assignment.container;
          
          if (!containerMetrics[containerId]) {
            containerMetrics[containerId] = {
              biomass: 0,
              fishCount: 0,
              totalWeightG: 0,
              assignmentCount: 0,
            };
          }
          
          // Parse string decimals to numbers
          const biomassKg = parseFloat(assignment.biomass_kg) || 0;
          const populationCount = assignment.population_count || 0;
          const avgWeightG = parseFloat(assignment.avg_weight_g) || 0;
          
          containerMetrics[containerId].biomass += biomassKg;
          containerMetrics[containerId].fishCount += populationCount;
          containerMetrics[containerId].totalWeightG += populationCount * avgWeightG;
          containerMetrics[containerId].assignmentCount += 1;
        });

        // Transform containers to ring format with real assignment data
        const rings: Ring[] = containers.map((container: any) => {
          const metrics = containerMetrics[container.id] || {
            biomass: 0,
            fishCount: 0,
            totalWeightG: 0,
            assignmentCount: 0,
          };

          // Calculate weighted average weight
          const averageWeightG = metrics.fishCount > 0 
            ? metrics.totalWeightG / metrics.fishCount 
            : 0;
          const averageWeightKg = averageWeightG / 1000;

          // Convert biomass from kg to tonnes for consistency
          const biomassT = metrics.biomass / 1000;

          return {
            id: container.id,
            name: container.name || `Ring ${container.id}`,
            areaId: container.area,
            areaName: container.area_name || "Unknown Area",
            status: container.active ? "active" : "inactive",
            biomass: biomassT, // Now in tonnes from real data
            capacity: parseFloat(container.max_biomass_kg) / 1000 || 50, // Use real capacity
            fishCount: metrics.fishCount, // Real fish count from assignments
            averageWeight: averageWeightKg, // Real average weight in kg
            waterDepth: container.water_depth || 20,
            netCondition: "good", // Default (could be enhanced with inspection data)
            lastInspection: container.updated_at || new Date().toISOString(),
            coordinates: {
              lat: parseFloat(container.latitude) || 0,
              lng: parseFloat(container.longitude) || 0,
            },
            environmentalStatus: "optimal", // Default (could be enhanced)
          };
        });

        return { results: rings };
      } catch (error) {
        console.warn("Failed to fetch area rings data:", error);
        return { results: [] };
      }
    },
  });

  // 4. Fetch environmental data - aggregate stats across all containers in area
  const { data: environmentalData } = useQuery({
    queryKey: ["area", areaId, "environmental"],
    queryFn: async () => {
      try {
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          console.warn("No auth token found for environmental data");
          return {
            waterTemperature: null,
            oxygenLevel: null,
            salinity: null,
            currentSpeed: null,
            hasData: false,
          };
        }

        // If we don't have rings data yet, return no data
        if (!ringsData?.results || ringsData.results.length === 0) {
          return {
            waterTemperature: null,
            oxygenLevel: null,
            salinity: null,
            currentSpeed: null,
            hasData: false,
          };
        }

        // Fetch stats for all containers in this area and aggregate
        const containerIds = ringsData.results.slice(0, 20).map((r: any) => r.id); // Limit to first 20 for performance
        const statsPromises = containerIds.map((containerId: number) =>
          authenticatedFetch(`${apiConfig.baseUrl}/api/v1/environmental/readings/stats/?container=${containerId}`)
            .then(res => res.json())
            .catch(() => [])
        );

        const allStats = await Promise.all(statsPromises);
        
        // Aggregate stats across containers by parameter name
        const parameterAverages: Record<string, number[]> = {};
        
        allStats.forEach((containerStats) => {
          if (Array.isArray(containerStats)) {
            containerStats.forEach((stat: any) => {
              const paramName = stat.parameter__name;
              if (!parameterAverages[paramName]) {
                parameterAverages[paramName] = [];
              }
              parameterAverages[paramName].push(parseFloat(stat.avg_value));
            });
          }
        });

        // Calculate area-wide averages
        const calculateAvg = (values: number[]) => 
          values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;

        const temperature = calculateAvg(parameterAverages['Temperature'] || []);
        const oxygen = calculateAvg(parameterAverages['Dissolved Oxygen'] || []);
        const salinity = calculateAvg(parameterAverages['Salinity'] || []);

        const hasData = temperature !== null || oxygen !== null || salinity !== null;

        return {
          waterTemperature: temperature,
          oxygenLevel: oxygen,
          salinity: salinity,
          currentSpeed: null, // No sensor/data for current speed
          hasData,
        };
      } catch (error) {
        console.warn("Failed to fetch environmental data:", error);
        return {
          waterTemperature: null,
          oxygenLevel: null,
          salinity: null,
          currentSpeed: null,
          hasData: false,
        };
      }
    },
    enabled: !!ringsData?.results && ringsData.results.length > 0,
  });

  // Aggregate loading states
  const isLoading = isLoadingArea || isAreaSummaryLoading;
  const error = (areaError || areaSummaryError) as Error | null;

  return {
    area: areaRaw,
    areaSummary,
    rings: ringsData?.results || [],
    environmentalData,
    isLoading,
    isAreaSummaryLoading,
    isLoadingRings,
    error,
    areaSummaryError: areaSummaryError as Error | null,
  };
}


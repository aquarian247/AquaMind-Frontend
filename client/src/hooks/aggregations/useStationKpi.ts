/**
 * @deprecated This hook has a pagination bug and is NOT used in the application.
 * 
 * BUG: Fetches only first page (20 records) of containers and assignments.
 * Client-side aggregation on incomplete data will give wrong results.
 * 
 * USE INSTEAD:
 * - Server-side aggregation: `/api/v1/infrastructure/freshwater-stations/{id}/summary/`
 * - Returns: hall_count, tank_count, active_biomass_kg, capacity_utilization_percent
 * 
 * @see AGGREGATION_ENDPOINTS_CATALOG.md for available endpoints
 * @see PAGINATION_STRATEGY.md for pagination guidelines
 */
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated/services/ApiService';

/** @deprecated Use /api/v1/infrastructure/freshwater-stations/{id}/summary/ endpoint instead */
export const useStationKpi = (stationId: number) => {
  return useQuery({
    queryKey: ['station-kpi', stationId],
    queryFn: async () => {
      // Fetch all halls for this station
      const hallsResponse = await ApiService.apiV1InfrastructureHallsList({ freshwater_station: stationId } as any);
      const halls = hallsResponse.results || [];
      const hallIds = new Set(halls.map(hall => hall.id));
      
      // Fetch all containers
      const containersResponse = await ApiService.apiV1InfrastructureContainersList();
      const containers = containersResponse.results || [];
      
      // Filter containers to only those in halls belonging to this station
      const stationContainers = containers.filter(container => 
        container.hall && hallIds.has(container.hall)
      );
      const containerIds = new Set(stationContainers.map(container => container.id));
      
      // Fetch all active assignments
      const assignmentsResponse = await ApiService.apiV1BatchContainerAssignmentsList(
        undefined, undefined, undefined, undefined
      );
      const assignments = assignmentsResponse.results || [];
      
      // Filter assignments to only those for containers in this station
      const stationAssignments = assignments.filter(assignment => 
        containerIds.has(assignment.container_id)
      );
      
      // Calculate aggregated metrics
      const totalBiomassKg = stationAssignments.reduce(
        (sum, assignment) => sum + Number(assignment.biomass_kg || 0),
        0
      );
      
      const populationCount = stationAssignments.reduce(
        (sum, assignment) => sum + Number(assignment.population_count || 0),
        0
      );
      
      const averageWeightKg = populationCount > 0 ? totalBiomassKg / populationCount : 0;
      
      return {
        totalBiomassKg,
        averageWeightKg,
        containerCount: stationContainers.length,
        populationCount
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

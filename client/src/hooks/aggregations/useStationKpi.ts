import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated/services/ApiService';

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
        undefined, undefined, undefined, true
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

import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated/services/ApiService';

export const useAreaKpi = (areaId: number) => {
  return useQuery({
    queryKey: ['area-kpi', areaId],
    queryFn: async () => {
      // Fetch all containers for this area
      const containersResponse = await ApiService.apiV1InfrastructureContainersList({ area: areaId } as any);
      const containers = containersResponse.results || [];
      const containerIds = new Set(containers.map(container => container.id));
      
      // Fetch all active assignments
      const assignmentsResponse = await ApiService.apiV1BatchContainerAssignmentsList(
        undefined, undefined, undefined, true
      );
      const assignments = assignmentsResponse.results || [];
      
      // Filter assignments to only those for containers in this area
      const areaAssignments = assignments.filter(assignment => 
        containerIds.has(assignment.container_id)
      );
      
      // Calculate aggregated metrics
      const totalBiomassKg = areaAssignments.reduce(
        (sum, assignment) => sum + Number(assignment.biomass_kg || 0),
        0
      );
      
      const populationCount = areaAssignments.reduce(
        (sum, assignment) => sum + Number(assignment.population_count || 0),
        0
      );
      
      const averageWeightKg = populationCount > 0 ? totalBiomassKg / populationCount : 0;
      
      return {
        totalBiomassKg,
        averageWeightKg,
        containerCount: containers.length,
        populationCount
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

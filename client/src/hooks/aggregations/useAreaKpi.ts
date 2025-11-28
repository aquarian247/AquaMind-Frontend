/**
 * @deprecated This hook has a pagination bug and is NOT used in the application.
 * 
 * BUG: Fetches only first page of assignments (page_size=500), but there may be more.
 * Client-side aggregation on incomplete data will give wrong results.
 * 
 * USE INSTEAD:
 * - Server-side aggregation: `/api/v1/infrastructure/areas/{id}/summary/`
 * - Returns: container_count, active_biomass_kg, population_count, avg_weight_kg
 * 
 * @see AGGREGATION_ENDPOINTS_CATALOG.md for available endpoints
 * @see PAGINATION_STRATEGY.md for pagination guidelines
 */
import { useQuery } from '@tanstack/react-query';
import { AuthService, authenticatedFetch } from '@/services/auth.service';
import { apiConfig } from '@/config/api.config';

/** @deprecated Use /api/v1/infrastructure/areas/{id}/summary/ endpoint instead */
export const useAreaKpi = (areaId: number) => {
  return useQuery({
    queryKey: ['area-kpi', areaId],
    queryFn: async () => {
      try {
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          console.warn("No auth token found for area KPI data");
          return {
            totalBiomassKg: 0,
            averageWeightKg: 0,
            containerCount: 0,
            populationCount: 0,
            hasData: false
          };
        }

        // Fetch all containers for this area using AuthService
        const containersResponse = await authenticatedFetch(
          `${apiConfig.baseUrl}${apiConfig.endpoints.containers}?area=${areaId}&page_size=100`
        );

        const containersData = await containersResponse.json();
        const containers = containersData.results || [];
        const containerIds = new Set(containers.map((container: any) => container.id));

        if (containers.length === 0) {
          return {
            totalBiomassKg: 0,
            averageWeightKg: 0,
            containerCount: 0,
            populationCount: 0,
            hasData: false
          };
        }

        // Fetch all active assignments using AuthService
        const assignmentsResponse = await authenticatedFetch(
          `${apiConfig.baseUrl}${apiConfig.endpoints.containerAssignments}?page_size=500`
        );

        const assignmentsData = await assignmentsResponse.json();
        const assignments = assignmentsData.results || [];

        // Filter assignments to only those for containers in this area
        const areaAssignments = assignments.filter((assignment: any) =>
          containerIds.has(assignment.container?.id) || containerIds.has(assignment.container_id)
        );

        // Calculate aggregated metrics
        const totalBiomassKg = areaAssignments.reduce(
          (sum: number, assignment: any) => sum + parseFloat(assignment.biomass_kg || '0'),
          0
        );

        const populationCount = areaAssignments.reduce(
          (sum: number, assignment: any) => sum + parseInt(assignment.population_count || '0'),
          0
        );

        const averageWeightKg = populationCount > 0 ? totalBiomassKg / populationCount : 0;

        return {
          totalBiomassKg,
          averageWeightKg,
          containerCount: containers.length,
          populationCount,
          hasData: areaAssignments.length > 0
        };
      } catch (error) {
        console.warn("Failed to fetch area KPI data:", error);
        return {
          totalBiomassKg: 0,
          averageWeightKg: 0,
          containerCount: 0,
          populationCount: 0,
          hasData: false
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

import { useQuery } from '@tanstack/react-query';

export const useAreaKpi = (areaId: number) => {
  return useQuery({
    queryKey: ['area-kpi', areaId],
    queryFn: async () => {
      try {
        // Get auth token for authenticated requests
        const token = localStorage.getItem("auth_token");

        if (!token) {
          console.warn("No auth token found for area KPI data");
          return {
            totalBiomassKg: 0,
            averageWeightKg: 0,
            containerCount: 0,
            populationCount: 0,
            hasData: false
          };
        }

        // Fetch all containers for this area with authentication
        const containersResponse = await fetch(
          `http://localhost:8000/api/v1/infrastructure/containers/?area=${areaId}&page_size=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!containersResponse.ok) {
          if (containersResponse.status === 401) {
            console.warn("Auth token expired for containers data");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
          }
          throw new Error(`API call failed: ${containersResponse.status}`);
        }

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

        // Fetch all active assignments with authentication
        const assignmentsResponse = await fetch(
          `http://localhost:8000/api/v1/batch/container-assignments/?page_size=500`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!assignmentsResponse.ok) {
          if (assignmentsResponse.status === 401) {
            console.warn("Auth token expired for assignments data");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
          }
          throw new Error(`API call failed: ${assignmentsResponse.status}`);
        }

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

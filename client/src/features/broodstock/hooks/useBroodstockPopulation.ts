import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import type { Container } from "@/api/generated/models/Container";
import type { PaginatedContainerList } from "@/api/generated/models/PaginatedContainerList";

export function useBroodstockPopulation() {
  const containersQuery = useQuery<PaginatedContainerList>({
    queryKey: ['infrastructure', 'containers'],
    queryFn: async () => {
      return ApiService.apiV1InfrastructureContainersList();
    }
  });

  const geographiesQuery = useQuery({
    queryKey: ['infrastructure', 'geographies'],
    queryFn: async () => {
      return ApiService.apiV1InfrastructureGeographiesList();
    }
  });

  // Ensure containers.results is always an array
  const containerResults: Container[] = containersQuery.data?.results ?? [];

  return {
    containers: containerResults,
    containerCount: containersQuery.data?.count || 0,
    geographies: geographiesQuery.data?.results || [],
    isLoading: containersQuery.isLoading || geographiesQuery.isLoading
  };
}

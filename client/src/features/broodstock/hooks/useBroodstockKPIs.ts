import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { ApiService } from "@/api/generated";

export interface KPIData {
  activeBroodstockPairs: number;
  broodstockPopulation: number;
  totalProgenyCount: number;
  geneticDiversityIndex: number;
  pendingSelections: number;
  averageGeneticGain: number;
}

export function useBroodstockKPIs() {
  // API Queries for Broodstock KPIs
  const fishCountQuery = useQuery<number>({
    queryKey: ['broodstock', 'fish', 'count'],
    queryFn: async () => {
      const response = await ApiService.apiV1BroodstockFishList();
      return response.count;
    }
  });

  const breedingPairsCountQuery = useQuery<number>({
    queryKey: ['broodstock', 'breeding-pairs', 'count'],
    queryFn: async () => {
      const response = await ApiService.apiV1BroodstockBreedingPairsList();
      return response.count;
    }
  });

  const recentEggsCountQuery = useQuery<number>({
    queryKey: ['broodstock', 'egg-productions', 'recent-7d'],
    queryFn: async () => {
      let totalEggCount = 0;
      let page = 1;
      let hasMore = true;
      const sevenDaysAgo = subDays(new Date(), 7).toISOString().split('T')[0];

      while (hasMore) {
        const response = await ApiService.apiV1BroodstockEggProductionsList(
          undefined, // destinationStation
          '-production_date', // ordering
          page, // page
          undefined, // pair
          undefined, // productionDate - we'll filter manually
          undefined, // search
          undefined // sourceType
        );

        // Filter for eggs produced in the last 7 days
        const recentEggs = response.results.filter(egg => {
          return egg.production_date && egg.production_date >= sevenDaysAgo;
        });

        // If we got fewer eggs than requested or no eggs with dates older than 7 days,
        // we've reached the end
        if (recentEggs.length < response.results.length || response.next === null) {
          hasMore = false;
        }

        // Sum the egg counts
        totalEggCount += recentEggs.reduce((sum, egg) => sum + egg.egg_count, 0);
        page++;
      }

      return totalEggCount;
    }
  });

  // Derived KPIs from query results
  const kpis: KPIData = {
    activeBroodstockPairs: breedingPairsCountQuery.data || 0,
    broodstockPopulation: fishCountQuery.data || 0,
    totalProgenyCount: recentEggsCountQuery.data || 0,
    geneticDiversityIndex: 0, // Placeholder
    pendingSelections: 0, // Placeholder
    averageGeneticGain: 0 // Placeholder
  };

  // Combined loading state
  const isLoading = fishCountQuery.isLoading || breedingPairsCountQuery.isLoading || recentEggsCountQuery.isLoading;

  return {
    kpis,
    isLoading,
    // Individual query states for more granular control if needed
    fishCountQuery,
    breedingPairsCountQuery,
    recentEggsCountQuery
  };
}

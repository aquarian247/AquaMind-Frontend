/*
 * ⚠️ TEMPORARY CLIENT-SIDE AGGREGATION ⚠️
 * 
 * useBroodstockKPIs - Broodstock KPI calculation hook
 * 
 * Current Implementation:
 * - Fetches count from fish, breeding pairs, and egg production lists
 * - totalProgenyCount: Client-side pagination loop to fetch all egg production pages and sum (NOT OPTIMAL)
 * - geneticDiversityIndex, pendingSelections, averageGeneticGain: Hardcoded 0 (data not available)
 * 
 * ❌ NOT OPTIMAL: Client-side pagination aggregation
 * - Fetches all pages of egg production data sequentially
 * - Filters and sums client-side (should be done by backend)
 * - No date filtering at API level (manual filtering after fetch)
 * 
 * Production Roadmap:
 * TODO: Backend team should implement /api/v1/broodstock/summary/ endpoint with:
 * - active_breeding_pairs_count
 * - broodstock_population_count
 * - recent_egg_production_count (with date_range parameter for 7d/30d)
 * - genetic_diversity_index (calculated from genetic data)
 * - pending_selections_count (from breeding plan status)
 * - average_genetic_gain (from trait progress tracking)
 * - Geography filtering support
 * 
 * Migration Path (Once Backend Endpoint Available):
 * 1. Replace individual queries with single ApiService.apiV1BroodstockSummaryRetrieve()
 * 2. Remove client-side pagination loop
 * 3. Update component to display actual genetic metrics
 * 4. Remove hardcoded zeros
 */

import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { ApiService } from "@/api/generated";

export interface KPIData {
  activeBroodstockPairs: number;
  broodstockPopulation: number;
  totalProgenyCount: number;
  geneticDiversityIndex: number | null; // null indicates data unavailable (not calculated yet)
  pendingSelections: number | null; // null indicates data unavailable
  averageGeneticGain: number | null; // null indicates data unavailable
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
    // Genetic metrics not yet implemented - null indicates unavailable (not 0)
    geneticDiversityIndex: null, // TODO: Backend needs genetic diversity calculation
    pendingSelections: null, // TODO: Backend needs breeding plan status aggregation
    averageGeneticGain: null // TODO: Backend needs trait progress aggregation
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

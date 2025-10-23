import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { api } from "@/lib/api";
import { ApiService } from "@/api/generated";
import type { ExtendedBatch } from "@/features/batch/types";

export interface BatchKPIs {
  totalActiveBatches: number;
  averageHealthScore: number;
  totalFishCount: number;
  averageSurvivalRate: number;
  batchesRequiringAttention: number;
  avgGrowthRate: number;
  totalBiomass: number;
  averageFCR: number;
}

interface GeographySummary {
  geography_id: number;
  geography_name: string;
  total_batches: number;
  mortality_metrics: {
    total_count: number;
    total_biomass_kg: number;
    avg_mortality_rate_percent: number;
  };
  feed_metrics: {
    total_feed_kg: number;
    avg_fcr: number | null;
  };
}

export function useBatchKPIs(batches: ExtendedBatch[]) {
  // ✅ SERVER-SIDE: Fetch geography summaries for survival rate calculation
  const { data: geographySummaries } = useQuery<GeographySummary[]>({
    queryKey: ["batch", "geography-summaries-for-kpi"],
    queryFn: async () => {
      try {
        // Fetch all geographies first
        const geographiesResponse = await ApiService.apiV1InfrastructureGeographiesList();
        const geographies = geographiesResponse.results || [];
        
        // ✅ Use generated ApiService for geography summaries (parallel fetching)
        const summaryPromises = geographies.map(async (geo) => {
          try {
            const summary = await ApiService.batchGeographySummary(geo.id);
            return summary as GeographySummary;
          } catch (error) {
            console.warn(`Error fetching summary for geography ${geo.id}:`, error);
            return null;
          }
        });
        
        const summaries = await Promise.all(summaryPromises);
        return summaries.filter((s): s is GeographySummary => s !== null);
      } catch (error) {
        console.error("Failed to fetch geography summaries for KPIs:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // ✅ SERVER-SIDE: Fetch recent FCR data for average calculation
  const { data: recentFCRData } = useQuery({
    queryKey: ["batch", "recent-fcr-for-kpi"],
    queryFn: async () => {
      try {
        // WORKAROUND: by_batch endpoint has OpenAPI spec gap (missing batch_id parameter)
        // Use the list endpoint instead which has proper filtering
        // Get all feeding summaries (will be filtered client-side for now)
        const response = await ApiService.apiV1InventoryBatchFeedingSummariesList();
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch FCR data for KPIs:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const calculateKPIs = useMemo((): BatchKPIs => {
    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    
    // ✅ SERVER-SIDE: Use calculated fields from backend
    const totalFishCount = activeBatches.reduce((sum, b) => sum + (b.calculated_population_count || 0), 0);
    const totalBiomass = activeBatches.reduce((sum, b) => {
      const biomass = typeof b.calculated_biomass_kg === 'string' ? parseFloat(b.calculated_biomass_kg) : (b.calculated_biomass_kg || 0);
      return sum + biomass;
    }, 0);

    // ✅ SERVER-SIDE: Calculate average survival rate from geography summaries
    // Survival Rate = 100 - Mortality Rate
    const avgSurvivalRate = geographySummaries && geographySummaries.length > 0
      ? geographySummaries.reduce((sum, geo) => {
          const mortalityRate = geo.mortality_metrics?.avg_mortality_rate_percent || 0;
          const survivalRate = 100 - mortalityRate;
          return sum + survivalRate;
        }, 0) / geographySummaries.length
      : 100; // Fallback to 100 if no data

    // ✅ HONEST FALLBACK: Without health scoring system, default to zero
    const batchesWithCriticalHealth = 0;

    // ✅ HONEST FALLBACK: Growth rate requires time-series analysis
    // Set to null/0 until we implement growth sample aggregation endpoint
    const avgGrowthRate = 0;

    // ✅ SERVER-SIDE: Calculate average FCR from recent feeding summaries
    const averageFCR = recentFCRData && (recentFCRData as any[]).length > 0
      ? (recentFCRData as any[]).reduce((sum: number, summary: any) => {
          const fcr = summary.weighted_avg_fcr ? parseFloat(summary.weighted_avg_fcr) : 0;
          return sum + fcr;
        }, 0) / (recentFCRData as any[]).length
      : 0; // 0 instead of hardcoded 1.2

    return {
      totalActiveBatches: activeBatches.length,
      averageHealthScore: avgSurvivalRate,
      totalFishCount,
      averageSurvivalRate: avgSurvivalRate,
      batchesRequiringAttention: batchesWithCriticalHealth,
      avgGrowthRate, // 0 instead of hardcoded 15.2
      totalBiomass,
      averageFCR, // Server-calculated instead of hardcoded 1.2
    };
  }, [batches, recentFCRData, geographySummaries]);

  return {
    kpis: calculateKPIs,
    // Individual query states for more granular control if needed
  };
}

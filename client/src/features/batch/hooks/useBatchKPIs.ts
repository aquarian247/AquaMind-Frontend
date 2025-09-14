import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { api } from "@/lib/api";
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

export function useBatchKPIs(batches: ExtendedBatch[]) {
  const calculateKPIs = useMemo((): BatchKPIs => {
    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    const totalFishCount = activeBatches.reduce((sum, b) => sum + (b.calculated_population_count || 0), 0);
    const totalBiomass = activeBatches.reduce((sum, b) => {
      const biomass = typeof b.calculated_biomass_kg === 'string' ? parseFloat(b.calculated_biomass_kg) : (b.calculated_biomass_kg || 0);
      return sum + biomass;
    }, 0);

    const avgSurvivalRate = activeBatches.length > 0 ?
      // We don't have initialCount from the API, so assume 100 % survival for KPI placeholder
      activeBatches.reduce((sum) => {
        const rate = 100;
        return sum + rate;
      }, 0) / activeBatches.length : 0;

    // Without initial population we can't accurately flag "critical" survival,
    // so default to zero batches requiring attention.
    const batchesWithCriticalHealth = 0;

    return {
      totalActiveBatches: activeBatches.length,
      averageHealthScore: avgSurvivalRate,
      totalFishCount,
      averageSurvivalRate: avgSurvivalRate,
      batchesRequiringAttention: batchesWithCriticalHealth,
      avgGrowthRate: 15.2, // Mock data
      totalBiomass,
      averageFCR: 1.2, // Mock data
    };
  }, [batches]);

  return {
    kpis: calculateKPIs,
    // Individual query states for more granular control if needed
  };
}

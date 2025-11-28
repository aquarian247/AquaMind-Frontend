/**
 * Scenario Data Hook
 * 
 * TASK 7: Server-Side Aggregation Implementation
 * - Attempts to use backend summary_stats endpoint for KPIs (preferred)
 * - Falls back to client-side calculation if endpoint unavailable
 * - Uses honest fallbacks (0 or N/A) when data is missing
 * 
 * API STATUS:
 * - summary_stats endpoint exists but returns Scenario type (not summary stats)
 * - This is likely a backend spec issue where summary fields are added to Scenario
 * - Client-side fallback ensures robustness for UAT
 * 
 * NOTE: Backend filters scenarios by created_by user by default. We pass all=true
 * to see all scenarios (for shared visibility). If user-only scenarios are needed,
 * this can be made configurable via a prop.
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ApiService } from "@/api/generated";
import { useScenarioSummaryStats } from "../api/api";
import { calculateScenarioKPIs } from "../utils/kpiCalculations";
import type { ScenarioPlanningKPIs } from "../utils/kpiCalculations";

// Re-export interface for backward compatibility
export type { ScenarioPlanningKPIs };

export function useScenarioData(searchTerm: string, statusFilter: string) {
  // Fetch Temperature Profiles
  const temperatureProfilesQuery = useQuery({
    queryKey: ["scenario:temperatureProfiles"],
    queryFn: () => ApiService.apiV1ScenarioTemperatureProfilesList()
  });

  // Fetch TGC Models
  const tgcModelsQuery = useQuery({
    queryKey: ["scenario:tgcModels"],
    queryFn: () => ApiService.apiV1ScenarioTgcModelsList()
  });

  // Fetch FCR Models
  const fcrModelsQuery = useQuery({
    queryKey: ["scenario:fcrModels"],
    queryFn: () => ApiService.apiV1ScenarioFcrModelsList()
  });

  // Fetch Mortality Models
  const mortalityModelsQuery = useQuery({
    queryKey: ["scenario:mortalityModels"],
    queryFn: () => ApiService.apiV1ScenarioMortalityModelsList()
  });

  // Fetch Biological Constraints
  const biologicalConstraintsQuery = useQuery({
    queryKey: ["scenario:biologicalConstraints"],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1ScenarioBiologicalConstraintsList();
        return response;
      } catch (error) {
        console.error("Failed to fetch biological constraints:", error);
        throw new Error("Failed to fetch biological constraints");
      }
    }
  });

  // Fetch Scenarios with filtering
  // NOTE: Backend filters by created_by user by default, so we pass all=true
  // to see all scenarios for shared visibility.
  const scenariosQuery = useQuery({
    queryKey: ["scenario:scenarios", { search: searchTerm, status: statusFilter }],
    queryFn: () => ApiService.apiV1ScenarioScenariosList(
      true,  // all=true - show all scenarios, not just user's own
      undefined,  // createdBy
      undefined,  // ordering
      undefined,  // page
      searchTerm || undefined,  // search
      statusFilter !== 'all' ? statusFilter : undefined,  // startDate
      undefined  // tgcModelLocation
    )
  });

  // TASK 7: Attempt to fetch server-side summary stats
  // Backend endpoint exists but returns Scenario type - may contain summary fields
  const summaryStatsQuery = useScenarioSummaryStats();

  // TASK 3: Compute KPIs using extracted helper (CCN reduction from 18 to ≤12)
  // Delegates to pure function for testability and maintainability
  // Pass totalCount from paginated API response for accurate scenario count
  const computedKpis: ScenarioPlanningKPIs = useMemo(
    () => calculateScenarioKPIs(
      summaryStatsQuery.data,
      scenariosQuery.data?.results ?? [],
      scenariosQuery.data?.count  // Total count from pagination
    ),
    [summaryStatsQuery.data, scenariosQuery.data]
  );

  return {
    temperatureProfiles: temperatureProfilesQuery.data,
    tgcModels: tgcModelsQuery.data,
    fcrModels: fcrModelsQuery.data,
    mortalityModels: mortalityModelsQuery.data,
    biologicalConstraints: biologicalConstraintsQuery.data,
    scenarios: scenariosQuery.data,
    kpis: computedKpis,
    isLoading: temperatureProfilesQuery.isLoading || tgcModelsQuery.isLoading ||
               fcrModelsQuery.isLoading || mortalityModelsQuery.isLoading ||
               biologicalConstraintsQuery.isLoading || scenariosQuery.isLoading ||
               summaryStatsQuery.isLoading,
    scenariosLoading: scenariosQuery.isLoading,
  };
}

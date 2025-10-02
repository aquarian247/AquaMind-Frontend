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
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ApiService } from "@/api/generated";
import { useScenarioSummaryStats } from "../api/api";

export interface ScenarioPlanningKPIs {
  totalActiveScenarios: number;
  scenariosInProgress: number;
  completedProjections: number;
  averageProjectionDuration: number;
}

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
  const scenariosQuery = useQuery({
    queryKey: ["scenario:scenarios", { search: searchTerm, status: statusFilter }],
    queryFn: () => ApiService.apiV1ScenarioScenariosList(
      undefined,
      undefined,
      undefined,
      searchTerm || undefined,
      statusFilter !== 'all' ? statusFilter : undefined
    )
  });

  // TASK 7: Attempt to fetch server-side summary stats
  // Backend endpoint exists but returns Scenario type - may contain summary fields
  const summaryStatsQuery = useScenarioSummaryStats();

  // Compute KPIs: Try server-side first, fall back to client-side
  const computedKpis: ScenarioPlanningKPIs = useMemo(() => {
    // Try to extract summary stats from backend response
    const summaryData = summaryStatsQuery.data as any;
    
    // Check if backend response has summary fields (backend may add them to Scenario object)
    if (summaryData && typeof summaryData === 'object') {
      const hasSummaryFields = 
        'totalActiveScenarios' in summaryData ||
        'scenariosInProgress' in summaryData ||
        'completedProjections' in summaryData ||
        'averageProjectionDuration' in summaryData;
      
      if (hasSummaryFields) {
        // Use backend-provided summary stats
        return {
          totalActiveScenarios: summaryData.totalActiveScenarios ?? 0,
          scenariosInProgress: summaryData.scenariosInProgress ?? 0,
          completedProjections: summaryData.completedProjections ?? 0,
          averageProjectionDuration: summaryData.averageProjectionDuration ?? 0,
        };
      }
    }

    // Fallback: Client-side calculation from scenarios list
    // This maintains existing behavior while we wait for backend API fix
    const list = scenariosQuery.data?.results ?? [];
    if (list.length === 0) {
      return {
        totalActiveScenarios: 0,
        scenariosInProgress: 0,
        completedProjections: 0,
        averageProjectionDuration: 0,
      };
    }
    
    const totalActiveScenarios = list.length;
    const scenariosInProgress = list.filter((s: any) => s.status === "running").length;
    const completedProjections = list.filter((s: any) => s.status === "completed").length;
    const averageProjectionDuration =
      list.reduce((sum: number, s: any) => sum + (s.duration_days ?? 0), 0) / list.length;

    return {
      totalActiveScenarios,
      scenariosInProgress,
      completedProjections,
      averageProjectionDuration,
    };
  }, [summaryStatsQuery.data, scenariosQuery.data]);

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

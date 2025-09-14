import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ApiService } from "@/api/generated";

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

  // Derive KPI values client-side from the scenarios list
  const computedKpis: ScenarioPlanningKPIs = useMemo(() => {
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
  }, [scenariosQuery.data]);

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
               biologicalConstraintsQuery.isLoading || scenariosQuery.isLoading,
    scenariosLoading: scenariosQuery.isLoading,
  };
}

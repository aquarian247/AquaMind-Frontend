import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";

export interface Program {
  id: number;
  name: string;
  description: string;
  status: string;
  currentGeneration: number;
  targetGeneration: number;
  progress: number;
  populationSize: number;
  startDate: string;
  leadGeneticist: string;
  geneticGain: number[];
  traitWeights: Record<string, number>;
}

export function useBroodstockPrograms() {
  const programsQuery = useQuery<Program[]>({
    queryKey: ['broodstock', 'programs'],
    queryFn: async () => {
      // This would typically fetch from the API, but for now we'll use placeholder data
      // const response = await ApiService.apiV1BroodstockProgramsList();
      // return response.results || [];
      return [];
    }
  });

  const activitiesQuery = useQuery({
    queryKey: ['broodstock', 'activities'],
    queryFn: async () => {
      // Placeholder for activities data
      return { results: [] };
    }
  });

  const tasksQuery = useQuery({
    queryKey: ['broodstock', 'tasks'],
    queryFn: async () => {
      // Placeholder for tasks data
      return { results: [] };
    }
  });

  return {
    programs: programsQuery.data || null,
    programsLoading: programsQuery.isLoading,
    activities: activitiesQuery.data?.results || null,
    activitiesLoading: activitiesQuery.isLoading,
    tasks: tasksQuery.data?.results || null,
    tasksLoading: tasksQuery.isLoading
  };
}

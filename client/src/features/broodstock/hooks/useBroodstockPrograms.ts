/*
 * ⚠️ PLACEHOLDER DATA - NOT YET IMPLEMENTED ⚠️
 * 
 * useBroodstockPrograms - Breeding program management hook
 * 
 * Current Status:
 * - Returns empty arrays (no backend data available)
 * - Programs, activities, and tasks endpoints not implemented
 * 
 * Backend Requirements:
 * TODO: Backend team should implement:
 * - /api/v1/broodstock/programs/ - List breeding programs with status tracking
 * - /api/v1/broodstock/activities/ - Program activities and timeline
 * - /api/v1/broodstock/tasks/ - Task management for breeding operations
 * 
 * Expected Data Structure:
 * - Programs: breeding goals, generations, progress tracking, trait weights
 * - Activities: recent program milestones and events
 * - Tasks: upcoming and overdue breeding tasks
 * 
 * Migration Path:
 * 1. Backend implements breeding program management endpoints
 * 2. Update queryFn to use ApiService methods
 * 3. Remove placeholder empty returns
 * 4. Add proper TypeScript types from generated API
 */

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
      // Placeholder - backend endpoint not yet implemented
      // TODO: const response = await ApiService.apiV1BroodstockProgramsList();
      // TODO: return response.results || [];
      return [];
    }
  });

  const activitiesQuery = useQuery({
    queryKey: ['broodstock', 'activities'],
    queryFn: async () => {
      // Placeholder - backend endpoint not yet implemented
      return { results: [] };
    }
  });

  const tasksQuery = useQuery({
    queryKey: ['broodstock', 'tasks'],
    queryFn: async () => {
      // Placeholder - backend endpoint not yet implemented
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

/**
 * Scenario Mutations Hook
 * 
 * TASK 3: Extracted from ScenarioPlanning.tsx (lines ~115-190)
 * Centralizes all mutation logic for scenario operations.
 * 
 * @module features/scenario/hooks/useScenarioMutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

/**
 * Hook providing scenario mutation operations
 * 
 * Encapsulates delete, duplicate, and run projection mutations with:
 * - Automatic query invalidation
 * - Toast notifications
 * - Error handling
 * 
 * @returns Mutation functions and state
 * 
 * @example
 * ```typescript
 * const { deleteScenario, duplicateScenario, runProjection } = useScenarioMutations();
 * 
 * // Delete a scenario
 * deleteScenario.mutate(scenarioId);
 * 
 * // Duplicate a scenario
 * duplicateScenario.mutate({ scenarioId: 1, name: 'Copy of Scenario' });
 * 
 * // Run projection
 * runProjection.mutate(scenarioId);
 * ```
 */
export function useScenarioMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Delete scenario mutation
   * 
   * Sends DELETE request to backend and invalidates scenario queries on success.
   * Shows success/error toast notification.
   */
  const deleteScenario = useMutation({
    mutationFn: async (scenarioId: number) => {
      return apiRequest(
        "DELETE",
        `/api/v1/scenario/scenarios/${scenarioId}/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scenario:scenarios"] });
      toast({
        title: "Scenario Deleted",
        description: "The scenario has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete scenario. Please try again.",
        variant: "destructive",
      });
    },
  });

  /**
   * Duplicate scenario mutation
   * 
   * Creates a copy of an existing scenario with a new name.
   * 
   * @param scenarioId - ID of scenario to duplicate
   * @param name - Name for the duplicated scenario
   * 
   * NOTE: Currently unused in UI (disabled for UAT), but kept for future use.
   */
  const duplicateScenario = useMutation({
    mutationFn: async ({ scenarioId, name }: { scenarioId: number; name: string }) => {
      return apiRequest(
        "POST",
        `/api/v1/scenario/scenarios/${scenarioId}/duplicate/`,
        { name }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scenario:scenarios"] });
      toast({
        title: "Scenario Duplicated",
        description: "The scenario has been duplicated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to duplicate scenario. Please try again.",
        variant: "destructive",
      });
    },
  });

  /**
   * Run projection mutation
   * 
   * Triggers execution of scenario projection calculations.
   * 
   * @param scenarioId - ID of scenario to run projection for
   * 
   * NOTE: Currently unused in UI (disabled for UAT), but kept for future use.
   */
  const runProjection = useMutation({
    mutationFn: async (scenarioId: number) => {
      return apiRequest(
        "POST",
        `/api/v1/scenario/scenarios/${scenarioId}/run-projection/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scenario:scenarios"] });
      toast({
        title: "Projection Started",
        description: "The scenario projection has been started.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start projection. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    deleteScenario,
    duplicateScenario,
    runProjection,
  };
}


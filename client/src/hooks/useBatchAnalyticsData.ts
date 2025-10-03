import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated/services/ApiService";

/**
 * Custom hook to fetch all data required for batch analytics view
 * 
 * Consolidates multiple API calls into a single hook for better reusability
 * and testability. Returns all data streams with individual loading/error states.
 * 
 * @param batchId - The batch ID to fetch analytics data for
 * @param timeframe - Time period for filtering data (in days)
 * @returns Object containing all analytics data and loading/error states
 */
export function useBatchAnalyticsData(batchId: number, timeframe: string) {
  // Fetch growth samples data
  const { 
    data: growthSamplesData = [], 
    isLoading: growthLoading, 
    error: growthError 
  } = useQuery({
    queryKey: ["batch/growth-samples", batchId, timeframe],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1BatchGrowthSamplesList(
          batchId,
          undefined,
          undefined,
          undefined,
          undefined
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch growth samples:", error);
        throw new Error("Failed to fetch growth metrics");
      }
    },
  });

  // Fetch feeding summaries for FCR calculation
  const { 
    data: feedingSummaries = [], 
    isLoading: feedingLoading, 
    error: feedingError 
  } = useQuery({
    queryKey: ["batch/feeding-summaries", batchId],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1InventoryBatchFeedingSummariesList(
          batchId,
          undefined,
          undefined
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch feeding summaries:", error);
        return [];
      }
    },
  });

  // Fetch environmental readings
  const { 
    data: environmentalReadings = [], 
    isLoading: envLoading, 
    error: envError 
  } = useQuery({
    queryKey: ["environmental/readings", batchId],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1EnvironmentalReadingsList(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch environmental readings:", error);
        return [];
      }
    },
  });

  // Fetch scenarios for predictions
  const { 
    data: scenarios = [], 
    isLoading: scenarioLoading, 
    error: scenarioError 
  } = useQuery({
    queryKey: ["scenario/scenarios", batchId],
    queryFn: async () => {
      try {
        // Note: Scenarios endpoint doesn't have batch filter, so get all scenarios
        // In the future, could add batch__id filter to scenario endpoint
        const response = await ApiService.apiV1ScenarioScenariosList(
          undefined, // createdBy (not batchId!)
          undefined, // ordering
          undefined, // page
          undefined, // search
          undefined  // startDate
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
        return [];
      }
    },
  });

  // Fetch batch container assignments to get population counts
  const { 
    data: batchAssignments = [], 
    isLoading: assignmentsLoading 
  } = useQuery({
    queryKey: ["batch/container-assignments", batchId],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1BatchContainerAssignmentsList(
          undefined, // assignmentDate (not batchId!)
          undefined, // assignmentDateAfter
          undefined, // assignmentDateBefore
          batchId,   // ✅ batch parameter (4th position)
          undefined, // batchIn
          undefined, // batchNumber
          undefined  // biomassMax
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch batch assignments:", error);
        return [];
      }
    },
  });

  // Aggregate loading and error states
  const isLoading = 
    growthLoading || 
    feedingLoading || 
    envLoading || 
    scenarioLoading || 
    assignmentsLoading;

  const hasError = 
    growthError || 
    feedingError || 
    envError || 
    scenarioError;

  const hasNoData = growthSamplesData.length === 0;

  return {
    // Data
    growthSamplesData,
    feedingSummaries,
    environmentalReadings,
    scenarios,
    batchAssignments,

    // Loading states (individual)
    growthLoading,
    feedingLoading,
    envLoading,
    scenarioLoading,
    assignmentsLoading,

    // Aggregate states
    isLoading,
    hasError,
    hasNoData,

    // Error objects (for detailed error handling)
    growthError,
    feedingError,
    envError,
    scenarioError,
  };
}


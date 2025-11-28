import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated/services/ApiService";

/**
 * Custom hook to fetch all data required for batch analytics view
 * 
 * REFACTORED: Now uses server-side aggregation endpoints instead of fetching
 * large raw datasets. This significantly improves performance and reduces data transfer.
 * 
 * @param batchId - The batch ID to fetch analytics data for
 * @param timeframe - Time period for filtering data (in days) - Note: Aggregation endpoints handle time internally or return full history
 * @returns Object containing aggregated analytics data and loading/error states
 */
export function useBatchAnalyticsData(batchId: number, timeframe: string) {
  // Fetch growth analysis (Pre-aggregated growth metrics)
  const { 
    data: growthAnalysis,
    isLoading: growthLoading, 
    error: growthError 
  } = useQuery({
    queryKey: ["batch/growth-analysis", batchId],
    queryFn: async () => {
      try {
        // Use combined growth data endpoint to get actual_daily_states
        const response = await ApiService.batchCombinedGrowthData(batchId);
        return response;
      } catch (error) {
        console.error("Failed to fetch growth analysis:", error);
        throw new Error("Failed to fetch growth metrics");
      }
    },
  });

  // Fetch performance metrics (Pre-aggregated mortality, population, biomass)
  const { 
    data: performanceMetricsRaw,
    isLoading: performanceLoading,
    error: performanceError 
  } = useQuery({
    queryKey: ["batch/performance-metrics", batchId],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId);
        return response;
      } catch (error) {
        console.error("Failed to fetch performance metrics:", error);
        throw new Error("Failed to fetch performance metrics");
      }
    },
  });

  // Fetch total feeding stats (Cost, Count, Total KG)
  const { 
    data: feedingStats,
    isLoading: feedingStatsLoading,
    error: feedingStatsError 
  } = useQuery({
    queryKey: ["inventory/feeding-summary", batchId],
    queryFn: async () => {
      try {
        const [periodSummary, lifetimeSummary] = await Promise.all([
          ApiService.feedingEventsSummary(
            undefined,
            undefined,
            batchId
          ),
          ApiService.feedingEventsSummary(
            undefined,
            undefined,
            batchId,
            undefined,
            undefined,
            "invalid"
          )
        ]);

        return {
          period: periodSummary,
          lifetime: lifetimeSummary
        };
      } catch (error) {
        console.error("Failed to fetch feeding summary:", error);
        return null;
      }
    },
  });

  // Fetch LATEST batch feeding summary for FCR (weighted_avg_fcr)
  // We fetch page 1 with ordering by period_end desc to get the latest one
  const { 
    data: latestFeedingSummary,
    isLoading: latestSummaryLoading,
    error: latestSummaryError 
  } = useQuery({
    queryKey: ["inventory/batch-feeding-summaries", batchId, "latest"],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1InventoryBatchFeedingSummariesList(
          batchId,
          '-period_end', // Ordering: latest first
          1, // Page 1
        );
        return response.results?.[0] || null;
      } catch (error) {
        console.error("Failed to fetch latest feeding summary:", error);
        return null;
      }
    },
  });

  // Scenarios
  const { 
    data: scenarios = [], 
    isLoading: scenarioLoading, 
    error: scenarioError 
  } = useQuery({
    queryKey: ["scenario/scenarios", batchId],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1ScenarioScenariosList();
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
        return [];
      }
    },
    enabled: !!growthAnalysis
  });

  // Aggregate loading and error states
  const isLoading = 
    growthLoading || 
    performanceLoading || 
    feedingStatsLoading || 
    latestSummaryLoading ||
    scenarioLoading;

  const hasError = 
    growthError || 
    performanceError || 
    feedingStatsError || 
    latestSummaryError ||
    scenarioError;

  const hasNoData = !growthAnalysis && !performanceMetricsRaw;

  return {
    // Data
    growthAnalysis,
    performanceMetricsRaw,
    feedingStats,
    latestFeedingSummary, // Pass this new data
    scenarios,

    // Loading states
    growthLoading,
    performanceLoading,
    feedingStatsLoading,
    latestSummaryLoading,
    scenarioLoading,

    // Aggregate states
    isLoading,
    hasError,
    hasNoData,

    // Errors
    growthError,
    performanceError,
    feedingStatsError,
    latestSummaryError,
    scenarioError,
  };
}

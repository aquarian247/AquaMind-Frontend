import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OperationalService } from "@/api/generated/services/OperationalService";
import { ApiService } from "@/api/generated/services/ApiService";
import { api } from "@/lib/api";
import type { ConfidenceLevel, FCRSummaryData } from "@/components/batch-management/FCRSummaryCard";
import type { FCRDataPoint } from "@/components/batch-management/FCRTrendChart";
import type { FCRTrends } from "@/api/generated/models/FCRTrends";
import type { FCRDataPoint as GeneratedFCRDataPoint } from "@/api/generated/models/FCRDataPoint";

// Mock data for development when API is not available
const mockFCRData: FCRDataPoint[] = [
  {
    period_start: "2024-01-01T00:00:00Z",
    period_end: "2024-01-08T00:00:00Z",
    actual_fcr: 1.15,
    confidence: "HIGH",
    predicted_fcr: 1.12,
    deviation: 0.03,
    scenarios_used: 2,
    container_name: null,
    assignment_id: null,
    container_count: 1,
    total_containers: 1
  },
  {
    period_start: "2024-01-08T00:00:00Z",
    period_end: "2024-01-15T00:00:00Z",
    actual_fcr: 1.08,
    confidence: "VERY_HIGH",
    predicted_fcr: 1.10,
    deviation: -0.02,
    scenarios_used: 2,
    container_name: null,
    assignment_id: null,
    container_count: 1,
    total_containers: 1
  },
  {
    period_start: "2024-01-15T00:00:00Z",
    period_end: "2024-01-22T00:00:00Z",
    actual_fcr: 1.22,
    confidence: "MEDIUM",
    predicted_fcr: 1.08,
    deviation: 0.14,
    scenarios_used: 1,
    container_name: null,
    assignment_id: null,
    container_count: 1,
    total_containers: 1
  },
  {
    period_start: "2024-01-22T00:00:00Z",
    period_end: "2024-01-29T00:00:00Z",
    actual_fcr: 1.05,
    confidence: "HIGH",
    predicted_fcr: 1.09,
    deviation: -0.04,
    scenarios_used: 2,
    container_name: null,
    assignment_id: null,
    container_count: 1,
    total_containers: 1
  },
  {
    period_start: "2024-01-29T00:00:00Z",
    period_end: "2024-02-05T00:00:00Z",
    actual_fcr: 1.18,
    confidence: "HIGH",
    predicted_fcr: 1.11,
    deviation: 0.07,
    scenarios_used: 2,
    container_name: null,
    assignment_id: null,
    container_count: 1,
    total_containers: 1
  }
];

export interface FCRFilters {
  startDate?: Date;
  endDate?: Date;
  batchId?: number;
  assignmentId?: number;
  geographyId?: number;
  aggregationLevel?: 'batch' | 'assignment' | 'geography';
  includePredicted?: boolean;
}

export interface UseFCRAnalyticsOptions {
  batchId?: number;
  filters?: FCRFilters;
  enabled?: boolean;
}

export function useFCRAnalytics({ batchId, filters, enabled = true }: UseFCRAnalyticsOptions = {}) {
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Query for FCR trends data
  const {
    data: fcrTrendsData = [],
    isLoading: trendsLoading,
    error: trendsError,
    refetch: refetchTrends,
    isError: trendsIsError,
    failureCount
  } = useQuery<FCRDataPoint[]>({
    queryKey: ["fcr-trends", batchId, filters],
    queryFn: async () => {
      try {
        console.log("Fetching FCR trends for batch:", batchId);

        // Use the generated OperationalService
        const response = await OperationalService.apiV1OperationalFcrTrendsList(
          undefined, // assignmentId
          batchId,
          undefined, // endDate
          undefined, // geographyId
          true, // includePredicted
          'WEEKLY', // interval
          undefined, // ordering
          undefined, // page
          undefined, // search
          filters?.startDate?.toISOString().split('T')[0] // startDate
        );

        // Transform the response - each FCRTrends object contains a series of FCRDataPoint
        const transformedData: FCRDataPoint[] = response.results?.flatMap((fcrTrends: FCRTrends) =>
          fcrTrends.series?.map((item: GeneratedFCRDataPoint) => ({
            period_start: item.period_start,
            period_end: item.period_end,
            actual_fcr: item.actual_fcr ? parseFloat(item.actual_fcr) : null,
            confidence: (item.confidence as ConfidenceLevel) || 'LOW',
            predicted_fcr: item.predicted_fcr ? parseFloat(item.predicted_fcr) : null,
            deviation: item.deviation ? parseFloat(item.deviation) : null,
            scenarios_used: item.scenarios_used || 0,
            container_name: item.container_name || null,
            assignment_id: item.assignment_id || null,
            container_count: item.container_count || null,
            total_containers: item.total_containers || null
          })) || []
        ) || [];

        setIsUsingMockData(false);
        return transformedData;
      } catch (error) {
        console.error("Failed to fetch FCR trends:", error);
        setIsUsingMockData(true);
        // Return mock data as fallback
        return mockFCRData;
      }
    },
    enabled: enabled && !!batchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors, but not for 4xx client errors
      if (failureCount >= 3) return false;

      // Don't retry on authentication errors
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }

      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Query for batch feeding summaries (existing API)
  const {
    data: feedingSummaries = [],
    isLoading: feedingLoading,
    error: feedingError
  } = useQuery({
    queryKey: ["batch/feeding-summaries", batchId],
    queryFn: async () => {
      if (!batchId) return [];

      try {
        const response = await ApiService.apiV1InventoryBatchFeedingSummariesList(
          batchId,
          undefined, // page
          undefined  // search
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch feeding summaries:", error);
        return [];
      }
    },
    enabled: enabled && !!batchId,
  });

  // Calculate FCR summary from available data
  const fcrSummary: FCRSummaryData = {
    currentFCR: null,
    confidenceLevel: "LOW",
    trend: "stable",
    lastUpdated: new Date(),
    comparisonPeriod: "Last 30 days",
    predictedFCR: null,
    deviation: null,
    scenariosUsed: 0
  };

  // Calculate current FCR and confidence from feeding summaries
  if (feedingSummaries.length > 0) {
    const latestSummary = feedingSummaries[feedingSummaries.length - 1];
    const currentFCR = latestSummary.weighted_avg_fcr ? parseFloat(latestSummary.weighted_avg_fcr) : null;

    if (currentFCR !== null) {
      fcrSummary.currentFCR = currentFCR;

      // Calculate confidence based on data age (mock implementation)
      const daysSinceUpdate = Math.floor(
        (new Date().getTime() - new Date(latestSummary.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceUpdate <= 10) {
        fcrSummary.confidenceLevel = "VERY_HIGH";
      } else if (daysSinceUpdate <= 20) {
        fcrSummary.confidenceLevel = "HIGH";
      } else if (daysSinceUpdate <= 40) {
        fcrSummary.confidenceLevel = "MEDIUM";
      } else {
        fcrSummary.confidenceLevel = "LOW";
      }

      fcrSummary.lastUpdated = new Date(latestSummary.updated_at);
    }
  }

  // Calculate trend from FCR trends data
  if (fcrTrendsData.length >= 2) {
    const recentData = fcrTrendsData.slice(-3);
    const validData = recentData.filter(d => d.actual_fcr !== null);

    if (validData.length >= 2) {
      const first = validData[0].actual_fcr!;
      const last = validData[validData.length - 1].actual_fcr!;

      if (last > first + 0.05) {
        fcrSummary.trend = "up";
      } else if (last < first - 0.05) {
        fcrSummary.trend = "down";
      } else {
        fcrSummary.trend = "stable";
      }

      // Calculate predicted FCR and deviation
      const predictions = recentData.filter(d => d.predicted_fcr !== null);
      if (predictions.length > 0) {
        fcrSummary.predictedFCR = predictions[predictions.length - 1].predicted_fcr;
        fcrSummary.deviation = fcrSummary.currentFCR !== null && fcrSummary.predictedFCR !== null
          ? fcrSummary.currentFCR - fcrSummary.predictedFCR
          : null;
        fcrSummary.scenariosUsed = predictions.reduce((sum, p) => sum + p.scenarios_used, 0) / predictions.length;
      }
    }
  }

  // Mutation for refreshing data
  const refreshMutation = useMutation({
    mutationFn: async () => {
      await refetchTrends();
    },
  });

  const handleRefresh = async () => {
    await refreshMutation.mutateAsync();
  };

  return {
    // Data
    fcrSummary,
    fcrTrendsData,
    feedingSummaries,

    // Loading states
    isLoading: trendsLoading || feedingLoading,
    trendsLoading,
    feedingLoading,

    // Errors
    error: trendsError || feedingError,

    // Actions
    refresh: handleRefresh,
    isRefreshing: refreshMutation.isPending,

    // Metadata
    isUsingMockData,
    hasData: fcrTrendsData.length > 0 || feedingSummaries.length > 0,
  };
}

// Hook for container-level FCR data
export function useContainerFCRAnalytics(containerId?: number, filters?: FCRFilters) {
  const {
    data: containerTrendsData = [],
    isLoading: containerLoading,
    error: containerError,
    refetch: refetchContainer,
    isError: containerIsError,
    failureCount: containerFailureCount
  } = useQuery<FCRDataPoint[]>({
    queryKey: ["fcr-trends-container", containerId, filters],
    queryFn: async () => {
      if (!containerId) return [];

      try {
        // Use the generated OperationalService for container data
        const response = await OperationalService.apiV1OperationalFcrTrendsList(
          containerId, // assignmentId
          undefined, // batchId
          undefined, // endDate
          undefined, // geographyId
          true, // includePredicted
          'WEEKLY', // interval
          undefined, // ordering
          undefined, // page
          undefined, // search
          filters?.startDate?.toISOString().split('T')[0] // startDate
        );

        // Transform the response - each FCRTrends object contains a series of FCRDataPoint
        const transformedData: FCRDataPoint[] = response.results?.flatMap((fcrTrends: FCRTrends) =>
          fcrTrends.series?.map((item: GeneratedFCRDataPoint) => ({
            period_start: item.period_start,
            period_end: item.period_end,
            actual_fcr: item.actual_fcr ? parseFloat(item.actual_fcr) : null,
            confidence: (item.confidence as ConfidenceLevel) || 'LOW',
            predicted_fcr: item.predicted_fcr ? parseFloat(item.predicted_fcr) : null,
            deviation: item.deviation ? parseFloat(item.deviation) : null,
            scenarios_used: item.scenarios_used || 0,
            container_name: item.container_name || `Container ${containerId}`,
            assignment_id: item.assignment_id || containerId,
            container_count: item.container_count || 1,
            total_containers: item.total_containers || null
          })) || []
        ) || [];

        return transformedData;
      } catch (error) {
        console.error("Failed to fetch container FCR data:", error);
        // Return mock data as fallback
        return mockFCRData.map(point => ({
          ...point,
          container_name: `Container ${containerId}`,
          assignment_id: containerId,
          container_count: 1,
          total_containers: 3 // Mock multiple containers
        }));
      }
    },
    enabled: !!containerId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Retry up to 2 times for container data (less critical)
      if (failureCount >= 2) return false;

      // Don't retry on authentication errors
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }

      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await refetchContainer();
    },
    onError: (error) => {
      console.error("Failed to refresh container FCR data:", error);
    },
  });

  return {
    containerTrendsData,
    isLoading: containerLoading,
    error: containerError,
    refresh: () => refreshMutation.mutateAsync(),
    isRefreshing: refreshMutation.isPending,
    isError: containerIsError,
    failureCount: containerFailureCount,
  };
}

// Hook for infrastructure-level FCR aggregation
export function useInfrastructureFCRAnalytics(geographyId?: number, filters?: FCRFilters) {
  const {
    data: infrastructureTrendsData = [],
    isLoading: infrastructureLoading,
    error: infrastructureError,
    refetch: refetchInfrastructure,
    isError: infrastructureIsError,
    failureCount: infrastructureFailureCount
  } = useQuery<FCRDataPoint[]>({
    queryKey: ["fcr-trends-infrastructure", geographyId, filters],
    queryFn: async () => {
      if (!geographyId) return [];

      try {
        // Use the generated OperationalService for geography data
        const response = await OperationalService.apiV1OperationalFcrTrendsList(
          undefined, // assignmentId
          undefined, // batchId
          undefined, // endDate
          geographyId, // geographyId
          true, // includePredicted
          'WEEKLY', // interval
          undefined, // ordering
          undefined, // page
          undefined, // search
          filters?.startDate?.toISOString().split('T')[0] // startDate
        );

        // Transform the response - each FCRTrends object contains a series of FCRDataPoint
        const transformedData: FCRDataPoint[] = response.results?.flatMap((fcrTrends: FCRTrends) =>
          fcrTrends.series?.map((item: GeneratedFCRDataPoint) => ({
            period_start: item.period_start,
            period_end: item.period_end,
            actual_fcr: item.actual_fcr ? parseFloat(item.actual_fcr) : null,
            confidence: (item.confidence as ConfidenceLevel) || 'LOW',
            predicted_fcr: item.predicted_fcr ? parseFloat(item.predicted_fcr) : null,
            deviation: item.deviation ? parseFloat(item.deviation) : null,
            scenarios_used: item.scenarios_used || 0,
            container_name: item.container_name || null,
            assignment_id: item.assignment_id || null,
            container_count: item.container_count || null,
            total_containers: item.total_containers || null
          })) || []
        ) || [];

        return transformedData;
      } catch (error) {
        console.error("Failed to fetch infrastructure FCR data:", error);
        // Return mock data as fallback
        return mockFCRData.map(point => ({
          ...point,
          container_count: Math.floor(Math.random() * 10) + 1,
          total_containers: 15 // Mock total containers in geography
        }));
      }
    },
    enabled: !!geographyId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Retry up to 2 times for infrastructure data
      if (failureCount >= 2) return false;

      // Don't retry on authentication errors
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }

      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await refetchInfrastructure();
    },
    onError: (error) => {
      console.error("Failed to refresh infrastructure FCR data:", error);
    },
  });

  return {
    infrastructureTrendsData,
    isLoading: infrastructureLoading,
    error: infrastructureError,
    refresh: () => refreshMutation.mutateAsync(),
    isRefreshing: refreshMutation.isPending,
    isError: infrastructureIsError,
    failureCount: infrastructureFailureCount,
  };
}

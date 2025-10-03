import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated/services/ApiService";

/**
 * Feed type usage aggregated data
 */
export interface FeedTypeUsage {
  feedType: string;
  feedBrand: string;
  totalAmountKg: number;
  totalCost: number;
  eventsCount: number;
  averageAmountPerEvent: number;
}

/**
 * Feeding event data structure
 */
export interface FeedingEvent {
  id: number;
  feedingDate: string;
  feedingTime: string;
  amountKg: number;
  feedType: string;
  feedBrand: string;
  containerName: string;
  batchBiomassKg: number;
  feedCost: number;
  method: string;
  notes?: string;
  recordedBy: string;
}

/**
 * Feeding summary data structure
 */
export interface FeedingSummary {
  id: number;
  periodStart: string;
  periodEnd: string;
  totalFeedKg: number;
  totalFeedConsumedKg: number;
  totalBiomassGainKg: number;
  fcr: number;
  averageFeedingPercentage: number;
  feedingEventsCount: number;
  totalCost: number;
}

/**
 * Custom hook to fetch all data required for batch feed history view
 * 
 * Consolidates feeding events, summaries, and metadata into a single hook
 * for better reusability and testability.
 * 
 * @param batchId - The batch ID to fetch feed history for
 * @param currentPage - Current page number for pagination
 * @param periodFilter - Time period filter
 * @param dateRange - Custom date range filter
 * @returns Object containing all feed history data and loading/error states
 */
export function useBatchFeedHistoryData(
  batchId: number,
  currentPage: number,
  periodFilter: string,
  dateRange: { from?: Date; to?: Date }
) {
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  // Fetch feeding events summary for performance metrics
  const { data: feedingSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["batch/feeding-events-summary", batchId],
    queryFn: async () => {
      try {
        console.log(`📊 Fetching feeding events summary for batch ${batchId} (ALL dates)...`);

        // Use the generated ApiService with batch filter and invalid date to bypass date filtering and get ALL events
        // The Django backend ignores invalid dates, giving us all events for the batch
        const response = await ApiService.feedingEventsSummary(
          batchId,    // batch - filter by specific batch
          undefined,  // container
          'invalid',  // date - invalid date to bypass filtering
          undefined,  // endDate
          undefined   // startDate
        );

        console.log('📊 Feeding Events Summary Response:', response);

        return {
          eventsCount: Number(response.events_count || 0),
          totalFeedKg: Number(response.total_feed_kg || 0)
        };
      } catch (error) {
        console.error("❌ Failed to fetch feeding events summary:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Calculate actual date range for API filtering
  const { from: dateFrom, to: dateTo } = (() => {
    const now = new Date();
    switch (periodFilter) {
      case "7":
        return { from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), to: now };
      case "30":
        return { from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), to: now };
      case "90":
        return { from: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), to: now };
      default:
        return dateRange.from && dateRange.to 
          ? { from: dateRange.from, to: dateRange.to }
          : { from: undefined, to: undefined };
    }
  })();

  // Format dates to YYYY-MM-DD for API
  const feedingDateAfter = dateFrom ? dateFrom.toISOString().split('T')[0] : undefined;
  const feedingDateBefore = dateTo ? dateTo.toISOString().split('T')[0] : undefined;

  // Fetch feeding data with pagination (only current page, not all pages)
  const { data: feedingEventsData, isLoading: isLoadingFeedingEvents } = useQuery({
    queryKey: ["batch/feeding-events", batchId, currentPage, periodFilter, dateRange],
    queryFn: async () => {
      try {
        console.log(`🍽️ Fetching feeding events page ${currentPage} for batch ${batchId}...`, {
          dateRange: { from: feedingDateAfter, to: feedingDateBefore }
        });

        // Only fetch the current page with date filtering
        const response = await ApiService.apiV1InventoryFeedingEventsList(
          undefined,  // amountMax
          undefined,  // amountMin
          batchId,    // batch - filter by specific batch
          undefined,  // batchIn
          undefined,  // batchNumber
          undefined,  // container
          undefined,  // containerIn
          undefined,  // containerName
          undefined,  // feed
          undefined,  // feedIn
          undefined,  // feedName
          undefined,  // feedingDate
          feedingDateAfter,  // feedingDateAfter - date range filter START
          feedingDateBefore, // feedingDateBefore - date range filter END
          undefined,  // method
          undefined,  // methodIn
          undefined,  // ordering
          currentPage, // page - current page only
          undefined   // search
        );

        console.log('🍽️ Batch Feeding Events - CURRENT PAGE:', {
          batchId: batchId,
          currentPage: currentPage,
          totalEvents: response.count,
          eventsInPage: response.results?.length || 0,
          totalPages: Math.ceil((response.count || 0) / 20)
        });

        return {
          events: (response.results || []).map((e: any) => ({
            id: e.id,
            feedingDate: e.feeding_date,
            feedingTime: e.feeding_time || new Date(e.feeding_date).toISOString().slice(11, 16),
            amountKg: Number(e.amount_kg ?? 0),
            feedType: e.feed_name ?? "Unknown",
            feedBrand: e.feed_name ?? "Generic",
            containerName: e.container_name ?? "Unknown",
            batchBiomassKg: Number(e.batch_biomass_kg ?? 0),
            feedCost: Number(e.feed_cost ?? 0),
            method: e.method ?? "Manual",
            notes: e.notes ?? "",
            recordedBy: e.recorded_by_username ?? "system",
          })) as FeedingEvent[],
          totalCount: response.count || 0,
          totalPages: Math.ceil((response.count || 0) / 20)
        };
      } catch (error) {
        console.error("❌ Failed to fetch feeding events:", error);
        return {
          events: [] as FeedingEvent[],
          totalCount: 0,
          totalPages: 1
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Extract data and update pagination state
  const feedingEvents = feedingEventsData?.events || [];
  useEffect(() => {
    if (feedingEventsData) {
      setTotalEvents(feedingEventsData.totalCount);
      setTotalPages(feedingEventsData.totalPages);
    }
  }, [feedingEventsData]);

  // Fetch feeding summaries
  const { data: feedingSummaries = [] } = useQuery<FeedingSummary[]>({
    queryKey: ["batch/feeding-summaries", batchId, periodFilter, dateRange],
    queryFn: async () => {
      try {
        // Use the correct API endpoint for batch feeding summaries
        const response = await ApiService.apiV1InventoryBatchFeedingSummariesList(
          batchId, // batch parameter
          undefined, // page
          undefined  // search
        );

        const list = (response.results || []).map((r: any) => ({
          id: r.id,
          periodStart:
            r.period_start ?? r.start_date ?? r.periodStart ??
            new Date().toISOString(),
          periodEnd:
            r.period_end ?? r.end_date ?? r.periodEnd ??
            new Date().toISOString(),
          totalFeedKg: Number(r.total_feed_kg ?? r.totalFeedKg ?? 0),
          totalFeedConsumedKg: Number(
            r.total_feed_consumed_kg ?? r.totalFeedConsumedKg ?? 0,
          ),
          totalBiomassGainKg: Number(
            r.total_biomass_gain_kg ?? r.totalBiomassGainKg ?? 0,
          ),
          fcr: Number(r.fcr ?? 0),
          averageFeedingPercentage: Number(
            r.average_feeding_percentage ?? r.feeding_percentage ?? r.avg_feeding_pct ?? 0,
          ),
          feedingEventsCount: Number(
            r.events_count ?? r.feeding_events_count ?? r.feeding_events_count ?? 0,
          ),
          totalCost: Number(r.total_cost ?? r.feed_cost ?? 0),
        }));
        return list as FeedingSummary[];
      } catch (error) {
        console.error("Failed to fetch feeding summaries:", error);
        return [];
      }
    },
  });

  // Fetch all available feed types for dropdown population
  const { data: allFeedTypes = [], isLoading: isLoadingFeedTypes } = useQuery<string[]>({
    queryKey: ["feed-types"],
    queryFn: async () => {
      try {
        console.log('📊 Fetching ALL feed types for dropdown...');

        // Get first page only for dropdown population
        const response = await ApiService.apiV1InventoryFeedingEventsList(
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined, undefined,
          1,  // page - first page only
          undefined
        );

        const types = [...new Set((response.results || []).map((e: any) => e.feed_name))];
        console.log('📊 Feed Types:', {
          totalEventsInFirstPage: response.results?.length || 0,
          uniqueFeedTypes: types.length,
          feedTypes: types,
        });
        return types.filter(Boolean);
      } catch (error) {
        console.error("❌ Failed to fetch feed types:", error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Fetch containers from batch assignments (all containers this batch has been in)
  const { data: allContainers = [], isLoading: isLoadingContainers } = useQuery<string[]>({
    queryKey: ["batch-containers", batchId],
    queryFn: async () => {
      try {
        console.log(`🏗️ Fetching containers from batch ${batchId} assignments...`);

        // Get all container assignments for this batch (paginated if needed)
        const response = await ApiService.apiV1BatchContainerAssignmentsList(
          undefined, // assignmentDate
          undefined, // assignmentDateAfter
          undefined, // assignmentDateBefore
          batchId,   // batch - filter by specific batch
          undefined, // batchIn
          undefined, // batchNumber
          undefined, // biomassMax
          undefined, // biomassMin
          undefined, // container
          undefined, // containerIn
          undefined, // containerName
          undefined, // containerType
          undefined, // isActive - get ALL (both active and inactive)
          undefined, // lifecycleStage
          undefined, // ordering
          undefined, // page - get all pages
          undefined, // populationMax
          undefined, // populationMin
          undefined, // search
          undefined  // species
        );

        const containers = [...new Set(
          (response.results || [])
            .map((assignment: any) => assignment.container_name)
            .filter(Boolean)
        )];
        
        console.log('🏗️ Batch Containers:', {
          totalAssignments: response.count,
          uniqueContainers: containers.length,
          containers: containers.slice(0, 10),
        });
        return containers;
      } catch (error) {
        console.error("❌ Failed to fetch batch containers:", error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  return {
    // Data
    feedingEvents,
    feedingSummaries,
    feedingSummary,
    allFeedTypes,
    allContainers,

    // Pagination
    totalPages,
    totalEvents,

    // Loading states
    isLoadingSummary,
    isLoadingFeedingEvents,
    isLoadingFeedTypes,
    isLoadingContainers,
  };
}


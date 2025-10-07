/**
 * Inventory API Wrappers
 * Server-side aggregation endpoints for inventory KPIs and CRUD operations
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import { useCrudMutation } from "@/features/shared/hooks/useCrudMutation";
import type { 
  BatchFeedingSummary,
  PaginatedBatchFeedingSummaryList,
  Feed,
  FeedPurchase,
  PaginatedFeedList,
  PaginatedFeedPurchaseList,
} from "@/api/generated";

// Type for feeding events summary response
export interface FeedingEventsSummary {
  events_count: number;
  total_feed_kg: number;
}

// Common query options for inventory
const INVENTORY_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
  retryDelay: 1000,
} as const;

/**
 * Hook to fetch feeding events summary for a date range
 * @param startDate - Start date for the summary (ISO format)
 * @param endDate - End date for the summary (ISO format)
 * @param batchId - Optional batch ID to filter by
 * @returns Query result with feeding events summary
 */
export function useFeedingEventsSummary(
  startDate: string | undefined,
  endDate: string | undefined,
  batchId?: number
): UseQueryResult<FeedingEventsSummary, Error> {
  return useQuery({
    queryKey: ["inventory", "feeding-events-summary", { startDate, endDate, batchId }],
    queryFn: async () => {
      if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
      }
      
      // The API endpoint expects query parameters
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      
      if (batchId) {
        params.append("batch", batchId.toString());
      }

      // Use the generated API service method
      // Parameters: batch, container, date, endDate, startDate
      return await ApiService.feedingEventsSummary(
        batchId,
        undefined, // container
        undefined, // date (single date)
        endDate,
        startDate
      ) as FeedingEventsSummary;
    },
    enabled: !!startDate && !!endDate,
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch feeding events summary for the last N days
 * @param days - Number of days to look back (default: 7)
 * @param batchId - Optional batch ID to filter by
 * @returns Query result with feeding events summary
 */
export function useFeedingEventsSummaryLastDays(
  days: number = 7,
  batchId?: number
): UseQueryResult<FeedingEventsSummary, Error> {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return useFeedingEventsSummary(startDate, endDate, batchId);
}

/**
 * Hook to fetch batch feeding summaries with pagination
 * @param batchId - Optional batch ID to filter by
 * @param page - Page number for pagination
 * @param pageSize - Number of items per page
 * @returns Query result with paginated batch feeding summaries
 */
export function useBatchFeedingSummaries(
  batchId?: number,
  page: number = 1,
  pageSize: number = 20
): UseQueryResult<PaginatedBatchFeedingSummaryList, Error> {
  return useQuery({
    queryKey: ["inventory", "batch-feeding-summaries", { batchId, page, pageSize }],
    queryFn: async () => {
      return await ApiService.apiV1InventoryBatchFeedingSummariesList(
        batchId,
        undefined, // ordering
        page,
        undefined, // periodEnd
        undefined  // periodStart
      );
    },
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch a single batch feeding summary by ID
 * @param summaryId - The batch feeding summary ID
 * @returns Query result with the batch feeding summary
 */
export function useBatchFeedingSummary(
  summaryId: number | undefined
): UseQueryResult<BatchFeedingSummary, Error> {
  return useQuery({
    queryKey: ["inventory", "batch-feeding-summary", summaryId],
    queryFn: async () => {
      if (!summaryId) throw new Error("Summary ID is required");
      return await ApiService.apiV1InventoryBatchFeedingSummariesRetrieve(summaryId);
    },
    enabled: !!summaryId,
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch batch feeding summaries aggregated by batch
 * This returns paginated summaries for all batches
 * @returns Query result with paginated batch feeding summaries
 */
export function useBatchFeedingSummariesByBatch(): UseQueryResult<PaginatedBatchFeedingSummaryList, Error> {
  return useQuery({
    queryKey: ["inventory", "batch-feeding-summaries-by-batch"],
    queryFn: async () => {
      return await ApiService.apiV1InventoryBatchFeedingSummariesList();
    },
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch feeding summaries for today
 * @param batchId - Optional batch ID to filter by
 * @returns Query result with today's feeding summary
 */
export function useTodayFeedingSummary(
  batchId?: number
): UseQueryResult<FeedingEventsSummary, Error> {
  const today = new Date().toISOString().split("T")[0];
  return useFeedingEventsSummary(today, today, batchId);
}

/**
 * Hook to fetch feeding summaries for this month
 * @param batchId - Optional batch ID to filter by
 * @returns Query result with this month's feeding summary
 */
export function useMonthlyFeedingSummary(
  batchId?: number
): UseQueryResult<FeedingEventsSummary, Error> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const startDate = firstDayOfMonth.toISOString().split("T")[0];
  const endDate = lastDayOfMonth.toISOString().split("T")[0];
  
  return useFeedingEventsSummary(startDate, endDate, batchId);
}

// Export utility to invalidate inventory queries
export function getInventoryQueryKeys() {
  return {
    all: ["inventory"] as const,
    feedingEventsSummary: ["inventory", "feeding-events-summary"] as const,
    feedingEventsSummaryByDateRange: (startDate: string, endDate: string, batchId?: number) => 
      ["inventory", "feeding-events-summary", { startDate, endDate, batchId }] as const,
    batchFeedingSummaries: ["inventory", "batch-feeding-summaries"] as const,
    batchFeedingSummary: (id: number) => ["inventory", "batch-feeding-summary", id] as const,
    batchFeedingSummariesByBatch: ["inventory", "batch-feeding-summaries-by-batch"] as const,
    feeds: ["inventory", "feeds"] as const,
    feed: (id: number) => ["inventory", "feed", id] as const,
    feedPurchases: ["inventory", "feed-purchases"] as const,
    feedPurchase: (id: number) => ["inventory", "feed-purchase", id] as const,
  };
}

// ============================================================================
// Feed CRUD Operations
// ============================================================================

/**
 * Hook to fetch paginated list of feeds
 * @param filters - Optional filters for feeds
 * @returns Query result with paginated feeds
 */
export function useFeeds(filters?: {
  brand?: string;
  isActive?: boolean;
  name?: string;
  ordering?: string;
  page?: number;
}): UseQueryResult<PaginatedFeedList, Error> {
  return useQuery({
    queryKey: ["inventory", "feeds", filters],
    queryFn: () =>
      ApiService.apiV1InventoryFeedsList(
        filters?.brand,
        filters?.isActive,
        filters?.ordering,
        filters?.page,
        filters?.name
      ),
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch a single feed by ID
 * @param id - The feed ID
 * @returns Query result with the feed
 */
export function useFeed(id: number | undefined): UseQueryResult<Feed, Error> {
  return useQuery({
    queryKey: ["inventory", "feed", id],
    queryFn: () => {
      if (!id) throw new Error("Feed ID is required");
      return ApiService.apiV1InventoryFeedsRetrieve(id);
    },
    enabled: !!id,
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to create a new feed
 * @returns Mutation hook for creating feeds
 */
export function useCreateFeed() {
  return useCrudMutation<Feed, Feed>({
    mutationFn: (data) => ApiService.apiV1InventoryFeedsCreate(data),
    description: "Feed created successfully",
    invalidateQueries: ["inventory", "feeds"],
  });
}

/**
 * Hook to update an existing feed
 * @returns Mutation hook for updating feeds
 */
export function useUpdateFeed() {
  return useCrudMutation<Feed & { id: number }, Feed>({
    mutationFn: (data) => ApiService.apiV1InventoryFeedsUpdate(data.id, data),
    description: "Feed updated successfully",
    invalidateQueries: ["inventory", "feeds", "feed"],
  });
}

/**
 * Hook to delete a feed
 * @returns Mutation hook for deleting feeds
 */
export function useDeleteFeed() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1InventoryFeedsDestroy(id),
    description: "Feed deleted successfully",
    invalidateQueries: ["inventory", "feeds"],
  });
}

// ============================================================================
// FeedPurchase CRUD Operations
// ============================================================================

/**
 * Hook to fetch paginated list of feed purchases
 * @param filters - Optional filters for feed purchases
 * @returns Query result with paginated feed purchases
 */
export function useFeedPurchases(filters?: {
  feed?: number;
  supplier?: string;
  ordering?: string;
  page?: number;
}): UseQueryResult<PaginatedFeedPurchaseList, Error> {
  return useQuery({
    queryKey: ["inventory", "feed-purchases", filters],
    queryFn: () =>
      ApiService.apiV1InventoryFeedPurchasesList(
        filters?.feed,
        filters?.ordering,
        filters?.page,
        filters?.supplier
      ),
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch a single feed purchase by ID
 * @param id - The feed purchase ID
 * @returns Query result with the feed purchase
 */
export function useFeedPurchase(id: number | undefined): UseQueryResult<FeedPurchase, Error> {
  return useQuery({
    queryKey: ["inventory", "feed-purchase", id],
    queryFn: () => {
      if (!id) throw new Error("Feed purchase ID is required");
      return ApiService.apiV1InventoryFeedPurchasesRetrieve(id);
    },
    enabled: !!id,
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to create a new feed purchase
 * @returns Mutation hook for creating feed purchases
 */
export function useCreateFeedPurchase() {
  return useCrudMutation<FeedPurchase, FeedPurchase>({
    mutationFn: (data) => ApiService.apiV1InventoryFeedPurchasesCreate(data),
    description: "Feed purchase created successfully",
    invalidateQueries: ["inventory", "feed-purchases"],
  });
}

/**
 * Hook to update an existing feed purchase
 * @returns Mutation hook for updating feed purchases
 */
export function useUpdateFeedPurchase() {
  return useCrudMutation<FeedPurchase & { id: number }, FeedPurchase>({
    mutationFn: (data) => ApiService.apiV1InventoryFeedPurchasesUpdate(data.id, data),
    description: "Feed purchase updated successfully",
    invalidateQueries: ["inventory", "feed-purchases", "feed-purchase"],
  });
}

/**
 * Hook to delete a feed purchase
 * @returns Mutation hook for deleting feed purchases
 */
export function useDeleteFeedPurchase() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1InventoryFeedPurchasesDestroy(id),
    description: "Feed purchase deleted successfully",
    invalidateQueries: ["inventory", "feed-purchases"],
  });
}

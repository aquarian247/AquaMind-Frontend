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
  FeedContainerStock,
  PaginatedFeedContainerStockList,
  FeedContainerStockCreate,
  FeedingEvent,
  PaginatedFeedingEventList,
} from "@/api/generated";

// Type for feeding events summary response
export interface FeedingEventsSummary {
  events_count: number;
  total_feed_kg: number;
  total_feed_cost: number;
}

export interface FeedContainerStockSummaryItemByFeedType {
  feed_id?: number;
  feed_name?: string;
  total_quantity_kg?: number;
  total_value?: number;
  container_count?: number;
}

export interface FeedContainerStockSummaryItemByContainer {
  container_id?: number;
  container_name?: string;
  total_quantity_kg?: number;
  total_value?: number;
  feed_type_count?: number;
}

export interface FeedContainerStockSummary {
  total_quantity_kg?: number;
  total_value?: number;
  unique_feed_types?: number;
  unique_containers?: number;
  by_feed_type?: FeedContainerStockSummaryItemByFeedType[];
  by_container?: FeedContainerStockSummaryItemByContainer[];
}

export interface FeedingEventsFinanceReport {
  summary?: {
    total_feed_kg?: number;
    total_feed_cost?: number;
    events_count?: number;
    date_range?: {
      start?: string;
      end?: string;
    };
  };
  by_feed_type?: Array<{
    feed_id?: number;
    feed_name?: string;
    brand?: string;
    protein_percentage?: number;
    fat_percentage?: number;
    total_kg?: number;
    total_cost?: number;
    events_count?: number;
  }>;
  by_container?: Array<{
    container_id?: number;
    container_name?: string;
    total_kg?: number;
    total_cost?: number;
    events_count?: number;
  }>;
  by_geography?: any[];
  by_area?: any[];
  time_series?: Array<Record<string, unknown>>;
}

// Common query options for inventory
export const INVENTORY_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
  retryDelay: 1000,
} as const;

// Geography filter options for inventory hooks
export interface GeographyFilters {
  geography?: number;
  geographyIds?: number[];
  area?: number;
  areaIds?: number[];
  hall?: number;
  hallIds?: number[];
  freshwaterStation?: number;
  freshwaterStationIds?: number[];
}

/**
 * Hook to fetch feeding events summary for a date range
 * @param startDate - Start date for the summary (ISO format)
 * @param endDate - End date for the summary (ISO format)
 * @param batchId - Optional batch ID to filter by
 * @param geographyFilters - Optional geography/location filters
 * @returns Query result with feeding events summary
 */
export function useFeedingEventsSummary(
  startDate: string | undefined,
  endDate: string | undefined,
  batchId?: number,
  geographyFilters?: GeographyFilters
): UseQueryResult<FeedingEventsSummary, Error> {
  return useQuery({
    queryKey: ["inventory", "feeding-events-summary", { startDate, endDate, batchId, geographyFilters }],
    queryFn: async () => {
      if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
      }

      // Use the generated API service method with geography filters
      return await ApiService.feedingEventsSummary(
        geographyFilters?.area,
        geographyFilters?.areaIds,
        batchId,
        undefined, // container
        undefined, // containerIn
        undefined, // date (single date)
        endDate,
        geographyFilters?.freshwaterStation,
        geographyFilters?.freshwaterStationIds,
        geographyFilters?.geography,
        geographyFilters?.geographyIds,
        geographyFilters?.hall,
        geographyFilters?.hallIds,
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
 * @param geographyFilters - Optional geography/location filters
 * @returns Query result with feeding events summary
 */
export function useFeedingEventsSummaryLastDays(
  days: number = 7,
  batchId?: number,
  geographyFilters?: GeographyFilters
): UseQueryResult<FeedingEventsSummary, Error> {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return useFeedingEventsSummary(startDate, endDate, batchId, geographyFilters);
}

/**
 * Hook to fetch aggregated feed container stock summary data.
 * @param filters - Optional filters including feed container, feed type, and geography
 * @returns Query result with feed container stock summary
 */
export function useFeedContainerStockSummary(filters?: {
  feedContainerId?: number;
  feedTypeId?: number;
  geography?: number;
  area?: number;
  hall?: number;
  freshwaterStation?: number;
}): UseQueryResult<FeedContainerStockSummary, Error> {
  return useQuery({
    queryKey: ["inventory", "feed-container-stock-summary", filters],
    queryFn: () =>
      ApiService.apiV1InventoryFeedContainerStockSummaryRetrieve(
        filters?.area,
        filters?.feedContainerId,
        filters?.feedTypeId,
        filters?.freshwaterStation,
        filters?.geography,
        filters?.hall
      ),
    ...INVENTORY_QUERY_OPTIONS,
  });
}

interface FeedingEventsFinanceReportOptions {
  startDate: string;
  endDate: string;
  groupBy?: "day" | "week" | "month";
  includeBreakdowns?: boolean;
  includeTimeSeries?: boolean;
  filters?: {
    area?: number;
    areaIds?: number[];
    feed?: number;
    feedIds?: number[];
    geography?: number;
    geographyIds?: number[];
    freshwaterStation?: number;
    feedCostGte?: number;
    feedCostLte?: number;
  };
}

/**
 * Hook to fetch the comprehensive feeding events finance report.
 */
export function useFeedingEventsFinanceReport(
  options: FeedingEventsFinanceReportOptions
): UseQueryResult<FeedingEventsFinanceReport, Error> {
  const {
    startDate,
    endDate,
    groupBy = "week",
    includeBreakdowns = true,
    includeTimeSeries = true,
    filters,
  } = options;

  return useQuery({
    queryKey: [
      "inventory",
      "feeding-events-finance-report",
      { startDate, endDate, groupBy, includeBreakdowns, includeTimeSeries, filters },
    ],
    queryFn: () =>
      ApiService.feedingEventsFinanceReport(
        endDate,
        startDate,
        filters?.area,
        filters?.areaIds,
        filters?.feed,
        undefined,
        undefined,
        undefined,
        undefined,
        filters?.feedIds,
        undefined,
        undefined,
        undefined,
        filters?.feedCostGte,
        filters?.feedCostLte,
        filters?.freshwaterStation,
        filters?.geography,
        filters?.geographyIds,
        groupBy,
        includeBreakdowns,
        includeTimeSeries
      ),
    enabled: Boolean(startDate && endDate),
    ...INVENTORY_QUERY_OPTIONS,
  });
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
 * @param geographyFilters - Optional geography/location filters
 * @returns Query result with today's feeding summary
 */
export function useTodayFeedingSummary(
  batchId?: number,
  geographyFilters?: GeographyFilters
): UseQueryResult<FeedingEventsSummary, Error> {
  const today = new Date().toISOString().split("T")[0];
  return useFeedingEventsSummary(today, today, batchId, geographyFilters);
}

/**
 * Hook to fetch feeding summaries for this month
 * @param batchId - Optional batch ID to filter by
 * @param geographyFilters - Optional geography/location filters
 * @returns Query result with this month's feeding summary
 */
export function useMonthlyFeedingSummary(
  batchId?: number,
  geographyFilters?: GeographyFilters
): UseQueryResult<FeedingEventsSummary, Error> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const startDate = firstDayOfMonth.toISOString().split("T")[0];
  const endDate = lastDayOfMonth.toISOString().split("T")[0];
  
  return useFeedingEventsSummary(startDate, endDate, batchId, geographyFilters);
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
    feedPurchasesSummary: ["inventory", "feed-purchases-summary"] as const,
    feedPurchase: (id: number) => ["inventory", "feed-purchase", id] as const,
    feedContainerStock: ["inventory", "feed-container-stock"] as const,
    feedContainerStockItem: (id: number) => ["inventory", "feed-container-stock", id] as const,
    feedingEvents: ["inventory", "feeding-events"] as const,
    feedingEvent: (id: number) => ["inventory", "feeding-event", id] as const,
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
// FeedPurchase Aggregations & CRUD Operations
// ============================================================================

export interface FeedPurchasesSummaryBySupplier {
  supplier?: string;
  total_quantity_kg?: number;
  total_spend?: number;
  average_cost_per_kg?: number | null;
}

export interface FeedPurchasesSummaryByFeed {
  feed_id?: number;
  feed_name?: string;
  total_quantity_kg?: number;
  total_spend?: number;
  average_cost_per_kg?: number | null;
}

export interface FeedPurchasesSummary {
  total_quantity_kg?: number;
  total_spend?: number;
  average_cost_per_kg?: number | null;
  supplier_breakdown?: FeedPurchasesSummaryBySupplier[];
  feed_breakdown?: FeedPurchasesSummaryByFeed[];
}

export interface FeedPurchasesCommonFilters {
  endDate?: string;
  feed?: number;
  purchaseDate?: string;
  search?: string;
  startDate?: string;
  supplier?: string;
}

export interface FeedPurchasesSummaryFilters extends FeedPurchasesCommonFilters {}

export interface FeedPurchasesListFilters extends FeedPurchasesCommonFilters {
  ordering?: string;
  page?: number;
}

interface UseFeedPurchasesSummaryOptions {
  filters?: FeedPurchasesSummaryFilters;
  includeFeedBreakdown?: boolean;
  includeSupplierBreakdown?: boolean;
  enabled?: boolean;
}

/**
 * Hook to fetch aggregated feed purchase totals from the server.
 * Mirrors the filters available on the list endpoint while allowing optional breakdowns.
 */
export function useFeedPurchasesSummary({
  filters,
  includeFeedBreakdown = false,
  includeSupplierBreakdown = false,
  enabled = true,
}: UseFeedPurchasesSummaryOptions = {}): UseQueryResult<FeedPurchasesSummary, Error> {
  return useQuery({
    queryKey: [
      "inventory",
      "feed-purchases-summary",
      { filters, includeFeedBreakdown, includeSupplierBreakdown },
    ],
    queryFn: () =>
      ApiService.feedPurchasesSummary(
        filters?.endDate,
        filters?.feed,
        includeFeedBreakdown,
        includeSupplierBreakdown,
        filters?.purchaseDate,
        filters?.search,
        filters?.startDate,
        filters?.supplier
      ),
    enabled,
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch paginated list of feed purchases
 * @param filters - Optional filters for feed purchases
 * @returns Query result with paginated feed purchases
 */
export function useFeedPurchases(filters?: FeedPurchasesListFilters): UseQueryResult<PaginatedFeedPurchaseList, Error> {
  return useQuery({
    queryKey: ["inventory", "feed-purchases", filters],
    queryFn: () =>
      ApiService.apiV1InventoryFeedPurchasesList(
        filters?.endDate,
        filters?.feed,
        filters?.ordering,
        filters?.page,
        filters?.purchaseDate,
        filters?.search,
        filters?.startDate,
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

// ============================================================================
// FeedContainerStock CRUD Operations (FIFO Tracking)
// ============================================================================

/**
 * Hook to fetch paginated list of feed container stock entries
 * @param filters - Optional filters for feed container stock
 * @returns Query result with paginated feed container stock
 */
export function useFeedContainerStock(filters?: {
  feedContainer?: number;
  feedPurchase?: number;
  entryDateGte?: string;
  entryDateLte?: string;
  ordering?: string;
  page?: number;
}): UseQueryResult<PaginatedFeedContainerStockList, Error> {
  return useQuery({
    queryKey: ["inventory", "feed-container-stock", filters],
    queryFn: () =>
      ApiService.apiV1InventoryFeedContainerStockList(
        undefined, // entryDate
        filters?.entryDateGte,
        filters?.entryDateLte,
        filters?.feedContainer,
        filters?.feedPurchase,
        filters?.ordering,
        filters?.page,
        undefined, // quantityKg
        undefined, // quantityKgGte
        undefined, // quantityKgLte
        undefined  // search
      ),
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch a single feed container stock entry by ID
 * @param id - The feed container stock ID
 * @returns Query result with the feed container stock entry
 */
export function useFeedContainerStockItem(
  id: number | undefined
): UseQueryResult<FeedContainerStock, Error> {
  return useQuery({
    queryKey: ["inventory", "feed-container-stock", id],
    queryFn: () => {
      if (!id) throw new Error("Feed container stock ID is required");
      return ApiService.apiV1InventoryFeedContainerStockRetrieve(id);
    },
    enabled: !!id,
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to create a new feed container stock entry
 * @returns Mutation hook for creating feed container stock
 */
export function useCreateFeedContainerStock() {
  return useCrudMutation<FeedContainerStockCreate, FeedContainerStockCreate>({
    mutationFn: (data) => ApiService.apiV1InventoryFeedContainerStockCreate(data),
    description: "Feed stock added to container successfully",
    invalidateQueries: ["inventory", "feed-container-stock"],
  });
}

/**
 * Hook to update an existing feed container stock entry
 * @returns Mutation hook for updating feed container stock
 */
export function useUpdateFeedContainerStock() {
  return useCrudMutation<FeedContainerStock & { id: number }, FeedContainerStock>({
    mutationFn: (data) =>
      ApiService.apiV1InventoryFeedContainerStockUpdate(data.id, data),
    description: "Feed container stock updated successfully",
    invalidateQueries: ["inventory", "feed-container-stock"],
  });
}

/**
 * Hook to delete a feed container stock entry
 * @returns Mutation hook for deleting feed container stock
 */
export function useDeleteFeedContainerStock() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InventoryFeedContainerStockDestroy(id),
    description: "Feed container stock deleted successfully",
    invalidateQueries: ["inventory", "feed-container-stock"],
  });
}

// ============================================================================
// FeedingEvent CRUD Operations
// ============================================================================

/**
 * Hook to fetch paginated list of feeding events
 * @param filters - Optional filters for feeding events
 * @returns Query result with paginated feeding events
 */
export function useFeedingEvents(filters?: {
  batch?: number;
  container?: number;
  feed?: number;
  feedingDateAfter?: string;
  feedingDateBefore?: string;
  method?: 'MANUAL' | 'AUTOMATIC' | 'BROADCAST';
  ordering?: string;
  page?: number;
}): UseQueryResult<PaginatedFeedingEventList, Error> {
  return useQuery({
    queryKey: ["inventory", "feeding-events", filters],
    queryFn: () =>
      ApiService.apiV1InventoryFeedingEventsList(
        undefined, // amountMax
        undefined, // amountMin
        undefined, // area
        undefined, // areaIn
        filters?.batch,
        undefined, // batchIn
        undefined, // batchNumber
        filters?.container,
        undefined, // containerIn
        undefined, // containerName
        filters?.feed,
        undefined, // feedBrand
        undefined, // feedBrandIcontains
        undefined, // feedBrandIn
        undefined, // feedCarbohydratePercentageGte
        undefined, // feedCarbohydratePercentageLte
        undefined, // feedFatPercentageGte
        undefined, // feedFatPercentageLte
        undefined, // feedIn
        undefined, // feedProteinPercentageGte
        undefined, // feedProteinPercentageLte
        undefined, // feedSizeCategory
        undefined, // feedSizeCategoryIn
        undefined, // feedCostGte
        undefined, // feedCostLte
        undefined, // feedName
        undefined, // feedingDate
        filters?.feedingDateAfter,
        filters?.feedingDateBefore,
        undefined, // freshwaterStation
        undefined, // freshwaterStationIn
        undefined, // geography
        undefined, // geographyIn
        undefined, // hall
        undefined, // hallIn
        filters?.method,
        undefined, // methodIn
        filters?.ordering,
        filters?.page,
        undefined  // search
      ),
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch a single feeding event by ID
 * @param id - The feeding event ID
 * @returns Query result with the feeding event
 */
export function useFeedingEvent(
  id: number | undefined
): UseQueryResult<FeedingEvent, Error> {
  return useQuery({
    queryKey: ["inventory", "feeding-event", id],
    queryFn: () => {
      if (!id) throw new Error("Feeding event ID is required");
      return ApiService.apiV1InventoryFeedingEventsRetrieve(id);
    },
    enabled: !!id,
    ...INVENTORY_QUERY_OPTIONS,
  });
}

/**
 * Hook to create a new feeding event
 * @returns Mutation hook for creating feeding events
 */
export function useCreateFeedingEvent() {
  return useCrudMutation<FeedingEvent, FeedingEvent>({
    mutationFn: (data) => ApiService.apiV1InventoryFeedingEventsCreate(data),
    description: "Feeding event recorded successfully",
    invalidateQueries: [
      "inventory",
      "feeding-events",
      "batch-feeding-summaries",
      "feeding-events-summary",
    ],
  });
}

/**
 * Hook to update an existing feeding event
 * @returns Mutation hook for updating feeding events
 */
export function useUpdateFeedingEvent() {
  return useCrudMutation<FeedingEvent & { id: number }, FeedingEvent>({
    mutationFn: (data) =>
      ApiService.apiV1InventoryFeedingEventsUpdate(data.id, data),
    description: "Feeding event updated successfully",
    invalidateQueries: [
      "inventory",
      "feeding-events",
      "feeding-event",
      "batch-feeding-summaries",
      "feeding-events-summary",
    ],
  });
}

/**
 * Hook to delete a feeding event
 * @returns Mutation hook for deleting feeding events
 */
export function useDeleteFeedingEvent() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) =>
      ApiService.apiV1InventoryFeedingEventsDestroy(id),
    description: "Feeding event deleted successfully",
    invalidateQueries: [
      "inventory",
      "feeding-events",
      "batch-feeding-summaries",
      "feeding-events-summary",
    ],
  });
}

import { subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import type { FeedingEvent, FeedTypeUsage } from "@/hooks/useBatchFeedHistoryData";

/**
 * Format number with commas for display
 * 
 * @param num - Number to format
 * @returns Formatted string with thousands separators
 * 
 * @example
 * formatNumber(1234567.89) // "1,234,567.89"
 * formatNumber(0) // "0"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Calculate date range based on period filter selection
 * 
 * @param periodFilter - Filter period ("7", "30", "90", "week", "month", or custom)
 * @param customDateRange - Optional custom date range for "custom" filter
 * @returns Object with from and to dates
 * 
 * @example
 * getDateRangeFromPeriod("30") // Last 30 days
 * getDateRangeFromPeriod("week") // This week (Mon-Sun)
 */
export function getDateRangeFromPeriod(
  periodFilter: string,
  customDateRange?: { from?: Date; to?: Date }
): { from?: Date; to?: Date } {
  const now = new Date();
  
  switch (periodFilter) {
    case "7":
      return { from: subDays(now, 7), to: now };
    case "30":
      return { from: subDays(now, 30), to: now };
    case "90":
      return { from: subDays(now, 90), to: now };
    case "week":
      return { from: startOfWeek(now), to: endOfWeek(now) };
    case "month":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    default:
      return customDateRange || {};
  }
}

/**
 * Calculate days since batch start
 * 
 * @param batchStartDate - Date when batch started
 * @returns Number of days elapsed since batch start
 * 
 * @example
 * getDaysSinceStart(new Date('2023-05-08')) // Days from May 8, 2023 to now
 */
export function getDaysSinceStart(batchStartDate: Date): number {
  const today = new Date();
  return Math.ceil((today.getTime() - batchStartDate.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate total feed cost from feeding events
 * 
 * @param feedingEvents - Array of feeding event objects
 * @returns Total feed cost across all events
 * 
 * @example
 * calculateTotalFeedCost([{feedCost: 100}, {feedCost: 200}]) // 300
 * calculateTotalFeedCost([]) // 0
 */
export function calculateTotalFeedCost(feedingEvents: FeedingEvent[]): number {
  return feedingEvents.reduce((sum, event) => sum + (event.feedCost || 0), 0);
}

/**
 * Calculate average daily feed consumption
 * 
 * @param totalFeedKg - Total feed consumed in kg
 * @param daysSinceStart - Number of days since batch start
 * @returns Average daily feed in kg, or 0 if no data
 * 
 * @example
 * calculateAverageDailyFeed(1000, 10) // 100 kg/day
 * calculateAverageDailyFeed(0, 10) // 0
 * calculateAverageDailyFeed(1000, 0) // 0 (avoid division by zero)
 */
export function calculateAverageDailyFeed(
  totalFeedKg: number,
  daysSinceStart: number
): number {
  if (totalFeedKg === 0 || daysSinceStart === 0) {
    return 0;
  }
  return totalFeedKg / daysSinceStart;
}

/**
 * Get current Feed Conversion Ratio (FCR) from latest feeding summary
 * 
 * @param feedingSummaries - Array of feeding summary objects
 * @returns Current FCR value, or null if no data available
 * 
 * @example
 * getCurrentFCR([{fcr: 1.2}, {fcr: 1.25}]) // 1.25 (latest)
 * getCurrentFCR([]) // null (no data)
 */
export function getCurrentFCR(
  feedingSummaries: { fcr: number }[]
): number | null {
  if (feedingSummaries.length === 0) {
    return null;
  }
  const latestSummary = feedingSummaries[feedingSummaries.length - 1];
  return latestSummary?.fcr || null;
}

/**
 * Group feeding events by feed type and calculate usage statistics
 * 
 * Aggregates events by feed type + brand combination and calculates:
 * - Total amount consumed (kg)
 * - Total cost
 * - Number of feeding events
 * - Average amount per event
 * 
 * @param feedingEvents - Array of feeding event objects
 * @returns Array of feed type usage statistics
 * 
 * @example
 * const events = [
 *   {feedType: 'Pellet', feedBrand: 'BrandA', amountKg: 100, feedCost: 50},
 *   {feedType: 'Pellet', feedBrand: 'BrandA', amountKg: 150, feedCost: 75}
 * ];
 * groupFeedingEventsByType(events)
 * // [{feedType: 'Pellet', feedBrand: 'BrandA', totalAmountKg: 250, totalCost: 125, eventsCount: 2, averageAmountPerEvent: 125}]
 */
export function groupFeedingEventsByType(
  feedingEvents: FeedingEvent[]
): FeedTypeUsage[] {
  return feedingEvents.reduce((acc, event) => {
    const key = `${event.feedType}-${event.feedBrand}`;
    const existing = acc.find(item => `${item.feedType}-${item.feedBrand}` === key);
    
    if (existing) {
      existing.totalAmountKg += event.amountKg;
      existing.totalCost += event.feedCost || 0;
      existing.eventsCount += 1;
      existing.averageAmountPerEvent = existing.totalAmountKg / existing.eventsCount;
    } else {
      acc.push({
        feedType: event.feedType,
        feedBrand: event.feedBrand,
        totalAmountKg: event.amountKg,
        totalCost: event.feedCost || 0,
        eventsCount: 1,
        averageAmountPerEvent: event.amountKg
      });
    }
    
    return acc;
  }, [] as FeedTypeUsage[]);
}

/**
 * Filter feeding events based on feed type and container filters
 * 
 * @param feedingEvents - Array of feeding event objects
 * @param feedTypeFilter - Feed type filter ("all" or specific feed type)
 * @param containerFilter - Container filter ("all" or specific container name)
 * @returns Filtered array of feeding events
 * 
 * @example
 * filterFeedingEvents(events, "Pellet", "all") // Only pellet feed
 * filterFeedingEvents(events, "all", "Ring-1") // Only Ring-1 container
 * filterFeedingEvents(events, "all", "all") // All events (no filtering)
 */
export function filterFeedingEvents(
  feedingEvents: FeedingEvent[],
  feedTypeFilter: string,
  containerFilter: string
): FeedingEvent[] {
  return feedingEvents.filter(event => {
    const matchesFeedType = feedTypeFilter === "all" || event.feedType === feedTypeFilter;
    const matchesContainer = containerFilter === "all" || event.containerName === containerFilter;
    return matchesFeedType && matchesContainer;
  });
}

/**
 * Get unique values from feeding events for filter dropdowns
 * 
 * @param feedingEvents - Array of feeding event objects
 * @returns Object containing unique feed types and container names
 * 
 * @example
 * getUniqueFilterValues(events)
 * // {feedTypes: ['Pellet', 'Powder'], containers: ['Ring-1', 'Ring-2']}
 */
export function getUniqueFilterValues(feedingEvents: FeedingEvent[]): {
  feedTypes: string[];
  containers: string[];
} {
  return {
    feedTypes: [...new Set(feedingEvents.map(event => event.feedType))],
    containers: [...new Set(feedingEvents.map(event => event.containerName))]
  };
}


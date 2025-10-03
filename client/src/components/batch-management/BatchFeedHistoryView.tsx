import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Utensils } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBatchFeedHistoryData } from "@/hooks/useBatchFeedHistoryData";
import {
  formatNumber,
  getDateRangeFromPeriod,
  getDaysSinceStart,
  calculateTotalFeedCost,
  calculateAverageDailyFeed,
  getCurrentFCR,
  groupFeedingEventsByType,
  filterFeedingEvents,
  getUniqueFilterValues,
} from "@/features/batch-management/utils/feedHistoryHelpers";
import { FeedSummaryCards } from "./FeedSummaryCards";
import { FeedingEventsTab } from "./FeedingEventsTab";
import { FeedAnalyticsTab } from "./FeedAnalyticsTab";
import { PeriodSummariesTab } from "./PeriodSummariesTab";
import { FeedEfficiencyTab } from "./FeedEfficiencyTab";

interface BatchFeedHistoryViewProps {
  batchId: number;
  batchName: string;
}

export function BatchFeedHistoryView({ batchId, batchName }: BatchFeedHistoryViewProps) {
  const [activeTab, setActiveTab] = useState("events");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [periodFilter, setPeriodFilter] = useState("30");
  const [feedTypeFilter, setFeedTypeFilter] = useState("all");
  const [containerFilter, setContainerFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  // Calculate date range based on period filter
  const currentDateRange = getDateRangeFromPeriod(periodFilter, dateRange);

  // Calculate days since batch start for accurate daily average
  const batchStartDate = new Date('2023-05-08'); // From batch data
  const daysSinceStart = getDaysSinceStart(batchStartDate);

  // Fetch all feed history data via custom hook (with server-side filtering)
  const {
    feedingEvents,
    feedingSummaries,
    feedingSummary,
    allFeedTypes,
    allContainers,
    totalPages,
    totalEvents,
    isLoadingSummary,
    isLoadingFeedingEvents,
    isLoadingFeedTypes,
    isLoadingContainers,
  } = useBatchFeedHistoryData(batchId, currentPage, periodFilter, dateRange, containerFilter, feedTypeFilter);

  // Calculate derived metrics using helper functions
  const totalFeedConsumed = feedingSummary?.totalFeedKg || 0;
  const totalFeedCost = calculateTotalFeedCost(feedingEvents);
  const averageDailyFeed = calculateAverageDailyFeed(totalFeedConsumed, daysSinceStart);
  const currentFCR = getCurrentFCR(feedingSummaries);
  const feedTypeUsage = groupFeedingEventsByType(feedingEvents);

  // Get unique values for filters (from current page events)
  const { feedTypes: uniqueFeedTypes, containers: uniqueContainers } = 
    getUniqueFilterValues(feedingEvents);

  // No client-side filtering needed - server-side filtering handles it
  // Events are already filtered by the API based on containerFilter and feedTypeFilter
  const filteredEvents = feedingEvents;

  // Debug logging for summary data
  console.log('🔢 Summary Data Debug:', {
    summary: feedingSummary,
    totalFeedConsumed: formatNumber(totalFeedConsumed),
    averageDailyFeed: formatNumber(averageDailyFeed),
    daysSinceStart,
    isLoadingSummary,
    totalEvents,
    eventCount: feedingSummary?.eventsCount
  });

  // Debug logging for filters
  console.log('📊 FEED TYPES:', {
    'All available': allFeedTypes.length,
    'From current batch': uniqueFeedTypes.length,
    'All types': allFeedTypes,
    'Batch types': uniqueFeedTypes
  });

  console.log('📦 CONTAINERS:', {
    'All available (from assignments)': allContainers.length,
    'From current page events': uniqueContainers.length,
    'Assignment containers (first 10)': allContainers.slice(0, 10),
    'Event containers (first 10)': uniqueContainers.slice(0, 10),
    'Container filter value': containerFilter,
    'Sample feeding event': feedingEvents[0]
  });

  console.log('📈 EVENTS:', {
    'Total events': feedingEvents.length,
    'Filtered events': filteredEvents.length,
    'Current batch': batchId,
    'Date range': currentDateRange
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Utensils className="h-5 w-5 text-blue-500" />
            Feed History for {batchName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive feeding events and nutrition analytics
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FeedSummaryCards
        isLoadingSummary={isLoadingSummary}
        totalFeedConsumed={totalFeedConsumed}
        feedingSummaryEventsCount={feedingSummary?.eventsCount || totalEvents}
        totalEvents={totalEvents}
        totalFeedCost={totalFeedCost}
        averageDailyFeed={averageDailyFeed}
        daysSinceStart={daysSinceStart}
        currentFCR={currentFCR}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {activeTab === "events" && "Feeding Events"}
                  {activeTab === "analytics" && "Feed Analytics"}
                  {activeTab === "summaries" && "Period Summaries"}
                  {activeTab === "efficiency" && "Feed Efficiency"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="events">Feeding Events</SelectItem>
                <SelectItem value="analytics">Feed Analytics</SelectItem>
                <SelectItem value="summaries">Period Summaries</SelectItem>
                <SelectItem value="efficiency">Feed Efficiency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events">Feeding Events</TabsTrigger>
            <TabsTrigger value="analytics">Feed Analytics</TabsTrigger>
            <TabsTrigger value="summaries">Period Summaries</TabsTrigger>
            <TabsTrigger value="efficiency">Feed Efficiency</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="events" className="space-y-6">
          <FeedingEventsTab
            filteredEvents={filteredEvents}
            feedTypeFilter={feedTypeFilter}
            setFeedTypeFilter={setFeedTypeFilter}
            containerFilter={containerFilter}
            setContainerFilter={setContainerFilter}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalEvents={totalEvents}
            isLoadingFeedingEvents={isLoadingFeedingEvents}
            allFeedTypes={allFeedTypes}
            isLoadingFeedTypes={isLoadingFeedTypes}
            allContainers={allContainers}
            isLoadingContainers={isLoadingContainers}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FeedAnalyticsTab
            feedTypeUsage={feedTypeUsage}
            feedingEvents={feedingEvents}
            totalFeedConsumed={totalFeedConsumed}
          />
        </TabsContent>

        <TabsContent value="summaries" className="space-y-6">
          <PeriodSummariesTab
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            feedingSummaries={feedingSummaries}
            totalFeedConsumed={totalFeedConsumed}
            feedingSummary={feedingSummary}
            totalEvents={totalEvents}
            feedingEvents={feedingEvents}
            currentFCR={currentFCR}
            averageDailyFeed={averageDailyFeed}
            feedTypeUsage={feedTypeUsage}
            uniqueContainers={uniqueContainers}
            currentDateRange={currentDateRange}
          />
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <FeedEfficiencyTab
            currentFCR={currentFCR}
            totalFeedConsumed={totalFeedConsumed}
            totalFeedCost={totalFeedCost}
            feedTypeUsage={feedTypeUsage}
            feedingSummaries={feedingSummaries}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

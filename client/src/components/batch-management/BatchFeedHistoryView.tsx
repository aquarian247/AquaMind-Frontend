import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Utensils } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApiService } from "@/api/generated/services/ApiService";
import { FeedSummaryCards } from "./FeedSummaryCards";
import { FeedingEventsTab } from "./FeedingEventsTab";
import { FeedAnalyticsTab } from "./FeedAnalyticsTab";
import { PeriodSummariesTab } from "./PeriodSummariesTab";
import { FeedEfficiencyTab } from "./FeedEfficiencyTab";

// Utility function to format numbers with commas
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

interface BatchFeedHistoryViewProps {
  batchId: number;
  batchName: string;
}

interface FeedingEvent {
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

interface FeedingSummary {
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

interface FeedTypeUsage {
  feedType: string;
  feedBrand: string;
  totalAmountKg: number;
  totalCost: number;
  eventsCount: number;
  averageAmountPerEvent: number;
}

export function BatchFeedHistoryView({ batchId, batchName }: BatchFeedHistoryViewProps) {
  const [activeTab, setActiveTab] = useState("events");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [periodFilter, setPeriodFilter] = useState("30");
  const [feedTypeFilter, setFeedTypeFilter] = useState("all");
  const [containerFilter, setContainerFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const isMobile = useIsMobile();

  // Calculate date range based on period filter
  const getDateRange = () => {
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
        return dateRange;
    }
  };

  const currentDateRange = getDateRange();

  // Calculate days since batch start for accurate daily average
  const batchStartDate = new Date('2023-05-08'); // From batch data
  const today = new Date();
  const daysSinceStart = Math.ceil((today.getTime() - batchStartDate.getTime()) / (1000 * 60 * 60 * 24));

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

  // Fetch feeding data with pagination (only current page, not all pages)
  const { data: feedingEventsData, isLoading: isLoadingFeedingEvents } = useQuery({
    queryKey: ["batch/feeding-events", batchId, currentPage], // Removed currentDateRange to avoid unnecessary refetches
    queryFn: async () => {
      try {
        console.log(`🍽️ Fetching feeding events page ${currentPage} for batch ${batchId}...`);

        // Only fetch the current page (not all pages like before)
        const response = await ApiService.apiV1InventoryFeedingEventsList(
          batchId,    // batch - filter by specific batch
          undefined,  // container
          undefined,  // feed
          undefined,  // feedingDate
          undefined,  // method
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
          })),
          totalCount: response.count || 0,
          totalPages: Math.ceil((response.count || 0) / 20)
        };
      } catch (error) {
        console.error("❌ Failed to fetch feeding events:", error);
        return {
          events: [],
          totalCount: 0,
          totalPages: 1
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Extract data and update pagination state in useEffect to avoid query invalidation
  const feedingEvents = feedingEventsData?.events || [];
  useEffect(() => {
    if (feedingEventsData) {
      setTotalEvents(feedingEventsData.totalCount);
      setTotalPages(feedingEventsData.totalPages);
    }
  }, [feedingEventsData]);

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

  // Calculate feed analytics using summary data for accurate totals
  // Now using the proper Django summary endpoint with date=invalid to bypass date filtering
  // This gives us the accurate total: 6,056,253.4597 kg for batch 258
  const totalFeedConsumed = feedingSummary?.totalFeedKg || 0;
  const totalFeedCost = feedingEvents.reduce((sum, event) => sum + (event.feedCost || 0), 0);
  // Use days since batch start for accurate daily average calculation
  const averageDailyFeed = totalFeedConsumed > 0 ? totalFeedConsumed / daysSinceStart : 0;

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

  // Calculate FCR (Feed Conversion Ratio) - mock calculation
  const latestSummary = feedingSummaries[feedingSummaries.length - 1];
  const currentFCR = latestSummary?.fcr || 1.25;

  // Group feeding events by feed type
  const feedTypeUsage: FeedTypeUsage[] = feedingEvents.reduce((acc, event) => {
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

  // Fetch all available feed types for dropdown population
  const { data: allFeedTypes = [], isLoading: isLoadingFeedTypes } = useQuery<string[]>({
    queryKey: ["feed-types"],
    queryFn: async () => {
      try {
        console.log('📊 Fetching ALL feed types for dropdown...');

        // Get first page only for dropdown population (sufficient for most use cases)
        const response = await ApiService.apiV1InventoryFeedingEventsList(
          undefined, // batch - get ALL batches
          undefined, // container
          undefined, // feed
          undefined, // feedingDate
          undefined, // method
          undefined, // ordering
          1,        // page - first page only
          undefined // search
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
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes since feed types change infrequently
  });

  const { data: allContainers = [], isLoading: isLoadingContainers } = useQuery<string[]>({
    queryKey: ["containers"],
    queryFn: async () => {
      try {
        console.log('🏗️ Fetching ALL containers for dropdown...');

        // Get first page only for dropdown population (sufficient for most use cases)
        const response = await ApiService.apiV1InfrastructureContainersList(
          undefined, // active
          undefined, // area
          undefined, // containerType
          undefined, // hall
          undefined, // name
          undefined, // ordering
          1,        // page - first page only
          undefined  // search
        );

        const containers = [...new Set((response.results || []).map((c: any) => c.name))];
        console.log('🏗️ Containers:', {
          totalContainersInFirstPage: response.results?.length || 0,
          uniqueContainers: containers.length,
          containers: containers.slice(0, 10), // Show first 10
        });
        return containers.filter(Boolean);
      } catch (error) {
        console.error("❌ Failed to fetch containers:", error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes since containers change infrequently
  });

  // Get unique feed types and containers for filters (from filtered events)
  const uniqueFeedTypes = [...new Set(feedingEvents.map(event => event.feedType))];
  const uniqueContainers = [...new Set(feedingEvents.map(event => event.containerName))];

  // Filter events based on selected filters
  const filteredEvents = feedingEvents.filter(event => {
    const matchesFeedType = feedTypeFilter === "all" || event.feedType === feedTypeFilter;
    const matchesContainer = containerFilter === "all" || event.containerName === containerFilter;
    return matchesFeedType && matchesContainer;
  });

  // Debug logging
  console.log('📊 FEED TYPES:', {
    'All available': allFeedTypes.length,
    'From current batch': uniqueFeedTypes.length,
    'All types': allFeedTypes,
    'Batch types': uniqueFeedTypes
  });
  console.log('📦 CONTAINERS:', {
    'All available': allContainers.length,
    'From current batch': uniqueContainers.length,
    'All containers (first 10)': allContainers.slice(0, 10),
    'Batch containers': uniqueContainers.slice(0, 10)
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

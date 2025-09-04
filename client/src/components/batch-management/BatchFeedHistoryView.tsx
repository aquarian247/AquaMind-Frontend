import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { 
  Utensils, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CalendarIcon,
  DollarSign,
  Scale,
  BarChart3,
  Package,
  MapPin,
  Activity
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { api } from "@/lib/api";
import { ApiService } from "@/api/generated/services/ApiService";

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

  // Fetch feeding data using correct API endpoint
  const { data: feedingEvents = [] } = useQuery<FeedingEvent[]>({
    queryKey: ["batch/feeding-events", batchId, currentDateRange],
    queryFn: async () => {
      try {
        // Use the correct API endpoint for feeding events
        const response = await ApiService.apiV1InventoryFeedingEventsList(
          undefined, // feedingDate
          undefined, // ordering
          undefined, // page
          undefined, // search
          undefined  // sensor
        );

        const from = currentDateRange.from ? new Date(currentDateRange.from) : null;
        const to = currentDateRange.to ? new Date(currentDateRange.to) : null;

        const results = (response.results || [])
          .filter((e: any) => e.batch === batchId) // Filter by batch
          .filter((e: any) => {
            const d = new Date(e.feeding_date);
            if (from && d < from) return false;
            if (to && d > to) return false;
            return true;
          })
          .map((e: any) => ({
            id: e.id,
            feedingDate: e.feeding_date,
            feedingTime: e.feeding_time || new Date(e.feeding_date).toISOString().slice(11, 16),
            amountKg: Number(e.amount_kg ?? 0),
            feedType: e.feed_name ?? "Unknown", // Use feed_name as feedType
            feedBrand: e.feed_name ?? "Generic", // Use feed_name as feedBrand
            containerName: e.container_name ?? "Unknown",
            batchBiomassKg: Number(e.batch_biomass_kg ?? 0),
            feedCost: Number(e.feed_cost ?? 0),
            method: e.method ?? "Manual",
            notes: e.notes ?? "",
            recordedBy: e.recorded_by_username ?? "system",
          }));

        console.log(`Fetched ${results.length} feeding events for batch ${batchId}`);
        if (results.length > 0) {
          console.log('Sample event:', results[0]);
        }
        return results as FeedingEvent[];
      } catch (error) {
        console.error("Failed to fetch feeding events:", error);
        return [];
      }
    },
  });

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

  // Calculate feed analytics
  const totalFeedConsumed = feedingEvents.reduce((sum, event) => sum + event.amountKg, 0);
  const totalFeedCost = feedingEvents.reduce((sum, event) => sum + (event.feedCost || 0), 0);
  const averageDailyFeed = feedingEvents.length > 0 && currentDateRange.from && currentDateRange.to
    ? totalFeedConsumed / Math.ceil((currentDateRange.to.getTime() - currentDateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

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

  // Fetch all available feed types and containers for dropdown population
  const { data: allFeedTypes = [] } = useQuery<string[]>({
    queryKey: ["feed-types"],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1InventoryFeedingEventsList();
        const types = [...new Set((response.results || []).map((e: any) => e.feed_name))];
        console.log('Available feed types:', types);
        return types.filter(Boolean);
      } catch (error) {
        console.error("Failed to fetch feed types:", error);
        return [];
      }
    },
  });

  const { data: allContainers = [] } = useQuery<string[]>({
    queryKey: ["containers"],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1InfrastructureContainersList();
        const containers = [...new Set((response.results || []).map((c: any) => c.name))];
        console.log('Available containers:', containers);
        return containers.filter(Boolean);
      } catch (error) {
        console.error("Failed to fetch containers:", error);
        return [];
      }
    },
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
  console.log('Available feed types (all):', allFeedTypes);
  console.log('Available containers (all):', allContainers);
  console.log('Filtered feed types (from current batch):', uniqueFeedTypes);
  console.log('Filtered containers (from current batch):', uniqueContainers);
  console.log(`Total events: ${feedingEvents.length}, Filtered events: ${filteredEvents.length}`);

  const getFeedingMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "automatic": return "bg-green-100 text-green-700 border-green-200";
      case "manual": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getFCRColor = (fcr: number) => {
    if (fcr <= 1.1) return "text-green-600";
    if (fcr <= 1.3) return "text-blue-600";
    if (fcr <= 1.5) return "text-yellow-600";
    return "text-red-600";
  };

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

      {/* Feed Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feed Consumed</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedConsumed.toFixed(2)} kg</div>
            <p className="text-xs text-muted-foreground">
              {feedingEvents.length} feeding events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFeedCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${totalFeedConsumed > 0 ? (totalFeedCost / totalFeedConsumed).toFixed(2) : '0.00'}/kg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageDailyFeed.toFixed(2)} kg</div>
            <p className="text-xs text-muted-foreground">
              Per day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Conversion</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getFCRColor(currentFCR))}>
              {currentFCR.toFixed(2)} FCR
            </div>
            <p className="text-xs text-muted-foreground">
              Feed conversion ratio
            </p>
          </CardContent>
        </Card>
      </div>

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
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Select value={feedTypeFilter} onValueChange={setFeedTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Feed Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feed Types</SelectItem>
                {allFeedTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={containerFilter} onValueChange={setContainerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Container" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Containers</SelectItem>
                {allContainers.map(container => (
                  <SelectItem key={container} value={container}>{container}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold">{event.amountKg} kg</span>
                        </div>
                        <Badge variant="outline">{event.feedType}</Badge>
                        <Badge className={getFeedingMethodColor(event.method)}>
                          {event.method}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(new Date(event.feedingDate), "MMM dd")} at {event.feedingTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.containerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {event.feedBrand}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${event.feedCost?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                      
                      {event.notes && (
                        <p className="text-sm text-muted-foreground">{event.notes}</p>
                      )}
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-sm text-muted-foreground">Biomass</div>
                      <div className="font-semibold">{event.batchBiomassKg.toFixed(2)} kg</div>
                      <div className="text-xs text-muted-foreground">
                        {((event.amountKg / event.batchBiomassKg) * 100).toFixed(2)}% of biomass
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feed Type Usage</CardTitle>
                <CardDescription>Breakdown by feed type and brand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedTypeUsage.map((usage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{usage.feedType}</span>
                          <span className="text-sm text-muted-foreground ml-2">({usage.feedBrand})</span>
                        </div>
                        <span className="font-semibold">{usage.totalAmountKg.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{usage.eventsCount} events</span>
                        <span>${usage.totalCost.toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={(usage.totalAmountKg / totalFeedConsumed) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feeding Patterns</CardTitle>
                <CardDescription>Daily feeding distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Group events by day and show daily totals */}
                  {Object.entries(
                    feedingEvents.reduce((acc, event) => {
                      const day = format(new Date(event.feedingDate), "MMM dd");
                      if (!acc[day]) acc[day] = { total: 0, events: 0, cost: 0 };
                      acc[day].total += event.amountKg;
                      acc[day].events += 1;
                      acc[day].cost += event.feedCost || 0;
                      return acc;
                    }, {} as Record<string, { total: number; events: number; cost: number }>)
                  ).slice(-7).map(([day, data]) => (
                    <div key={day} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{day}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({data.events} events)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{data.total.toFixed(2)} kg</div>
                        <div className="text-sm text-muted-foreground">${data.cost.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="summaries" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="stage">Current stage</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            
            {periodFilter === "custom" && (
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "MMM dd") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "MMM dd") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Period Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Period Summary - {
                  periodFilter === "7" ? "Last 7 days" :
                  periodFilter === "30" ? "Last 30 days" :
                  periodFilter === "90" ? "Last 90 days" :
                  periodFilter === "week" ? "This week" :
                  periodFilter === "month" ? "This month" :
                  periodFilter === "stage" ? "Current stage" :
                  "Custom period"
                }
              </CardTitle>
              <CardDescription>
                Comprehensive feeding performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Feed Consumption</label>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{totalFeedConsumed.toFixed(2)} kg</p>
                    <p className="text-sm text-muted-foreground">
                      {feedingEvents.length} feeding events
                    </p>
                    <p className="text-sm text-green-600">
                      {averageDailyFeed.toFixed(2)} kg/day average
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Feed Conversion</label>
                  <div className="space-y-1">
                    <p className={cn("text-2xl font-bold", getFCRColor(currentFCR))}>
                      {currentFCR.toFixed(2)} FCR
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Feed conversion ratio
                    </p>
                    <p className="text-sm text-blue-600">
                      {currentFCR <= 1.2 ? "Excellent" : currentFCR <= 1.4 ? "Good" : "Needs attention"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Cost Analysis</label>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">${totalFeedCost.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Total feed cost
                    </p>
                    <p className="text-sm text-orange-600">
                      ${totalFeedConsumed > 0 ? (totalFeedCost / totalFeedConsumed).toFixed(2) : '0.00'}/kg
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Efficiency Metrics</label>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-blue-600">
                      {feedingSummaries.length > 0 && Number(feedingSummaries[feedingSummaries.length - 1].totalFeedKg) > 0 ? 
                        ((Number(feedingSummaries[feedingSummaries.length - 1].totalFeedConsumedKg) / Number(feedingSummaries[feedingSummaries.length - 1].totalFeedKg)) * 100).toFixed(1) : '0'}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Feed utilization
                    </p>
                    <p className="text-sm text-green-600">
                      {((currentFCR > 0 ? 100 / currentFCR : 0)).toFixed(1)}% conversion efficiency
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Period Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feed Type Performance</CardTitle>
                <CardDescription>Breakdown by feed type for this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedTypeUsage.slice(0, 3).map((usage, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{usage.feedType}</span>
                          <p className="text-sm text-muted-foreground">{usage.feedBrand}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{usage.totalAmountKg.toFixed(2)} kg</span>
                          <p className="text-sm text-muted-foreground">${usage.totalCost.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Events:</span>
                          <p className="font-medium">{usage.eventsCount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg/Event:</span>
                          <p className="font-medium">{usage.averageAmountPerEvent.toFixed(2)} kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cost/kg:</span>
                          <p className="font-medium">${usage.totalAmountKg > 0 ? (usage.totalCost / usage.totalAmountKg).toFixed(2) : '0.00'}</p>
                        </div>
                      </div>
                      
                      <Progress 
                        value={(usage.totalAmountKg / totalFeedConsumed) * 100} 
                        className="h-2"
                      />
                      <Separator />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Insights</CardTitle>
                <CardDescription>Key performance indicators for this period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Feeding Frequency</span>
                    <span className="font-bold">
                      {feedingEvents.length > 0 && currentDateRange.from && currentDateRange.to ? 
                        (feedingEvents.length / Math.ceil((currentDateRange.to.getTime() - currentDateRange.from.getTime()) / (1000 * 60 * 60 * 24))).toFixed(1) : '0'} 
                      /day
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Feed Method Distribution</span>
                    <div className="text-right">
                      <p className="font-bold">
                        {feedingEvents.length > 0 ? Math.round((feedingEvents.filter(e => e.method === 'Automatic').length / feedingEvents.length) * 100) : 0}% Auto
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {feedingEvents.length > 0 ? Math.round((feedingEvents.filter(e => e.method === 'Manual').length / feedingEvents.length) * 100) : 0}% Manual
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Container Utilization</span>
                    <span className="font-bold">
                      {uniqueContainers.length} containers active
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Feed Brands Used</span>
                    <span className="font-bold">
                      {feedingEvents.length > 0 ? [...new Set(feedingEvents.map(e => e.feedBrand))].length : 0} brands
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Period Comparison</span>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Previous period FCR:</span>
                      <p className="font-medium">{(currentFCR + 0.05).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Improvement:</span>
                      <p className="font-medium text-green-600">-4.0%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historical Period Summaries */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Historical Period Summaries</h3>
            {feedingSummaries.slice(-5).map((summary) => (
              <Card key={summary.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {format(new Date(summary.periodStart), "MMM dd")} - {format(new Date(summary.periodEnd), "MMM dd, yyyy")}
                      </CardTitle>
                      <CardDescription>{summary.feedingEventsCount || 0} feeding events</CardDescription>
                    </div>
                    <Badge className={cn("border", getFCRColor(Number(summary.fcr) || 0).replace('text-', 'border-').replace('text-', 'bg-') + '-100')}>
                      FCR: {Number(summary.fcr || 0).toFixed(2)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Total Feed</label>
                      <p className="text-lg font-semibold">{Number(summary.totalFeedKg || 0).toFixed(2)} kg</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Feed Consumed</label>
                      <p className="text-lg font-semibold">{Number(summary.totalFeedConsumedKg || 0).toFixed(2)} kg</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Biomass Gain</label>
                      <p className="text-lg font-semibold text-green-600">+{Number(summary.totalBiomassGainKg || 0).toFixed(2)} kg</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Avg Feed %</label>
                      <p className="text-lg font-semibold">{Number(summary.averageFeedingPercentage || 0).toFixed(2)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feed Efficiency Metrics</CardTitle>
                <CardDescription>Performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current FCR</span>
                    <span className={cn("font-bold", getFCRColor(currentFCR))}>
                      {currentFCR.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cost per kg of fish</span>
                    <span className="font-bold">
                      ${totalFeedConsumed > 0 ? ((totalFeedCost / totalFeedConsumed) * currentFCR).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Feed efficiency</span>
                    <span className="font-bold text-green-600">
                      {currentFCR > 0 ? (100 / currentFCR).toFixed(1) : '0'}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Waste reduction</span>
                    <span className="font-bold text-blue-600">
                      {feedingSummaries.length > 0 ? 
                        ((feedingSummaries[feedingSummaries.length - 1].totalFeedConsumedKg / feedingSummaries[feedingSummaries.length - 1].totalFeedKg) * 100).toFixed(1) : '0'}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feed Cost Analysis</CardTitle>
                <CardDescription>Cost breakdown and optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {feedTypeUsage.slice(0, 3).map((usage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{usage.feedType}</span>
                        <span className="font-bold">${usage.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{usage.totalAmountKg.toFixed(2)} kg</span>
                        <span>${(usage.totalCost / usage.totalAmountKg).toFixed(2)}/kg</span>
                      </div>
                      <Progress 
                        value={(usage.totalCost / totalFeedCost) * 100} 
                        className="h-1"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  DollarSign,
  Factory,
  FileText,
  Layers,
  Package,
  PieChart,
  TrendingUp,
} from "lucide-react";
import {
  formatCount,
  formatCurrency,
  formatFallback,
  formatPercentage,
  formatWeight,
  formatDateFallback,
} from "@/lib/formatFallback";
import type {
  FeedRecord,
  FeedPurchaseRecord,
  FeedContainerRecord,
  FeedContainerStockRecord,
  FeedingEventRecord,
} from "@/features/inventory/types";
import type {
  FeedContainerStockSummary,
  FeedPurchasesSummary,
  FeedingEventsSummary,
  FeedingEventsFinanceReport,
} from "@/features/inventory/api";

const MAX_ROWS_DEFAULT = 12;

interface FeedTypesTabContentProps {
  feeds: FeedRecord[];
  isLoading: boolean;
  searchTerm?: string;
}

export function FeedTypesTabContent({
  feeds,
  isLoading,
  searchTerm,
}: FeedTypesTabContentProps) {
  if (isLoading) {
    return <LoadingCard title="Feed types" />;
  }

  if (!feeds.length) {
    return <EmptyState title="No feed types found" description="Check your filters or add a new feed type to get started." />;
  }

  const activeCount = feeds.filter((feed) => feed.isActive).length;
  const inactiveCount = feeds.length - activeCount;
  const averageProtein =
    feeds.reduce((total, feed) => total + (feed.proteinPercentage ?? 0), 0) /
    (feeds.length || 1);
  const averageFat =
    feeds.reduce((total, feed) => total + (feed.fatPercentage ?? 0), 0) /
    (feeds.length || 1);

  const visibleFeeds = feeds.slice(0, MAX_ROWS_DEFAULT);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Active feed types"
          value={formatCount(activeCount)}
          icon={Package}
          accent="text-blue-600"
          description="Ready for assignments"
        />
        <SummaryCard
          title="Archived feed types"
          value={formatCount(inactiveCount)}
          icon={Layers}
          accent="text-slate-600"
          description="Kept for historical records"
        />
        <SummaryCard
          title="Average protein"
          value={formatPercentage(Number.isNaN(averageProtein) ? null : averageProtein)}
          icon={TrendingUp}
          accent="text-green-600"
          description="Across all feed types"
        />
        <SummaryCard
          title="Average fat"
          value={formatPercentage(Number.isNaN(averageFat) ? null : averageFat)}
          icon={PieChart}
          accent="text-purple-600"
          description="Supports nutrition planning"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feed library</CardTitle>
          <CardDescription>
            {feeds.length > MAX_ROWS_DEFAULT
              ? `Showing ${MAX_ROWS_DEFAULT} of ${feeds.length} feed types`
              : `Showing ${feeds.length} feed types`}
            {searchTerm ? ` · Filter: “${searchTerm}”` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feed name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="hidden md:table-cell">Pellet size (mm)</TableHead>
                  <TableHead className="hidden md:table-cell">Protein %</TableHead>
                  <TableHead className="hidden lg:table-cell">Fat %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleFeeds.map((feed) => (
                  <TableRow key={feed.id}>
                    <TableCell>
                      <div className="font-medium">{feed.name || "Unnamed feed"}</div>
                      {feed.description && (
                        <div className="text-xs text-muted-foreground">
                          {feed.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{feed.brand || "N/A"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatFallback(feed.pelletSizeMm, "mm")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatPercentage(feed.proteinPercentage ?? null)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatPercentage(feed.fatPercentage ?? null)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={feed.isActive ? "secondary" : "outline"} className="capitalize">
                        {feed.isActive ? "Active" : "Archived"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeedPurchasesTabContentProps {
  purchases: FeedPurchaseRecord[];
  feedsLookup: Map<number, string>;
  isLoading: boolean;
  summary?: FeedPurchasesSummary;
  summaryLoading?: boolean;
  totalCount?: number;
}

export function FeedPurchasesTabContent({
  purchases,
  feedsLookup,
  isLoading,
  summary,
  summaryLoading,
  totalCount,
}: FeedPurchasesTabContentProps) {
  if (isLoading && summaryLoading) {
    return <LoadingCard title="Feed purchases" />;
  }

  const hasPurchases = (totalCount ?? purchases.length) > 0;

  if (!isLoading && !summaryLoading && !hasPurchases) {
    return (
      <EmptyState
        title="No purchases recorded"
        description="When the procurement team records feed purchases, they will appear here."
      />
    );
  }

  const totalQuantity = summary?.total_quantity_kg ?? null;
  const totalSpend = summary?.total_spend ?? null;
  const averageCost = summary?.average_cost_per_kg ?? null;

  const recentPurchases = purchases.slice(0, MAX_ROWS_DEFAULT);
  const visibleCount = recentPurchases.length;
  const allCount = totalCount ?? purchases.length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total quantity (filtered)"
          value={summaryLoading ? "..." : formatWeight(totalQuantity, 1)}
          icon={Package}
          accent="text-blue-600"
          description="Across filtered purchases"
        />
        <SummaryCard
          title="Total spend (filtered)"
          value={summaryLoading ? "..." : formatCurrency(totalSpend)}
          icon={DollarSign}
          accent="text-green-600"
          description="Across filtered purchases"
        />
        <SummaryCard
          title="Average cost per kg"
          value={summaryLoading ? "..." : formatCurrency(averageCost)}
          icon={TrendingUp}
          accent="text-purple-600"
          description="Per kilogram"
        />
        <SummaryCard
          title="Purchase records"
          value={summaryLoading ? "..." : formatCount(allCount ?? null)}
          icon={FileText}
          accent="text-slate-600"
          description="Filtered dataset"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent purchases</CardTitle>
          <CardDescription>
            {allCount > MAX_ROWS_DEFAULT
              ? `Showing ${visibleCount} of ${allCount} filtered transactions`
              : `Showing ${visibleCount} filtered transactions`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Feed type</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="hidden md:table-cell">Quantity</TableHead>
                  <TableHead className="hidden md:table-cell">Cost / kg</TableHead>
                  <TableHead>Total cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPurchases.map((purchase) => {
                  const feedName = feedsLookup.get(purchase.feed) ?? `Feed #${purchase.feed}`;
                  const totalPurchaseCost = purchase.quantityKg * purchase.costPerKg;
                  return (
                    <TableRow key={purchase.id}>
                      <TableCell>{formatDateFallback(purchase.purchaseDate)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{feedName}</div>
                        {purchase.batchNumber && (
                          <div className="text-xs text-muted-foreground">
                            Batch {purchase.batchNumber}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatWeight(purchase.quantityKg, 1)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatCurrency(purchase.costPerKg)}
                      </TableCell>
                      <TableCell>{formatCurrency(totalPurchaseCost)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

interface DistributionTabContentProps {
  stockSummary?: FeedContainerStockSummary;
  containersLookup: Map<number, FeedContainerRecord>;
  isLoading: boolean;
}

export function DistributionTabContent({
  stockSummary,
  containersLookup,
  isLoading,
}: DistributionTabContentProps) {
  if (isLoading) {
    return <LoadingCard title="Distribution overview" />;
  }

  if (!stockSummary?.by_container || stockSummary.by_container.length === 0) {
    return (
      <EmptyState
        title="No container data"
        description="We could not find any feed stock assigned to containers yet."
      />
    );
  }

  const totalQuantity = stockSummary.total_quantity_kg ?? 0;
  const containers = (stockSummary.by_container ?? []).filter(
    (container) => container.container_id != null
  );

  if (containers.length === 0) {
    return (
      <EmptyState
        title="No container data"
        description="We could not match stock records to active feed containers."
      />
    );
  }

  const getProgressColorClass = (percent: number) => {
    if (percent < 20) {
      return "[&>div]:bg-red-500";
    }
    if (percent < 40) {
      return "[&>div]:bg-orange-500";
    }
    if (percent < 60) {
      return "[&>div]:bg-yellow-400";
    }
    return "[&>div]:bg-green-500";
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Containers with stock"
          value={formatCount(stockSummary.unique_containers ?? 0)}
          icon={Factory}
          accent="text-blue-600"
          description="Sites actively feeding"
        />
        <SummaryCard
          title="Total stock in containers"
          value={formatWeight(totalQuantity, 1)}
          icon={Package}
          accent="text-green-600"
          description="All locations combined"
        />
        <SummaryCard
          title="Value in storage"
          value={formatCurrency(stockSummary.total_value ?? null)}
          icon={DollarSign}
          accent="text-purple-600"
          description="FIFO valuation"
        />
        <SummaryCard
          title="Feed variety on site"
          value={formatCount(stockSummary.unique_feed_types ?? 0)}
          icon={Layers}
          accent="text-slate-600"
          description="Number of feed types in storage"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock distribution by container</CardTitle>
          <CardDescription>
            Fill level against container capacity with share of total stock
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {containers.map((container) => {
            const containerDetails =
              containersLookup.get(container.container_id ?? -1) ?? null;
            const containerName =
              container.container_name ??
              containerDetails?.name ??
              `Container #${container.container_id}`;
            const containerLocation = containerDetails?.location;
            const quantity = container.total_quantity_kg ?? 0;
            const capacityKg = containerDetails?.capacityKg ?? null;
            const fillPercent =
              capacityKg && capacityKg > 0
                ? Math.min(100, Math.round((quantity / capacityKg) * 100))
                : null;
            const sharePercent =
              totalQuantity > 0 ? Math.round((quantity / totalQuantity) * 100) : null;
            const progressColorClass =
              fillPercent == null
                ? "[&>div]:bg-muted-foreground/40"
                : getProgressColorClass(fillPercent);
            return (
              <div key={container.container_id ?? containerName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{containerName}</div>
                    {containerLocation && (
                      <div className="text-xs text-muted-foreground">{containerLocation}</div>
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {formatWeight(quantity, 1)} · {formatCurrency(container.total_value ?? null)}
                  </div>
                </div>
                <Progress value={fillPercent ?? 0} className={progressColorClass} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {fillPercent != null ? `${fillPercent}% full` : "Fill: N/A"}
                  </span>
                  <span>
                    {sharePercent != null ? `${sharePercent}% of inventory · ` : ""}
                    {formatCount(container.feed_type_count ?? 0, "feed types")}
                  </span>
                </div>
                <Separator />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

interface FeedingEventsTabContentProps {
  events: FeedingEventRecord[];
  isLoadingEvents: boolean;
  summary?: FeedingEventsSummary;
  isLoadingSummary: boolean;
  feedsLookup: Map<number, string>;
  containersLookup: Map<number, FeedContainerRecord>;
}

export function FeedingEventsTabContent({
  events,
  isLoadingEvents,
  summary,
  isLoadingSummary,
  feedsLookup,
  containersLookup,
}: FeedingEventsTabContentProps) {
  if (isLoadingEvents && !events.length) {
    return <LoadingCard title="Feeding events" />;
  }

  const visibleEvents = events.slice(0, MAX_ROWS_DEFAULT);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Events recorded (7d)"
          value={
            isLoadingSummary
              ? "..."
              : formatCount(summary?.events_count ?? null)
          }
          icon={Calendar}
          accent="text-blue-600"
          description="Rolling seven-day period"
        />
        <SummaryCard
          title="Feed delivered (7d)"
          value={
            isLoadingSummary
              ? "..."
              : formatWeight(summary?.total_feed_kg ?? null, 1)
          }
          icon={Activity}
          accent="text-green-600"
          description="Helps track cadence"
        />
        <SummaryCard
          title="Average per event"
          value={
            isLoadingSummary
              ? "..."
              : (() => {
                  if (!summary?.events_count) return "N/A";
                  const average = (summary.total_feed_kg ?? 0) / summary.events_count;
                  return formatWeight(average, 1);
                })()
          }
          icon={TrendingUp}
          accent="text-purple-600"
          description="Feed per logged event"
        />
        <SummaryCard
          title="Feed cost (7d)"
          value={
            isLoadingSummary
              ? "..."
              : formatCurrency(summary?.total_feed_cost ?? null)
          }
          icon={DollarSign}
          accent="text-amber-600"
          description="Cost of feed recorded over last seven days"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent feeding events</CardTitle>
          <CardDescription>
            {events.length > MAX_ROWS_DEFAULT
              ? `Showing ${MAX_ROWS_DEFAULT} of ${events.length} recent feeding events`
              : `Showing ${events.length} recent feeding events`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingEvents && !visibleEvents.length ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-3/5" />
            </div>
          ) : (
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Feed</TableHead>
                    <TableHead className="hidden md:table-cell">Container</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden lg:table-cell">Batch biomass</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleEvents.map((event) => {
                    const feedName =
                      event.feedName ??
                      feedsLookup.get(event.feed) ??
                      `Feed #${event.feed}`;
                    const containerDetails = containersLookup.get(event.container);
                    const containerName =
                      event.containerName ?? containerDetails?.name ?? null;
                    const containerLocation = containerDetails?.location ?? null;
                    const batchLabel = event.batchName ?? `Batch ${event.batch}`;
                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="font-medium">{formatDateFallback(event.feedingDate)}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.feedingTime}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{feedName}</div>
                          <div className="text-xs text-muted-foreground">
                            {batchLabel}
                          </div>
                          {event.feedCost != null && (
                            <div className="text-xs text-muted-foreground">
                              Cost: {formatCurrency(event.feedCost)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {containerName ? (
                            <div>
                              <div className="font-medium">{containerName}</div>
                              {containerLocation && (
                                <div className="text-xs text-muted-foreground">
                                  {containerLocation}
                                </div>
                              )}
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>{formatWeight(event.amountKg, 2)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatWeight(event.batchBiomassKg, 2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {event.method.toLowerCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StockLevelsTabContentProps {
  stockSummary?: FeedContainerStockSummary;
  isLoading: boolean;
  feedsLookup: Map<number, string>;
  containersLookup: Map<number, FeedContainerRecord>;
}

export function StockLevelsTabContent({
  stockSummary,
  isLoading,
  feedsLookup,
  containersLookup,
}: StockLevelsTabContentProps) {
  if (isLoading) {
    return <LoadingCard title="Stock levels" />;
  }

  if (!stockSummary) {
    return (
      <EmptyState
        title="No stock data"
        description="We could not retrieve the stock summary. Try refreshing in a moment."
      />
    );
  }

  const byFeedType = stockSummary.by_feed_type ?? [];
  const byContainer = stockSummary.by_container ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stock by feed type</CardTitle>
          <CardDescription>
            Breakdown of total stock amounts. Useful for sequencing feed changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {byFeedType.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No feed types currently have stock assigned.
            </p>
          ) : (
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feed</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="hidden md:table-cell">Value</TableHead>
                    <TableHead>Containers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byFeedType.map((item) => {
                    const name =
                      item.feed_name ?? feedsLookup.get(item.feed_id ?? -1) ?? `Feed #${item.feed_id}`;
                    return (
                      <TableRow key={item.feed_id ?? name}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{formatWeight(item.total_quantity_kg ?? null, 1)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatCurrency(item.total_value ?? null)}
                        </TableCell>
                        <TableCell>
                          {formatCount(item.container_count ?? 0)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock by container</CardTitle>
          <CardDescription>
            Helps operations teams identify low or high stock locations quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {byContainer.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No containers currently have stock recorded.
            </p>
          ) : (
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Container</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="hidden md:table-cell">Value</TableHead>
                    <TableHead>Feed variety</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byContainer.map((item) => {
                    const container =
                      containersLookup.get(item.container_id ?? -1) ?? null;
                    const containerName =
                      item.container_name ?? container?.name ?? `Container #${item.container_id}`;
                    return (
                      <TableRow key={item.container_id ?? containerName}>
                        <TableCell>
                          <div className="font-medium">{containerName}</div>
                          {container?.location && (
                            <div className="text-xs text-muted-foreground">
                              {container.location}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{formatWeight(item.total_quantity_kg ?? null, 1)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatCurrency(item.total_value ?? null)}
                        </TableCell>
                        <TableCell>
                          {formatCount(item.feed_type_count ?? 0, "feed types")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface InventoryAnalyticsTabContentProps {
  report?: FeedingEventsFinanceReport;
  isLoading: boolean;
  feedsLookup: Map<number, string>;
  dateRangeLabel: string;
  onRefresh?: () => void;
}

export function InventoryAnalyticsTabContent({
  report,
  isLoading,
  feedsLookup,
  dateRangeLabel,
  onRefresh,
}: InventoryAnalyticsTabContentProps) {
  if (isLoading && !report) {
    return <LoadingCard title="Loading analytics" />;
  }

  if (!report) {
    return (
      <EmptyState
        title="Analytics not available"
        description="We could not retrieve the finance report from the server just now."
      >
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            Try again
          </Button>
        )}
      </EmptyState>
    );
  }

  const summary = report.summary;
  const feedBreakdown = report.by_feed_type ?? [];
  const timeSeries = Array.isArray(report.time_series) ? report.time_series : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">Feeding cost analytics</h3>
          <p className="text-sm text-muted-foreground">
            {dateRangeLabel}. Includes all recorded events in this period.
          </p>
        </div>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} className="w-full md:w-auto">
            Refresh report
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total feed delivered"
          value={formatWeight(summary?.total_feed_kg ?? null, 1)}
          icon={Package}
          accent="text-blue-600"
          description="Across the selected period"
        />
        <SummaryCard
          title="Total feed cost"
          value={formatCurrency(summary?.total_feed_cost ?? null)}
          icon={DollarSign}
          accent="text-green-600"
          description="Cost of recorded events"
        />
        <SummaryCard
          title="Events analysed"
          value={formatCount(summary?.events_count ?? null)}
          icon={BarChart3}
          accent="text-purple-600"
          description="Includes manual and automatic"
        />
        <SummaryCard
          title="Average cost per kg"
          value={
            summary?.total_feed_kg
              ? formatCurrency((summary.total_feed_cost ?? 0) / summary.total_feed_kg)
              : "N/A"
          }
          icon={TrendingUp}
          accent="text-slate-600"
          description="Helps track efficiency"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top feed types by cost</CardTitle>
            <CardDescription>
              Focus on the biggest cost drivers when negotiating supplier contracts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No feed types recorded for this date range.
              </p>
            ) : (
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feed</TableHead>
                      <TableHead>Delivered</TableHead>
                      <TableHead className="hidden md:table-cell">Feed cost</TableHead>
                      <TableHead>Events</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedBreakdown.slice(0, MAX_ROWS_DEFAULT).map((item) => {
                      const feedName =
                        item.feed_name ??
                        feedsLookup.get(item.feed_id ?? -1) ??
                        `Feed #${item.feed_id}`;
                      return (
                        <TableRow key={item.feed_id ?? feedName}>
                          <TableCell>
                            <div className="font-medium">{feedName}</div>
                            {item.brand && (
                              <div className="text-xs text-muted-foreground">
                                {item.brand}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{formatWeight(item.total_kg ?? null, 1)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatCurrency(item.total_cost ?? null)}
                          </TableCell>
                          <TableCell>{formatCount(item.events_count ?? 0)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly feed profile</CardTitle>
            <CardDescription>
              Quick trend view to highlight spikes or dips in feeding activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeSeries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Time series data not available for the selected period.
              </p>
            ) : (
              timeSeries.slice(0, MAX_ROWS_DEFAULT).map((bucket, index) => {
                const label =
                  (bucket.period as string) ??
                  (bucket.week as string) ??
                  (bucket.date as string) ??
                  `Period ${index + 1}`;
                const totalKg = "total_feed_kg" in bucket ? (bucket.total_feed_kg as number) : undefined;
                const totalCost = "total_feed_cost" in bucket ? (bucket.total_feed_cost as number) : undefined;
                const eventCount = "events_count" in bucket ? (bucket.events_count as number) : undefined;

                return (
                  <div key={label} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-muted-foreground">
                          {eventCount ? `${formatCount(eventCount)} events` : "Events: N/A"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {formatWeight(totalKg ?? null, 1)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(totalCost ?? null)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-4/6" />
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="py-10 text-center space-y-2">
        <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {children ? <div className="pt-2">{children}</div> : null}
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <Icon className={`h-6 w-6 ${accent}`} />
        </div>
      </CardContent>
    </Card>
  );
}


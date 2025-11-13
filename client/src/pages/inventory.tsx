import { createElement, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  MapPin,
  Scale,
  Truck,
  Plus,
  Settings,
  BarChart3,
  Boxes,
  ClipboardList,
  Factory
} from "lucide-react";
import { ApiService } from "@/api/generated/services/ApiService";
import HierarchicalFilter, { OperationsOverview } from "@/components/layout/hierarchical-filter";
import {
  useFeedingEventsSummaryLastDays,
  useFeedContainerStockSummary,
  useFeedingEventsFinanceReport,
} from "@/features/inventory/api";
import {
  FeedTypesTabContent,
  FeedPurchasesTabContent,
  DistributionTabContent,
  FeedingEventsTabContent,
  StockLevelsTabContent,
  InventoryAnalyticsTabContent,
} from "@/features/inventory/components/InventoryTabsContent";
import {
  FeedRecord,
  FeedPurchaseRecord,
  FeedContainerRecord,
  FeedContainerStockRecord,
  FeedingEventRecord,
} from "@/features/inventory/types";
import { formatCount, formatWeight, formatCurrency } from "@/lib/formatFallback";

const api = {
  async getFeedTypes(): Promise<{ results: FeedRecord[] }> {
    try {
      const response = await ApiService.apiV1InventoryFeedsList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedRecord[] = list.map((f: any) => ({
        id: f.feed_id ?? f.id,
        name: f.name ?? "",
        brand: f.brand ?? "",
        sizeCategory: String(f.size_category ?? "SMALL").toUpperCase() as any,
        pelletSizeMm: f.pellet_size_mm != null ? Number(f.pellet_size_mm) : undefined,
        proteinPercentage: f.protein_percentage != null ? Number(f.protein_percentage) : undefined,
        fatPercentage: f.fat_percentage != null ? Number(f.fat_percentage) : undefined,
        carbohydratePercentage: f.carbohydrate_percentage != null ? Number(f.carbohydrate_percentage) : undefined,
        description: f.description ?? "",
        isActive: Boolean(f.active ?? f.is_active ?? true),
        createdAt: f.created_at ?? new Date().toISOString(),
        updatedAt: f.updated_at ?? new Date().toISOString(),
      }));
      return { results: mapped };
    } catch (error) {
      console.error("Failed to fetch feed types:", error);
      throw new Error("Failed to fetch feed types");
    }
  },

  async getFeedPurchases(): Promise<{ results: FeedPurchaseRecord[] }> {
    try {
      const response = await ApiService.apiV1InventoryFeedPurchasesList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedPurchaseRecord[] = list.map((p: any) => ({
        id: p.id ?? p.feed_purchase_id,
        feed: p.feed,
        purchaseDate: p.purchase_date ?? p.date ?? new Date().toISOString(),
        quantityKg: Number(p.quantity_kg ?? p.quantity ?? 0),
        costPerKg: Number(p.cost_per_kg ?? p.unit_cost ?? 0),
        supplier: p.supplier ?? "Unknown",
        batchNumber: p.batch_number ?? undefined,
        expiryDate: p.expiry_date ?? undefined,
        notes: p.notes ?? undefined,
        createdAt: p.created_at ?? new Date().toISOString(),
        updatedAt: p.updated_at ?? new Date().toISOString(),
      }));
      return { results: mapped };
    } catch (error) {
      console.error("Failed to fetch feed purchases:", error);
      throw new Error("Failed to fetch feed purchases");
    }
  },

  async getFeedContainers(): Promise<{ results: FeedContainerRecord[] }> {
    try {
      const response = await ApiService.apiV1InfrastructureFeedContainersList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedContainerRecord[] = list.map((c: any) => ({
        id: c.id ?? c.feed_container_id,
        name: c.name ?? "Container",
        capacityKg: Number(c.capacity_kg ?? c.capacity ?? 0),
        location: c.location ?? c.hall_name ?? undefined,
        containerType: c.container_type ?? "BARGE", // Backend returns 'SILO' | 'BARGE' | 'TANK' | 'OTHER' (uppercase)
        isActive: Boolean(c.active ?? c.is_active ?? true),
        createdAt: c.created_at ?? new Date().toISOString(),
        updatedAt: c.updated_at ?? new Date().toISOString(),
      }));
      return { results: mapped };
    } catch (error) {
      console.error("Failed to fetch feed containers:", error);
      throw new Error("Failed to fetch feed containers");
    }
  },

  // Note: FeedStock model removed in backend migration 0014 (deprecated in favor of FIFO via FeedContainerStock)

  async getFeedingEvents(): Promise<{ results: FeedingEventRecord[] }> {
    try {
      const response = await ApiService.apiV1InventoryFeedingEventsList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedingEventRecord[] = list.map((e: any) => ({
        id: e.id ?? e.feeding_event_id,
        batch: e.batch ?? 0,
        container: e.container ?? 0,
        feed: e.feed ?? 0,
        feedingDate: e.feeding_date ?? e.date ?? new Date().toISOString(),
        feedingTime: e.feeding_time ?? "08:00",
        amountKg: Number(e.amount_kg ?? e.amount ?? 0),
        batchBiomassKg: Number(e.batch_biomass_kg ?? e.biomass_kg ?? 0),
        feedingPercentage: e.feeding_percentage != null ? Number(e.feeding_percentage) : undefined,
        feedCost: e.feed_cost != null ? Number(e.feed_cost) : undefined,
        method: e.method ?? "MANUAL",
        notes: e.notes ?? undefined,
        recordedBy: e.recorded_by ?? undefined,
        createdAt: e.created_at ?? new Date().toISOString(),
        updatedAt: e.updated_at ?? new Date().toISOString(),
      }));
      return { results: mapped };
    } catch (error) {
      console.error("Failed to fetch feeding events:", error);
      throw new Error("Failed to fetch feeding events");
    }
  },

  async getFeedContainerStock(): Promise<{ results: FeedContainerStockRecord[] }> {
    try {
      const response = await ApiService.apiV1InventoryFeedContainerStockList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedContainerStockRecord[] = list.map((cs: any) => ({
        id: cs.id ?? cs.feed_container_stock_id,
        feedContainer: cs.feed_container ?? 0,
        feedPurchase: cs.feed_purchase ?? 0,
        quantityKg: Number(cs.quantity_kg ?? cs.quantity ?? 0),
        costPerKg: Number(cs.cost_per_kg ?? cs.unit_cost ?? 0),
        purchaseDate: cs.purchase_date ?? new Date().toISOString(),
        createdAt: cs.created_at ?? new Date().toISOString(),
        updatedAt: cs.updated_at ?? new Date().toISOString(),
      }));
      return { results: mapped };
    } catch (error) {
      console.error("Failed to fetch container stock:", error);
      throw new Error("Failed to fetch container stock");
    }
  },

};

export default function Inventory() {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [selectedGeography, setSelectedGeography] = useState("all");
  const [, setLocation] = useLocation();
  // Data queries
  const { data: feedTypesData, isLoading: feedTypesLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feeds/"],
    queryFn: api.getFeedTypes,
  });

  const { data: purchasesData, isLoading: purchasesLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-purchases/"],
    queryFn: api.getFeedPurchases,
  });

  const { data: containersData, isLoading: containersLoading } = useQuery({
    queryKey: ["/api/v1/infrastructure/feed-containers/"],
    queryFn: api.getFeedContainers,
  });

  // Note: FeedStock model removed in backend migration 0014 (deprecated in favor of FIFO via FeedContainerStock)

  const { data: feedingEventsData, isLoading: feedingEventsLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feeding-events/"],
    queryFn: api.getFeedingEvents,
  });

  // ✅ SERVER-SIDE AGGREGATION: Get feeding events summary for the last 7 days
  // Replaces client-side daily queries + summation with single backend call
  const { 
    data: feedingEventsSummaryData, 
    isLoading: feedingEventsSummaryLoading 
  } = useFeedingEventsSummaryLastDays(7);

  const { data: containerStockData, isLoading: containerStockLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-container-stock/"],
    queryFn: api.getFeedContainerStock,
  });

  const { data: stockSummary, isLoading: stockSummaryLoading } = useFeedContainerStockSummary();

  const analyticsRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    const formatter = new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    });
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      label: `${formatter.format(start)} – ${formatter.format(end)}`,
    };
  }, []);

  const {
    data: financeReport,
    isLoading: financeReportLoading,
    refetch: refetchFinanceReport,
  } = useFeedingEventsFinanceReport({
    startDate: analyticsRange.startDate,
    endDate: analyticsRange.endDate,
    groupBy: "week",
    includeTimeSeries: true,
  });

  // Get infrastructure data for real counts
  const { data: infrastructureData } = useQuery({
    queryKey: ["infrastructure"],
    queryFn: () => Promise.all([
      ApiService.apiV1InfrastructureGeographiesList(),
      ApiService.apiV1InfrastructureAreasList(),
      ApiService.apiV1InfrastructureFreshwaterStationsList(),
      ApiService.apiV1InfrastructureContainersList(),
      ApiService.apiV1BatchBatchesList()
    ]),
  });

  const feedTypes = feedTypesData?.results || [];
  const purchases = purchasesData?.results || [];
  const containers = containersData?.results || [];
  // Note: feedStock removed (model deprecated in backend)
  const feedingEvents = feedingEventsData?.results || [];
  const containerStock = containerStockData?.results || [];
  const [filters, setFilters] = useState<Record<string, any>>({});
  // Extract feeding events summary data (now contains summed totals for last 7 days)
  const feedingEventsSummary = feedingEventsSummaryData;

  const feedNameLookup = useMemo(
    () =>
      new Map(
        feedTypes.map((feed) => [feed.id, feed.name || `Feed #${feed.id}`])
      ),
    [feedTypes]
  );

  const containerLookup = useMemo(
    () =>
      new Map(
        containers.map((container) => [container.id, container])
      ),
    [containers]
  );

  const searchTerm =
    typeof filters.searchTerm === "string" ? filters.searchTerm.trim() : "";
  const normalizedSearchTerm = searchTerm.toLowerCase();
  const hasSearch = normalizedSearchTerm.length > 0;

  const filteredFeedTypes = hasSearch
    ? feedTypes.filter((feed) => {
        const name = feed.name?.toLowerCase() ?? "";
        const brand = feed.brand?.toLowerCase() ?? "";
        return (
          name.includes(normalizedSearchTerm) ||
          brand.includes(normalizedSearchTerm)
        );
      })
    : feedTypes;

  const filteredPurchases = hasSearch
    ? purchases.filter((purchase) => {
        const supplier = purchase.supplier?.toLowerCase() ?? "";
        const feedName = feedNameLookup.get(purchase.feed)?.toLowerCase() ?? "";
        return (
          supplier.includes(normalizedSearchTerm) ||
          feedName.includes(normalizedSearchTerm)
        );
      })
    : purchases;

  const filteredFeedingEvents = hasSearch
    ? feedingEvents.filter((event) => {
        const feedName = feedNameLookup.get(event.feed)?.toLowerCase() ?? "";
        const containerName =
          containerLookup.get(event.container)?.name?.toLowerCase() ?? "";
        const batchId = String(event.batch ?? "");
        return (
          feedName.includes(normalizedSearchTerm) ||
          containerName.includes(normalizedSearchTerm) ||
          batchId.includes(normalizedSearchTerm)
        );
      })
    : feedingEvents;

  // Extract real data from API responses
  const geographies = infrastructureData?.[0]?.results || [];
  const areas = infrastructureData?.[1]?.results || [];
  const freshwaterStations = infrastructureData?.[2]?.results || [];
  const allContainers = infrastructureData?.[3]?.results || [];
  const batches = infrastructureData?.[4]?.results || [];

  // Calculate real metrics for OperationsOverview (inventory-specific)
  // Total Sites = Areas + Freshwater Stations (not geographies, as there are only 2 in production)
  const totalSites = areas.length + freshwaterStations.length;
  
  // Active infrastructure containers (for context)
  const activePensTanks = allContainers.filter((c: any) => c.active).length;
  
  // Active batches (check for ACTIVE status, case-insensitive)
  const activeBatches = batches.filter((b: any) => 
    b.status?.toUpperCase() === 'ACTIVE' || !b.status
  ).length;
  
  // Feed container capacity utilization (inventory focus, not infrastructure containers)
  // Calculates: (total feed currently in stock) / (total feed container capacity) * 100
  // - totalFeedCapacity: Sum of all infrastructure_feedcontainer.capacity_kg
  // - totalFeedStock: Sum of all inventory_feedcontainerstock.quantity_kg (FIFO inventory)
  // - Result: Percentage showing how full feed containers are across all locations
  // - Note: FeedStock model deprecated, now using FeedContainerStock (FIFO)
  const totalFeedCapacity = containers.reduce(
    (sum: number, container) => sum + (container.capacityKg ?? 0),
    0
  );
  const totalFeedStock = stockSummary?.total_quantity_kg ?? 0;
  const capacityUtilization =
    totalFeedCapacity > 0
      ? Math.min(100, Math.round((totalFeedStock / totalFeedCapacity) * 100))
      : 0;

  // Calculate dashboard metrics using aggregation summary
  const totalInventoryValue = stockSummary?.total_value ?? 0;
  const totalQuantity = totalFeedStock;

  const recentFeedingEvents = [...filteredFeedingEvents]
    .sort((a, b) => new Date(b.feedingDate).getTime() - new Date(a.feedingDate).getTime())
    .slice(0, 10);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Navigation menu items based on Django model and slides inspiration
  const navigationSections = [
    { id: "dashboard", label: "Overview", icon: BarChart3 },
    { id: "feed-types", label: "Feed Types", icon: Settings },
    { id: "purchases", label: "Purchases", icon: Truck },
    { id: "distribution", label: "Distribution", icon: Factory },
    { id: "feeding-events", label: "Feeding Events", icon: ClipboardList },
    { id: "container-stock", label: "Stock Levels", icon: Boxes },
    { id: "fcr-analysis", label: "Analytics", icon: TrendingUp },
  ];

  // Check if any data is still loading
  const isLoading = feedTypesLoading || purchasesLoading || containersLoading ||
                   feedingEventsLoading || feedingEventsSummaryLoading ||
                   containerStockLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Feed Inventory Management</h1>
          <p className="text-gray-600 mt-2">Loading FIFO inventory system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Feed Inventory Management</h1>
            <p className="text-muted-foreground">
              FIFO tracking, cost optimization, and FCR monitoring
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={selectedGeography} onValueChange={setSelectedGeography}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Geography" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Geographies</SelectItem>
              {geographies.map((geo: any) => (
                <SelectItem key={geo.id} value={geo.name.toLowerCase().replace(' ', '-')}>
                  {geo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setLocation('/inventory/manage')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Manage Inventory
          </Button>
        </div>
      </div>

      {/* Operations Overview for Large Scale */}
      <OperationsOverview
        totalSites={totalSites}
        activePensTanks={activePensTanks}
        activeBatches={activeBatches}
        capacityUtilization={capacityUtilization}
        totalSitesSubtext={`${areas.length} Areas, ${freshwaterStations.length} Stations`}
        activePensTanksLabel="Active Containers"
        capacityUtilizationSubtext="Feed stock vs capacity"
      />

      {/* Feed Inventory Summary KPIs - 4 Status Boxes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalInventoryValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Aggregated FIFO valuation across all containers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feed Stock</CardTitle>
            <Scale className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatWeight(totalQuantity, 1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {containers.filter(c => c.isActive).length} feed containers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Feed Containers</CardTitle>
            <Factory className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {containers.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {containers.filter(c => c.isActive && c.containerType === 'SILO').length} Silo, {containers.filter(c => c.isActive && c.containerType === 'BARGE').length} Barge
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feeding Events</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {feedingEventsSummaryLoading 
                ? "..." 
                : formatCount(feedingEventsSummary?.events_count ?? null)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days ({formatWeight(feedingEventsSummary?.total_feed_kg ?? null)})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hierarchical Filtering for Large Scale Operations */}
      <HierarchicalFilter onFilterChange={handleFilterChange} showBatches={true} />

      {/* Navigation Menu */}
      <div className="space-y-4">
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Select value={activeSection} onValueChange={setActiveSection}>
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center space-x-2">
                  {navigationSections.find(s => s.id === activeSection)?.icon &&
                    createElement(navigationSections.find(s => s.id === activeSection)!.icon, { className: "h-4 w-4" })
                  }
                  <span>{navigationSections.find(s => s.id === activeSection)?.label}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {navigationSections.map((section) => {
                const Icon = section.icon;
                return (
                  <SelectItem key={section.id} value={section.id}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{section.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex bg-muted rounded-lg p-1">
          {navigationSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <section.icon className="h-4 w-4" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Overview */}
      {activeSection === "dashboard" && (
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Feeding Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentFeedingEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Batch {event.batch}</p>
                        <p className="text-sm text-gray-600">{event.feedingDate} - {event.amountKg}kg</p>
                      </div>
                      <Badge variant="outline">{event.method || "Manual"}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Stock Levels</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {containerStock.slice(0, 5).map((stock) => (
                    <div key={stock.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Container {stock.feedContainer}</p>
                        <p className="text-sm text-gray-600">{formatWeight(stock.quantityKg, 0)}</p>
                      </div>
                      <Progress
                        value={totalQuantity > 0 ? Math.min(100, (stock.quantityKg / totalQuantity) * 100) : 0}
                        className="w-20"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeSection === "feed-types" && (
        <FeedTypesTabContent
          feeds={filteredFeedTypes}
          isLoading={feedTypesLoading}
          searchTerm={searchTerm || undefined}
        />
      )}

      {activeSection === "purchases" && (
        <FeedPurchasesTabContent
          purchases={filteredPurchases}
          feedsLookup={feedNameLookup}
          isLoading={purchasesLoading}
        />
      )}

      {activeSection === "distribution" && (
        <DistributionTabContent
          stockSummary={stockSummary}
          containersLookup={containerLookup}
          isLoading={stockSummaryLoading}
        />
      )}

      {activeSection === "feeding-events" && (
        <FeedingEventsTabContent
          events={filteredFeedingEvents}
          isLoadingEvents={feedingEventsLoading}
          summary={feedingEventsSummary}
          isLoadingSummary={feedingEventsSummaryLoading}
          feedsLookup={feedNameLookup}
          containersLookup={containerLookup}
        />
      )}

      {activeSection === "container-stock" && (
        <StockLevelsTabContent
          stockSummary={stockSummary}
          isLoading={stockSummaryLoading}
          feedsLookup={feedNameLookup}
          containersLookup={containerLookup}
        />
      )}

      {activeSection === "fcr-analysis" && (
        <InventoryAnalyticsTabContent
          report={financeReport}
          isLoading={financeReportLoading}
          feedsLookup={feedNameLookup}
          dateRangeLabel={analyticsRange.label}
          onRefresh={refetchFinanceReport}
        />
      )}
    </div>
  );
}

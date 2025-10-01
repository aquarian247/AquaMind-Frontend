import { useState } from "react";
import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  MapPin,
  Scale,
  Truck,
  AlertTriangle,
  Plus,
  Settings,
  BarChart3,
  Boxes,
  ClipboardList,
  Factory
} from "lucide-react";
import { ApiService } from "@/api/generated/services/ApiService";
import HierarchicalFilter, { OperationsOverview } from "@/components/layout/hierarchical-filter";
import { useFeedingEventsSummaryLastDays } from "@/features/inventory/api";
import { formatCount, formatWeight } from "@/lib/formatFallback";

// Types based on Django data model section 3.3
interface Feed {
  id: number;
  name: string;
  brand: string;
  sizeCategory: 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';
  pelletSizeMm?: number;
  proteinPercentage?: number;
  fatPercentage?: number;
  carbohydratePercentage?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FeedPurchase {
  id: number;
  feed: number;
  purchaseDate: string;
  quantityKg: string;
  costPerKg: string;
  supplier: string;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FeedContainer {
  id: number;
  name: string;
  capacity: string;
  location?: string;
  containerType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FeedStock {
  id: number;
  feed: number;
  feedContainer: number;
  currentQuantityKg: string;
  reorderThresholdKg: string;
  updatedAt: string;
  notes?: string;
}

interface FeedingEvent {
  id: number;
  batch: number;
  container: number;
  feed: number;
  feedingDate: string;
  feedingTime: string;
  amountKg: string;
  batchBiomassKg: string;
  feedingPercentage?: string;
  feedCost?: string;
  method: string;
  notes?: string;
  recordedBy?: number;
  createdAt: string;
  updatedAt: string;
}

interface FeedContainerStock {
  id: number;
  feedContainer: number;
  feedPurchase: number;
  quantityKg: string;
  costPerKg: string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

interface BatchFeedingSummary {
  id: number;
  batch: number;
  periodStart: string;
  periodEnd: string;
  totalFeedKg: string;
  averageBiomassKg?: string;
  averageFeedingPercentage?: string;
  feedConversionRatio?: string;
  totalFeedConsumedKg?: string;
  totalBiomassGainKg?: string;
  fcr?: string;
  createdAt: string;
  updatedAt: string;
}

// Form validation schemas
const feedSchema = z.object({
  name: z.string().min(1, "Feed name is required"),
  brand: z.string().min(1, "Brand is required"),
  sizeCategory: z.enum(["MICRO", "SMALL", "MEDIUM", "LARGE"]),
  pelletSizeMm: z.string().optional(),
  proteinPercentage: z.string().optional(),
  fatPercentage: z.string().optional(),
  carbohydratePercentage: z.string().optional(),
  description: z.string().optional(),
});

const purchaseSchema = z.object({
  feed: z.string().min(1, "Feed type is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  quantityKg: z.string().min(1, "Quantity is required"),
  costPerKg: z.string().min(1, "Cost per kg is required"),
  supplier: z.string().min(1, "Supplier is required"),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
});

const feedDistributionSchema = z.object({
  feedPurchase: z.string().min(1, "Feed purchase is required"),
  targetContainer: z.string().min(1, "Target container is required"),
  amountKg: z.string().min(1, "Amount is required"),
  distributionDate: z.string().min(1, "Distribution date is required"),
  notes: z.string().optional(),
});

const feedingEventSchema = z.object({
  batch: z.string().min(1, "Batch is required"),
  feedContainer: z.string().min(1, "Feed container is required"),
  feed: z.string().min(1, "Feed type is required"),
  feedingDate: z.string().min(1, "Feeding date is required"),
  feedingTime: z.string().min(1, "Feeding time is required"),
  amountKg: z.string().min(1, "Amount is required"),
  batchBiomassKg: z.string().min(1, "Batch biomass is required"),
  method: z.string().min(1, "Feeding method is required"),
  notes: z.string().optional(),
});

const api = {
  async getFeedTypes(): Promise<{ results: Feed[] }> {
    try {
      const response = await ApiService.apiV1InventoryFeedsList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: Feed[] = list.map((f: any) => ({
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

  async getFeedPurchases(): Promise<{ results: FeedPurchase[] }> {
    try {
      const response = await ApiService.apiV1InventoryFeedPurchasesList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedPurchase[] = list.map((p: any) => ({
        id: p.id ?? p.feed_purchase_id,
        feed: p.feed,
        purchaseDate: p.purchase_date ?? p.date ?? new Date().toISOString(),
        quantityKg: String(p.quantity_kg ?? p.quantity ?? "0"),
        costPerKg: String(p.cost_per_kg ?? p.unit_cost ?? "0"),
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

  async getFeedContainers(): Promise<{ results: FeedContainer[] }> {
    try {
      const response = await ApiService.apiV1InfrastructureFeedContainersList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedContainer[] = list.map((c: any) => ({
        id: c.id ?? c.feed_container_id,
        name: c.name ?? "Container",
        capacity: String(c.capacity_kg ?? c.capacity ?? "0"),
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

  async getFeedStock(): Promise<{ results: FeedStock[] }> {
    try {
      const response = await ApiService.apiV1InventoryFeedStocksList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedStock[] = list.map((s: any) => ({
        id: s.id ?? s.feed_stock_id,
        feed: s.feed,
        feedContainer: s.feed_container ?? s.container ?? 0,
        currentQuantityKg: String(s.current_quantity_kg ?? s.quantity_kg ?? s.quantity ?? "0"),
        reorderThresholdKg: String(s.reorder_threshold_kg ?? s.reorder_threshold ?? "0"),
        updatedAt: s.updated_at ?? new Date().toISOString(),
        notes: s.notes ?? undefined,
      }));
      return { results: mapped };
    } catch (error) {
      console.error("Failed to fetch feed stock:", error);
      throw new Error("Failed to fetch feed stock");
    }
  },

  async getFeedingEvents(): Promise<{ results: FeedingEvent[] }> {
    try {
      const response = await ApiService.apiV1InventoryFeedingEventsList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedingEvent[] = list.map((e: any) => ({
        id: e.id ?? e.feeding_event_id,
        batch: e.batch ?? 0,
        container: e.container ?? 0,
        feed: e.feed ?? 0,
        feedingDate: e.feeding_date ?? e.date ?? new Date().toISOString(),
        feedingTime: e.feeding_time ?? "08:00",
        amountKg: String(e.amount_kg ?? e.amount ?? "0"),
        batchBiomassKg: String(e.batch_biomass_kg ?? e.biomass_kg ?? "0"),
        feedingPercentage: e.feeding_percentage != null ? String(e.feeding_percentage) : undefined,
        feedCost: e.feed_cost != null ? String(e.feed_cost) : undefined,
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

  async getFeedContainerStock(): Promise<{ results: FeedContainerStock[] }> {
    try {
      const response = await ApiService.apiV1InventoryFeedContainerStockList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: FeedContainerStock[] = list.map((cs: any) => ({
        id: cs.id ?? cs.feed_container_stock_id,
        feedContainer: cs.feed_container ?? 0,
        feedPurchase: cs.feed_purchase ?? 0,
        quantityKg: String(cs.quantity_kg ?? cs.quantity ?? "0"),
        costPerKg: String(cs.cost_per_kg ?? cs.unit_cost ?? "0"),
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

  async getBatchFeedingSummaries(): Promise<{ results: BatchFeedingSummary[] }> {
    try {
      const response = await ApiService.apiV1InventoryBatchFeedingSummariesList();
      const list: any[] = (response as any)?.results ?? [];
      const mapped: BatchFeedingSummary[] = list.map((b: any) => ({
        id: b.id ?? b.batch_feeding_summary_id,
        batch: b.batch ?? 0,
        periodStart: b.period_start ?? new Date().toISOString(),
        periodEnd: b.period_end ?? new Date().toISOString(),
        totalFeedKg: String(b.total_feed_kg ?? b.total_feed ?? "0"),
        averageBiomassKg: b.average_biomass_kg != null ? String(b.average_biomass_kg) : undefined,
        averageFeedingPercentage: b.average_feeding_percentage != null ? String(b.average_feeding_percentage) : undefined,
        feedConversionRatio: b.feed_conversion_ratio != null ? String(b.feed_conversion_ratio) : undefined,
        totalFeedConsumedKg: b.total_feed_consumed_kg != null ? String(b.total_feed_consumed_kg) : undefined,
        totalBiomassGainKg: b.total_biomass_gain_kg != null ? String(b.total_biomass_gain_kg) : undefined,
        fcr: b.fcr != null ? String(b.fcr) : undefined,
        createdAt: b.created_at ?? new Date().toISOString(),
        updatedAt: b.updated_at ?? new Date().toISOString(),
      }));
      return { results: mapped };
    } catch (error) {
      console.error("Failed to fetch feeding summaries:", error);
      throw new Error("Failed to fetch feeding summaries");
    }
  },

};

export default function Inventory() {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [selectedGeography, setSelectedGeography] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();



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

  const { data: stockData, isLoading: stockLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-stocks/"],
    queryFn: api.getFeedStock,
  });

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

  const { data: summariesData, isLoading: summariesLoading } = useQuery({
    queryKey: ["/api/v1/inventory/batch-feeding-summaries/"],
    queryFn: api.getBatchFeedingSummaries,
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
  const feedStock = stockData?.results || [];
  const feedingEvents = feedingEventsData?.results || [];
  const containerStock = containerStockData?.results || [];
  const summaries = summariesData?.results || [];

  // Extract feeding events summary data (now contains summed totals for last 7 days)
  const feedingEventsSummary = feedingEventsSummaryData;

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
  // - totalFeedStock: Sum of all inventory_feedstock.current_quantity_kg
  // - Result: Percentage showing how full feed containers are across all locations
  // - If no feed test data exists, feedStock.length === 0, so utilization = 0%
  const totalFeedCapacity = containers.reduce((sum, c) => sum + parseFloat(c.capacity), 0);
  const totalFeedStock = feedStock.reduce((sum, s) => sum + parseFloat(s.currentQuantityKg), 0);
  const capacityUtilization = totalFeedCapacity > 0 
    ? Math.round((totalFeedStock / totalFeedCapacity) * 100) 
    : 0;

  // Calculate dashboard metrics
  const totalInventoryValue = containerStock.reduce((sum, item) => 
    sum + (parseFloat(item.quantityKg) * parseFloat(item.costPerKg)), 0
  );

  const totalQuantity = containerStock.reduce((sum, item) => sum + parseFloat(item.quantityKg), 0);

  const averageFCR = summaries.length > 0
    ? summaries.reduce((sum, s) => parseFloat(s.fcr || "0"), 0) / summaries.length
    : null; // Let UI handle missing FCR data

  const recentFeedingEvents = feedingEvents
    .sort((a, b) => new Date(b.feedingDate).getTime() - new Date(a.feedingDate).getTime())
    .slice(0, 10);

  // Form handling
  const feedForm = useForm<z.infer<typeof feedSchema>>({
    resolver: zodResolver(feedSchema),
    defaultValues: {
      name: "",
      brand: "",
      sizeCategory: "SMALL",
      pelletSizeMm: "",
      proteinPercentage: "",
      fatPercentage: "",
      carbohydratePercentage: "",
      description: "",
    },
  });

  const purchaseForm = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      feed: "",
      purchaseDate: "",
      quantityKg: "",
      costPerKg: "",
      supplier: "",
      batchNumber: "",
      expiryDate: "",
      notes: "",
    },
  });

  const distributionForm = useForm<z.infer<typeof feedDistributionSchema>>({
    resolver: zodResolver(feedDistributionSchema),
    defaultValues: {
      feedPurchase: "",
      targetContainer: "",
      amountKg: "",
      distributionDate: "",
      notes: "",
    },
  });

  const feedingForm = useForm<z.infer<typeof feedingEventSchema>>({
    resolver: zodResolver(feedingEventSchema),
    defaultValues: {
      batch: "",
      feedContainer: "",
      feed: "",
      feedingDate: "",
      feedingTime: "",
      amountKg: "",
      batchBiomassKg: "",
      method: "MANUAL",
      notes: "",
    },
  });

  const [filters, setFilters] = useState({});

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
                   stockLoading || feedingEventsLoading || feedingEventsSummaryLoading ||
                   containerStockLoading || summariesLoading;

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
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Feed
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
              ${totalInventoryValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              FIFO calculated value
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
              {(totalQuantity / 1000).toFixed(1)}k kg
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
                : formatCount(feedingEventsSummaryData?.events_count)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days ({formatWeight(feedingEventsSummaryData?.total_feed_kg)})
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
                    React.createElement(navigationSections.find(s => s.id === activeSection)!.icon, { className: "h-4 w-4" })
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
                        <p className="text-sm text-gray-600">{parseFloat(stock.quantityKg).toLocaleString()} kg</p>
                      </div>
                      <Progress
                        value={Math.min(100, (parseFloat(stock.quantityKg) / 1000) * 10)}
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

      {/* Other sections */}
      {activeSection !== "dashboard" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This section is under development.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

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
        containerType: c.container_type_name ?? c.type ?? "Barge",
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

  const { data: containerStockData, isLoading: containerStockLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-container-stock/"],
    queryFn: api.getFeedContainerStock,
  });

  const { data: summariesData, isLoading: summariesLoading } = useQuery({
    queryKey: ["/api/v1/inventory/batch-feeding-summaries/"],
    queryFn: api.getBatchFeedingSummaries,
  });

  const feedTypes = feedTypesData?.results || [];
  const purchases = purchasesData?.results || [];
  const containers = containersData?.results || [];
  const feedStock = stockData?.results || [];
  const feedingEvents = feedingEventsData?.results || [];
  const containerStock = containerStockData?.results || [];
  const summaries = summariesData?.results || [];

  // Calculate dashboard metrics
  const totalInventoryValue = containerStock.reduce((sum, item) => 
    sum + (parseFloat(item.quantityKg) * parseFloat(item.costPerKg)), 0
  );

  const totalQuantity = containerStock.reduce((sum, item) => sum + parseFloat(item.quantityKg), 0);

  const averageFCR = summaries.length > 0 
    ? summaries.reduce((sum, s) => parseFloat(s.fcr || "0"), 0) / summaries.length
    : 0;

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

  // Check if any data is still loading
  const isLoading = feedTypesLoading || purchasesLoading || containersLoading || 
                   stockLoading || feedingEventsLoading || containerStockLoading || summariesLoading;

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

  // Navigation menu items based on Django model and slides inspiration
  const navigationSections = [
    { id: "dashboard", label: "Feedstock Dashboard", icon: BarChart3 },
    { id: "feed-types", label: "Feed Types", icon: Settings },
    { id: "purchases", label: "Purchase Registration", icon: Truck },
    { id: "distribution", label: "Feed Distribution", icon: Factory },
    { id: "feeding-events", label: "Feeding Events", icon: ClipboardList },
    { id: "container-stock", label: "Container/Barge Stock", icon: Boxes },
    { id: "fcr-analysis", label: "Batch FCR Analysis", icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Feed Inventory Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">FIFO tracking, cost optimization, and FCR monitoring</p>
      </div>

      {/* KPI Cards - Always Visible */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="touch-manipulation">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium leading-tight">
              <span className="hidden sm:inline">Total Inventory Value</span>
              <span className="sm:hidden">Inventory</span>
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold">
              <span className="hidden sm:inline">${totalInventoryValue.toLocaleString()}</span>
              <span className="sm:hidden">${(totalInventoryValue / 1000).toFixed(0)}k</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">FIFO calculated value</span>
              <span className="sm:hidden">FIFO value</span>
            </p>
          </CardContent>
        </Card>

        <Card className="touch-manipulation">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium leading-tight">
              <span className="hidden sm:inline">Total Feed Stock</span>
              <span className="sm:hidden">Feed Stock</span>
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold">
              <span className="hidden sm:inline">{totalQuantity.toLocaleString()} kg</span>
              <span className="sm:hidden">{(totalQuantity / 1000).toFixed(1)}t</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">Across all containers</span>
              <span className="sm:hidden">All containers</span>
            </p>
          </CardContent>
        </Card>

        <Card className="touch-manipulation">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium leading-tight">
              <span className="hidden sm:inline">Average FCR</span>
              <span className="sm:hidden">Avg FCR</span>
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold">
              {averageFCR.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">Feed conversion ratio</span>
              <span className="sm:hidden">Conversion</span>
            </p>
          </CardContent>
        </Card>

        <Card className="touch-manipulation">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium leading-tight">
              <span className="hidden sm:inline">Active Containers</span>
              <span className="sm:hidden">Containers</span>
            </CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold">
              {containers.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">Currently in use</span>
              <span className="sm:hidden">In use</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Menu - Health Style */}
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
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {navigationSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  activeSection === section.id 
                    ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${
                    activeSection === section.id ? "text-blue-600" : "text-gray-600"
                  }`} />
                  <p className={`text-sm font-medium ${
                    activeSection === section.id ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-100"
                  }`}>
                    {section.label}
                  </p>
                </CardContent>
              </Card>
            );
          })}
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

      {/* Feed Types Management */}
      {activeSection === "feed-types" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Feed Types</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Feed Type</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Feed Type</DialogTitle>
                  <DialogDescription>Create a new feed type for inventory management</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Feed Name</Label>
                      <Input id="name" placeholder="Enter feed name" />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" placeholder="Enter brand" />
                    </div>
                  </div>
                  <Button className="w-full">Create Feed Type</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedTypes.map((feed) => (
              <Card key={feed.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{feed.name}</span>
                    <Badge variant={feed.isActive ? "default" : "secondary"}>
                      {feed.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Brand:</strong> {feed.brand}</p>
                    <p className="text-sm"><strong>Size:</strong> {feed.sizeCategory}</p>
                    {feed.proteinPercentage && (
                      <p className="text-sm"><strong>Protein:</strong> {feed.proteinPercentage}%</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other sections simplified for brevity */}
      {activeSection !== "dashboard" && activeSection !== "feed-types" && (
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

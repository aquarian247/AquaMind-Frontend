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
    const response = await fetch("/api/v1/inventory/feed-types/");
    if (!response.ok) throw new Error("Failed to fetch feed types");
    return response.json();
  },

  async getFeedPurchases(): Promise<{ results: FeedPurchase[] }> {
    const response = await fetch("/api/v1/inventory/feed-purchases/");
    if (!response.ok) throw new Error("Failed to fetch feed purchases");
    return response.json();
  },

  async getFeedContainers(): Promise<{ results: FeedContainer[] }> {
    const response = await fetch("/api/v1/inventory/feed-containers/");
    if (!response.ok) throw new Error("Failed to fetch feed containers");
    return response.json();
  },

  async getFeedStock(): Promise<{ results: FeedStock[] }> {
    const response = await fetch("/api/v1/inventory/feed-stock/");
    if (!response.ok) throw new Error("Failed to fetch feed stock");
    return response.json();
  },

  async getFeedingEvents(): Promise<{ results: FeedingEvent[] }> {
    const response = await fetch("/api/v1/inventory/feeding-events/");
    if (!response.ok) throw new Error("Failed to fetch feeding events");
    return response.json();
  },

  async getFeedContainerStock(): Promise<{ results: FeedContainerStock[] }> {
    const response = await fetch("/api/v1/inventory/feed-container-stock/");
    if (!response.ok) throw new Error("Failed to fetch container stock");
    return response.json();
  },

  async getBatchFeedingSummaries(): Promise<{ results: BatchFeedingSummary[] }> {
    const response = await fetch("/api/v1/inventory/batch-feeding-summaries/");
    if (!response.ok) throw new Error("Failed to fetch feeding summaries");
    return response.json();
  },
};

export default function Inventory() {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [selectedGeography, setSelectedGeography] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();



  // Data queries
  const { data: feedTypesData, isLoading: feedTypesLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-types/"],
    queryFn: api.getFeedTypes,
  });

  const { data: purchasesData, isLoading: purchasesLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-purchases/"],
    queryFn: api.getFeedPurchases,
  });

  const { data: containersData, isLoading: containersLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-containers/"],
    queryFn: api.getFeedContainers,
  });

  const { data: stockData, isLoading: stockLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-stock/"],
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
                        <p className="font-medium">Container {stock.containerId}</p>
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
            </Card>

            <Card>
 
                            control={feedForm.control}
                            name="brand"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., EWOS" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={feedForm.control}
                            name="sizeCategory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Size Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="MICRO">Micro</SelectItem>
                                    <SelectItem value="SMALL">Small</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="LARGE">Large</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={feedForm.control}
                            name="pelletSizeMm"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pellet Size (mm)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.1" placeholder="e.g., 3.5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={feedForm.control}
                            name="proteinPercentage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Protein %</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.1" placeholder="e.g., 45.0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={feedForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Feed specifications and notes..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">Add Feed Type</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile-optimized feed types list */}
              <div className="block sm:hidden space-y-4">
                {feedTypes.map((feed) => (
                  <Card key={feed.id} className="p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-base">{feed.name}</h4>
                      <Badge variant={feed.isActive ? "default" : "secondary"}>
                        {feed.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Brand:</span> {feed.brand}</p>
                      <p><span className="font-medium">Size:</span> <Badge variant="outline" className="ml-1">{feed.sizeCategory}</Badge></p>
                      <p><span className="font-medium">Protein:</span> {feed.proteinPercentage}%</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Size Category</TableHead>
                      <TableHead>Protein %</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedTypes.map((feed) => (
                      <TableRow key={feed.id}>
                        <TableCell className="font-medium">{feed.name}</TableCell>
                        <TableCell>{feed.brand}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{feed.sizeCategory}</Badge>
                        </TableCell>
                        <TableCell>{feed.proteinPercentage}%</TableCell>
                        <TableCell>
                          <Badge variant={feed.isActive ? "default" : "secondary"}>
                            {feed.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Purchase Registration */}
      {activeSection === "purchases" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Feed Purchase Registration</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Register Purchase
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register Feed Purchase</DialogTitle>
                    </DialogHeader>
                    <Form {...purchaseForm}>
                      <form className="space-y-4">
                        <FormField
                          control={purchaseForm.control}
                          name="feed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Feed Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select feed type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {feedTypes.map((feed) => (
                                    <SelectItem key={feed.id} value={feed.id.toString()}>
                                      {feed.name} - {feed.brand}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={purchaseForm.control}
                            name="purchaseDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Purchase Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={purchaseForm.control}
                            name="supplier"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Supplier</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Marine Harvest" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={purchaseForm.control}
                            name="quantityKg"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity (kg)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="e.g., 1000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={purchaseForm.control}
                            name="costPerKg"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cost per kg ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="e.g., 1.25" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="submit" className="w-full">Register Purchase</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost/kg</TableHead>
                    <TableHead>Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => {
                    const feedType = feedTypes.find(f => f.id === purchase.feed);
                    return (
                      <TableRow key={purchase.id}>
                        <TableCell>{new Date(purchase.purchaseDate).toLocaleDateString()}</TableCell>
                        <TableCell>{feedType?.name}</TableCell>
                        <TableCell>{purchase.supplier}</TableCell>
                        <TableCell>{parseFloat(purchase.quantityKg).toLocaleString()} kg</TableCell>
                        <TableCell>${parseFloat(purchase.costPerKg).toFixed(2)}</TableCell>
                        <TableCell>
                          ${(parseFloat(purchase.quantityKg) * parseFloat(purchase.costPerKg)).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feed Distribution */}
      {activeSection === "distribution" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Factory className="h-5 w-5" />
                  <span>Feed Distribution Management</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Distribute Feed
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Distribute Feed to Container</DialogTitle>
                      <DialogDescription>
                        Move feed from un-distributed inventory to silos (freshwater stations) or barges (sea areas).
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...distributionForm}>
                      <form className="space-y-4">
                        <FormField
                          control={distributionForm.control}
                          name="feedPurchase"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Source Feed Purchase (FIFO Order)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select feed purchase batch" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {purchases
                                    .filter(purchase => {
                                      // Show only purchases with available stock
                                      const usedStock = containerStock
                                        .filter(cs => cs.feedPurchase === purchase.id)
                                        .reduce((sum, cs) => sum + parseFloat(cs.quantityKg), 0);
                                      return parseFloat(purchase.quantityKg) > usedStock;
                                    })
                                    .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime())
                                    .map((purchase) => {
                                      const feedType = feedTypes.find(f => f.id === purchase.feed);
                                      const usedStock = containerStock
                                        .filter(cs => cs.feedPurchase === purchase.id)
                                        .reduce((sum, cs) => sum + parseFloat(cs.quantityKg), 0);
                                      const available = parseFloat(purchase.quantityKg) - usedStock;
                                      
                                      return (
                                        <SelectItem key={purchase.id} value={purchase.id.toString()}>
                                          {feedType?.name} - {purchase.batchNumber} 
                                          ({available.toLocaleString()} kg available)
                                        </SelectItem>
                                      );
                                    })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={distributionForm.control}
                          name="targetContainer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Container (Silo/Barge)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select destination container" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {containers
                                    .filter(container => container.isActive)
                                    .map((container) => (
                                      <SelectItem key={container.id} value={container.id.toString()}>
                                        {container.name} ({container.containerType}) - {container.location}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={distributionForm.control}
                            name="amountKg"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount (kg)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="e.g., 500" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={distributionForm.control}
                            name="distributionDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Distribution Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={distributionForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Distribution notes..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full">Distribute Feed</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Un-distributed Inventory (FIFO)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {purchases
                          .map(purchase => {
                            const usedStock = containerStock
                              .filter(cs => cs.feedPurchase === purchase.id)
                              .reduce((sum, cs) => sum + parseFloat(cs.quantityKg), 0);
                            const available = parseFloat(purchase.quantityKg) - usedStock;
                            const feedType = feedTypes.find(f => f.id === purchase.feed);
                            
                            return { ...purchase, available, feedType };
                          })
                          .filter(item => item.available > 0)
                          .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime())
                          .map((item, index) => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <div>
                                <p className="font-semibold">#{index + 1} - {item.feedType?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.batchNumber} • {item.supplier}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{item.available.toLocaleString()} kg</p>
                                <p className="text-sm text-muted-foreground">
                                  ${parseFloat(item.costPerKg).toFixed(2)}/kg
                                </p>
                              </div>
                            </div>
                          ))}
                        {purchases.every(p => {
                          const usedStock = containerStock
                            .filter(cs => cs.feedPurchase === p.id)
                            .reduce((sum, cs) => sum + parseFloat(cs.quantityKg), 0);
                          return parseFloat(p.quantityKg) <= usedStock;
                        }) && (
                          <p className="text-muted-foreground text-center py-4">No un-distributed inventory</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Distributions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {containerStock
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 8)
                          .map((stock) => {
                            const container = containers.find(c => c.id === stock.feedContainer);
                            const purchase = purchases.find(p => p.id === stock.feedPurchase);
                            
                            return (
                              <div key={stock.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-semibold">{container?.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {purchase?.batchNumber} • {new Date(stock.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{parseFloat(stock.quantityKg).toLocaleString()} kg</p>
                                  <p className="text-sm text-muted-foreground">{container?.containerType}</p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feeding Events */}
      {activeSection === "feeding-events" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ClipboardList className="h-5 w-5" />
                  <span>Feeding Events Management</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Record Feeding Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record Feeding Event</DialogTitle>
                      <DialogDescription>
                        Record feed consumption with automatic FIFO deduction and location constraint validation.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...feedingForm}>
                      <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={feedingForm.control}
                            name="batch"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Salmon Batch</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select batch" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1">Batch 2024-A01 (Station A, Hall 1)</SelectItem>
                                    <SelectItem value="2">Batch 2024-A02 (Station A, Hall 2)</SelectItem>
                                    <SelectItem value="3">Batch 2024-B01 (Area B, Sea Pen 1)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={feedingForm.control}
                            name="feedContainer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Feed Container</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select feed source" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {containers
                                      .filter(container => {
                                        // Location-based filtering logic would go here
                                        // For now, show all active containers with stock
                                        const hasStock = containerStock.some(cs => 
                                          cs.feedContainer === container.id && parseFloat(cs.quantityKg) > 0
                                        );
                                        return container.isActive && hasStock;
                                      })
                                      .map((container) => {
                                        const totalStock = containerStock
                                          .filter(cs => cs.feedContainer === container.id)
                                          .reduce((sum, cs) => sum + parseFloat(cs.quantityKg), 0);
                                        
                                        return (
                                          <SelectItem key={container.id} value={container.id.toString()}>
                                            {container.name} ({totalStock.toLocaleString()} kg available)
                                          </SelectItem>
                                        );
                                      })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={feedingForm.control}
                          name="feed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Feed Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select feed type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {feedTypes.map((feed) => (
                                    <SelectItem key={feed.id} value={feed.id.toString()}>
                                      {feed.name} ({feed.sizeCategory}) - {feed.brand}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={feedingForm.control}
                            name="feedingDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Feeding Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={feedingForm.control}
                            name="feedingTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Feeding Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={feedingForm.control}
                            name="amountKg"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Feed Amount (kg)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="e.g., 25.5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={feedingForm.control}
                            name="batchBiomassKg"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Batch Biomass (kg)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="e.g., 1500" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={feedingForm.control}
                          name="method"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Feeding Method</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="MANUAL">Manual Feeding</SelectItem>
                                  <SelectItem value="AUTOMATIC">Automatic Feeder</SelectItem>
                                  <SelectItem value="BOAT">Boat Feeding</SelectItem>
                                  <SelectItem value="PNEUMATIC">Pneumatic System</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={feedingForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Feeding observations, fish behavior, etc..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full">Record Feeding Event</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Feed Container</TableHead>
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>FCR Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedingEvents.map((event) => {
                    const container = containers.find(c => c.id === event.container);
                    const feedType = feedTypes.find(f => f.id === event.feed);
                    const feedingPercentage = parseFloat(event.batchBiomassKg || "0") > 0 
                      ? (parseFloat(event.amountKg) / parseFloat(event.batchBiomassKg || "1")) * 100
                      : 0;
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{new Date(event.feedingDate).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">{event.feedingTime}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Batch {event.batch}</Badge>
                        </TableCell>
                        <TableCell>{container?.name}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{feedType?.name}</p>
                            <p className="text-sm text-muted-foreground">{feedType?.sizeCategory}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{parseFloat(event.amountKg).toLocaleString()} kg</p>
                            <p className="text-sm text-muted-foreground">
                              {feedingPercentage.toFixed(2)}% of biomass
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={event.method === "AUTOMATIC" ? "default" : "secondary"}>
                            {event.method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              ${event.feedCost ? parseFloat(event.feedCost).toFixed(2) : "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">FIFO cost</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Container/Barge Stock */}
      {activeSection === "container-stock" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Boxes className="h-5 w-5" />
                <span>Feed Container & Barge Stock</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {containers.map((container) => {
                  const containerStockItems = containerStock.filter(s => s.feedContainer === container.id);
                  const totalStock = containerStockItems.reduce((sum, s) => sum + parseFloat(s.quantityKg), 0);
                  const utilization = parseFloat(container.capacity) > 0 ? (totalStock / parseFloat(container.capacity)) * 100 : 0;
                  
                  return (
                    <Card key={container.id} className="relative touch-manipulation">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                          <span className="truncate mr-2">{container.name}</span>
                          <Badge variant={container.isActive ? "default" : "secondary"} className="text-xs">
                            {container.containerType}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4">
                        {container.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{container.location}</span>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Capacity Usage</span>
                            <span>{utilization.toFixed(1)}%</span>
                          </div>
                          <Progress value={utilization} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {totalStock.toLocaleString()} / {parseFloat(container.capacity).toLocaleString()} kg
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">FIFO Stock Batches</h4>
                          {containerStockItems
                            .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime())
                            .slice(0, 3)
                            .map((stock, index) => (
                              <div key={stock.id} className="text-xs bg-gray-50 p-2 rounded">
                                <div className="flex justify-between">
                                  <span>#{index + 1} - {parseFloat(stock.quantityKg).toLocaleString()} kg</span>
                                  <span>${parseFloat(stock.costPerKg).toFixed(2)}/kg</span>
                                </div>
                                <div className="text-muted-foreground">
                                  {new Date(stock.purchaseDate).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          {containerStockItems.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{containerStockItems.length - 3} more batches
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FCR Analysis */}
      {activeSection === "fcr-analysis" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Batch Feed Conversion Ratio Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {summaries.map((summary) => (
                  <div key={summary.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">Batch {summary.batch}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(summary.periodStart).toLocaleDateString()} - {new Date(summary.periodEnd).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={parseFloat(summary.fcr || "0") <= 1.5 ? "default" : parseFloat(summary.fcr || "0") <= 2.0 ? "secondary" : "destructive"}>
                        FCR: {summary.fcr || "N/A"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {summary.totalFeedConsumedKg ? parseFloat(summary.totalFeedConsumedKg).toLocaleString() : "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">Feed Consumed (kg)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {summary.totalBiomassGainKg ? parseFloat(summary.totalBiomassGainKg).toLocaleString() : "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">Biomass Gain (kg)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{parseFloat(summary.totalFeedKg).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Feed (kg)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {summary.averageFeedingPercentage ? parseFloat(summary.averageFeedingPercentage).toFixed(1) : "N/A"}%
                        </p>
                        <p className="text-sm text-muted-foreground">Avg Feeding %</p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium mb-2">FCR Performance Analysis</h5>
                      <p className="text-sm text-muted-foreground">
                        {summary.fcr && parseFloat(summary.fcr) <= 1.5 
                          ? "Excellent feed conversion efficiency. Fish are utilizing feed optimally."
                          : summary.fcr && parseFloat(summary.fcr) <= 2.0
                          ? "Good feed conversion. Consider optimizing feeding schedule or water conditions."
                          : "Feed conversion needs attention. Review feeding practices and environmental conditions."
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

interface FeedPurchase {
  id: number;
  feed: number;
  supplier: string;
  batchNumber: string;
  quantityKg: string;
  costPerKg: string;
  purchaseDate: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FeedContainer {
  id: number;
  name: string;
  capacity: string;
  location: string;
  containerType: string;
  isActive: boolean;
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
  totalFeedConsumedKg: string;
  totalBiomassGainKg: string;
  fcr: string;
  averageFeedingPercentage: string;
  feedingEventsCount: number;
  createdAt: string;
  updatedAt: string;
}

const api = {
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
  const [selectedContainer, setSelectedContainer] = useState<number | null>(null);

  const { data: purchasesData, isLoading: purchasesLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-purchases/"],
    queryFn: api.getFeedPurchases,
  });

  const { data: containersData, isLoading: containersLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-containers/"],
    queryFn: api.getFeedContainers,
  });

  const { data: stockData, isLoading: stockLoading } = useQuery({
    queryKey: ["/api/v1/inventory/feed-container-stock/"],
    queryFn: api.getFeedContainerStock,
  });

  const { data: summariesData, isLoading: summariesLoading } = useQuery({
    queryKey: ["/api/v1/inventory/batch-feeding-summaries/"],
    queryFn: api.getBatchFeedingSummaries,
  });

  const purchases = purchasesData?.results || [];
  const containers = containersData?.results || [];
  const stock = stockData?.results || [];
  const summaries = summariesData?.results || [];

  // Calculate inventory metrics
  const totalInventoryValue = stock.reduce((sum, item) => 
    sum + (parseFloat(item.quantityKg) * parseFloat(item.costPerKg)), 0
  );

  const totalQuantity = stock.reduce((sum, item) => sum + parseFloat(item.quantityKg), 0);

  const averageFCR = summaries.length > 0 
    ? summaries.reduce((sum, s) => sum + parseFloat(s.fcr), 0) / summaries.length
    : 0;

  // Get container utilization
  const getContainerUtilization = (containerId: number) => {
    const container = containers.find(c => c.id === containerId);
    const containerStock = stock.filter(s => s.feedContainer === containerId);
    const currentStock = containerStock.reduce((sum, s) => sum + parseFloat(s.quantityKg), 0);
    const capacity = container ? parseFloat(container.capacity) : 0;
    return capacity > 0 ? (currentStock / capacity) * 100 : 0;
  };

  if (purchasesLoading || containersLoading || stockLoading || summariesLoading) {
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Feed Inventory Management</h1>
        <p className="text-gray-600 mt-2">FIFO tracking, cost optimization, and FCR monitoring</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FIFO calculated value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feed Stock</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity.toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground">Across all containers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average FCR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageFCR.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Feed Conversion Ratio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Containers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containers.filter(c => c.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Feed storage locations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="containers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="containers">Feed Containers</TabsTrigger>
          <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          <TabsTrigger value="stock">Stock Overview</TabsTrigger>
          <TabsTrigger value="fcr">FCR Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="containers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {containers.map((container) => {
              const utilization = getContainerUtilization(container.id);
              const containerStock = stock.filter(s => s.feedContainer === container.id);
              const currentStock = containerStock.reduce((sum, s) => sum + parseFloat(s.quantityKg), 0);
              
              return (
                <Card key={container.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedContainer(container.id)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{container.name}</span>
                      <Badge variant={container.isActive ? "default" : "secondary"}>
                        {container.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{container.location}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Capacity Usage</span>
                        <span>{utilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={utilization} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {currentStock.toLocaleString()} / {parseFloat(container.capacity).toLocaleString()} kg
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">FIFO Batches</span>
                      <Badge variant="outline">{containerStock.length}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Feed Purchase History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{purchase.batchNumber}</h4>
                        <p className="text-sm text-muted-foreground">{purchase.supplier}</p>
                      </div>
                      <Badge variant="outline">
                        ${parseFloat(purchase.costPerKg).toFixed(2)}/kg
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <p className="font-medium">{parseFloat(purchase.quantityKg).toLocaleString()} kg</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Value:</span>
                        <p className="font-medium">
                          ${(parseFloat(purchase.quantityKg) * parseFloat(purchase.costPerKg)).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Purchase Date:</span>
                        <p className="font-medium">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expiry:</span>
                        <p className="font-medium">
                          {purchase.expiryDate ? new Date(purchase.expiryDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    {purchase.notes && (
                      <p className="text-sm text-muted-foreground italic">{purchase.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FIFO Stock Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stock
                  .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime())
                  .map((stockItem) => {
                    const container = containers.find(c => c.id === stockItem.feedContainer);
                    const purchase = purchases.find(p => p.id === stockItem.feedPurchase);
                    const isOldStock = new Date(stockItem.purchaseDate) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <div key={stockItem.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{container?.name}</h4>
                            {isOldStock && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                          </div>
                          <Badge variant={isOldStock ? "destructive" : "default"}>
                            FIFO Position: {stock.findIndex(s => s.id === stockItem.id) + 1}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Batch:</span>
                            <p className="font-medium">{purchase?.batchNumber}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <p className="font-medium">{parseFloat(stockItem.quantityKg).toLocaleString()} kg</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cost/kg:</span>
                            <p className="font-medium">${parseFloat(stockItem.costPerKg).toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Purchase Date:</span>
                            <p className="font-medium">{new Date(stockItem.purchaseDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stock Value:</span>
                            <p className="font-medium">
                              ${(parseFloat(stockItem.quantityKg) * parseFloat(stockItem.costPerKg)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fcr" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Feed Conversion Ratio Analysis</span>
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
                      <Badge variant={parseFloat(summary.fcr) <= 1.5 ? "default" : parseFloat(summary.fcr) <= 2.0 ? "secondary" : "destructive"}>
                        FCR: {summary.fcr}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{parseFloat(summary.totalFeedConsumedKg).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Feed Consumed (kg)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{parseFloat(summary.totalBiomassGainKg).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Biomass Gain (kg)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{summary.feedingEventsCount}</p>
                        <p className="text-sm text-muted-foreground">Feeding Events</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{summary.averageFeedingPercentage}%</p>
                        <p className="text-sm text-muted-foreground">Avg Feeding %</p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium mb-2">FCR Performance Analysis</h5>
                      <p className="text-sm text-muted-foreground">
                        {parseFloat(summary.fcr) <= 1.5 
                          ? "Excellent feed conversion efficiency. Fish are utilizing feed optimally."
                          : parseFloat(summary.fcr) <= 2.0
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
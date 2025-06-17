import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Scale,
  Truck,
  Plus,
  Settings,
  BarChart3,
  Boxes,
  ClipboardList,
  Factory
} from "lucide-react";
import HierarchicalFilter, { OperationsOverview } from "@/components/layout/hierarchical-filter";

// API functions
const api = {
  async getFeedTypes() {
    const response = await fetch("/api/v1/inventory/feed-types/");
    if (!response.ok) throw new Error("Failed to fetch feed types");
    return response.json();
  },

  async getFeedPurchases() {
    const response = await fetch("/api/v1/inventory/feed-purchases/");
    if (!response.ok) throw new Error("Failed to fetch purchases");
    return response.json();
  },

  async getFeedContainers() {
    const response = await fetch("/api/v1/inventory/feed-containers/");
    if (!response.ok) throw new Error("Failed to fetch containers");
    return response.json();
  },

  async getFeedContainerStock() {
    const response = await fetch("/api/v1/inventory/feed-container-stock/");
    if (!response.ok) throw new Error("Failed to fetch container stock");
    return response.json();
  },

  async getFeedingEvents() {
    const response = await fetch("/api/v1/inventory/feeding-events/");
    if (!response.ok) throw new Error("Failed to fetch feeding events");
    return response.json();
  }
};

export default function Inventory() {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [filters, setFilters] = useState({});

  // Data queries
  const { data: feedTypesData } = useQuery({
    queryKey: ["/api/v1/inventory/feed-types/"],
    queryFn: api.getFeedTypes,
  });

  const { data: purchasesData } = useQuery({
    queryKey: ["/api/v1/inventory/feed-purchases/"],
    queryFn: api.getFeedPurchases,
  });

  const { data: containersData } = useQuery({
    queryKey: ["/api/v1/inventory/feed-containers/"],
    queryFn: api.getFeedContainers,
  });

  const { data: stockData } = useQuery({
    queryKey: ["/api/v1/inventory/feed-container-stock/"],
    queryFn: api.getFeedContainerStock,
  });

  const { data: feedingEventsData } = useQuery({
    queryKey: ["/api/v1/inventory/feeding-events/"],
    queryFn: api.getFeedingEvents,
  });

  const feedTypes = feedTypesData?.results || [];
  const purchases = purchasesData?.results || [];
  const containers = containersData?.results || [];
  const containerStock = stockData?.results || [];
  const feedingEvents = feedingEventsData?.results || [];

  // Calculate metrics
  const totalInventoryValue = containerStock.reduce((sum: number, item: any) => 
    sum + (parseFloat(item.quantityKg) * parseFloat(item.costPerKg)), 0
  );

  const totalQuantity = containerStock.reduce((sum: number, item: any) => sum + parseFloat(item.quantityKg), 0);
  const activeContainers = containers.filter((c: any) => c.isActive).length;

  // Navigation menu items
  const navigationSections = [
    { id: "dashboard", label: "Overview", icon: BarChart3 },
    { id: "feed-types", label: "Feed Types", icon: Settings },
    { id: "purchases", label: "Purchases", icon: Truck },
    { id: "distribution", label: "Distribution", icon: Factory },
    { id: "feeding-events", label: "Feeding Events", icon: ClipboardList },
    { id: "container-stock", label: "Stock Levels", icon: Boxes },
    { id: "fcr-analysis", label: "Analytics", icon: TrendingUp },
  ];

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold">Feed Inventory Management</h1>
            <p className="text-muted-foreground">
              FIFO tracking, cost optimization, and FCR monitoring
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            New Purchase
          </Button>
          <Button variant="outline">
            <Truck className="h-4 w-4 mr-2" />
            Schedule Delivery
          </Button>
        </div>
      </div>

      {/* Operations Overview for Large Scale */}
      <OperationsOverview />

      {/* Navigation Menu - Health Module Style */}
      <div className="space-y-4">
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Select value={activeSection} onValueChange={setActiveSection}>
            <SelectTrigger className="w-full">
              <SelectValue>
                <span>{navigationSections.find(s => s.id === activeSection)?.label}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {navigationSections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Navigation - Health Module Style */}
        <div className="hidden md:flex bg-muted rounded-lg p-1">
          {navigationSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeSection === section.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

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
              Across {activeContainers} containers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Containers</CardTitle>
            <Factory className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {activeContainers}
            </div>
            <p className="text-xs text-muted-foreground">
              Storage locations
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
              {feedingEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total recorded
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
                <span>{navigationSections.find(s => s.id === activeSection)?.label}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {navigationSections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.label}
                </SelectItem>
              ))}
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
                  {feedingEvents.slice(0, 5).map((event: any) => (
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
                  {containerStock.slice(0, 5).map((stock: any) => (
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
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Feed Type</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedTypes.map((feed: any) => (
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

      {/* Other sections */}
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
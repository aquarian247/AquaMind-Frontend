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
  const totalInventoryValue = containerStock.reduce((sum, item) => 
    sum + (parseFloat(item.quantityKg) * parseFloat(item.costPerKg)), 0
  );

  const totalQuantity = containerStock.reduce((sum, item) => sum + parseFloat(item.quantityKg), 0);
  const activeContainers = containers.filter(c => c.isActive).length;

  // Navigation menu items
  const navigationSections = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "feed-types", label: "Feed Types", icon: Settings },
    { id: "purchases", label: "Purchases", icon: Truck },
    { id: "distribution", label: "Distribution", icon: Factory },
    { id: "feeding-events", label: "Feeding Events", icon: ClipboardList },
    { id: "container-stock", label: "Container Stock", icon: Boxes },
    { id: "fcr-analysis", label: "FCR Analysis", icon: TrendingUp },
  ];

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Feed Inventory Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">FIFO tracking, cost optimization, and FCR monitoring</p>
      </div>

      {/* Operations Overview for Large Scale */}
      <OperationsOverview />

      {/* Hierarchical Filtering for Large Scale Operations */}
      <HierarchicalFilter onFilterChange={handleFilterChange} showBatches={true} />

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
            <div className="text-lg lg:text-2xl font-bold">1.32</div>
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
            <div className="text-lg lg:text-2xl font-bold">{activeContainers}</div>
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
                    (() => {
                      const Icon = navigationSections.find(s => s.id === activeSection)!.icon;
                      return <Icon className="h-4 w-4" />;
                    })()
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
                  {feedingEvents.slice(0, 5).map((event) => (
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
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Feed Type</span>
            </Button>
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
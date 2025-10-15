import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Building2, 
  Activity, 
  AlertTriangle, 
  Thermometer,
  Map as MapIcon,
  Waves,
  Factory,
  Container,
  Plus,
  Settings,
  BarChart3,
  MapPin,
  Radio,
  Fish,
  Gauge,
  Clock,
  Filter
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "wouter";
import { ApiService, InfrastructureService } from "@/api/generated";
import { useGeographySummaries } from "@/features/infrastructure/api";
import { formatCount, formatWeight, formatPercentage } from "@/lib/formatFallback";

// Infrastructure data interfaces
interface GeographySummary {
  id: number;
  name: string;
  totalContainers: number;
  activeBiomass: number;
  capacity: number;
  sensorAlerts: number;
  feedingEventsToday: number;
  status: 'active' | 'inactive';
  lastUpdate: string;
}

interface InfrastructureContainer {
  id: number;
  name: string;
  type: 'sea_pen' | 'tank' | 'cage';
  geography: string;
  area: string;
  biomass: number;
  capacity: number;
  currentBatch: string;
  lastFeed: string;
  sensorReadings: {
    temperature?: number;
    oxygen?: number;
    co2?: number;
  };
  status: 'active' | 'maintenance' | 'inactive';
}

interface Alert {
  id: number;
  containerId: number;
  containerName: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export default function Infrastructure() {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedGeography, setSelectedGeography] = useState<string>("all");
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    area: "all"
  });
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();

  // ✅ Use GLOBAL infrastructure overview endpoint for all-geography aggregation
  const { data: globalOverview, isLoading: summaryLoading } = useQuery({
    queryKey: ["infrastructure", "overview", "global"],
    queryFn: async () => InfrastructureService.infrastructureOverview(),
  });

  // Fetch geographies list for geography selector
  const { data: geographiesData, isLoading: geographiesLoading } = useQuery({
    queryKey: ["infrastructure", "geographies"],
    queryFn: async () => ApiService.apiV1InfrastructureGeographiesList(),
  });

  // Get geography IDs and fetch summaries for all geographies
  const geographyIds = useMemo(
    () => geographiesData?.results?.map(g => g.id!).filter(Boolean) || [],
    [geographiesData]
  );
  
  const { data: geographySummaries, isLoading: geoSummariesLoading } = useGeographySummaries(geographyIds);

  // Create lookup map for geography summaries
  const geoSummaryMap = useMemo(() => {
    if (!geographySummaries || geographySummaries.length === 0) return new Map();
    return new Map(geographyIds.map((id, index) => [id, geographySummaries[index]]));
  }, [geographySummaries, geographyIds]);

  // Fetch sample containers for display
  const { data: containersData } = useQuery({
    queryKey: ["infrastructure", "containers", "sample"],
    queryFn: async () => ApiService.apiV1InfrastructureContainersList(
      undefined, // active
      undefined, // area
      undefined, // areaIn
      undefined, // containerType
      undefined, // hall
      undefined, // hallIn
      undefined, // name
      undefined, // ordering
      1          // page (first page only for sample)
    ),
  });

  const geographies = geographiesData?.results?.map((geo: any) => {
    const summary = geoSummaryMap.get(geo.id);
    return {
      id: geo.id,
      name: geo.name,
      totalContainers: summary?.container_count ?? 0,
      activeBiomass: summary?.active_biomass_kg ?? 0,
      capacity: summary?.capacity_kg ?? 0,
      utilizationPercent: summary?.capacity_kg && summary?.active_biomass_kg
        ? (summary.active_biomass_kg / summary.capacity_kg) * 100
        : 0,
      seaAreas: summary?.area_count ?? 0,
      freshwaterStations: summary?.station_count ?? 0,
      status: (geo.active ?? true) ? 'active' as const : 'inactive' as const,
      lastUpdate: geo.updated_at || new Date().toISOString()
    };
  }) || [];

  // No alerts endpoint yet - empty array
  const alerts: Alert[] = [];

  // Process real containers data for Overview tab display
  const realContainers = containersData?.results?.slice(0, 3).map((container: any) => ({
    id: container.id,
    name: container.name,
    type: container.container_type_name?.toLowerCase().includes('ring') ? 'sea_pen' as const :
          container.container_type_name?.toLowerCase().includes('tank') ? 'tank' as const : 'cage' as const,
    geography: geographies.length > 0 ? geographies[0].name : "Unknown", // Use first available geography
    area: container.area_name || container.hall_name || "Unknown",
    biomass: 0, // Would need to be calculated from batch assignments
    // ✅ Use max_biomass_kg from container model (aquaculture capacity, not just water volume)
    // Example: Container with 10m³ volume has max_biomass_kg = 500 kg
    // This represents safe stocking density for fish welfare
    capacity: parseFloat(container.max_biomass_kg || '0'),
    currentBatch: "Unknown", // Would need to be determined from batch assignments
    lastFeed: "Unknown", // Would need to be determined from feeding events
    sensorReadings: {}, // Would need sensor data integration
    status: container.active ? 'active' as const : 'inactive' as const
  })) || [];

  // Use real containers data, fallback to empty array if no data
  const displayContainers = realContainers.length > 0 ? realContainers : [];

  // Navigation menu items
  const navigationSections = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "geographic", label: "Geographic View", icon: MapIcon },
    { id: "containers", label: "Containers", icon: Container },
    { id: "sensors", label: "Sensors", icon: Radio },
    { id: "environmental", label: "Environmental", icon: Activity },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "maintenance", label: "Maintenance", icon: Settings },
  ];

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800", 
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800"
    };
    return variants[severity as keyof typeof variants] || variants.low;
  };

  const getContainerIcon = (type: string) => {
    switch (type) {
      case 'sea_pen': return Waves;
      case 'tank': return Container;
      case 'cage': return Factory;
      default: return Container;
    }
  };

  if (summaryLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Infrastructure Management</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Infrastructure Management</h1>
            <p className="text-muted-foreground">
              Overview of all facilities and containers across geographies
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
            onClick={() => setLocation('/infrastructure/manage')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Infrastructure
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.filter((a: Alert) => a.severity === 'critical' || a.severity === 'high').length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertTitle className="text-orange-700">Infrastructure Alerts</AlertTitle>
          <AlertDescription className="text-orange-600">
            {alerts.filter((a: Alert) => a.severity === 'critical' || a.severity === 'high').length} container(s) require attention
          </AlertDescription>
        </Alert>
      )}

      {/* Infrastructure Summary KPIs - 4 Status Boxes */}
      {/* KPI Cards - Global Infrastructure Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <Container className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summaryLoading ? "..." : formatCount(globalOverview?.total_containers)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryLoading ? "Loading..." : "Across all geographies"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Biomass</CardTitle>
            <Fish className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summaryLoading ? "..." : formatWeight(globalOverview?.active_biomass_kg)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryLoading ? "Loading..." : "Current stock"}
            </p>
            {globalOverview?.capacity_kg && globalOverview.active_biomass_kg && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercentage((globalOverview.active_biomass_kg / globalOverview.capacity_kg) * 100, 1)} of capacity
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Gauge className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {summaryLoading ? "..." : formatWeight(globalOverview?.capacity_kg)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryLoading ? "Loading..." : "Maximum biomass"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feeding Events Today</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {summaryLoading ? "..." : formatCount(globalOverview?.feeding_events_today)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryLoading ? "Loading..." : "Last 24 hours"}
            </p>
          </CardContent>
        </Card>
      </div>

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

      {/* Content Based on Active Section */}
      <div className="space-y-6">
        {activeSection === "overview" && (
          <>
            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span>Active Alerts</span>
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">Updated 5 min ago</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.length > 0 ? (
                  <>
                    {alerts.slice(0, 3).map((alert: Alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <div className="font-medium">{alert.containerName}</div>
                          <div className="text-sm text-muted-foreground">{alert.message}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityBadge(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      View All Alerts
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active alerts</p>
                    <p className="text-sm">Infrastructure is operating normally</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Container Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Container className="h-5 w-5 text-blue-500" />
                    <span>Container Status</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                {displayContainers.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayContainers.map((container) => {
                      const IconComponent = getContainerIcon(container.type);
                      return (
                        <Card key={container.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                <IconComponent className="h-4 w-4 text-blue-500" />
                                <div>
                                  <CardTitle className="text-sm">{container.name}</CardTitle>
                                  <p className="text-xs text-muted-foreground">{container.area}</p>
                                </div>
                              </div>
                              <Badge variant={container.status === "active" ? "default" : "secondary"}>
                                {container.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Max Capacity</span>
                                <span>{(container.capacity / 1000).toFixed(1)}k kg</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Safe stocking density for fish welfare
                              </p>
                            </div>

                            <div className="text-center text-sm text-muted-foreground py-4">
                              <div>Sensor data and batch information</div>
                              <div>will be available once integrated</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                              <div>
                                <span className="text-muted-foreground">Status</span>
                                <div className="font-medium capitalize">{container.status}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Type</span>
                                <div className="font-medium">{container.type.replace('_', ' ')}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Container className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Loading container data...</p>
                    <p className="text-sm">Real container information will be displayed here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeSection === "geographic" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {geographies.map((geo: any) => (
              <Card key={geo.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{geo.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{geo.totalContainers?.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Containers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{(geo.activeBiomass / 1000).toFixed(1)}k</div>
                      <div className="text-xs text-muted-foreground">Biomass (tons)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{geo.utilizationPercent.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">
                        of {(geo.capacity / 1000000).toFixed(1)}M kg capacity
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">{geo.seaAreas}</div>
                      <div className="text-xs text-muted-foreground">Sea Areas</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-semibold text-green-600">{geo.freshwaterStations}</div>
                      <div className="text-xs text-muted-foreground">FW Stations</div>
                    </div>
                  </div>
                  
                  <Progress value={Math.round(geo.utilizationPercent)} />
                  <div className="flex justify-between space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setLocation(`/infrastructure/areas?geography=${geo.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    >
                      <Waves className="h-4 w-4 mr-2" />
                      View Areas
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setLocation(`/infrastructure/stations?geography=${geo.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    >
                      <Factory className="h-4 w-4 mr-2" />
                      View Stations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Container and Sensor sections - redirect to dedicated filtered views */}
        {activeSection === "containers" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Container className="h-5 w-5" />
                <span>All Containers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Access comprehensive container management with advanced filtering across all facilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => setLocation('/infrastructure/containers')}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Open Container Filters
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/infrastructure/stations')}
                  className="w-full sm:w-auto"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Browse by Station
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/infrastructure/areas')}
                  className="w-full sm:w-auto"
                >
                  <Waves className="h-4 w-4 mr-2" />
                  Browse by Area
                </Button>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">
                    {formatCount(globalOverview?.total_containers)} Containers
                  </div>
                  <div className="text-blue-700">Across all facilities</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">6 Container Types</div>
                  <div className="text-green-700">Trays, tanks, rings, etc.</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900">Smart Filtering</div>
                  <div className="text-purple-700">By geography, type, status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === "sensors" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Radio className="h-5 w-5" />
                <span>All Sensors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Monitor environmental sensors across all infrastructure with real-time status and alerts.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => setLocation('/infrastructure/sensors')}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Open Sensor Filters
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/infrastructure/stations')}
                  className="w-full sm:w-auto"
                >
                  <Factory className="h-4 w-4 mr-2" />
                  Freshwater Sensors
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/infrastructure/areas')}
                  className="w-full sm:w-auto"
                >
                  <Waves className="h-4 w-4 mr-2" />
                  Sea Sensors
                </Button>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-sm">
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <div className="font-medium text-cyan-900">0 Sensors</div>
                  <div className="text-cyan-700">Ready for deployment</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-medium text-orange-900">0 Sensor Types</div>
                  <div className="text-orange-700">Infrastructure ready</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-medium text-red-900">Alert Management</div>
                  <div className="text-red-700">Ready for sensor deployment</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Other sections placeholder */}
        {activeSection !== "overview" && activeSection !== "geographic" && activeSection !== "containers" && activeSection !== "sensors" && (
          <Card>
            <CardHeader>
              <CardTitle>{navigationSections.find(s => s.id === activeSection)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {navigationSections.find(s => s.id === activeSection)?.label} content will be implemented here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

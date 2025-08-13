import { useState } from "react";
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
  Map,
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

// API functions
const api = {
  async getInfrastructureSummary() {
    const response = await fetch("/api/v1/infrastructure/summary/");
    if (!response.ok) throw new Error("Failed to fetch infrastructure summary");
    return response.json();
  },

  async getGeographies() {
    const response = await fetch("/api/v1/infrastructure/geographies/");
    if (!response.ok) throw new Error("Failed to fetch geographies");
    return response.json();
  },

  async getContainers(geography?: string) {
    const url = geography 
      ? `/api/v1/infrastructure/containers/?geography=${geography}`
      : "/api/v1/infrastructure/containers/";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch containers");
    return response.json();
  },

  async getAlerts() {
    const response = await fetch("/api/v1/infrastructure/alerts/");
    if (!response.ok) throw new Error("Failed to fetch alerts");
    return response.json();
  }
};

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

  // Data queries
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["/api/v1/infrastructure/summary/"],
    queryFn: api.getInfrastructureSummary,
  });

  const { data: geographiesData } = useQuery({
    queryKey: ["/api/v1/infrastructure/geographies/"],
    queryFn: api.getGeographies,
  });

  const { data: containersData } = useQuery({
    queryKey: ["/api/v1/infrastructure/containers/", selectedGeography],
    queryFn: () => api.getContainers(selectedGeography === "all" ? undefined : selectedGeography),
  });

  const { data: alertsData } = useQuery({
    queryKey: ["/api/v1/infrastructure/alerts/"],
    queryFn: api.getAlerts,
  });

  // Process data
  const summary = summaryData || {
    totalContainers: 247,
    activeBiomass: 12450,
    capacity: 14310,
    sensorAlerts: 7,
    feedingEventsToday: 124
  };

  const geographies = geographiesData?.results || [
    { id: 1, name: "Faroe Islands", totalContainers: 152, activeBiomass: 8200, capacity: 9000 },
    { id: 2, name: "Scotland", totalContainers: 95, activeBiomass: 4250, capacity: 5310 }
  ];

  const containers = containersData?.results || [];
  const alerts = alertsData?.results || [
    {
      id: 1,
      containerId: 12,
      containerName: "Vestmanna A12 Sea Pen",
      type: "oxygen",
      message: "O2 level: 76% (threshold: 80%)",
      severity: "medium" as const,
      timestamp: "15 min ago"
    },
    {
      id: 2,
      containerId: 5,
      containerName: "Strond FW Station T05 Tank",
      type: "temperature",
      message: "Temperature: 14.2°C (threshold: max 14°C)",
      severity: "high" as const,
      timestamp: "32 min ago"
    },
    {
      id: 3,
      containerId: 8,
      containerName: "Fuglafjørður B08 Sea Pen",
      type: "biomass",
      message: "Biomass: 94% of capacity",
      severity: "medium" as const,
      timestamp: "1 hour ago"
    }
  ];

  // Sample containers data
  const sampleContainers = [
    {
      id: 12,
      name: "Vestmanna A12 Sea Pen",
      type: "sea_pen" as const,
      geography: "Faroe Islands",
      area: "Vestmanna",
      biomass: 14760,
      capacity: 18000,
      currentBatch: "B-2025-06",
      lastFeed: "2h ago",
      sensorReadings: { temperature: 12.4, oxygen: 76 },
      status: "active" as const
    },
    {
      id: 5,
      name: "Strond FW Station T05 Tank",
      type: "tank" as const,
      geography: "Faroe Islands",
      area: "Strond",
      biomass: 780,
      capacity: 1200,
      currentBatch: "B-2025-04",
      lastFeed: "1h ago",
      sensorReadings: { temperature: 14.2, co2: 12 },
      status: "active" as const
    },
    {
      id: 8,
      name: "Fuglafjørður B08 Sea Pen",
      type: "sea_pen" as const,
      geography: "Faroe Islands",
      area: "Fuglafjørður",
      biomass: 16920,
      capacity: 18000,
      currentBatch: "B-2025-02",
      lastFeed: "30m ago",
      sensorReadings: { temperature: 11.8, oxygen: 88 },
      status: "active" as const
    }
  ];

  // Navigation menu items
  const navigationSections = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "geographic", label: "Geographic View", icon: Map },
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
              <SelectItem value="faroe-islands">Faroe Islands</SelectItem>
              <SelectItem value="scotland">Scotland</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Container
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <Container className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary.totalContainers}
            </div>
            <p className="text-xs text-muted-foreground">
              +3 since last month
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
              {(summary.activeBiomass / 1000).toFixed(1)}k tons
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={(summary.activeBiomass / summary.capacity) * 100} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {Math.round((summary.activeBiomass / summary.capacity) * 100)}% of capacity
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sensor Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {summary.sensorAlerts}
            </div>
            <p className="text-xs text-muted-foreground">
              +2 in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feeding Events Today</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {summary.feedingEventsToday}
            </div>
            <p className="text-xs text-muted-foreground">
              On schedule
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sampleContainers.map((container) => {
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
                              <span>Biomass</span>
                              <span>{Math.round((container.biomass / container.capacity) * 100)}% ({(container.biomass / 1000).toFixed(1)}k kg)</span>
                            </div>
                            <Progress value={(container.biomass / container.capacity) * 100} className="mt-1" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {container.sensorReadings.oxygen && (
                              <div>
                                <span className="text-muted-foreground">O2</span>
                                <div className="font-medium">{container.sensorReadings.oxygen}%</div>
                              </div>
                            )}
                            {container.sensorReadings.temperature && (
                              <div>
                                <span className="text-muted-foreground">Temperature</span>
                                <div className="font-medium">{container.sensorReadings.temperature}°C</div>
                              </div>
                            )}
                            {container.sensorReadings.co2 && (
                              <div>
                                <span className="text-muted-foreground">CO2</span>
                                <div className="font-medium">{container.sensorReadings.co2} mg/l</div>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                            <div>
                              <span className="text-muted-foreground">Batch</span>
                              <div className="font-medium">{container.currentBatch}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last Feed</span>
                              <div className="font-medium">{container.lastFeed}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
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
                      <div className="text-2xl font-bold text-purple-600">{Math.round((geo.activeBiomass / geo.capacity) * 100)}%</div>
                      <div className="text-xs text-muted-foreground">Capacity</div>
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
                  
                  <Progress value={(geo.activeBiomass / geo.capacity) * 100} />
                  <div className="flex justify-between space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.location.href = `/infrastructure/areas?geography=${geo.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <Waves className="h-4 w-4 mr-2" />
                      View Areas
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.location.href = `/infrastructure/stations?geography=${geo.name.toLowerCase().replace(' ', '-')}`}
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
                  <div className="font-medium text-blue-900">2,700+ Containers</div>
                  <div className="text-blue-700">Across all facilities</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">Multiple Types</div>
                  <div className="text-green-700">Trays, tanks, rings</div>
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
                  <div className="font-medium text-cyan-900">3,800+ Sensors</div>
                  <div className="text-cyan-700">Real-time monitoring</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-medium text-orange-900">8 Sensor Types</div>
                  <div className="text-orange-700">Temperature, O₂, pH, etc.</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-medium text-red-900">Alert Management</div>
                  <div className="text-red-700">Status and calibration</div>
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

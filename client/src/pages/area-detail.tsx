import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAreaKpi } from "@/hooks/aggregations/useAreaKpi";
import { ApiService } from "@/api/generated";
import { api } from "@/lib/api";
import { 
  ArrowLeft, 
  MapPin, 
  Waves, 
  Thermometer,
  Droplets,
  Fish,
  Activity,
  Calendar,
  AlertTriangle,
  Settings,
  FileText,
  TrendingUp,
  Wind,
  Scale,
  Clock,
  Users,
  Shield,
  Gauge,
  Eye,
  Search
} from "lucide-react";
import { useLocation } from "wouter";

interface AreaDetail {
  id: number;
  name: string;
  geography: string;
  type: string;
  rings: number;
  coordinates: { lat: number; lng: number };
  status: string;
  waterDepth: number;
  lastInspection: string;
  totalBiomass: number;
  capacity: number;
  currentStock: number;
  averageWeight: number;
  mortalityRate: number;
  feedConversion: number;
  waterTemperature: number;
  oxygenLevel: number;
  salinity: number;
  currentSpeed: number;
}

interface Ring {
  id: number;
  name: string;
  areaId: number;
  areaName: string;
  status: string;
  biomass: number;
  capacity: number;
  fishCount: number;
  averageWeight: number;
  waterDepth: number;
  netCondition: string;
  lastInspection: string;
  coordinates: { lat: number; lng: number };
  environmentalStatus: string;
}

export default function AreaDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("environmental");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: area, isLoading, error } = useQuery({
    queryKey: ["area", params.id],
    queryFn: async () => {
      const id = Number(params.id);
      const raw = await ApiService.apiV1InfrastructureAreasRetrieve(id);
      return {
        ...raw,
        geography: (raw as any).geography_name ?? (raw as any).geography ?? "Unknown",
        type: (raw as any).area_type_name ?? (raw as any).type ?? "Sea",
        rings: 0,
        coordinates: {
          lat: (raw as any).latitude ?? 0,
          lng: (raw as any).longitude ?? 0,
        },
        status: (raw as any).active ? "active" : "inactive",
        waterDepth: 0,
        lastInspection: new Date().toISOString(),
        totalBiomass: 0,
        capacity: 0,
        currentStock: 0,
        averageWeight: 0,
        mortalityRate: 0,
        feedConversion: 0,
        waterTemperature: 0,
        oxygenLevel: 0,
        salinity: 0,
        currentSpeed: 0,
      };
    },
  });

  const { data: ringsData, isLoading: isLoadingRings } = useQuery({
    queryKey: ["area", params.id, "rings"],
    queryFn: () => api.infrastructure.getAreaRings(Number(params.id)),
  });

  const rings: Ring[] = ringsData?.results || [];

  // Aggregated KPI data for this area
  const areaId = Number(params.id);
  const { data: kpi } = useAreaKpi(areaId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
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

  if (error || !area) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Area Not Found</h2>
          <p className="text-gray-600 mb-4">The requested sea area could not be found.</p>
          <Button onClick={() => setLocation("/infrastructure/areas")}>
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Areas</span>
          </Button>
        </div>
      </div>
    );
  }

  // Filter rings based on search and status
  const filteredRings = rings.filter(ring => {
    const matchesSearch = ring.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ring.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      operational: "bg-green-100 text-green-800",
      active: "bg-green-100 text-green-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      restricted: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getNetConditionBadge = (condition: string) => {
    const variants = {
      excellent: "bg-green-100 text-green-800",
      good: "bg-blue-100 text-blue-800",
      fair: "bg-yellow-100 text-yellow-800",
      poor: "bg-red-100 text-red-800"
    };
    return variants[condition as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const tabItems = [
    { value: "environmental", label: "Environmental" },
    { value: "operations", label: "Operations" },
    { value: "regulatory", label: "Regulatory" },
    { value: "maintenance", label: "Maintenance" }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/infrastructure/areas")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Areas
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Waves className="h-8 w-8 mr-3 text-blue-600" />
              {area.name}
            </h1>
            <p className="text-muted-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {area.geography} • {area.type} • {area.rings} rings
            </p>
          </div>
        </div>
        <Badge className={getStatusBadge(area.status)}>
          {area.status}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biomass</CardTitle>
            <Fish className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {((kpi?.totalBiomassKg ?? 0) / 1000).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">tonnes</p>
            <div className="mt-2">
              <Progress value={(((kpi?.totalBiomassKg ?? 0) / 1000) / (area.capacity || 1)) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
            <Scale className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(kpi?.averageWeightKg ?? 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">kg per fish</p>
            <div className="mt-2">
              <Progress value={((kpi?.averageWeightKg ?? 0) / 6) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mortality Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{area.mortalityRate}%</div>
            <p className="text-xs text-muted-foreground">monthly</p>
            <div className="mt-2">
              <Progress value={area.mortalityRate * 10} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Conversion</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{area.feedConversion}</div>
            <p className="text-xs text-muted-foreground">FCR ratio</p>
            <div className="mt-2">
              <Progress value={(area.feedConversion / 2) * 100} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs - moved below KPI cards */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Mobile dropdown - visible only on small screens */}
        <div className="md:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {tabItems.find(item => item.value === activeTab)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tabItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop tabs - hidden on mobile */}
        <TabsList className="hidden md:grid w-full grid-cols-4">
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="environmental" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{area.waterTemperature}°C</div>
                <p className="text-xs text-muted-foreground">Optimal range: 8-16°C</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Oxygen Level</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{area.oxygenLevel}</div>
                <p className="text-xs text-muted-foreground">mg/L</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salinity</CardTitle>
                <Waves className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{area.salinity}</div>
                <p className="text-xs text-muted-foreground">ppt</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Speed</CardTitle>
                <Wind className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{area.currentSpeed}</div>
                <p className="text-xs text-muted-foreground">m/s</p>
                <div className="mt-2">
                  <Progress value={(area.currentSpeed / 1) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gauge className="h-5 w-5" />
                <span>Environmental Monitoring</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Water Depth:</span>
                    <div className="font-medium">{area.waterDepth}m</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Coordinates:</span>
                    <div className="font-medium">{area.coordinates.lat.toFixed(4)}, {area.coordinates.lng.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Reading:</span>
                    <div className="font-medium">{new Date().toLocaleTimeString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Check:</span>
                    <div className="font-medium">In 2 hours</div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    View Historical Data
                  </Button>
                  <Button variant="outline" size="sm">
                    Set Alerts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Fish className="h-5 w-5" />
                  <span>Stock Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Stock:</span>
                      <div className="font-medium">
                        {(kpi?.populationCount ?? 0).toLocaleString()} fish
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>
                      <div className="font-medium">{area.capacity.toLocaleString()} tonnes</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Utilization:</span>
                      <div className="font-medium">
                        {Math.round((((kpi?.totalBiomassKg ?? 0) / 1000) / (area.capacity || 1)) * 100)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Generation:</span>
                      <div className="font-medium">2023</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Growth Rate:</span>
                      <div className="font-medium">2.1%/week</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Feed Efficiency:</span>
                      <div className="font-medium">92.5%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Health Score:</span>
                      <div className="font-medium">8.7/10</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Harvest Est.:</span>
                      <div className="font-medium">Q2 2024</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regulatory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Compliance Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Environmental permit</span>
                    <Badge className="bg-green-100 text-green-800">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Fish health certificate</span>
                    <Badge className="bg-green-100 text-green-800">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Biomass reporting</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Due soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Documentation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Environmental Impact Assessment
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Fish Health Management Plan
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Escape Prevention Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Maintenance Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Net inspection</span>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Mooring check</span>
                    <Badge variant="outline">Due in 3 days</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Anchor inspection</span>
                    <Badge variant="outline">Due in 1 week</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Equipment calibration</span>
                    <Badge variant="outline">Due in 2 weeks</Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">Schedule Maintenance</Button>
                <Button variant="outline" size="sm">View History</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rings Section */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold">Production Rings</h2>
            <p className="text-muted-foreground">Sea pen units in this area</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Ring Monitor
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Summary Stats for Rings */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rings</CardTitle>
              <Waves className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{filteredRings.length}</div>
              <p className="text-xs text-muted-foreground">Production units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ring Biomass</CardTitle>
              <Fish className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredRings.reduce((sum, ring) => sum + ring.biomass, 0).toFixed(1)} tons
              </div>
              <p className="text-xs text-muted-foreground">Current stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rings</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {filteredRings.filter(ring => ring.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Currently operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Depth</CardTitle>
              <Gauge className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {filteredRings.length > 0 ? (filteredRings.reduce((sum, ring) => sum + ring.waterDepth, 0) / filteredRings.length).toFixed(1) : 0}m
              </div>
              <p className="text-xs text-muted-foreground">Water depth</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rings Grid */}
        {isLoadingRings ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRings.map((ring) => (
              <Card key={ring.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <span className="mr-2">🌊</span>
                        {ring.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Sea Ring • Depth: {ring.waterDepth}m
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Badge className={getStatusBadge(ring.status)}>
                        {ring.status}
                      </Badge>
                      <Badge className={getNetConditionBadge(ring.netCondition)}>
                        {ring.netCondition} net
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Biomass</span>
                      <div className="font-semibold text-lg">{ring.biomass} tons</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fish Count</span>
                      <div className="font-semibold text-lg">{ring.fishCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Weight</span>
                      <div className="font-medium">{ring.averageWeight} kg</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Environment</span>
                      <Badge variant="outline" className={ring.environmentalStatus === 'optimal' ? 'border-green-500 text-green-700' : 'border-yellow-500 text-yellow-700'}>
                        {ring.environmentalStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capacity Utilization</span>
                      <span>{Math.round((ring.biomass / ring.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min((ring.biomass / ring.capacity) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Inspected {new Date(ring.lastInspection).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setLocation(`/infrastructure/rings/${ring.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredRings.length === 0 && !isLoadingRings && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Waves className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No rings found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search criteria or filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      
    </div>
  );
}

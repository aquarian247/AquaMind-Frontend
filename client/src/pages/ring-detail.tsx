import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Waves, 
  Fish,
  Activity,
  Gauge,
  Thermometer,
  Droplet,
  Wind,
  Calendar,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Camera,
  Settings
} from "lucide-react";
import { useLocation } from "wouter";

interface RingDetail {
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
  // Additional detail fields
  netLastChanged: string;
  netType: string;
  cageVolume: number;
  installedDate: string;
  lastFeedingTime: string;
  dailyFeedAmount: number;
  mortalityRate: number;
  feedConversionRatio: number;
  waterTemperature: number;
  salinity: number;
  currentSpeed: number;
  oxygenSaturation: number;
}

export default function RingDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const ringId = params.id;

  const { data: ringData, isLoading } = useQuery({
    queryKey: ["/api/v1/infrastructure/rings/", ringId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/infrastructure/rings/${ringId}`);
      if (!response.ok) throw new Error("Failed to fetch ring details");
      return response.json();
    },
  });

  const ring: RingDetail = ringData;

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
      inactive: "bg-red-100 text-red-800 border-red-200"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getNetConditionColor = (condition: string) => {
    const colors = {
      excellent: "text-green-600",
      good: "text-blue-600",
      fair: "text-yellow-600",
      poor: "text-red-600"
    };
    return colors[condition as keyof typeof colors] || "text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
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

  if (!ring) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" onClick={() => setLocation("/infrastructure/areas")} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Ring Not Found</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Ring details not available</h3>
            <p className="text-muted-foreground text-center">
              The requested ring could not be found or may have been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => setLocation(`/infrastructure/areas/${ring.areaId}/rings`)} 
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Area Rings</span>
          </Button>
          <Waves className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">{ring.name}</h1>
            <p className="text-muted-foreground">
              {ring.areaName} • Sea pen production unit
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Badge className={getStatusBadge(ring.status)}>
            {ring.status}
          </Badge>
          <Button variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Live Feed
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Biomass</CardTitle>
            <Fish className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ring.biomass}</div>
            <p className="text-xs text-muted-foreground">tons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fish Count</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ring.fishCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">individual fish</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Usage</CardTitle>
            <Gauge className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((ring.biomass / ring.capacity) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">of {ring.capacity} tons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{ring.averageWeight}</div>
            <p className="text-xs text-muted-foreground">kg per fish</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Mobile dropdown - visible only on small screens */}
        <div className="md:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {activeTab === "overview" && "Overview"}
                {activeTab === "environmental" && "Environmental"}
                {activeTab === "operations" && "Operations"}
                {activeTab === "maintenance" && "Maintenance"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop tabs - hidden on mobile */}
        <TabsList className="hidden md:grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location & Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Coordinates</span>
                    <div className="font-medium">
                      {ring.coordinates.lat.toFixed(4)}, {ring.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Water Depth</span>
                    <div className="font-medium">{ring.waterDepth}m</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cage Volume</span>
                    <div className="font-medium">{ring.cageVolume?.toLocaleString() || 'N/A'} m³</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Net Type</span>
                    <div className="font-medium">{ring.netType || 'Standard'}</div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Net Condition</span>
                    <Badge variant="outline" className={getNetConditionColor(ring.netCondition)}>
                      {ring.netCondition}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Fish className="h-5 w-5 mr-2" />
                  Production Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mortality Rate</span>
                    <span className="font-medium">{ring.mortalityRate?.toFixed(2) || '0.15'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Feed Conversion Ratio</span>
                    <span className="font-medium">{ring.feedConversionRatio?.toFixed(2) || '1.12'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Feed Amount</span>
                    <span className="font-medium">{ring.dailyFeedAmount?.toFixed(1) || '850'} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Feeding</span>
                    <span className="font-medium">
                      {ring.lastFeedingTime ? new Date(ring.lastFeedingTime).toLocaleTimeString() : '08:30'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2" />
                  Water Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Thermometer className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {ring.waterTemperature?.toFixed(1) || '8.5'}°C
                    </div>
                    <div className="text-xs text-muted-foreground">Temperature</div>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <Droplet className="h-6 w-6 mx-auto mb-2 text-cyan-600" />
                    <div className="text-2xl font-bold text-cyan-600">
                      {ring.oxygenSaturation?.toFixed(1) || '95.2'}%
                    </div>
                    <div className="text-xs text-muted-foreground">Oxygen Saturation</div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <Wind className="h-6 w-6 mx-auto mb-2 text-teal-600" />
                    <div className="text-2xl font-bold text-teal-600">
                      {ring.currentSpeed?.toFixed(1) || '0.3'} m/s
                    </div>
                    <div className="text-xs text-muted-foreground">Current Speed</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <Waves className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                    <div className="text-2xl font-bold text-indigo-600">
                      {ring.salinity?.toFixed(1) || '34.8'}‰
                    </div>
                    <div className="text-xs text-muted-foreground">Salinity</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Status</span>
                    <Badge className={ring.environmentalStatus === 'optimal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {ring.environmentalStatus}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Environmental conditions are {ring.environmentalStatus === 'optimal' ? 'within optimal ranges' : 'being monitored'} for fish welfare and growth performance.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Installed</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {ring.installedDate ? new Date(ring.installedDate).toLocaleDateString() : 'Mar 15, 2023'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Last Inspection</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(ring.lastInspection).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Fish className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Last Feeding</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {ring.lastFeedingTime ? new Date(ring.lastFeedingTime).toLocaleString() : 'Today, 08:30'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Net & Infrastructure Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Net Replacement</div>
                    <div className="text-sm text-muted-foreground">
                      Last changed: {ring.netLastChanged ? new Date(ring.netLastChanged).toLocaleDateString() : 'Jun 10, 2024'}
                    </div>
                  </div>
                  <Badge className={getNetConditionColor(ring.netCondition)}>
                    {ring.netCondition}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Regular maintenance ensures optimal fish welfare and prevents escapes. 
                  Net condition is monitored daily and replacement is scheduled based on wear assessment.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

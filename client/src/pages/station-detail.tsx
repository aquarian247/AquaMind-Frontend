import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useStationSummary } from "@/features/infrastructure/api";
import { formatWeight, formatCount } from "@/lib/formatFallback";
import { ApiService } from "@/api/generated";
import { 
  ArrowLeft, 
  MapPin, 
  Factory, 
  Thermometer,
  Droplets,
  Fish,
  Activity,
  Calendar,
  AlertTriangle,
  Settings,
  FileText,
  TrendingUp,
  Zap,
  Scale,
  Clock,
  Users,
  Shield,
  Gauge,
  Container,
  FlaskConical,
  Eye
} from "lucide-react";
import { useLocation } from "wouter";

interface StationDetail {
  id: number;
  name: string;
  geography: string;
  type: string;
  halls: number;
  coordinates: { lat: number; lng: number };
  status: string;
  waterSource: string;
  lastInspection: string;
  totalContainers: number;
  totalBiomass: number;
  capacity: number;
  currentStock: number;
  averageWeight: number;
  mortalityRate: number;
  feedConversion: number;
  waterTemperature: number;
  oxygenLevel: number;
  pH: number;
  flowRate: number;
  powerConsumption: number;
  waterUsage: number;
  lastMaintenance: string;
  nextScheduledMaintenance: string;
  staffCount: number;
  certificationStatus: string;
  lastAudit: string;
}

export default function StationDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("environmental");
  const stationId = params.id;

  const { data: station, isLoading } = useQuery({
    queryKey: ["station", stationId],
    queryFn: async () => {
      const raw = await ApiService.apiV1InfrastructureFreshwaterStationsRetrieve(
        Number(stationId),
      );

      // Fetch environmental data for this station's containers
      let waterTemperature = 0;
      let oxygenLevel = 0;
      let pH = 0;

      try {
        // Get halls for this station first
        const hallsResponse = await ApiService.apiV1InfrastructureHallsList(
          undefined, // active
          Number(stationId), // freshwaterStation
          undefined, // name
          undefined, // ordering
          undefined  // page
        );
        
        const hallIds = (hallsResponse.results || []).map(h => h.id!).filter(Boolean);
        
        if (hallIds.length === 0) {
          throw new Error('No halls found for this station');
        }

        // Get containers for these halls (first page only for performance)
        const containersResponse = await ApiService.apiV1InfrastructureContainersList(
          undefined, // active
          undefined, // area
          undefined, // areaIn
          undefined, // containerType
          undefined, // hall
          hallIds, // hallIn - filter by station's halls
          undefined, // name
          undefined, // ordering
          1, // page
          undefined  // search
        );

        const containers = containersResponse.results || [];
        
        if (containers.length > 0) {
          // Fetch stats for up to 10 containers (representative sample for performance)
          const sampleContainerIds = containers.slice(0, 10).map(c => c.id!);
          
          const statsPromises = sampleContainerIds.map(containerId =>
            fetch(`${import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000'}/api/v1/environmental/readings/stats/?container=${containerId}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            })
              .then(r => r.json())
              .catch(() => [])
          );

          const allStats = await Promise.all(statsPromises);
          
          // Aggregate by parameter
          const paramAverages: Record<string, number[]> = {};
          allStats.forEach(containerStats => {
            if (Array.isArray(containerStats)) {
              containerStats.forEach((stat: any) => {
                if (!paramAverages[stat.parameter__name]) {
                  paramAverages[stat.parameter__name] = [];
                }
                paramAverages[stat.parameter__name].push(parseFloat(stat.avg_value));
              });
            }
          });

          const calcAvg = (values: number[]) => 
            values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

          waterTemperature = calcAvg(paramAverages['Temperature'] || []);
          oxygenLevel = calcAvg(paramAverages['Dissolved Oxygen'] || []);
          pH = calcAvg(paramAverages['pH'] || []);
        }
      } catch (error) {
        console.warn('Failed to fetch environmental data for station:', error);
      }

      return {
        id: raw.id,
        name: raw.name,
        geography:
          (raw as any).geography_name ?? (raw as any).geography ?? "Unknown",
        type:
          (raw as any).station_type_display ??
          (raw as any).station_type ??
          "FRESHWATER",
        halls: 0,
        coordinates: {
          lat: (raw as any).latitude ?? 0,
          lng: (raw as any).longitude ?? 0,
        },
        status: raw.active ? "active" : "inactive",
        waterSource: "river",
        lastInspection: new Date().toISOString(),
        totalContainers: 0,
        totalBiomass: 0,
        capacity: 0,
        currentStock: 0,
        averageWeight: 0,
        mortalityRate: 0,
        feedConversion: 0,
        waterTemperature,
        oxygenLevel,
        pH,
        flowRate: 0,
        powerConsumption: 0,
        waterUsage: 0,
        lastMaintenance: new Date().toISOString(),
        nextScheduledMaintenance: new Date().toISOString(),
        staffCount: 0,
        certificationStatus: "valid",
        lastAudit: new Date().toISOString(),
      } as StationDetail;
    },
  });

  const { data: stationSummary, isPending: isSummaryLoading } = useStationSummary(Number(stationId));

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => setLocation("/infrastructure/stations")} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getWaterSourceBadge = (source: string) => {
    return source === 'river' 
      ? "bg-blue-100 text-blue-800" 
      : "bg-gray-100 text-gray-800";
  };

  const getCertificationBadge = (status: string) => {
    return status === 'valid'
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  if (!station) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" onClick={() => setLocation("/infrastructure/stations")} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Station Not Found</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Station details not available</h3>
            <p className="text-muted-foreground text-center">
              The requested station could not be found or may have been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const capacityUtilization = Math.round((((stationSummary?.active_biomass_kg ?? 0) / 1000) / (station.capacity || 1)) * 100);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => setLocation("/infrastructure/stations")} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Factory className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold truncate">{station.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{station.geography}</span>
              </span>
              <Badge className={getStatusBadge(station.status)}>
                {station.status}
              </Badge>
              <Badge className={getWaterSourceBadge(station.waterSource)}>
                {station.waterSource}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" className="flex-1 sm:flex-initial">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Configure</span>
            <span className="sm:hidden">Config</span>
          </Button>
          <Button variant="outline" onClick={() => setLocation(`/batch-management?station=${station.id}`)} className="flex-1 sm:flex-initial">
            <Fish className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">View Batches</span>
            <span className="sm:hidden">Batches</span>
          </Button>
          <Button className="flex-1 sm:flex-initial">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
        </div>
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
              {isSummaryLoading
                ? "..."
                : ((stationSummary?.active_biomass_kg ?? 0) / 1000).toLocaleString()
              }
            </div>
            <p className="text-xs text-muted-foreground">
              tons • {isSummaryLoading
                ? "..."
                : formatCount(stationSummary?.population_count, "fish")
              }
            </p>
            <Progress value={capacityUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{capacityUtilization}% of capacity</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation(`/infrastructure/stations/${station.id}/halls`)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Halls</CardTitle>
            <Container className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isSummaryLoading
                ? "..."
                : formatCount(stationSummary?.hall_count, "halls")
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {isSummaryLoading
                ? "... containers • Click to view"
                : `${formatCount(stationSummary?.container_count, "containers")} • Click to view`
              }
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs">Avg weight:</span>
              <span className="text-sm font-medium">
                {isSummaryLoading
                  ? "..."
                  : formatWeight(stationSummary?.avg_weight_kg)
                }
              </span>
            </div>
            <div className="mt-2 text-xs text-blue-600 flex items-center">
              <Factory className="h-3 w-3 mr-1" />
              View hall layout & systems
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">N/A</div>
            <p className="text-xs text-muted-foreground">Efficiency metrics not available</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs">Status:</span>
              <span className="text-sm font-medium text-muted-foreground">Data collection in progress</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff & Certification</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">N/A</div>
            <p className="text-xs text-muted-foreground">Staff data not available</p>
            <Badge className="mt-2 bg-gray-100 text-gray-800">
              Certification status pending
            </Badge>
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
                {activeTab === "environmental" && "Environmental"}
                {activeTab === "operations" && "Operations"}
                {activeTab === "infrastructure" && "Infrastructure"}
                {activeTab === "staff" && "Staff & Compliance"}
                {activeTab === "maintenance" && "Maintenance"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="staff">Staff & Compliance</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop tabs - hidden on mobile */}
        <TabsList className="hidden md:grid w-full grid-cols-5">
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="staff">Staff & Compliance</TabsTrigger>
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
                <div className="text-2xl font-bold">
                  {station.waterTemperature && station.waterTemperature > 0
                    ? `${station.waterTemperature.toFixed(1)}°C`
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {station.waterTemperature > 0 ? 'Optimal: 6-12°C' : 'No temperature data'}
                </p>
                {station.waterTemperature > 0 && (
                  <div className="mt-2">
                    <Progress value={Math.min(100, Math.max(0, ((station.waterTemperature - 6) / 6) * 100))} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dissolved Oxygen</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {station.oxygenLevel && station.oxygenLevel > 0
                    ? `${station.oxygenLevel.toFixed(1)}%`
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {station.oxygenLevel > 0 ? 'Dissolved oxygen saturation' : 'No oxygen data'}
                </p>
                {station.oxygenLevel > 0 && (
                  <div className="mt-2">
                    <Progress value={Math.min(100, station.oxygenLevel)} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">pH Level</CardTitle>
                <FlaskConical className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {station.pH && station.pH > 0
                    ? station.pH.toFixed(1)
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {station.pH > 0 ? 'Optimal: 6.5-7.5' : 'No pH data'}
                </p>
                {station.pH > 0 && (
                  <div className="mt-2">
                    <Progress value={Math.min(100, Math.max(0, ((station.pH - 6.5) / 1) * 100))} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flow Rate</CardTitle>
                <Gauge className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-xs text-muted-foreground">Not tracked</p>
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
                    <span className="text-muted-foreground">Water Source:</span>
                    <div className="font-medium capitalize">{station.waterSource}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Coordinates:</span>
                    <div className="font-medium">
                      {station.coordinates && typeof station.coordinates.lat === 'number' && typeof station.coordinates.lng === 'number'
                        ? `${station.coordinates.lat.toFixed(4)}, ${station.coordinates.lng.toFixed(4)}`
                        : "N/A"
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Reading:</span>
                    <div className="font-medium">{new Date().toLocaleTimeString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Check:</span>
                    <div className="font-medium">In 1 hour</div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    View Historical Data
                  </Button>
                  <Button variant="outline" size="sm">
                    Configure Alerts
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
                  <Activity className="h-5 w-5" />
                  <span>Production Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current Stock:</span>
                    <div className="text-lg font-semibold">
                      {isSummaryLoading
                        ? "..."
                        : formatCount(stationSummary?.population_count, "fish")
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average Weight:</span>
                    <div className="text-lg font-semibold">
                      {isSummaryLoading
                        ? "..."
                        : formatWeight(stationSummary?.avg_weight_kg)
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mortality Rate:</span>
                    <div className="text-lg font-semibold">N/A</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Feed Conversion:</span>
                    <div className="text-lg font-semibold">N/A</div>
                  </div>
                </div>
                <Progress value={capacityUtilization} />
                <p className="text-xs text-muted-foreground">
                  Capacity utilization: {capacityUtilization}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Container className="h-5 w-5" />
                  <span>Infrastructure Layout</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Production Halls:</span>
                    <div className="text-lg font-semibold">
                      {isSummaryLoading
                        ? "..."
                        : formatCount(stationSummary?.hall_count, "halls")
                      }
                    </div>
                  </div>
                  <div 
                    className="cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                    onClick={() => setLocation(`/infrastructure/stations/${station.id}/containers`)}
                  >
                    <span className="text-muted-foreground">Total Containers:</span>
                    <div className="text-lg font-semibold text-blue-600">
                      {isSummaryLoading
                        ? "..."
                        : formatCount(stationSummary?.container_count, "containers")
                      }
                    </div>
                    <div className="text-xs text-blue-600 flex items-center mt-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Quick access
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Containers/Hall:</span>
                    <div className="text-lg font-semibold">
                      {isSummaryLoading
                        ? "..."
                        : (stationSummary?.hall_count && stationSummary.hall_count > 0 && stationSummary.container_count
                          ? Math.round(stationSummary.container_count / stationSummary.hall_count)
                          : "N/A")
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacity:</span>
                    <div className="text-lg font-semibold">N/A</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation(`/infrastructure/stations/${station.id}/halls`)}
                  >
                    View by Halls
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation(`/infrastructure/stations/${station.id}/containers`)}
                  >
                    All Containers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Power & Utilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Power Consumption:</span>
                    <div className="text-lg font-semibold">{station.powerConsumption} kW</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Water Usage:</span>
                    <div className="text-lg font-semibold">{station.waterUsage} m³/day</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">kW per ton:</span>
                    <div className="text-lg font-semibold">
                      {station.totalBiomass && typeof station.totalBiomass === 'number' && station.totalBiomass > 0
                        ? (station.powerConsumption / station.totalBiomass).toFixed(1)
                        : "N/A"
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Water per ton:</span>
                    <div className="text-lg font-semibold">
                      {station.totalBiomass && typeof station.totalBiomass === 'number' && station.totalBiomass > 0
                        ? `${(station.waterUsage / station.totalBiomass).toFixed(1)} m³`
                        : "N/A"
                      }
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Energy Efficiency</span>
                    <span>
                      {typeof station.powerConsumption === 'number' && station.powerConsumption >= 0
                        ? `${100 - Math.round((station.powerConsumption / 300) * 100)}%`
                        : "N/A"
                      }
                    </span>
                  </div>
                  <Progress value={
                    typeof station.powerConsumption === 'number' && station.powerConsumption >= 0
                      ? 100 - (station.powerConsumption / 300) * 100
                      : 0
                  } />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div>
                    <div className="font-medium text-sm">Filtration System</div>
                    <div className="text-xs text-muted-foreground">Operating normally</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div>
                    <div className="font-medium text-sm">Oxygenation</div>
                    <div className="text-xs text-muted-foreground">All systems active</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div>
                    <div className="font-medium text-sm">Backup Power</div>
                    <div className="text-xs text-muted-foreground">Standby mode</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">System Diagnostics</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Staff Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Staff:</span>
                    <div className="text-lg font-semibold">{station.staffCount}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Staff per Hall:</span>
                    <div className="text-lg font-semibold">
                      {station.halls && typeof station.halls === 'number' && station.halls > 0
                        ? Math.round(station.staffCount / station.halls * 10) / 10
                        : "N/A"
                      }
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Shift Coverage</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} />
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Staff Schedule</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Compliance & Certification</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Certification Status</span>
                    <Badge className={getCertificationBadge(station.certificationStatus)}>
                      {station.certificationStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Last Audit:</span>
                      <div className="font-medium">{new Date(station.lastAudit).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">View Certificates</Button>
                  <Button variant="outline" size="sm">Audit Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Maintenance Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Last Maintenance</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {new Date(station.lastMaintenance).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground">System overhaul completed</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">Next Scheduled</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {new Date(station.nextScheduledMaintenance).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Preventive maintenance</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Upcoming Tasks</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Filter replacement</span>
                    <Badge variant="outline">Due in 2 days</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Pump inspection</span>
                    <Badge variant="outline">Due in 5 days</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">System calibration</span>
                    <Badge variant="outline">Due in 1 week</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Safety equipment check</span>
                    <Badge variant="outline">Due in 10 days</Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">Schedule Maintenance</Button>
                <Button variant="outline" size="sm">Maintenance History</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

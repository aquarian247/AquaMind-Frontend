import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const stationId = params.id;

  const { data: station, isLoading } = useQuery({
    queryKey: ["/api/v1/infrastructure/stations/", stationId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/infrastructure/stations/${stationId}`);
      if (!response.ok) throw new Error("Failed to fetch station details");
      return response.json();
    },
  });

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

  const capacityUtilization = Math.round((station.totalBiomass / station.capacity) * 100);
  const efficiencyScore = Math.round((2.0 - station.feedConversion) * 100); // Higher FCR = lower efficiency

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
            <div className="text-2xl font-bold text-blue-600">{station.totalBiomass}</div>
            <p className="text-xs text-muted-foreground">tons • {station.currentStock.toLocaleString()} fish</p>
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
            <div className="text-2xl font-bold text-green-600">{station.halls}</div>
            <p className="text-xs text-muted-foreground">{station.totalContainers} containers • Click to view</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs">Avg weight:</span>
              <span className="text-sm font-medium">{(station.averageWeight * 1000).toFixed(0)}g</span>
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
            <div className="text-2xl font-bold text-purple-600">{efficiencyScore}%</div>
            <p className="text-xs text-muted-foreground">FCR: {station.feedConversion}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs">Mortality:</span>
              <span className="text-sm font-medium">{station.mortalityRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff & Certification</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{station.staffCount}</div>
            <p className="text-xs text-muted-foreground">staff members</p>
            <Badge className={`mt-2 ${getCertificationBadge(station.certificationStatus)}`}>
              {station.certificationStatus.replace('_', ' ')}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="environmental" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
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
                <div className="text-2xl font-bold">{station.waterTemperature}°C</div>
                <p className="text-xs text-muted-foreground">Optimal: 6-12°C</p>
                <div className="mt-2">
                  <Progress value={((station.waterTemperature - 6) / 6) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dissolved Oxygen</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{station.oxygenLevel}</div>
                <p className="text-xs text-muted-foreground">mg/L</p>
                <div className="mt-2">
                  <Progress value={(station.oxygenLevel / 12) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">pH Level</CardTitle>
                <FlaskConical className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{station.pH}</div>
                <p className="text-xs text-muted-foreground">Optimal: 6.5-7.5</p>
                <div className="mt-2">
                  <Progress value={((station.pH - 6.5) / 1) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flow Rate</CardTitle>
                <Gauge className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{station.flowRate}</div>
                <p className="text-xs text-muted-foreground">L/min per tank</p>
                <div className="mt-2">
                  <Progress value={(station.flowRate / 100) * 100} />
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
                    <span className="text-muted-foreground">Water Source:</span>
                    <div className="font-medium capitalize">{station.waterSource}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Coordinates:</span>
                    <div className="font-medium">{station.coordinates.lat.toFixed(4)}, {station.coordinates.lng.toFixed(4)}</div>
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
                    <div className="text-lg font-semibold">{station.currentStock.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average Weight:</span>
                    <div className="text-lg font-semibold">{(station.averageWeight * 1000).toFixed(0)}g</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mortality Rate:</span>
                    <div className="text-lg font-semibold">{station.mortalityRate}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Feed Conversion:</span>
                    <div className="text-lg font-semibold">{station.feedConversion}</div>
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
                    <div className="text-lg font-semibold">{station.halls}</div>
                  </div>
                  <div 
                    className="cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                    onClick={() => setLocation(`/infrastructure/stations/${station.id}/containers`)}
                  >
                    <span className="text-muted-foreground">Total Containers:</span>
                    <div className="text-lg font-semibold text-blue-600">{station.totalContainers}</div>
                    <div className="text-xs text-blue-600 flex items-center mt-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Quick access
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Containers/Hall:</span>
                    <div className="text-lg font-semibold">{Math.round(station.totalContainers / station.halls)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacity:</span>
                    <div className="text-lg font-semibold">{station.capacity} tons</div>
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
                    <div className="text-lg font-semibold">{(station.powerConsumption / station.totalBiomass).toFixed(1)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Water per ton:</span>
                    <div className="text-lg font-semibold">{(station.waterUsage / station.totalBiomass).toFixed(1)} m³</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Energy Efficiency</span>
                    <span>{100 - Math.round((station.powerConsumption / 300) * 100)}%</span>
                  </div>
                  <Progress value={100 - (station.powerConsumption / 300) * 100} />
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
                    <div className="text-lg font-semibold">{Math.round(station.staffCount / station.halls * 10) / 10}</div>
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
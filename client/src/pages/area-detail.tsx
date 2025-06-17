import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResponsiveTabs } from "@/components/ui/responsive-tabs";
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
  Eye
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
  lastFeeding: string;
  nextScheduledMaintenance: string;
  licenseNumber: string;
  licenseExpiry: string;
  maxBiomassAllowed: number;
}

export default function AreaDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const areaId = params.id;

  const { data: area, isLoading } = useQuery({
    queryKey: ["/api/v1/infrastructure/areas/", areaId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/infrastructure/areas/${areaId}`);
      if (!response.ok) throw new Error("Failed to fetch area details");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => setLocation("/infrastructure/areas")} className="p-2">
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

  const capacityUtilization = Math.round((area.totalBiomass / area.capacity) * 100);
  const licenseUtilization = Math.round((area.totalBiomass / area.maxBiomassAllowed) * 100);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => setLocation("/infrastructure/areas")} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Waves className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold truncate">{area.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{area.geography}</span>
              </span>
              <Badge className={getStatusBadge(area.status)}>
                {area.status}
              </Badge>
              <span className="hidden sm:inline">License: {area.licenseNumber}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" className="flex-1 sm:flex-initial">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Configure</span>
            <span className="sm:hidden">Config</span>
          </Button>
          <Button variant="outline" onClick={() => setLocation(`/batch-management?area=${area.id}`)} className="flex-1 sm:flex-initial">
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
            <div className="text-2xl font-bold text-blue-600">{area.totalBiomass}</div>
            <p className="text-xs text-muted-foreground">tons • {area.currentStock.toLocaleString()} fish</p>
            <Progress value={capacityUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{capacityUtilization}% of capacity</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation(`/infrastructure/areas/${area.id}/rings`)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Rings</CardTitle>
            <Waves className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{area.rings}</div>
            <p className="text-xs text-muted-foreground">Active sea pens • Click to view</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs">Avg weight:</span>
              <span className="text-sm font-medium">{area.averageWeight} kg</span>
            </div>
            <div className="mt-2 text-xs text-blue-600 flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              View ring layout & status
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{area.feedConversion}</div>
            <p className="text-xs text-muted-foreground">FCR ratio</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs">Mortality:</span>
              <span className="text-sm font-medium">{area.mortalityRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">License Status</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{licenseUtilization}%</div>
            <p className="text-xs text-muted-foreground">of max allowed biomass</p>
            <Progress value={licenseUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {area.maxBiomassAllowed - area.totalBiomass} tons remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="environmental" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="environmental" className="text-xs sm:text-sm">Environmental</TabsTrigger>
          <TabsTrigger value="operations" className="text-xs sm:text-sm">Operations</TabsTrigger>
          <TabsTrigger value="regulatory" className="text-xs sm:text-sm">Regulatory</TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs sm:text-sm">Maintenance</TabsTrigger>
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
                <p className="text-xs text-muted-foreground">Optimal range: 8-12°C</p>
                <div className="mt-2">
                  <Progress value={((area.waterTemperature - 8) / 4) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dissolved Oxygen</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{area.oxygenLevel}</div>
                <p className="text-xs text-muted-foreground">mg/L</p>
                <div className="mt-2">
                  <Progress value={(area.oxygenLevel / 12) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salinity</CardTitle>
                <Scale className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{area.salinity}</div>
                <p className="text-xs text-muted-foreground">ppt</p>
                <div className="mt-2">
                  <Progress value={((area.salinity - 30) / 10) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Speed</CardTitle>
                <Wind className="h-4 w-4 text-gray-500" />
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
                  <Activity className="h-5 w-5" />
                  <span>Production Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current Stock:</span>
                    <div className="text-lg font-semibold">{area.currentStock.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average Weight:</span>
                    <div className="text-lg font-semibold">{area.averageWeight} kg</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mortality Rate:</span>
                    <div className="text-lg font-semibold">{area.mortalityRate}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Feed Conversion:</span>
                    <div className="text-lg font-semibold">{area.feedConversion}</div>
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
                  <Clock className="h-5 w-5" />
                  <span>Recent Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div>
                    <div className="font-medium text-sm">Last Feeding</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(area.lastFeeding).toLocaleString()}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div>
                    <div className="font-medium text-sm">Inspection</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(area.lastInspection).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Regular</Badge>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">View Activity Log</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regulatory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>License & Compliance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-muted-foreground">License Number:</span>
                  <div className="font-medium">{area.licenseNumber}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <div className="font-medium">{new Date(area.licenseExpiry).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Max Biomass:</span>
                  <div className="font-medium">{area.maxBiomassAllowed} tons</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current vs Licensed Capacity</span>
                  <span>{licenseUtilization}%</span>
                </div>
                <Progress value={licenseUtilization} />
                <p className="text-xs text-muted-foreground">
                  {area.maxBiomassAllowed - area.totalBiomass} tons remaining capacity
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">View Permits</Button>
                <Button variant="outline" size="sm">Compliance Report</Button>
              </div>
            </CardContent>
          </Card>
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
                    <span className="font-medium">Next Scheduled Maintenance</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {new Date(area.nextScheduledMaintenance).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Routine net inspection and cleaning</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">Maintenance Status</span>
                  </div>
                  <Badge className={getStatusBadge(area.status)}>
                    {area.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">All systems operational</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Upcoming Tasks</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Net integrity check</span>
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
    </div>
  );
}
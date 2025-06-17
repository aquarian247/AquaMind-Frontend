import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
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
}

export default function AreaDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("environmental");

  const { data: area, isLoading, error } = useQuery({
    queryKey: ["/api/v1/infrastructure/areas", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/infrastructure/areas/${params.id}`);
      if (!response.ok) throw new Error("Area not found");
      return response.json();
    },
  });

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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Areas
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      operational: "bg-green-100 text-green-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      restricted: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
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
            <div className="text-2xl font-bold text-blue-600">{area.totalBiomass.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">tonnes</p>
            <div className="mt-2">
              <Progress value={(area.totalBiomass / area.capacity) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
            <Scale className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{area.averageWeight}</div>
            <p className="text-xs text-muted-foreground">kg per fish</p>
            <div className="mt-2">
              <Progress value={(area.averageWeight / 6) * 100} />
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

      {/* Detailed Information Tabs */}
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
                      <div className="font-medium">{area.currentStock.toLocaleString()} fish</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>
                      <div className="font-medium">{area.capacity.toLocaleString()} tonnes</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Utilization:</span>
                      <div className="font-medium">{Math.round((area.totalBiomass / area.capacity) * 100)}%</div>
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
    </div>
  );
}
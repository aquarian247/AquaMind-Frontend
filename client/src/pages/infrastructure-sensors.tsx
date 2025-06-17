import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Activity,
  Search,
  Filter,
  Eye,
  Settings,
  Thermometer,
  Droplet,
  Wind,
  Gauge,
  MapPin,
  Calendar,
  Wifi,
  WifiOff,
  AlertTriangle
} from "lucide-react";
import { useLocation } from "wouter";

interface SensorOverview {
  id: number;
  name: string;
  type: "Temperature" | "Oxygen" | "pH" | "Salinity" | "Flow" | "Pressure" | "Turbidity" | "Light";
  status: "online" | "offline" | "error" | "maintenance";
  location: {
    geography: string;
    station?: string;
    hall?: string;
    area?: string;
    ring?: string;
    containerId?: number;
  };
  currentValue: number;
  unit: string;
  lastReading: string;
  batteryLevel?: number;
  signalStrength: number;
  alertStatus: "normal" | "warning" | "critical";
  calibrationDue: string;
}

export default function InfrastructureSensors() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [geographyFilter, setGeographyFilter] = useState("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [alertFilter, setAlertFilter] = useState("all");

  const { data: sensorsData, isLoading } = useQuery({
    queryKey: ["/api/v1/infrastructure/sensors/overview", geographyFilter, facilityFilter, typeFilter, statusFilter, alertFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (geographyFilter !== "all") params.append("geography", geographyFilter);
      if (facilityFilter !== "all") params.append("facility", facilityFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (alertFilter !== "all") params.append("alert", alertFilter);
      
      const response = await fetch(`/api/v1/infrastructure/sensors/overview?${params}`);
      if (!response.ok) throw new Error("Failed to fetch sensors");
      return response.json();
    },
  });

  const sensors: SensorOverview[] = sensorsData?.results || [];

  // Further filter by search query
  const filteredSensors = sensors.filter(sensor => 
    sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sensor.location.station?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sensor.location.area?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      online: "bg-green-100 text-green-800",
      offline: "bg-red-100 text-red-800",
      error: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getAlertBadge = (alert: string) => {
    const variants = {
      normal: "bg-gray-100 text-gray-800",
      warning: "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800"
    };
    return variants[alert as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      "Temperature": <Thermometer className="h-4 w-4 text-blue-600" />,
      "Oxygen": <Droplet className="h-4 w-4 text-cyan-600" />,
      "pH": <Activity className="h-4 w-4 text-green-600" />,
      "Salinity": <Wind className="h-4 w-4 text-purple-600" />,
      "Flow": <Gauge className="h-4 w-4 text-orange-600" />,
      "Pressure": <Gauge className="h-4 w-4 text-red-600" />,
      "Turbidity": <Eye className="h-4 w-4 text-gray-600" />,
      "Light": <div className="h-4 w-4 bg-yellow-400 rounded-full" />
    };
    return icons[type as keyof typeof icons] || <Activity className="h-4 w-4" />;
  };

  const getSignalIcon = (strength: number, status: string) => {
    if (status === 'offline') return <WifiOff className="h-4 w-4 text-red-500" />;
    if (strength > 70) return <Wifi className="h-4 w-4 text-green-500" />;
    if (strength > 40) return <Wifi className="h-4 w-4 text-yellow-500" />;
    return <Wifi className="h-4 w-4 text-red-500" />;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
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
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Activity className="h-8 w-8 mr-3 text-blue-600" />
            All Sensors
          </h1>
          <p className="text-muted-foreground">
            Environmental monitoring across all facilities • {filteredSensors.length} sensors
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Site & Sensor Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            {/* Search - Full width on mobile */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sensors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>

            {/* Filter dropdowns - responsive grid */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Geography</label>
                <Select value={geographyFilter} onValueChange={setGeographyFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="Faroe Islands">Faroe Islands</SelectItem>
                    <SelectItem value="Scotland">Scotland</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Facility</label>
                <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Facilities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Facilities</SelectItem>
                    <SelectItem value="stations">Freshwater Stations</SelectItem>
                    <SelectItem value="areas">Sea Areas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sensor Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Temperature">Temperature</SelectItem>
                    <SelectItem value="Oxygen">Dissolved Oxygen</SelectItem>
                    <SelectItem value="pH">pH Level</SelectItem>
                    <SelectItem value="Salinity">Salinity</SelectItem>
                    <SelectItem value="Flow">Flow Rate</SelectItem>
                    <SelectItem value="Pressure">Pressure</SelectItem>
                    <SelectItem value="Turbidity">Turbidity</SelectItem>
                    <SelectItem value="Light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Alert Level</label>
                <Select value={alertFilter} onValueChange={setAlertFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Alerts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sensors</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredSensors.length}</div>
            <p className="text-xs text-muted-foreground">Monitoring devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredSensors.filter(s => s.status === 'online').length}
            </div>
            <p className="text-xs text-muted-foreground">Active sensors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredSensors.filter(s => s.alertStatus !== 'normal').length}
            </div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <WifiOff className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredSensors.filter(s => s.status === 'offline' || s.status === 'error').length}
            </div>
            <p className="text-xs text-muted-foreground">Need maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Sensors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSensors.map((sensor) => (
          <Card key={sensor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    {getTypeIcon(sensor.type)}
                    <span className="ml-2">{sensor.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{sensor.location.geography}</span>
                    <span>•</span>
                    <span>{sensor.location.station || sensor.location.area}</span>
                    {sensor.location.hall && (
                      <>
                        <span>•</span>
                        <span>{sensor.location.hall}</span>
                      </>
                    )}
                    {sensor.location.ring && (
                      <>
                        <span>•</span>
                        <span>{sensor.location.ring}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusBadge(sensor.status)}>
                    {sensor.status}
                  </Badge>
                  {sensor.alertStatus !== 'normal' && (
                    <Badge className={getAlertBadge(sensor.alertStatus)}>
                      {sensor.alertStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {sensor.currentValue}
                </div>
                <div className="text-sm text-muted-foreground">{sensor.unit}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Current Reading
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Signal</span>
                  <div className="flex items-center space-x-1">
                    {getSignalIcon(sensor.signalStrength, sensor.status)}
                    <span className="font-medium">{sensor.signalStrength}%</span>
                  </div>
                </div>
                {sensor.batteryLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Battery</span>
                    <span className="font-medium">{sensor.batteryLevel}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Reading:</span>
                  <span>{new Date(sensor.lastReading).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calibration Due:</span>
                  <span>{new Date(sensor.calibrationDue).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setLocation(`/infrastructure/sensors/${sensor.id}`)}
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

      {filteredSensors.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No sensors found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your filter criteria to find the sensors you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
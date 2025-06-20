import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Factory,
  Thermometer,
  Droplet,
  Zap,
  Gauge,
  Settings,
  Search,
  Calendar,
  Activity
} from "lucide-react";
import { useLocation } from "wouter";

interface Hall {
  id: number;
  name: string;
  stationId: number;
  stationName: string;
  status: string;
  containers: number;
  totalBiomass: number;
  capacity: number;
  temperature: number;
  oxygenLevel: number;
  flowRate: number;
  powerUsage: number;
  lastMaintenance: string;
  systemStatus: string;
}

export default function StationHalls({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const stationId = params.id;
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: hallsData, isLoading } = useQuery({
    queryKey: ["/api/v1/infrastructure/stations/", stationId, "/halls"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/infrastructure/stations/${stationId}/halls`);
      if (!response.ok) throw new Error("Failed to fetch halls");
      return response.json();
    },
  });

  const halls: Hall[] = hallsData?.results || [];

  // Filter halls based on search and status
  const filteredHalls = halls.filter(hall => {
    const matchesSearch = hall.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || hall.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getSystemStatusBadge = (status: string) => {
    const variants = {
      optimal: "bg-green-100 text-green-800",
      monitoring: "bg-yellow-100 text-yellow-800",
      alert: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => setLocation(`/infrastructure/stations/${stationId}`)} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <Button variant="ghost" onClick={() => setLocation(`/infrastructure/stations/${stationId}`)} className="flex items-center">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Station Detail</span>
          </Button>
          <Factory className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Production Halls</h1>
            <p className="text-muted-foreground">
              {halls[0]?.stationName || `Station ${stationId}`} • Freshwater facilities
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            System Controls
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Halls</CardTitle>
            <Factory className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredHalls.length}</div>
            <p className="text-xs text-muted-foreground">Production facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <Gauge className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredHalls.reduce((sum, hall) => sum + hall.containers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Active units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biomass</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredHalls.reduce((sum, hall) => sum + hall.totalBiomass, 0)} tons
            </div>
            <p className="text-xs text-muted-foreground">Current stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Power Usage</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredHalls.reduce((sum, hall) => sum + hall.powerUsage, 0)} kW
            </div>
            <p className="text-xs text-muted-foreground">Total consumption</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search halls..."
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

      {/* Halls Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredHalls.map((hall) => (
          <Card key={hall.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{hall.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {hall.containers} containers
                  </p>
                </div>
                <div className="space-y-1">
                  <Badge className={getStatusBadge(hall.status)}>
                    {hall.status}
                  </Badge>
                  <Badge className={getSystemStatusBadge(hall.systemStatus)}>
                    {hall.systemStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Biomass</span>
                  <div className="font-semibold text-lg">{hall.totalBiomass} tons</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Capacity</span>
                  <div className="font-semibold text-lg">{hall.capacity} tons</div>
                </div>
                <div className="flex items-center space-x-1">
                  <Thermometer className="h-3 w-3 text-blue-500" />
                  <span className="text-muted-foreground">Temp</span>
                  <div className="font-medium">{hall.temperature}°C</div>
                </div>
                <div className="flex items-center space-x-1">
                  <Droplet className="h-3 w-3 text-cyan-500" />
                  <span className="text-muted-foreground">O₂</span>
                  <div className="font-medium">{hall.oxygenLevel} mg/L</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity Utilization</span>
                  <span>{Math.round((hall.totalBiomass / hall.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min((hall.totalBiomass / hall.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flow Rate:</span>
                  <span>{hall.flowRate} L/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Power Usage:</span>
                  <span>{hall.powerUsage} kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Last Maintenance:
                  </span>
                  <span>{new Date(hall.lastMaintenance).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setLocation(`/infrastructure/halls/${hall.id}`)}
                >
                  <Activity className="h-4 w-4 mr-2" />
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

      {filteredHalls.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Factory className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No halls found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or status filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
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
  Fish,
  Calendar,
  Activity,
  Eye
} from "lucide-react";
import { useLocation } from "wouter";
import { ApiService } from "@/api/generated";

interface Container {
  id: number;
  name: string;
  hallId: number;
  hallName: string;
  stationId: number;
  stationName: string;
  type: "Tray" | "Fry Tank" | "Parr Tank" | "Smolt Tank" | "Post-Smolt Tank";
  stage: "Egg&Alevin" | "Fry" | "Parr" | "Smolt" | "Post-Smolt";
  status: string;
  biomass: number;
  capacity: number;
  fishCount: number;
  averageWeight: number;
  temperature: number;
  oxygenLevel: number;
  flowRate: number;
  lastMaintenance: string;
  systemStatus: string;
  density: number;
  feedingSchedule: string;
}

export default function HallDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const hallId = params.id;
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  /* -------------------------------------------------
   * Hall metadata (for names / station linkage)
   * ------------------------------------------------- */
  const { data: hall } = useQuery({
    queryKey: ["hall", hallId],
    queryFn: () =>
      ApiService.apiV1InfrastructureHallsRetrieve(Number(hallId)),
  });

  const { data: containersData, isLoading } = useQuery({
    queryKey: ["hall", hallId, "containers"],
    queryFn: async () => {
      const res = await ApiService.apiV1InfrastructureContainersList({
        hall: Number(hallId),
      } as any);

      /* Map API result to UI shape expected by page */
      const mapped = (res.results || []).map((c: any) => {
        const capacity = parseFloat(c.volume_m3 ?? "0") || 0;
        return {
          id: c.id,
          name: c.name,
          hallId: c.hall ?? Number(hallId),
          hallName: c.hall_name || hall?.name || `Hall ${hallId}`,
          stationId: hall?.freshwater_station ?? 0,
          stationName: hall?.freshwater_station_name ?? "",
          type: (c.container_type_name as Container["type"]) || "Smolt Tank",
          stage: "Smolt",
          status: c.active ? "active" : "inactive",
          biomass: 0,
          capacity,
          fishCount: 0,
          averageWeight: 0,
          temperature: 0,
          oxygenLevel: 0,
          flowRate: 0,
          lastMaintenance: new Date().toISOString(),
          systemStatus: "optimal",
          density: 0,
          feedingSchedule: "08:00, 12:00, 16:00",
        } as Container;
      });

      return { results: mapped };
    },
  });

  const containers: Container[] = containersData?.results || [];

  // Filter containers based on search, status, and type
  const filteredContainers = containers.filter(container => {
    const matchesSearch = container.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || container.status === statusFilter;
    const matchesType = typeFilter === "all" || container.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  /* -------------------------------------------------
   * Derived naming & helper utilities
   * ------------------------------------------------- */
  const effectiveStationId =
    hall?.freshwater_station ?? containers[0]?.stationId;
  const headerHallName =
    hall?.name ?? containers[0]?.hallName ?? `Hall ${hallId}`;
  const headerStationName =
    hall?.freshwater_station_name ??
    containers[0]?.stationName ??
    (effectiveStationId ? `Station ${effectiveStationId}` : "Station");

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800",
    } as const;
    return (
      variants[status as keyof typeof variants] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      Tray: "bg-purple-100 text-purple-800",
      "Fry Tank": "bg-blue-100 text-blue-800",
      "Parr Tank": "bg-cyan-100 text-cyan-800",
      "Smolt Tank": "bg-green-100 text-green-800",
      "Post-Smolt Tank": "bg-orange-100 text-orange-800",
    } as const;
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getStageIcon = (stage: string) => {
    const icons = {
      "Egg&Alevin": "🥚",
      Fry: "🐟",
      Parr: "🐠",
      Smolt: "🐟",
      "Post-Smolt": "🐡",
    } as const;
    return icons[stage as keyof typeof icons] || "🐟";
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
          <Button 
            variant="ghost" 
            onClick={() =>
              effectiveStationId &&
              setLocation(`/infrastructure/stations/${effectiveStationId}/halls`)
            } 
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Station Halls</span>
          </Button>
          <Factory className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">{headerHallName}</h1>
            <p className="text-muted-foreground">
              {headerStationName} • Production containers
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            System Monitor
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <Factory className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredContainers.length}</div>
            <p className="text-xs text-muted-foreground">Production units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biomass</CardTitle>
            <Fish className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredContainers.reduce((sum, container) => sum + container.biomass, 0).toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground">Current stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Containers</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredContainers.filter(container => container.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(filteredContainers.reduce((sum, container) => sum + container.temperature, 0) / filteredContainers.length).toFixed(1)}°C
            </div>
            <p className="text-xs text-muted-foreground">Hall average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search containers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Tray">Egg & Alevin Trays</SelectItem>
            <SelectItem value="Fry Tank">Fry Tanks</SelectItem>
            <SelectItem value="Parr Tank">Parr Tanks</SelectItem>
            <SelectItem value="Smolt Tank">Smolt Tanks</SelectItem>
            <SelectItem value="Post-Smolt Tank">Post-Smolt Tanks</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Containers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredContainers.map((container) => (
          <Card key={container.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <span className="mr-2">{getStageIcon(container.stage)}</span>
                    {container.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {container.stage} Stage
                  </p>
                </div>
                <div className="space-y-1">
                  <Badge className={getStatusBadge(container.status)}>
                    {container.status}
                  </Badge>
                  <Badge className={getTypeBadge(container.type)}>
                    {container.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Biomass</span>
                  <div className="font-semibold text-lg">{container.biomass} kg</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Fish Count</span>
                  <div className="font-semibold text-lg">{container.fishCount.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-1">
                  <Thermometer className="h-3 w-3 text-blue-500" />
                  <span className="text-muted-foreground">Temp</span>
                  <div className="font-medium">{container.temperature}°C</div>
                </div>
                <div className="flex items-center space-x-1">
                  <Droplet className="h-3 w-3 text-cyan-500" />
                  <span className="text-muted-foreground">O₂</span>
                  <div className="font-medium">{container.oxygenLevel} mg/L</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity Utilization</span>
                  <span>{Math.round((container.biomass / container.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min((container.biomass / container.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Density:</span>
                  <span>{container.density} kg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flow Rate:</span>
                  <span>{container.flowRate} L/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Feeding:</span>
                  <span>{container.feedingSchedule}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Last Maintenance:
                  </span>
                  <span>{new Date(container.lastMaintenance).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setLocation(`/infrastructure/containers/${container.id}`)}
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

      {filteredContainers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Factory className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No containers found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

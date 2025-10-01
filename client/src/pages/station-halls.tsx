import { useState, useMemo } from "react";
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
import { ApiService } from "@/api/generated";
import { useHallSummaries, type HallSummary } from "@/features/infrastructure/api";
import { formatCount, formatWeight } from "@/lib/formatFallback";

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
    queryKey: ["station", stationId, "halls"],
    queryFn: async () => {
      // ✅ Use correct camelCase parameter name from generated API
      const res = await ApiService.apiV1InfrastructureHallsList(
        undefined, // active filter
        Number(stationId) // freshwaterStation parameter
      );

      const mapped = (res.results || []).map((raw: any): Hall => ({
        id: raw.id,
        name: raw.name,
        stationId: raw.freshwater_station ?? Number(stationId),
        stationName: raw.freshwater_station_name ?? "",
        status: raw.active ? "active" : "inactive",
        containers: 0,
        totalBiomass: 0,
        capacity: 0,
        temperature: 0,
        oxygenLevel: 0,
        flowRate: 0,
        powerUsage: 0,
        lastMaintenance: new Date().toISOString(),
        systemStatus: "optimal",
      }));

      return { results: mapped };
    },
  });

  const halls: Hall[] = hallsData?.results || [];

  // Fetch server-side aggregations for all halls
  const hallIds = useMemo(() => halls.map(h => h.id), [halls]);
  const { data: hallSummaries, isLoading: summariesLoading } = useHallSummaries(hallIds);

  // Create lookup map for summaries
  const summaryMap = useMemo(() => {
    if (!hallSummaries) return new Map<number, HallSummary>();
    return new Map(hallSummaries.map(s => [s.id!, s]));
  }, [hallSummaries]);

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
        {filteredHalls.map((hall) => {
          // Get server-side aggregated summary for this hall
          const summary = summaryMap.get(hall.id);
          
          return (
          <Card key={hall.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{hall.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {summariesLoading ? "..." : formatCount(summary?.container_count, "containers")}
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
                  <div className="font-semibold text-lg">
                    {summariesLoading ? "..." : formatWeight(summary?.active_biomass_kg)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Population</span>
                  <div className="font-semibold text-lg">
                    {summariesLoading ? "..." : formatCount(summary?.population_count)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Weight</span>
                  <div className="font-semibold text-lg">
                    {summariesLoading ? "..." : formatWeight(summary?.avg_weight_kg)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Utilization</span>
                  <div className="font-semibold text-lg">
                    {summariesLoading || !summary?.container_count 
                      ? "N/A" 
                      : `${Math.round((summary.population_count || 0) / (summary.container_count * 1000)) * 10}%`}
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Server-side aggregation • {summariesLoading ? "Loading..." : "Live data"}
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
          );
        })}
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

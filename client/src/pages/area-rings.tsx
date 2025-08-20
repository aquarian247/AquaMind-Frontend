import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Waves, 
  Fish,
  Activity,
  Eye,
  Settings,
  Search,
  Gauge,
  Thermometer,
  MapPin,
  Calendar
} from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api"; // use shared API wrapper

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

export default function AreaRings({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const areaId = params.id;
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ringsData, isLoading } = useQuery({
    // Semantic, non-URL key
    queryKey: ["infrastructure/area-rings", areaId],
    // Use wrapper which handles fetch + pagination mapping
    queryFn: () => api.infrastructure.getAreaRings(Number(areaId)),
  });

  const rings: Ring[] = ringsData?.results || [];

  // Filter rings based on search and status
  const filteredRings = rings.filter(ring => {
    const matchesSearch = ring.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ring.status === statusFilter;
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

  const getNetConditionBadge = (condition: string) => {
    const variants = {
      excellent: "bg-green-100 text-green-800",
      good: "bg-blue-100 text-blue-800",
      fair: "bg-yellow-100 text-yellow-800",
      poor: "bg-red-100 text-red-800"
    };
    return variants[condition as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => setLocation(`/infrastructure/areas/${areaId}`)} className="p-2">
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
          <Button variant="ghost" onClick={() => setLocation(`/infrastructure/areas/${areaId}`)} className="flex items-center">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Area Detail</span>
          </Button>
          <Waves className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Production Rings</h1>
            <p className="text-muted-foreground">
              {rings[0]?.areaName || `Area ${areaId}`} • Sea pen infrastructure
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setLocation(`/batch-management?area=${areaId}`)}>
            <Fish className="h-4 w-4 mr-2" />
            View Batches
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Manage Layout
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rings</CardTitle>
            <Waves className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredRings.length}</div>
            <p className="text-xs text-muted-foreground">Sea pen production units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biomass</CardTitle>
            <Fish className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredRings.reduce((sum, ring) => sum + ring.biomass, 0)}
            </div>
            <p className="text-xs text-muted-foreground">tons across rings</p>
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
            <CardTitle className="text-sm font-medium">Avg Capacity</CardTitle>
            <Gauge className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(filteredRings.reduce((sum, ring) => sum + (ring.biomass / ring.capacity), 0) / filteredRings.length * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">utilization rate</p>
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRings.map((ring) => (
          <Card key={ring.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{ring.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {ring.coordinates.lat.toFixed(4)}, {ring.coordinates.lng.toFixed(4)}
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
                  <span className="text-muted-foreground">Water Depth</span>
                  <div className="font-medium">{ring.waterDepth}m</div>
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
                <Badge variant="outline" className={ring.environmentalStatus === 'optimal' ? 'border-green-500 text-green-700' : 'border-yellow-500 text-yellow-700'}>
                  {ring.environmentalStatus}
                </Badge>
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

      {filteredRings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Waves className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No rings found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or status filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

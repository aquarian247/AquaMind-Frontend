import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Factory,
  Search,
  Filter,
  Eye,
  Settings,
  Fish,
  Thermometer,
  Droplet,
  MapPin,
  Calendar
} from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";

interface ContainerOverview {
  id: number;
  name: string;
  type: "Tray" | "Fry Tank" | "Parr Tank" | "Smolt Tank" | "Post-Smolt Tank" | "Ring";
  stage: "Egg&Alevin" | "Fry" | "Parr" | "Smolt" | "Post-Smolt" | "Sea";
  status: string;
  location: {
    geography: string;
    station: string;
    hall?: string;
    area?: string;
  };
  biomass: number;
  capacity: number;
  fishCount: number;
  temperature: number;
  oxygenLevel: number;
  lastMaintenance: string;
  utilizationPercent: number;
}

// Utility function for formatting large numbers with comma separators
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export default function InfrastructureContainers() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [geographyFilter, setGeographyFilter] = useState("all");
  const [stationFilter, setStationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch dynamic filter options
  const { data: filterOptions, isLoading: filtersLoading, error: filtersError } = useQuery({
    queryKey: ["infrastructure/containers/filter-options"],
    queryFn: () => {
      console.log('Fetching filter options...');
      return api.infrastructure.getContainerFilterOptions();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: containersData, isLoading: containersLoading } = useQuery({
    // Non-URL key signals client-computed aggregation to the endpoint validator
    queryKey: [
      "infrastructure/containers/overview",
      geographyFilter,
      stationFilter,
      typeFilter,
      statusFilter,
    ],
    queryFn: () =>
      api.infrastructure.getContainersOverview({
        geography: geographyFilter,
        station: stationFilter,
        type: typeFilter,
        status: statusFilter,
      }),
  });

  const isLoading = containersLoading || filtersLoading;

  // Fallback filter options in case dynamic loading fails
  const fallbackFilterOptions = {
    geographies: [],
    stations: [],
    containerTypes: [],
    statuses: ['active', 'inactive']
  };

  // Use dynamic options if available, otherwise fallback
  const currentFilterOptions = filterOptions || fallbackFilterOptions;

  // Debug logging
  console.log('Filter options status:', {
    hasData: !!filterOptions,
    isLoading: filtersLoading,
    hasError: !!filtersError,
    currentOptions: currentFilterOptions
  });

  // Cast result array to ContainerOverview[] to satisfy strict typing
  const containers = (containersData?.results as ContainerOverview[]) || [];

  // Further filter by search query
  const filteredContainers = containers.filter(container => 
    container.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    container.location.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
    container.location.hall?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    container.location.area?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      "Tray": "bg-purple-100 text-purple-800",
      "Fry Tank": "bg-blue-100 text-blue-800",
      "Parr Tank": "bg-cyan-100 text-cyan-800",
      "Smolt Tank": "bg-green-100 text-green-800",
      "Post-Smolt Tank": "bg-orange-100 text-orange-800",
      "Ring": "bg-indigo-100 text-indigo-800"
    };
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getStageIcon = (stage: string) => {
    const icons = {
      "Egg&Alevin": "🥚",
      "Fry": "🐟",
      "Parr": "🐠",
      "Smolt": "🐟",
      "Post-Smolt": "🐡",
      "Sea": "🌊"
    };
    return icons[stage as keyof typeof icons] || "🐟";
  };

  const getUtilizationColor = (percent: number) => {
    if (percent > 90) return "text-red-600";
    if (percent > 75) return "text-orange-600";
    if (percent > 50) return "text-blue-600";
    return "text-green-600";
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
            <Factory className="h-8 w-8 mr-3 text-blue-600" />
            All Containers
          </h1>
          <p className="text-muted-foreground">
            Production units across all facilities • {filteredContainers.length} containers
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Site & Container Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {filtersError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                Warning: Using fallback filter options. Dynamic options failed to load.
              </p>
            </div>
          )}
          <div className="space-y-4">
            {/* Search - Full width on mobile */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search containers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>

            {/* Filter dropdowns - responsive grid */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Geography</label>
                <Select value={geographyFilter} onValueChange={setGeographyFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {currentFilterOptions.geographies.map(geo => (
                      <SelectItem key={geo} value={geo}>{geo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Station/Area</label>
                <Select value={stationFilter} onValueChange={setStationFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Facilities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Facilities</SelectItem>
                    {currentFilterOptions.stations.map(station => {
                      // Map detailed station names to filter values
                      const isFreshwater = station.toLowerCase().includes('freshwater');
                      const filterValue = isFreshwater ? 'stations' : 'areas';
                      return (
                        <SelectItem key={station} value={filterValue}>
                          {station}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Container Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {currentFilterOptions.containerTypes.map(containerType => {
                      // Map full type names to filter values
                      const typeMap: { [key: string]: string } = {
                        "Egg & Alevin Trays (Tray)": "Tray",
                        "Fry Tanks (Tank)": "Fry Tank",
                        "Parr Tanks (Tank)": "Parr Tank",
                        "Smolt Tanks (Tank)": "Smolt Tank",
                        "Post-Smolt Tanks (Tank)": "Post-Smolt Tank",
                        "Sea Rings (Pen)": "Ring"
                      };
                      const filterValue = typeMap[containerType] || containerType;
                      const displayName = containerType
                        .replace(' (Tray)', '')
                        .replace(' (Tank)', '')
                        .replace(' (Pen)', '');
                      return (
                        <SelectItem key={containerType} value={filterValue}>
                          {displayName}
                        </SelectItem>
                      );
                    })}
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
                    {currentFilterOptions.statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
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
              {formatNumber(Math.round(filteredContainers.reduce((sum, c) => sum + c.biomass, 0)))} kg
            </div>
            <p className="text-xs text-muted-foreground">Current stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Containers</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredContainers.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <div className="h-4 w-4 bg-orange-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(filteredContainers.reduce((sum, c) => sum + c.utilizationPercent, 0) / filteredContainers.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Capacity usage</p>
          </CardContent>
        </Card>
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
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{container.location.geography}</span>
                    <span>•</span>
                    <span>{container.location.station}</span>
                    {container.location.hall && (
                      <>
                        <span>•</span>
                        <span>{container.location.hall}</span>
                      </>
                    )}
                    {container.location.area && (
                      <>
                        <span>•</span>
                        <span>{container.location.area}</span>
                      </>
                    )}
                  </div>
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
                  <div className="font-semibold text-lg">{formatNumber(Math.round(container.biomass))} kg</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Fish Count</span>
                  <div className="font-semibold text-lg">{formatNumber(container.fishCount)}</div>
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
                  <span className={getUtilizationColor(container.utilizationPercent)}>
                    {container.utilizationPercent}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min(container.utilizationPercent, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Maintained {new Date(container.lastMaintenance).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    if (container.type === "Ring") {
                      setLocation(`/infrastructure/rings/${container.id}`);
                    } else {
                      setLocation(`/infrastructure/containers/${container.id}`);
                    }
                  }}
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
              Try adjusting your filter criteria to find the containers you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

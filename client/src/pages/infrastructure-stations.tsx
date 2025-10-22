import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Map as MapIcon, 
  Factory, 
  Search,
  Filter,
  Eye,
  Settings,
  Activity,
  Calendar,
  ArrowLeft,
  MapPin,
  Droplets,
  Container
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { ApiService } from "@/api/generated";
import { useStationSummaries } from "@/features/infrastructure/api";
import { formatCount, formatWeight } from "@/lib/formatFallback";

interface Station {
  id: number;
  name: string;
  geography: string;
  type: string;
  halls: number;
  totalContainers: number;
  totalBiomass: number;
  coordinates: { lat: number; lng: number };
  status: string;
  waterSource: string;
  lastInspection: string;
}

// Simple SVG Map Component for Stations
function StationsMap({ stations, selectedStation, onStationSelect }: { 
  stations: Station[], 
  selectedStation?: Station,
  onStationSelect: (station: Station) => void 
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'; // green
      case 'maintenance': return '#f59e0b'; // amber
      case 'inactive': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getContainerSize = (containers: number) => {
    const normalized = Math.min(Math.max(containers / 15, 4), 14);
    return normalized;
  };

  const getWaterSourceIcon = (source: string) => {
    return source === 'river' ? '~' : '●';
  };

  return (
    <div className="relative bg-green-50 rounded-lg p-4 overflow-hidden">
      <svg viewBox="0 0 400 300" className="w-full h-64">
        {/* Land background */}
        <rect width="400" height="300" fill="#f0fdf4" />
        
        {/* Terrain illustration */}
        <path d="M0,150 Q100,120 200,140 T400,135 L400,0 L0,0 Z" fill="#065f46" opacity="0.1" />
        <path d="M0,180 Q150,160 300,170 T400,165 L400,0 L0,0 Z" fill="#065f46" opacity="0.05" />
        
        {/* Grid lines */}
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} opacity="0.1">
            <line x1={i * 100} y1="0" x2={i * 100} y2="300" stroke="#374151" strokeWidth="1" />
            <line x1="0" y1={i * 75} x2="400" y2={i * 75} stroke="#374151" strokeWidth="1" />
          </g>
        ))}
        
        {/* Rivers (simple lines) */}
        <path d="M50,50 Q150,80 250,70 T380,90" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M20,200 Q120,180 220,190 T350,180" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.3" />
        
        {/* Stations as squares/rectangles */}
        {stations.map((station) => {
          const x = ((station.coordinates.lng + 8) / 4) * 400; // Normalize longitude
          const y = ((65 - station.coordinates.lat) / 10) * 300; // Normalize latitude
          const size = getContainerSize(station.totalContainers);
          const isSelected = selectedStation?.id === station.id;
          
          return (
            <g key={station.id}>
              <rect
                x={x - size/2}
                y={y - size/2}
                width={size}
                height={size}
                fill={getStatusColor(station.status)}
                stroke={isSelected ? "#1f2937" : "rgba(255,255,255,0.3)"}
                strokeWidth={isSelected ? 3 : 1}
                className="cursor-pointer hover:stroke-gray-700 transition-all"
                onClick={() => onStationSelect(station)}
              />
              {/* Water source indicator */}
              <text
                x={x}
                y={y + 2}
                textAnchor="middle"
                className="text-xs font-bold fill-white pointer-events-none"
              >
                {getWaterSourceIcon(station.waterSource)}
              </text>
              {isSelected && (
                <text
                  x={x}
                  y={y - size/2 - 5}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-800"
                >
                  {station.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur rounded p-2 text-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">~</span>
            <span>River</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">●</span>
            <span>Well</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InfrastructureStations() {
  const [, setLocation] = useLocation();
  const [selectedGeography, setSelectedGeography] = useState<string>("all");
  const [selectedStation, setSelectedStation] = useState<Station>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch geographies for dynamic filter options
  const { data: geographiesData } = useQuery({
    queryKey: ["infrastructure/geographies"],
    queryFn: async () => ApiService.apiV1InfrastructureGeographiesList(),
  });

  const geographies = geographiesData?.results || [];

  // Parse geography from URL query parameter (like areas page does)
  const urlSelectedGeography = useMemo(() => {
    const queryString = window.location.search.substring(1);
    const urlParams = new URLSearchParams(queryString);
    const geo = urlParams.get('geography');
    return geo || 'all';
  }, []);

  // Fetch geographies to get ID from name
  const selectedGeographyId = useMemo(() => {
    if (urlSelectedGeography === "all" || !geographies.length) return undefined;
    
    const normalizedSelection = urlSelectedGeography.toLowerCase().replace(/-/g, ' ');
    const geo = geographies.find((g: any) => {
      const normalizedGeoName = g.name.toLowerCase();
      return normalizedGeoName === normalizedSelection;
    });
    
    return geo?.id;
  }, [urlSelectedGeography, geographies]);

  const { data: stationsData, isLoading } = useQuery({
    queryKey: ["stations", selectedGeographyId],
    queryFn: async () => {
      // ✅ Use server-side geography filtering
      const data = await ApiService.apiV1InfrastructureFreshwaterStationsList(
        undefined, // active
        selectedGeographyId, // geography filter
        undefined, // geographyIn
        undefined, // name
        undefined, // nameIcontains
        undefined, // ordering
        undefined, // page
        undefined, // search
        undefined  // stationType
      );
      
      const mapped = (data.results || []).map((raw: any): Station => ({
        id: raw.id,
        name: raw.name,
        geography: raw.geography_name ?? raw.geography ?? "Unknown",
        type: raw.station_type_display ?? raw.station_type ?? "FRESHWATER",
        halls: 0,
        totalContainers: 0,
        totalBiomass: 0,
        coordinates: {
          lat: raw.latitude ?? 0,
          lng: raw.longitude ?? 0,
        },
        status: raw.active ? "active" : "inactive",
        waterSource: (raw as any).water_source ?? "river",
        lastInspection: new Date().toISOString() as string,
      }));

      return { results: mapped };
    },
  });

  const stations: Station[] = stationsData?.results || [];

  // ✅ Use server-side aggregation for station summaries
  const stationIds = useMemo(() => stations.map(s => s.id), [stations]);
  const { data: stationSummaries, isLoading: isLoadingDetails } = useStationSummaries(stationIds);

  // Calculate aggregated totals across all stations using server-side summaries
  const stationDetailsData = useMemo(() => {
    if (!stationSummaries || stationSummaries.length === 0) {
      return { halls: 0, containers: 0, biomass: 0, hasData: false };
    }

    const totals = stationSummaries.reduce((acc, summary) => ({
      halls: acc.halls + (summary.hall_count || 0),
      containers: acc.containers + (summary.container_count || 0),
      biomass: acc.biomass + (summary.active_biomass_kg || 0),
    }), { halls: 0, containers: 0, biomass: 0 });

    return { ...totals, biomass: totals.biomass / 1000, hasData: true }; // Convert kg to tons
  }, [stationSummaries]);

  // Create lookup map for station summaries
  const stationSummaryMap = useMemo(() => {
    if (!stationSummaries || stationSummaries.length === 0) return new Map();
    // Map summaries back to station IDs by position (Promise.all maintains order)
    return new Map(stationIds.map((id, index) => [id, stationSummaries[index]]));
  }, [stationSummaries, stationIds]);

  // Filter stations based on search and status
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || station.status === statusFilter;
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

  const getWaterSourceBadge = (source: string) => {
    return source === 'river' 
      ? "bg-blue-100 text-blue-800" 
      : "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Factory className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold">Freshwater Stations</h1>
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
          <Button variant="ghost" onClick={() => setLocation("/infrastructure")} className="flex items-center">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Infrastructure</span>
          </Button>
          <Factory className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold">Freshwater Stations</h1>
            <p className="text-muted-foreground">
              Overview of freshwater stations and halls across geographies
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={selectedGeography} onValueChange={setSelectedGeography}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Geography" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Geographies</SelectItem>
              {geographies.map((geo: any) => (
                <SelectItem key={geo.id} value={geo.name.toLowerCase()}>
                  {geo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <Factory className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredStations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {selectedGeography === "all" ? "both geographies" : selectedGeography}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Halls</CardTitle>
            <Container className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoadingDetails ? 'Loading...' : (stationDetailsData?.hasData ? stationDetailsData.halls : 'N/A')}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoadingDetails ? 'Loading hall data...' : (stationDetailsData?.hasData ? 'Production halls' : 'No hall data available')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {isLoadingDetails ? 'Loading...' : (stationDetailsData?.hasData ? stationDetailsData.containers : 'N/A')}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoadingDetails ? 'Loading container data...' : (stationDetailsData?.hasData ? 'Tank containers' : 'No container data available')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biomass</CardTitle>
            <Droplets className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {isLoadingDetails ? 'Loading...' : (stationDetailsData?.hasData && stationDetailsData.biomass ? stationDetailsData.biomass.toFixed(1) + 'k' : 'N/A')}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoadingDetails ? 'Loading biomass data...' : (stationDetailsData?.hasData && stationDetailsData.biomass ? 'Tons across stations' : 'No biomass data available')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Map View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapIcon className="h-5 w-5" />
            <span>Geographic Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StationsMap 
            stations={filteredStations} 
            selectedStation={selectedStation}
            onStationSelect={setSelectedStation}
          />
          {selectedStation && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-lg">{selectedStation.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Halls:</span>
                  <div className="font-medium">
                    {isLoadingDetails ? '...' : formatCount(stationSummaryMap.get(selectedStation.id)?.hall_count)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Containers:</span>
                  <div className="font-medium">
                    {isLoadingDetails ? '...' : formatCount(stationSummaryMap.get(selectedStation.id)?.container_count)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Biomass:</span>
                  <div className="font-medium">
                    {isLoadingDetails ? '...' : formatWeight(stationSummaryMap.get(selectedStation.id)?.active_biomass_kg)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Water Source:</span>
                  <Badge className={`ml-1 ${getWaterSourceBadge(selectedStation.waterSource)}`}>
                    {selectedStation.waterSource}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stations..."
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

      {/* Stations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStations.map((station) => (
          <Card key={station.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{station.geography}</p>
                </div>
                <div className="space-y-1">
                  <Badge className={getStatusBadge(station.status)}>
                    {station.status}
                  </Badge>
                  <Badge className={getWaterSourceBadge(station.waterSource)}>
                    {station.waterSource}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Halls</span>
                  <div className="font-semibold text-lg">
                    {isLoadingDetails ? '...' : formatCount(stationSummaryMap.get(station.id)?.hall_count)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Containers</span>
                  <div className="font-semibold text-lg">
                    {isLoadingDetails ? '...' : formatCount(stationSummaryMap.get(station.id)?.container_count)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Biomass</span>
                  <div className="font-medium">
                    {isLoadingDetails ? '...' : formatWeight(stationSummaryMap.get(station.id)?.active_biomass_kg)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Inspection</span>
                  <div className="font-medium">{new Date(station.lastInspection).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setLocation(`/infrastructure/stations/${station.id}`)}
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

      {filteredStations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Factory className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No stations found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or geography filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

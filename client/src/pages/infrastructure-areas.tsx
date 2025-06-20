import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Map, 
  Waves, 
  Search,
  Filter,
  Eye,
  Settings,
  Activity,
  Calendar,
  ArrowLeft,
  MapPin,
  Gauge
} from "lucide-react";
import { useLocation, Link } from "wouter";

interface Area {
  id: number;
  name: string;
  geography: string;
  type: string;
  rings: number;
  totalBiomass: number;
  coordinates: { lat: number; lng: number };
  status: string;
  waterDepth: number;
  lastInspection: string;
}

// Simple SVG Map Component for Areas
function AreasMap({ areas, selectedArea, onAreaSelect }: { 
  areas: Area[], 
  selectedArea?: Area,
  onAreaSelect: (area: Area) => void 
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'; // green
      case 'maintenance': return '#f59e0b'; // amber
      case 'inactive': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getBiomassSize = (biomass: number) => {
    const normalized = Math.min(Math.max(biomass / 500, 3), 12);
    return normalized;
  };

  return (
    <div className="relative bg-blue-50 rounded-lg p-4 overflow-hidden">
      <svg viewBox="0 0 400 300" className="w-full h-64">
        {/* Water background */}
        <rect width="400" height="300" fill="#dbeafe" />
        
        {/* Coastline illustration */}
        <path d="M0,200 Q100,180 200,190 T400,185 L400,300 L0,300 Z" fill="#065f46" opacity="0.1" />
        <path d="M0,220 Q150,200 300,210 T400,205 L400,300 L0,300 Z" fill="#065f46" opacity="0.05" />
        
        {/* Grid lines */}
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} opacity="0.1">
            <line x1={i * 100} y1="0" x2={i * 100} y2="300" stroke="#374151" strokeWidth="1" />
            <line x1="0" y1={i * 75} x2="400" y2={i * 75} stroke="#374151" strokeWidth="1" />
          </g>
        ))}
        
        {/* Areas as dots */}
        {areas.map((area) => {
          const x = ((area.coordinates.lng + 8) / 4) * 400; // Normalize longitude
          const y = ((65 - area.coordinates.lat) / 10) * 300; // Normalize latitude
          const size = getBiomassSize(area.totalBiomass);
          const isSelected = selectedArea?.id === area.id;
          
          return (
            <g key={area.id}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={getStatusColor(area.status)}
                stroke={isSelected ? "#1f2937" : "rgba(255,255,255,0.3)"}
                strokeWidth={isSelected ? 3 : 1}
                className="cursor-pointer hover:stroke-gray-700 transition-all"
                onClick={() => onAreaSelect(area)}
              />
              {isSelected && (
                <text
                  x={x}
                  y={y - size - 5}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-800"
                >
                  {area.name}
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
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InfrastructureAreas() {
  const [, setLocation] = useLocation();
  const [selectedGeography, setSelectedGeography] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<Area>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: areasData, isLoading } = useQuery({
    queryKey: ["/api/v1/infrastructure/areas/", selectedGeography],
    queryFn: async () => {
      const url = selectedGeography === "all" 
        ? "/api/v1/infrastructure/areas/"
        : `/api/v1/infrastructure/areas/?geography=${selectedGeography}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch areas");
      return response.json();
    },
  });

  const areas: Area[] = areasData?.results || [];

  // Filter areas based on search and status
  const filteredAreas = areas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || area.status === statusFilter;
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Map className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Sea Areas</h1>
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Infrastructure
          </Button>
          <Waves className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Sea Areas</h1>
            <p className="text-muted-foreground">
              Overview of sea pen areas across geographies
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
              <SelectItem value="faroe">Faroe Islands</SelectItem>
              <SelectItem value="scotland">Scotland</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Areas</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredAreas.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {selectedGeography === "all" ? "both geographies" : selectedGeography}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rings</CardTitle>
            <Waves className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredAreas.reduce((sum, area) => sum + area.rings, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sea pen rings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Areas</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredAreas.filter(area => area.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biomass</CardTitle>
            <Gauge className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(filteredAreas.reduce((sum, area) => sum + area.totalBiomass, 0) / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-muted-foreground">
              Tons across areas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Map View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Map className="h-5 w-5" />
            <span>Geographic Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AreasMap 
            areas={filteredAreas} 
            selectedArea={selectedArea}
            onAreaSelect={setSelectedArea}
          />
          {selectedArea && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg">{selectedArea.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Rings:</span>
                  <div className="font-medium">{selectedArea.rings}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Biomass:</span>
                  <div className="font-medium">{selectedArea.totalBiomass} tons</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Water Depth:</span>
                  <div className="font-medium">{selectedArea.waterDepth}m</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={`ml-1 ${getStatusBadge(selectedArea.status)}`}>
                    {selectedArea.status}
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
            placeholder="Search areas..."
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

      {/* Areas Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAreas.map((area) => (
          <Card key={area.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{area.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{area.geography}</p>
                </div>
                <Badge className={getStatusBadge(area.status)}>
                  {area.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Rings</span>
                  <div className="font-semibold text-lg">{area.rings}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Biomass</span>
                  <div className="font-semibold text-lg">{area.totalBiomass} tons</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Water Depth</span>
                  <div className="font-medium">{area.waterDepth}m</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Inspection</span>
                  <div className="font-medium">{new Date(area.lastInspection).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setLocation(`/infrastructure/areas/${area.id}`)}
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

      {filteredAreas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Map className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No areas found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or geography filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
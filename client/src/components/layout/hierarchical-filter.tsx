import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Building, 
  Package, 
  Fish, 
  Search,
  Filter,
  X
} from "lucide-react";

interface Region {
  id: string;
  name: string;
  country: string;
  sites: FarmSite[];
}

interface FarmSite {
  id: string;
  name: string;
  type: 'freshwater' | 'seawater';
  location: string;
  capacity: number;
  activeUnits: number;
  totalUnits: number;
}

interface FilterState {
  region?: string;
  siteType?: 'freshwater' | 'seawater';
  site?: string;
  searchTerm?: string;
  batchStatus?: string;
}

const SAMPLE_REGIONS: Region[] = [
  {
    id: "faroe",
    name: "Faroe Islands",
    country: "FO",
    sites: [
      { id: "fa-001", name: "Tórshavn Atlantic Site A", type: "seawater", location: "Tórshavn", capacity: 25000, activeUnits: 18, totalUnits: 20 },
      { id: "fa-002", name: "Klaksvík Deep Water", type: "seawater", location: "Klaksvík", capacity: 30000, activeUnits: 22, totalUnits: 25 },
      { id: "fa-003", name: "Suðuroy Freshwater", type: "freshwater", location: "Suðuroy", capacity: 15000, activeUnits: 12, totalUnits: 15 }
    ]
  },
  {
    id: "scotland",
    name: "Scotland",
    country: "GB",
    sites: [
      { id: "sc-001", name: "Shetland North", type: "seawater", location: "Shetland", capacity: 35000, activeUnits: 20, totalUnits: 25 },
      { id: "sc-002", name: "Orkney West", type: "seawater", location: "Orkney", capacity: 28000, activeUnits: 16, totalUnits: 20 },
      { id: "sc-003", name: "Highland Freshwater", type: "freshwater", location: "Highland", capacity: 18000, activeUnits: 14, totalUnits: 18 }
    ]
  }
];

interface HierarchicalFilterProps {
  onFilterChange: (filters: FilterState) => void;
  showBatches?: boolean;
}

export default function HierarchicalFilter({ onFilterChange, showBatches = false }: HierarchicalFilterProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const updateFilter = (key: keyof FilterState, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset dependent filters when parent changes
    if (key === 'region') {
      delete newFilters.site;
      setSelectedRegion(SAMPLE_REGIONS.find(r => r.id === value) || null);
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSelectedRegion(null);
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Site & Batch Filters</span>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Region & Site Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select value={filters.region || ""} onValueChange={(v) => updateFilter('region', v || undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Regions</SelectItem>
                  {SAMPLE_REGIONS.map(region => (
                    <SelectItem key={region.id} value={region.id}>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{region.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Site Type</label>
              <Select value={filters.siteType || ""} onValueChange={(v) => updateFilter('siteType', v || undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="seawater">
                    <div className="flex items-center space-x-2">
                      <Fish className="h-4 w-4" />
                      <span>Seawater</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="freshwater">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>Freshwater</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Specific Site</label>
              <Select 
                value={filters.site || ""} 
                onValueChange={(v) => updateFilter('site', v || undefined)}
                disabled={!selectedRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedRegion ? "Select Site" : "Choose Region First"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sites</SelectItem>
                  {(selectedRegion?.sites || [])
                    .filter(site => !filters.siteType || site.type === filters.siteType)
                    .map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{site.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {site.activeUnits}/{site.totalUnits}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search batches, containers..."
                  className="pl-9"
                  value={filters.searchTerm || ""}
                  onChange={(e) => updateFilter('searchTerm', e.target.value || undefined)}
                />
              </div>
            </div>
          </div>

          {/* Batch-specific filters */}
          {showBatches && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Batch Status</label>
                <Select value={filters.batchStatus || ""} onValueChange={(v) => updateFilter('batchStatus', v || undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="harvesting">Harvesting</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <span className="text-sm font-medium">Active filters:</span>
              {filters.region && (
                <Badge variant="secondary">
                  Region: {SAMPLE_REGIONS.find(r => r.id === filters.region)?.name}
                </Badge>
              )}
              {filters.siteType && (
                <Badge variant="secondary">
                  Type: {filters.siteType}
                </Badge>
              )}
              {filters.site && (
                <Badge variant="secondary">
                  Site: {selectedRegion?.sites.find(s => s.id === filters.site)?.name}
                </Badge>
              )}
              {filters.searchTerm && (
                <Badge variant="secondary">
                  Search: {filters.searchTerm}
                </Badge>
              )}
              {filters.batchStatus && (
                <Badge variant="secondary">
                  Status: {filters.batchStatus}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Statistics Overview Component
export function OperationsOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Total Sites</p>
              <p className="text-2xl font-bold">50</p>
              <p className="text-xs text-gray-600">25 Faroe + 25 Scotland</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Active Pens/Tanks</p>
              <p className="text-2xl font-bold">1,180</p>
              <p className="text-xs text-gray-600">~900 pens + 280 tanks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Fish className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium">Active Batches</p>
              <p className="text-2xl font-bold">98</p>
              <p className="text-xs text-gray-600">Various life stages</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium">Capacity Utilization</p>
              <p className="text-2xl font-bold">87%</p>
              <p className="text-xs text-gray-600">Across all facilities</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
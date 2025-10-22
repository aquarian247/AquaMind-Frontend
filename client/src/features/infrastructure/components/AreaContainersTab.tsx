/**
 * Area Containers Tab Component
 * 
 * Displays containers/rings grid with filtering and search.
 * 
 * @module features/infrastructure/components/AreaContainersTab
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Waves,
  Fish,
  Activity,
  Settings,
  Calendar,
  Eye,
  Search,
  Gauge,
} from "lucide-react";
import { useLocation } from "wouter";
import type { Ring } from "../hooks/useAreaData";
import type { FormattedAreaKPIs } from "../utils/areaFormatters";
import { formatCount, formatWeight } from "@/lib/formatFallback";
import { countActiveRings, calculateAverageRingDepth } from "../utils/areaFormatters";
import type { AreaSummaryData } from "../api";

interface AreaContainersTabProps {
  rings: Ring[];
  filteredRings: Ring[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoadingRings: boolean;
  areaSummary: AreaSummaryData | undefined;
  isAreaSummaryLoading: boolean;
  formattedKPIs: FormattedAreaKPIs;
}

/**
 * Get CSS class for status badge
 */
function getStatusBadge(status: string): string {
  const variants = {
    operational: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    restricted: "bg-red-100 text-red-800",
  };
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
}

/**
 * Get CSS class for net condition badge
 */
function getNetConditionBadge(condition: string): string {
  const variants = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    fair: "bg-yellow-100 text-yellow-800",
    poor: "bg-red-100 text-red-800",
  };
  return variants[condition as keyof typeof variants] || "bg-gray-100 text-gray-800";
}

/**
 * Containers/Rings tab with filtering and grid view
 * 
 * Shows ring statistics, filtering controls, and detailed ring cards.
 */
export function AreaContainersTab({
  rings,
  filteredRings,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  isLoadingRings,
  areaSummary,
  isAreaSummaryLoading,
  formattedKPIs,
}: AreaContainersTabProps) {
  const [, setLocation] = useLocation();

  const activeRingsCount = countActiveRings(filteredRings);
  const avgDepth = calculateAverageRingDepth(filteredRings);

  return (
    <div className="space-y-4">
      {/* Summary Stats for Rings */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rings</CardTitle>
            <Waves className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isAreaSummaryLoading
                ? "..."
                : areaSummary
                ? formattedKPIs.ringCount
                : formatCount(filteredRings.length, "rings")}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAreaSummaryLoading
                ? "Loading..."
                : areaSummary?.ring_count
                ? "Production units (from server)"
                : "Production units (from containers)"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ring Biomass</CardTitle>
            <Fish className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isAreaSummaryLoading
                ? "..."
                : areaSummary
                ? formattedKPIs.totalBiomass
                : "No data available"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAreaSummaryLoading
                ? "Loading..."
                : areaSummary?.active_biomass_kg
                ? "Current stock (from server)"
                : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rings</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {activeRingsCount}
            </div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Depth</CardTitle>
            <Gauge className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{avgDepth}</div>
            <p className="text-xs text-muted-foreground">Water depth</p>
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
      {isLoadingRings ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredRings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRings.map((ring) => (
            <Card key={ring.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <span className="mr-2">🌊</span>
                      {ring.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Sea Ring • Depth: {ring.waterDepth}m
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Badge className={getStatusBadge(ring.status)}>{ring.status}</Badge>
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
                    <div className="font-semibold text-lg">
                      {ring.biomass > 0
                        ? `${(ring.biomass * 1000).toLocaleString()} kg`
                        : "0 kg"}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fish Count</span>
                    <div className="font-semibold text-lg">
                      {ring.fishCount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Weight</span>
                    <div className="font-medium">
                      {ring.averageWeight > 0 ? ring.averageWeight.toFixed(2) : "0.00"}{" "}
                      kg
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Environment</span>
                    <Badge
                      variant="outline"
                      className={
                        ring.environmentalStatus === "optimal"
                          ? "border-green-500 text-green-700"
                          : "border-yellow-500 text-yellow-700"
                      }
                    >
                      {ring.environmentalStatus}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Capacity Utilization</span>
                    <span>
                      {ring.capacity > 0
                        ? Math.round((ring.biomass / ring.capacity) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          ring.capacity > 0
                            ? Math.min((ring.biomass / ring.capacity) * 100, 100)
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Inspected {new Date(ring.lastInspection).toLocaleDateString()}
                  </span>
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
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Waves className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No rings found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


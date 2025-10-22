/**
 * Area Header Component
 * 
 * Displays area title, navigation, status, and KPI cards.
 * Uses server-side aggregated data via formatted KPIs.
 * 
 * @module features/infrastructure/components/AreaHeader
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Waves, Fish, Scale, Users } from "lucide-react";
import { useLocation } from "wouter";
import type { AreaDetail } from "../hooks/useAreaData";
import type { FormattedAreaKPIs } from "../utils/areaFormatters";
import { calculateAreaUtilization } from "../utils/areaFormatters";
import type { AreaSummaryData } from "../api";

interface AreaHeaderProps {
  area: AreaDetail;
  formattedKPIs: FormattedAreaKPIs;
  areaSummary: AreaSummaryData | undefined;
  isAreaSummaryLoading: boolean;
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
 * Area header with navigation and KPI cards
 * 
 * Displays area metadata, navigation back to areas list, and key performance
 * indicators using server-side aggregated data.
 */
export function AreaHeader({
  area,
  formattedKPIs,
  areaSummary,
  isAreaSummaryLoading,
}: AreaHeaderProps) {
  const [, setLocation] = useLocation();

  // Calculate utilization percentage for progress bar
  const utilizationPercent = calculateAreaUtilization(areaSummary, area.capacity);

  return (
    <>
      {/* Title and Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/infrastructure/areas")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Areas
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Waves className="h-8 w-8 mr-3 text-blue-600" />
              {area.name}
            </h1>
            <p className="text-muted-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {area.geography} • {area.type} • {area.rings} rings
            </p>
          </div>
        </div>
        <Badge className={getStatusBadge(area.status)}>{area.status}</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Biomass */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biomass</CardTitle>
            <Fish className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isAreaSummaryLoading ? "..." : formattedKPIs.totalBiomass}
            </div>
            <p className="text-xs text-muted-foreground">
              {formattedKPIs.totalBiomassTooltip}
            </p>
            <div className="mt-2">
              <Progress value={utilizationPercent} />
            </div>
          </CardContent>
        </Card>

        {/* Average Weight */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
            <Scale className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isAreaSummaryLoading ? "..." : formattedKPIs.averageWeight}
            </div>
            <p className="text-xs text-muted-foreground">
              {formattedKPIs.averageWeightTooltip}
            </p>
            <div className="mt-2">
              <Progress
                value={
                  areaSummary?.avg_weight_kg
                    ? Math.min((areaSummary.avg_weight_kg / 6) * 100, 100)
                    : 0
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Container Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Container Count</CardTitle>
            <Waves className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {isAreaSummaryLoading ? "..." : formattedKPIs.containerCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {formattedKPIs.containerCountTooltip}
            </p>
            <div className="mt-2">
              <Progress
                value={
                  areaSummary?.container_count
                    ? Math.min((areaSummary.container_count / 50) * 100, 100)
                    : 0
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Population Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Population Count</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {isAreaSummaryLoading ? "..." : formattedKPIs.populationCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {formattedKPIs.populationCountTooltip}
            </p>
            <div className="mt-2">
              <Progress
                value={
                  areaSummary?.population_count
                    ? Math.min((areaSummary.population_count / 10000) * 100, 100)
                    : 0
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


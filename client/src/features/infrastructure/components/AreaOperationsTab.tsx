/**
 * Area Operations Tab Component
 * 
 * Displays operational metrics and performance data.
 * 
 * @module features/infrastructure/components/AreaOperationsTab
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fish, Activity } from "lucide-react";
import type { AreaDetail } from "../hooks/useAreaData";
import type { AreaSummary } from "../api";
import { formatCount } from "@/lib/formatFallback";
import { calculateAreaUtilization } from "../utils/areaFormatters";

interface AreaOperationsTabProps {
  area: AreaDetail;
  areaSummary: AreaSummary | undefined;
}

/**
 * Operations tab showing stock management and performance metrics
 */
export function AreaOperationsTab({ area, areaSummary }: AreaOperationsTabProps) {
  const utilization = calculateAreaUtilization(areaSummary, area.capacity);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Fish className="h-5 w-5" />
            <span>Stock Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Stock:</span>
                <div className="font-medium">
                  {areaSummary
                    ? formatCount(areaSummary.population_count, "fish")
                    : "No data available"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Capacity:</span>
                <div className="font-medium">
                  {area.capacity
                    ? area.capacity.toLocaleString() + " tonnes"
                    : "No data available"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Utilization:</span>
                <div className="font-medium">
                  {areaSummary?.active_biomass_kg && area.capacity
                    ? utilization + "%"
                    : "No data available"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Generation:</span>
                <div className="font-medium">No data available</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Growth Rate:</span>
                <div className="font-medium">No data available</div>
              </div>
              <div>
                <span className="text-muted-foreground">Feed Efficiency:</span>
                <div className="font-medium">No data available</div>
              </div>
              <div>
                <span className="text-muted-foreground">Health Score:</span>
                <div className="font-medium">No data available</div>
              </div>
              <div>
                <span className="text-muted-foreground">Harvest Est.:</span>
                <div className="font-medium">No data available</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


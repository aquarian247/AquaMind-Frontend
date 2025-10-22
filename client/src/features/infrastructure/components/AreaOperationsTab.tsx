/**
 * Area Operations Tab Component
 * 
 * Displays operational metrics and performance data.
 * 
 * @module features/infrastructure/components/AreaOperationsTab
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fish, Activity } from "lucide-react";
import type { Ring } from "../hooks/useAreaData";
import type { AreaSummaryData } from "../api";
import { formatCount } from "@/lib/formatFallback";

interface AreaOperationsTabProps {
  rings: Ring[];
  areaSummary: AreaSummaryData | undefined;
}

/**
 * Operations tab showing stock management and performance metrics
 */
export function AreaOperationsTab({ rings, areaSummary }: AreaOperationsTabProps) {
  // Calculate total capacity from rings (already in tonnes)
  const totalCapacityTonnes = rings.reduce((sum, ring) => sum + ring.capacity, 0);
  
  // Calculate utilization percentage
  const biomassTonnes = areaSummary?.active_biomass_kg ? areaSummary.active_biomass_kg / 1000 : 0;
  const utilization = totalCapacityTonnes > 0 
    ? Math.round((biomassTonnes / totalCapacityTonnes) * 100)
    : 0;

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
                  {totalCapacityTonnes > 0
                    ? totalCapacityTonnes.toLocaleString() + " tonnes"
                    : "No data available"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Utilization:</span>
                <div className="font-medium">
                  {areaSummary?.active_biomass_kg && totalCapacityTonnes > 0
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


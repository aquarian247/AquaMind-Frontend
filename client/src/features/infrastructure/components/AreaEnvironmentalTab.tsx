/**
 * Area Environmental Tab Component
 * 
 * Displays environmental monitoring data for an area.
 * 
 * @module features/infrastructure/components/AreaEnvironmentalTab
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Droplets, Waves, Wind, Gauge } from "lucide-react";
import type { AreaDetail, EnvironmentalData } from "../hooks/useAreaData";

interface AreaEnvironmentalTabProps {
  area: AreaDetail;
  environmental: EnvironmentalData | undefined;
}

/**
 * Environmental monitoring tab
 * 
 * Shows water quality parameters, monitoring status, and historical data access.
 */
export function AreaEnvironmentalTab({
  area,
  environmental,
}: AreaEnvironmentalTabProps) {
  return (
    <div className="space-y-4">
      {/* Environmental Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {environmental?.hasData
                ? `${environmental.waterTemperature}°C`
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {environmental?.hasData
                ? "Optimal range: 8-16°C"
                : "No environmental data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oxygen Level</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {environmental?.hasData ? environmental.oxygenLevel : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {environmental?.hasData ? "mg/L" : "No environmental data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salinity</CardTitle>
            <Waves className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {environmental?.hasData ? environmental.salinity : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {environmental?.hasData ? "ppt" : "No environmental data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Speed</CardTitle>
            <Wind className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {environmental?.hasData ? environmental.currentSpeed : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {environmental?.hasData ? "m/s" : "No environmental data available"}
            </p>
            {environmental?.hasData && environmental.currentSpeed && (
              <div className="mt-2">
                <Progress value={(environmental.currentSpeed / 1) * 100} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="h-5 w-5" />
            <span>Environmental Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Water Depth:</span>
                <div className="font-medium">{area.waterDepth}m</div>
              </div>
              <div>
                <span className="text-muted-foreground">Coordinates:</span>
                <div className="font-medium">
                  {typeof area.coordinates.lat === "number" &&
                  !isNaN(area.coordinates.lat)
                    ? area.coordinates.lat.toFixed(4)
                    : "N/A"}
                  ,{" "}
                  {typeof area.coordinates.lng === "number" &&
                  !isNaN(area.coordinates.lng)
                    ? area.coordinates.lng.toFixed(4)
                    : "N/A"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Last Reading:</span>
                <div className="font-medium">{new Date().toLocaleTimeString()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Next Check:</span>
                <div className="font-medium">In 2 hours</div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                View Historical Data
              </Button>
              <Button variant="outline" size="sm">
                Set Alerts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


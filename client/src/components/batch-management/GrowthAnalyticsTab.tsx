import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface GrowthMetrics {
  date: string;
  averageWeight: number;
  totalBiomass: number;
  populationCount: number;
  growthRate: number;
  condition: number;
}

interface GrowthAnalyticsTabProps {
  growthMetrics: GrowthMetrics[];
  latestGrowthData: GrowthMetrics | null;
  growthTrend: number;
}

export function GrowthAnalyticsTab({
  growthMetrics,
  latestGrowthData,
  growthTrend
}: GrowthAnalyticsTabProps) {
  if (growthMetrics.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No growth data available for this batch.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Growth Rate Analysis</CardTitle>
          <CardDescription>Weekly growth rate progression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Growth Rate</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">{latestGrowthData?.growthRate?.toFixed(2) || '0.00'}%</span>
                {growthTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : growthTrend < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Activity className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Weekly Growth Progression</span>
              {growthMetrics.slice(-4).map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{metric.date ? format(new Date(metric.date), "MMM dd") : "Unknown"}</span>
                  <span className={cn("font-semibold",
                    metric.growthRate > 15 ? "text-green-600" :
                    metric.growthRate > 10 ? "text-blue-600" : "text-orange-600"
                  )}>
                    {metric.growthRate.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condition Factor</CardTitle>
          <CardDescription>Fish body condition and health indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Condition</span>
              <span className="font-bold">{latestGrowthData?.condition?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Condition Trend</span>
              {growthMetrics.slice(-4).map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{metric.date ? format(new Date(metric.date), "MMM dd") : "Unknown"}</span>
                  <span className={cn("font-semibold",
                    metric.condition > 1.0 ? "text-green-600" :
                    metric.condition > 0.8 ? "text-blue-600" : "text-red-600"
                  )}>
                    {metric.condition.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

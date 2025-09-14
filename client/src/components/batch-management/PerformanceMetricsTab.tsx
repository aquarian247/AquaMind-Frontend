import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface PerformanceMetrics {
  survivalRate: number;
  growthRate: number;
  feedConversionRatio: number;
  healthScore: number;
  efficiency: number;
  productivity: number;
}

interface GrowthMetrics {
  date: string;
  averageWeight: number;
  totalBiomass: number;
  populationCount: number;
  growthRate: number;
  condition: number;
}

interface PerformanceMetricsTabProps {
  performanceMetrics: PerformanceMetrics | null;
  growthMetrics: GrowthMetrics[];
}

export function PerformanceMetricsTab({
  performanceMetrics,
  growthMetrics
}: PerformanceMetricsTabProps) {
  if (!performanceMetrics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Performance metrics require growth samples and feeding data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
          <CardDescription>Detailed performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Survival Rate</span>
              <span className="font-bold">{performanceMetrics.survivalRate?.toFixed(1) || '0.0'}%</span>
            </div>
            <Progress value={performanceMetrics.survivalRate || 0} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Growth Efficiency</span>
              <span className="font-bold">{performanceMetrics.efficiency?.toFixed(1) || '0.0'}%</span>
            </div>
            <Progress value={performanceMetrics.efficiency || 0} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Productivity</span>
              <span className="font-bold">{performanceMetrics.productivity?.toFixed(1) || '0.0'}%</span>
            </div>
            <Progress value={performanceMetrics.productivity || 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Growth Trends</CardTitle>
          <CardDescription>Recent growth pattern analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {growthMetrics.slice(-5).map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-sm font-medium">{metric.date ? format(new Date(metric.date), "MMM dd") : "Unknown"}</span>
                  <div className="text-xs text-muted-foreground">
                    {metric.populationCount.toLocaleString()} fish
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-bold">{metric.averageWeight.toFixed(2)}g</span>
                  <div className="text-xs text-muted-foreground">
                    {metric.totalBiomass.toFixed(2)}kg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

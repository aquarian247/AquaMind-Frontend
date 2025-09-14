import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, TrendingUp, Scale, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceOverviewCardsProps {
  survivalRate: number;
  growthRate: number;
  feedConversionRatio: number;
  healthScore: number;
}

export function PerformanceOverviewCards({
  survivalRate,
  growthRate,
  feedConversionRatio,
  healthScore
}: PerformanceOverviewCardsProps) {
  const getPerformanceColor = (value: number, threshold: { good: number; fair: number }) => {
    if (value >= threshold.good) return "text-green-600";
    if (value >= threshold.fair) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Survival Rate</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", getPerformanceColor(survivalRate || 0, { good: 90, fair: 85 }))}>
            {survivalRate?.toFixed(1) || '0.0'}%
          </div>
          <p className="text-xs text-muted-foreground">
            Population retention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", getPerformanceColor(growthRate || 0, { good: 15, fair: 10 }))}>
            {growthRate?.toFixed(1) || '0.0'}%
          </div>
          <p className="text-xs text-muted-foreground">
            Weekly growth rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Feed Conversion</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", getPerformanceColor(2.0 - (feedConversionRatio || 0), { good: 0.8, fair: 0.5 }))}>
            {feedConversionRatio?.toFixed(2) || '0.00'}
          </div>
          <p className="text-xs text-muted-foreground">
            FCR ratio
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Health Score</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", getPerformanceColor(healthScore || 0, { good: 85, fair: 75 }))}>
            {healthScore?.toFixed(0) || '0'}/100
          </div>
          <p className="text-xs text-muted-foreground">
            Overall health
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

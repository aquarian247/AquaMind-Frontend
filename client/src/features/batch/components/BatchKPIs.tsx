import { Card, CardContent } from "@/components/ui/card";
import { Fish, Users, Heart, AlertTriangle } from "lucide-react";

interface BatchKPIs {
  totalActiveBatches: number;
  averageHealthScore: number;
  totalFishCount: number;
  averageSurvivalRate: number;
  batchesRequiringAttention: number;
  avgGrowthRate: number;
  totalBiomass: number;
  averageFCR: number;
}

interface BatchKPIsProps {
  kpis: BatchKPIs;
  isLoading: boolean;
}

export function BatchKPIs({ kpis, isLoading }: BatchKPIsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Batches</p>
              <p className="text-2xl font-bold">{kpis.totalActiveBatches}</p>
              <p className="text-xs text-muted-foreground mt-1">Currently in production</p>
            </div>
            <Fish className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Fish Count</p>
              <p className="text-2xl font-bold">{kpis.totalFishCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Across all batches</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Survival Rate</p>
              <p className="text-2xl font-bold">{kpis.averageSurvivalRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Overall health indicator</p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
              <p className="text-2xl font-bold">{kpis.batchesRequiringAttention}</p>
              <p className="text-xs text-muted-foreground mt-1">Batches requiring review</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

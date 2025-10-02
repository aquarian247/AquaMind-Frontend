import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, TrendingUp, Target, AlertCircle } from "lucide-react";
import { formatCount, formatFallback, formatPercentage } from "@/lib/formatFallback";

interface KPIData {
  activeBroodstockPairs: number;
  broodstockPopulation: number;
  totalProgenyCount: number;
  geneticDiversityIndex: number | null; // null = data unavailable
  pendingSelections: number | null; // null = data unavailable
  averageGeneticGain: number | null; // null = data unavailable
}

interface BroodstockKPIsProps {
  kpis: KPIData;
  isLoading: boolean;
}

export function BroodstockKPIs({ kpis, isLoading }: BroodstockKPIsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
      <Card>
        <CardContent className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Pairs
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCount(kpis?.activeBroodstockPairs)}
              </p>
            </div>
            <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                Population
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCount(kpis?.broodstockPopulation)}
              </p>
            </div>
            <Activity className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                Progeny (7d)
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCount(kpis?.totalProgenyCount)}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                Diversity Index
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatFallback(kpis?.geneticDiversityIndex, undefined, { precision: 2 })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {kpis?.geneticDiversityIndex !== null && kpis?.geneticDiversityIndex !== undefined
                  ? "Shannon index"
                  : "Not calculated"}
              </p>
            </div>
            <Target className="w-6 h-6 lg:w-8 lg:h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCount(kpis?.pendingSelections)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {kpis?.pendingSelections !== null && kpis?.pendingSelections !== undefined
                  ? "Selections"
                  : "No data"}
              </p>
            </div>
            <AlertCircle className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                Genetic Gain
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {kpis?.averageGeneticGain !== null && kpis?.averageGeneticGain !== undefined
                  ? formatPercentage(kpis.averageGeneticGain)
                  : formatFallback(null)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {kpis?.averageGeneticGain !== null && kpis?.averageGeneticGain !== undefined
                  ? "vs baseline"
                  : "Not calculated"}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-teal-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, BarChart3, TrendingUp } from "lucide-react";

interface GeneticTraitData {
  traitPerformance: {
    labels: string[];
    currentGeneration: number[];
    targetProfile: number[];
  };
  snpAnalysis?: {
    totalSnps?: number;
    analyzedTraits?: number;
  };
}

interface BroodstockGeneticProps {
  traitData: GeneticTraitData | null;
  isLoading: boolean;
}

export function BroodstockGenetic({ traitData, isLoading }: BroodstockGeneticProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total SNPs
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {traitData?.snpAnalysis?.totalSnps?.toLocaleString() || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Analyzed Traits
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {traitData?.snpAnalysis?.analyzedTraits || 0}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Genome Coverage
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  94.2%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Genetic Analysis Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breeding Values */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estimated Breeding Values</CardTitle>
            <CardDescription>
              Current generation breeding value distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {traitData?.traitPerformance?.labels ? (
              <div className="space-y-4">
                {traitData.traitPerformance.labels.map((trait: string, index: number) => (
                  <div key={trait} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{trait}</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {traitData.traitPerformance.currentGeneration[index]}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${traitData.traitPerformance.currentGeneration[index]}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No breeding value data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Genetic Diversity Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Genetic Diversity Metrics</CardTitle>
            <CardDescription>
              Population genetic health indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Heterozygosity</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">0.847</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Inbreeding Coeff.</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">0.023</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allelic Richness</span>
                  <Badge variant="outline">High</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Population Structure</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Optimal
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Effective Population Size</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ne = 412</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

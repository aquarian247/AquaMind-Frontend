import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, TrendingUp, BarChart3, Download, Filter } from "lucide-react";
import { Link } from "wouter";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Scatter } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function BroodstockGenetic() {
  const { data: traitData, isLoading } = useQuery({
    queryKey: ['/api/v1/broodstock/genetic/traits/'],
  });

  if (isLoading) {
    return (
      <div className="p-3 lg:p-6">
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-80 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Correlation matrix chart data
  const correlationData = traitData?.correlationMatrix ? {
    datasets: [{
      label: 'Trait Correlations',
      data: traitData.correlationMatrix.correlations.flatMap((row: number[], rowIndex: number) =>
        row.map((value: number, colIndex: number) => ({
          x: colIndex,
          y: rowIndex,
          v: value
        }))
      ),
      backgroundColor: (context: any) => {
        const value = context.parsed.v;
        const alpha = Math.abs(value);
        return value < 0 
          ? `rgba(220, 50, 47, ${alpha})` 
          : `rgba(38, 139, 210, ${alpha})`;
      },
      borderColor: 'white',
      borderWidth: 1,
      pointRadius: 15
    }]
  } : null;

  const correlationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: () => '',
          label: (context: any) => {
            const v = context.parsed;
            const xLabel = traitData?.correlationMatrix.traits[v.x];
            const yLabel = traitData?.correlationMatrix.traits[v.y];
            return `${xLabel} vs ${yLabel}: ${v.v.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        min: -0.5,
        max: traitData?.correlationMatrix.traits.length - 0.5,
        ticks: {
          stepSize: 1,
          callback: (value: any) => traitData?.correlationMatrix.traits[value] || ''
        }
      },
      y: {
        type: 'linear' as const,
        min: -0.5,
        max: traitData?.correlationMatrix.traits.length - 0.5,
        ticks: {
          stepSize: 1,
          callback: (value: any) => traitData?.correlationMatrix.traits[value] || ''
        }
      }
    }
  };

  // SNP Browser visualization
  const snpData = traitData?.snpAnalysis ? {
    datasets: traitData.snpAnalysis.genomicMarkers.map((marker: any, index: number) => ({
      label: marker.type.charAt(0).toUpperCase() + marker.type.slice(1),
      data: marker.positions.map((pos: number) => ({ x: pos * 100, y: index + 1 })),
      backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'][index % 4],
      pointRadius: 6
    }))
  } : null;

  const snpOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: Position ${context.parsed.x.toFixed(1)}%`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Chromosome Position (%)'
        },
        min: 0,
        max: 100
      },
      y: {
        title: {
          display: true,
          text: 'Trait Groups'
        },
        min: 0.5,
        max: 4.5,
        ticks: {
          stepSize: 1,
          callback: (value: any) => {
            const labels = ['Growth', 'Disease', 'Quality', 'Maturation'];
            return labels[value - 1] || '';
          }
        }
      }
    }
  };

  return (
    <div className="p-3 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/broodstock">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Genetic Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              SNP analysis, trait correlations, and genomic insights
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter Traits
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

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

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trait Correlation Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Trait Correlation Matrix
            </CardTitle>
            <CardDescription>
              Genetic correlations between breeding traits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {correlationData && (
                <Scatter data={correlationData} options={correlationOptions} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* SNP Genomic Markers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Genomic Markers
            </CardTitle>
            <CardDescription>
              SNP locations across trait-associated genomic regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {snpData && (
                <Scatter data={snpData} options={snpOptions} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breeding Values & Genomic Predictions */}
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
            <div className="space-y-4">
              {traitData?.traitPerformance?.labels?.map((trait: string, index: number) => (
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

      {/* Genomic Selection Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Genomic Selection Results</CardTitle>
          <CardDescription>
            Latest genomic evaluation and selection candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Fish ID</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Growth EBV</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Disease Resistance</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Feed Conversion</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Selection Index</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'BM-2025-001', growth: 92.4, disease: 87.1, fcr: 89.5, index: 91.2, status: 'selected' },
                  { id: 'BF-2025-007', growth: 88.7, disease: 94.2, fcr: 85.3, index: 89.8, status: 'selected' },
                  { id: 'BM-2025-015', growth: 85.9, disease: 91.6, fcr: 87.2, index: 87.4, status: 'candidate' },
                  { id: 'BF-2025-023', growth: 91.1, disease: 82.3, fcr: 88.7, index: 86.9, status: 'candidate' },
                  { id: 'BM-2025-031', growth: 83.5, disease: 89.4, fcr: 84.1, index: 85.2, status: 'candidate' }
                ].map((fish) => (
                  <tr key={fish.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-2 font-mono text-blue-600 dark:text-blue-400">{fish.id}</td>
                    <td className="py-3 px-2">{fish.growth}</td>
                    <td className="py-3 px-2">{fish.disease}</td>
                    <td className="py-3 px-2">{fish.fcr}</td>
                    <td className="py-3 px-2 font-semibold">{fish.index}</td>
                    <td className="py-3 px-2">
                      <Badge variant={fish.status === 'selected' ? 'default' : 'secondary'}>
                        {fish.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BroodstockGenetic;
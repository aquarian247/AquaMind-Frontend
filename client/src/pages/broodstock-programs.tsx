import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, TrendingUp, Users, ChevronRight, MoreVertical } from "lucide-react";
import { Link } from "wouter";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function BroodstockPrograms() {
  const { data: programs, isLoading } = useQuery({
    queryKey: ['/api/v1/broodstock/programs/'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'selection': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'delayed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="w-4 h-4" />;
      case 'selection': return <Target className="w-4 h-4" />;
      case 'delayed': return <Users className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-3 lg:p-6">
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-48 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
              Breeding Programs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor selective breeding initiatives
            </p>
          </div>
        </div>
        <Button size="sm">
          <Target className="w-4 h-4 mr-2" />
          New Program
        </Button>
      </div>

      {/* Program Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Programs
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {programs?.results?.filter((p: any) => p.status === 'active').length || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Population
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {programs?.results?.reduce((sum: number, p: any) => sum + p.populationSize, 0)?.toLocaleString() || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(programs?.results?.reduce((sum: number, p: any) => sum + p.progress, 0) / (programs?.results?.length || 1)) || 0}%
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs?.results?.map((program: any) => (
          <Card key={program.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(program.status)}
                    <Badge className={getStatusColor(program.status)}>
                      {program.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {program.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {program.description}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Generation {program.currentGeneration} → {program.targetGeneration}
                  </span>
                  <span className="font-medium">{program.progress}%</span>
                </div>
                <Progress value={program.progress} className="h-2" />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Population</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {program.populationSize.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Started</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {format(new Date(program.startDate), 'MMM yyyy')}
                  </p>
                </div>
              </div>

              {/* Genetic Gain Chart */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Genetic Gain Progress
                </p>
                <div className="h-20">
                  <Line
                    data={{
                      labels: program.geneticGain.map((_: any, idx: number) => `G${idx + 1}`),
                      datasets: [{
                        data: program.geneticGain,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        tension: 0.3
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.parsed.y}% genetic gain`
                          }
                        }
                      },
                      scales: {
                        x: { display: false },
                        y: { display: false }
                      },
                      elements: {
                        point: { hoverRadius: 6 }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Trait Weights */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Primary Traits
                </p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(program.traitWeights)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([trait, weight]) => (
                      <Badge key={trait} variant="outline" className="text-xs">
                        {trait.replace(/([A-Z])/g, ' $1').trim()} {weight}%
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Lead Geneticist */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Lead Geneticist</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {program.leadGeneticist}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Program Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Program Timeline</CardTitle>
          <CardDescription>
            Overview of all breeding programs and their progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {programs?.results?.map((program: any, index: number) => (
              <div key={program.id} className="relative">
                {index < programs.results.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-300 dark:bg-gray-600"></div>
                )}
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    program.status === 'active' ? 'bg-green-500' :
                    program.status === 'selection' ? 'bg-blue-500' :
                    program.status === 'delayed' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {getStatusIcon(program.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {program.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Generation {program.currentGeneration} of {program.targetGeneration} • 
                          Started {format(new Date(program.startDate), 'MMMM yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {program.progress}% Complete
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {program.populationSize.toLocaleString()} fish
                          </p>
                        </div>
                        <Badge className={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                      </div>
                    </div>
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

export default BroodstockPrograms;
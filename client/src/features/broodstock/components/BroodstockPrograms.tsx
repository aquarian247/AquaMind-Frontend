import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Users, Eye } from "lucide-react";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";

interface Program {
  id: number;
  name: string;
  description: string;
  status: string;
  currentGeneration: number;
  targetGeneration: number;
  progress: number;
  populationSize: number;
  startDate: string;
  leadGeneticist: string;
  geneticGain: number[];
  traitWeights: Record<string, number>;
}

interface BroodstockProgramsProps {
  programs: Program[] | null;
  isLoading: boolean;
}

export function BroodstockPrograms({ programs, isLoading }: BroodstockProgramsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate program summary statistics
  const activePrograms = programs?.results?.filter((p: Program) => p.status === 'active').length || 0;
  const totalPopulation = (programs?.results ?? [])
    .reduce((sum: number, p: Program) => sum + p.populationSize, 0);
  const avgProgress = programs?.results?.length > 0 ?
    Math.round(
      (programs.results ?? []).reduce(
        (sum: number, p: Program) => sum + p.progress,
        0
      ) / ((programs.results?.length ?? 1) || 1)
    ) : 0;

  return (
    <div className="space-y-6">
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
                  {activePrograms}
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
                  {totalPopulation.toLocaleString()}
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
                  {avgProgress}%
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs?.results?.length > 0 ? (
          programs.results.map((program: Program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4" />
                      <Badge className={program.status === 'active' ? 'bg-green-100 text-green-800' : program.status === 'selection' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                        {program.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {program.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {program.description}
                    </p>
                  </div>
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
                          {trait.replace(/([A-Z])/g, ' $1').trim()} {weight as number}%
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Lead Geneticist</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {program.leadGeneticist}
                      </p>
                    </div>
                    <Link href={`/breeding-program-details/${program.id}`}>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No breeding programs available
          </div>
        )}
      </div>
    </div>
  );
}

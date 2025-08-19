import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, TrendingUp, Users, Calendar, BarChart3, Dna, Activity, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { api } from "@/lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BreedingProgram {
  id: number;
  name: string;
  status: string;
  currentGeneration: number;
  targetGeneration: number;
  startDate: string;
  progress: number;
  populationSize: number;
  leadGeneticist: string;
  traitWeights: {
    [key: string]: number;
  };
  geneticGain: number[];
  description: string;
  nextMilestone?: string;
  recentActivity?: string;
}

export default function BreedingProgramDetails() {
  const params = useParams();
  const programId = parseInt(params.id!);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: programs, isLoading } = useQuery<{ results: BreedingProgram[] }>({
    queryKey: ["broodstock/programs"],
    queryFn: () => api.broodstock.programs.getAll(),
  });

  const program = programs?.results?.find((p: BreedingProgram) => p.id === programId);

  if (isLoading) {
    return <div>Loading program details...</div>;
  }

  if (!program) {
    return <div>Breeding program not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'selection': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const geneticGainChartData = {
    labels: program.geneticGain.map((_value: number, index: number) => `G${index + 1}`),
    datasets: [{
      label: 'Genetic Gain (%)',
      data: program.geneticGain,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      tension: 0.3
    }]
  };

  const traitWeightsChartData = {
    labels: Object.keys(program.traitWeights).map(key => 
      key.replace(/([A-Z])/g, ' $1').trim()
    ),
    datasets: [{
      label: 'Weight (%)',
      data: Object.values(program.traitWeights),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link href="/broodstock">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Broodstock</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{program.name}</h1>
          <p className="text-muted-foreground">
            Generation {program.currentGeneration} of {program.targetGeneration} • Led by {program.leadGeneticist}
          </p>
        </div>
        <div className="ml-auto flex gap-2 flex-wrap">
          <Badge className={getStatusColor(program.status)}>
            {program.status}
          </Badge>
        </div>
      </div>

      {/* Program Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</p>
                <p className="text-2xl font-bold">{program.progress}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Population</p>
                <p className="text-2xl font-bold">{program.populationSize.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Started</p>
                <p className="text-2xl font-bold">{format(new Date(program.startDate), 'yyyy')}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Latest Gain</p>
                <p className="text-2xl font-bold">{program.geneticGain[program.geneticGain.length - 1]}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generation Progress</h3>
              <Badge variant="outline">
                G{program.currentGeneration} → G{program.targetGeneration}
              </Badge>
            </div>
            <Progress value={program.progress} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Started {format(new Date(program.startDate), 'MMM yyyy')}</span>
              <span>{program.progress}% Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="genetics">Genetics</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{program.description}</p>
                {program.nextMilestone && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900 dark:text-blue-100">Next Milestone</span>
                    </div>
                    <p className="text-blue-800 dark:text-blue-200">{program.nextMilestone}</p>
                  </div>
                )}
                {program.recentActivity && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900 dark:text-green-100">Recent Activity</span>
                    </div>
                    <p className="text-green-800 dark:text-green-200">{program.recentActivity}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trait Weights</CardTitle>
                <CardDescription>Current selection emphasis by trait</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar
                    data={traitWeightsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.parsed.y}% emphasis`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: (value) => `${value}%`
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Genetics Tab */}
        <TabsContent value="genetics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genetic Gain Progression</CardTitle>
              <CardDescription>
                Cumulative genetic improvement across generations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line
                  data={geneticGainChartData}
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
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `${value}%`
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {program.geneticGain.map((gain: number, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Generation {index + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{gain}%</span>
                        {index > 0 && (
                          <span className="text-sm text-green-600">
                            +{(gain - program.geneticGain[index - 1]).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breeding Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(program.traitWeights)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .map(([trait, weight]) => (
                      <div key={trait} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            {trait.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span>{weight}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${weight}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Timeline</CardTitle>
              <CardDescription>
                Key milestones and generation progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Program Initiated</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(program.startDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                  {program.geneticGain.map((gain: number, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      index < program.currentGeneration - 1 ? 'bg-green-500' : 
                      index === program.currentGeneration - 1 ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <p className="font-medium">Generation {index + 1}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {gain}% genetic gain achieved
                      </p>
                    </div>
                  </div>
                ))}

                {program.nextMilestone && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Upcoming Milestone</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {program.nextMilestone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Population Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">98.7%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Survival Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">+14.2%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">vs Previous Generation</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selection Intensity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">15%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top Performers Selected</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Feed Conversion Ratio</span>
                  <span className="font-bold">1.18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Daily Gain</span>
                  <span className="font-bold">2.8g/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Harvest Weight Target</span>
                  <span className="font-bold">4.2kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Genetic Diversity Index</span>
                  <span className="font-bold">0.847</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  DNA,
  Microscope,
  Target,
  Plus,
  Dna,
  Grid,
  List,
  Filter,
  Download,
  Thermometer,
  Droplets,
  Search,
  ArrowRight,
  Eye,
  FlaskConical
} from "lucide-react";
import { Radar, Line, Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { useIsMobile } from "@/hooks/use-mobile";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function BroodstockDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGeography, setSelectedGeography] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const isMobile = useIsMobile();
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['/api/v1/broodstock/dashboard/kpis/'],
  });

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ['/api/v1/broodstock/programs/'],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/v1/broodstock/activities/'],
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/v1/broodstock/tasks/'],
  });

  const { data: traitData, isLoading: traitsLoading } = useQuery({
    queryKey: ['/api/v1/broodstock/genetic/traits/'],
  });

  const { data: containers, isLoading: containersLoading } = useQuery({
    queryKey: ['/api/v1/broodstock/containers/'],
  });

  const { data: geographiesData } = useQuery({
    queryKey: ['/api/v1/infrastructure/geographies/'],
    queryFn: async () => {
      const response = await fetch('/api/v1/infrastructure/geographies/');
      if (!response.ok) throw new Error('Failed to fetch geographies');
      return response.json();
    },
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'genetic_analysis':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'breeding_selection':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'trait_analysis':
        return <FlaskConical className="w-5 h-5 text-purple-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-400';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'low': return 'bg-green-100 text-green-800 border-green-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  };

  const radarData = traitData ? {
    labels: traitData.traitPerformance.labels,
    datasets: [
      {
        label: 'Current Generation',
        data: traitData.traitPerformance.currentGeneration,
        backgroundColor: 'rgba(38, 139, 210, 0.2)',
        borderColor: 'rgba(38, 139, 210, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(38, 139, 210, 1)',
        pointRadius: 4
      },
      {
        label: 'Target Profile',
        data: traitData.traitPerformance.targetProfile,
        backgroundColor: 'rgba(42, 161, 152, 0.1)',
        borderColor: 'rgba(42, 161, 152, 1)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(42, 161, 152, 1)',
        pointRadius: 3
      }
    ]
  } : null;

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  if (kpisLoading || programsLoading || activitiesLoading || tasksLoading || traitsLoading || containersLoading) {
    return (
      <div className="p-3 lg:p-6">
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
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
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Broodstock Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Genetic optimization and breeding program oversight
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select 
              value={selectedGeography} 
              onChange={(e) => setSelectedGeography(e.target.value)}
              className="h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            >
              <option value="all">All Geographies</option>
              {geographiesData?.results?.map((geo: any) => (
                <option key={geo.id} value={geo.name.toLowerCase()}>
                  {geo.name}
                </option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Program
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Pairs
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {kpis?.activeBroodstockPairs || 0}
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
                  {kpis?.broodstockPopulation?.toLocaleString() || 0}
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
                  Progeny Count
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {kpis?.totalProgenyCount?.toLocaleString() || 0}
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
                  {kpis?.geneticDiversityIndex || 0}
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
                  {kpis?.pendingSelections || 0}
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
                  {kpis?.averageGeneticGain || 0}%
                </p>
              </div>
              <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Programs</span>
          </TabsTrigger>
          <TabsTrigger value="genetic" className="flex items-center gap-2">
            <Dna className="w-4 h-4" />
            <span className="hidden sm:inline">Genetic</span>
          </TabsTrigger>
          <TabsTrigger value="population" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Population</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Breeding Programs */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg lg:text-xl">Active Breeding Programs</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("programs")}>
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {programs?.results?.slice(0, 3).map((program: any) => (
                    <div key={program.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {program.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Generation {program.currentGeneration} → {program.targetGeneration} • {program.populationSize.toLocaleString()} fish
                          </p>
                        </div>
                        <Badge variant={program.status === 'active' ? 'default' : program.status === 'selection' ? 'secondary' : 'destructive'}>
                          {program.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-medium">{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between items-center mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>Lead: {program.leadGeneticist}</span>
                        <span>Started {format(new Date(program.startDate), 'MMM yyyy')}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Trait Performance Chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Trait Performance</CardTitle>
                <CardDescription>Current vs target genetic profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {radarData && (
                    <Radar data={radarData} options={radarOptions} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities and Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities?.results?.map((activity: any) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                          {activity.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Upcoming Tasks
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks?.results?.map((task: any) => (
                  <div key={task.id} className={`p-3 rounded border-l-4 ${getPriorityColor(task.priority)}`}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {task.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(task.dueDate), 'MMM dd')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {task.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-6">
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
                        <Target className="w-4 h-4" />
                        <Badge className={program.status === 'active' ? 'bg-green-100 text-green-800' : program.status === 'selection' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
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
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Lead Geneticist</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {program.leadGeneticist}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Genetic Tab */}
        <TabsContent value="genetic" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Genetic Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                SNP analysis, trait correlations, and genomic insights
              </p>
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
                      <p className="text-xl font-bold text-gray-90 dark:text-gray-100">0.847</p>
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
        </TabsContent>

        {/* Population Tab */}
        <TabsContent value="population" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Population Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor broodstock containers and environmental conditions
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Containers
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {containers?.count || 0}
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
                      Optimal Status
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {Math.floor((containers?.results?.filter((c: any) => c.environmentalStatus === 'optimal').length || 0) / (containers?.count || 1) * 100)}%
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Avg Temperature
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {containers?.results ? 
                        (containers.results.reduce((sum: number, c: any) => sum + parseFloat(c.temperature), 0) / containers.results.length).toFixed(1) 
                        : '0.0'}°C
                    </p>
                  </div>
                  <Thermometer className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Fish
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {containers?.results?.reduce((sum: number, c: any) => sum + c.fishCount, 0)?.toLocaleString() || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Container Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {containers?.results?.map((container: any) => (
                <Card key={container.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base leading-tight">
                          {container.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {container.location || 'Location not specified'}
                        </CardDescription>
                      </div>
                      <Badge className={container.environmentalStatus === 'optimal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        <Activity className="w-3 h-3 mr-1" />
                        <span className="text-xs">{container.environmentalStatus}</span>
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Fish Count */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fish Count</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {container.fishCount} / {container.capacity}
                      </span>
                    </div>

                    {/* Environmental Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-600 dark:text-gray-400">Temp</span>
                        <span className="font-medium">{container.temperature}°C</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">O₂</span>
                        <span className="font-medium">{container.oxygen} mg/L</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-600 dark:text-gray-400">pH</span>
                        <span className="font-medium">{container.ph}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-yellow-400 rounded-full"></span>
                        <span className="text-gray-600 dark:text-gray-400">Light</span>
                        <span className="font-medium">{container.light}h</span>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {Math.round((container.fishCount / container.capacity) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((container.fishCount / container.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Container List View</CardTitle>
                <CardDescription>
                  Detailed container information in tabular format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Container</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Fish Count</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Capacity</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Temperature</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Oxygen</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">pH</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {containers?.results?.map((container: any) => (
                        <tr key={container.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-2">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">{container.name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{container.location}</div>
                            </div>
                          </td>
                          <td className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-100">
                            {container.fishCount}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-2">
                              <span>{container.capacity}</span>
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                <div 
                                  className="bg-blue-600 h-1 rounded-full" 
                                  style={{ width: `${Math.min((container.fishCount / container.capacity) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">{container.temperature}°C</td>
                          <td className="py-3 px-2">{container.oxygen} mg/L</td>
                          <td className="py-3 px-2">{container.ph}</td>
                          <td className="py-3 px-2">
                            <Badge className={container.environmentalStatus === 'optimal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {container.environmentalStatus}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BroodstockDashboard;
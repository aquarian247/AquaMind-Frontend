import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Target, TrendingUp, Users, AlertCircle, CheckCircle, FlaskConical, ArrowRight, Calendar, Eye } from "lucide-react";
import { Link } from "wouter";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function BroodstockDashboard() {
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

  if (kpisLoading || programsLoading || activitiesLoading || tasksLoading || traitsLoading) {
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
          <Link href="/broodstock/programs">
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              Programs
            </Button>
          </Link>
          <Link href="/broodstock/genetic">
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Genetic Analysis
            </Button>
          </Link>
          <Link href="/broodstock/population">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Population
            </Button>
          </Link>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breeding Programs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg lg:text-xl">Active Breeding Programs</CardTitle>
                <Link href="/broodstock/programs">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
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
    </div>
  );
}

export default BroodstockDashboard;
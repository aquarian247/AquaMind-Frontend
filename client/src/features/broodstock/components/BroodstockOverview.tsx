import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, ArrowRight, CheckCircle } from "lucide-react";
import { Radar, Line } from "react-chartjs-2";
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

interface GeneticTraitData {
  traitPerformance: {
    labels: string[];
    currentGeneration: number[];
    targetProfile: number[];
  };
}

interface BroodstockOverviewProps {
  programs: Program[] | null;
  traitData: GeneticTraitData | null;
  activities: any[] | null;
  tasks: any[] | null;
  programsLoading: boolean;
  traitsLoading: boolean;
  activitiesLoading: boolean;
  tasksLoading: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'genetic_analysis':
      return <Activity className="w-5 h-5 text-blue-500" />;
    case 'breeding_selection':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Activity className="w-5 h-5 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-400';
    case 'medium':
      return 'bg-blue-100 text-blue-800 border-blue-400';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-400';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-400';
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

export function BroodstockOverview({
  programs,
  traitData,
  activities,
  tasks,
  programsLoading,
  traitsLoading,
  activitiesLoading,
  tasksLoading
}: BroodstockOverviewProps) {
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

  if (programsLoading || traitsLoading || activitiesLoading || tasksLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Breeding Programs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg lg:text-xl">Active Breeding Programs</CardTitle>
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {programs?.slice(0, 3).map((program: Program) => (
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
              {radarData ? (
                <Radar data={radarData} options={radarOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No trait data available
                </div>
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
            {activities && activities.length > 0 ? (
              activities.map((activity: any) => (
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
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No recent activities to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                Upcoming Tasks
              </CardTitle>
              <Button variant="ghost" size="sm">
                Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks && tasks.length > 0 ? (
              tasks.map((task: any) => (
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
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No upcoming tasks scheduled
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

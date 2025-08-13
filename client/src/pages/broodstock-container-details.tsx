import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Thermometer, Droplets, Activity, Users, MapPin, Calendar, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";
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

interface BroodstockContainer {
  id: number;
  name: string;
  location: string;
  facility: string;
  geography: string;
  containerType: string;
  stage: string;
  fishCount: number;
  capacity: number;
  utilizationRate: number;
  assignedProgram?: string;
  generation?: string;
  temperature: number;
  oxygen: number;
  ph: number;
  salinity: number;
  light: number;
  flowRate: number;
  environmentalStatus: string;
  status: string;
  lastFeedingTime: string;
  lastHealthCheck: string;
  lastSampling?: string;
  mortalityRate: string;
  avgWeight: string;
  conditionFactor: string;
  hasActiveAlerts: boolean;
  alertCount: number;
}

export default function BroodstockContainerDetails() {
  const params = useParams();
  const containerId = parseInt(params.id!);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: containersData, isLoading } = useQuery<{ results: BroodstockContainer[] }>({
    queryKey: ['/api/v1/broodstock/containers/'],
  });

  const container = containersData?.results?.find((c: BroodstockContainer) => c.id === containerId);

  if (isLoading) {
    return <div>Loading container details...</div>;
  }

  if (!container) {
    return <div>Broodstock container not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock historical data for charts
  const environmentalData = {
    labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [container.temperature - 0.5, container.temperature - 0.2, container.temperature + 0.1, container.temperature - 0.3, container.temperature + 0.2, container.temperature - 0.1, container.temperature],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3
      },
      {
        label: 'Oxygen (mg/L)',
        data: [container.oxygen - 0.3, container.oxygen + 0.1, container.oxygen - 0.2, container.oxygen + 0.4, container.oxygen - 0.1, container.oxygen + 0.2, container.oxygen],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      }
    ]
  };

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Average Weight (g)',
        data: [parseInt(container.avgWeight) - 200, parseInt(container.avgWeight) - 100, parseInt(container.avgWeight) - 50, parseInt(container.avgWeight)],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
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
          <h1 className="text-3xl font-bold">{container.name}</h1>
          <p className="text-muted-foreground">
            {container.facility} • {container.geography}
          </p>
        </div>
        <div className="ml-auto flex gap-2 flex-wrap">
          <Badge className={getStatusColor(container.environmentalStatus)}>
            {container.environmentalStatus}
          </Badge>
          {container.assignedProgram && (
            <Badge variant="outline">
              {container.assignedProgram}
            </Badge>
          )}
        </div>
      </div>

      {/* Container Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fish Count</p>
                <p className="text-2xl font-bold">{container.fishCount}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilization</p>
                <p className="text-2xl font-bold">{container.utilizationRate}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temperature</p>
                <p className="text-2xl font-bold">{container.temperature}°C</p>
              </div>
              <Thermometer className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Weight</p>
                <p className="text-2xl font-bold">{container.avgWeight}g</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {container.hasActiveAlerts && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This container has {container.alertCount} active alert{container.alertCount !== 1 ? 's' : ''} requiring attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Capacity Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Capacity Utilization</h3>
              <Badge variant="outline">
                {container.fishCount} / {container.capacity} fish
              </Badge>
            </div>
            <Progress value={container.utilizationRate} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{container.stage.replace('_', ' ')} stage</span>
              <span>{container.utilizationRate}% capacity</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Container Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium">{container.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Container Type</span>
                    <span className="font-medium">{container.containerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Stage</span>
                    <span className="font-medium">{container.stage.replace('_', ' ')}</span>
                  </div>
                  {container.assignedProgram && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Assigned Program</span>
                      <span className="font-medium">{container.assignedProgram}</span>
                    </div>
                  )}
                  {container.generation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Generation</span>
                      <span className="font-medium">{container.generation}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <Badge className={getStatusColor(container.environmentalStatus)}>
                      {container.environmentalStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Last Feeding</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(container.lastFeedingTime), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Last Health Check</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(container.lastHealthCheck), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                  {container.lastSampling && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Last Sampling</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(container.lastSampling), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Environmental Tab */}
        <TabsContent value="environmental" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Trends</CardTitle>
              <CardDescription>
                Temperature and oxygen levels over the last 6 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line
                  data={environmentalData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        ticks: {
                          callback: (value) => `${value}`
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">{container.temperature}°C</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  Oxygen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">{container.oxygen}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">mg/L</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  pH Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">{container.ph}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">pH units</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Additional Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Salinity</span>
                    <span className="font-medium">{container.salinity}‰</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Light Period</span>
                    <span className="font-medium">{container.light}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Flow Rate</span>
                    <span className="font-medium">{container.flowRate} L/min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Growth Performance</CardTitle>
              <CardDescription>
                Average weight progression over the last 4 weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar
                  data={performanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.parsed.y}g average weight`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        ticks: {
                          callback: (value) => `${value}g`
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mortality Rate</span>
                    <span className="font-medium">{container.mortalityRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Condition Factor</span>
                    <span className="font-medium">{container.conditionFactor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Average Weight</span>
                    <span className="font-medium">{container.avgWeight}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feed Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">1.24</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">FCR</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2.8</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">g/day</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Container History</CardTitle>
              <CardDescription>
                Recent events and activities for this container
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Routine Feeding</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(container.lastFeedingTime), 'MMMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Health Assessment</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(container.lastHealthCheck), 'MMMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                {container.lastSampling && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Genetic Sampling</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(container.lastSampling), 'MMMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Environmental Monitoring</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Continuous monitoring - Last reading 15 minutes ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

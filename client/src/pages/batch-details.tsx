import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Fish, Thermometer, Activity, Calendar, History, MapPin, Truck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BatchDetails {
  id: number;
  name: string;
  species: number;
  speciesName?: string;
  stageName?: string;
  status: string;
  startDate: string;
  initialCount: number;
  currentCount: number;
  initialBiomassKg: string;
  currentBiomassKg: string;
  container: number | null;
  containerName?: string;
  expectedHarvestDate: string;
  notes: string | null;
  eggSource: string;
  broodstockPairId: number | null;
  eggSupplierId: number | null;
  eggProductionDate: string | null;
  stage: number;
}

interface Container {
  id: number;
  name: string;
  containerType: string;
  capacity: number;
  healthStatus?: string;
  currentStock?: number;
  location?: string;
  batchId?: number;
  status?: string;
  coordinates?: string;
  depth?: string;
}

interface ProductionMetrics {
  currentBiomass: number;
  fishCount: number;
  capacityUsage: number;
  averageWeight: number;
}

export default function BatchDetails() {
  const { id } = useParams();
  
  const { data: batch, isLoading: batchLoading } = useQuery<BatchDetails>({
    queryKey: ['/api/batches', id],
    queryFn: async () => {
      const response = await fetch(`/api/batches/${id}`);
      if (!response.ok) throw new Error('Failed to fetch batch');
      return response.json();
    }
  });

  const { data: containers = [], isLoading: containersLoading } = useQuery<Container[]>({
    queryKey: ['/api/containers/batch', id],
    queryFn: async () => {
      const response = await fetch(`/api/containers?batchId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch containers');
      return response.json();
    }
  });

  const { data: allContainers = [] } = useQuery<Container[]>({
    queryKey: ['/api/containers'],
    queryFn: async () => {
      const response = await fetch('/api/containers');
      if (!response.ok) throw new Error('Failed to fetch all containers');
      return response.json();
    }
  });

  if (batchLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Fish className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Batch not found</h3>
          <p className="mt-1 text-sm text-gray-500">The batch you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link href="/batch-management">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Batch Management
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const calculateProgress = (batch: BatchDetails) => {
    const startDate = new Date(batch.startDate);
    const currentDate = new Date();
    const daysAlive = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const stageDurations = {
      "Egg": 100,
      "Fry": 100,
      "Parr": 100,
      "Smolt": 100,
      "Post-Smolt": 100,
      "Adult": 450
    };

    const currentStageDuration = stageDurations[batch.stageName as keyof typeof stageDurations] || 100;
    const previousStagesDuration = Object.entries(stageDurations)
      .slice(0, Object.keys(stageDurations).indexOf(batch.stageName || ""))
      .reduce((sum, [_, duration]) => sum + duration, 0);
    
    const daysInCurrentStage = daysAlive - previousStagesDuration;
    const progress = Math.min((daysInCurrentStage / currentStageDuration) * 100, 100);
    return Math.max(0, progress);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 60) return "bg-green-500";
    if (progress < 75) return "bg-yellow-500";
    if (progress < 90) return "bg-orange-500";
    return "bg-red-700";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'harvested': return 'bg-blue-500';
      case 'transferred': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-600 bg-gray-50';
    switch (status.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-green-600 bg-green-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const progress = calculateProgress(batch);
  
  // Calculate production metrics from containers
  const batchContainers = allContainers.filter(c => c.batchId === batch.id);
  const productionMetrics: ProductionMetrics = {
    currentBiomass: parseFloat(batch.currentBiomassKg),
    fishCount: batch.currentCount,
    capacityUsage: batchContainers.length > 0 
      ? (batchContainers.reduce((sum, c) => sum + c.currentStock, 0) / batchContainers.reduce((sum, c) => sum + c.capacity, 0)) * 100 
      : 0,
    averageWeight: batch.currentCount > 0 ? (parseFloat(batch.currentBiomassKg) * 1000) / batch.currentCount : 0
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/batch-management">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{batch.name}</h1>
            <p className="text-gray-500">{batch.speciesName} • {batch.stageName} Stage</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge 
            className={`${getStatusBadgeColor(batch.status)} text-white`}
          >
            {batch.status}
          </Badge>
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            View History
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Production Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Current Biomass</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionMetrics.currentBiomass.toLocaleString()}</div>
            <p className="text-xs text-gray-500">kg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Fish Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionMetrics.fishCount.toLocaleString()}</div>
            <p className="text-xs text-gray-500">individuals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Capacity Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionMetrics.capacityUsage.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">of total capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionMetrics.averageWeight.toFixed(1)}</div>
            <p className="text-xs text-gray-500">grams</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="containers">Container Distribution</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lifecycle Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Lifecycle Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Stage: {batch.stageName}</span>
                    <span>{progress.toFixed(1)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-3">
                    <div 
                      className={`h-full ${getProgressColor(progress)} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </Progress>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Start Date:</span>
                    <div className="font-medium">{new Date(batch.startDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Expected Harvest:</span>
                    <div className="font-medium">{new Date(batch.expectedHarvestDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Batch Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Fish className="h-5 w-5 mr-2" />
                  Batch Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Initial Count:</span>
                    <div className="font-medium">{batch.initialCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Count:</span>
                    <div className="font-medium">{batch.currentCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Initial Biomass:</span>
                    <div className="font-medium">{batch.initialBiomassKg} kg</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Biomass:</span>
                    <div className="font-medium">{batch.currentBiomassKg} kg</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Egg Source:</span>
                    <div className="font-medium capitalize">{batch.eggSource}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Mortality Rate:</span>
                    <div className="font-medium">
                      {(((batch.initialCount - batch.currentCount) / batch.initialCount) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="containers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Container Distribution
                </div>
                <Badge variant="outline">
                  {batchContainers.length} Containers
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {batchContainers.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No containers assigned</h3>
                  <p className="mt-1 text-sm text-gray-500">This batch hasn't been assigned to any containers yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {batchContainers.map((container) => (
                    <div 
                      key={container.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{container.name}</h4>
                        <Badge 
                          className={`text-xs ${getHealthStatusColor(container.healthStatus || container.status)}`}
                          variant="outline"
                        >
                          {container.healthStatus || container.status || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span>{container.containerType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Capacity:</span>
                          <span>{(container.capacity || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Current Stock:</span>
                          <span>{(container.currentStock || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Utilization:</span>
                          <span>{(((container.currentStock || 0) / (container.capacity || 1)) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Location:</span>
                          <span className="text-xs">{container.location || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={((container.currentStock || 0) / (container.capacity || 1)) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Historical Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Historical data coming soon</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This feature will show batch history from the batch_historicalbatch table.
                  We're implementing pagination and filtering to handle large datasets efficiently.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
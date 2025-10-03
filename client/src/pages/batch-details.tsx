import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, Fish, Calendar, Scale, TrendingUp, MoreVertical, Activity, Heart, Utensils, BarChart3, MapPin, Eye, Settings } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { BatchTraceabilityView } from "../components/batch-management/BatchTraceabilityView";
import { BatchHealthView } from "../components/batch-management/BatchHealthView";
import { BatchFeedHistoryView } from "../components/batch-management/BatchFeedHistoryView";
import { BatchAnalyticsView } from "../components/batch-management/BatchAnalyticsView";
import { api } from "../lib/api";
import { ApiService } from "@/api/generated";
import { formatFallback, formatCount } from "@/lib/formatFallback";

interface BatchDetails {
  id: number;
  batch_number: string;
  species: number;
  species_name: string;
  lifecycle_stage: number;
  current_lifecycle_stage: {
    id: number;
    name: string;
  } | null;
  start_date: string;
  expected_end_date?: string | null;
  calculated_population_count: number;
  calculated_biomass_kg: number;
  status: string;
  active_containers: number[];
  notes?: string;
  containerName?: string;
}

interface Container {
  id: number;
  name: string;
}

export default function BatchDetails() {
  const params = useParams();
  const batchId = parseInt(params.id!);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: batch, isLoading } = useQuery({
    queryKey: ["batch/details", batchId],
    queryFn: () => api.batch.getById(batchId) as Promise<BatchDetails>,
  });

  const { data: containers } = useQuery<Container[]>({
    queryKey: ["infrastructure/containers"],
    queryFn: async () => {
      const response = await api.infrastructure.getContainers();
      return response.results || [];
    },
  });

  const { data: species } = useQuery({
    queryKey: ["batch/species"],
    queryFn: async () => (await api.batch.getSpecies()).results,
  });

  const { data: stages } = useQuery({
    queryKey: ["batch/lifecycle-stages"],
    queryFn: async () => (await api.batch.getLifecycleStages()).results,
  });

  const { data: assignments } = useQuery({
    queryKey: ["batch/assignments", batchId],
    queryFn: async () => (await api.batch.getAssignments(batchId)).results,
  });

  const { data: transfers } = useQuery({
    queryKey: ["batch/transfers", batchId],
    queryFn: async () => (await api.batch.getTransfers(batchId)).results,
  });

  // ✅ SERVER-SIDE: Fetch growth samples for growth rate calculation
  const { data: growthSamples } = useQuery({
    queryKey: ["batch/growth-samples", batchId],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1BatchGrowthSamplesList(
          batchId,
          undefined, // assignmentBatchIn
          undefined, // ordering
          undefined, // page
          undefined, // sampleDate
          undefined  // search
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch growth samples:", error);
        return [];
      }
    },
  });

  // ✅ SERVER-SIDE: Fetch feeding summaries for FCR
  const { data: feedingSummaries } = useQuery({
    queryKey: ["batch/feeding-summaries", batchId],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1InventoryBatchFeedingSummariesList(
          batchId,
          undefined, // ordering
          undefined, // page
          undefined, // periodEnd
          undefined  // periodStart
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch feeding summaries:", error);
        return [];
      }
    },
  });

  // Calculate growth rate from growth samples
  const growthRate = growthSamples && growthSamples.length >= 2
    ? (() => {
        const sorted = [...growthSamples].sort((a, b) => 
          new Date(a.sample_date || 0).getTime() - new Date(b.sample_date || 0).getTime()
        );
        const latest = sorted[sorted.length - 1];
        const previous = sorted[sorted.length - 2];
        
        const latestWeight = latest.avg_weight_g ? parseFloat(latest.avg_weight_g) : 0;
        const prevWeight = previous.avg_weight_g ? parseFloat(previous.avg_weight_g) : 0;
        
        if (prevWeight > 0 && latest.sample_date && previous.sample_date) {
          const daysDiff = Math.floor(
            (new Date(latest.sample_date).getTime() - new Date(previous.sample_date).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysDiff > 0) {
            const weightGain = latestWeight - prevWeight;
            return (weightGain / prevWeight) * (7 / daysDiff) * 100; // Weekly growth rate
          }
        }
        return null;
      })()
    : null;

  // Get latest FCR from feeding summaries
  const latestFCR = feedingSummaries && feedingSummaries.length > 0
    ? (() => {
        const latest = feedingSummaries[feedingSummaries.length - 1];
        return latest.weighted_avg_fcr ? parseFloat(latest.weighted_avg_fcr) : null;
      })()
    : null;

  if (isLoading) {
    return <div>Loading batch details...</div>;
  }

  if (!batch) {
    return <div>Batch not found</div>;
  }

  const currentContainerId = batch.active_containers?.[0];
  const currentContainer = currentContainerId
    ? containers?.find((c) => c.id === currentContainerId)
    : null;

  // Determine if this batch has complex traceability based on actual data
  const hasMultipleAssignments = assignments && assignments.length > 5;
  const hasMultipleTransfers = transfers && transfers.length > 10;
  const isComplexBatch = hasMultipleAssignments && hasMultipleTransfers;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link href="/batch-management">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Batch Management</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{batch.batch_number}</h1>
          <p className="text-muted-foreground">
            {batch.species_name || 'Unknown Species'} • {batch.current_lifecycle_stage?.name || 'Unknown Stage'}
          </p>
        </div>
        <div className="ml-auto flex gap-2 flex-wrap">
          {isComplexBatch && (
            <Badge variant="secondary" className="text-purple-600">
              <Activity className="w-4 h-4 mr-1" />
              Complex Traceability
            </Badge>
          )}
          <Button variant="outline" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Population</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batch.calculated_population_count?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Initial population not available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Biomass</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(batch.calculated_biomass_kg ?? 0).toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground">
              Initial biomass not available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Age</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batch.start_date ? Math.floor((new Date().getTime() - new Date(batch.start_date).getTime()) / (1000 * 60 * 60 * 24)) : '0'} days
            </div>
            <p className="text-xs text-muted-foreground">
              Started {batch.start_date || 'Unknown'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Survival Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              100.0%
            </div>
            <p className="text-xs text-muted-foreground">
              Initial population not available
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {activeTab === "overview" && "Batch Overview"}
                  {activeTab === "containers" && "Containers"}
                  {activeTab === "health" && "Health"}
                  {activeTab === "feed-history" && "Feed History"}
                  {activeTab === "analytics" && "Analytics"}
                  {activeTab === "traceability" && (isComplexBatch ? "Full Traceability" : "Batch History")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Batch Overview</SelectItem>
                <SelectItem value="containers">Containers</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="feed-history">Feed History</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="traceability">
                  {isComplexBatch ? "Full Traceability" : "Batch History"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="containers">Containers</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="feed-history">Feed History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="traceability">
              {isComplexBatch ? "Traceability" : "History"}
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Information</CardTitle>
                    <CardDescription>General details and current status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Species</label>
                        <p className="font-medium">{batch.species_name || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Current Stage</label>
                        <Badge variant="outline">{batch.current_lifecycle_stage?.name || 'Unknown'}</Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Container</label>
                        <p className="font-medium">{currentContainer?.name || 'Multiple Containers'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <Badge variant={batch.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {batch.status || 'Unknown'}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Expected Harvest</label>
                        <p className="font-medium">{batch.expected_end_date || 'TBD'}</p>
                      </div>
                    </div>

                    {batch.notes && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Notes</label>
                        <p className="text-sm mt-1">{batch.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Production Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Average Weight</label>
                        <p className="text-lg lg:text-xl font-bold">
                          {batch.calculated_population_count && batch.calculated_biomass_kg && batch.calculated_population_count > 0
                            ? ((Number(batch.calculated_biomass_kg) * 1000) / batch.calculated_population_count).toFixed(2)
                            : '0.00'} g
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Growth Rate</label>
                        <p className="text-lg lg:text-xl font-bold text-green-600">
                          {growthRate !== null 
                            ? `${growthRate > 0 ? '+' : ''}${growthRate.toFixed(1)}% /week`
                            : formatFallback(null)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {growthSamples && growthSamples.length >= 2 
                            ? `Based on ${growthSamples.length} samples` 
                            : 'Insufficient growth samples'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Feed Conversion</label>
                        <p className="text-lg lg:text-xl font-bold">
                          {latestFCR !== null 
                            ? `${latestFCR.toFixed(2)} FCR`
                            : formatFallback(null)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {feedingSummaries && feedingSummaries.length > 0
                            ? `From ${feedingSummaries.length} period${feedingSummaries.length > 1 ? 's' : ''}`
                            : 'No feeding summaries'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Health Score</label>
                        <p className="text-lg lg:text-xl font-bold text-blue-600">
                          {formatFallback(null)}
                        </p>
                        <p className="text-xs text-muted-foreground">Health scoring not implemented</p>
                      </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

        <TabsContent value="containers" className="space-y-6">
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
                  <MapPin className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {assignments?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Container assignments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Biomass</CardTitle>
                  <Fish className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {assignments && assignments.length > 0
                      ? `${(assignments.reduce((sum: number, a: any) => sum + (Number(a.biomass_kg) || 0), 0) / 1000).toFixed(1)} t`
                      : "0.0 t"}
                  </div>
                  <p className="text-xs text-muted-foreground">Current stock</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Containers</CardTitle>
                  <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {assignments?.filter((a: any) => a.is_active).length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Currently operational</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Population</CardTitle>
                  <Fish className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {assignments && assignments.length > 0
                      ? formatCount(assignments.reduce((sum: number, a: any) => sum + (a.population_count || 0), 0))
                      : "0"}
                  </div>
                  <p className="text-xs text-muted-foreground">Total fish</p>
                </CardContent>
              </Card>
            </div>

            {/* Containers Grid */}
            {assignments && assignments.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((assignment: any, index: number) => {
                  // Extract container name from nested object or use fallback
                  const containerName = assignment.container?.name 
                    || assignment.container_name 
                    || `Container ${assignment.container_id || assignment.container || 'Unknown'}`;
                  
                  // Extract lifecycle stage name from nested object or use fallback
                  const lifecycleStageName = assignment.lifecycle_stage?.name 
                    || assignment.lifecycle_stage_name 
                    || 'Unknown';

                  // Calculate average weight (in kg)
                  const avgWeight = assignment.population_count && assignment.population_count > 0
                    ? Number(assignment.biomass_kg) / assignment.population_count
                    : 0;

                  return (
                    <Card key={`assignment-${assignment.id}-${index}`} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              <span className="mr-2">🌊</span>
                              {containerName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {lifecycleStageName} • Assigned {assignment.assignment_date ? new Date(assignment.assignment_date).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Badge variant={assignment.is_active ? "default" : "secondary"}>
                              {assignment.is_active ? "active" : "inactive"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Biomass</span>
                            <div className="font-semibold text-lg">
                              {assignment.biomass_kg ? `${Number(assignment.biomass_kg).toLocaleString()} kg` : '0 kg'}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Population</span>
                            <div className="font-semibold text-lg">
                              {assignment.population_count?.toLocaleString() || '0'}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg Weight</span>
                            <div className="font-medium">
                              {avgWeight > 0 ? `${avgWeight.toFixed(2)} kg` : '0.00 kg'}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Environment</span>
                            <Badge variant="outline" className="border-green-500 text-green-700">
                              optimal
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Capacity Utilization</span>
                            <span>0%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: '0%' }}></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Inspected {new Date().toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => window.location.href = `/infrastructure/containers/${assignment.container_id || assignment.container}`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No container assignments found</h3>
                  <p className="text-muted-foreground text-center">
                    This batch doesn't have any container assignments yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <BatchHealthView batchId={batch.id} batchName={batch.batch_number} />
        </TabsContent>

        <TabsContent value="feed-history" className="space-y-6">
          <BatchFeedHistoryView batchId={batch.id} batchName={batch.batch_number} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <BatchAnalyticsView batchId={batch.id} batchName={batch.batch_number} />
        </TabsContent>

        <TabsContent value="traceability">
          <BatchTraceabilityView batchId={batch.id} batchName={batch.batch_number} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

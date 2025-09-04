import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Fish, Calendar, Scale, TrendingUp, MoreVertical, Activity, Heart, Utensils, BarChart3, MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BatchTraceabilityView } from "@/components/batch-management/BatchTraceabilityView";
import { BatchHealthView } from "@/components/batch-management/BatchHealthView";
import { BatchFeedHistoryView } from "@/components/batch-management/BatchFeedHistoryView";
import { BatchAnalyticsView } from "@/components/batch-management/BatchAnalyticsView";
import { api } from "@/lib/api";

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
    queryFn: async () => (await api.infrastructure.getContainers()).results as Container[],
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
                        <p className="text-lg lg:text-xl font-bold text-green-600">+15.2% /week</p>
                        <p className="text-xs text-muted-foreground">Based on recent samples</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Feed Conversion</label>
                        <p className="text-lg lg:text-xl font-bold">1.23 FCR</p>
                        <p className="text-xs text-muted-foreground">Feed conversion ratio</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Health Score</label>
                        <p className="text-lg lg:text-xl font-bold text-blue-600">92/100</p>
                        <p className="text-xs text-muted-foreground">Overall health assessment</p>
                      </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

        <TabsContent value="containers" className="space-y-6">
          {assignments && assignments.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Container Assignments</h3>
                  <p className="text-sm text-muted-foreground">
                    Containers currently assigned to this batch
                  </p>
                </div>
                <Badge variant="outline">
                  {assignments.length} container{assignments.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((assignment: any) => {
                  const container = containers?.find(c => c.id === assignment.container);
                  return (
                    <Card key={assignment.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Fish className="h-4 w-4" />
                            {container?.name || `Container ${assignment.container}`}
                          </CardTitle>
                          <Badge variant={assignment.is_active ? "default" : "secondary"}>
                            {assignment.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <label className="text-muted-foreground">Population</label>
                            <p className="font-medium">{assignment.population_count?.toLocaleString() || '0'}</p>
                          </div>
                          <div>
                            <label className="text-muted-foreground">Biomass</label>
                            <p className="font-medium">{assignment.biomass_kg ? `${Number(assignment.biomass_kg).toFixed(1)} kg` : '0 kg'}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Lifecycle Stage</span>
                            <Badge variant="outline" className="text-xs">
                              {assignment.lifecycle_stage_name || assignment.lifecycle_stage || 'Unknown'}
                            </Badge>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Assigned Date</span>
                            <span className="text-sm font-medium">
                              {assignment.assignment_date ? new Date(assignment.assignment_date).toLocaleDateString() : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Container Assignments</h3>
                <p className="text-muted-foreground">
                  This batch doesn't have any container assignments yet.
                </p>
              </CardContent>
            </Card>
          )}
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

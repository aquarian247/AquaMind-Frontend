import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Fish, TrendingUp, TrendingDown, Activity, Beaker, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApiService } from "@/api/generated";
import { api } from "@/lib/api";

interface BatchTraceabilityViewProps {
  batchId: number;
  batchName: string;
  stages?: any[]; // Optional: passed from parent to avoid duplicate loading
  containers?: any[]; // Optional: passed from parent to avoid duplicate loading
}

export function BatchTraceabilityView({ batchId, batchName, stages: propStages, containers: propContainers }: BatchTraceabilityViewProps) {
  const [activeView, setActiveView] = useState("lifecycle");
  const [mortalityPage, setMortalityPage] = useState(1);
  const isMobile = useIsMobile();
  
  console.log('🔍 BatchTraceabilityView INIT:', { batchId, batchName, activeView });
  
  // Fetch ALL assignments (active + inactive) for historical view
  // Use the api helper that fetches all pages automatically
  const { data: assignmentsResponse, isLoading: isLoadingAssignments, error: assignmentsError } = useQuery({
    queryKey: ["batch/assignments/all-pages", batchId],
    queryFn: async () => {
      console.log('📡 Fetching ALL assignments (all pages) for batch:', batchId);
      const response = await api.batch.getAssignments(batchId);
      console.log('✅ Assignments fetched (ALL PAGES):', {
        total: response.count,
        resultsLength: response.results?.length || 0,
        firstResult: response.results?.[0],
        batchFieldType: response.results?.[0] ? typeof response.results[0].batch : 'N/A',
        batchFieldValue: response.results?.[0]?.batch,
        requestedBatchId: batchId,
      });
      return response;
    },
  });
  
  const assignments = assignmentsResponse?.results || [];

  // Fetch transfers for this batch
  const { data: transfers = [], isLoading: isLoadingTransfers, error: transfersError } = useQuery<any[]>({
    queryKey: ["batch/transfers", batchId],
    queryFn: async () => {
      console.log('📡 Fetching transfers for batch:', batchId);
      const response = await ApiService.apiV1BatchTransfersList(
        batchId,   // batch filter
        undefined, // batchIn
        undefined, // ordering
        undefined, // page
        undefined, // search
        undefined, // transferDate
        undefined, // transferDateAfter
        undefined, // transferDateBefore
        undefined  // transferType
      );
      console.log('✅ Transfers fetched:', {
        count: response.count,
        resultsLength: response.results?.length || 0,
      });
      return response.results || [];
    },
  });

  // Use stages and containers from props if available, otherwise fetch
  const { data: fetchedContainers, isLoading: isLoadingContainers, error: containersError } = useQuery<any[]>({
    queryKey: ["infrastructure/containers/all"],
    queryFn: async () => {
      console.log('📡 Fetching ALL containers (all pages)...');
      let allContainers: any[] = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore && page <= 100) {
        const response = await ApiService.apiV1InfrastructureContainersList(
          undefined, // active
          undefined, // area
          undefined, // areaIn
          undefined, // containerType
          undefined, // hall
          undefined, // hallIn
          undefined, // name
          undefined, // ordering
          page,      // page
          undefined  // search
        );
        allContainers = [...allContainers, ...(response.results || [])];
        hasMore = !!response.next;
        page++;
      }
      
      console.log('✅ Containers fetched (ALL PAGES):', {
        totalContainers: allContainers.length,
        pagesFetched: page - 1,
      });
      return allContainers;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    enabled: !propContainers || propContainers.length === 0, // Fetch if not provided OR if empty
  });

  // Use lifecycle stages from props if available, otherwise fetch
  // Note: Parent uses ["batch/lifecycle-stages"], so we use different key to avoid collision
  const { data: fetchedStages, isLoading: isLoadingStages, error: stagesError } = useQuery<any[]>({
    queryKey: ["batch/lifecycle-stages-traceability"],
    queryFn: async () => {
      console.log('📡 Fetching lifecycle stages (traceability view)...');
      const response = await ApiService.apiV1BatchLifecycleStagesList();
      console.log('✅ Stages fetched (traceability view):', {
        count: response.count,
        resultsLength: response.results?.length || 0,
      });
      return response.results || [];
    },
    enabled: !propStages || propStages.length === 0, // Fetch if not provided OR if empty
  });
  
  // Use props if they have content, otherwise use fetched data
  const containers = (propContainers && propContainers.length > 0) ? propContainers : (fetchedContainers || []);
  const stages = (propStages && propStages.length > 0) ? propStages : (fetchedStages || []);
  
  console.log('🔍 DATA SOURCE CHECK:', {
    containers: {
      source: (propContainers && propContainers.length > 0) ? 'props' : 'fetched',
      propLength: propContainers?.length || 0,
      fetchedLength: fetchedContainers?.length || 0,
      finalLength: containers.length,
    },
    stages: {
      source: (propStages && propStages.length > 0) ? 'props' : 'fetched',
      propLength: propStages?.length || 0,
      fetchedLength: fetchedStages?.length || 0,
      finalLength: stages.length,
    },
  });

  // ✅ USE AGGREGATION: Fetch ALL growth data via growth_analysis endpoint (1 call instead of 35!)
  const { data: growthAnalysis } = useQuery<any>({
    queryKey: ["batch/growth-analysis", batchId],
    queryFn: async () => {
      console.log('📡 Fetching growth analysis (aggregated) for batch:', batchId);
      const response = await ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId) as any;
      console.log('✅ Growth analysis fetched (SERVER-SIDE AGGREGATION):', {
        totalSamples: response.growth_metrics?.length || 0,
        startDate: response.start_date,
        currentAvgWeight: response.current_avg_weight,
        growthSummary: response.growth_summary,
      });
      return response;
    },
  });
  
  // Extract growth samples from aggregation response
  const growthSamples = growthAnalysis?.growth_metrics || [];

  // ✅ USE AGGREGATION: Fetch mortality metrics via performance_metrics endpoint (1 call instead of 286!)
  const { data: performanceMetrics, isLoading: isLoadingPerformance, error: performanceError } = useQuery<any>({
    queryKey: ["batch/performance-metrics", batchId],
    queryFn: async () => {
      console.log('📡 Fetching performance metrics (aggregated) for batch:', batchId);
      const response = await ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId) as any;
      console.log('✅ Performance metrics fetched (SERVER-SIDE AGGREGATION):', {
        totalMortality: response.mortality_metrics?.total_count || 0,
        mortalityRate: response.mortality_metrics?.mortality_rate || 0,
        causeBreakdown: response.mortality_metrics?.by_cause?.length || 0,
      });
      return response;
    },
  });
  
  // Fetch mortality events with pagination support
  const { data: mortalityEventsResponse, isLoading: isLoadingMortality, error: mortalityError } = useQuery<any>({
    queryKey: ["batch/mortality-events/paginated", batchId, mortalityPage],
    queryFn: async () => {
      console.log(`📡 Fetching mortality events page ${mortalityPage}`);
      
      const response = await ApiService.apiV1BatchMortalityEventsList(
        batchId, undefined, undefined, undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined, undefined, undefined, 
        mortalityPage, // Current page from state
        undefined
      );
      
      console.log(`✅ Mortality events page ${mortalityPage} fetched:`, {
        pageSize: response.results?.length || 0,
        total: response.count || 0,
        currentPage: mortalityPage,
      });
      
      return response;
    },
  });
  
  // Use aggregated metrics for stats, paginated events for detail table
  const mortalityEvents = mortalityEventsResponse?.results || [];
  const totalMortalityEvents = mortalityEventsResponse?.count || 0;
  const totalMortality = performanceMetrics?.mortality_metrics?.total_count || 0;
  const mortalityRateFromServer = performanceMetrics?.mortality_metrics?.mortality_rate || 0;
  
  // Calculate pagination info
  const pageSize = 20; // Django default
  const totalPages = Math.ceil(totalMortalityEvents / pageSize);
  const startRecord = (mortalityPage - 1) * pageSize + 1;
  const endRecord = Math.min(mortalityPage * pageSize, totalMortalityEvents);

  // Comprehensive loading and error state logging
  console.log('📊 HISTORY TAB DATA STATE:', {
    batchId,
    loading: {
      assignments: isLoadingAssignments,
      transfers: isLoadingTransfers,
      containers: isLoadingContainers,
      stages: isLoadingStages,
      growthAnalysis: !growthAnalysis,
      performanceMetrics: isLoadingPerformance,
      recentMortality: isLoadingMortality,
    },
    dataLengths: {
      assignments: assignments.length,
      transfers: transfers.length,
      containers: containers.length,
      stages: stages.length,
      growthSamples: growthSamples.length,
      mortalityEvents: mortalityEvents.length,
    },
    errors: {
      assignments: assignmentsError,
      transfers: transfersError,
      containers: containersError,
      stages: stagesError,
      performance: performanceError,
      mortality: mortalityError,
    },
  });

  // Loading state check - wait for core data only
  if (isLoadingAssignments || isLoadingContainers || isLoadingStages || isLoadingPerformance) {
    console.log('⏳ Still loading core data...');
    return <div>Loading traceability data...</div>;
  }

  // Error state check
  if (assignmentsError || containersError || stagesError || performanceError) {
    console.error('❌ Error loading traceability data:', {
      assignmentsError,
      containersError,
      stagesError,
      performanceError,
    });
    return <div>Error loading traceability data. Check console for details.</div>;
  }

  // Empty data check - CRITICAL: Check for actual content, not just truthy values
  // stages || [] is always truthy, but we need stages.length > 0
  if (!assignments || !containers || !stages || stages.length === 0) {
    console.warn('⚠️ Missing required data:', { 
      hasAssignments: !!assignments, 
      hasContainers: !!containers, 
      hasStages: !!stages,
      stagesLength: stages?.length || 0,
    });
    return <div>Loading traceability data...</div>;
  }

  // Filter data for this batch
  // Note: batch can be either an object {id: 206, ...} or just the ID 206
  const batchAssignments = assignments.filter((a: any) => 
    (typeof a.batch === 'object' ? a.batch?.id : a.batch) === batchId
  );
  const batchTransfers = transfers?.filter((t: any) => 
    (typeof t.batch === 'object' ? t.batch?.id : t.batch) === batchId
  ) || [];
  
  // Note: growthSamples and mortalityEvents are already filtered by batch from aggregation endpoints
  // No need to filter them again
  
  // ✅ Use server-calculated mortality rate (define early to avoid reference errors)
  const mortalityRate = mortalityRateFromServer;

  console.log('🔍 FILTERED BATCH DATA:', {
    batchId,
    batchAssignments: batchAssignments.length,
    batchTransfers: batchTransfers.length,
    growthSamples: growthSamples.length,
    recentMortalityEvents: mortalityEvents.length,
    totalMortalityFromServer: totalMortality,
    mortalityRateFromServer: mortalityRateFromServer,
    sampleAssignment: batchAssignments[0],
    sampleGrowthMetric: growthSamples[0],
  });

  // Group assignments by lifecycle stage
  const assignmentsByStage = batchAssignments.reduce((acc: any, assignment: any) => {
    // Handle nested lifecycle_stage object or ID
    const stageId = typeof assignment.lifecycle_stage === 'object' 
      ? assignment.lifecycle_stage?.id 
      : assignment.lifecycle_stage;
    const stage = stages.find((s: any) => s.id === stageId);
    
    // Debug: Log grouping issues
    if (!stage) {
      console.warn('⚠️ Stage not found for assignment:', {
        assignmentId: assignment.id,
        stageId,
        lifecycleStageField: assignment.lifecycle_stage,
        availableStages: stages.map(s => ({ id: s.id, name: s.name })),
      });
    }
    
    if (stage) {
      if (!acc[stage.name]) {
        acc[stage.name] = [];
      }
      // Handle nested container object or ID
      const containerId = typeof assignment.container === 'object'
        ? assignment.container?.id
        : assignment.container;
      const containerName = containers.find((c: any) => c.id === containerId)?.name || 'Unknown';
      
      acc[stage.name].push({
        ...assignment,
        containerName,
        stageName: stage.name,
      });
    }
    return acc;
  }, {});

  // Create lifecycle progression chart data
  const lifecycleData = Object.keys(assignmentsByStage).map(stageName => {
    const stageAssignments = assignmentsByStage[stageName];
    const totalPopulation = stageAssignments.reduce((sum: number, a: any) => 
      sum + (a.population_count || 0), 0
    );
    const totalBiomass = stageAssignments.reduce((sum: number, a: any) => 
      sum + parseFloat(a.biomass_kg || 0), 0
    );
    const avgWeight = totalBiomass > 0 ? (totalBiomass * 1000) / totalPopulation : 0;
    
    return {
      stage: stageName,
      population: totalPopulation,
      biomassKg: totalBiomass,
      avgWeightG: avgWeight,
      containers: stageAssignments.length,
    };
  });
  
  console.log('📊 LIFECYCLE DATA FOR CHART:', {
    assignmentsByStageKeys: Object.keys(assignmentsByStage),
    lifecycleDataLength: lifecycleData.length,
    lifecycleData,
  });

  // Create growth trend data from aggregated growth metrics
  const growthTrendData = growthSamples
    .sort((a: any, b: any) => new Date(a.date || a.sample_date).getTime() - new Date(b.date || b.sample_date).getTime())
    .map((sample: any, index: number) => ({
      week: `Week ${index + 1}`,
      avgWeight: parseFloat(sample.avg_weight_g || 0),
      conditionFactor: parseFloat(sample.condition_factor || 0),
      sampleDate: sample.date || sample.sample_date,
    }));

  // Calculate transfer efficiency
  const transferStats = batchTransfers.reduce((acc: any, transfer: any) => {
    acc.totalTransfers++;
    acc.totalPopulationMoved += transfer.transferred_count || 0;
    // Calculate percentage if we have source count
    const percentage = transfer.source_count > 0 
      ? (transfer.transferred_count / transfer.source_count) * 100
      : 0;
    acc.avgTransferPercentage += percentage;
    return acc;
  }, { totalTransfers: 0, totalPopulationMoved: 0, avgTransferPercentage: 0 });

  if (transferStats.totalTransfers > 0) {
    transferStats.avgTransferPercentage /= transferStats.totalTransfers;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Batch Traceability: {batchName}</h2>
          <p className="text-muted-foreground">Complete lifecycle tracking and analysis</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-blue-600">
            <Fish className="w-4 h-4 mr-1" />
            {lifecycleData.length} Life Stages
          </Badge>
          <Badge variant="outline" className="text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            {batchAssignments.length} Container Assignments
          </Badge>
        </div>
      </div>

      {/* Loading placeholder when core datasets have not been retrieved yet.
          Tests rely on this visible text to verify graceful handling of failures. */}
      {(assignments.length === 0 || containers.length === 0 || stages.length === 0) && (
        <div>Loading traceability data...</div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Population</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lifecycleData.length > 0 ? lifecycleData[lifecycleData.length - 1].population.toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {batchAssignments.filter((a: any) => a.is_active).length} active containers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transferStats.totalTransfers}</div>
            <p className="text-xs text-muted-foreground">
              Avg {transferStats.avgTransferPercentage.toFixed(1)}% per transfer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Samples</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{growthAnalysis?.growth_summary?.total_samples || growthSamples.length}</div>
            <p className="text-xs text-muted-foreground">
              Biological monitoring points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mortality Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mortalityRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalMortality.toLocaleString()} total mortality events
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeView} onValueChange={setActiveView}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {activeView === "lifecycle" && "Lifecycle Progression"}
                  {activeView === "assignments" && "Container Assignments"}
                  {activeView === "transfers" && "Transfer History"}
                  {activeView === "growth" && "Growth Analysis"}
                  {activeView === "mortality" && "Mortality Events"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lifecycle">Lifecycle Progression</SelectItem>
                <SelectItem value="assignments">Container Assignments</SelectItem>
                <SelectItem value="transfers">Transfer History</SelectItem>
                <SelectItem value="growth">Growth Analysis</SelectItem>
                <SelectItem value="mortality">Mortality Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="lifecycle">Lifecycle Progression</TabsTrigger>
            <TabsTrigger value="assignments">Container Assignments</TabsTrigger>
            <TabsTrigger value="transfers">Transfer History</TabsTrigger>
            <TabsTrigger value="growth">Growth Analysis</TabsTrigger>
            <TabsTrigger value="mortality">Mortality Events</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="lifecycle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Stage Progression</CardTitle>
              <CardDescription>Population and biomass distribution across life stages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lifecycleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="population" fill="#3b82f6" name="Population" />
                  <Bar yAxisId="right" dataKey="avgWeightG" fill="#10b981" name="Avg Weight (g)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(assignmentsByStage).map(([stageName, assignments]: [string, any]) => (
              <Card key={stageName}>
                <CardHeader>
                  <CardTitle className="text-lg">{stageName} Stage</CardTitle>
                  <CardDescription>{assignments.length} container assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Population:</span>
                      <span className="font-medium">
                        {assignments.reduce((sum: number, a: any) => sum + (a.population_count || 0), 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Biomass:</span>
                      <span className="font-medium">
                        {assignments.reduce((sum: number, a: any) => sum + parseFloat(a.biomass_kg || 0), 0).toFixed(2)} kg
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active Containers:</span>
                      <span className="font-medium">
                        {assignments.filter((a: any) => a.is_active).length} / {assignments.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Container Assignment History</CardTitle>
              <CardDescription>Detailed tracking of batch distribution across containers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Container</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Biomass (kg)</TableHead>
                    <TableHead>Assignment Date</TableHead>
                    <TableHead>Departure Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchAssignments
                    .sort((a: any, b: any) => new Date(a.assignment_date).getTime() - new Date(b.assignment_date).getTime())
                    .map((assignment: any) => {
                      // Handle nested container object or ID
                      const containerObj = typeof assignment.container === 'object' 
                        ? assignment.container 
                        : containers.find((c: any) => c.id === assignment.container);
                      
                      // Handle nested lifecycle_stage object or ID
                      const stageObj = typeof assignment.lifecycle_stage === 'object'
                        ? assignment.lifecycle_stage
                        : stages.find((s: any) => s.id === assignment.lifecycle_stage);
                      
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">
                            {containerObj?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {stageObj?.name || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>{assignment.population_count?.toLocaleString() || '0'}</TableCell>
                          <TableCell>{parseFloat(assignment.biomass_kg || 0).toFixed(2)}</TableCell>
                          <TableCell>{assignment.assignment_date}</TableCell>
                          <TableCell>{assignment.departure_date || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={assignment.is_active ? "default" : "secondary"}>
                              {assignment.is_active ? "Active" : "Departed"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          {batchTransfers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Activity className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Transfer Records</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  This batch has no transfer history. Fish have remained in their original containers or transfers have not been recorded.
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  Total Transfers: <span className="font-medium">0</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Transfer History</CardTitle>
                <CardDescription>Batch movement between containers and stages ({batchTransfers.length} transfers)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transfer Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From Container</TableHead>
                      <TableHead>To Container</TableHead>
                      <TableHead>Population</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                    batchTransfers
                      .sort((a: any, b: any) => new Date(a.transfer_date).getTime() - new Date(b.transfer_date).getTime())
                      .map((transfer: any) => {
                      // Handle nested source/dest assignment objects
                      const sourceContainer = transfer.source_assignment_info?.container?.name || 'Unknown';
                      const destContainer = transfer.destination_assignment_info?.container?.name || 'Unknown';
                      const percentage = transfer.source_count > 0 
                        ? ((transfer.transferred_count / transfer.source_count) * 100).toFixed(1)
                        : '0.0';
                      
                      return (
                        <TableRow key={transfer.id}>
                          <TableCell>{transfer.transfer_date}</TableCell>
                          <TableCell>
                            <Badge variant={transfer.transfer_type === "SPLIT" ? "outline" : "default"}>
                              {transfer.transfer_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{sourceContainer}</TableCell>
                          <TableCell>{destContainer}</TableCell>
                          <TableCell>{(transfer.transferred_count || 0).toLocaleString()}</TableCell>
                          <TableCell>{percentage}%</TableCell>
                          <TableCell className="max-w-xs truncate">{transfer.notes || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Performance Analysis</CardTitle>
              <CardDescription>Biological development tracking over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="avgWeight" stroke="#3b82f6" name="Average Weight (g)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="conditionFactor" stroke="#10b981" name="Condition Factor" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Sample Details</CardTitle>
              <CardDescription>Individual sampling records and measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample Date</TableHead>
                    <TableHead>Container</TableHead>
                    <TableHead>Sample Size</TableHead>
                    <TableHead>Avg Weight (g)</TableHead>
                    <TableHead>Avg Length (cm)</TableHead>
                    <TableHead>Condition Factor</TableHead>
                    <TableHead>Sampled By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {growthSamples.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No growth samples for this batch
                      </TableCell>
                    </TableRow>
                  ) : (
                    growthSamples
                      .sort((a: any, b: any) => new Date(b.date || b.sample_date).getTime() - new Date(a.date || a.sample_date).getTime())
                      .slice(0, 10) // Show latest 10 samples in detail table
                      .map((sample: any, idx: number) => {
                      return (
                        <TableRow key={sample.id || idx}>
                          <TableCell>{sample.date || sample.sample_date}</TableCell>
                          <TableCell>Multiple</TableCell>
                          <TableCell>{sample.sample_size || '-'}</TableCell>
                          <TableCell>{parseFloat(sample.avg_weight_g || 0).toFixed(2)}</TableCell>
                          <TableCell>{parseFloat(sample.avg_length_cm || 0).toFixed(1)}</TableCell>
                          <TableCell>{parseFloat(sample.condition_factor || 0).toFixed(2)}</TableCell>
                          <TableCell className="text-xs">System</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mortality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mortality Event Analysis</CardTitle>
              <CardDescription>
                {totalMortalityEvents > 0 
                  ? `Showing records ${startRecord.toLocaleString()}-${endRecord.toLocaleString()} of ${totalMortalityEvents.toLocaleString()} total events (Page ${mortalityPage} of ${totalPages})`
                  : 'Health monitoring and loss tracking'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Container</TableHead>
                    <TableHead>Mortality Count</TableHead>
                    <TableHead>Cause</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Biomass Lost</TableHead>
                    <TableHead>Recorded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mortalityEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No mortality events for this batch
                      </TableCell>
                    </TableRow>
                  ) : (
                    mortalityEvents
                      .sort((a: any, b: any) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
                      .map((event: any) => {
                      // Mortality events have container_info which might be null
                      const containerName = event.container_info?.name || 'N/A';
                      
                      return (
                        <TableRow key={event.id}>
                          <TableCell>{event.event_date}</TableCell>
                          <TableCell>{containerName}</TableCell>
                          <TableCell>
                            <span className="text-red-600 font-medium">{(event.count || 0).toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.cause_display || event.cause || 'Unknown'}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{event.description || '-'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {event.biomass_kg ? `${parseFloat(event.biomass_kg).toFixed(2)} kg lost` : '-'}
                          </TableCell>
                          <TableCell className="text-xs">{new Date(event.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              {totalMortalityEvents > 0 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {startRecord.toLocaleString()}-{endRecord.toLocaleString()} of {totalMortalityEvents.toLocaleString()} events
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMortalityPage(p => Math.max(1, p - 1))}
                      disabled={mortalityPage === 1 || isLoadingMortality}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    {/* Page Number Input */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Page</span>
                      <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={mortalityPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page >= 1 && page <= totalPages) {
                            setMortalityPage(page);
                          }
                        }}
                        className="w-16 text-center"
                        disabled={isLoadingMortality}
                      />
                      <span className="text-sm">of {totalPages}</span>
                    </div>
                    
                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMortalityPage(p => Math.min(totalPages, p + 1))}
                      disabled={mortalityPage === totalPages || isLoadingMortality}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

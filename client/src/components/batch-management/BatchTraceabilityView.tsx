import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Fish, TrendingUp, TrendingDown, Activity, Beaker, AlertTriangle } from "lucide-react";

interface BatchTraceabilityViewProps {
  batchId: number;
  batchName: string;
}

export function BatchTraceabilityView({ batchId, batchName }: BatchTraceabilityViewProps) {
  const { data: assignments } = useQuery({
    queryKey: ["/api/batch-container-assignments", batchId],
    queryFn: () => fetch(`/api/batch-container-assignments?batchId=${batchId}`).then(res => res.json()),
  });

  const { data: transfers } = useQuery({
    queryKey: ["/api/batch-transfers", batchId],
    queryFn: () => fetch(`/api/batch-transfers?batchId=${batchId}`).then(res => res.json()),
  });

  const { data: containers } = useQuery({
    queryKey: ["/api/containers"],
    queryFn: () => fetch("/api/containers").then(res => res.json()),
  });

  const { data: stages } = useQuery({
    queryKey: ["/api/stages"],
    queryFn: () => fetch("/api/stages").then(res => res.json()),
  });

  const { data: growthSamples } = useQuery({
    queryKey: ["/api/growth-samples"],
    queryFn: () => fetch("/api/growth-samples").then(res => res.json()),
  });

  const { data: mortalityEvents } = useQuery({
    queryKey: ["/api/mortality-events"],
    queryFn: () => fetch("/api/mortality-events").then(res => res.json()),
  });

  if (!assignments || !containers || !stages) {
    return <div>Loading traceability data...</div>;
  }

  // Filter data for this batch
  const batchAssignments = assignments.filter((a: any) => a.batch === batchId);
  const batchTransfers = transfers?.filter((t: any) => t.batch === batchId) || [];
  const batchGrowthSamples = growthSamples?.filter((s: any) => 
    batchAssignments.some((a: any) => a.id === s.containerAssignment)
  ) || [];
  const batchMortalityEvents = mortalityEvents?.filter((e: any) => 
    batchAssignments.some((a: any) => a.id === e.containerAssignment)
  ) || [];

  // Group assignments by lifecycle stage
  const assignmentsByStage = batchAssignments.reduce((acc: any, assignment: any) => {
    const stage = stages.find((s: any) => s.id === assignment.lifecycleStage);
    if (stage) {
      if (!acc[stage.name]) {
        acc[stage.name] = [];
      }
      acc[stage.name].push({
        ...assignment,
        containerName: containers.find((c: any) => c.id === assignment.container)?.name || 'Unknown',
        stageName: stage.name,
      });
    }
    return acc;
  }, {});

  // Create lifecycle progression chart data
  const lifecycleData = Object.keys(assignmentsByStage).map(stageName => {
    const stageAssignments = assignmentsByStage[stageName];
    const totalPopulation = stageAssignments.reduce((sum: number, a: any) => sum + a.populationCount, 0);
    const totalBiomass = stageAssignments.reduce((sum: number, a: any) => sum + parseFloat(a.biomassKg), 0);
    const avgWeight = totalBiomass > 0 ? (totalBiomass * 1000) / totalPopulation : 0;
    
    return {
      stage: stageName,
      population: totalPopulation,
      biomassKg: totalBiomass,
      avgWeightG: avgWeight,
      containers: stageAssignments.length,
    };
  });

  // Create growth trend data
  const growthTrendData = batchGrowthSamples
    .sort((a: any, b: any) => new Date(a.sampleDate).getTime() - new Date(b.sampleDate).getTime())
    .map((sample: any, index: number) => ({
      week: `Week ${index + 1}`,
      avgWeight: parseFloat(sample.avgWeightG),
      conditionFactor: parseFloat(sample.conditionFactor || "0"),
      sampleDate: sample.sampleDate,
    }));

  // Calculate transfer efficiency
  const transferStats = batchTransfers.reduce((acc: any, transfer: any) => {
    acc.totalTransfers++;
    acc.totalPopulationMoved += transfer.populationCount;
    acc.avgTransferPercentage += parseFloat(transfer.transferPercentage || "0");
    return acc;
  }, { totalTransfers: 0, totalPopulationMoved: 0, avgTransferPercentage: 0 });

  if (transferStats.totalTransfers > 0) {
    transferStats.avgTransferPercentage /= transferStats.totalTransfers;
  }

  // Calculate mortality rate
  const totalMortality = batchMortalityEvents.reduce((sum: number, event: any) => sum + event.mortalityCount, 0);
  const initialPopulation = lifecycleData.length > 0 ? lifecycleData[0].population : 0;
  const mortalityRate = initialPopulation > 0 ? (totalMortality / initialPopulation) * 100 : 0;

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
              Across {batchAssignments.filter((a: any) => a.isActive).length} active containers
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
            <div className="text-2xl font-bold">{batchGrowthSamples.length}</div>
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

      <Tabs defaultValue="lifecycle" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lifecycle">Lifecycle Progression</TabsTrigger>
          <TabsTrigger value="assignments">Container Assignments</TabsTrigger>
          <TabsTrigger value="transfers">Transfer History</TabsTrigger>
          <TabsTrigger value="growth">Growth Analysis</TabsTrigger>
          <TabsTrigger value="mortality">Mortality Events</TabsTrigger>
        </TabsList>

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
                        {assignments.reduce((sum: number, a: any) => sum + a.populationCount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Biomass:</span>
                      <span className="font-medium">
                        {assignments.reduce((sum: number, a: any) => sum + parseFloat(a.biomassKg), 0).toFixed(2)} kg
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active Containers:</span>
                      <span className="font-medium">
                        {assignments.filter((a: any) => a.isActive).length} / {assignments.length}
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
                    .sort((a: any, b: any) => new Date(a.assignmentDate).getTime() - new Date(b.assignmentDate).getTime())
                    .map((assignment: any) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {containers.find((c: any) => c.id === assignment.container)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {stages.find((s: any) => s.id === assignment.lifecycleStage)?.name || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.populationCount.toLocaleString()}</TableCell>
                      <TableCell>{parseFloat(assignment.biomassKg).toFixed(2)}</TableCell>
                      <TableCell>{assignment.assignmentDate}</TableCell>
                      <TableCell>{assignment.departureDate || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={assignment.isActive ? "default" : "secondary"}>
                          {assignment.isActive ? "Active" : "Departed"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transfer History</CardTitle>
              <CardDescription>Batch movement between containers and stages</CardDescription>
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
                  {batchTransfers
                    .sort((a: any, b: any) => new Date(a.transferDate).getTime() - new Date(b.transferDate).getTime())
                    .map((transfer: any) => {
                    const fromAssignment = batchAssignments.find((a: any) => a.id === transfer.fromContainerAssignment);
                    const toAssignment = batchAssignments.find((a: any) => a.id === transfer.toContainerAssignment);
                    const fromContainer = containers.find((c: any) => c.id === fromAssignment?.container);
                    const toContainer = containers.find((c: any) => c.id === toAssignment?.container);
                    
                    return (
                      <TableRow key={transfer.id}>
                        <TableCell>{transfer.transferDate}</TableCell>
                        <TableCell>
                          <Badge variant={transfer.transferType === "SPLIT" ? "outline" : "default"}>
                            {transfer.transferType}
                          </Badge>
                        </TableCell>
                        <TableCell>{fromContainer?.name || 'Unknown'}</TableCell>
                        <TableCell>{toContainer?.name || 'Unknown'}</TableCell>
                        <TableCell>{transfer.populationCount.toLocaleString()}</TableCell>
                        <TableCell>{parseFloat(transfer.transferPercentage || "0").toFixed(1)}%</TableCell>
                        <TableCell className="max-w-xs truncate">{transfer.reason}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                  {batchGrowthSamples
                    .sort((a: any, b: any) => new Date(b.sampleDate).getTime() - new Date(a.sampleDate).getTime())
                    .slice(0, 10) // Show latest 10 samples
                    .map((sample: any) => {
                    const assignment = batchAssignments.find((a: any) => a.id === sample.containerAssignment);
                    const container = containers.find((c: any) => c.id === assignment?.container);
                    
                    return (
                      <TableRow key={sample.id}>
                        <TableCell>{sample.sampleDate}</TableCell>
                        <TableCell>{container?.name || 'Unknown'}</TableCell>
                        <TableCell>{sample.sampleSize}</TableCell>
                        <TableCell>{parseFloat(sample.avgWeightG).toFixed(2)}</TableCell>
                        <TableCell>{parseFloat(sample.avgLengthCm || "0").toFixed(1)}</TableCell>
                        <TableCell>{parseFloat(sample.conditionFactor || "0").toFixed(2)}</TableCell>
                        <TableCell>User {sample.sampledBy}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mortality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mortality Event Analysis</CardTitle>
              <CardDescription>Health monitoring and loss tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Container</TableHead>
                    <TableHead>Mortality Count</TableHead>
                    <TableHead>Cause</TableHead>
                    <TableHead>Investigation</TableHead>
                    <TableHead>Preventive Measures</TableHead>
                    <TableHead>Reported By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchMortalityEvents
                    .sort((a: any, b: any) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
                    .map((event: any) => {
                    const assignment = batchAssignments.find((a: any) => a.id === event.containerAssignment);
                    const container = containers.find((c: any) => c.id === assignment?.container);
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell>{event.eventDate}</TableCell>
                        <TableCell>{container?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <span className="text-red-600 font-medium">{event.mortalityCount.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>{event.cause}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.investigation}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.preventiveMeasures}</TableCell>
                        <TableCell>User {event.reportedBy}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
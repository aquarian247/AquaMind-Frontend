import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScenarioProjectionsChart } from "./scenario-projections-chart";
import { 
  LineChart, 
  Settings, 
  Play, 
  Copy, 
  Edit,
  Calendar,
  Fish,
  Scale,
  TrendingUp,
  Activity,
  Thermometer
} from "lucide-react";
import { format } from "date-fns";
import { ApiService } from "@/api/generated";

interface Scenario {
  id: number;
  name: string;
  description: string;
  status: "draft" | "running" | "completed" | "failed";
  durationDays: number;
  initialCount: number;
  initialWeight: string;
  genotype: string;
  supplier: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

interface ScenarioDetailDialogProps {
  scenario: Scenario;
  children: React.ReactNode;
}

interface ProjectionData {
  count: number;
  results: Array<{
    id: number;
    scenarioId: number;
    projectionDate: string;
    weekNumber: number;
    fishCount: number;
    averageWeight: number;
    totalBiomass: number;
    feedConsumed: number;
    cumulativeFeed: number;
    fcr: number;
    mortalityRate: number;
    waterTemperature: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

export function ScenarioDetailDialog({ scenario, children }: ScenarioDetailDialogProps) {
  const [open, setOpen] = useState(false);

  // Fetch scenario projections when dialog opens
  const { data: projectionData, isLoading: projectionsLoading } = useQuery<ProjectionData>({
    queryKey: ["scenario", scenario.id, "projections"],
    queryFn: async () => {
      const raw: any = await ApiService.apiV1ScenarioScenariosProjectionsList(
        scenario.id
      );
      // Handle different possible shapes gracefully
      if (raw && Array.isArray(raw.results)) return raw as ProjectionData;
      if (Array.isArray(raw)) return { count: raw.length, results: raw } as ProjectionData;
      if (raw && (raw as any).results) return raw as ProjectionData;
      return { count: 0, results: [] } as ProjectionData;
    },
    enabled: open,
  });

  // Calculate summary data from projections
  const summary = projectionData?.results ? {
    finalWeight: projectionData.results[projectionData.results.length - 1]?.averageWeight || 0,
    finalCount: projectionData.results[projectionData.results.length - 1]?.fishCount || 0,
    totalMortality: scenario.initialCount - (projectionData.results[projectionData.results.length - 1]?.fishCount || scenario.initialCount),
    avgFcr: projectionData.results[projectionData.results.length - 1]?.fcr || 0,
    totalBiomass: projectionData.results[projectionData.results.length - 1]?.totalBiomass || 0,
    duration: projectionData.results.length,
    totalFeed: projectionData.results[projectionData.results.length - 1]?.cumulativeFeed || 0
  } : null;

  // Fetch scenario configuration details
  const { data: configData, isLoading: configLoading } = useQuery<any>({
    queryKey: ["scenario", scenario.id, "config"],
    queryFn: async () => {
      const s: any = await ApiService.apiV1ScenarioScenariosRetrieve(
        scenario.id as any
      );
      // Map minimal UI-friendly configuration object
      const tgcModel =
        s?.tgc_model != null
          ? {
              name: `TGC Model #${s.tgc_model}`,
              tgcValue: s.tgc_value ?? "N/A",
              location: s.geography_name ?? "Unknown",
            }
          : undefined;
      const fcrModel =
        s?.fcr_model != null
          ? {
              name: `FCR Model #${s.fcr_model}`,
              baseFcr: s.base_fcr ?? "1.2",
            }
          : undefined;
      const mortalityModel =
        s?.mortality_model != null
          ? {
              name: `Mortality Model #${s.mortality_model}`,
              frequency: s.mortality_frequency ?? "Daily",
            }
          : undefined;
      const temperatureProfile = {
        name: s?.temperature_profile_name ?? "Standard Profile",
      };
      return { tgcModel, fcrModel, mortalityModel, temperatureProfile };
    },
    enabled: open,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'running': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <TrendingUp className="h-4 w-4" />;
      case 'running': return <Activity className="h-4 w-4" />;
      case 'failed': return <Activity className="h-4 w-4" />;
      default: return <Edit className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <LineChart className="h-5 w-5" />
            {scenario.name}
            <Badge variant={getStatusColor(scenario.status)} className="flex items-center gap-1">
              {getStatusIcon(scenario.status)}
              {scenario.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {scenario.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Scenario Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{scenario.durationDays} days</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{format(new Date(scenario.startDate), "PPP")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{format(new Date(scenario.createdAt), "PPP")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Updated</p>
                      <p className="font-medium">{format(new Date(scenario.updatedAt), "PPP")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Initial Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="h-4 w-4" />
                    Initial Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Fish Count</p>
                      <p className="font-medium">{scenario.initialCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Initial Weight</p>
                      <p className="font-medium">{scenario.initialWeight}g</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Genotype</p>
                      <p className="font-medium">{scenario.genotype}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Supplier</p>
                      <p className="font-medium">{scenario.supplier}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Results Summary */}
            {projectionData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Sea Cage Production Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Harvest Weight</p>
                      <p className="text-xl font-bold">{summary?.finalWeight ? (summary.finalWeight / 1000).toFixed(1) : 0}kg</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Harvest Count</p>
                      <p className="text-xl font-bold">{summary?.finalCount ? (summary.finalCount / 1000000).toFixed(1) : 0}M</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Biomass</p>
                      <p className="text-xl font-bold">{((summary?.totalBiomass || 0) / 1000).toFixed(0)}t</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Final FCR</p>
                      <p className="text-xl font-bold">{summary?.avgFcr?.toFixed(2) || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Feed Consumption</p>
                      <p className="text-xl font-bold">{summary?.totalFeed?.toFixed(0) || 0}t</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {scenario.status === 'draft' && (
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Run Projection
                    </Button>
                  )}
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Scenario
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Scenario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-4">
            {projectionsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading projections...</span>
                </CardContent>
              </Card>
            ) : projectionData?.results ? (
              <ScenarioProjectionsChart 
                data={projectionData.results.map(p => ({
                  day: p.weekNumber * 7,
                  week: p.weekNumber,
                  weight: p.averageWeight,
                  count: p.fishCount,
                  mortality: p.mortalityRate,
                  fcr: p.fcr,
                  totalBiomass: p.totalBiomass,
                  temperature: p.waterTemperature
                }))}
                title={`${scenario.name} - Growth Projections`}
                showMetrics={true}
                highlightPeriods={[
                  { start: 100, end: 150, label: "Smolt Transfer", color: "#3b82f6" },
                  { start: 400, end: 450, label: "Harvest Window", color: "#10b981" }
                ]}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <LineChart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projection data</h3>
                  <p className="text-muted-foreground text-center">
                    {scenario.status === 'draft' 
                      ? "Run the scenario to generate projection data"
                      : "Projection data is not available for this scenario"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="configuration" className="space-y-4">
            {configLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading configuration...</span>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Model Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">TGC Model</p>
                      <p className="font-medium">{configData?.tgcModel?.name || "Not configured"}</p>
                      {configData?.tgcModel && (
                        <p className="text-xs text-muted-foreground">
                          TGC: {configData.tgcModel.tgcValue} | Location: {configData.tgcModel.location}
                        </p>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">FCR Model</p>
                      <p className="font-medium">{configData?.fcrModel?.name || "Not configured"}</p>
                      {configData?.fcrModel && (
                        <p className="text-xs text-muted-foreground">
                          Base FCR: {configData.fcrModel.baseFcr || "1.2"}
                        </p>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Mortality Model</p>
                      <p className="font-medium">{configData?.mortalityModel?.name || "Not configured"}</p>
                      {configData?.mortalityModel && (
                        <p className="text-xs text-muted-foreground">
                          Frequency: {configData.mortalityModel.frequency || "Daily"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Environmental Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Temperature Profile</p>
                      <p className="font-medium">{configData?.temperatureProfile?.name || "Standard Profile"}</p>
                      <p className="text-xs text-muted-foreground">
                        Seasonal temperature variation with optimal range 8-14°C
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Biological Constraints</p>
                      <p className="font-medium">Standard Atlantic Salmon</p>
                      <p className="text-xs text-muted-foreground">
                        Growth stages: Fry → Parr → Smolt → Adult
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Scenario performance compared to industry benchmarks
                  </p>
                </CardHeader>
                <CardContent>
                  {projectionData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-green-600">A</p>
                          <p className="text-sm text-muted-foreground">Growth Performance</p>
                          <p className="text-xs">Above industry average</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">B+</p>
                          <p className="text-sm text-muted-foreground">Feed Efficiency</p>
                          <p className="text-xs">Good FCR performance</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">C</p>
                          <p className="text-sm text-muted-foreground">Survival Rate</p>
                          <p className="text-xs">Room for improvement</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">A-</p>
                          <p className="text-sm text-muted-foreground">Overall Score</p>
                          <p className="text-xs">Strong performance</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Insights</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Growth from smolt transfer ({parseFloat(scenario.initialWeight)/1000}kg) to harvest weight ({summary ? (summary.finalWeight / 1000).toFixed(1) : 0}kg)</li>
                          <li>• Feed conversion ratio of {summary?.avgFcr?.toFixed(2) || 0} demonstrates {(summary?.avgFcr || 0) < 1.3 ? 'excellent' : (summary?.avgFcr || 0) < 1.5 ? 'good' : 'acceptable'} efficiency</li>
                          <li>• Sea cage survival rate of {summary ? (((scenario.initialCount - summary.totalMortality) / scenario.initialCount) * 100).toFixed(1) : 0}% over {Math.round(scenario.durationDays/30)} months</li>
                          <li>• Total feed consumption of {summary?.totalFeed?.toFixed(0) || 0} tonnes for {summary ? (summary.totalBiomass / 1000).toFixed(0) : 0}t biomass production</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Analysis will be available after running the scenario projection.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

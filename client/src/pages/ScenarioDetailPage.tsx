import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Users, Target, TrendingUp, Settings, BarChart3, Thermometer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScenarioProjectionsChart } from "@/components/scenario/scenario-projections-chart";
import { ScenarioPlannedActivitiesSummary } from "@/features/production-planner/components/ScenarioPlannedActivitiesSummary";
// Temperature data view will be implemented inline

// Define interfaces for API response types
interface TGCModel {
  id: number;
  name: string;
  location: string;
  tgc_value: string;
  release_period?: string;
}

interface FCRModel {
  id: number;
  name: string;
  description: string;
  ratio?: number;
}

interface MortalityModel {
  id: number;
  name: string;
  description?: string;
  weekly_rate: number;
  daily_rate?: number;
}

interface Scenario {
  id: number;
  name: string;
  description: string;
  status: string;
  duration_days: number;
  initial_count: number;
  initial_weight: string;
  genotype: string;
  supplier: string;
  start_date: string;
  created_at: string;
  updated_at: string;
}

interface ScenarioConfigResponse {
  scenario: Scenario;
  tgc_model?: TGCModel;
  fcr_model?: FCRModel;
  mortality_model?: MortalityModel;
  temperature_profile?: any;
}

interface ProjectionPoint {
  weekNumber: number;
  averageWeight: number;
  fishCount: number;
  mortalityRate: number;
  fcr: number;
  totalBiomass: number;
  waterTemperature: number;
  cumulativeFeed: number;
}

interface ProjectionsResponse {
  results: ProjectionPoint[];
}

export function ScenarioDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: scenario, isLoading: scenarioLoading } = useQuery<ScenarioConfigResponse>({
    queryKey: [`/api/v1/scenario/scenarios/${id}/configuration/`],
    enabled: !!id,
  });

  const { data: projectionData, isLoading: projectionsLoading } = useQuery<ProjectionsResponse>({
    queryKey: [`/api/v1/scenario/scenarios/${id}/projections/`],
    enabled: !!id,
  });

  if (scenarioLoading || projectionsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!scenario?.scenario) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Scenario Not Found</h2>
          <Button onClick={() => setLocation("/scenario-planning")}>
            Back to Scenario Planning
          </Button>
        </div>
      </div>
    );
  }

  const scenarioData = scenario.scenario;
  const projections = projectionData?.results || [];
  
  // Calculate summary statistics
  const summary = projections.length > 0 ? {
    finalWeight: projections[projections.length - 1]?.averageWeight || 0,
    finalCount: projections[projections.length - 1]?.fishCount || 0,
    totalBiomass: projections[projections.length - 1]?.totalBiomass || 0,
    totalFeed: projections[projections.length - 1]?.cumulativeFeed || 0,
    avgFcr: projections[projections.length - 1]?.fcr || 0,
    totalMortality: scenarioData.initial_count - (projections[projections.length - 1]?.fishCount || 0)
  } : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "running": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/scenario-planning")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Scenario Planning</span>
          </Button>
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{scenarioData.name}</h1>
          <p className="text-muted-foreground mt-2">{scenarioData.description}</p>
          <div className="flex items-center space-x-4 mt-4">
            <Badge className={getStatusColor(scenarioData.status)}>
              {scenarioData.status.charAt(0).toUpperCase() + scenarioData.status.slice(1)}
            </Badge>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(scenarioData.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>{scenarioData.duration_days} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Starting Population</p>
                <p className="text-lg font-bold">{(scenarioData.initial_count / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Initial Weight</p>
                <p className="text-lg font-bold">{(parseFloat(scenarioData.initial_weight) / 1000).toFixed(1)}kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {summary && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Harvest Weight</p>
                    <p className="text-lg font-bold">{(summary.finalWeight / 1000).toFixed(1)}kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-amber-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Final Biomass</p>
                    <p className="text-lg font-bold">{(summary.totalBiomass / 1000).toFixed(0)}t</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Sea Cage Production Summary */}
          {summary && (
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
                    <p className="text-xl font-bold">{(summary.finalWeight / 1000).toFixed(1)}kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Harvest Count</p>
                    <p className="text-xl font-bold">{(summary.finalCount / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Biomass</p>
                    <p className="text-xl font-bold">{(summary.totalBiomass / 1000).toFixed(0)}t</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Final FCR</p>
                    <p className="text-xl font-bold">{summary.avgFcr?.toFixed(2) || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Feed Consumption</p>
                    <p className="text-xl font-bold">{summary.totalFeed?.toFixed(0) || 0}t</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance Analysis */}
          {summary && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Insights</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Growth from smolt transfer ({parseFloat(scenarioData.initial_weight)/1000}kg) to harvest weight ({(summary.finalWeight / 1000).toFixed(1)}kg)</li>
                      <li>• Feed conversion ratio of {summary.avgFcr?.toFixed(2) || 0} demonstrates {(summary.avgFcr || 0) < 1.3 ? 'excellent' : (summary.avgFcr || 0) < 1.5 ? 'good' : 'acceptable'} efficiency</li>
                      <li>• Sea cage survival rate of {(((scenarioData.initial_count - summary.totalMortality) / scenarioData.initial_count) * 100).toFixed(1)}% over {Math.round(scenarioData.duration_days/30)} months</li>
                      <li>• Total feed consumption of {summary.totalFeed?.toFixed(0) || 0} tonnes for {(summary.totalBiomass / 1000).toFixed(0)}t biomass production</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scenario Details */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Genotype</label>
                    <p className="text-sm">{scenarioData.genotype}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Supplier</label>
                    <p className="text-sm">{scenarioData.supplier}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <p className="text-sm">{new Date(scenarioData.start_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    <p className="text-sm">{scenarioData.duration_days} days ({Math.round(scenarioData.duration_days/30)} months)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={getStatusColor(scenarioData.status)}>
                      {scenarioData.status.charAt(0).toUpperCase() + scenarioData.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="text-sm">{new Date(scenarioData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planned Activities Summary */}
          <ScenarioPlannedActivitiesSummary
            scenarioId={parseInt(id!)}
            scenarioName={scenarioData.name}
          />
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          {projections.length > 0 ? (
            <ScenarioProjectionsChart
              data={projections.map((p: ProjectionPoint) => ({
                day: p.weekNumber * 7,
                week: p.weekNumber,
                weight: p.averageWeight,
                count: p.fishCount,
                mortality: p.mortalityRate,
                fcr: p.fcr,
                totalBiomass: p.totalBiomass,
                temperature: p.waterTemperature
              }))}
              title={`Growth Projections - ${scenarioData.name}`}
              showMetrics={true}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No projection data available for this scenario.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  TGC Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{scenario.tgc_model?.name || "Not configured"}</p>
                  <p className="text-xs text-muted-foreground">{scenario.tgc_model?.location || "-"}</p>
                  <div className="text-xs">
                    <span className="text-muted-foreground">TGC Value: </span>
                    <span className="font-medium">{scenario.tgc_model?.tgc_value || "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  FCR Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{scenario.fcr_model?.name || "Not configured"}</p>
                  <p className="text-xs text-muted-foreground">{scenario.fcr_model?.description || "-"}</p>
                  <div className="text-xs">
                    <span className="text-muted-foreground">FCR Ratio: </span>
                    <span className="font-medium">{scenario.fcr_model?.ratio || "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Mortality Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{scenario.mortality_model?.name || "Not configured"}</p>
                  <p className="text-xs text-muted-foreground">{scenario.mortality_model?.description || "-"}</p>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Weekly Rate: </span>
                    <span className="font-medium">{scenario.mortality_model?.weekly_rate || "-"}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temperature Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Thermometer className="h-12 w-12 mx-auto mb-4" />
                <p>Temperature profile visualization will be displayed here</p>
                <p className="text-sm">Integration with temperature data view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  TrendingUp, 
  Calculator, 
  Brain, 
  Thermometer,
  Activity,
  Target,
  Play,
  Copy,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Fish
} from "lucide-react";
import { ScenarioCreationDialog } from "@/components/scenario/scenario-creation-dialog";

import { ScenarioEditDialog } from "@/components/scenario/scenario-edit-dialog";
import { BatchIntegrationDialog } from "@/components/scenario/batch-integration-dialog";
import { TgcModelCreationDialog } from "@/components/scenario/tgc-model-creation-dialog";
import { FcrModelCreationDialog } from "@/components/scenario/fcr-model-creation-dialog";
import { MortalityModelCreationDialog } from "@/components/scenario/mortality-model-creation-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ScenarioPlanningKPIs {
  totalActiveScenarios: number;
  scenariosInProgress: number;
  completedProjections: number;
  averageProjectionDuration: number;
}

interface TemperatureProfile {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface TgcModel {
  id: number;
  name: string;
  location: string;
  releasePeriod: string;
  tgcValue: string;
  exponentN: string;
  exponentM: string;
  profileId: number;
  createdAt: string;
  updatedAt: string;
}

// NOTE: renamed to avoid clashing with the `Scenario` interface that exists
// inside `components/scenario/scenario-edit-dialog.tsx`
interface LocalScenario {
  id: number;
  name: string;
  description: string;
  startDate: string;
  durationDays: number;
  initialCount: number;
  initialWeight: string;
  genotype: string;
  supplier: string;
  /** 
   * Match the exact status union used by the Scenario interface in
   * `scenario-edit-dialog.tsx` to avoid type-mismatch errors when passing
   * a `LocalScenario` to components that expect that stricter type.
   */
  status: "draft" | "running" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export default function ScenarioPlanning() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Fetch Temperature Profiles
  const { data: temperatureProfiles } = useQuery<{results: TemperatureProfile[]}>({
    queryKey: ["/api/v1/scenario/temperature-profiles/"],
  });

  // Fetch TGC Models
  const { data: tgcModels } = useQuery<{results: TgcModel[]}>({
    queryKey: ["/api/v1/scenario/tgc-models/"],
  });

  // Fetch FCR Models
  const { data: fcrModels } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario/fcr-models/"],
  });

  // Fetch Mortality Models
  const { data: mortalityModels } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario/mortality-models/"],
  });

  // Fetch Biological Constraints
  const { data: biologicalConstraints } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario/biological-constraints/"],
  });

  // Fetch Scenarios with filtering
  const { data: scenarios, isLoading: scenariosLoading } = useQuery<{results: LocalScenario[]}>({
    queryKey: ["/api/v1/scenario/scenarios/", { search: searchTerm, status: statusFilter }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      return fetch(`/api/v1/scenario/scenarios/?${params}`).then(res => res.json());
    }
  });

  /* ----------------------------------------------------------
   * Derive KPI values client-side from the scenarios list.
   * -------------------------------------------------------- */
  const computedKpis: ScenarioPlanningKPIs = useMemo(() => {
    const list = scenarios?.results ?? [];
    if (list.length === 0) {
      return {
        totalActiveScenarios: 0,
        scenariosInProgress: 0,
        completedProjections: 0,
        averageProjectionDuration: 0,
      };
    }
    const totalActiveScenarios = list.length;
    const scenariosInProgress = list.filter((s) => s.status === "running").length;
    const completedProjections = list.filter((s) => s.status === "completed").length;
    const averageProjectionDuration =
      list.reduce((sum, s) => sum + (s.durationDays ?? 0), 0) / list.length;

    return {
      totalActiveScenarios,
      scenariosInProgress,
      completedProjections,
      averageProjectionDuration,
    };
  }, [scenarios]);

  // Delete scenario mutation
  const deleteScenarioMutation = useMutation({
    mutationFn: async (scenarioId: number) => {
      return apiRequest(
        "DELETE",
        `/api/v1/scenario/scenarios/${scenarioId}/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/scenarios/"] });
      toast({
        title: "Scenario Deleted",
        description: "The scenario has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete scenario. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Duplicate scenario mutation
  const duplicateScenarioMutation = useMutation({
    mutationFn: async ({ scenarioId, name }: { scenarioId: number; name: string }) => {
      return apiRequest(
        "POST",
        `/api/v1/scenario/scenarios/${scenarioId}/duplicate/`,
        { name }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/scenarios/"] });
      toast({
        title: "Scenario Duplicated",
        description: "The scenario has been duplicated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to duplicate scenario. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Run projection mutation
  const runProjectionMutation = useMutation({
    mutationFn: async (scenarioId: number) => {
      return apiRequest(
        "POST",
        `/api/v1/scenario/scenarios/${scenarioId}/run-projection/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/scenarios/"] });
      toast({
        title: "Projection Started",
        description: "The scenario projection has been started.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start projection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredScenarios = scenarios?.results?.filter(scenario => {
    const matchesSearch = !searchTerm || 
      scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.genotype.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || scenario.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scenario Planning</h1>
          <p className="text-muted-foreground">
            Growth projections and model management for salmon farming operations
          </p>
        </div>
        <div className="flex gap-2">
          <ScenarioCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/scenarios/"] })}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Scenario
            </Button>
          </ScenarioCreationDialog>
          <BatchIntegrationDialog onBatchSelected={(batch) => {
            // Handle batch selection to create new scenario
            console.log('Selected batch for scenario:', batch);
          }}>
            <Button variant="outline">
              <Fish className="h-4 w-4 mr-2" />
              From Batch
            </Button>
          </BatchIntegrationDialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scenarios</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{computedKpis.totalActiveScenarios}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{computedKpis.scenariosInProgress}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{computedKpis.completedProjections}</div>
            <p className="text-xs text-muted-foreground">
              Total projections
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(computedKpis.averageProjectionDuration)}</div>
            <p className="text-xs text-muted-foreground">
              days per scenario
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarios?.results?.slice(0, 5).map((scenario) => (
                    <div key={scenario.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{scenario.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {scenario.durationDays} days • {scenario.genotype}
                        </p>
                      </div>
                      <Badge variant={scenario.status === 'completed' ? 'default' : 'secondary'}>
                        {scenario.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">TGC Models</span>
                    <span className="font-medium">{tgcModels?.results?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temperature Profiles</span>
                    <span className="font-medium">{temperatureProfiles?.results?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Projections</span>
                    <span className="font-medium">{computedKpis.scenariosInProgress}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h2 className="text-2xl font-bold">Scenarios</h2>
            <div className="flex gap-2">
              <ScenarioCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/scenarios/"] })}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scenario
                </Button>
              </ScenarioCreationDialog>
              <BatchIntegrationDialog onBatchSelected={(batch) => {
                // Handle batch selection to create new scenario
                console.log('Selected batch for scenario:', batch);
              }}>
                <Button variant="outline">
                  <Fish className="h-4 w-4 mr-2" />
                  From Batch
                </Button>
              </BatchIntegrationDialog>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search scenarios by name, description, or genotype..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scenarios Grid */}
          {scenariosLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="space-y-2">
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredScenarios.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No scenarios found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first scenario to get started with growth projections"
                  }
                </p>
                <div className="flex gap-2">
                  <ScenarioCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/scenarios/"] })}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Scenario
                    </Button>
                  </ScenarioCreationDialog>
                  <BatchIntegrationDialog onBatchSelected={(batch) => {
                    console.log('Selected batch for scenario:', batch);
                  }}>
                    <Button variant="outline">
                      <Fish className="h-4 w-4 mr-2" />
                      From Batch
                    </Button>
                  </BatchIntegrationDialog>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredScenarios.map((scenario) => (
                <Card key={scenario.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {scenario.name}
                          <Badge variant={
                            scenario.status === 'completed' ? 'default' : 
                            scenario.status === 'running' ? 'secondary' :
                            scenario.status === 'failed' ? 'destructive' : 'outline'
                          }>
                            {scenario.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {scenario.description}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <ScenarioEditDialog 
                            scenario={scenario} 
                            onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/scenarios/"] })}
                          >
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Scenario
                            </DropdownMenuItem>
                          </ScenarioEditDialog>
                          <DropdownMenuItem 
                            onClick={() => duplicateScenarioMutation.mutate({ 
                              scenarioId: scenario.id, 
                              name: `${scenario.name} (Copy)` 
                            })}
                            disabled={duplicateScenarioMutation.isPending}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteScenarioMutation.mutate(scenario.id)}
                            disabled={deleteScenarioMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{scenario.durationDays} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Initial Count</p>
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
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setLocation(`/scenario-planning/scenarios/${scenario.id}`)}
                        >
                          <LineChart className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {scenario.status === 'draft' && (
                          <Button 
                            size="sm"
                            onClick={() => runProjectionMutation.mutate(scenario.id)}
                            disabled={runProjectionMutation.isPending}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {runProjectionMutation.isPending ? "Starting..." : "Run Projection"}
                          </Button>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Created {new Date(scenario.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Growth Models</h2>
            <div className="flex gap-2">
              <TgcModelCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/tgc-models/"] })}>
                <Button variant="outline" size="sm">
                  <Brain className="h-4 w-4 mr-2" />
                  TGC Model
                </Button>
              </TgcModelCreationDialog>
              <FcrModelCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/fcr-models/"] })}>
                <Button variant="outline" size="sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  FCR Model
                </Button>
              </FcrModelCreationDialog>
              <MortalityModelCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/mortality-models/"] })}>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Mortality Model
                </Button>
              </MortalityModelCreationDialog>
            </div>
          </div>

          {/* Model Type Tabs */}
          <Tabs defaultValue="tgc" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tgc">TGC Models</TabsTrigger>
              <TabsTrigger value="fcr">FCR Models</TabsTrigger>
              <TabsTrigger value="mortality">Mortality Models</TabsTrigger>
            </TabsList>

            <TabsContent value="tgc" className="space-y-4">
              <div className="flex justify-end items-center">
                <TgcModelCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/tgc-models/"] })}>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New TGC Model
                  </Button>
                </TgcModelCreationDialog>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {tgcModels?.results?.map((model) => (
                  <Card key={model.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            {model.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {model.location} • {model.releasePeriod}
                          </p>
                        </div>
                        <Badge variant="outline">TGC</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">TGC Value</p>
                          <p className="font-medium">{model.tgcValue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Exponent N</p>
                          <p className="font-medium">{model.exponentN}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Exponent M</p>
                          <p className="font-medium">{model.exponentM}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit Model
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!tgcModels?.results || tgcModels.results.length === 0) && (
                  <Card className="md:col-span-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No TGC models found</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Create your first TGC model to define growth parameters for scenarios
                      </p>
                      <TgcModelCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/tgc-models/"] })}>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create TGC Model
                        </Button>
                      </TgcModelCreationDialog>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="fcr" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Feed Conversion Ratio Models</h3>
                <FcrModelCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/fcr-models/"] })}>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New FCR Model
                  </Button>
                </FcrModelCreationDialog>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {fcrModels?.results?.map((model) => (
                  <Card key={model.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            {model.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {model.description || "FCR model for feed efficiency calculations"}
                          </p>
                        </div>
                        <Badge variant="outline">FCR</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm mb-4">
                        <p className="text-muted-foreground">Stages configured</p>
                        <p className="font-medium">{model.stages?.length || 0} lifecycle stages</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit Model
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!fcrModels?.results || fcrModels.results.length === 0) && (
                  <Card className="md:col-span-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No FCR models found</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Create your first FCR model to define feed conversion ratios for each lifecycle stage
                      </p>
                      <FcrModelCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/fcr-models/"] })}>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create FCR Model
                        </Button>
                      </FcrModelCreationDialog>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="mortality" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Mortality Models</h3>
                <MortalityModelCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/mortality-models/"] })}>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Mortality Model
                  </Button>
                </MortalityModelCreationDialog>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {mortalityModels?.results?.map((model) => (
                  <Card key={model.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            {model.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {model.description || `${model.frequency} mortality model`}
                          </p>
                        </div>
                        <Badge variant="outline">Mortality</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Frequency</p>
                          <p className="font-medium capitalize">{model.frequency}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Base Rate</p>
                          <p className="font-medium">{(model.rate * 100).toFixed(2)}%</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit Model
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!mortalityModels?.results || mortalityModels.results.length === 0) && (
                  <Card className="md:col-span-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No mortality models found</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Create your first mortality model to define population decline rates for scenarios
                      </p>
                      <MortalityModelCreationDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/mortality-models/"] })}>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Mortality Model
                        </Button>
                      </MortalityModelCreationDialog>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>




          </Tabs>
        </TabsContent>

        <TabsContent value="temperature" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Temperature Profiles</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Profile
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {temperatureProfiles?.results?.map((profile) => (
              <Card key={profile.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    {profile.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="text-sm">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span className="text-sm">
                        {new Date(profile.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setLocation(`/temperature-data/${profile.id}`)}
                    >
                      View Data
                    </Button>
                    <Button size="sm" variant="outline">
                      Statistics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="constraints" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Biological Constraints</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Constraint
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Standard Growth Constraints</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Standard biological limits for Atlantic salmon growth stages
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Fry Stage</p>
                      <p className="font-medium">0.1 - 5g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Parr Stage</p>
                      <p className="font-medium">5 - 50g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Smolt Stage</p>
                      <p className="font-medium">50 - 200g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Adult Stage</p>
                      <p className="font-medium">200g+</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit Constraints
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Constraints</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Temperature and environmental parameter limits
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Optimal Temperature</p>
                      <p className="font-medium">8 - 14°C</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Critical Temperature</p>
                      <p className="font-medium">4 - 18°C</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Oxygen Minimum</p>
                      <p className="font-medium">6 mg/L</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">pH Range</p>
                      <p className="font-medium">6.0 - 8.5</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Configure Limits
                    </Button>
                    <Button size="sm" variant="outline">
                      Set Alerts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Constraints */}
          {biologicalConstraints?.results && biologicalConstraints.results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Biological Constraints</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Currently configured constraints for scenario validation
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {biologicalConstraints.results.map((constraint: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{constraint.name || `Constraint ${index + 1}`}</p>
                        <p className="text-sm text-muted-foreground">{constraint.description || "Custom biological constraint"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

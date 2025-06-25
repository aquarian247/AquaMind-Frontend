import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Plus
} from "lucide-react";

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

interface Scenario {
  id: number;
  name: string;
  description: string;
  startDate: string;
  durationDays: number;
  initialCount: number;
  initialWeight: string;
  genotype: string;
  supplier: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ScenarioPlanning() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch KPIs
  const { data: kpis } = useQuery<ScenarioPlanningKPIs>({
    queryKey: ["/api/v1/scenario-planning/dashboard/kpis/"],
  });

  // Fetch Temperature Profiles
  const { data: temperatureProfiles } = useQuery<{results: TemperatureProfile[]}>({
    queryKey: ["/api/v1/scenario-planning/temperature-profiles/"],
  });

  // Fetch TGC Models
  const { data: tgcModels } = useQuery<{results: TgcModel[]}>({
    queryKey: ["/api/v1/scenario-planning/tgc-models/"],
  });

  // Fetch Scenarios
  const { data: scenarios } = useQuery<{results: Scenario[]}>({
    queryKey: ["/api/v1/scenario-planning/scenarios/"],
  });

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
          </Button>
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
            <div className="text-2xl font-bold">{kpis?.totalActiveScenarios || 0}</div>
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
            <div className="text-2xl font-bold">{kpis?.scenariosInProgress || 0}</div>
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
            <div className="text-2xl font-bold">{kpis?.completedProjections || 0}</div>
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
            <div className="text-2xl font-bold">{Math.round(kpis?.averageProjectionDuration || 0)}</div>
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
                    <span className="font-medium">{kpis?.scenariosInProgress || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Scenarios</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Scenario
            </Button>
          </div>
          
          <div className="grid gap-4">
            {scenarios?.results?.map((scenario) => (
              <Card key={scenario.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{scenario.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {scenario.description}
                      </p>
                    </div>
                    <Badge variant={scenario.status === 'completed' ? 'default' : 'secondary'}>
                      {scenario.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <LineChart className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                    {scenario.status === 'draft' && (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Run Projection
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Growth Models</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Model
            </Button>
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
                  <div className="grid grid-cols-3 gap-4 text-sm">
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
                  <div className="flex gap-2 mt-4">
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
          </div>
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
                    <Button size="sm" variant="outline">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Standard Growth Constraints</CardTitle>
              <p className="text-sm text-muted-foreground">
                Standard biological limits for Atlantic salmon growth stages
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
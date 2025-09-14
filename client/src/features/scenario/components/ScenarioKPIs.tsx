import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Activity, TrendingUp, Calculator } from "lucide-react";

interface ScenarioPlanningKPIs {
  totalActiveScenarios: number;
  scenariosInProgress: number;
  completedProjections: number;
  averageProjectionDuration: number;
}

interface ScenarioKPIsProps {
  kpis: ScenarioPlanningKPIs;
  isLoading: boolean;
}

export function ScenarioKPIs({ kpis, isLoading }: ScenarioKPIsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Scenarios</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.totalActiveScenarios}</div>
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
          <div className="text-2xl font-bold">{kpis.scenariosInProgress}</div>
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
          <div className="text-2xl font-bold">{kpis.completedProjections}</div>
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
          <div className="text-2xl font-bold">{Math.round(kpis.averageProjectionDuration)}</div>
          <p className="text-xs text-muted-foreground">
            days per scenario
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

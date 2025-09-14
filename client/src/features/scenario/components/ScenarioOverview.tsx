import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScenarioOverviewProps {
  scenarios: any;
  tgcModels: any;
  temperatureProfiles: any;
  kpis: {
    scenariosInProgress: number;
  };
  isLoading: boolean;
}

export function ScenarioOverview({
  scenarios,
  tgcModels,
  temperatureProfiles,
  kpis,
  isLoading
}: ScenarioOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios?.results?.slice(0, 5).map((scenario: any) => (
              <div key={scenario.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{scenario.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {scenario.duration_days} days • {scenario.genotype}
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
              <span className="font-medium">{kpis.scenariosInProgress}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

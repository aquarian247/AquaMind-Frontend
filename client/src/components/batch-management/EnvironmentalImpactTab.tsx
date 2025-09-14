import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Zap } from "lucide-react";

interface EnvironmentalCorrelation {
  parameter: string;
  correlation: number;
  impact: 'positive' | 'negative' | 'neutral';
  significance: 'high' | 'medium' | 'low';
}

interface EnvironmentalImpactTabProps {
  environmentalCorrelations: EnvironmentalCorrelation[];
}

export function EnvironmentalImpactTab({
  environmentalCorrelations
}: EnvironmentalImpactTabProps) {
  if (environmentalCorrelations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Environmental correlations require sensor data.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getCorrelationColor = (impact: string) => {
    switch (impact) {
      case 'positive': return "text-green-600 bg-green-50";
      case 'negative': return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Impact Analysis</CardTitle>
        <CardDescription>How environmental factors affect batch performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {environmentalCorrelations.map((correlation, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {correlation.parameter === 'Temperature' && <Thermometer className="h-4 w-4" />}
                {correlation.parameter === 'Oxygen' && <Droplets className="h-4 w-4" />}
                {correlation.parameter === 'pH' && <Zap className="h-4 w-4" />}
                <span className="font-medium">{correlation.parameter}</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getCorrelationColor(correlation.impact)}>
                  {correlation.impact}
                </Badge>
                <span className="font-bold">
                  {(correlation.correlation * 100).toFixed(0)}%
                </span>
                <Badge variant="outline" className={
                  correlation.significance === 'high' ? 'border-red-200' :
                  correlation.significance === 'medium' ? 'border-yellow-200' : 'border-gray-200'
                }>
                  {correlation.significance}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

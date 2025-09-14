import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictiveInsight {
  metric: string;
  currentValue: number;
  predictedValue: number;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number;
  timeframe: string;
}

interface PredictiveInsightsTabProps {
  predictiveInsights: PredictiveInsight[];
}

export function PredictiveInsightsTab({
  predictiveInsights
}: PredictiveInsightsTabProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  if (predictiveInsights.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Predictive insights require scenario models.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {predictiveInsights.map((insight, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{insight.metric}</CardTitle>
                <CardDescription>Prediction for {insight.timeframe}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(insight.trend)}
                <Badge variant="outline">{insight.confidence}% confidence</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Value</label>
                <p className="text-xl font-bold">{insight.currentValue.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Predicted Value</label>
                <p className={cn("text-xl font-bold",
                  insight.trend === 'improving' ? "text-green-600" :
                  insight.trend === 'declining' ? "text-red-600" : "text-blue-600"
                )}>
                  {insight.predictedValue.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <Progress
                value={insight.confidence}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Prediction confidence: {insight.confidence}%
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

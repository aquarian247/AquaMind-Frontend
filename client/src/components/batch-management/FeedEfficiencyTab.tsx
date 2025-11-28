import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FeedTypeUsage {
  feedType: string;
  feedBrand: string;
  totalAmountKg: number;
  totalCost: number;
  eventsCount: number;
  averageAmountPerEvent: number;
}

interface FeedEfficiencyTabProps {
  totalFeedConsumed: number;
  totalFeedCost: number;
  feedTypeUsage: FeedTypeUsage[];
  currentBiomassKg: number | null;
}

export function FeedEfficiencyTab({
  totalFeedConsumed,
  totalFeedCost,
  feedTypeUsage,
  currentBiomassKg,
}: FeedEfficiencyTabProps) {
  const costPerKgFish =
    currentBiomassKg && currentBiomassKg > 0
      ? totalFeedCost / currentBiomassKg
      : null;

  const feedEfficiency =
    totalFeedConsumed > 0 && currentBiomassKg && currentBiomassKg > 0
      ? (currentBiomassKg / totalFeedConsumed) * 100
      : null;

  const wasteReduction =
    feedEfficiency !== null ? Math.max(0, 100 - feedEfficiency) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Feed Efficiency Metrics</CardTitle>
          <CardDescription>Performance indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cost per kg of fish</span>
              <span className="font-bold">
                {costPerKgFish !== null ? `$${costPerKgFish.toFixed(2)}` : "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Feed efficiency</span>
              <span className="font-bold text-green-600">
                {feedEfficiency !== null ? `${feedEfficiency.toFixed(1)}%` : "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Waste reduction</span>
              <span className="font-bold text-blue-600">
                {wasteReduction !== null ? `${wasteReduction.toFixed(1)}%` : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feed Cost Analysis</CardTitle>
          <CardDescription>Cost breakdown and optimization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {feedTypeUsage.slice(0, 3).map((usage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{usage.feedType}</span>
                  <span className="font-bold">${usage.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{usage.totalAmountKg.toFixed(2)} kg</span>
                  <span>${(usage.totalCost / usage.totalAmountKg).toFixed(2)}/kg</span>
                </div>
                <Progress
                  value={totalFeedCost > 0 ? (usage.totalCost / totalFeedCost) * 100 : 0}
                  className="h-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

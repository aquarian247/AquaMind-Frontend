import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FeedingSummary {
  id: number;
  periodStart: string;
  periodEnd: string;
  totalFeedKg: number;
  totalFeedConsumedKg: number;
  totalBiomassGainKg: number;
  fcr: number;
  averageFeedingPercentage: number;
  feedingEventsCount: number;
  totalCost: number;
}

interface FeedTypeUsage {
  feedType: string;
  feedBrand: string;
  totalAmountKg: number;
  totalCost: number;
  eventsCount: number;
  averageAmountPerEvent: number;
}

interface FeedEfficiencyTabProps {
  currentFCR: number | null;
  totalFeedConsumed: number;
  totalFeedCost: number;
  feedTypeUsage: FeedTypeUsage[];
  feedingSummaries: FeedingSummary[];
}

export function FeedEfficiencyTab({
  currentFCR,
  totalFeedConsumed,
  totalFeedCost,
  feedTypeUsage,
  feedingSummaries,
}: FeedEfficiencyTabProps) {
  const getFCRColor = (fcr: number) => {
    if (fcr <= 1.1) return "text-green-600";
    if (fcr <= 1.3) return "text-blue-600";
    if (fcr <= 1.5) return "text-yellow-600";
    return "text-red-600";
  };

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
              <span className="text-sm font-medium">Current FCR</span>
              <span className={(currentFCR !== null ? getFCRColor(currentFCR) : "text-muted-foreground") + " font-bold"}>
                {currentFCR !== null ? currentFCR.toFixed(2) : "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cost per kg of fish</span>
              <span className="font-bold">
                ${(totalFeedConsumed > 0 && currentFCR !== null) ? ((totalFeedCost / totalFeedConsumed) * currentFCR).toFixed(2) : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Feed efficiency</span>
              <span className="font-bold text-green-600">
                {(currentFCR !== null && currentFCR > 0) ? (100 / currentFCR).toFixed(1) : 'N/A'}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Waste reduction</span>
              <span className="font-bold text-blue-600">
                {feedingSummaries.length > 0 ?
                  ((feedingSummaries[feedingSummaries.length - 1].totalFeedConsumedKg / feedingSummaries[feedingSummaries.length - 1].totalFeedKg) * 100).toFixed(1) : '0'}%
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
                  value={(usage.totalCost / totalFeedCost) * 100}
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

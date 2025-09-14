import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface FeedTypeUsage {
  feedType: string;
  feedBrand: string;
  totalAmountKg: number;
  totalCost: number;
  eventsCount: number;
  averageAmountPerEvent: number;
}

interface FeedTypePerformanceCardProps {
  feedTypeUsage: FeedTypeUsage[];
  totalFeedConsumed: number;
}

export function FeedTypePerformanceCard({
  feedTypeUsage,
  totalFeedConsumed,
}: FeedTypePerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feed Type Performance</CardTitle>
        <CardDescription>Breakdown by feed type for this period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedTypeUsage.slice(0, 3).map((usage, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{usage.feedType}</span>
                  <p className="text-sm text-muted-foreground">{usage.feedBrand}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{usage.totalAmountKg.toFixed(2)} kg</span>
                  <p className="text-sm text-muted-foreground">${usage.totalCost.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Events:</span>
                  <p className="font-medium">{usage.eventsCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg/Event:</span>
                  <p className="font-medium">{usage.averageAmountPerEvent.toFixed(2)} kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cost/kg:</span>
                  <p className="font-medium">${usage.totalAmountKg > 0 ? (usage.totalCost / usage.totalAmountKg).toFixed(2) : '0.00'}</p>
                </div>
              </div>

              <Progress
                value={(usage.totalAmountKg / totalFeedConsumed) * 100}
                className="h-2"
              />
              <Separator />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

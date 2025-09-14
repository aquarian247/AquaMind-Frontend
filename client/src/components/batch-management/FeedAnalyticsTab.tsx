import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface FeedTypeUsage {
  feedType: string;
  feedBrand: string;
  totalAmountKg: number;
  totalCost: number;
  eventsCount: number;
  averageAmountPerEvent: number;
}

interface FeedingEvent {
  id: number;
  feedingDate: string;
  feedingTime: string;
  amountKg: number;
  feedType: string;
  feedBrand: string;
  containerName: string;
  batchBiomassKg: number;
  feedCost: number;
  method: string;
  notes?: string;
  recordedBy: string;
}

interface FeedAnalyticsTabProps {
  feedTypeUsage: FeedTypeUsage[];
  feedingEvents: FeedingEvent[];
  totalFeedConsumed: number;
}

export function FeedAnalyticsTab({
  feedTypeUsage,
  feedingEvents,
  totalFeedConsumed,
}: FeedAnalyticsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Feed Type Usage</CardTitle>
          <CardDescription>Breakdown by feed type and brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedTypeUsage.map((usage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{usage.feedType}</span>
                    <span className="text-sm text-muted-foreground ml-2">({usage.feedBrand})</span>
                  </div>
                  <span className="font-semibold">{usage.totalAmountKg.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{usage.eventsCount} events</span>
                  <span>${usage.totalCost.toFixed(2)}</span>
                </div>
                <Progress
                  value={(usage.totalAmountKg / totalFeedConsumed) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feeding Patterns</CardTitle>
          <CardDescription>Daily feeding distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Group events by day and show daily totals */}
            {Object.entries(
              feedingEvents.reduce((acc, event) => {
                const day = format(new Date(event.feedingDate), "MMM dd");
                if (!acc[day]) acc[day] = { total: 0, events: 0, cost: 0 };
                acc[day].total += event.amountKg;
                acc[day].events += 1;
                acc[day].cost += event.feedCost || 0;
                return acc;
              }, {} as Record<string, { total: number; events: number; cost: number }>)
            ).slice(-7).map(([day, data]) => (
              <div key={day} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{day}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({data.events} events)
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{data.total.toFixed(2)} kg</div>
                  <div className="text-sm text-muted-foreground">${data.cost.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

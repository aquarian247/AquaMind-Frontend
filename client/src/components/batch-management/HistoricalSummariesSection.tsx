import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

interface HistoricalSummariesSectionProps {
  feedingSummaries: FeedingSummary[];
}

export function HistoricalSummariesSection({
  feedingSummaries,
}: HistoricalSummariesSectionProps) {
  const getFCRColor = (fcr: number) => {
    if (fcr <= 1.1) return "text-green-600";
    if (fcr <= 1.3) return "text-blue-600";
    if (fcr <= 1.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Historical Period Summaries</h3>
      {feedingSummaries.slice(-5).map((summary) => (
        <Card key={summary.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {format(new Date(summary.periodStart), "MMM dd")} - {format(new Date(summary.periodEnd), "MMM dd, yyyy")}
                </CardTitle>
                <CardDescription>{summary.feedingEventsCount || 0} feeding events</CardDescription>
              </div>
              <Badge className={cn("border", getFCRColor(Number(summary.fcr) || 0).replace('text-', 'border-').replace('text-', 'bg-') + '-100')}>
                FCR: {Number(summary.fcr || 0).toFixed(2)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Feed</label>
                <p className="text-lg font-semibold">{Number(summary.totalFeedKg || 0).toFixed(2)} kg</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Feed Consumed</label>
                <p className="text-lg font-semibold">{Number(summary.totalFeedConsumedKg || 0).toFixed(2)} kg</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Biomass Gain</label>
                <p className="text-lg font-semibold text-green-600">+{Number(summary.totalBiomassGainKg || 0).toFixed(2)} kg</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Avg Feed %</label>
                <p className="text-lg font-semibold">{Number(summary.averageFeedingPercentage || 0).toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

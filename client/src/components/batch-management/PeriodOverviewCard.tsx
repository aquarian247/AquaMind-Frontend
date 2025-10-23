import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PeriodOverviewCardProps {
  periodFilter: string;
  totalFeedConsumed: number;
  feedingSummaryEventsCount: number | undefined;
  totalEvents: number;
  feedingEventsLength: number;
  currentFCR: number | null;
  averageDailyFeed: number;
}

export function PeriodOverviewCard({
  periodFilter,
  totalFeedConsumed,
  feedingSummaryEventsCount,
  totalEvents,
  feedingEventsLength,
  currentFCR,
  averageDailyFeed,
}: PeriodOverviewCardProps) {
  const getFCRColor = (fcr: number) => {
    if (fcr <= 1.1) return "text-green-600";
    if (fcr <= 1.3) return "text-blue-600";
    if (fcr <= 1.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getPeriodDisplayName = (filter: string) => {
    switch (filter) {
      case "7": return "Last 7 days";
      case "30": return "Last 30 days";
      case "90": return "Last 90 days";
      case "week": return "This week";
      case "month": return "This month";
      case "stage": return "Current stage";
      default: return "Custom period";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Period Summary - {getPeriodDisplayName(periodFilter)}
        </CardTitle>
        <CardDescription>
          Comprehensive feeding performance analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Feed Consumption</label>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{totalFeedConsumed.toFixed(2)} kg</p>
              <p className="text-sm text-muted-foreground">
                {feedingSummaryEventsCount || totalEvents || feedingEventsLength} feeding events
              </p>
              <p className="text-sm text-green-600">
                {averageDailyFeed.toFixed(2)} kg/day average
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Feed Conversion</label>
            <div className="space-y-1">
              <p className={cn("text-2xl font-bold", currentFCR !== null ? getFCRColor(currentFCR) : "text-muted-foreground")}>
                {currentFCR !== null ? `${Number(currentFCR).toFixed(2)} FCR` : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentFCR !== null ? "Feed conversion ratio" : "No FCR data available"}
              </p>
              <p className="text-sm text-blue-600">
                {currentFCR !== null ? (currentFCR <= 1.2 ? "Excellent" : currentFCR <= 1.4 ? "Good" : "Needs attention") : ""}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Cost Analysis</label>
            <div className="space-y-1">
              <p className="text-2xl font-bold">${(totalFeedConsumed * (totalFeedConsumed > 0 ? 1 : 0)).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                Total feed cost
              </p>
              <p className="text-sm text-orange-600">
                ${totalFeedConsumed > 0 ? "0.00" : '0.00'}/kg
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Efficiency Metrics</label>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                0%
              </p>
              <p className="text-sm text-muted-foreground">
                Feed utilization
              </p>
              <p className="text-sm text-green-600">
                {(currentFCR !== null && currentFCR > 0) ? `${(100 / currentFCR).toFixed(1)}% conversion efficiency` : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

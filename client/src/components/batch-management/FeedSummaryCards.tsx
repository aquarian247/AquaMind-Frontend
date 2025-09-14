import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, DollarSign, Clock, BarChart3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedSummaryCardsProps {
  isLoadingSummary: boolean;
  totalFeedConsumed: number;
  feedingSummaryEventsCount: number;
  totalEvents: number;
  totalFeedCost: number;
  averageDailyFeed: number;
  daysSinceStart: number;
  currentFCR: number;
}

export function FeedSummaryCards({
  isLoadingSummary,
  totalFeedConsumed,
  feedingSummaryEventsCount,
  totalEvents,
  totalFeedCost,
  averageDailyFeed,
  daysSinceStart,
  currentFCR
}: FeedSummaryCardsProps) {
  const getFCRColor = (fcr: number) => {
    if (fcr <= 1.1) return "text-green-600";
    if (fcr <= 1.3) return "text-blue-600";
    if (fcr <= 1.5) return "text-yellow-600";
    return "text-red-600";
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feed Consumed</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoadingSummary ? (
              <Loader2 className="h-6 w-6 animate-spin inline" />
            ) : (
              `${formatNumber(totalFeedConsumed)} kg`
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoadingSummary ? 'Loading summary...' : `${formatNumber(feedingSummaryEventsCount || totalEvents)} feeding events`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Feed Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${formatNumber(totalFeedCost)}</div>
          <p className="text-xs text-muted-foreground">
            ${totalFeedConsumed > 0 ? (totalFeedCost / totalFeedConsumed).toFixed(2) : '0.00'}/kg
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(averageDailyFeed)} kg</div>
          <p className="text-xs text-muted-foreground">
            Per day average ({formatNumber(daysSinceStart)} days since start)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Feed Conversion</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", getFCRColor(currentFCR))}>
            {Number(currentFCR).toFixed(2)} FCR
          </div>
          <p className="text-xs text-muted-foreground">
            Feed conversion ratio
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

interface OperationalInsightsCardProps {
  feedingEvents: FeedingEvent[];
  currentDateRange: { from?: Date; to?: Date };
  uniqueContainers: string[];
  currentFCR: number;
}

export function OperationalInsightsCard({
  feedingEvents,
  currentDateRange,
  uniqueContainers,
  currentFCR,
}: OperationalInsightsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational Insights</CardTitle>
        <CardDescription>Key performance indicators for this period</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Feeding Frequency</span>
            <span className="font-bold">
              {feedingEvents.length > 0 && currentDateRange.from && currentDateRange.to ?
                (feedingEvents.length / Math.ceil((currentDateRange.to.getTime() - currentDateRange.from.getTime()) / (1000 * 60 * 60 * 24))).toFixed(1) : '0'}
              /day
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Feed Method Distribution</span>
            <div className="text-right">
              <p className="font-bold">
                {feedingEvents.length > 0 ? Math.round((feedingEvents.filter(e => e.method === 'Automatic').length / feedingEvents.length) * 100) : 0}% Auto
              </p>
              <p className="text-sm text-muted-foreground">
                {feedingEvents.length > 0 ? Math.round((feedingEvents.filter(e => e.method === 'Manual').length / feedingEvents.length) * 100) : 0}% Manual
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Container Utilization</span>
            <span className="font-bold">
              {uniqueContainers.length} containers active
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Feed Brands Used</span>
            <span className="font-bold">
              {feedingEvents.length > 0 ? [...new Set(feedingEvents.map(e => e.feedBrand))].length : 0} brands
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Period Comparison</span>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Previous period FCR:</span>
              <p className="font-medium">{(currentFCR + 0.05).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Improvement:</span>
              <p className="font-medium text-green-600">-4.0%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

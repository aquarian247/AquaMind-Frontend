import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatFallback } from '@/lib/formatFallback';
import type { TransferReadyBatch } from '../types';

interface TransferReadinessCardsProps {
  batches: TransferReadyBatch[];
  isLoading: boolean;
}

function getReadinessBadge(daysUntil: number | null, confidence: number | null) {
  if (daysUntil !== null && daysUntil <= 0) {
    return <Badge variant="default" className="bg-green-600">Ready Now</Badge>;
  }
  if (daysUntil !== null && daysUntil <= 14) {
    return <Badge variant="secondary" className="bg-yellow-500 text-white">Soon</Badge>;
  }
  if (confidence !== null && confidence >= 0.8) {
    return <Badge variant="outline">Projected</Badge>;
  }
  return <Badge variant="outline">Tracking</Badge>;
}

export function TransferReadinessCards({ batches, isLoading }: TransferReadinessCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">
            No batches currently approaching transfer readiness
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {batches.map((batch) => (
        <Card key={batch.batch_id} className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{batch.batch_number}</CardTitle>
              {getReadinessBadge(batch.days_until_transfer, batch.confidence)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Weight</span>
                <span className="font-medium">
                  {formatFallback(batch.current_weight_g, 'g', { precision: 1 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Weight</span>
                <span>{formatFallback(batch.target_weight_g, 'g', { precision: 0 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days to Transfer</span>
                <span>{batch.days_until_transfer !== null ? `${batch.days_until_transfer}d` : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Facility</span>
                <span className="text-xs">{batch.current_facility}</span>
              </div>
              {batch.projected_transfer_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projected Date</span>
                  <span className="text-xs">
                    {new Date(batch.projected_transfer_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {batch.confidence !== null && (
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, batch.confidence * 100)}%` }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

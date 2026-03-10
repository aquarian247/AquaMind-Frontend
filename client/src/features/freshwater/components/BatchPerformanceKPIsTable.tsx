import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatFallback } from '@/lib/formatFallback';
import type { BatchPerformanceKPI } from '../types';
import {
  getFreshwaterMortalityAlertLevel,
  getFreshwaterTGCAlertLevel,
  getAlertColorClass,
} from '../utils/performanceThresholds';

interface BatchPerformanceKPIsTableProps {
  data: BatchPerformanceKPI[];
  isLoading: boolean;
}

export function BatchPerformanceKPIsTable({ data, isLoading }: BatchPerformanceKPIsTableProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch</TableHead>
            <TableHead>Station</TableHead>
            <TableHead className="text-right">Avg Weight (g)</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Biomass (kg)</TableHead>
            <TableHead className="text-right">14d Mort%</TableHead>
            <TableHead className="text-right">30d Mort%</TableHead>
            <TableHead className="text-right">90d Mort%</TableHead>
            <TableHead className="text-right">90d TGC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                No batch performance data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.batch_id}>
                <TableCell className="font-medium">{row.batch_number}</TableCell>
                <TableCell>{row.station_name}</TableCell>
                <TableCell className="text-right">
                  {formatFallback(row.avg_weight_g, '', { precision: 1 })}
                </TableCell>
                <TableCell className="text-right">
                  {formatFallback(row.count, '', { precision: 0 })}
                </TableCell>
                <TableCell className="text-right">
                  {formatFallback(row.biomass_kg, '', { precision: 0 })}
                </TableCell>
                <TableCell className={`text-right ${getAlertColorClass(getFreshwaterMortalityAlertLevel(row.mortality_14d_pct, '14d'))}`}>
                  {formatFallback(row.mortality_14d_pct, '%', { precision: 2 })}
                </TableCell>
                <TableCell className={`text-right ${getAlertColorClass(getFreshwaterMortalityAlertLevel(row.mortality_30d_pct, '30d'))}`}>
                  {formatFallback(row.mortality_30d_pct, '%', { precision: 2 })}
                </TableCell>
                <TableCell className={`text-right ${getAlertColorClass(getFreshwaterMortalityAlertLevel(row.mortality_90d_pct, '90d'))}`}>
                  {formatFallback(row.mortality_90d_pct, '%', { precision: 2 })}
                </TableCell>
                <TableCell className={`text-right font-medium ${getAlertColorClass(getFreshwaterTGCAlertLevel(row.tgc_90d))}`}>
                  {formatFallback(row.tgc_90d, '', { precision: 2 })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

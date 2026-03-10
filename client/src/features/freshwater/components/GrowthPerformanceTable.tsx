import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatFallback } from '@/lib/formatFallback';
import type { GrowthPerformanceRow } from '../types';
import { getFreshwaterFCRAlertLevel, getAlertColorClass } from '../utils/performanceThresholds';

interface GrowthPerformanceTableProps {
  data: GrowthPerformanceRow[];
  isLoading: boolean;
}

export function GrowthPerformanceTable({ data, isLoading }: GrowthPerformanceTableProps) {
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
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Biomass (kg)</TableHead>
            <TableHead className="text-right">Primo (g)</TableHead>
            <TableHead className="text-right">Current (g)</TableHead>
            <TableHead className="text-right">SGR</TableHead>
            <TableHead className="text-right">Feed (kg)</TableHead>
            <TableHead className="text-right">FCR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                No growth performance data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const fcrLevel = getFreshwaterFCRAlertLevel(row.fcr);
              return (
                <TableRow key={row.batch_id}>
                  <TableCell className="font-medium">{row.batch_number}</TableCell>
                  <TableCell>{row.station_name}</TableCell>
                  <TableCell className="text-right">
                    {formatFallback(row.count, '', { precision: 0 })}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatFallback(row.biomass_kg, '', { precision: 0 })}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatFallback(row.primo_weight_g, '', { precision: 1 })}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatFallback(row.current_weight_g, '', { precision: 1 })}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatFallback(row.sgr, '', { precision: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatFallback(row.feed_kg, '', { precision: 0 })}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${getAlertColorClass(fcrLevel)}`}>
                    {formatFallback(row.fcr, '', { precision: 2 })}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

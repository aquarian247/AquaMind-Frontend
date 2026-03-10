import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatFallback } from '@/lib/formatFallback';
import type { FacilityOverviewRow } from '../types';
import { getFreshwaterMortalityAlertLevel, getAlertColorClass } from '../utils/performanceThresholds';

interface FacilityOverviewTableProps {
  data: FacilityOverviewRow[];
  isLoading: boolean;
}

export function FacilityOverviewTable({ data, isLoading }: FacilityOverviewTableProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded" />
        ))}
      </div>
    );
  }

  const grandTotal = data.reduce(
    (acc, row) => ({
      avg_weight_g: null as number | null,
      count_millions: (acc.count_millions ?? 0) + (row.count_millions ?? 0),
      biomass_tons: (acc.biomass_tons ?? 0) + (row.biomass_tons ?? 0),
      feed_tons: (acc.feed_tons ?? 0) + (row.feed_tons ?? 0),
      mortality_count: (acc.mortality_count ?? 0) + (row.mortality_count ?? 0),
    }),
    { avg_weight_g: null as number | null, count_millions: 0, biomass_tons: 0, feed_tons: 0, mortality_count: 0 }
  );

  if (data.length > 0) {
    const totalBiomassKg = data.reduce((s, r) => s + (r.biomass_tons ?? 0) * 1000, 0);
    const totalPop = data.reduce((s, r) => s + (r.count_millions ?? 0) * 1_000_000, 0);
    grandTotal.avg_weight_g = totalPop > 0 ? (totalBiomassKg * 1000) / totalPop : null;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Facility</TableHead>
            <TableHead className="text-right">Avg Weight (g)</TableHead>
            <TableHead className="text-right">Count (M)</TableHead>
            <TableHead className="text-right">Biomass (t)</TableHead>
            <TableHead className="text-right">Feed (t)</TableHead>
            <TableHead className="text-right">Mortality</TableHead>
            <TableHead className="text-right">Mortality %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No freshwater station data available
              </TableCell>
            </TableRow>
          ) : (
            <>
              {data.map((row) => {
                const mortalityLevel = getFreshwaterMortalityAlertLevel(row.mortality_percentage, '30d');
                return (
                  <TableRow key={row.station_id}>
                    <TableCell className="font-medium">{row.station_name}</TableCell>
                    <TableCell className="text-right">
                      {formatFallback(row.avg_weight_g, 'g', { precision: 1 })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatFallback(row.count_millions, '', { precision: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatFallback(row.biomass_tons, '', { precision: 1 })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatFallback(row.feed_tons, '', { precision: 1 })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatFallback(row.mortality_count, '', { precision: 0 })}
                    </TableCell>
                    <TableCell className={`text-right ${getAlertColorClass(mortalityLevel)}`}>
                      {formatFallback(row.mortality_percentage, '%', { precision: 2 })}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Grand Total</TableCell>
                <TableCell className="text-right">
                  {formatFallback(grandTotal.avg_weight_g, 'g', { precision: 1 })}
                </TableCell>
                <TableCell className="text-right">
                  {formatFallback(grandTotal.count_millions, '', { precision: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  {formatFallback(grandTotal.biomass_tons, '', { precision: 1 })}
                </TableCell>
                <TableCell className="text-right">
                  {formatFallback(grandTotal.feed_tons, '', { precision: 1 })}
                </TableCell>
                <TableCell className="text-right">
                  {formatFallback(grandTotal.mortality_count, '', { precision: 0 })}
                </TableCell>
                <TableCell className="text-right">N/A</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

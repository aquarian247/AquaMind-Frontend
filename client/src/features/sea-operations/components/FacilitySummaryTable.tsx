import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatFallback } from '@/lib/formatFallback';
import type { AreaFacilitySummary } from '../types';
import { getMatureLiceAlertLevel, getLiceColorClass } from '../utils/liceThresholds';

interface FacilitySummaryTableProps {
  data: AreaFacilitySummary[];
  isLoading: boolean;
}

export function FacilitySummaryTable({ data, isLoading }: FacilitySummaryTableProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-muted rounded" />)}
      </div>
    );
  }

  const activeFacilities = data.filter(f => (f.biomass_tons ?? 0) > 0 || (f.ring_count ?? 0) > 0);

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Facility</TableHead>
            <TableHead className="text-right">Biomass (t)</TableHead>
            <TableHead className="text-right">Avg Weight (kg)</TableHead>
            <TableHead className="text-right">TGC</TableHead>
            <TableHead className="text-right">FCR</TableHead>
            <TableHead className="text-right">Mortality (%)</TableHead>
            <TableHead className="text-right">Mature Lice</TableHead>
            <TableHead className="text-right">Rings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeFacilities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No active sea area data available
              </TableCell>
            </TableRow>
          ) : (
            activeFacilities.map((f) => {
              const liceLevel = getMatureLiceAlertLevel(f.mature_lice);
              return (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell className="text-right">{formatFallback(f.biomass_tons, '', { precision: 0 })}</TableCell>
                  <TableCell className="text-right">{formatFallback(f.avg_weight_kg, '', { precision: 2 })}</TableCell>
                  <TableCell className="text-right">{formatFallback(f.tgc, '', { precision: 2 })}</TableCell>
                  <TableCell className="text-right">{formatFallback(f.fcr, '', { precision: 2 })}</TableCell>
                  <TableCell className="text-right">{formatFallback(f.mortality_pct, '%', { precision: 1 })}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${getLiceColorClass(liceLevel)}`}>
                      {formatFallback(f.mature_lice, '', { precision: 2 })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatFallback(f.ring_count, '', { precision: 0 })}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

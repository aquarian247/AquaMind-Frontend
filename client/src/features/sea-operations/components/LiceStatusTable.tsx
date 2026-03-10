import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatFallback } from '@/lib/formatFallback';
import type { LiceStatusRow } from '../types';
import { getLiceColorClass } from '../utils/liceThresholds';

interface LiceStatusTableProps {
  data: LiceStatusRow[];
  isLoading: boolean;
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' {
  if (status === 'critical') return 'destructive';
  if (status === 'warning') return 'secondary';
  return 'default';
}

export function LiceStatusTable({ data, isLoading }: LiceStatusTableProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-muted rounded" />)}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Area</TableHead>
            <TableHead className="text-right">Mature</TableHead>
            <TableHead className="text-right">Movable</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Fish Sampled</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No lice data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.area_id}>
                <TableCell className="font-medium">{row.area_name}</TableCell>
                <TableCell className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${getLiceColorClass(row.alert_level)}`}>
                    {formatFallback(row.mature_lice, '', { precision: 2 })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {formatFallback(row.movable_lice, '', { precision: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  {formatFallback(row.total_lice, '', { precision: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  {formatFallback(row.fish_sampled, '', { precision: 0 })}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(row.status)}>
                    {row.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

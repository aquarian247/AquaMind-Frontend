import { format } from "date-fns";
import { Eye, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TypeBadge } from "./TypeBadge";
import { EmptyState } from "./EmptyState";

// Generic history record type (will be more specific based on the actual API response)
interface HistoryRecord {
  id: number;
  history_id?: number;
  history_date: string;
  history_user: string;
  history_type: '+' | '~' | '-';
  history_change_reason?: string;
  name?: string;
  // Add other common fields that might exist
  [key: string]: any;
}

interface HistoryTableProps {
  data?: {
    results: any[];
    count: number;
    next?: string | null;
    previous?: string | null;
  };
  isLoading?: boolean;
  onViewDetail?: (record: any) => void;
  className?: string;
}

export function HistoryTable({
  data,
  isLoading,
  onViewDetail,
  className
}: HistoryTableProps) {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || !data.results || data.results.length === 0) {
    return <EmptyState className={className} />;
  }

  const formatEntityName = (record: HistoryRecord): string => {
    // Try different field names that might contain the entity name
    return record.name ||
           record.title ||
           record.batch_number ||
           record.area_name ||
           record.station_name ||
           record.container_name ||
           record.username ||
           `Record #${record.id}`;
  };

  const formatEntityType = (record: HistoryRecord): string => {
    // Extract model type from the record structure
    // This is a simplified approach - in a real implementation,
    // you might want to pass the model type as a prop
    if (record.batch_number) return 'Batch';
    if (record.area_name) return 'Area';
    if (record.station_name) return 'Station';
    if (record.container_name) return 'Container';
    if (record.username) return 'User';
    return 'Record';
  };

  return (
    <div className={`rounded-md border ${className || ''}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">
              <div className="flex items-center gap-2">
                Date
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead className="max-w-[200px]">Reason</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.results.map((record) => (
            <TableRow key={record.history_id || record.id}>
              <TableCell className="font-mono text-sm">
                {format(new Date(record.history_date), "MMM dd, yyyy HH:mm")}
              </TableCell>
              <TableCell>
                <div className="font-medium">{record.history_user}</div>
              </TableCell>
              <TableCell>
                <TypeBadge type={record.history_type} />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{formatEntityName(record)}</div>
                  <Badge variant="outline" className="text-xs">
                    {formatEntityType(record)}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <div className="truncate text-sm text-muted-foreground">
                  {record.history_change_reason || "N/A"}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetail?.(record)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination info */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/50">
        <div className="text-sm text-muted-foreground">
          Showing {data.results.length} of {data.count} records
        </div>
        <div className="text-sm text-muted-foreground">
          Page {Math.ceil((data.results.length > 0 ? 1 : 0))} of {Math.ceil(data.count / 25)}
        </div>
      </div>
    </div>
  );
}

import { format } from "date-fns";
import { Eye, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
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
import { HistoryRecord } from "../api/api";

interface HistoryTableProps {
  data?: {
    results: any[];
    count: number;
    next?: string | null;
    previous?: string | null;
  };
  isLoading?: boolean;
  onViewDetail?: (record: any) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onGoToPage?: (page: number) => void;
  currentPage?: number;
  pageSize?: number;
  className?: string;
}

export function HistoryTable({
  data,
  isLoading,
  onViewDetail,
  onNextPage,
  onPrevPage,
  onGoToPage,
  currentPage = 1,
  pageSize = 25,
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
              <TableCell className="text-sm">
                {format(new Date(record.history_date), "MMM dd, yyyy HH:mm")}
              </TableCell>
              <TableCell>
                <div className="font-medium">{record.history_user || "N/A"}</div>
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

      {/* Pagination controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/50">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, data.count)} of {data.count} records
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={!data.previous || currentPage <= 1}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground px-2">
            Page {currentPage} of {Math.ceil(data.count / pageSize)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={!data.next}
            className="h-8"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

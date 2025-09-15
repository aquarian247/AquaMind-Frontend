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
import { TableLoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { HistoryRecord, ApiError } from "../api/api";

interface HistoryTableProps {
  data?: {
    results: any[];
    count: number;
    next?: string | null;
    previous?: string | null;
  };
  isLoading?: boolean;
  error?: ApiError | unknown;
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
  error,
  onViewDetail,
  onNextPage,
  onPrevPage,
  onGoToPage,
  currentPage = 1,
  pageSize = 25,
  className
}: HistoryTableProps) {
  // Show error state if there's an error
  if (error) {
    const apiError = error as ApiError;
    return (
      <ErrorState
        error={apiError}
        statusCode={apiError.statusCode}
        className={className}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return <TableLoadingState className={className} />;
  }

  // Show empty state if no data
  if (!data || !data.results || data.results.length === 0) {
    return <EmptyState className={className} />;
  }

  const formatEntityName = (record: HistoryRecord): string => {
    // Try different field names that might contain the entity name
    // For user profiles, prioritize username and user_full_name from User model
    if ((record as any).username) {
      return (record as any).username;
    }
    if ((record as any).user_full_name) {
      return (record as any).user_full_name;
    }

    // For user profiles, if we don't have username, show a meaningful identifier
    if (record.full_name) {
      return record.full_name;
    }

    return record.name ||
           record.title ||
           record.batch_number ||
           record.area_name ||
           record.station_name ||
           record.container_name ||
           record.username ||
           `Profile ${record.id}`;
  };

  const formatEntityType = (record: HistoryRecord): string => {
    // Extract model type from the record structure
    // This is a simplified approach - in a real implementation,
    // you might want to pass the model type as a prop
    if (record.batch_number) return 'Batch';
    if (record.area_name) return 'Area';
    if (record.station_name) return 'Station';
    if (record.container_name) return 'Container';
    if ((record as any).username) return 'User';
    if (record.username) return 'User';
    if (record.full_name) return 'User Profile';
    if (record.job_title || record.department || record.geography || record.role) return 'User Profile';
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
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {formatEntityType(record)}
                    </Badge>
                    {record.role && (
                      <Badge variant="secondary" className="text-xs">
                        {record.role}
                      </Badge>
                    )}
                    {record.department && (
                      <Badge variant="secondary" className="text-xs">
                        {record.department}
                      </Badge>
                    )}
                  </div>
                  {/* Show additional user info for user profiles */}
                  {(record as any).email && (
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {(record as any).email}
                    </div>
                  )}
                  {!record.full_name && record.job_title && (
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {record.job_title}
                      {record.department && ` • ${record.department}`}
                    </div>
                  )}
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

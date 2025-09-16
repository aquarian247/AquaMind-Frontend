import { useState } from "react";
import { format } from "date-fns";
import { Eye, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
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

/**
 * Enhanced HistoryTable with support for UserProfileHistory fields:
 * - username: User's login name (e.g., "john.doe")
 * - email: User's email address (e.g., "john.doe@company.com")
 * - user_full_name: Full name from User model (e.g., "John Doe")
 *
 * These fields are now properly included in UserProfileHistory API responses
 * and provide meaningful user identification instead of generic "Record #X".
 */

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'date' | 'user' | 'type' | 'entity' | null;

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
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Helper functions - defined before sorting logic
  const formatEntityName = (record: HistoryRecord): string => {
    // Check if this is a UserProfileHistory record with the new fields
    const userRecord = record as any;
    if (userRecord.username) {
      return userRecord.username;
    }
    if (userRecord.user_full_name) {
      return userRecord.user_full_name;
    }

    // For user profiles, if we don't have username, show a meaningful identifier
    if (record.full_name) {
      return record.full_name;
    }

    // Enhanced entity name formatting with priority-based field selection
    const nameFields = [
      'name', 'title', 'batch_number', 'area_name', 'station_name',
      'container_name', 'username', 'feed_name', 'scenario_name',
      'journal_entry_title', 'geography_name', 'container_type_name'
    ];

    for (const field of nameFields) {
      if ((record as any)[field]) {
        return String((record as any)[field]);
      }
    }

    // Fallback with better formatting
    return `Record ${record.id || 'Unknown'}`;
  };

  // Sorting functions
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction or reset to null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  // Sort the data based on current sort settings
  const sortedData = data?.results ? [...data.results].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'date':
        aValue = new Date(a.history_date).getTime();
        bValue = new Date(b.history_date).getTime();
        break;
      case 'user':
        aValue = (a.history_user || '').toLowerCase();
        bValue = (b.history_user || '').toLowerCase();
        break;
      case 'type':
        aValue = a.history_type || '';
        bValue = b.history_type || '';
        break;
      case 'entity':
        aValue = formatEntityName(a).toLowerCase();
        bValue = formatEntityName(b).toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }) : [];
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

  const formatEntityType = (record: HistoryRecord): string => {
    // Enhanced entity type detection with comprehensive field mapping
    const userRecord = record as any;

    // User-related records
    if (userRecord.username || userRecord.email || userRecord.user_full_name ||
        userRecord.full_name || userRecord.job_title || userRecord.department ||
        userRecord.geography || userRecord.role) {
      return 'User Profile';
    }

    // Domain-specific entity types
    const typeMappings: Record<string, string> = {
      // Batch domain
      batch_number: 'Batch',
      species_name: 'Batch',
      current_lifecycle_stage: 'Batch',

      // Infrastructure domain
      area_name: 'Area',
      station_name: 'Station',
      freshwater_station_name: 'Station',
      hall_name: 'Hall',
      container_name: 'Container',
      container_type_name: 'Container Type',
      sensor_name: 'Sensor',

      // Inventory domain
      feed_name: 'Feed Stock',
      feed_container_name: 'Feed Container',

      // Health domain
      journal_entry_title: 'Health Journal',
      health_lab_sample_type: 'Lab Sample',
      lice_count_value: 'Lice Count',
      mortality_record_cause: 'Mortality Record',
      treatment_type_name: 'Treatment',

      // Scenario domain
      scenario_name: 'Scenario',
      fcr_model_name: 'FCR Model',
      mortality_model_name: 'Mortality Model',
      tgc_model_name: 'TGC Model'
    };

    // Check for specific field indicators
    for (const [field, type] of Object.entries(typeMappings)) {
      if ((record as any)[field]) {
        return type;
      }
    }

    // Fallback based on common patterns
    if (record.name) {
      // Try to infer type from name patterns
      const name = String(record.name).toLowerCase();
      if (name.includes('batch')) return 'Batch';
      if (name.includes('area')) return 'Area';
      if (name.includes('station')) return 'Station';
      if (name.includes('container')) return 'Container';
      if (name.includes('feed')) return 'Feed Stock';
      if (name.includes('scenario')) return 'Scenario';
      if (name.includes('journal') || name.includes('health')) return 'Health Journal';
    }

    return 'Record';
  };

  const getEntitySummaryDetails = (record: HistoryRecord): string[] => {
    const details: string[] = [];
    const rec = record as any;

    // Add contextual information based on entity type
    switch (formatEntityType(record)) {
      case 'Batch':
        if (rec.species_name) details.push(`Species: ${rec.species_name}`);
        if (rec.current_lifecycle_stage) details.push(`Stage: ${rec.current_lifecycle_stage}`);
        break;
      case 'Area':
        if (rec.geography_name) details.push(`Location: ${rec.geography_name}`);
        break;
      case 'Station':
        if (rec.area_name) details.push(`Area: ${rec.area_name}`);
        if (rec.geography_name) details.push(`Location: ${rec.geography_name}`);
        break;
      case 'Container':
        if (rec.station_name) details.push(`Station: ${rec.station_name}`);
        if (rec.container_type_name) details.push(`Type: ${rec.container_type_name}`);
        break;
      case 'User Profile':
        if (rec.role) details.push(`Role: ${rec.role}`);
        if (rec.department) details.push(`Dept: ${rec.department}`);
        if (rec.email && rec.email !== rec.username) details.push(`Email: ${rec.email}`);
        break;
      case 'Health Journal':
        if (rec.health_lab_sample_type) details.push(`Sample: ${rec.health_lab_sample_type}`);
        break;
      case 'Feed Stock':
        if (rec.feed_container_name) details.push(`Container: ${rec.feed_container_name}`);
        break;
    }

    return details.slice(0, 2); // Limit to 2 details for space
  };

  return (
    <div className={`rounded-md border overflow-hidden ${className || ''}`}>
      <div className="overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px] sm:w-[180px] whitespace-nowrap">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-medium hover:bg-transparent w-full justify-start"
                onClick={() => handleSort('date')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSort('date');
                  }
                }}
                aria-label={`Sort by date ${sortField === 'date' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : '') : ''}`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">Date</span>
                  <span className="sm:hidden">Date</span>
                  {getSortIcon('date')}
                </div>
              </Button>
            </TableHead>
            <TableHead className="w-[100px] sm:w-auto whitespace-nowrap">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-medium hover:bg-transparent w-full justify-start"
                onClick={() => handleSort('user')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSort('user');
                  }
                }}
                aria-label={`Sort by user ${sortField === 'user' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : '') : ''}`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  User
                  {getSortIcon('user')}
                </div>
              </Button>
            </TableHead>
            <TableHead className="w-[80px] sm:w-[100px] whitespace-nowrap">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-medium hover:bg-transparent w-full justify-start"
                onClick={() => handleSort('type')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSort('type');
                  }
                }}
                aria-label={`Sort by type ${sortField === 'type' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : '') : ''}`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  Type
                  {getSortIcon('type')}
                </div>
              </Button>
            </TableHead>
            <TableHead className="min-w-[120px] whitespace-nowrap">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-medium hover:bg-transparent w-full justify-start"
                onClick={() => handleSort('entity')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSort('entity');
                  }
                }}
                aria-label={`Sort by entity ${sortField === 'entity' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : '') : ''}`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  Entity
                  {getSortIcon('entity')}
                </div>
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell max-w-[200px] whitespace-nowrap">Reason</TableHead>
            <TableHead className="w-[80px] sm:w-[100px] whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((record) => (
            <TableRow key={record.history_id || record.id}>
              <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                <div className="hidden sm:block">
                  {format(new Date(record.history_date), "MMM dd, yyyy HH:mm")}
                </div>
                <div className="sm:hidden">
                  {format(new Date(record.history_date), "MM/dd HH:mm")}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="font-medium text-sm truncate max-w-[100px] sm:max-w-none" title={record.history_user || "N/A"}>
                  {record.history_user || "N/A"}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <TypeBadge type={record.history_type} />
              </TableCell>
              <TableCell className="min-w-[120px]">
                <div className="space-y-1">
                  <div className="font-medium truncate max-w-[200px]" title={formatEntityName(record)}>
                    {formatEntityName(record)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {formatEntityType(record)}
                    </Badge>
                    {getEntitySummaryDetails(record).map((detail, index) => (
                      <Badge key={index} variant="secondary" className="text-xs truncate max-w-[120px]" title={detail}>
                        {detail}
                      </Badge>
                    ))}
                  </div>
                  {/* Enhanced user info display with better formatting */}
                  {formatEntityType(record) === 'User Profile' && (
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {(record as any).email && (record as any).email !== (record as any).username && (
                        <div className="truncate max-w-[200px]" title={(record as any).email}>
                          📧 {(record as any).email}
                        </div>
                      )}
                      {(record as any).user_full_name && (record as any).username !== (record as any).user_full_name && (
                        <div className="truncate max-w-[200px]" title={(record as any).user_full_name}>
                          👤 {(record as any).user_full_name}
                        </div>
                      )}
                      {!record.full_name && !(record as any).user_full_name && record.job_title && (
                        <div className="truncate max-w-[200px]" title={`${record.job_title}${record.department ? ` • ${record.department}` : ''}`}>
                          💼 {record.job_title}
                          {record.department && ` • ${record.department}`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-[200px]">
                <div className="truncate text-sm text-muted-foreground" title={record.history_change_reason || "N/A"}>
                  {record.history_change_reason || "N/A"}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetail?.(record)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onViewDetail?.(record);
                    }
                  }}
                  className="h-8 w-8 p-0"
                  aria-label={`View details for ${formatEntityName(record)}`}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View details for {formatEntityName(record)}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>

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
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPrevPage?.();
              }
            }}
            disabled={!data.previous || currentPage <= 1}
            className="h-8"
            aria-label={`Go to previous page (${currentPage - 1})`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground px-2" aria-live="polite">
            Page {currentPage} of {Math.ceil(data.count / pageSize)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNextPage?.();
              }
            }}
            disabled={!data.next}
            className="h-8"
            aria-label={`Go to next page (${currentPage + 1})`}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

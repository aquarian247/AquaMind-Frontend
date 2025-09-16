import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, X, Filter, Clock, Zap } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { HistoryFilterState, HistoryType } from "../hooks/useHistoryFilters";

interface FilterBarProps {
  filters: HistoryFilterState;
  onFiltersChange: (filters: Partial<HistoryFilterState>) => void;
  onResetFilters: () => void;
  className?: string;
}

export function FilterBar({
  filters,
  onFiltersChange,
  onResetFilters,
  className
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = !!(
    filters.dateFrom ||
    filters.dateTo ||
    filters.historyUser ||
    filters.historyType
  );

  const handleDateFromChange = (date: Date | undefined) => {
    onFiltersChange({
      dateFrom: date ? format(date, "yyyy-MM-dd") : undefined
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    onFiltersChange({
      dateTo: date ? format(date, "yyyy-MM-dd") : undefined
    });
  };

  const handleUserChange = (value: string) => {
    onFiltersChange({ historyUser: value || undefined });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      historyType: value === "all" ? undefined : value as HistoryType
    });
  };

  const clearDateFrom = () => {
    onFiltersChange({ dateFrom: undefined });
  };

  const clearDateTo = () => {
    onFiltersChange({ dateTo: undefined });
  };

  // Quick filter presets
  const applyQuickFilter = (preset: string) => {
    const now = new Date();
    switch (preset) {
      case 'today':
        onFiltersChange({
          dateFrom: format(startOfDay(now), "yyyy-MM-dd"),
          dateTo: format(endOfDay(now), "yyyy-MM-dd")
        });
        break;
      case 'yesterday':
        const yesterday = subDays(now, 1);
        onFiltersChange({
          dateFrom: format(startOfDay(yesterday), "yyyy-MM-dd"),
          dateTo: format(endOfDay(yesterday), "yyyy-MM-dd")
        });
        break;
      case 'last7days':
        onFiltersChange({
          dateFrom: format(subDays(now, 7), "yyyy-MM-dd"),
          dateTo: format(now, "yyyy-MM-dd")
        });
        break;
      case 'last30days':
        onFiltersChange({
          dateFrom: format(subDays(now, 30), "yyyy-MM-dd"),
          dateTo: format(now, "yyyy-MM-dd")
        });
        break;
      case 'thisWeek':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        onFiltersChange({
          dateFrom: format(startOfWeek, "yyyy-MM-dd"),
          dateTo: format(now, "yyyy-MM-dd")
        });
        break;
      case 'thisMonth':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        onFiltersChange({
          dateFrom: format(startOfMonth, "yyyy-MM-dd"),
          dateTo: format(now, "yyyy-MM-dd")
        });
        break;
    }
  };

  const clearDateRange = () => {
    onFiltersChange({ dateFrom: undefined, dateTo: undefined });
  };

  const clearUserFilter = () => {
    onFiltersChange({ historyUser: undefined });
  };

  const clearTypeFilter = () => {
    onFiltersChange({ historyType: undefined });
  };

  return (
    <div
      className={`border rounded-lg p-4 bg-card ${className || ''}`}
      role="region"
      aria-labelledby="filter-section-heading"
      aria-describedby="filter-status"
    >
      <h3 id="filter-section-heading" className="sr-only">Audit Trail Filters</h3>
      <div
        id="filter-status"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {hasActiveFilters ? 'Filters are currently active' : 'No filters are currently active'}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filter Presets */}
      <div className="mb-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <Zap className="h-3 w-3" />
          <span>Quick filters:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs flex-shrink-0"
            onClick={() => applyQuickFilter('today')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyQuickFilter('today');
              }
            }}
            aria-label="Filter to show records from today"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs flex-shrink-0"
            onClick={() => applyQuickFilter('yesterday')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyQuickFilter('yesterday');
              }
            }}
            aria-label="Filter to show records from yesterday"
          >
            Yesterday
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs flex-shrink-0"
            onClick={() => applyQuickFilter('last7days')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyQuickFilter('last7days');
              }
            }}
            aria-label="Filter to show records from the last 7 days"
          >
            Last 7 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs flex-shrink-0 sm:inline-flex"
            onClick={() => applyQuickFilter('last30days')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyQuickFilter('last30days');
              }
            }}
            aria-label="Filter to show records from the last 30 days"
          >
            <span className="hidden sm:inline">Last 30 days</span>
            <span className="sm:hidden">30d</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs flex-shrink-0 sm:inline-flex"
            onClick={() => applyQuickFilter('thisWeek')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyQuickFilter('thisWeek');
              }
            }}
            aria-label="Filter to show records from this week"
          >
            <span className="hidden sm:inline">This week</span>
            <span className="sm:hidden">Week</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs flex-shrink-0 sm:inline-flex"
            onClick={() => applyQuickFilter('thisMonth')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyQuickFilter('thisMonth');
              }
            }}
            aria-label="Filter to show records from this month"
          >
            <span className="hidden sm:inline">This month</span>
            <span className="sm:hidden">Month</span>
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-3 w-3" />
            <span>Active filters:</span>
          </div>
          {filters.dateFrom && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              From: {format(new Date(filters.dateFrom), "MMM dd, yyyy")}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={clearDateFrom}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              To: {format(new Date(filters.dateTo), "MMM dd, yyyy")}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={clearDateTo}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.historyUser && (
            <Badge variant="secondary" className="flex items-center gap-1">
              User: {filters.historyUser}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={clearUserFilter}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.historyType && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {filters.historyType === '+' ? 'Created' : filters.historyType === '~' ? 'Updated' : 'Deleted'}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={clearTypeFilter}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs hover:bg-destructive hover:text-destructive-foreground"
            onClick={clearDateRange}
          >
            Clear dates
          </Button>
        </div>
      )}

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date From */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">From Date</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? (
                      format(new Date(filters.dateFrom), "PPP")
                    ) : (
                      "Pick a date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                    onSelect={handleDateFromChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {filters.dateFrom && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDateFrom}
                  className="px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">To Date</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? (
                      format(new Date(filters.dateTo), "PPP")
                    ) : (
                      "Pick a date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                    onSelect={handleDateToChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {filters.dateTo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDateTo}
                  className="px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Username Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Username</Label>
            <Input
              placeholder="Filter by username..."
              value={filters.historyUser || ""}
              onChange={(e) => handleUserChange(e.target.value)}
            />
          </div>

          {/* Change Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Change Type</Label>
            <Select
              value={filters.historyType || "all"}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="+">Created</SelectItem>
                <SelectItem value="~">Updated</SelectItem>
                <SelectItem value="-">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Size Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Page Size</Label>
            <Select
              value={filters.pageSize?.toString() || "25"}
              onValueChange={(value) => onFiltersChange({ pageSize: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="25" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

export const MemoizedFilterBar = memo(FilterBar);

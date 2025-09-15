import { useState } from "react";
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
import { CalendarIcon, X, Filter } from "lucide-react";
import { format } from "date-fns";
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

  return (
    <div className={`border rounded-lg p-4 bg-card ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
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

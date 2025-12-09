/**
 * Planned Activity Filters Component
 *
 * Multi-select filters for activity type, status, batch, and date range.
 * Used in Production Planner page to filter timeline view.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { getActivityTypeOptions, getStatusOptions } from '../utils/activityHelpers';
import type { ActivityFilters, ActivityType, ActivityStatus } from '../types';

interface PlannedActivityFiltersProps {
  filters: ActivityFilters;
  onFilterChange: (filters: ActivityFilters) => void;
  batches?: Array<{ id: number; batch_number: string }>;
}

export function PlannedActivityFilters({
  filters,
  onFilterChange,
  batches = [],
}: PlannedActivityFiltersProps) {
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');

  const activityTypeOptions = getActivityTypeOptions();
  const statusOptions = getStatusOptions();

  const handleAddActivityType = (value: string) => {
    if (value && !filters.activityTypes.includes(value as ActivityType)) {
      onFilterChange({
        ...filters,
        activityTypes: [...filters.activityTypes, value as ActivityType],
      });
      setSelectedActivityType('');
    }
  };

  const handleRemoveActivityType = (value: ActivityType) => {
    onFilterChange({
      ...filters,
      activityTypes: filters.activityTypes.filter((t) => t !== value),
    });
  };

  const handleAddStatus = (value: string) => {
    if (value && !filters.statuses.includes(value as ActivityStatus)) {
      onFilterChange({
        ...filters,
        statuses: [...filters.statuses, value as ActivityStatus],
      });
      setSelectedStatus('');
    }
  };

  const handleRemoveStatus = (value: ActivityStatus) => {
    onFilterChange({
      ...filters,
      statuses: filters.statuses.filter((s) => s !== value),
    });
  };

  const handleAddBatch = (value: string) => {
    const batchId = parseInt(value, 10);
    if (!isNaN(batchId) && !filters.batches.includes(batchId)) {
      onFilterChange({
        ...filters,
        batches: [...filters.batches, batchId],
      });
      setSelectedBatch('');
    }
  };

  const handleRemoveBatch = (batchId: number) => {
    onFilterChange({
      ...filters,
      batches: filters.batches.filter((b) => b !== batchId),
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      activityTypes: [],
      statuses: [],
      batches: [],
      dateRange: { start: null, end: null },
      showOverdueOnly: false,
    });
  };

  const hasActiveFilters =
    filters.activityTypes.length > 0 ||
    filters.statuses.length > 0 ||
    filters.batches.length > 0 ||
    filters.dateRange.start !== null ||
    filters.dateRange.end !== null ||
    filters.showOverdueOnly;

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Activity Type Filter */}
        <div className="space-y-2">
          <Label className="text-xs">Activity Type</Label>
          <Select value={selectedActivityType} onValueChange={handleAddActivityType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {activityTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.activityTypes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.activityTypes.map((type) => {
                const option = activityTypeOptions.find((o) => o.value === type);
                return (
                  <div
                    key={type}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                  >
                    {option?.label || type}
                    <button
                      onClick={() => handleRemoveActivityType(type)}
                      className="hover:bg-primary/20 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-xs">Status</Label>
          <Select value={selectedStatus} onValueChange={handleAddStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.statuses.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.statuses.map((status) => {
                const option = statusOptions.find((o) => o.value === status);
                return (
                  <div
                    key={status}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded"
                  >
                    {option?.label || status}
                    <button
                      onClick={() => handleRemoveStatus(status)}
                      className="hover:bg-secondary/20 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Batch Filter */}
        <div className="space-y-2">
          <Label className="text-xs">Batch</Label>
          <Select value={selectedBatch} onValueChange={handleAddBatch}>
            <SelectTrigger>
              <SelectValue placeholder="Select batch..." />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id.toString()}>
                  {batch.batch_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.batches.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.batches.map((batchId) => {
                const batch = batches.find((b) => b.id === batchId);
                return (
                  <div
                    key={batchId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                  >
                    {batch?.batch_number || `Batch ${batchId}`}
                    <button
                      onClick={() => handleRemoveBatch(batchId)}
                      className="hover:bg-accent/20 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


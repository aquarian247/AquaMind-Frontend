# Finance Reporting Frontend Implementation Plan

**Created**: 2025-10-11  
**Status**: Planning Phase  
**Related Backend**: `feature/inventory-finance-aggregation-enhancements` (Phases 1-7 Complete)

---

## Executive Summary

This plan outlines the frontend implementation for the **Finance Reporting** feature, leveraging the newly completed backend finance aggregation endpoints. The feature provides CFO, Finance Managers, and BI Personnel with powerful multi-dimensional cost analysis capabilities through a user-friendly interface.

### Key Backend Capabilities Available

✅ **Backend Ready** (0.018s for 10k events, 6 queries):
- 32 filter parameters (geographic, nutritional, cost, time)
- Multi-dimensional breakdowns (feed type, geography, area, container)
- Time series analysis (daily/weekly/monthly)
- Full TypeScript client generated: `ApiService.feedingEventsFinanceReport()`

### User Personas Served

**Primary**: CFO (Jordan), Finance Manager, Finance/BI Personnel  
**Secondary**: Oversight Managers (for cost-aware decisions)

---

## Architecture Overview

### Feature Slice Structure

```
client/src/features/finance-reporting/
├── api.ts                          # TanStack Query hooks
├── hooks/
│   ├── useFinanceFilters.ts        # Multi-dimensional filter state management
│   ├── useFinanceReport.ts         # Report data + formatting
│   └── useFinanceChartData.ts      # Chart data transformations
├── pages/
│   └── FinanceReportingPage.tsx    # Main page (120-150 LOC)
├── components/
│   ├── FinanceFilterPanel.tsx      # Filter UI (200-250 LOC)
│   ├── FinanceSummaryCards.tsx     # KPI cards (150 LOC)
│   ├── FeedTypeCostChart.tsx       # Feed type breakdown chart (150 LOC)
│   ├── GeographicCostChart.tsx     # Geography breakdown chart (150 LOC)
│   ├── TimeTrendChart.tsx          # Time series chart (150 LOC)
│   ├── BreakdownTables.tsx         # Detailed breakdown tables (200 LOC)
│   └── ExportDialog.tsx            # Export options dialog (100 LOC)
├── types.ts                        # Feature-specific types
└── index.ts                        # Barrel export
```

**Total Estimated**: ~1,500 LOC across 15 files  
**Complexity**: Medium-High (multi-dimensional filtering, chart integration)

---

## Phase 1: Core Infrastructure (8 hours)

### Task 1.1: Feature Slice Setup (1 hour)

**Files to Create**:
- `features/finance-reporting/index.ts`
- `features/finance-reporting/types.ts`
- `features/finance-reporting/api.ts`

**TypeScript Types** (`types.ts`):
```typescript
export interface FinanceFilters {
  // Date range (REQUIRED)
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  
  // Geographic filters
  geography?: number;
  geographyIn?: number[];
  area?: number;
  areaIn?: number[];
  freshwaterStation?: number;
  
  // Feed property filters
  feed?: number;
  feedIn?: number[];
  feedBrand?: string;
  feedBrandIcontains?: string;
  feedProteinPercentageGte?: number;
  feedProteinPercentageLte?: number;
  feedFatPercentageGte?: number;
  feedFatPercentageLte?: number;
  feedSizeCategory?: string;
  
  // Cost filters
  feedCostGte?: number;
  feedCostLte?: number;
  
  // Report options
  includeBreakdowns?: boolean;
  includeTimeSeries?: boolean;
  groupBy?: 'day' | 'week' | 'month';
}

export interface FinanceReportSummary {
  total_feed_kg: number;
  total_feed_cost: number;
  events_count: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface FeedTypeBreakdown {
  feed_id: number;
  feed_name: string;
  brand: string;
  protein_percentage: number;
  fat_percentage: number;
  total_kg: number;
  total_cost: number;
  events_count: number;
}

export interface GeographyBreakdown {
  geography_id: number;
  geography_name: string;
  total_kg: number;
  total_cost: number;
  events_count: number;
  area_count: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  total_kg: number;
  total_cost: number;
  events_count: number;
}

export interface FinanceReportResponse {
  summary: FinanceReportSummary;
  by_feed_type?: FeedTypeBreakdown[];
  by_geography?: GeographyBreakdown[];
  by_area?: any[];
  by_container?: any[];
  time_series?: TimeSeriesDataPoint[];
}
```

**API Hooks** (`api.ts`):
```typescript
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import type { FinanceFilters, FinanceReportResponse } from "./types";

const FINANCE_QUERY_OPTIONS = {
  staleTime: 60 * 1000,      // 1 minute (matches backend cache)
  gcTime: 5 * 60 * 1000,     // 5 minutes
  retry: 1,
  retryDelay: 1000,
} as const;

/**
 * Hook to fetch finance report with multi-dimensional filtering
 * Wraps ApiService.feedingEventsFinanceReport() with TanStack Query
 */
export function useFinanceReport(filters: FinanceFilters) {
  return useQuery({
    queryKey: ["finance", "report", filters],
    queryFn: async () => {
      // Convert filters to API call parameters
      const response = await ApiService.feedingEventsFinanceReport(
        filters.endDate,
        filters.startDate,
        filters.area,
        filters.areaIn,
        filters.feed,
        filters.feedBrand,
        filters.feedBrandIcontains,
        filters.feedFatPercentageGte,
        filters.feedFatPercentageLte,
        filters.feedIn,
        filters.feedProteinPercentageGte,
        filters.feedProteinPercentageLte,
        filters.feedSizeCategory,
        filters.feedCostGte,
        filters.feedCostLte,
        filters.freshwaterStation,
        filters.geography,
        filters.geographyIn,
        filters.groupBy,
        filters.includeBreakdowns ?? true,
        filters.includeTimeSeries ?? false
      );
      
      return response as FinanceReportResponse;
    },
    enabled: !!(filters.startDate && filters.endDate),
    ...FINANCE_QUERY_OPTIONS,
  });
}

/**
 * Quick access hook for common report periods
 */
export function useQuickFinanceReport(
  period: 'today' | 'week' | 'month' | 'quarter' | 'year',
  additionalFilters?: Partial<FinanceFilters>
) {
  const now = new Date();
  const { startDate, endDate } = getDateRangeForPeriod(period, now);
  
  return useFinanceReport({
    startDate,
    endDate,
    includeBreakdowns: true,
    includeTimeSeries: period !== 'today',
    groupBy: period === 'today' ? 'day' : period === 'week' ? 'day' : period === 'month' ? 'week' : 'month',
    ...additionalFilters,
  });
}

// Helper function
function getDateRangeForPeriod(
  period: string,
  now: Date
): { startDate: string; endDate: string } {
  const endDate = now.toISOString().split('T')[0];
  
  const startDates = {
    today: now,
    week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    month: new Date(now.getFullYear(), now.getMonth(), 1),
    quarter: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1),
    year: new Date(now.getFullYear(), 0, 1),
  };
  
  const startDate = (startDates[period as keyof typeof startDates] || now)
    .toISOString()
    .split('T')[0];
  
  return { startDate, endDate };
}

export function getFinanceQueryKeys() {
  return {
    all: ["finance"] as const,
    reports: ["finance", "report"] as const,
    report: (filters: FinanceFilters) => ["finance", "report", filters] as const,
  };
}
```

**Acceptance Criteria**:
- [ ] Feature slice folder created
- [ ] TypeScript types match backend response structure
- [ ] API hook successfully calls `ApiService.feedingEventsFinanceReport()`
- [ ] Quick report periods work (today, week, month, quarter, year)

---

## Phase 2: Filter Management System (10 hours)

### Task 2.1: Finance Filters Hook (3 hours)

**File**: `features/finance-reporting/hooks/useFinanceFilters.ts`

**Implementation**:
```typescript
import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import type { FinanceFilters } from '../types';

interface UseFinanceFiltersOptions {
  initialFilters?: Partial<FinanceFilters>;
  onFiltersChange?: (filters: FinanceFilters) => void;
  debounceDelay?: number;
}

export function useFinanceFilters({
  initialFilters = {},
  onFiltersChange,
  debounceDelay = 300,
}: UseFinanceFiltersOptions = {}) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const [filters, setFilters] = useState<FinanceFilters>({
    startDate: monthStart.toISOString().split('T')[0],
    endDate: now.toISOString().split('T')[0],
    includeBreakdowns: true,
    includeTimeSeries: false,
    ...initialFilters,
  });
  
  // Debounce filters for API calls
  const debouncedFilters = useDebounce(filters, debounceDelay);
  
  // Update specific filter
  const updateFilter = useCallback(<K extends keyof FinanceFilters>(
    key: K,
    value: FinanceFilters[K]
  ) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);
  
  // Batch update multiple filters
  const updateFilters = useCallback((updates: Partial<FinanceFilters>) => {
    setFilters(prev => {
      const newFilters = { ...prev, ...updates };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);
  
  // Clear all filters except required date range
  const clearFilters = useCallback(() => {
    setFilters(prev => ({
      startDate: prev.startDate,
      endDate: prev.endDate,
      includeBreakdowns: true,
      includeTimeSeries: false,
    }));
  }, []);
  
  // Preset date ranges
  const applyPreset = useCallback((preset: 'today' | 'week' | 'month' | 'quarter' | 'year') => {
    const { startDate, endDate } = getDateRangeForPeriod(preset, new Date());
    updateFilters({ 
      startDate, 
      endDate,
      groupBy: preset === 'today' ? 'day' : preset === 'week' ? 'day' : 'week'
    });
  }, [updateFilters]);
  
  // Count active filters (excluding required/default ones)
  const activeFilterCount = useMemo(() => {
    const { startDate, endDate, includeBreakdowns, includeTimeSeries, groupBy, ...rest } = filters;
    return Object.values(rest).filter(v => v !== undefined && v !== null && v !== '').length;
  }, [filters]);
  
  // Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    
    if (!filters.startDate) errs.startDate = "Start date is required";
    if (!filters.endDate) errs.endDate = "End date is required";
    
    if (filters.startDate && filters.endDate) {
      if (new Date(filters.startDate) > new Date(filters.endDate)) {
        errs.dateRange = "Start date must be before end date";
      }
    }
    
    // Performance warnings
    if (filters.geographyIn && filters.geographyIn.length > 5) {
      errs.geographyIn = "Selecting many geographies may impact performance";
    }
    
    return errs;
  }, [filters]);
  
  const isValid = Object.keys(errors).length === 0;
  
  return {
    filters,
    debouncedFilters,
    updateFilter,
    updateFilters,
    clearFilters,
    applyPreset,
    activeFilterCount,
    errors,
    isValid,
  };
}
```

**Acceptance Criteria**:
- [ ] Hook manages all 32 filter parameters
- [ ] Debouncing prevents excessive API calls
- [ ] Preset date ranges (today/week/month/quarter/year)
- [ ] Validation for required fields and date logic
- [ ] Active filter count for UI badges

---

### Task 2.2: Filter Panel Component (4 hours)

**File**: `features/finance-reporting/components/FinanceFilterPanel.tsx`

**Design Specification**:

```tsx
/**
 * Comprehensive filter panel for finance reporting
 * 
 * Sections:
 * 1. Date Range & Presets (REQUIRED - always visible)
 * 2. Geographic Filters (collapsible)
 * 3. Feed Property Filters (collapsible)
 * 4. Cost Range Filters (collapsible)
 * 5. Report Options (time series, grouping)
 */

interface FinanceFilterPanelProps {
  filters: FinanceFilters;
  onFilterChange: <K extends keyof FinanceFilters>(
    key: K,
    value: FinanceFilters[K]
  ) => void;
  onClearAll: () => void;
  onApplyPreset: (preset: 'today' | 'week' | 'month' | 'quarter' | 'year') => void;
  activeFilterCount: number;
  errors: Record<string, string>;
}

export function FinanceFilterPanel({
  filters,
  onFilterChange,
  onClearAll,
  onApplyPreset,
  activeFilterCount,
  errors,
}: FinanceFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    geographic: true,
    feedProperties: false,
    costRange: false,
    reportOptions: false,
  });
  
  // Fetch reference data for filters
  const { data: geographies } = useQuery({
    queryKey: ['geographies'],
    queryFn: () => ApiService.apiV1InfrastructureGeographiesList()
  });
  
  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: () => ApiService.apiV1InfrastructureAreasList()
  });
  
  const { data: stations } = useQuery({
    queryKey: ['freshwater-stations'],
    queryFn: () => ApiService.apiV1InfrastructureFreshwaterStationsList()
  });
  
  const { data: feeds } = useQuery({
    queryKey: ['feeds'],
    queryFn: () => ApiService.apiV1InventoryFeedsList()
  });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-green-600" />
            <CardTitle>Finance Report Filters</CardTitle>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Section 1: Date Range & Presets (ALWAYS VISIBLE) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Report Period</Label>
            <div className="flex space-x-1">
              {(['today', 'week', 'month', 'quarter', 'year'] as const).map(preset => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => onApplyPreset(preset)}
                  className="capitalize"
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date *</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange('startDate', e.target.value)}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="end-date">End Date *</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange('endDate', e.target.value)}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>
          
          {errors.dateRange && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errors.dateRange}</AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Section 2: Geographic Filters (COLLAPSIBLE) */}
        <Collapsible
          open={expandedSections.geographic}
          onOpenChange={(open) =>
            setExpandedSections(prev => ({ ...prev, geographic: open }))
          }
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <Label className="text-base font-semibold">Geographic Filters</Label>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              expandedSections.geographic && "transform rotate-180"
            )} />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 pt-4">
            <MultiSelectFilter
              options={geographies?.results?.map(g => ({
                id: g.id,
                label: g.name,
                description: `${g.total_containers || 0} containers`
              })) || []}
              selectedIds={filters.geographyIn || []}
              onChange={(ids) => onFilterChange('geographyIn', ids)}
              label="Geographies"
              placeholder="Select geographies..."
              showCount
              showClearAll
            />
            
            <MultiSelectFilter
              options={areas?.results?.map(a => ({
                id: a.id,
                label: a.name,
                description: `${a.geography_name} - ${a.area_type}`
              })) || []}
              selectedIds={filters.areaIn || []}
              onChange={(ids) => onFilterChange('areaIn', ids)}
              label="Areas"
              placeholder="Select areas..."
              showCount
              showClearAll
            />
            
            <div>
              <Label>Freshwater Station</Label>
              <Select
                value={filters.freshwaterStation?.toString() || ''}
                onValueChange={(v) =>
                  onFilterChange('freshwaterStation', v ? parseInt(v) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All stations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stations</SelectItem>
                  {stations?.results?.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name} - {s.station_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Section 3: Feed Property Filters (COLLAPSIBLE) */}
        <Collapsible
          open={expandedSections.feedProperties}
          onOpenChange={(open) =>
            setExpandedSections(prev => ({ ...prev, feedProperties: open }))
          }
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <Label className="text-base font-semibold">Feed Properties</Label>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              expandedSections.feedProperties && "transform rotate-180"
            )} />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 pt-4">
            <MultiSelectFilter
              options={feeds?.results?.map(f => ({
                id: f.id,
                label: f.name,
                description: `${f.brand} - Protein: ${f.protein_percentage}%`
              })) || []}
              selectedIds={filters.feedIn || []}
              onChange={(ids) => onFilterChange('feedIn', ids)}
              label="Feed Types"
              placeholder="Select feed types..."
              showCount
              showClearAll
            />
            
            <div>
              <Label>Brand</Label>
              <Input
                placeholder="Filter by brand (partial match)..."
                value={filters.feedBrandIcontains || ''}
                onChange={(e) =>
                  onFilterChange('feedBrandIcontains', e.target.value || undefined)
                }
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Protein %</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g., 40"
                  value={filters.feedProteinPercentageGte || ''}
                  onChange={(e) =>
                    onFilterChange(
                      'feedProteinPercentageGte',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </div>
              
              <div>
                <Label>Max Protein %</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g., 50"
                  value={filters.feedProteinPercentageLte || ''}
                  onChange={(e) =>
                    onFilterChange(
                      'feedProteinPercentageLte',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Fat %</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g., 10"
                  value={filters.feedFatPercentageGte || ''}
                  onChange={(e) =>
                    onFilterChange(
                      'feedFatPercentageGte',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </div>
              
              <div>
                <Label>Max Fat %</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g., 25"
                  value={filters.feedFatPercentageLte || ''}
                  onChange={(e) =>
                    onFilterChange(
                      'feedFatPercentageLte',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </div>
            
            <div>
              <Label>Size Category</Label>
              <Select
                value={filters.feedSizeCategory || ''}
                onValueChange={(v) =>
                  onFilterChange('feedSizeCategory', v || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sizes</SelectItem>
                  <SelectItem value="MICRO">Micro</SelectItem>
                  <SelectItem value="SMALL">Small</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LARGE">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Section 4: Cost Range Filters (COLLAPSIBLE) */}
        <Collapsible
          open={expandedSections.costRange}
          onOpenChange={(open) =>
            setExpandedSections(prev => ({ ...prev, costRange: open }))
          }
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <Label className="text-base font-semibold">Cost Range</Label>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              expandedSections.costRange && "transform rotate-180"
            )} />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Cost per Event ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 100"
                  value={filters.feedCostGte || ''}
                  onChange={(e) =>
                    onFilterChange(
                      'feedCostGte',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </div>
              
              <div>
                <Label>Max Cost per Event ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 5000"
                  value={filters.feedCostLte || ''}
                  onChange={(e) =>
                    onFilterChange(
                      'feedCostLte',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Section 5: Report Options */}
        <div className="space-y-4 pt-4 border-t">
          <Label className="text-base font-semibold">Report Options</Label>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-breakdowns"
              checked={filters.includeBreakdowns ?? true}
              onCheckedChange={(checked) =>
                onFilterChange('includeBreakdowns', !!checked)
              }
            />
            <Label htmlFor="include-breakdowns" className="font-normal">
              Include breakdowns (by feed type, geography, area)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-time-series"
              checked={filters.includeTimeSeries ?? false}
              onCheckedChange={(checked) =>
                onFilterChange('includeTimeSeries', !!checked)
              }
            />
            <Label htmlFor="include-time-series" className="font-normal">
              Include time series (trend charts)
            </Label>
          </div>
          
          {filters.includeTimeSeries && (
            <div>
              <Label>Time Grouping</Label>
              <Select
                value={filters.groupBy || 'day'}
                onValueChange={(v) =>
                  onFilterChange('groupBy', v as 'day' | 'week' | 'month')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

**UI/UX Requirements**:
- Collapsible sections reduce visual clutter
- Date range presets provide quick access to common periods
- Multi-select filters for geographic dimensions
- Range inputs for nutritional/cost filters
- Clear visual hierarchy (required fields marked with *)
- Active filter badge for discoverability
- Responsive grid layout (mobile-friendly)

**Acceptance Criteria**:
- [ ] All 32 filter parameters accessible
- [ ] Collapsible sections work smoothly
- [ ] Date presets apply correct ranges
- [ ] Multi-select filters use existing `MultiSelectFilter` component
- [ ] Validation errors displayed inline
- [ ] Mobile responsive (<768px stacks vertically)

---

### Task 2.3: Filter State Persistence (1 hour)

**File**: `features/finance-reporting/hooks/useFilterPersistence.ts`

Save filter state to URL query params for:
- Shareable links (email reports with filters)
- Browser back/forward navigation
- Page refresh preservation

```typescript
export function useFilterPersistence(
  filters: FinanceFilters,
  updateFilters: (updates: Partial<FinanceFilters>) => void
) {
  const [, setLocation] = useLocation();
  const [search] = useSearch();
  
  // Sync URL params to filters on mount
  useEffect(() => {
    const params = new URLSearchParams(search);
    const urlFilters = parseFiltersFromUrl(params);
    if (Object.keys(urlFilters).length > 0) {
      updateFilters(urlFilters);
    }
  }, []);
  
  // Sync filters to URL params on change
  useEffect(() => {
    const params = serializeFiltersToUrl(filters);
    setLocation(`/finance?${params.toString()}`, { replace: true });
  }, [filters]);
}
```

**Acceptance Criteria**:
- [ ] URL params sync with filter state
- [ ] Shareable links work
- [ ] Browser back/forward preserves filters

---

## Phase 3: Data Visualization (12 hours)

### Task 3.1: Summary KPI Cards (2 hours)

**File**: `features/finance-reporting/components/FinanceSummaryCards.tsx`

**Design** (following personas.md - CFO needs high-level metrics):

```tsx
interface FinanceSummaryCardsProps {
  summary: FinanceReportSummary;
  isLoading: boolean;
  dateRange: { start: string; end: string };
}

export function FinanceSummaryCards({
  summary,
  isLoading,
  dateRange,
}: FinanceSummaryCardsProps) {
  // Calculate derived metrics
  const avgCostPerKg = summary.total_feed_kg > 0
    ? summary.total_feed_cost / summary.total_feed_kg
    : 0;
  
  const avgCostPerEvent = summary.events_count > 0
    ? summary.total_feed_cost / summary.events_count
    : 0;
  
  const dayCount = differenceInDays(
    new Date(dateRange.end),
    new Date(dateRange.start)
  ) + 1;
  
  const avgDailyCost = dayCount > 0 ? summary.total_feed_cost / dayCount : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Feed Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${formatNumber(summary.total_feed_cost)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDateRange(dateRange.start, dateRange.end)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Feed Used</CardTitle>
          <Scale className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatWeight(summary.total_feed_kg)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatNumber(summary.events_count)} feeding events
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Cost per KG</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            ${avgCostPerKg.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            FIFO-calculated average
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <Calendar className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            ${formatNumber(avgDailyCost)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ${formatNumber(avgCostPerEvent)}/event
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Acceptance Criteria**:
- [ ] 4 KPI cards: Total Cost, Total Feed, Avg Cost/KG, Daily Average
- [ ] Loading skeletons during data fetch
- [ ] Derived metrics calculated correctly
- [ ] Responsive grid layout

---

### Task 3.2: Feed Type Cost Breakdown Chart (3 hours)

**File**: `features/finance-reporting/components/FeedTypeCostChart.tsx`

**Visualization**: Horizontal bar chart showing cost breakdown by feed type

```tsx
import { Bar } from 'react-chartjs-2';
import type { FeedTypeBreakdown } from '../types';

export function FeedTypeCostChart({
  data,
  isLoading,
}: {
  data: FeedTypeBreakdown[];
  isLoading: boolean;
}) {
  const chartData = {
    labels: data.map(item => item.feed_name),
    datasets: [
      {
        label: 'Total Cost ($)',
        data: data.map(item => item.total_cost),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',  // green-500
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Quantity (kg)',
        data: data.map(item => item.total_kg),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',  // blue-500
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  };
  
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Feed Cost & Usage by Type',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.x;
            if (label.includes('Cost')) {
              return `${label}: $${formatNumber(value)}`;
            }
            return `${label}: ${formatWeight(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        display: true,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Total Cost ($)',
        },
      },
      y: {
        beginAtZero: true,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Quantity (kg)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feed Type Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Cost and usage breakdown by feed type
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data for selected filters
            </div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
        
        {/* Detailed table below chart */}
        {data.length > 0 && (
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feed Type</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Protein %</TableHead>
                  <TableHead className="text-right">Fat %</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Events</TableHead>
                  <TableHead className="text-right">$/kg</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(item => (
                  <TableRow key={item.feed_id}>
                    <TableCell className="font-medium">{item.feed_name}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell className="text-right">{item.protein_percentage?.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{item.fat_percentage?.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{formatWeight(item.total_kg)}</TableCell>
                    <TableCell className="text-right">${formatNumber(item.total_cost)}</TableCell>
                    <TableCell className="text-right">{formatNumber(item.events_count)}</TableCell>
                    <TableCell className="text-right">
                      ${(item.total_cost / item.total_kg).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

**Chart Requirements**:
- Horizontal bar chart (easier to read feed names)
- Dual Y-axis: Cost ($) and Quantity (kg)
- Detailed table below chart with all metrics
- Sortable columns
- Loading skeleton

**Acceptance Criteria**:
- [ ] Chart renders correctly with real data
- [ ] Table shows all feed type details
- [ ] Responsive (chart adjusts to container width)
- [ ] Loading states handled

---

### Task 3.3: Geographic Cost Distribution Map/Chart (3 hours)

**File**: `features/finance-reporting/components/GeographicCostChart.tsx`

**Visualization**: Pie chart + geographic breakdown table

```tsx
export function GeographicCostChart({
  data,
  isLoading,
}: {
  data: GeographyBreakdown[];
  isLoading: boolean;
}) {
  const chartData = {
    labels: data.map(item => item.geography_name),
    datasets: [{
      label: 'Cost by Geography',
      data: data.map(item => item.total_cost),
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',   // blue
        'rgba(34, 197, 94, 0.7)',    // green
        'rgba(249, 115, 22, 0.7)',   // orange
        'rgba(168, 85, 247, 0.7)',   // purple
        'rgba(236, 72, 153, 0.7)',   // pink
      ],
      borderWidth: 1,
    }],
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Feed costs by location
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie chart */}
          <div className="h-80">
            <Pie data={chartData} options={pieOptions} />
          </div>
          
          {/* Breakdown table */}
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Geography</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(item => (
                  <TableRow key={item.geography_id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{item.geography_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${formatNumber(item.total_cost)}
                    </TableCell>
                    <TableCell className="text-right">
                      {calculatePercentage(
                        item.total_cost,
                        data.reduce((sum, d) => sum + d.total_cost, 0)
                      )}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Acceptance Criteria**:
- [ ] Pie chart shows cost distribution
- [ ] Table shows detailed breakdown with percentages
- [ ] Side-by-side layout on desktop
- [ ] Stacked on mobile

---

### Task 3.4: Time Series Trend Chart (3 hours)

**File**: `features/finance-reporting/components/TimeTrendChart.tsx`

**Visualization**: Line chart with dual Y-axis (cost + quantity)

```tsx
export function TimeTrendChart({
  data,
  isLoading,
  groupBy,
}: {
  data: TimeSeriesDataPoint[];
  isLoading: boolean;
  groupBy: 'day' | 'week' | 'month';
}) {
  const chartData = {
    labels: data.map(item => formatDate(item.date, groupBy)),
    datasets: [
      {
        label: 'Feed Cost ($)',
        data: data.map(item => item.total_cost),
        borderColor: 'rgb(34, 197, 94)',  // green-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y',
        fill: true,
      },
      {
        label: 'Feed Usage (kg)',
        data: data.map(item => item.total_kg),
        borderColor: 'rgb(59, 130, 246)',  // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
        fill: true,
      },
    ],
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cost & Usage Trends</CardTitle>
            <p className="text-sm text-muted-foreground">
              {groupBy === 'day' ? 'Daily' : groupBy === 'week' ? 'Weekly' : 'Monthly'} trends
            </p>
          </div>
          
          <Badge variant="outline">
            {data.length} {groupBy === 'day' ? 'days' : groupBy === 'week' ? 'weeks' : 'months'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <Line data={chartData} options={lineOptions} />
        </div>
        
        {/* Trend indicators */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Peak Cost</p>
            <p className="text-lg font-semibold">
              ${formatNumber(Math.max(...data.map(d => d.total_cost)))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Avg Cost</p>
            <p className="text-lg font-semibold">
              ${formatNumber(
                data.reduce((s, d) => s + d.total_cost, 0) / data.length
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Trend</p>
            <p className="text-lg font-semibold">
              {calculateTrend(data)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Acceptance Criteria**:
- [ ] Line chart with dual Y-axis
- [ ] Responsive to date range and grouping changes
- [ ] Trend indicators (peak, average, trend direction)
- [ ] Loading skeleton

---

### Task 3.5: Breakdown Tables Component (2 hours)

**File**: `features/finance-reporting/components/BreakdownTables.tsx`

Tabbed interface showing breakdowns by:
- Feed Type (with nutritional info)
- Geography
- Area
- Container (if needed)

**Acceptance Criteria**:
- [ ] Tabbed interface for different breakdown dimensions
- [ ] Sortable columns
- [ ] Export to CSV button per table
- [ ] Pagination for large datasets

---

### Task 3.6: Chart Utilities Hook (1 hour)

**File**: `features/finance-reporting/hooks/useFinanceChartData.ts`

Transform API response data into chart-ready formats:
```typescript
export function useFinanceChartData(report: FinanceReportResponse | undefined) {
  const feedTypeChartData = useMemo(() => {
    if (!report?.by_feed_type) return null;
    // Transform for charts
    return transformFeedTypeData(report.by_feed_type);
  }, [report]);
  
  // Similar transforms for other chart types
  
  return {
    feedTypeChartData,
    geographyChartData,
    timeSeriesChartData,
  };
}
```

**Acceptance Criteria**:
- [ ] Data transformations tested
- [ ] Handles empty/undefined data
- [ ] Memoized for performance

---

## Phase 4: Main Page Assembly (6 hours)

### Task 4.1: Finance Reporting Page (4 hours)

**File**: `features/finance-reporting/pages/FinanceReportingPage.tsx`

**Layout Structure**:
```tsx
export default function FinanceReportingPage() {
  const {
    filters,
    debouncedFilters,
    updateFilter,
    clearFilters,
    applyPreset,
    activeFilterCount,
    errors,
    isValid,
  } = useFinanceFilters();
  
  const {
    data: report,
    isLoading,
    error,
  } = useFinanceReport(debouncedFilters);
  
  const {
    feedTypeChartData,
    geographyChartData,
    timeSeriesChartData,
  } = useFinanceChartData(report);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold">Finance Reporting</h1>
            <p className="text-muted-foreground">
              Multi-dimensional feed cost analysis
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
      
      {/* Filter Panel */}
      <FinanceFilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onClearAll={clearFilters}
        onApplyPreset={applyPreset}
        activeFilterCount={activeFilterCount}
        errors={errors}
      />
      
      {/* Loading State */}
      {isLoading && <FinanceReportSkeleton />}
      
      {/* Error State */}
      {error && <ErrorAlert error={error} />}
      
      {/* Report Content */}
      {report && (
        <>
          {/* Summary KPIs */}
          <FinanceSummaryCards
            summary={report.summary}
            isLoading={isLoading}
            dateRange={report.summary.date_range}
          />
          
          {/* Charts (only if breakdowns included) */}
          {report.by_feed_type && report.by_feed_type.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <FeedTypeCostChart
                data={report.by_feed_type}
                isLoading={isLoading}
              />
              
              {report.by_geography && report.by_geography.length > 0 && (
                <GeographicCostChart
                  data={report.by_geography}
                  isLoading={isLoading}
                />
              )}
            </div>
          )}
          
          {/* Time Series (only if requested) */}
          {report.time_series && report.time_series.length > 0 && (
            <TimeTrendChart
              data={report.time_series}
              isLoading={isLoading}
              groupBy={filters.groupBy || 'day'}
            />
          )}
          
          {/* Detailed Breakdowns */}
          {report.by_feed_type && (
            <BreakdownTables
              feedTypeData={report.by_feed_type}
              geographyData={report.by_geography}
              areaData={report.by_area}
            />
          )}
        </>
      )}
    </div>
  );
}
```

**Page Responsibilities**:
- Orchestrate filter state and report fetching
- Layout summary cards, charts, and tables
- Handle loading/error states
- Export/print functionality

**Acceptance Criteria**:
- [ ] Page renders all components
- [ ] Filter changes trigger report refresh (debounced)
- [ ] Loading states smooth (skeleton components)
- [ ] Error states informative
- [ ] Page stays under 200 LOC

---

### Task 4.2: Navigation Integration (1 hour)

**Files to Update**:
- `client/src/router/index.tsx`
- `client/src/components/layout/Header.tsx` or main nav component

**Router Addition**:
```tsx
// In router/index.tsx
const FinanceReportingPage = lazy(() =>
  import('@/features/finance-reporting/pages/FinanceReportingPage')
);

// Add route
<Route path="/finance" component={FinanceReportingPage} />
```

**Navigation Menu Addition**:
```tsx
// In main navigation component
{
  path: '/finance',
  label: 'Finance',
  icon: DollarSign,
  badge: 'New',
  roles: ['ADMIN', 'FINANCE_MANAGER', 'CFO'],
}
```

**Acceptance Criteria**:
- [ ] Finance menu item appears in left navigation
- [ ] Icon: DollarSign (green theme)
- [ ] Route lazy-loads correctly
- [ ] Role-based visibility (Finance, Admin, CFO)
- [ ] "New" badge for first 2 weeks

---

### Task 4.3: Export & Print Functionality (1 hour)

**File**: `features/finance-reporting/components/ExportDialog.tsx`

**Export Options**:
- PDF report (print-friendly CSS)
- CSV data (summary + breakdowns)
- Excel workbook (multiple sheets)

```tsx
export function ExportDialog({ report, filters }: ExportDialogProps) {
  const handleExportCSV = () => {
    const csv = generateCSV(report);
    downloadFile(csv, 'finance-report.csv', 'text/csv');
  };
  
  const handleExportExcel = () => {
    const workbook = generateExcelWorkbook(report);
    downloadFile(workbook, 'finance-report.xlsx', 'application/vnd.ms-excel');
  };
  
  const handlePrint = () => {
    window.print();  // Uses print-friendly CSS
  };
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Finance Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Button onClick={handleExportCSV} className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Export as CSV
          </Button>
          
          <Button onClick={handleExportExcel} className="w-full">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export as Excel
          </Button>
          
          <Button onClick={handlePrint} className="w-full">
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Acceptance Criteria**:
- [ ] CSV export includes all data
- [ ] Excel export has multiple sheets (summary, feed types, geography, time series)
- [ ] Print CSS hides navigation, shows data
- [ ] Filenames include date range

---

## Phase 5: Advanced Features (8 hours)

### Task 5.1: Saved Report Templates (3 hours)

Allow users to save filter combinations as templates:

**Examples**:
- "Scotland Monthly High-Protein Feed Costs"
- "Q1 2024 All Geographies"
- "Premium Feed (>45% protein) Last 30 Days"

**Storage**: LocalStorage or backend endpoint (future)

**Acceptance Criteria**:
- [ ] Save current filters as template
- [ ] Load saved template
- [ ] Delete templates
- [ ] Default templates provided

---

### Task 5.2: Comparison Mode (3 hours)

Compare two time periods side-by-side:
- Q1 2024 vs Q1 2023
- This month vs last month
- Scotland vs Faroe Islands

**Acceptance Criteria**:
- [ ] Select two filter sets
- [ ] Side-by-side summary cards
- [ ] Difference/change calculations
- [ ] Visual indicators (↑↓ arrows, colors)

---

### Task 5.3: Cost Optimization Insights (2 hours)

AI-like insights based on report data:
- "Premium Feed is 25% more expensive than Standard Feed for similar protein content"
- "Scotland costs 15% higher than Faroe Islands - investigate logistics"
- "Protein >45% feed has 2x better cost efficiency per gram"

**Acceptance Criteria**:
- [ ] 3-5 insights generated per report
- [ ] Insights are actionable
- [ ] Can be dismissed/expanded

---

## Phase 6: Polish & Optimization (6 hours)

### Task 6.1: Loading & Empty States (2 hours)

- Skeleton components for cards/charts
- Empty state illustrations
- Error boundaries
- Retry mechanisms

**Acceptance Criteria**:
- [ ] Smooth loading transitions
- [ ] Empty states provide guidance
- [ ] Errors don't crash page

---

### Task 6.2: Mobile Optimization (2 hours)

- Responsive charts (stack vertically on mobile)
- Simplified filter UI for small screens
- Touch-friendly controls
- Bottom sheet for filters on mobile

**Acceptance Criteria**:
- [ ] Works on iPhone SE (375px)
- [ ] Charts readable on mobile
- [ ] Filters accessible via bottom sheet

---

### Task 6.3: Performance Optimization (2 hours)

- Lazy load chart libraries
- Virtualize large tables
- Memoize expensive calculations
- Optimize re-renders

**Acceptance Criteria**:
- [ ] Lighthouse score >90
- [ ] Chart libraries lazy-loaded
- [ ] No unnecessary re-renders

---

## Phase 7: Testing (8 hours)

### Task 7.1: Unit Tests (4 hours)

**Files**:
- `features/finance-reporting/hooks/__tests__/useFinanceFilters.test.ts`
- `features/finance-reporting/hooks/__tests__/useFinanceChartData.test.ts`
- `features/finance-reporting/components/__tests__/FinanceFilterPanel.test.tsx`

**Test Coverage**:
- Filter state management
- Data transformations
- Chart data generation
- Validation logic

**Target**: 80%+ coverage for hooks and utilities

---

### Task 7.2: Integration Tests (2 hours)

**File**: `features/finance-reporting/__tests__/FinanceReportingPage.test.tsx`

**Test Scenarios**:
1. Load page with default filters → Shows report
2. Change date range → Report updates
3. Apply geographic filter → Report filters correctly
4. Enable time series → Chart appears
5. Export CSV → File downloads

**Acceptance Criteria**:
- [ ] Page renders without errors
- [ ] Filter changes trigger data fetch
- [ ] All charts render
- [ ] Export functions work

---

### Task 7.3: E2E Smoke Test (2 hours)

**Using Playwright** (or current E2E framework):

```typescript
test('Finance Manager can generate filtered cost report', async ({ page }) => {
  await page.goto('/finance');
  
  // Apply filters
  await page.click('text=Month');  // Quick preset
  await page.click('text=Geographic Filters');
  await page.selectOption('[aria-label="Geographies"]', 'Scotland');
  
  // Verify report loads
  await expect(page.locator('text=Total Feed Cost')).toBeVisible();
  await expect(page.locator('[role="img"]')).toBeVisible();  // Chart
  
  // Export
  await page.click('text=Export');
  await page.click('text=Export as CSV');
  
  // Verify download
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toContain('finance-report');
});
```

**Acceptance Criteria**:
- [ ] Critical user flows tested
- [ ] Works in CI environment
- [ ] Screenshots captured on failure

---

## Phase 8: Documentation & Handoff (4 hours)

### Task 8.1: User Guide (2 hours)

**File**: `AquaMind-Frontend/docs/features/finance-reporting-user-guide.md`

**Sections**:
1. Overview & Use Cases
2. Filter Guide (with screenshots)
3. Understanding Breakdowns
4. Time Series Analysis
5. Export Options
6. Common Queries (recipes)
7. Troubleshooting

**Example Query Recipes**:
```markdown
## How do I analyze Scotland's feed costs for last quarter?

1. Click **Finance** in left navigation
2. Click **Quarter** preset button
3. Expand **Geographic Filters**
4. Select **Scotland** from Geographies
5. View results

## How do I compare high-protein feed costs across all locations?

1. Set date range (start/end dates)
2. Expand **Feed Properties**
3. Set **Min Protein %** to 45
4. Enable **Include Time Series**
5. Set **Time Grouping** to Weekly
6. View trends and breakdowns
```

**Acceptance Criteria**:
- [ ] Screenshots for each major feature
- [ ] Common use cases documented
- [ ] Troubleshooting section

---

### Task 8.2: Technical Documentation (2 hours)

**File**: `features/finance-reporting/README.md`

**Content**:
- Architecture overview
- Component responsibilities
- API integration details
- State management strategy
- Testing approach
- Performance considerations

**Acceptance Criteria**:
- [ ] Developers can understand architecture
- [ ] API usage documented
- [ ] Extension points identified

---

## User Experience Flow

### CFO Jordan's Typical Usage

**Scenario**: "How much did we spend on high-protein feed in Scotland last quarter?"

1. **Navigate**: Click "Finance" in left menu
2. **Select Period**: Click "Quarter" preset (Jan 1 - Mar 31)
3. **Filter Geography**: Expand "Geographic Filters" → Select "Scotland"
4. **Filter Feed**: Expand "Feed Properties" → Set "Min Protein %" to 45
5. **View Results**: 
   - Summary card shows **$125,400** total cost
   - Feed type chart shows breakdown by specific feed brands
   - Geography breakdown confirms Scotland-only data
6. **Export**: Click "Export" → "Export as Excel" → Email to team

**Time Required**: ~30 seconds (vs hours in Excel)

---

### Finance Manager's Daily Check

**Scenario**: "What are our feed costs trending this week?"

1. **Navigate**: Click "Finance"
2. **Quick View**: Click "Week" preset
3. **Enable Trends**: Check "Include time series"
4. **Analyze**: 
   - Summary shows $12,500 this week
   - Trend chart shows costs increasing (alert!)
   - Investigate: Expand filters, check feed types
5. **Action**: Identify Premium Feed spike → Contact supplier

**Time Required**: ~15 seconds

---

## Design Guidelines (Following personas.md)

### For CFO (Jordan)
**Needs**: High-level insights, quick comparisons, board-ready exports

**Design Focus**:
- ✅ Summary cards prominent (big numbers)
- ✅ One-click presets (quarter/year for board reports)
- ✅ Professional export options (PDF/Excel)
- ✅ Comparison mode for year-over-year

### For Finance/BI Personnel
**Needs**: Deep dive capabilities, data exports, Power BI integration

**Design Focus**:
- ✅ Detailed breakdown tables
- ✅ CSV export for Power BI import
- ✅ All 32 filter parameters accessible
- ✅ Time series for trend analysis

### For Oversight Managers
**Needs**: Cost-aware operational decisions

**Design Focus**:
- ✅ Feed type cost comparisons
- ✅ Geographic cost differences
- ✅ Simple date presets (week/month)

---

## Performance Targets

### Frontend Performance
- **Initial Load**: < 2 seconds (with cached data)
- **Filter Change**: < 500ms (debounced)
- **Chart Render**: < 300ms
- **Export Generation**: < 1 second

### Backend Performance (Already Achieved)
- **Report Generation**: 0.018s for 10,000 events ✅
- **Query Count**: 6 queries ✅
- **Cache Duration**: 60 seconds

---

## Technical Specifications

### Dependencies Required

```json
{
  "dependencies": {
    "chart.js": "^4.4.0",              // Already installed
    "react-chartjs-2": "^5.2.0",       // Already installed
    "date-fns": "^2.30.0",             // Date utilities
    "papaparse": "^5.4.1",             // CSV export
    "xlsx": "^0.18.5"                  // Excel export
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",  // Already installed
    "@testing-library/user-event": "^14.5.1",  // Already installed
    "vitest": "^1.0.0"                 // Already installed
  }
}
```

### Bundle Size Impact
- **Estimated**: +120KB (gzipped)
  - Chart.js: 60KB (already included)
  - XLSX library: 40KB (lazy loaded)
  - Feature code: 20KB

**Mitigation**: Lazy load chart and export libraries

---

## Implementation Timeline

### Week 1: Core Infrastructure & Filters
| Day | Phase | Tasks | Hours |
|-----|-------|-------|-------|
| Mon | Phase 1 | Feature slice setup, types, API hooks | 8h |
| Tue | Phase 2 | Filter hook, filter panel component | 8h |
| Wed | Phase 2 | Filter panel completion, persistence | 4h |

### Week 2: Visualization & Assembly
| Day | Phase | Tasks | Hours |
|-----|-------|-------|-------|
| Thu | Phase 3 | Summary cards, feed type chart | 5h |
| Fri | Phase 3 | Geographic chart, time series chart | 6h |
| Mon | Phase 3-4 | Breakdown tables, main page assembly | 7h |

### Week 3: Advanced Features & Polish
| Day | Phase | Tasks | Hours |
|-----|-------|-------|-------|
| Tue | Phase 4-5 | Navigation, export, saved templates | 7h |
| Wed | Phase 5-6 | Comparison mode, mobile optimization | 6h |
| Thu | Phase 6-7 | Performance optimization, unit tests | 6h |

### Week 4: Testing & Documentation
| Day | Phase | Tasks | Hours |
|-----|-------|-------|-------|
| Fri | Phase 7 | Integration tests, E2E tests | 6h |
| Mon | Phase 8 | User guide, technical docs | 4h |
| Tue | Final | QA, bug fixes, refinement | 4h |

**Total Estimated**: 71 hours (~2 weeks for 1 developer)

---

## Success Criteria

### Functional Requirements
- [ ] All 32 backend filter parameters accessible in UI
- [ ] Date range filtering with presets (today/week/month/quarter/year)
- [ ] Multi-select geographic filters
- [ ] Nutritional property range filters (protein, fat)
- [ ] Cost range filters
- [ ] Summary KPIs displayed (total cost, usage, averages)
- [ ] Feed type breakdown chart with table
- [ ] Geographic breakdown chart with table
- [ ] Time series trend chart (daily/weekly/monthly)
- [ ] Export to CSV/Excel/PDF
- [ ] Saved report templates
- [ ] Comparison mode (two periods)

### Technical Requirements
- [ ] TypeScript strict mode (no errors)
- [ ] Component file sizes < 300 LOC
- [ ] Hook file sizes < 150 LOC
- [ ] Test coverage > 80% for business logic
- [ ] Lighthouse performance > 90
- [ ] Bundle size impact < 150KB
- [ ] Mobile responsive (>375px width)
- [ ] Accessibility (WCAG 2.1 AA)

### User Experience Requirements
- [ ] Page loads in < 2 seconds
- [ ] Filter changes feel instant (debounced)
- [ ] Charts render smoothly
- [ ] Loading states clear
- [ ] Error messages helpful
- [ ] Export completes in < 1 second
- [ ] Print-friendly layout

---

## Risk Assessment

### High Risk Items

| Risk | Impact | Mitigation |
|------|--------|------------|
| Chart.js bundle size | Medium | Lazy load, use tree-shaking |
| Complex filter state management | High | Use proven `useMultiEntityFilter` pattern |
| Excel export library size | Medium | Lazy load XLSX library |
| Mobile chart readability | Medium | Responsive chart configs, mobile-first design |

### Medium Risk Items

| Risk | Impact | Mitigation |
|------|--------|------------|
| Filter validation complexity | Medium | Comprehensive unit tests |
| Cross-browser chart rendering | Low | Test in Chrome, Safari, Firefox |
| Data transformation bugs | Medium | Test with real backend data early |

---

## Dependencies & Blockers

### Prerequisites (All Complete ✅)
- [x] Backend finance_report endpoint deployed
- [x] OpenAPI schema generated
- [x] TypeScript client regenerated
- [x] Frontend builds successfully

### External Dependencies
- **None** - All backend work complete

### Internal Dependencies
- [ ] `MultiSelectFilter` component (already exists ✅)
- [ ] `useDebounce` hook (may need to create)
- [ ] Chart.js setup (already configured ✅)

---

## Testing Strategy

### Unit Tests
**Target**: Business logic, hooks, utilities  
**Framework**: Vitest + React Testing Library  
**Coverage**: 80%+

**Key Test Files**:
- `useFinanceFilters.test.ts` - Filter state management
- `useFinanceChartData.test.ts` - Data transformations
- `api.test.ts` - API hook integration

### Component Tests
**Target**: Visual components, user interactions  
**Framework**: Vitest + React Testing Library

**Key Test Files**:
- `FinanceFilterPanel.test.tsx` - Filter UI interactions
- `FeedTypeCostChart.test.tsx` - Chart rendering
- `FinanceSummaryCards.test.tsx` - KPI calculations

### Integration Tests
**Target**: Full page flows  
**Scenarios**:
1. Page load → Default report displays
2. Apply filters → Report updates
3. Enable time series → Chart appears
4. Export CSV → Download works

### E2E Tests
**Target**: Critical user journeys  
**Framework**: Playwright

**Scenarios**:
1. CFO quarterly board report workflow
2. Finance manager daily check workflow
3. Filter + export workflow

---

## Rollout Plan

### Phase 1: Alpha (Internal Testing)
- **Audience**: Development team, Product Owner
- **Duration**: 3 days
- **Focus**: Functionality verification, bug fixes

### Phase 2: Beta (Power Users)
- **Audience**: CFO, 2-3 Finance Managers
- **Duration**: 1 week
- **Focus**: Usability feedback, missing features

### Phase 3: Production
- **Audience**: All finance roles
- **Rollout**: Feature flag enabled for finance users
- **Monitoring**: Error tracking, usage analytics

---

## Post-Launch Enhancements

### Month 1-3
1. **Scheduled Reports**: Email reports daily/weekly
2. **Alerts**: Cost threshold notifications
3. **Forecasting**: Predicted costs based on trends
4. **Budget Tracking**: Compare actual vs budgeted

### Month 4-6
1. **Dashboard Widgets**: Embeddable charts for custom dashboards
2. **API Integration**: Power BI connector
3. **Advanced Analytics**: Cost per kg by lifecycle stage
4. **Supplier Analysis**: Cost comparison by supplier

---

## Appendix A: Component File Structure

```
features/finance-reporting/
├── __tests__/
│   ├── FinanceReportingPage.test.tsx
│   └── integration/
│       └── finance-workflows.test.tsx
├── api.ts                              # 200 LOC
├── hooks/
│   ├── __tests__/
│   │   ├── useFinanceFilters.test.ts
│   │   └── useFinanceChartData.test.ts
│   ├── useFinanceFilters.ts            # 150 LOC
│   ├── useFinanceReport.ts             # 100 LOC
│   ├── useFinanceChartData.ts          # 100 LOC
│   └── useFilterPersistence.ts         # 80 LOC
├── pages/
│   └── FinanceReportingPage.tsx        # 180 LOC
├── components/
│   ├── __tests__/
│   │   ├── FinanceFilterPanel.test.tsx
│   │   └── FeedTypeCostChart.test.tsx
│   ├── FinanceFilterPanel.tsx          # 250 LOC
│   ├── FinanceSummaryCards.tsx         # 150 LOC
│   ├── FeedTypeCostChart.tsx           # 150 LOC
│   ├── GeographicCostChart.tsx         # 150 LOC
│   ├── TimeTrendChart.tsx              # 150 LOC
│   ├── BreakdownTables.tsx             # 200 LOC
│   ├── ExportDialog.tsx                # 100 LOC
│   └── FinanceReportSkeleton.tsx       # 80 LOC
├── utils/
│   ├── chartConfig.ts                  # Chart.js configs
│   ├── exportUtils.ts                  # CSV/Excel generation
│   └── dateUtils.ts                    # Date range helpers
├── types.ts                            # 100 LOC
├── index.ts                            # Barrel exports
└── README.md                           # Technical docs
```

**Total**: ~2,000 LOC across 25 files

---

## Appendix B: Example API Responses

### Summary-Only Request
```typescript
const report = await ApiService.feedingEventsFinanceReport(
  '2024-10-01',
  '2024-10-31',
  undefined, // area
  undefined, // areaIn
  undefined, // feed
  undefined, // feedBrand
  undefined, // feedBrandIcontains
  undefined, // feedFatPercentageGte
  undefined, // feedFatPercentageLte
  undefined, // feedIn
  45,        // feedProteinPercentageGte ← FILTER
  undefined, // feedProteinPercentageLte
  undefined, // feedSizeCategory
  undefined, // feedCostGte
  undefined, // feedCostLte
  undefined, // freshwaterStation
  1,         // geography ← FILTER (Scotland)
  undefined, // geographyIn
  undefined, // groupBy
  true,      // includeBreakdowns
  false      // includeTimeSeries
);

// Response:
{
  summary: {
    total_feed_kg: 12450.50,
    total_feed_cost: 68250.00,
    events_count: 245,
    date_range: { start: '2024-10-01', end: '2024-10-31' }
  },
  by_feed_type: [
    {
      feed_id: 5,
      feed_name: 'Premium Grower',
      brand: 'Supplier A',
      protein_percentage: 48.0,
      fat_percentage: 22.0,
      total_kg: 8200.00,
      total_cost: 51250.00,
      events_count: 164
    },
    // ... more feed types
  ],
  by_geography: [ /* ... */ ],
  by_area: [ /* ... */ ]
}
```

---

## Appendix C: Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels on filter controls
- [ ] Screen reader announcements for dynamic content
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Charts have text alternatives (table fallbacks)
- [ ] Form validation accessible
- [ ] Skip links for keyboard navigation

---

## Sign-Off

**Plan Status**: Ready for Review  
**Estimated Effort**: 71 hours (2 weeks, 1 developer)  
**Complexity**: Medium-High  
**Risk Level**: Low (backend complete, proven patterns)

**Next Steps**:
1. Review plan with Product Owner
2. Validate with CFO/Finance Manager (UX flow)
3. Confirm timeline and resource allocation
4. Begin Phase 1 implementation

**Author**: AI Assistant  
**Date**: 2025-10-11  
**Related Backend**: `feature/inventory-finance-aggregation-enhancements` (Complete ✅)


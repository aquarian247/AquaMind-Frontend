# Multi-Entity Filtering System

## Overview

This directory contains reusable components and utilities for implementing reliable multi-entity filtering across the AquaMind frontend. The system was built to support the backend's `__in` filtering capabilities discovered and fixed in [Issue #73](https://github.com/aquarian247/AquaMind/issues/73).

## Components

### `MultiSelectFilter`

A fully-featured, searchable multi-select filter component built on Shadcn UI primitives.

**Features:**
- Searchable dropdown interface
- Selected items displayed as removable badges
- Performance warnings for large selections
- Validation error display
- Max selection limits
- Clear all functionality

**Basic Usage:**

```tsx
import { MultiSelectFilter } from '@/components/filters';

function MyComponent() {
  const [selectedHallIds, setSelectedHallIds] = useState<number[]>([]);
  
  return (
    <MultiSelectFilter
      options={halls.map(h => ({ 
        id: h.id, 
        label: h.name,
        description: `Station: ${h.station_name}`
      }))}
      selectedIds={selectedHallIds}
      onChange={setSelectedHallIds}
      label="Halls"
      placeholder="Select halls..."
      showCount
    />
  );
}
```

**Advanced Usage with Validation:**

```tsx
<MultiSelectFilter
  options={batches}
  selectedIds={selectedBatchIds}
  onChange={setSelectedBatchIds}
  label="Batches"
  maxSelections={50}
  error={errors.batch__in}
  warning={warnings.batch__in}
  showClearAll
/>
```

## Hooks

### `useMultiEntityFilter`

A comprehensive hook for managing multi-entity filter state with validation, debouncing, and performance optimization.

**Basic Usage:**

```tsx
import { useMultiEntityFilter } from '@/hooks/useMultiEntityFilter';

function MyComponent() {
  const {
    filters,
    formattedFilters,
    filterSummary,
    setFilter,
    clearAllFilters,
    errors,
    warnings
  } = useMultiEntityFilter({
    initialFilters: {
      hall__in: [1, 2, 3]
    },
    debounceDelay: 300,
    maxRecommended: 100
  });
  
  // Use formattedFilters in API calls
  const { data } = useQuery({
    queryKey: ['containers', formattedFilters],
    queryFn: () => ApiService.apiV1InfrastructureContainersList(formattedFilters)
  });
  
  return (
    <div>
      <p>Current filters: {filterSummary}</p>
      <button onClick={clearAllFilters}>Clear All</button>
    </div>
  );
}
```

**With onChange Callback:**

```tsx
const { formattedFilters, setFilter } = useMultiEntityFilter({
  onChange: (formatted) => {
    console.log('Filters changed:', formatted);
    // Trigger data refetch, analytics, etc.
  },
  debounceDelay: 500 // Debounce API calls
});
```

## Utilities

### Filter Utilities (`lib/filterUtils.ts`)

Low-level utilities for working with `__in` filters:

```tsx
import {
  formatInFilter,
  parseInFilter,
  validateEntityIds,
  formatMultiEntityFilters
} from '@/lib/filterUtils';

// Format IDs for API
const formatted = formatInFilter([1, 2, 3]); // "1,2,3"

// Parse from URL query params
const ids = parseInFilter("1,2,3"); // [1, 2, 3]

// Validate before setting
const validation = validateEntityIds([1, 2, -3]);
if (!validation.valid) {
  console.error(validation.error);
}

// Format multiple filters at once
const filters = formatMultiEntityFilters({
  hall__in: [1, 2, 3],
  area__in: [10, 11],
  batch__in: []
});
// Result: { hall__in: "1,2,3", area__in: "10,11" }
```

## Complete Integration Example

### Container List with Multi-Entity Filtering

```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { MultiSelectFilter } from '@/components/filters';
import { useMultiEntityFilter } from '@/hooks/useMultiEntityFilter';

function ContainerListPage() {
  // Fetch available filter options
  const { data: halls } = useQuery({
    queryKey: ['halls'],
    queryFn: () => ApiService.apiV1InfrastructureHallsList()
  });
  
  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: () => ApiService.apiV1InfrastructureAreasList()
  });
  
  // Manage multi-entity filters
  const {
    filters,
    formattedFilters,
    filterSummary,
    setFilter,
    clearAllFilters,
    errors,
    warnings,
    hasAnyFilters
  } = useMultiEntityFilter({
    debounceDelay: 300,
    maxRecommended: 100
  });
  
  // Fetch containers with filters
  const { data: containers, isLoading } = useQuery({
    queryKey: ['containers', formattedFilters],
    queryFn: () => ApiService.apiV1InfrastructureContainersList(formattedFilters),
    enabled: hasAnyFilters // Only fetch when filters are applied
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Containers</h1>
        {hasAnyFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filterSummary}
            </span>
            <button onClick={clearAllFilters}>Clear All</button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <MultiSelectFilter
          options={halls?.results?.map(h => ({
            id: h.id,
            label: h.name,
            description: `Station: ${h.station}`
          })) || []}
          selectedIds={filters.hall__in || []}
          onChange={(ids) => setFilter('hall__in', ids)}
          label="Halls"
          placeholder="Filter by halls..."
          error={errors.hall__in}
          warning={warnings.hall__in}
          showCount
        />
        
        <MultiSelectFilter
          options={areas?.results?.map(a => ({
            id: a.id,
            label: a.name,
            description: `${a.area_type}`
          })) || []}
          selectedIds={filters.area__in || []}
          onChange={(ids) => setFilter('area__in', ids)}
          label="Areas"
          placeholder="Filter by areas..."
          error={errors.area__in}
          warning={warnings.area__in}
          showCount
        />
      </div>
      
      {isLoading && <div>Loading containers...</div>}
      
      {containers && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Found {containers.count} containers
          </p>
          {/* Render container list */}
        </div>
      )}
    </div>
  );
}
```

## API Integration Patterns

### Pattern 1: Infrastructure Filtering

```tsx
// Containers by halls
const { formattedFilters } = useMultiEntityFilter({
  initialFilters: { hall__in: [151, 152, 153] }
});

const { data } = useQuery({
  queryKey: ['containers', formattedFilters],
  queryFn: () => ApiService.apiV1InfrastructureContainersList(formattedFilters)
});
```

### Pattern 2: Batch Management Filtering

```tsx
// Batches by species and lifecycle stage
const { formattedFilters, setFilter } = useMultiEntityFilter();

// Filter by multiple species
setFilter('species__in', [1, 2, 3]);

// Filter by multiple lifecycle stages
setFilter('lifecycle_stage__in', [5, 6]);

const { data } = useQuery({
  queryKey: ['batches', formattedFilters],
  queryFn: () => ApiService.apiV1BatchBatchesList(formattedFilters)
});
```

### Pattern 3: Environmental Data Filtering

```tsx
// Environmental readings by multiple containers and parameters
const { formattedFilters, setFilter } = useMultiEntityFilter();

setFilter('container__in', [1, 2, 3, 4, 5]);
setFilter('parameter__in', [10, 11]); // Temperature, Oxygen

const { data } = useQuery({
  queryKey: ['readings', formattedFilters],
  queryFn: () => ApiService.apiV1EnvironmentalReadingsList(formattedFilters)
});
```

### Pattern 4: Inventory Filtering

```tsx
// Feeding events by multiple batches and feeds
const { formattedFilters, setFilter } = useMultiEntityFilter();

setFilter('batch__in', [100, 101, 102]);
setFilter('feed__in', [1, 2]);

const { data } = useQuery({
  queryKey: ['feeding-events', formattedFilters],
  queryFn: () => ApiService.apiV1InventoryFeedingEventsList(formattedFilters)
});
```

## Performance Considerations

### 1. Debouncing

The `useMultiEntityFilter` hook automatically debounces filter changes to prevent excessive API calls:

```tsx
const { formattedFilters } = useMultiEntityFilter({
  debounceDelay: 500 // Wait 500ms after last change before triggering onChange
});
```

### 2. Performance Warnings

Large ID arrays (>100 by default) trigger automatic performance warnings:

```tsx
const { warnings } = useMultiEntityFilter({
  maxRecommended: 50 // Lower threshold for stricter warnings
});

// warnings.hall__in: "Filtering by 75 halls may impact performance..."
```

### 3. Query Optimization

Use React Query's features to optimize large result sets:

```tsx
const { data } = useQuery({
  queryKey: ['containers', formattedFilters],
  queryFn: () => ApiService.apiV1InfrastructureContainersList({
    ...formattedFilters,
    page_size: 100 // Pagination
  }),
  staleTime: 60000, // Cache for 1 minute
  cacheTime: 300000 // Keep in memory for 5 minutes
});
```

## Testing

### Testing Components with Multi-Entity Filters

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyFilteredComponent } from './MyFilteredComponent';

test('filters containers by selected halls', async () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  // Mock API responses
  global.fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        results: [
          { id: 1, name: 'Hall 1' },
          { id: 2, name: 'Hall 2' }
        ]
      })
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        count: 5,
        results: [/* container data */]
      })
    });
  
  render(
    <QueryClientProvider client={qc}>
      <MyFilteredComponent />
    </QueryClientProvider>
  );
  
  // Open hall filter
  const hallFilter = screen.getByRole('combobox', { name: /halls/i });
  await userEvent.click(hallFilter);
  
  // Select halls
  await userEvent.click(screen.getByText('Hall 1'));
  await userEvent.click(screen.getByText('Hall 2'));
  
  // Verify filter applied
  await waitFor(() => {
    expect(screen.getByText(/2 items selected/i)).toBeInTheDocument();
  });
  
  // Verify API called with correct filter
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('hall__in=1,2'),
      expect.any(Object)
    );
  });
});
```

## Troubleshooting

### Issue: Filters not updating

**Solution:** Ensure you're using the `formattedFilters` object, not the raw `filters`:

```tsx
// ❌ Wrong
queryFn: () => ApiService.containersList(filters)

// ✅ Correct
queryFn: () => ApiService.containersList(formattedFilters)
```

### Issue: Too many API calls

**Solution:** Increase debounce delay or use onChange callback:

```tsx
const { formattedFilters } = useMultiEntityFilter({
  debounceDelay: 1000 // Increase delay
});
```

### Issue: Performance warnings for small selections

**Solution:** Adjust maxRecommended threshold:

```tsx
const { formattedFilters, warnings } = useMultiEntityFilter({
  maxRecommended: 200 // Increase threshold
});
```

## Related Documentation

- [Backend Filtering Fix - Issue #73](https://github.com/aquarian247/AquaMind/issues/73)
- [Implementation Plan - Task 2.5](/docs/progress/frontend_aggregation/implementation_plan.md)
- [Contributing Guide](/docs/CONTRIBUTING.md)
- [Frontend Testing Guide](/docs/frontend_testing_guide.md)


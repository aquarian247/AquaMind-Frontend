/**
 * Multi-Entity Filtering Demo Page
 * 
 * Demonstrates the complete integration of multi-entity filtering
 * with the generated API client and TanStack Query.
 * 
 * This example shows:
 * 1. Using useMultiEntityFilter hook for state management
 * 2. MultiSelectFilter components for UI
 * 3. Integration with generated ApiService
 * 4. Proper error handling and loading states
 * 5. Performance optimization with debouncing
 */

import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { MultiSelectFilter } from '@/components/filters';
import { useMultiEntityFilter } from '@/hooks/useMultiEntityFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MultiEntityFilteringDemo() {
  // Initialize multi-entity filter state
  const {
    filters,
    formattedFilters,
    filterSummary,
    setFilter,
    clearAllFilters,
    hasAnyFilters,
    errors,
    warnings
  } = useMultiEntityFilter({
    debounceDelay: 300,
    maxRecommended: 100,
    onChange: (formatted) => {
      console.log('Filters changed:', formatted);
    }
  });

  // Fetch available filter options
  const { data: halls, isLoading: hallsLoading } = useQuery({
    queryKey: ['halls'],
    queryFn: async () => {
      const response = await ApiService.apiV1InfrastructureHallsList();
      return response;
    }
  });

  const { data: areas, isLoading: areasLoading } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const response = await ApiService.apiV1InfrastructureAreasList();
      return response;
    }
  });

  const { data: batches, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const response = await ApiService.apiV1BatchBatchesList();
      return response;
    }
  });

  // Fetch filtered containers
  const {
    data: containers,
    isLoading: containersLoading,
    error: containersError,
    refetch: refetchContainers
  } = useQuery({
    queryKey: ['filtered-containers', formattedFilters],
    queryFn: async () => {
      const response = await ApiService.apiV1InfrastructureContainersList(formattedFilters);
      return response;
    },
    enabled: hasAnyFilters // Only fetch when filters are applied
  });

  // Fetch filtered batch assignments
  const {
    data: assignments,
    isLoading: assignmentsLoading,
    error: assignmentsError
  } = useQuery({
    queryKey: ['filtered-assignments', formattedFilters],
    queryFn: async () => {
      const response = await ApiService.apiV1BatchContainerAssignmentsList(formattedFilters);
      return response;
    },
    enabled: hasAnyFilters
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Multi-Entity Filtering Demo</h1>
          <p className="text-muted-foreground">
            Demonstration of multi-entity filtering with reliable `__in` support
          </p>
        </div>
        {hasAnyFilters && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Filter Status */}
      {hasAnyFilters && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Active Filters: {filterSummary}
          </AlertDescription>
        </Alert>
      )}

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Options</CardTitle>
          <CardDescription>
            Select multiple entities to filter data. Changes are debounced for performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hall Filter */}
            <MultiSelectFilter
              options={
                halls?.results?.map(hall => ({
                  id: hall.id!,
                  label: hall.name || `Hall ${hall.id}`,
                  description: hall.station_name
                    ? `Station: ${hall.station_name}`
                    : undefined
                })) || []
              }
              selectedIds={filters.hall__in || []}
              onChange={(ids) => setFilter('hall__in', ids)}
              label="Halls"
              placeholder={hallsLoading ? 'Loading halls...' : 'Select halls...'}
              disabled={hallsLoading}
              error={errors.hall__in}
              warning={warnings.hall__in}
              showCount
              showClearAll
            />

            {/* Area Filter */}
            <MultiSelectFilter
              options={
                areas?.results?.map(area => ({
                  id: area.id!,
                  label: area.name || `Area ${area.id}`,
                  description: area.area_type || undefined
                })) || []
              }
              selectedIds={filters.area__in || []}
              onChange={(ids) => setFilter('area__in', ids)}
              label="Areas"
              placeholder={areasLoading ? 'Loading areas...' : 'Select areas...'}
              disabled={areasLoading}
              error={errors.area__in}
              warning={warnings.area__in}
              showCount
              showClearAll
            />

            {/* Batch Filter */}
            <MultiSelectFilter
              options={
                batches?.results?.map(batch => ({
                  id: batch.id!,
                  label: batch.batch_number || `Batch ${batch.id}`,
                  description: batch.species_name
                    ? `Species: ${batch.species_name}`
                    : undefined
                })) || []
              }
              selectedIds={filters.batch__in || []}
              onChange={(ids) => setFilter('batch__in', ids)}
              label="Batches"
              placeholder={batchesLoading ? 'Loading batches...' : 'Select batches...'}
              disabled={batchesLoading}
              error={errors.batch__in}
              warning={warnings.batch__in}
              showCount
              showClearAll
            />
          </div>

          {/* Debug Info */}
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Debug: View Formatted Filters
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto">
              {JSON.stringify(formattedFilters, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>

      {/* Results Section */}
      {!hasAnyFilters ? (
        <Alert>
          <AlertDescription>
            Select one or more filters above to view filtered results.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Containers Results */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Filtered Containers</CardTitle>
                <CardDescription>
                  Containers matching selected filters
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetchContainers()}
                disabled={containersLoading}
              >
                <RefreshCw className={`h-4 w-4 ${containersLoading ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            <CardContent>
              {containersLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {containersError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Error loading containers: {containersError.message}
                  </AlertDescription>
                </Alert>
              )}

              {containers && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {containers.count} total results
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Showing {containers.results?.length || 0} of {containers.count}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {containers.results?.map(container => (
                      <div
                        key={container.id}
                        className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{container.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {container.container_type || 'Unknown type'}
                            </p>
                          </div>
                          <Badge variant="outline">ID: {container.id}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignments Results */}
          <Card>
            <CardHeader>
              <CardTitle>Filtered Batch Assignments</CardTitle>
              <CardDescription>
                Active batch-container assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignmentsLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {assignmentsError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Error loading assignments: {assignmentsError.message}
                  </AlertDescription>
                </Alert>
              )}

              {assignments && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {assignments.count} total results
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Showing {assignments.results?.length || 0} of {assignments.count}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {assignments.results?.map(assignment => (
                      <div
                        key={assignment.id}
                        className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              Assignment #{assignment.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {assignment.is_active ? (
                                <Badge variant="default">Active</Badge>
                              ) : (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documentation Link */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This demo showcases the multi-entity filtering system built to support
            the backend's `__in` filtering capabilities.
          </p>
          <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
            <li>Utilities: <code>lib/filterUtils.ts</code></li>
            <li>Hook: <code>hooks/useMultiEntityFilter.ts</code></li>
            <li>Component: <code>components/filters/MultiSelectFilter.tsx</code></li>
            <li>
              Backend Fix:{' '}
              <a
                href="https://github.com/aquarian247/AquaMind/issues/73"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Issue #73
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


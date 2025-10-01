import { useState, useCallback, useMemo } from 'react';
import {
  formatInFilter,
  parseInFilter,
  validateEntityIds,
  debounceFilterChange,
  optimizeEntityIdArray,
  createFilterSummary,
  formatMultiEntityFilters
} from '@/lib/filterUtils';

/**
 * Configuration options for multi-entity filtering
 */
export interface MultiEntityFilterConfig {
  /** Initial filter values */
  initialFilters?: Record<string, number[]>;
  /** Debounce delay in milliseconds (default: 300) */
  debounceDelay?: number;
  /** Maximum recommended IDs per filter (default: 100) */
  maxRecommended?: number;
  /** Callback when filters change */
  onChange?: (filters: Record<string, string>) => void;
}

/**
 * Return type for useMultiEntityFilter hook
 */
export interface MultiEntityFilterState {
  /** Current filter values as ID arrays */
  filters: Record<string, number[]>;
  /** Formatted filters ready for API consumption */
  formattedFilters: Record<string, string>;
  /** Human-readable filter summary */
  filterSummary: string;
  /** Set a specific filter */
  setFilter: (key: string, ids: number[]) => void;
  /** Clear a specific filter */
  clearFilter: (key: string) => void;
  /** Clear all filters */
  clearAllFilters: () => void;
  /** Add IDs to a specific filter */
  addToFilter: (key: string, ids: number[]) => void;
  /** Remove IDs from a specific filter */
  removeFromFilter: (key: string, ids: number[]) => void;
  /** Toggle an ID in a specific filter */
  toggleFilterId: (key: string, id: number) => void;
  /** Check if a filter has any values */
  hasFilter: (key: string) => boolean;
  /** Check if any filters are active */
  hasAnyFilters: boolean;
  /** Validation errors by filter key */
  errors: Record<string, string>;
  /** Performance warnings by filter key */
  warnings: Record<string, string>;
}

/**
 * Custom hook for managing multi-entity filter state
 * 
 * Provides comprehensive filter management with validation, debouncing,
 * and performance optimization for `__in` style API filters.
 * 
 * @param config - Configuration options
 * @returns Filter state and management functions
 * 
 * @example
 * const {
 *   filters,
 *   formattedFilters,
 *   setFilter,
 *   clearAllFilters
 * } = useMultiEntityFilter({
 *   initialFilters: { hall__in: [1, 2, 3] },
 *   debounceDelay: 300
 * });
 * 
 * // Use formattedFilters in API calls
 * const { data } = useQuery({
 *   queryKey: ['containers', formattedFilters],
 *   queryFn: () => ApiService.apiV1InfrastructureContainersList(formattedFilters)
 * });
 */
export function useMultiEntityFilter(
  config: MultiEntityFilterConfig = {}
): MultiEntityFilterState {
  const {
    initialFilters = {},
    debounceDelay = 300,
    maxRecommended = 100,
    onChange
  } = config;

  // State for filter values
  const [filters, setFilters] = useState<Record<string, number[]>>(initialFilters);
  
  // State for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // State for performance warnings
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  // Debounced onChange callback
  const debouncedOnChange = useMemo(
    () => (onChange ? debounceFilterChange(onChange, debounceDelay) : undefined),
    [onChange, debounceDelay]
  );

  // Validate and update filters
  const updateFilters = useCallback(
    (newFilters: Record<string, number[]>) => {
      const newErrors: Record<string, string> = {};
      const newWarnings: Record<string, string> = {};

      // Validate each filter
      for (const [key, ids] of Object.entries(newFilters)) {
        if (ids.length === 0) continue;

        const validation = validateEntityIds(ids);
        if (!validation.valid && validation.error) {
          newErrors[key] = validation.error;
          continue;
        }

        const entityType = key.replace(/__in$/, '');
        const optimization = optimizeEntityIdArray(ids, entityType, maxRecommended);
        if (optimization.warning) {
          newWarnings[key] = optimization.warning;
        }
      }

      setErrors(newErrors);
      setWarnings(newWarnings);
      setFilters(newFilters);

      // Trigger onChange callback with formatted filters
      if (debouncedOnChange) {
        const formatted = formatMultiEntityFilters(newFilters);
        debouncedOnChange(formatted);
      }
    },
    [maxRecommended, debouncedOnChange]
  );

  // Set a specific filter
  const setFilter = useCallback(
    (key: string, ids: number[]) => {
      updateFilters({ ...filters, [key]: ids });
    },
    [filters, updateFilters]
  );

  // Clear a specific filter
  const clearFilter = useCallback(
    (key: string) => {
      const newFilters = { ...filters };
      delete newFilters[key];
      updateFilters(newFilters);
    },
    [filters, updateFilters]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    updateFilters({});
  }, [updateFilters]);

  // Add IDs to a specific filter
  const addToFilter = useCallback(
    (key: string, idsToAdd: number[]) => {
      const currentIds = filters[key] || [];
      const newIds = Array.from(new Set([...currentIds, ...idsToAdd]));
      setFilter(key, newIds);
    },
    [filters, setFilter]
  );

  // Remove IDs from a specific filter
  const removeFromFilter = useCallback(
    (key: string, idsToRemove: number[]) => {
      const currentIds = filters[key] || [];
      const removeSet = new Set(idsToRemove);
      const newIds = currentIds.filter(id => !removeSet.has(id));
      if (newIds.length === 0) {
        clearFilter(key);
      } else {
        setFilter(key, newIds);
      }
    },
    [filters, setFilter, clearFilter]
  );

  // Toggle an ID in a specific filter
  const toggleFilterId = useCallback(
    (key: string, id: number) => {
      const currentIds = filters[key] || [];
      if (currentIds.includes(id)) {
        removeFromFilter(key, [id]);
      } else {
        addToFilter(key, [id]);
      }
    },
    [filters, addToFilter, removeFromFilter]
  );

  // Check if a filter has any values
  const hasFilter = useCallback(
    (key: string): boolean => {
      return (filters[key]?.length || 0) > 0;
    },
    [filters]
  );

  // Check if any filters are active
  const hasAnyFilters = useMemo(() => {
    return Object.values(filters).some(ids => ids.length > 0);
  }, [filters]);

  // Format filters for API consumption
  const formattedFilters = useMemo(() => {
    return formatMultiEntityFilters(filters);
  }, [filters]);

  // Create human-readable filter summary
  const filterSummary = useMemo(() => {
    return createFilterSummary(filters);
  }, [filters]);

  return {
    filters,
    formattedFilters,
    filterSummary,
    setFilter,
    clearFilter,
    clearAllFilters,
    addToFilter,
    removeFromFilter,
    toggleFilterId,
    hasFilter,
    hasAnyFilters,
    errors,
    warnings
  };
}


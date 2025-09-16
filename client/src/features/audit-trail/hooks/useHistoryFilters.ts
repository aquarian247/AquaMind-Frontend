import { useState, useCallback, useMemo, useEffect } from 'react';
import { HistoryFilters } from '../api/api';

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout;
  const debounced = ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T & { cancel: () => void };

  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

// History type for change types
export type HistoryType = '+' | '~' | '-';

export interface HistoryFilterState extends HistoryFilters {
  selectedModel?: string;
}

const INITIAL_FILTERS: HistoryFilterState = {
  dateFrom: undefined,
  dateTo: undefined,
  historyUser: undefined,
  historyType: undefined,
  page: 1,
  selectedModel: undefined,
};

export function useHistoryFilters() {
  const [filters, setFilters] = useState<HistoryFilterState>(INITIAL_FILTERS);

  // Debounced search for better performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const debouncedSearch = useMemo(
    () => debounce((term: string) => setDebouncedSearchTerm(term), 300),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [debouncedSearch]);

  const updateFilters = useCallback((updates: Partial<HistoryFilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      // Reset page to 1 when filters change (except page itself)
      page: updates.page !== undefined ? updates.page : 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const setDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    updateFilters({ dateFrom, dateTo });
  }, [updateFilters]);

  const setUserFilter = useCallback((historyUser?: string) => {
    updateFilters({ historyUser });
    // Trigger debounced search for user filter
    if (historyUser) {
      debouncedSearch(historyUser);
    }
  }, [updateFilters, debouncedSearch]);

  const setTypeFilter = useCallback((historyType?: HistoryType) => {
    updateFilters({ historyType });
  }, [updateFilters]);

  const setModelFilter = useCallback((selectedModel?: string) => {
    updateFilters({ selectedModel });
  }, [updateFilters]);

  const setPage = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  const nextPage = useCallback(() => {
    setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }));
  }, []);

  // Convert to API filter format (excluding UI-only fields)
  const getApiFilters = useCallback((): HistoryFilters => {
    const { selectedModel, ...apiFilters } = filters;
    return apiFilters;
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    setDateRange,
    setUserFilter,
    setTypeFilter,
    setModelFilter,
    setPage,
    nextPage,
    prevPage,
    getApiFilters,
    debouncedSearchTerm,
    debouncedSearch,
  };
}

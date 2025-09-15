import { useState, useCallback } from 'react';
import { HistoryFilters } from '../api/api';

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
  }, [updateFilters]);

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
  };
}

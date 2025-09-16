import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistoryFilters } from './useHistoryFilters';

describe('useHistoryFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useHistoryFilters());

    expect(result.current.filters).toEqual({
      dateFrom: undefined,
      dateTo: undefined,
      historyUser: undefined,
      historyType: undefined,
      page: 1,
      selectedModel: undefined,
    });
  });

  it('should update filters with updateFilters', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.updateFilters({
        dateFrom: '2024-01-01',
        historyUser: 'testuser'
      });
    });

    expect(result.current.filters.dateFrom).toBe('2024-01-01');
    expect(result.current.filters.historyUser).toBe('testuser');
    expect(result.current.filters.page).toBe(1); // Should reset to 1
  });

  it('should not reset page when page is explicitly updated', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.updateFilters({ page: 5 });
    });

    expect(result.current.filters.page).toBe(5);
  });

  it('should reset filters to initial state', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.updateFilters({
        dateFrom: '2024-01-01',
        historyUser: 'testuser',
        page: 3
      });
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({
      dateFrom: undefined,
      dateTo: undefined,
      historyUser: undefined,
      historyType: undefined,
      page: 1,
      selectedModel: undefined,
    });
  });

  it('should set date range correctly', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.setDateRange('2024-01-01', '2024-01-31');
    });

    expect(result.current.filters.dateFrom).toBe('2024-01-01');
    expect(result.current.filters.dateTo).toBe('2024-01-31');
    expect(result.current.filters.page).toBe(1); // Should reset page
  });

  it('should set user filter and trigger debounced search', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.setUserFilter('testuser');
    });

    expect(result.current.filters.historyUser).toBe('testuser');

    // Fast-forward debounce timer
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedSearchTerm).toBe('testuser');
  });

  it('should set type filter correctly', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.setTypeFilter('+');
    });

    expect(result.current.filters.historyType).toBe('+');
    expect(result.current.filters.page).toBe(1);
  });

  it('should set model filter correctly', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.setModelFilter('batch');
    });

    expect(result.current.filters.selectedModel).toBe('batch');
    expect(result.current.filters.page).toBe(1);
  });

  it('should handle page navigation', () => {
    const { result } = renderHook(() => useHistoryFilters());

    // Set initial page
    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.filters.page).toBe(3);

    // Next page
    act(() => {
      result.current.nextPage();
    });
    expect(result.current.filters.page).toBe(4);

    // Previous page
    act(() => {
      result.current.prevPage();
    });
    expect(result.current.filters.page).toBe(3);

    // Previous page from page 1 should stay at 1
    act(() => {
      result.current.setPage(1);
      result.current.prevPage();
    });
    expect(result.current.filters.page).toBe(1);
  });

  it('should return API filters excluding UI-only fields', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.updateFilters({
        dateFrom: '2024-01-01',
        historyUser: 'testuser',
        selectedModel: 'batch', // UI-only field
        page: 2
      });
    });

    const apiFilters = result.current.getApiFilters();

    expect(apiFilters).toEqual({
      dateFrom: '2024-01-01',
      dateTo: undefined,
      historyUser: 'testuser',
      historyType: undefined,
      page: 2,
    });

    expect(apiFilters).not.toHaveProperty('selectedModel');
  });

  it('should debounce search correctly', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.setUserFilter('test');
    });

    // Should not update immediately
    expect(result.current.debouncedSearchTerm).toBe('');

    // After debounce delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedSearchTerm).toBe('test');
  });

  it('should cancel debounce on unmount', () => {
    const { result, unmount } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.setUserFilter('test');
    });

    // Unmount should cancel the debounce
    unmount();

    // Even after timer, should not update
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedSearchTerm).toBe('');
  });

  it('should handle multiple rapid filter changes', () => {
    const { result } = renderHook(() => useHistoryFilters());

    act(() => {
      result.current.setUserFilter('test1');
      result.current.setUserFilter('test2');
      result.current.setUserFilter('test3');
    });

    // Should only trigger the last one after debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedSearchTerm).toBe('test3');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMultiEntityFilter } from './useMultiEntityFilter';

describe('useMultiEntityFilter', () => {
  describe('initialization', () => {
    it('should initialize with empty filters', () => {
      const { result } = renderHook(() => useMultiEntityFilter());
      
      expect(result.current.filters).toEqual({});
      expect(result.current.formattedFilters).toEqual({});
      expect(result.current.hasAnyFilters).toBe(false);
    });

    it('should initialize with provided filters', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: {
            hall__in: [1, 2, 3],
            area__in: [10]
          }
        })
      );
      
      expect(result.current.filters).toEqual({
        hall__in: [1, 2, 3],
        area__in: [10]
      });
      expect(result.current.formattedFilters).toEqual({
        hall__in: '1,2,3',
        area__in: '10'
      });
      expect(result.current.hasAnyFilters).toBe(true);
    });
  });

  describe('setFilter', () => {
    it('should set a filter', () => {
      const { result } = renderHook(() => useMultiEntityFilter());
      
      act(() => {
        result.current.setFilter('hall__in', [1, 2, 3]);
      });
      
      expect(result.current.filters.hall__in).toEqual([1, 2, 3]);
      expect(result.current.formattedFilters.hall__in).toBe('1,2,3');
    });

    it('should update existing filter', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: { hall__in: [1, 2] }
        })
      );
      
      act(() => {
        result.current.setFilter('hall__in', [3, 4, 5]);
      });
      
      expect(result.current.filters.hall__in).toEqual([3, 4, 5]);
    });
  });

  describe('clearFilter', () => {
    it('should clear a specific filter', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: {
            hall__in: [1, 2, 3],
            area__in: [10]
          }
        })
      );
      
      act(() => {
        result.current.clearFilter('hall__in');
      });
      
      expect(result.current.filters.hall__in).toBeUndefined();
      expect(result.current.filters.area__in).toEqual([10]);
    });
  });

  describe('clearAllFilters', () => {
    it('should clear all filters', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: {
            hall__in: [1, 2, 3],
            area__in: [10],
            batch__in: [100]
          }
        })
      );
      
      act(() => {
        result.current.clearAllFilters();
      });
      
      expect(result.current.filters).toEqual({});
      expect(result.current.hasAnyFilters).toBe(false);
    });
  });

  describe('addToFilter', () => {
    it('should add IDs to existing filter', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: { hall__in: [1, 2] }
        })
      );
      
      act(() => {
        result.current.addToFilter('hall__in', [3, 4]);
      });
      
      expect(result.current.filters.hall__in).toEqual([1, 2, 3, 4]);
    });

    it('should create new filter if it does not exist', () => {
      const { result } = renderHook(() => useMultiEntityFilter());
      
      act(() => {
        result.current.addToFilter('hall__in', [1, 2]);
      });
      
      expect(result.current.filters.hall__in).toEqual([1, 2]);
    });

    it('should not add duplicate IDs', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: { hall__in: [1, 2] }
        })
      );
      
      act(() => {
        result.current.addToFilter('hall__in', [2, 3]);
      });
      
      expect(result.current.filters.hall__in).toEqual([1, 2, 3]);
    });
  });

  describe('removeFromFilter', () => {
    it('should remove IDs from filter', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: { hall__in: [1, 2, 3, 4] }
        })
      );
      
      act(() => {
        result.current.removeFromFilter('hall__in', [2, 4]);
      });
      
      expect(result.current.filters.hall__in).toEqual([1, 3]);
    });

    it('should clear filter if all IDs removed', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: { hall__in: [1, 2] }
        })
      );
      
      act(() => {
        result.current.removeFromFilter('hall__in', [1, 2]);
      });
      
      expect(result.current.filters.hall__in).toBeUndefined();
    });
  });

  describe('toggleFilterId', () => {
    it('should add ID if not present', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: { hall__in: [1, 2] }
        })
      );
      
      act(() => {
        result.current.toggleFilterId('hall__in', 3);
      });
      
      expect(result.current.filters.hall__in).toEqual([1, 2, 3]);
    });

    it('should remove ID if present', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: { hall__in: [1, 2, 3] }
        })
      );
      
      act(() => {
        result.current.toggleFilterId('hall__in', 2);
      });
      
      expect(result.current.filters.hall__in).toEqual([1, 3]);
    });
  });

  describe('hasFilter', () => {
    it('should return true if filter has values', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: { hall__in: [1, 2] }
        })
      );
      
      expect(result.current.hasFilter('hall__in')).toBe(true);
    });

    it('should return false if filter is empty', () => {
      const { result } = renderHook(() => useMultiEntityFilter());
      
      expect(result.current.hasFilter('hall__in')).toBe(false);
    });
  });

  describe('validation', () => {
    it('should set error for invalid IDs', () => {
      const { result } = renderHook(() => useMultiEntityFilter());
      
      act(() => {
        result.current.setFilter('hall__in', [-1, 0] as any);
      });
      
      expect(result.current.errors.hall__in).toBeDefined();
      expect(result.current.errors.hall__in).toContain('Invalid ID');
    });

    it('should clear error when valid IDs are set', () => {
      const { result } = renderHook(() => useMultiEntityFilter());
      
      // Set invalid IDs
      act(() => {
        result.current.setFilter('hall__in', [-1] as any);
      });
      
      expect(result.current.errors.hall__in).toBeDefined();
      
      // Set valid IDs
      act(() => {
        result.current.setFilter('hall__in', [1, 2, 3]);
      });
      
      expect(result.current.errors.hall__in).toBeUndefined();
    });
  });

  describe('performance warnings', () => {
    it('should warn when exceeding recommended limit', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({ maxRecommended: 5 })
      );
      
      act(() => {
        result.current.setFilter('hall__in', [1, 2, 3, 4, 5, 6, 7, 8]);
      });
      
      expect(result.current.warnings.hall__in).toBeDefined();
      expect(result.current.warnings.hall__in).toContain('performance');
    });

    it('should not warn when within recommended limit', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({ maxRecommended: 10 })
      );
      
      act(() => {
        result.current.setFilter('hall__in', [1, 2, 3]);
      });
      
      expect(result.current.warnings.hall__in).toBeUndefined();
    });
  });

  describe('onChange callback', () => {
    it('should call onChange with formatted filters', async () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          onChange,
          debounceDelay: 50 // Short delay for testing
        })
      );
      
      act(() => {
        result.current.setFilter('hall__in', [1, 2, 3]);
      });
      
      // Wait for debounce
      await waitFor(
        () => {
          expect(onChange).toHaveBeenCalledWith({ hall__in: '1,2,3' });
        },
        { timeout: 200 }
      );
    });

    it('should debounce onChange calls', async () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          onChange,
          debounceDelay: 100
        })
      );
      
      // Make multiple rapid changes
      act(() => {
        result.current.setFilter('hall__in', [1]);
        result.current.setFilter('hall__in', [1, 2]);
        result.current.setFilter('hall__in', [1, 2, 3]);
      });
      
      // Wait for debounce
      await waitFor(
        () => {
          expect(onChange).toHaveBeenCalledTimes(1);
          expect(onChange).toHaveBeenCalledWith({ hall__in: '1,2,3' });
        },
        { timeout: 300 }
      );
    });
  });

  describe('filterSummary', () => {
    it('should create summary of active filters', () => {
      const { result } = renderHook(() =>
        useMultiEntityFilter({
          initialFilters: {
            hall__in: [1, 2, 3],
            area__in: [10]
          }
        })
      );
      
      expect(result.current.filterSummary).toBe('Hall: 3, Area: 1');
    });

    it('should update summary when filters change', () => {
      const { result } = renderHook(() => useMultiEntityFilter());
      
      expect(result.current.filterSummary).toBe('No filters applied');
      
      act(() => {
        result.current.setFilter('hall__in', [1, 2]);
      });
      
      expect(result.current.filterSummary).toBe('Hall: 2');
    });
  });
});


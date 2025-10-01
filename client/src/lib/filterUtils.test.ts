import { describe, it, expect, vi } from 'vitest';
import {
  formatInFilter,
  parseInFilter,
  validateEntityIds,
  formatMultiEntityFilters,
  debounceFilterChange,
  optimizeEntityIdArray,
  isValidEntityId,
  createFilterSummary
} from './filterUtils';

describe('formatInFilter', () => {
  it('should format array of numbers into comma-separated string', () => {
    expect(formatInFilter([1, 2, 3])).toBe('1,2,3');
  });

  it('should handle single ID', () => {
    expect(formatInFilter([42])).toBe('42');
  });

  it('should return undefined for empty array', () => {
    expect(formatInFilter([])).toBeUndefined();
  });

  it('should return undefined for null/undefined', () => {
    expect(formatInFilter(null)).toBeUndefined();
    expect(formatInFilter(undefined)).toBeUndefined();
  });

  it('should filter out duplicates', () => {
    expect(formatInFilter([1, 2, 2, 3, 3, 3])).toBe('1,2,3');
  });

  it('should handle string IDs', () => {
    expect(formatInFilter(['1', '2', '3'])).toBe('1,2,3');
  });

  it('should filter out null/undefined values', () => {
    expect(formatInFilter([1, null, 2, undefined, 3] as any)).toBe('1,2,3');
  });
});

describe('parseInFilter', () => {
  it('should parse comma-separated string into array of numbers', () => {
    expect(parseInFilter('1,2,3')).toEqual([1, 2, 3]);
  });

  it('should handle single ID', () => {
    expect(parseInFilter('42')).toEqual([42]);
  });

  it('should return empty array for empty string', () => {
    expect(parseInFilter('')).toEqual([]);
  });

  it('should return empty array for null/undefined', () => {
    expect(parseInFilter(null)).toEqual([]);
    expect(parseInFilter(undefined)).toEqual([]);
  });

  it('should handle whitespace', () => {
    expect(parseInFilter('1, 2, 3')).toEqual([1, 2, 3]);
    expect(parseInFilter(' 1 , 2 , 3 ')).toEqual([1, 2, 3]);
  });

  it('should filter out invalid values', () => {
    expect(parseInFilter('1,abc,2,def,3')).toEqual([1, 2, 3]);
  });

  it('should filter out zero and negative numbers', () => {
    expect(parseInFilter('0,-1,1,2,-5,3')).toEqual([1, 2, 3]);
  });
});

describe('validateEntityIds', () => {
  it('should validate array of positive integers', () => {
    const result = validateEntityIds([1, 2, 3]);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept empty array', () => {
    const result = validateEntityIds([]);
    expect(result.valid).toBe(true);
  });

  it('should reject non-array', () => {
    const result = validateEntityIds('not an array' as any);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('IDs must be an array');
  });

  it('should reject zero', () => {
    const result = validateEntityIds([0]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid ID');
  });

  it('should reject negative numbers', () => {
    const result = validateEntityIds([-1, -5]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid ID');
  });

  it('should reject NaN', () => {
    const result = validateEntityIds([NaN]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid ID');
  });

  it('should reject invalid string IDs', () => {
    const result = validateEntityIds(['abc', 'def']);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid ID');
  });

  it('should accept valid string IDs', () => {
    const result = validateEntityIds(['1', '2', '3']);
    expect(result.valid).toBe(true);
  });
});

describe('formatMultiEntityFilters', () => {
  it('should format multiple filters', () => {
    const result = formatMultiEntityFilters({
      hall__in: [1, 2, 3],
      area__in: [10, 11],
      batch__in: [100]
    });
    
    expect(result).toEqual({
      hall__in: '1,2,3',
      area__in: '10,11',
      batch__in: '100'
    });
  });

  it('should skip empty arrays', () => {
    const result = formatMultiEntityFilters({
      hall__in: [1, 2, 3],
      area__in: [],
      batch__in: null as any
    });
    
    expect(result).toEqual({
      hall__in: '1,2,3'
    });
  });

  it('should handle undefined values', () => {
    const result = formatMultiEntityFilters({
      hall__in: undefined,
      area__in: [10]
    });
    
    expect(result).toEqual({
      area__in: '10'
    });
  });

  it('should handle empty object', () => {
    const result = formatMultiEntityFilters({});
    expect(result).toEqual({});
  });
});

describe('debounceFilterChange', () => {
  it('should debounce function calls', async () => {
    const callback = vi.fn();
    const debounced = debounceFilterChange(callback, 100);

    // Call multiple times rapidly
    debounced('arg1');
    debounced('arg2');
    debounced('arg3');

    // Callback should not have been called yet
    expect(callback).not.toHaveBeenCalled();

    // Wait for debounce delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Callback should have been called once with last argument
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg3');
  });

  it('should use default delay of 300ms', async () => {
    const callback = vi.fn();
    const debounced = debounceFilterChange(callback);

    debounced('test');
    
    // Should not be called after 200ms
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(callback).not.toHaveBeenCalled();

    // Should be called after 350ms total
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('optimizeEntityIdArray', () => {
  it('should return unique IDs', () => {
    const result = optimizeEntityIdArray([1, 2, 2, 3, 3, 3], 'hall');
    expect(result.ids).toEqual([1, 2, 3]);
    expect(result.warning).toBeUndefined();
  });

  it('should warn when exceeding recommended limit', () => {
    const largeArray = Array.from({ length: 150 }, (_, i) => i + 1);
    const result = optimizeEntityIdArray(largeArray, 'hall', 100);
    
    expect(result.ids).toHaveLength(150);
    expect(result.warning).toContain('150 halls');
    expect(result.warning).toContain('performance');
  });

  it('should not warn when within recommended limit', () => {
    const result = optimizeEntityIdArray([1, 2, 3], 'hall', 100);
    expect(result.warning).toBeUndefined();
  });

  it('should use default limit of 100', () => {
    const largeArray = Array.from({ length: 101 }, (_, i) => i + 1);
    const result = optimizeEntityIdArray(largeArray, 'container');
    expect(result.warning).toBeDefined();
  });
});

describe('isValidEntityId', () => {
  it('should return true for positive integers', () => {
    expect(isValidEntityId(1)).toBe(true);
    expect(isValidEntityId(42)).toBe(true);
    expect(isValidEntityId(1000)).toBe(true);
  });

  it('should return false for zero and negative numbers', () => {
    expect(isValidEntityId(0)).toBe(false);
    expect(isValidEntityId(-1)).toBe(false);
    expect(isValidEntityId(-100)).toBe(false);
  });

  it('should return false for non-integers', () => {
    expect(isValidEntityId(1.5)).toBe(false);
    expect(isValidEntityId(3.14)).toBe(false);
  });

  it('should return false for non-numbers', () => {
    expect(isValidEntityId('1')).toBe(false);
    expect(isValidEntityId(null)).toBe(false);
    expect(isValidEntityId(undefined)).toBe(false);
    expect(isValidEntityId(NaN)).toBe(false);
    expect(isValidEntityId({})).toBe(false);
  });
});

describe('createFilterSummary', () => {
  it('should create human-readable summary', () => {
    const summary = createFilterSummary({
      hall__in: [1, 2, 3],
      area__in: [10],
      batch__in: [100, 101]
    });
    
    expect(summary).toBe('Hall: 3, Area: 1, Batch: 2');
  });

  it('should skip empty filters', () => {
    const summary = createFilterSummary({
      hall__in: [1, 2, 3],
      area__in: [],
      batch__in: null as any
    });
    
    expect(summary).toBe('Hall: 3');
  });

  it('should return default message for no filters', () => {
    const summary = createFilterSummary({});
    expect(summary).toBe('No filters applied');
  });

  it('should handle multi-word filter names', () => {
    const summary = createFilterSummary({
      lifecycle_stage__in: [1, 2]
    });
    
    expect(summary).toBe('Lifecycle Stage: 2');
  });
});


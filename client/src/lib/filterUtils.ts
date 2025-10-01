/**
 * Multi-Entity Filtering Utilities
 * 
 * Provides utilities for reliable multi-entity filtering with proper validation,
 * formatting, and error handling for `__in` filter parameters.
 */

/**
 * Formats an array of IDs into a comma-separated string for `__in` filters
 * 
 * @param ids - Array of entity IDs
 * @returns Comma-separated string of IDs, or undefined if empty
 * 
 * @example
 * formatInFilter([1, 2, 3]) // "1,2,3"
 * formatInFilter([]) // undefined
 * formatInFilter([42]) // "42"
 */
export function formatInFilter(ids: (number | string)[] | undefined | null): string | undefined {
  if (!ids || ids.length === 0) {
    return undefined;
  }
  
  // Filter out invalid values and ensure uniqueness
  const validIds = Array.from(new Set(ids.filter(id => id !== null && id !== undefined)));
  
  if (validIds.length === 0) {
    return undefined;
  }
  
  return validIds.join(',');
}

/**
 * Parses a comma-separated string of IDs into an array
 * 
 * @param filterString - Comma-separated string of IDs
 * @returns Array of numeric IDs
 * 
 * @example
 * parseInFilter("1,2,3") // [1, 2, 3]
 * parseInFilter("") // []
 * parseInFilter("42") // [42]
 */
export function parseInFilter(filterString: string | undefined | null): number[] {
  if (!filterString) {
    return [];
  }
  
  return filterString
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(id => !isNaN(id) && id > 0);
}

/**
 * Validates that IDs are valid positive integers
 * 
 * @param ids - Array of IDs to validate
 * @returns Object with validation result and error message if invalid
 */
export function validateEntityIds(ids: (number | string)[]): { valid: boolean; error?: string } {
  if (!Array.isArray(ids)) {
    return { valid: false, error: 'IDs must be an array' };
  }
  
  if (ids.length === 0) {
    return { valid: true }; // Empty is valid (means no filter)
  }
  
  for (const id of ids) {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numId) || numId <= 0) {
      return { valid: false, error: `Invalid ID: ${id}. IDs must be positive integers.` };
    }
  }
  
  return { valid: true };
}

/**
 * Safely formats multiple entity filters for API requests
 * Handles validation, deduplication, and proper formatting
 * 
 * @param filters - Object with entity type keys and ID arrays as values
 * @returns Formatted filter object ready for API consumption
 * 
 * @example
 * formatMultiEntityFilters({
 *   hall__in: [1, 2, 3],
 *   area__in: [10, 11],
 *   batch__in: []
 * })
 * // Returns: { hall__in: "1,2,3", area__in: "10,11" }
 */
export function formatMultiEntityFilters(
  filters: Record<string, (number | string)[] | undefined | null>
): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(filters)) {
    const formattedValue = formatInFilter(value);
    if (formattedValue !== undefined) {
      formatted[key] = formattedValue;
    }
  }
  
  return formatted;
}

/**
 * Debounces filter changes to prevent excessive API calls
 * 
 * @param callback - Function to call after debounce delay
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced function
 */
export function debounceFilterChange<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

/**
 * Optimizes large ID arrays by checking size and potentially warning
 * 
 * @param ids - Array of IDs
 * @param entityType - Type of entity for error messages
 * @param maxRecommended - Maximum recommended IDs (default: 100)
 * @returns Object with optimization result and warning if applicable
 */
export function optimizeEntityIdArray(
  ids: number[],
  entityType: string,
  maxRecommended: number = 100
): { ids: number[]; warning?: string } {
  const uniqueIds = Array.from(new Set(ids));
  
  if (uniqueIds.length > maxRecommended) {
    return {
      ids: uniqueIds,
      warning: `Filtering by ${uniqueIds.length} ${entityType}s may impact performance. Consider narrowing your selection.`
    };
  }
  
  return { ids: uniqueIds };
}

/**
 * Type guard to check if a value is a valid entity ID
 */
export function isValidEntityId(id: unknown): id is number {
  return typeof id === 'number' && id > 0 && Number.isInteger(id);
}

/**
 * Creates a filter summary string for display purposes
 * 
 * @param filters - Object with entity type keys and ID arrays as values
 * @returns Human-readable filter summary
 * 
 * @example
 * createFilterSummary({ hall__in: [1, 2, 3], area__in: [10] })
 * // Returns: "Halls: 3, Areas: 1"
 */
export function createFilterSummary(
  filters: Record<string, (number | string)[] | undefined | null>
): string {
  const parts: string[] = [];
  
  for (const [key, value] of Object.entries(filters)) {
    if (!value || value.length === 0) continue;
    
    // Convert snake_case__in to Title Case
    const label = key
      .replace(/__in$/, '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    parts.push(`${label}: ${value.length}`);
  }
  
  return parts.length > 0 ? parts.join(', ') : 'No filters applied';
}


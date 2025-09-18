/**
 * Utility for honest data display with fallbacks
 * Returns "N/A" or "No data available" when data is unavailable
 * Ensures consistent fallback behavior across the application
 */

/**
 * Format a value with proper fallback when data is unavailable
 * @param value - The value to format (can be null, undefined, or any value)
 * @param unit - Optional unit to append if value is valid (e.g., "kg", "%")
 * @param options - Additional formatting options
 * @returns Formatted string with value and unit, or fallback text
 */
export function formatFallback(
  value: any,
  unit?: string,
  options?: {
    fallbackText?: string;
    precision?: number;
    isZeroValid?: boolean;
  }
): string {
  const {
    fallbackText = "N/A",
    precision = 2,
    isZeroValid = true,
  } = options || {};

  // Check for null, undefined, or empty string
  if (value === null || value === undefined || value === "") {
    return fallbackText;
  }

  // Handle zero values based on isZeroValid option
  if (value === 0 && !isZeroValid) {
    return fallbackText;
  }

  // Handle boolean values explicitly
  if (typeof value === "boolean") {
    return String(value);
  }

  // Handle numeric values
  if (typeof value === "number") {
    if (isNaN(value)) {
      return fallbackText;
    }
    
    // Format number with precision
    const formatted = Number.isInteger(value) 
      ? value.toString() 
      : value.toFixed(precision);
    
    // Append unit if provided
    return unit ? `${formatted} ${unit}` : formatted;
  }

  // Handle string that might be numeric
  if (typeof value === "string") {
    const numValue = Number(value);
    if (!isNaN(numValue) && value !== "") {
      const formatted = Number.isInteger(numValue) 
        ? numValue.toString() 
        : numValue.toFixed(precision);
      return unit ? `${formatted} ${unit}` : formatted;
    }
    // Return non-numeric string as-is if not empty
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return fallbackText;
    }
    return value.join(",");
  }

  // For other non-numeric values (objects, etc), return as string if truthy
  if (value) {
    return String(value);
  }

  return fallbackText;
}

/**
 * Format percentage value with % sign and proper fallback
 * @param value - The percentage value
 * @param precision - Number of decimal places (default: 1)
 * @returns Formatted percentage or "N/A"
 */
export function formatPercentage(
  value: number | null | undefined,
  precision: number = 1
): string {
  return formatFallback(value, "%", { precision });
}

/**
 * Format weight value with "kg" unit and proper fallback
 * @param value - The weight value in kilograms
 * @param precision - Number of decimal places (default: 2)
 * @returns Formatted weight or "N/A"
 */
export function formatWeight(
  value: number | null | undefined,
  precision: number = 2
): string {
  return formatFallback(value, "kg", { precision });
}

/**
 * Format count/population value with proper fallback
 * @param value - The count/population value
 * @param unit - Optional unit (e.g., "fish", "containers")
 * @returns Formatted count or "N/A"
 */
export function formatCount(
  value: number | null | undefined,
  unit?: string
): string {
  return formatFallback(value, unit, { precision: 0 });
}

/**
 * Format currency value with $ sign and proper fallback
 * @param value - The currency value
 * @param precision - Number of decimal places (default: 2)
 * @returns Formatted currency or "N/A"
 */
export function formatCurrency(
  value: number | null | undefined,
  precision: number = 2
): string {
  if (value === null || value === undefined) {
    return "N/A";
  }
  // Always format currency with decimal places
  const formatted = typeof value === "number" ? value.toFixed(precision) : formatFallback(value, undefined, { precision });
  return `$${formatted}`;
}

/**
 * Check if a value is available (not null, undefined, or empty)
 * @param value - The value to check
 * @returns True if value is available, false otherwise
 */
export function isDataAvailable(value: any): boolean {
  return value !== null && value !== undefined && value !== "";
}

/**
 * Format a date value with proper fallback
 * @param value - The date value (string, Date, or timestamp)
 * @param format - Date format pattern (default: "MMM DD, YYYY")
 * @returns Formatted date or "N/A"
 */
export function formatDateFallback(
  value: string | Date | number | null | undefined,
  format?: string
): string {
  if (!value) return "N/A";
  
  // This will require dayjs import in actual implementation
  // For now, returning a simple implementation
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  } catch {
    return "N/A";
  }
}

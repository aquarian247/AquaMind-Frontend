/**
 * Batch Management Helper Utilities
 * Pure functions for health status calculations and formatting
 */

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

/**
 * Calculate health status based on survival rate
 * @param survivalRate - Percentage survival rate (0-100)
 * @returns Health status classification
 */
export function getHealthStatus(survivalRate: number): HealthStatus {
  if (survivalRate >= 95) return 'excellent';
  if (survivalRate >= 90) return 'good';
  if (survivalRate >= 85) return 'fair';
  if (survivalRate >= 80) return 'poor';
  return 'critical';
}

/**
 * Get Tailwind CSS classes for health status display
 * @param status - Health status string
 * @returns Tailwind CSS class string for styling
 */
export function getHealthStatusColor(status: string): string {
  switch (status) {
    case "excellent":
      return "text-green-600 bg-green-50 border-green-200";
    case "good":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "fair":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "poor":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

/**
 * Calculate number of days since batch started
 * @param startDate - ISO date string of batch start
 * @returns Number of days since start (0 if invalid date)
 */
export function calculateDaysActive(startDate: string): number {
  try {
    const start = new Date(startDate);
    const now = new Date();
    
    // Validate date
    if (isNaN(start.getTime())) {
      return 0;
    }
    
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  } catch {
    return 0;
  }
}


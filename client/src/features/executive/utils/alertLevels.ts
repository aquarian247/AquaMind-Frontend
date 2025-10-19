/**
 * Alert Level Utilities
 * 
 * Determines color-coded alert levels based on thresholds and business rules.
 * These thresholds are based on industry standards and Bakkafrost operational targets.
 */

import type { AlertLevel } from '../types';

/**
 * Lice count thresholds (per fish)
 * Based on Norwegian regulations and best practices
 */
const LICE_THRESHOLDS = {
  mature: {
    success: 0.2,  // < 0.2: Excellent
    warning: 0.5,  // 0.2-0.5: Caution
    danger: 0.5,   // > 0.5: Critical (regulatory threshold)
  },
  movable: {
    success: 0.5,
    warning: 1.0,
    danger: 1.0,
  },
};

/**
 * Mortality percentage thresholds
 */
const MORTALITY_THRESHOLDS = {
  success: 1.0,  // < 1%: Normal
  warning: 2.0,  // 1-2%: Monitor
  danger: 2.0,   // > 2%: Critical
};

/**
 * FCR (Feed Conversion Ratio) thresholds
 * Lower is better
 */
const FCR_THRESHOLDS = {
  success: 1.15,  // < 1.15: Excellent
  warning: 1.25,  // 1.15-1.25: Acceptable
  danger: 1.25,   // > 1.25: Poor
};

/**
 * TGC (Thermal Growth Coefficient) thresholds
 * Higher is better
 */
const TGC_THRESHOLDS = {
  success: 3.0,  // > 3.0: Excellent
  warning: 2.5,  // 2.5-3.0: Acceptable
  danger: 2.5,   // < 2.5: Poor
};

/**
 * Capacity utilization thresholds (percentage)
 */
const CAPACITY_THRESHOLDS = {
  success: 85,   // > 85%: Optimal
  warning: 70,   // 70-85%: Acceptable
  danger: 70,    // < 70%: Underutilized
};

/**
 * Determine alert level for lice counts
 */
export function getLiceAlertLevel(
  matureLice: number | null,
  movableLice: number | null
): AlertLevel {
  if (matureLice === null && movableLice === null) {
    return 'info'; // No data
  }

  // Mature lice is the primary concern
  if (matureLice !== null) {
    if (matureLice > LICE_THRESHOLDS.mature.danger) {
      return 'danger';
    }
    if (matureLice >= LICE_THRESHOLDS.mature.success) {
      return 'warning';
    }
  }

  // Also check movable lice
  if (movableLice !== null) {
    if (movableLice > LICE_THRESHOLDS.movable.danger) {
      return 'danger';
    }
    if (movableLice >= LICE_THRESHOLDS.movable.success) {
      return 'warning';
    }
  }

  return 'success';
}

/**
 * Determine alert level for mortality percentage
 */
export function getMortalityAlertLevel(mortalityPercentage: number | null): AlertLevel {
  if (mortalityPercentage === null) {
    return 'info';
  }

  if (mortalityPercentage > MORTALITY_THRESHOLDS.danger) {
    return 'danger';
  }
  if (mortalityPercentage >= MORTALITY_THRESHOLDS.success) {
    return 'warning';
  }

  return 'success';
}

/**
 * Determine alert level for FCR (lower is better)
 */
export function getFCRAlertLevel(fcr: number | null): AlertLevel {
  if (fcr === null) {
    return 'info';
  }

  if (fcr > FCR_THRESHOLDS.danger) {
    return 'danger';
  }
  if (fcr >= FCR_THRESHOLDS.success) {
    return 'warning';
  }

  return 'success';
}

/**
 * Determine alert level for TGC (higher is better)
 */
export function getTGCAlertLevel(tgc: number | null): AlertLevel {
  if (tgc === null) {
    return 'info';
  }

  if (tgc < TGC_THRESHOLDS.danger) {
    return 'danger';
  }
  if (tgc <= TGC_THRESHOLDS.success) {
    return 'warning';
  }

  return 'success';
}

/**
 * Determine alert level for capacity utilization
 */
export function getCapacityAlertLevel(utilizationPercentage: number | null): AlertLevel {
  if (utilizationPercentage === null) {
    return 'info';
  }

  if (utilizationPercentage < CAPACITY_THRESHOLDS.danger) {
    return 'warning'; // Underutilized
  }
  if (utilizationPercentage < CAPACITY_THRESHOLDS.success) {
    return 'info'; // Moderate
  }

  return 'success'; // Optimal
}

/**
 * Determine overall facility health based on multiple metrics
 */
export function getFacilityHealthStatus(params: {
  matureLice: number | null;
  movableLice: number | null;
  mortalityPercentage: number | null;
  fcr: number | null;
}): AlertLevel {
  const { matureLice, movableLice, mortalityPercentage, fcr } = params;

  // Priority: Lice > Mortality > FCR
  const liceLevel = getLiceAlertLevel(matureLice, movableLice);
  if (liceLevel === 'danger') {
    return 'danger';
  }

  const mortalityLevel = getMortalityAlertLevel(mortalityPercentage);
  if (mortalityLevel === 'danger') {
    return 'danger';
  }

  const fcrLevel = getFCRAlertLevel(fcr);
  if (fcrLevel === 'danger' || liceLevel === 'warning' || mortalityLevel === 'warning') {
    return 'warning';
  }

  if (liceLevel === 'info' && mortalityLevel === 'info' && fcrLevel === 'info') {
    return 'info'; // No data
  }

  return 'success';
}

/**
 * Get CSS class for alert level (Tailwind classes)
 */
export function getAlertLevelClass(level: AlertLevel): string {
  const classMap: Record<AlertLevel, string> = {
    success: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    danger: 'text-red-600 bg-red-50 border-red-200',
    info: 'text-gray-600 bg-gray-50 border-gray-200',
  };

  return classMap[level];
}

/**
 * Get badge variant for alert level (Shadcn/ui Badge component)
 */
export function getAlertLevelBadgeVariant(level: AlertLevel): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variantMap: Record<AlertLevel, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    success: 'default',
    warning: 'secondary',
    danger: 'destructive',
    info: 'outline',
  };

  return variantMap[level];
}

/**
 * Get human-readable label for alert level
 */
export function getAlertLevelLabel(level: AlertLevel): string {
  const labelMap: Record<AlertLevel, string> = {
    success: 'Good',
    warning: 'Caution',
    danger: 'Critical',
    info: 'N/A',
  };

  return labelMap[level];
}


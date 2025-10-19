/**
 * KPI Calculation Utilities
 * 
 * Pure functions for calculating executive-level KPIs and trends.
 * Extracted business logic from prototype for reuse across components.
 */

import type { TrendDirection, KPIData } from '../types';

/**
 * Calculate trend direction and percentage change
 */
export function calculateTrend(
  currentValue: number | null,
  previousValue: number | null
): { direction: TrendDirection; percentage: number } | null {
  if (currentValue === null || previousValue === null || previousValue === 0) {
    return null;
  }

  const change = currentValue - previousValue;
  const percentage = (change / Math.abs(previousValue)) * 100;

  let direction: TrendDirection;
  if (Math.abs(percentage) < 1) {
    direction = 'stable';
  } else if (change > 0) {
    direction = 'up';
  } else {
    direction = 'down';
  }

  return {
    direction,
    percentage: Math.abs(percentage),
  };
}

/**
 * Calculate average weight in grams from total biomass and population
 */
export function calculateAverageWeight(
  totalBiomassKg: number | null,
  totalPopulation: number | null
): number | null {
  if (
    totalBiomassKg === null ||
    totalPopulation === null ||
    totalPopulation === 0
  ) {
    return null;
  }

  return (totalBiomassKg * 1000) / totalPopulation; // Convert kg to grams
}

/**
 * Calculate mortality percentage
 */
export function calculateMortalityPercentage(
  mortalityCount: number | null,
  totalPopulation: number | null,
  previousPopulation: number | null
): number | null {
  if (mortalityCount === null || totalPopulation === null) {
    return null;
  }

  // Use previous population if available for more accurate percentage
  const basePopulation = previousPopulation || totalPopulation;
  if (basePopulation === 0) {
    return null;
  }

  return (mortalityCount / basePopulation) * 100;
}

/**
 * Calculate capacity utilization percentage
 */
export function calculateCapacityUtilization(
  usedCapacity: number | null,
  totalCapacity: number | null
): number | null {
  if (
    usedCapacity === null ||
    totalCapacity === null ||
    totalCapacity === 0
  ) {
    return null;
  }

  return (usedCapacity / totalCapacity) * 100;
}

/**
 * Calculate FCR (Feed Conversion Ratio)
 * FCR = Total Feed / Total Biomass Gain
 */
export function calculateFCR(
  totalFeedKg: number | null,
  biomassGainKg: number | null
): number | null {
  if (
    totalFeedKg === null ||
    biomassGainKg === null ||
    biomassGainKg === 0
  ) {
    return null;
  }

  return totalFeedKg / biomassGainKg;
}

/**
 * Calculate TGC (Thermal Growth Coefficient)
 * TGC = (W_final^(1/3) - W_initial^(1/3)) / (T * days) * 1000
 */
export function calculateTGC(
  finalWeightG: number | null,
  initialWeightG: number | null,
  temperatureCelsius: number | null,
  days: number | null
): number | null {
  if (
    finalWeightG === null ||
    initialWeightG === null ||
    temperatureCelsius === null ||
    days === null ||
    temperatureCelsius === 0 ||
    days === 0
  ) {
    return null;
  }

  const finalCubeRoot = Math.pow(finalWeightG, 1 / 3);
  const initialCubeRoot = Math.pow(initialWeightG, 1 / 3);

  return ((finalCubeRoot - initialCubeRoot) / (temperatureCelsius * days)) * 1000;
}

/**
 * Calculate SGR (Specific Growth Rate) percentage
 * SGR = (ln(W_final) - ln(W_initial)) / days * 100
 */
export function calculateSGR(
  finalWeightG: number | null,
  initialWeightG: number | null,
  days: number | null
): number | null {
  if (
    finalWeightG === null ||
    initialWeightG === null ||
    days === null ||
    finalWeightG <= 0 ||
    initialWeightG <= 0 ||
    days === 0
  ) {
    return null;
  }

  return ((Math.log(finalWeightG) - Math.log(initialWeightG)) / days) * 100;
}

/**
 * Calculate gross margin
 */
export function calculateGrossMargin(
  revenue: number | null,
  costs: number | null
): number | null {
  if (revenue === null || costs === null) {
    return null;
  }

  return revenue - costs;
}

/**
 * Calculate gross margin percentage
 */
export function calculateGrossMarginPercentage(
  revenue: number | null,
  costs: number | null
): number | null {
  if (revenue === null || costs === null || revenue === 0) {
    return null;
  }

  const margin = revenue - costs;
  return (margin / revenue) * 100;
}

/**
 * Calculate ROI (Return on Investment) percentage
 */
export function calculateROI(
  netProfit: number | null,
  investment: number | null
): number | null {
  if (netProfit === null || investment === null || investment === 0) {
    return null;
  }

  return (netProfit / investment) * 100;
}

/**
 * Aggregate multiple facility metrics into summary
 */
export function aggregateFacilityMetrics(facilities: Array<{
  biomass_kg: number | null;
  population: number | null;
  fcr: number | null;
  tgc: number | null;
  mortality_count: number | null;
  mature_lice: number | null;
  movable_lice: number | null;
}>): {
  total_biomass_kg: number;
  total_population: number;
  average_fcr: number | null;
  average_tgc: number | null;
  average_mature_lice: number | null;
  average_movable_lice: number | null;
} {
  let totalBiomass = 0;
  let totalPopulation = 0;
  let fcrSum = 0;
  let fcrCount = 0;
  let tgcSum = 0;
  let tgcCount = 0;
  let matureLiceSum = 0;
  let matureLiceCount = 0;
  let movableLiceSum = 0;
  let movableLiceCount = 0;

  for (const facility of facilities) {
    if (facility.biomass_kg !== null) {
      totalBiomass += facility.biomass_kg;
    }
    if (facility.population !== null) {
      totalPopulation += facility.population;
    }
    if (facility.fcr !== null) {
      fcrSum += facility.fcr;
      fcrCount++;
    }
    if (facility.tgc !== null) {
      tgcSum += facility.tgc;
      tgcCount++;
    }
    if (facility.mature_lice !== null) {
      matureLiceSum += facility.mature_lice;
      matureLiceCount++;
    }
    if (facility.movable_lice !== null) {
      movableLiceSum += facility.movable_lice;
      movableLiceCount++;
    }
  }

  return {
    total_biomass_kg: totalBiomass,
    total_population: totalPopulation,
    average_fcr: fcrCount > 0 ? fcrSum / fcrCount : null,
    average_tgc: tgcCount > 0 ? tgcSum / tgcCount : null,
    average_mature_lice: matureLiceCount > 0 ? matureLiceSum / matureLiceCount : null,
    average_movable_lice: movableLiceCount > 0 ? movableLiceSum / movableLiceCount : null,
  };
}

/**
 * Format KPI data for display component
 */
export function formatKPI(params: {
  title: string;
  value: number | null;
  unit: string;
  previousValue?: number | null;
  subtitle?: string;
  decimalPlaces?: number;
}): KPIData {
  const { title, value, unit, previousValue, subtitle, decimalPlaces = 1 } = params;

  let trend = null;
  if (previousValue !== undefined && value !== null && previousValue !== null) {
    const trendData = calculateTrend(value, previousValue);
    if (trendData) {
      trend = {
        ...trendData,
        period: 'vs last period',
      };
    }
  }

  return {
    title,
    value: value !== null ? Number(value.toFixed(decimalPlaces)) : null,
    unit,
    subtitle,
    trend: trend || undefined,
  };
}

/**
 * Calculate weighted average (useful for FCR across multiple batches)
 */
export function calculateWeightedAverage(
  items: Array<{ value: number; weight: number }>
): number | null {
  if (items.length === 0) {
    return null;
  }

  let totalValue = 0;
  let totalWeight = 0;

  for (const item of items) {
    totalValue += item.value * item.weight;
    totalWeight += item.weight;
  }

  return totalWeight > 0 ? totalValue / totalWeight : null;
}


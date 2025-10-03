/**
 * Analytics Calculations Utilities
 * 
 * Pure functions for batch analytics calculations.
 * Extracted from use-analytics-data.ts to reduce cyclomatic complexity.
 * 
 * @module analyticsCalculations
 */

import { differenceInDays, parseISO } from "date-fns";

/**
 * Growth metrics data point
 */
export interface GrowthMetrics {
  date: string;
  averageWeight: number;
  totalBiomass: number;
  populationCount: number;
  growthRate: number;
  condition: number;
}

/**
 * Batch assignment data
 */
export interface BatchAssignment {
  id?: number;
  population_count?: number;
  biomass_kg?: string | number;
}

/**
 * Feeding summary data
 */
export interface FeedingSummary {
  total_feed_kg?: string | number;
  total_feed_consumed_kg?: string | number;
  total_biomass_gain_kg?: string | number;
  fcr?: string | number;
}

/**
 * Performance metrics result
 */
export interface PerformanceMetrics {
  survivalRate: number;
  growthRate: number;
  feedConversionRatio: number;
  healthScore: number;
  productivity: number;
  efficiency: number;
}

/**
 * Calculate survival rate from population counts
 * 
 * @param latestPopulation - Current population count
 * @param earliestPopulation - Initial population count
 * @returns Survival rate as percentage (0-100), or 0 if invalid inputs
 * 
 * @example
 * calculateSurvivalRate(900, 1000) // => 90
 * calculateSurvivalRate(0, 1000) // => 0
 * calculateSurvivalRate(1000, 0) // => 0
 */
export function calculateSurvivalRate(
  latestPopulation: number,
  earliestPopulation: number
): number {
  if (!latestPopulation || latestPopulation <= 0) return 0;
  if (!earliestPopulation || earliestPopulation <= 0) return 0;
  
  return (latestPopulation / earliestPopulation) * 100;
}

/**
 * Calculate average growth rate from growth metrics
 * 
 * @param metrics - Array of growth metrics
 * @returns Average growth rate as percentage, or 0 if no metrics
 * 
 * @example
 * calculateAverageGrowthRate([{growthRate: 10}, {growthRate: 20}]) // => 15
 * calculateAverageGrowthRate([]) // => 0
 */
export function calculateAverageGrowthRate(
  metrics: Pick<GrowthMetrics, 'growthRate'>[]
): number {
  if (!metrics || metrics.length === 0) return 0;
  
  const sum = metrics.reduce((acc, metric) => acc + (metric.growthRate || 0), 0);
  return sum / metrics.length;
}

/**
 * Calculate Feed Conversion Ratio (FCR) from feeding data
 * 
 * FCR = Total Feed / Biomass Gain
 * Lower FCR is better (more efficient)
 * 
 * @param feedingSummaries - Array of feeding summaries
 * @param latestAssignment - Latest batch assignment (end state)
 * @param earliestAssignment - Earliest batch assignment (start state)
 * @returns FCR value, or 0 if insufficient data or zero biomass gain
 * 
 * @example
 * calculateFCR(
 *   [{total_feed_kg: "100"}], 
 *   {biomass_kg: "150"}, 
 *   {biomass_kg: "50"}
 * ) // => 1.0 (100kg feed / 100kg gain)
 */
export function calculateFCR(
  feedingSummaries: FeedingSummary[],
  latestAssignment: BatchAssignment | null | undefined,
  earliestAssignment: BatchAssignment | null | undefined
): number {
  if (!feedingSummaries || feedingSummaries.length === 0) return 0;
  if (!latestAssignment || !earliestAssignment) return 0;

  // Sum total feed
  const totalFeed = feedingSummaries.reduce((sum, summary) => {
    const feedAmount = summary.total_feed_kg 
      ? parseFloat(String(summary.total_feed_kg)) 
      : 0;
    return sum + feedAmount;
  }, 0);

  // Calculate biomass gain
  const latestBiomass = latestAssignment.biomass_kg 
    ? parseFloat(String(latestAssignment.biomass_kg)) 
    : 0;
  const earliestBiomass = earliestAssignment.biomass_kg 
    ? parseFloat(String(earliestAssignment.biomass_kg)) 
    : 0;
  const biomassGain = latestBiomass - earliestBiomass;

  // FCR is only valid if there's biomass gain
  if (biomassGain <= 0) return 0;

  return totalFeed / biomassGain;
}

/**
 * Calculate average condition factor from growth metrics
 * 
 * Condition factor (K-factor) measures fish health/body condition.
 * Typical range: 0.8-1.2, with 1.0 being ideal.
 * 
 * @param metrics - Array of growth metrics with condition values
 * @returns Average condition factor, or 1.0 if no metrics
 * 
 * @example
 * calculateAverageCondition([{condition: 1.1}, {condition: 0.9}]) // => 1.0
 * calculateAverageCondition([]) // => 1.0 (default)
 */
export function calculateAverageCondition(
  metrics: Pick<GrowthMetrics, 'condition'>[]
): number {
  if (!metrics || metrics.length === 0) return 1.0;
  
  const sum = metrics.reduce((acc, metric) => acc + (metric.condition || 1.0), 0);
  return sum / metrics.length;
}

/**
 * Calculate health score from survival rate and condition factor
 * 
 * Health score is a composite metric:
 * - 60% weighted by survival rate
 * - 40% weighted by condition factor (normalized to 0-100 scale)
 * Capped at 100 maximum.
 * 
 * @param survivalRate - Survival rate as percentage (0-100)
 * @param avgCondition - Average condition factor (typically 0.8-1.2)
 * @returns Health score (0-100)
 * 
 * @example
 * calculateHealthScore(95, 1.1) // => 94 (high health)
 * calculateHealthScore(80, 1.0) // => 56 (medium health)
 * calculateHealthScore(0, 0) // => 0 (no data)
 */
export function calculateHealthScore(
  survivalRate: number,
  avgCondition: number
): number {
  // Condition factor normalized to 0-100 scale (1.0 = 50 points, scales linearly)
  const conditionScore = avgCondition * 20;
  
  const score = (survivalRate * 0.6) + (conditionScore * 0.4);
  
  return Math.min(Math.round(score), 100);
}

/**
 * Calculate productivity (biomass gain per day)
 * 
 * Productivity measures how much biomass increases per day.
 * Result is multiplied by 100 for easier reading.
 * 
 * @param latestAssignment - Latest batch assignment (end state)
 * @param earliestAssignment - Earliest batch assignment (start state)
 * @param latestDate - Latest sample date (ISO string)
 * @param earliestDate - Earliest sample date (ISO string)
 * @returns Productivity value (biomass gain per day * 100), or 0 if insufficient data
 * 
 * @example
 * calculateProductivity(
 *   {biomass_kg: "150"}, 
 *   {biomass_kg: "50"}, 
 *   "2025-02-01", 
 *   "2025-01-01"
 * ) // => 322.58 (100kg gain / 31 days * 100)
 */
export function calculateProductivity(
  latestAssignment: BatchAssignment | null | undefined,
  earliestAssignment: BatchAssignment | null | undefined,
  latestDate: string | null | undefined,
  earliestDate: string | null | undefined
): number {
  if (!latestAssignment || !earliestAssignment) return 0;
  if (!latestDate || !earliestDate) return 0;

  try {
    const latestBiomass = parseFloat(String(latestAssignment.biomass_kg || 0));
    const earliestBiomass = parseFloat(String(earliestAssignment.biomass_kg || 0));
    const biomassGain = latestBiomass - earliestBiomass;

    const latestParsed = parseISO(latestDate);
    const earliestParsed = parseISO(earliestDate);
    
    // Check for invalid dates
    if (isNaN(latestParsed.getTime()) || isNaN(earliestParsed.getTime())) {
      return 0;
    }

    const daysDiff = differenceInDays(latestParsed, earliestParsed);
    const safeDays = Math.max(daysDiff, 1); // Avoid division by zero

    return (biomassGain / safeDays) * 100;
  } catch (error) {
    // Invalid date format
    return 0;
  }
}

/**
 * Calculate efficiency (growth rate per unit FCR)
 * 
 * Efficiency measures how much growth is achieved per unit of feed used.
 * Higher is better. If FCR is 0, returns raw growth rate.
 * 
 * @param avgGrowthRate - Average growth rate as percentage
 * @param fcr - Feed Conversion Ratio
 * @returns Efficiency value (growth rate / FCR * 10), or growth rate if FCR is 0
 * 
 * @example
 * calculateEfficiency(12, 1.2) // => 100 (12 / 1.2 * 10)
 * calculateEfficiency(12, 0) // => 12 (fallback to growth rate)
 * calculateEfficiency(0, 1.2) // => 0
 */
export function calculateEfficiency(
  avgGrowthRate: number,
  fcr: number
): number {
  if (fcr <= 0) return avgGrowthRate;
  
  return (avgGrowthRate / fcr) * 10;
}

/**
 * Calculate all performance metrics from available data
 * 
 * This is the main orchestrator function that calls all individual calculation functions.
 * 
 * @param options - Calculation inputs
 * @returns Complete performance metrics object, or null if insufficient data
 * 
 * @example
 * calculatePerformanceMetrics({
 *   growthMetrics: [...],
 *   batchAssignments: [...],
 *   feedingSummaries: [...],
 *   growthSamplesData: [...]
 * }) // => { survivalRate: 95, growthRate: 12, ... }
 */
export function calculatePerformanceMetrics({
  growthMetrics,
  batchAssignments,
  feedingSummaries,
  growthSamplesData
}: {
  growthMetrics: GrowthMetrics[];
  batchAssignments: BatchAssignment[];
  feedingSummaries: FeedingSummary[];
  growthSamplesData: { sample_date?: string; assignment?: number }[];
}): PerformanceMetrics | null {
  if (growthMetrics.length === 0) return null;

  // Get latest and earliest samples
  const latestSample = growthMetrics[growthMetrics.length - 1];
  const earliestSample = growthMetrics[0];

  // Find corresponding assignments
  const latestAssignment = latestSample 
    ? batchAssignments.find(a => 
        a.id === growthSamplesData.find(s => s.sample_date === latestSample.date)?.assignment
      ) 
    : null;
  const earliestAssignment = earliestSample 
    ? batchAssignments.find(a => 
        a.id === growthSamplesData.find(s => s.sample_date === earliestSample.date)?.assignment
      ) 
    : null;

  // Calculate individual metrics using pure functions
  const latestPopulation = latestAssignment?.population_count || 0;
  const earliestPopulation = earliestAssignment?.population_count || 0;
  const survivalRate = calculateSurvivalRate(latestPopulation, earliestPopulation);

  const avgGrowthRate = calculateAverageGrowthRate(growthMetrics);

  const feedConversionRatio = calculateFCR(
    feedingSummaries,
    latestAssignment,
    earliestAssignment
  );

  const avgCondition = calculateAverageCondition(growthMetrics);
  const healthScore = calculateHealthScore(survivalRate, avgCondition);

  const productivity = calculateProductivity(
    latestAssignment,
    earliestAssignment,
    latestSample?.date,
    earliestSample?.date
  );

  const efficiency = calculateEfficiency(avgGrowthRate, feedConversionRatio);

  return {
    survivalRate,
    growthRate: avgGrowthRate,
    feedConversionRatio,
    healthScore,
    productivity,
    efficiency
  };
}


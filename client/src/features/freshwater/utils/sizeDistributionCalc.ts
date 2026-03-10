import type { SizeClass } from '../types';

const SIZE_CLASSES: Array<{ label: string; min_g: number; max_g: number }> = [
  { label: '<0.1g', min_g: 0, max_g: 0.1 },
  { label: '0.1-5g', min_g: 0.1, max_g: 5 },
  { label: '5-70g', min_g: 5, max_g: 70 },
  { label: '70-180g', min_g: 70, max_g: 180 },
  { label: '180-350g', min_g: 180, max_g: 350 },
  { label: '>350g', min_g: 350, max_g: Infinity },
];

/**
 * Approximate the CDF of a standard normal distribution using
 * Abramowitz & Stegun formula 7.1.26 (max error ~1.5e-7).
 */
function normalCDF(x: number): number {
  if (x < -8) return 0;
  if (x > 8) return 1;

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Calculate the probability that a value falls between min and max
 * given a normal distribution with the specified mean and standard deviation.
 */
function normalProbability(mean: number, stdDev: number, min: number, max: number): number {
  if (stdDev <= 0) {
    return (mean >= min && mean < max) ? 1 : 0;
  }
  const cdfMax = max === Infinity ? 1 : normalCDF((max - mean) / stdDev);
  const cdfMin = min <= 0 ? 0 : normalCDF((min - mean) / stdDev);
  return Math.max(0, cdfMax - cdfMin);
}

/**
 * Calculate size distribution across the 6 standard freshwater weight classes
 * using a normal distribution model from growth sample statistics.
 */
export function calculateSizeDistribution(
  avgWeightG: number,
  stdDeviationG: number,
  totalCount: number | null
): SizeClass[] {
  return SIZE_CLASSES.map(({ label, min_g, max_g }) => {
    const percentage = normalProbability(avgWeightG, stdDeviationG, min_g, max_g) * 100;
    return {
      label,
      min_g,
      max_g,
      percentage: Math.round(percentage * 10) / 10,
      count: totalCount !== null ? Math.round(totalCount * percentage / 100) : null,
    };
  });
}

/**
 * Get the percentage of fish in the smolt transfer range (180-350g).
 */
export function getTransferRangePercentage(
  avgWeightG: number,
  stdDeviationG: number
): number {
  return normalProbability(avgWeightG, stdDeviationG, 180, 350) * 100;
}

export { SIZE_CLASSES };

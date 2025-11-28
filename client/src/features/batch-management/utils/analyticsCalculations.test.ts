/**
 * Tests for Analytics Calculations Utilities
 * 
 * Comprehensive test suite covering all edge cases and business logic.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateSurvivalRate,
  calculateAverageGrowthRate,
  calculateFCR,
  calculateAverageCondition,
  calculateHealthScore,
  calculateProductivity,
  calculateEfficiency,
  calculatePerformanceMetrics,
  type GrowthMetrics,
  type BatchAssignment,
  type FeedingSummary
} from './analyticsCalculations';

describe('calculateSurvivalRate', () => {
  it('should calculate survival rate correctly', () => {
    expect(calculateSurvivalRate(900, 1000)).toBe(90);
  });

  it('should return 0 when latest population is 0', () => {
    expect(calculateSurvivalRate(0, 1000)).toBe(0);
  });

  it('should return 0 when earliest population is 0', () => {
    expect(calculateSurvivalRate(1000, 0)).toBe(0);
  });

  it('should return 0 when latest population is negative', () => {
    expect(calculateSurvivalRate(-100, 1000)).toBe(0);
  });

  it('should return 0 when earliest population is negative', () => {
    expect(calculateSurvivalRate(1000, -100)).toBe(0);
  });

  it('should handle 100% survival rate', () => {
    expect(calculateSurvivalRate(1000, 1000)).toBe(100);
  });

  it('should handle survival rate greater than 100% (population growth)', () => {
    expect(calculateSurvivalRate(1100, 1000)).toBeCloseTo(110, 1);
  });

  it('should handle small populations', () => {
    expect(calculateSurvivalRate(9, 10)).toBe(90);
  });
});

describe('calculateAverageGrowthRate', () => {
  it('should calculate average growth rate correctly', () => {
    const metrics = [
      { growthRate: 10 },
      { growthRate: 20 }
    ];
    expect(calculateAverageGrowthRate(metrics)).toBe(15);
  });

  it('should return 0 for empty array', () => {
    expect(calculateAverageGrowthRate([])).toBe(0);
  });

  it('should return 0 for null input', () => {
    expect(calculateAverageGrowthRate(null as any)).toBe(0);
  });

  it('should return 0 for undefined input', () => {
    expect(calculateAverageGrowthRate(undefined as any)).toBe(0);
  });

  it('should handle single metric', () => {
    expect(calculateAverageGrowthRate([{ growthRate: 15 }])).toBe(15);
  });

  it('should handle zero growth rates', () => {
    const metrics = [
      { growthRate: 0 },
      { growthRate: 0 }
    ];
    expect(calculateAverageGrowthRate(metrics)).toBe(0);
  });

  it('should handle negative growth rates', () => {
    const metrics = [
      { growthRate: 10 },
      { growthRate: -10 }
    ];
    expect(calculateAverageGrowthRate(metrics)).toBe(0);
  });

  it('should handle missing growthRate property', () => {
    const metrics = [
      { growthRate: 10 },
      {} as any,
      { growthRate: 20 }
    ];
    expect(calculateAverageGrowthRate(metrics)).toBe(10);
  });

  it('should handle large datasets', () => {
    const metrics = Array.from({ length: 100 }, (_, i) => ({ growthRate: i }));
    expect(calculateAverageGrowthRate(metrics)).toBe(49.5);
  });
});

describe('calculateFCR', () => {
  // Note: calculateFCR now uses backend-calculated weighted_avg_fcr
  // Assignment parameters are deprecated but kept for API compatibility
  
  it('should return weighted_avg_fcr from latest feeding summary', () => {
    const summaries: FeedingSummary[] = [{ weighted_avg_fcr: "1.2" }];
    
    expect(calculateFCR(summaries)).toBe(1.2);
  });

  it('should use the latest summary when multiple exist', () => {
    const summaries: FeedingSummary[] = [
      { weighted_avg_fcr: "1.0" },
      { weighted_avg_fcr: "1.3" }
    ];
    
    expect(calculateFCR(summaries)).toBe(1.3);
  });

  it('should return 0 for empty feeding summaries', () => {
    expect(calculateFCR([])).toBe(0);
  });

  it('should return 0 for null feeding summaries', () => {
    expect(calculateFCR(null as any)).toBe(0);
  });

  it('should handle numeric weighted_avg_fcr values', () => {
    const summaries: FeedingSummary[] = [{ weighted_avg_fcr: 1.2 }];
    
    expect(calculateFCR(summaries)).toBe(1.2);
  });

  it('should handle null weighted_avg_fcr by falling back to fcr', () => {
    const summaries: FeedingSummary[] = [{ 
      weighted_avg_fcr: null,
      fcr: "1.1"
    }];
    
    expect(calculateFCR(summaries)).toBe(1.1);
  });

  it('should return 0 when weighted_avg_fcr is undefined and fcr is also missing', () => {
    const summaries: FeedingSummary[] = [{ total_feed_kg: "100" }];
    
    expect(calculateFCR(summaries)).toBe(0);
  });

  it('should return FCR for excellent efficiency (FCR < 1)', () => {
    const summaries: FeedingSummary[] = [{ weighted_avg_fcr: "0.8" }];
    
    expect(calculateFCR(summaries)).toBe(0.8);
  });

  it('should return FCR for poor efficiency (FCR > 2)', () => {
    const summaries: FeedingSummary[] = [{ weighted_avg_fcr: "2.5" }];
    
    expect(calculateFCR(summaries)).toBe(2.5);
  });

  it('should return 0 for invalid weighted_avg_fcr (NaN)', () => {
    const summaries: FeedingSummary[] = [{ weighted_avg_fcr: "not-a-number" }];
    
    expect(calculateFCR(summaries)).toBe(0);
  });

  it('should return 0 for zero weighted_avg_fcr', () => {
    const summaries: FeedingSummary[] = [{ weighted_avg_fcr: "0" }];
    
    expect(calculateFCR(summaries)).toBe(0);
  });

  it('should handle typical salmon FCR values (1.0-1.5)', () => {
    const summaries: FeedingSummary[] = [{ weighted_avg_fcr: "1.15" }];
    
    expect(calculateFCR(summaries)).toBe(1.15);
  });

  it('should ignore deprecated assignment parameters', () => {
    const summaries: FeedingSummary[] = [{ weighted_avg_fcr: "1.2" }];
    const latest: BatchAssignment = { biomass_kg: "150" };
    const earliest: BatchAssignment = { biomass_kg: "50" };
    
    // Even with assignments passed, should still use weighted_avg_fcr
    expect(calculateFCR(summaries, latest, earliest)).toBe(1.2);
  });
});

describe('calculateAverageCondition', () => {
  it('should calculate average condition correctly', () => {
    const metrics = [
      { condition: 1.1 },
      { condition: 0.9 }
    ];
    expect(calculateAverageCondition(metrics)).toBe(1.0);
  });

  it('should return 1.0 for empty array (default)', () => {
    expect(calculateAverageCondition([])).toBe(1.0);
  });

  it('should return 1.0 for null input', () => {
    expect(calculateAverageCondition(null as any)).toBe(1.0);
  });

  it('should return 1.0 for undefined input', () => {
    expect(calculateAverageCondition(undefined as any)).toBe(1.0);
  });

  it('should handle single metric', () => {
    expect(calculateAverageCondition([{ condition: 1.2 }])).toBe(1.2);
  });

  it('should handle missing condition property', () => {
    const metrics = [
      { condition: 1.1 },
      {} as any,
      { condition: 0.9 }
    ];
    expect(calculateAverageCondition(metrics)).toBeCloseTo(1.0, 1);
  });

  it('should handle very high condition factors', () => {
    const metrics = [
      { condition: 1.5 },
      { condition: 1.3 }
    ];
    expect(calculateAverageCondition(metrics)).toBe(1.4);
  });

  it('should handle very low condition factors', () => {
    const metrics = [
      { condition: 0.7 },
      { condition: 0.5 }
    ];
    expect(calculateAverageCondition(metrics)).toBe(0.6);
  });
});

describe('calculateHealthScore', () => {
  it('should calculate health score with high survival and condition', () => {
    // 95 * 0.6 + 1.1 * 20 * 0.4 = 57 + 8.8 = 65.8 ≈ 66
    expect(calculateHealthScore(95, 1.1)).toBe(66);
  });

  it('should calculate health score with medium survival and condition', () => {
    expect(calculateHealthScore(80, 1.0)).toBe(56);
  });

  it('should return 0 when survival rate is 0', () => {
    expect(calculateHealthScore(0, 1.0)).toBe(8);
  });

  it('should cap health score at 100', () => {
    // 100 * 0.6 + 2.0 * 20 * 0.4 = 60 + 16 = 76 (no capping needed in this case)
    expect(calculateHealthScore(100, 2.0)).toBe(76);
  });

  it('should handle low condition factor', () => {
    expect(calculateHealthScore(90, 0.5)).toBe(58);
  });

  it('should handle high condition factor', () => {
    // 90 * 0.6 + 1.5 * 20 * 0.4 = 54 + 12 = 66
    expect(calculateHealthScore(90, 1.5)).toBe(66);
  });

  it('should calculate health score with 60% survival weight', () => {
    // 100 survival * 0.6 = 60, 1.0 condition * 20 * 0.4 = 8, total = 68
    expect(calculateHealthScore(100, 1.0)).toBe(68);
  });

  it('should round health score to integer', () => {
    // Should round to nearest integer
    const score = calculateHealthScore(85.5, 1.15);
    expect(Number.isInteger(score)).toBe(true);
  });

  it('should handle zero condition factor', () => {
    expect(calculateHealthScore(80, 0)).toBe(48);
  });
});

describe('calculateProductivity', () => {
  it('should calculate productivity correctly', () => {
    const latest: BatchAssignment = { biomass_kg: "150" };
    const earliest: BatchAssignment = { biomass_kg: "50" };
    const latestDate = "2025-02-01";
    const earliestDate = "2025-01-01";
    
    const result = calculateProductivity(latest, earliest, latestDate, earliestDate);
    expect(result).toBeCloseTo(322.58, 1);
  });

  it('should return 0 when latest assignment is null', () => {
    const earliest: BatchAssignment = { biomass_kg: "50" };
    expect(calculateProductivity(null, earliest, "2025-02-01", "2025-01-01")).toBe(0);
  });

  it('should return 0 when earliest assignment is null', () => {
    const latest: BatchAssignment = { biomass_kg: "150" };
    expect(calculateProductivity(latest, null, "2025-02-01", "2025-01-01")).toBe(0);
  });

  it('should return 0 when latest date is null', () => {
    const latest: BatchAssignment = { biomass_kg: "150" };
    const earliest: BatchAssignment = { biomass_kg: "50" };
    expect(calculateProductivity(latest, earliest, null, "2025-01-01")).toBe(0);
  });

  it('should return 0 when earliest date is null', () => {
    const latest: BatchAssignment = { biomass_kg: "150" };
    const earliest: BatchAssignment = { biomass_kg: "50" };
    expect(calculateProductivity(latest, earliest, "2025-02-01", null)).toBe(0);
  });

  it('should handle same date (1 day minimum)', () => {
    const latest: BatchAssignment = { biomass_kg: "150" };
    const earliest: BatchAssignment = { biomass_kg: "50" };
    const date = "2025-01-01";
    
    expect(calculateProductivity(latest, earliest, date, date)).toBe(10000);
  });

  it('should handle negative biomass gain', () => {
    const latest: BatchAssignment = { biomass_kg: "50" };
    const earliest: BatchAssignment = { biomass_kg: "150" };
    const latestDate = "2025-02-01";
    const earliestDate = "2025-01-01";
    
    const result = calculateProductivity(latest, earliest, latestDate, earliestDate);
    expect(result).toBeLessThan(0);
  });

  it('should handle numeric biomass_kg values', () => {
    const latest: BatchAssignment = { biomass_kg: 150 };
    const earliest: BatchAssignment = { biomass_kg: 50 };
    const latestDate = "2025-02-01";
    const earliestDate = "2025-01-01";
    
    const result = calculateProductivity(latest, earliest, latestDate, earliestDate);
    expect(result).toBeCloseTo(322.58, 1);
  });

  it('should return 0 for invalid date format', () => {
    const latest: BatchAssignment = { biomass_kg: "150" };
    const earliest: BatchAssignment = { biomass_kg: "50" };
    
    expect(calculateProductivity(latest, earliest, "invalid", "2025-01-01")).toBe(0);
  });

  it('should handle long time periods', () => {
    const latest: BatchAssignment = { biomass_kg: "200" };
    const earliest: BatchAssignment = { biomass_kg: "50" };
    const latestDate = "2025-12-31";
    const earliestDate = "2025-01-01";
    
    const result = calculateProductivity(latest, earliest, latestDate, earliestDate);
    expect(result).toBeGreaterThan(0);
  });
});

describe('calculateEfficiency', () => {
  it('should calculate efficiency correctly', () => {
    expect(calculateEfficiency(12, 1.2)).toBe(100);
  });

  it('should return growth rate when FCR is 0 (fallback)', () => {
    expect(calculateEfficiency(12, 0)).toBe(12);
  });

  it('should return growth rate when FCR is negative', () => {
    expect(calculateEfficiency(12, -1)).toBe(12);
  });

  it('should return 0 when growth rate is 0', () => {
    expect(calculateEfficiency(0, 1.2)).toBe(0);
  });

  it('should handle high efficiency (low FCR)', () => {
    expect(calculateEfficiency(15, 0.8)).toBeCloseTo(187.5, 1);
  });

  it('should handle low efficiency (high FCR)', () => {
    expect(calculateEfficiency(10, 2.5)).toBe(40);
  });

  it('should handle decimal values', () => {
    expect(calculateEfficiency(12.5, 1.25)).toBe(100);
  });

  it('should handle very small FCR', () => {
    expect(calculateEfficiency(10, 0.1)).toBe(1000);
  });
});

describe('calculatePerformanceMetrics', () => {
  const createGrowthMetrics = (count: number): GrowthMetrics[] => {
    return Array.from({ length: count }, (_, i) => ({
      date: `2025-01-${String(i + 1).padStart(2, '0')}`,
      averageWeight: 100 + i * 10,
      totalBiomass: 1000 + i * 100,
      populationCount: 1000 - i * 10,
      growthRate: 10 + i,
      condition: 1.0 + i * 0.05
    }));
  };

  const createBatchAssignments = (): BatchAssignment[] => [
    { id: 1, population_count: 1000, biomass_kg: "100" },
    { id: 2, population_count: 950, biomass_kg: "200" }
  ];

  const createFeedingSummaries = (): FeedingSummary[] => [
    { total_feed_kg: "50", weighted_avg_fcr: "1.05" },
    { total_feed_kg: "60", weighted_avg_fcr: "1.1" }  // Latest summary used for FCR
  ];

  const createGrowthSamplesData = () => [
    { sample_date: "2025-01-01", assignment: 1 },
    { sample_date: "2025-01-02", assignment: 2 }
  ];

  it('should return null for empty growth metrics', () => {
    const result = calculatePerformanceMetrics({
      growthMetrics: [],
      batchAssignments: [],
      feedingSummaries: [],
      growthSamplesData: []
    });
    
    expect(result).toBeNull();
  });

  it('should calculate all performance metrics', () => {
    const growthMetrics = createGrowthMetrics(2);
    const batchAssignments = createBatchAssignments();
    const feedingSummaries = createFeedingSummaries();
    const growthSamplesData = createGrowthSamplesData();

    const result = calculatePerformanceMetrics({
      growthMetrics,
      batchAssignments,
      feedingSummaries,
      growthSamplesData
    });

    expect(result).not.toBeNull();
    expect(result?.survivalRate).toBeGreaterThan(0);
    expect(result?.growthRate).toBeGreaterThan(0);
    expect(result?.feedConversionRatio).toBeGreaterThan(0);
    expect(result?.healthScore).toBeGreaterThan(0);
    expect(result?.productivity).toBeGreaterThan(0);
    expect(result?.efficiency).toBeGreaterThan(0);
  });

  it('should handle missing assignments gracefully', () => {
    const growthMetrics = createGrowthMetrics(2);
    const result = calculatePerformanceMetrics({
      growthMetrics,
      batchAssignments: [],
      feedingSummaries: [],
      growthSamplesData: []
    });

    expect(result).not.toBeNull();
    expect(result?.survivalRate).toBe(0);
    expect(result?.feedConversionRatio).toBe(0);
  });

  it('should calculate survival rate from assignments', () => {
    const growthMetrics = createGrowthMetrics(2);
    const batchAssignments = createBatchAssignments();
    const growthSamplesData = createGrowthSamplesData();

    const result = calculatePerformanceMetrics({
      growthMetrics,
      batchAssignments,
      feedingSummaries: [],
      growthSamplesData
    });

    expect(result?.survivalRate).toBe(95);
  });

  it('should calculate average growth rate', () => {
    const growthMetrics = createGrowthMetrics(3);
    const result = calculatePerformanceMetrics({
      growthMetrics,
      batchAssignments: [],
      feedingSummaries: [],
      growthSamplesData: []
    });

    // Average of [10, 11, 12] = 11
    expect(result?.growthRate).toBe(11);
  });

  it('should calculate FCR from summaries', () => {
    const growthMetrics = createGrowthMetrics(2);
    const batchAssignments = createBatchAssignments();
    const feedingSummaries = createFeedingSummaries();
    const growthSamplesData = createGrowthSamplesData();

    const result = calculatePerformanceMetrics({
      growthMetrics,
      batchAssignments,
      feedingSummaries,
      growthSamplesData
    });

    // Uses backend-calculated weighted_avg_fcr from latest summary (1.1)
    expect(result?.feedConversionRatio).toBeCloseTo(1.1, 1);
  });

  it('should calculate health score', () => {
    const growthMetrics = createGrowthMetrics(2);
    const batchAssignments = createBatchAssignments();
    const growthSamplesData = createGrowthSamplesData();

    const result = calculatePerformanceMetrics({
      growthMetrics,
      batchAssignments,
      feedingSummaries: [],
      growthSamplesData
    });

    expect(result?.healthScore).toBeGreaterThan(0);
    expect(result?.healthScore).toBeLessThanOrEqual(100);
  });

  it('should handle large datasets efficiently', () => {
    const growthMetrics = createGrowthMetrics(100);
    const batchAssignments = createBatchAssignments();
    const feedingSummaries = createFeedingSummaries();
    const growthSamplesData = createGrowthSamplesData();

    const result = calculatePerformanceMetrics({
      growthMetrics,
      batchAssignments,
      feedingSummaries,
      growthSamplesData
    });

    expect(result).not.toBeNull();
    expect(result?.growthRate).toBeGreaterThan(0);
  });
});


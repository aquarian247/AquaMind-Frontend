/**
 * KPI Calculation Utilities - Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTrend,
  calculateAverageWeight,
  calculateMortalityPercentage,
  calculateCapacityUtilization,
  calculateFCR,
  calculateTGC,
  calculateSGR,
  calculateGrossMargin,
  calculateGrossMarginPercentage,
  calculateROI,
  aggregateFacilityMetrics,
  formatKPI,
  calculateWeightedAverage,
} from './kpiCalculations';

describe('calculateTrend', () => {
  it('should calculate upward trend', () => {
    const result = calculateTrend(150, 100);
    expect(result).toEqual({ direction: 'up', percentage: 50 });
  });

  it('should calculate downward trend', () => {
    const result = calculateTrend(80, 100);
    expect(result).toEqual({ direction: 'down', percentage: 20 });
  });

  it('should detect stable trend for small changes', () => {
    const result = calculateTrend(100.5, 100);
    expect(result).toEqual({ direction: 'stable', percentage: 0.5 });
  });

  it('should return null when values are missing', () => {
    expect(calculateTrend(null, 100)).toBeNull();
    expect(calculateTrend(100, null)).toBeNull();
    expect(calculateTrend(100, 0)).toBeNull();
  });
});

describe('calculateAverageWeight', () => {
  it('should calculate average weight correctly', () => {
    // 1000 kg = 1,000,000 g / 10,000 fish = 100 g/fish
    const result = calculateAverageWeight(1000, 10000);
    expect(result).toBe(100);
  });

  it('should return null when data is missing', () => {
    expect(calculateAverageWeight(null, 10000)).toBeNull();
    expect(calculateAverageWeight(1000, null)).toBeNull();
    expect(calculateAverageWeight(1000, 0)).toBeNull();
  });
});

describe('calculateMortalityPercentage', () => {
  it('should calculate mortality percentage', () => {
    const result = calculateMortalityPercentage(50, 10000, null);
    expect(result).toBe(0.5);
  });

  it('should use previous population if provided', () => {
    const result = calculateMortalityPercentage(100, 9900, 10000);
    expect(result).toBe(1.0);
  });

  it('should return null when data is missing', () => {
    expect(calculateMortalityPercentage(null, 10000, null)).toBeNull();
    expect(calculateMortalityPercentage(50, null, null)).toBeNull();
  });
});

describe('calculateCapacityUtilization', () => {
  it('should calculate capacity utilization', () => {
    const result = calculateCapacityUtilization(85, 100);
    expect(result).toBe(85);
  });

  it('should return null when data is missing', () => {
    expect(calculateCapacityUtilization(null, 100)).toBeNull();
    expect(calculateCapacityUtilization(85, null)).toBeNull();
    expect(calculateCapacityUtilization(85, 0)).toBeNull();
  });
});

describe('calculateFCR', () => {
  it('should calculate FCR correctly', () => {
    // 1000 kg feed / 900 kg gain = 1.11 FCR
    const result = calculateFCR(1000, 900);
    expect(result).toBeCloseTo(1.11, 2);
  });

  it('should return null when data is missing', () => {
    expect(calculateFCR(null, 900)).toBeNull();
    expect(calculateFCR(1000, null)).toBeNull();
    expect(calculateFCR(1000, 0)).toBeNull();
  });
});

describe('calculateTGC', () => {
  it('should calculate TGC correctly', () => {
    // Example: 500g final, 50g initial, 10°C, 100 days
    const result = calculateTGC(500, 50, 10, 100);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should return null when data is missing', () => {
    expect(calculateTGC(null, 50, 10, 100)).toBeNull();
    expect(calculateTGC(500, null, 10, 100)).toBeNull();
    expect(calculateTGC(500, 50, null, 100)).toBeNull();
    expect(calculateTGC(500, 50, 10, null)).toBeNull();
  });

  it('should return null when temperature or days is zero', () => {
    expect(calculateTGC(500, 50, 0, 100)).toBeNull();
    expect(calculateTGC(500, 50, 10, 0)).toBeNull();
  });
});

describe('calculateSGR', () => {
  it('should calculate SGR correctly', () => {
    // Example: 500g final, 50g initial, 100 days
    const result = calculateSGR(500, 50, 100);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should return null when data is missing', () => {
    expect(calculateSGR(null, 50, 100)).toBeNull();
    expect(calculateSGR(500, null, 100)).toBeNull();
    expect(calculateSGR(500, 50, null)).toBeNull();
  });

  it('should return null for invalid inputs', () => {
    expect(calculateSGR(0, 50, 100)).toBeNull();
    expect(calculateSGR(500, 0, 100)).toBeNull();
    expect(calculateSGR(500, 50, 0)).toBeNull();
  });
});

describe('calculateGrossMargin', () => {
  it('should calculate gross margin', () => {
    const result = calculateGrossMargin(10000, 6000);
    expect(result).toBe(4000);
  });

  it('should return null when data is missing', () => {
    expect(calculateGrossMargin(null, 6000)).toBeNull();
    expect(calculateGrossMargin(10000, null)).toBeNull();
  });
});

describe('calculateGrossMarginPercentage', () => {
  it('should calculate gross margin percentage', () => {
    const result = calculateGrossMarginPercentage(10000, 6000);
    expect(result).toBe(40);
  });

  it('should return null when data is missing', () => {
    expect(calculateGrossMarginPercentage(null, 6000)).toBeNull();
    expect(calculateGrossMarginPercentage(10000, null)).toBeNull();
  });

  it('should return null when revenue is zero', () => {
    expect(calculateGrossMarginPercentage(0, 6000)).toBeNull();
  });
});

describe('calculateROI', () => {
  it('should calculate ROI percentage', () => {
    const result = calculateROI(5000, 10000);
    expect(result).toBe(50);
  });

  it('should return null when data is missing', () => {
    expect(calculateROI(null, 10000)).toBeNull();
    expect(calculateROI(5000, null)).toBeNull();
  });

  it('should return null when investment is zero', () => {
    expect(calculateROI(5000, 0)).toBeNull();
  });
});

describe('aggregateFacilityMetrics', () => {
  it('should aggregate metrics across facilities', () => {
    const facilities = [
      {
        biomass_kg: 1000,
        population: 10000,
        fcr: 1.1,
        tgc: 3.0,
        mortality_count: 50,
        mature_lice: 0.2,
        movable_lice: 0.4,
      },
      {
        biomass_kg: 1500,
        population: 15000,
        fcr: 1.2,
        tgc: 2.8,
        mortality_count: 80,
        mature_lice: 0.3,
        movable_lice: 0.5,
      },
    ];

    const result = aggregateFacilityMetrics(facilities);

    expect(result.total_biomass_kg).toBe(2500);
    expect(result.total_population).toBe(25000);
    expect(result.average_fcr).toBe(1.15);
    expect(result.average_tgc).toBe(2.9);
    expect(result.average_mature_lice).toBe(0.25);
    expect(result.average_movable_lice).toBe(0.45);
  });

  it('should handle null values correctly', () => {
    const facilities = [
      {
        biomass_kg: 1000,
        population: null,
        fcr: null,
        tgc: 3.0,
        mortality_count: null,
        mature_lice: 0.2,
        movable_lice: null,
      },
    ];

    const result = aggregateFacilityMetrics(facilities);

    expect(result.total_biomass_kg).toBe(1000);
    expect(result.total_population).toBe(0);
    expect(result.average_fcr).toBeNull();
    expect(result.average_tgc).toBe(3.0);
    expect(result.average_mature_lice).toBe(0.2);
    expect(result.average_movable_lice).toBeNull();
  });
});

describe('formatKPI', () => {
  it('should format KPI without trend', () => {
    const result = formatKPI({
      title: 'Total Biomass',
      value: 12345.6789,
      unit: 'kg',
    });

    expect(result.title).toBe('Total Biomass');
    expect(result.value).toBe(12345.7);
    expect(result.unit).toBe('kg');
    expect(result.trend).toBeUndefined();
  });

  it('should format KPI with trend', () => {
    const result = formatKPI({
      title: 'Average Weight',
      value: 550,
      unit: 'g',
      previousValue: 500,
    });

    expect(result.title).toBe('Average Weight');
    expect(result.value).toBe(550.0);
    expect(result.trend).toBeDefined();
    expect(result.trend?.direction).toBe('up');
    expect(result.trend?.percentage).toBe(10);
  });

  it('should handle null values', () => {
    const result = formatKPI({
      title: 'Missing Data',
      value: null,
      unit: 'kg',
    });

    expect(result.value).toBeNull();
  });

  it('should respect decimal places', () => {
    const result = formatKPI({
      title: 'FCR',
      value: 1.12345,
      unit: '',
      decimalPlaces: 2,
    });

    expect(result.value).toBe(1.12);
  });
});

describe('calculateWeightedAverage', () => {
  it('should calculate weighted average', () => {
    const items = [
      { value: 1.1, weight: 1000 },
      { value: 1.2, weight: 1500 },
      { value: 1.3, weight: 500 },
    ];

    const result = calculateWeightedAverage(items);
    // (1.1*1000 + 1.2*1500 + 1.3*500) / (1000+1500+500) = 3550/3000 = 1.183...
    expect(result).toBeCloseTo(1.183, 2);
  });

  it('should return null for empty array', () => {
    expect(calculateWeightedAverage([])).toBeNull();
  });

  it('should return null when total weight is zero', () => {
    const items = [
      { value: 1.1, weight: 0 },
      { value: 1.2, weight: 0 },
    ];
    expect(calculateWeightedAverage(items)).toBeNull();
  });
});


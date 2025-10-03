/**
 * Tests for Area Detail Formatters
 * 
 * Comprehensive unit tests for area formatting utilities.
 * Validates server-first data handling with honest fallbacks.
 */

import { describe, it, expect } from 'vitest';
import {
  formatAreaKPIs,
  formatContainerData,
  calculateAreaUtilization,
  calculateAverageRingDepth,
  countActiveRings,
  type FormattedAreaKPIs,
  type FormattedContainerData,
} from './areaFormatters';
import type { AreaSummary } from '@/features/infrastructure/api';

describe('formatAreaKPIs', () => {
  describe('with complete server data', () => {
    it('formats all KPIs correctly with realistic values', () => {
      const summary: AreaSummary = {
        active_biomass_kg: 45230, // 45.23 tonnes
        avg_weight_kg: 3.75,
        container_count: 12,
        population_count: 12061,
        ring_count: 12,
      };

      const result = formatAreaKPIs(summary);

      expect(result.totalBiomass).toBe('45.2 t');
      expect(result.totalBiomassTooltip).toBe('Current active biomass (from server)');
      expect(result.averageWeight).toBe('3.75 kg');
      expect(result.averageWeightTooltip).toBe('kg per fish');
      expect(result.containerCount).toBe('12 containers');
      expect(result.containerCountTooltip).toBe('Total containers');
      expect(result.populationCount).toBe('12,061 fish');
      expect(result.populationCountTooltip).toBe('Total fish');
      expect(result.ringCount).toBe('12 rings');
      expect(result.ringCountTooltip).toBe('Production units (from server)');
    });

    it('formats large values with correct separators', () => {
      const summary: AreaSummary = {
        active_biomass_kg: 1234567, // 1234.567 tonnes
        avg_weight_kg: 5.123,
        container_count: 50,
        population_count: 987654,
        ring_count: 48,
      };

      const result = formatAreaKPIs(summary);

      expect(result.totalBiomass).toBe('1,234.6 t');
      expect(result.averageWeight).toBe('5.12 kg');
      expect(result.containerCount).toBe('50 containers');
      expect(result.populationCount).toBe('987,654 fish');
      expect(result.ringCount).toBe('48 rings');
    });

    it('handles zero values correctly (not null)', () => {
      const summary: AreaSummary = {
        active_biomass_kg: 0,
        avg_weight_kg: 0,
        container_count: 0,
        population_count: 0,
        ring_count: 0,
      };

      const result = formatAreaKPIs(summary);

      expect(result.totalBiomass).toBe('0.0 t'); // Consistent 1 decimal
      expect(result.averageWeight).toBe('0.00 kg'); // Consistent 2 decimals
      expect(result.containerCount).toBe('0 containers');
      expect(result.populationCount).toBe('0 fish');
      expect(result.ringCount).toBe('0 rings');
    });

    it('handles decimal precision correctly for biomass', () => {
      const summary: AreaSummary = {
        active_biomass_kg: 12345.67, // 12.34567 tonnes
        avg_weight_kg: 2.5,
        container_count: 5,
        population_count: 4938,
        ring_count: 5,
      };

      const result = formatAreaKPIs(summary);

      // Should round to 1 decimal place
      expect(result.totalBiomass).toBe('12.3 t');
    });

    it('handles decimal precision correctly for average weight', () => {
      const summary: AreaSummary = {
        active_biomass_kg: 10000,
        avg_weight_kg: 3.456789,
        container_count: 5,
        population_count: 1000,
        ring_count: 5,
      };

      const result = formatAreaKPIs(summary);

      // Should round to 2 decimal places
      expect(result.averageWeight).toBe('3.46 kg');
    });
  });

  describe('with missing/undefined data', () => {
    it('returns honest fallbacks when summary is undefined', () => {
      const result = formatAreaKPIs(undefined);

      expect(result.totalBiomass).toBe('0.0 t'); // Consistent 1 decimal place
      expect(result.totalBiomassTooltip).toBe('No data available');
      expect(result.averageWeight).toBe('0.00 kg'); // Consistent 2 decimal places
      expect(result.averageWeightTooltip).toBe('No data available');
      expect(result.containerCount).toBe('0 containers');
      expect(result.containerCountTooltip).toBe('No data available');
      expect(result.populationCount).toBe('0 fish');
      expect(result.populationCountTooltip).toBe('No data available');
      expect(result.ringCount).toBe('0 rings');
      expect(result.ringCountTooltip).toBe('No data available');
    });

    it('handles partial data with some fields undefined', () => {
      const summary = {
        active_biomass_kg: 10000,
        // avg_weight_kg missing
        container_count: 5,
        // population_count missing
        ring_count: 5,
      } as AreaSummary;

      const result = formatAreaKPIs(summary);

      expect(result.totalBiomass).toBe('10.0 t');
      expect(result.totalBiomassTooltip).toBe('Current active biomass (from server)');
      expect(result.averageWeight).toBe('0.00 kg'); // Honest fallback, consistent precision
      expect(result.averageWeightTooltip).toBe('No data available');
      expect(result.containerCount).toBe('5 containers');
      expect(result.populationCount).toBe('0 fish'); // Honest fallback
      expect(result.ringCount).toBe('5 rings');
    });

    it('handles null values in fields', () => {
      const summary = {
        active_biomass_kg: null,
        avg_weight_kg: null,
        container_count: null,
        population_count: null,
        ring_count: null,
      } as any;

      const result = formatAreaKPIs(summary);

      expect(result.totalBiomass).toBe('0.0 t'); // Consistent 1 decimal
      expect(result.averageWeight).toBe('0.00 kg'); // Consistent 2 decimals
      expect(result.containerCount).toBe('0 containers');
      expect(result.populationCount).toBe('0 fish');
      expect(result.ringCount).toBe('0 rings');
    });
  });

  describe('edge cases', () => {
    it('handles very small biomass values', () => {
      const summary: AreaSummary = {
        active_biomass_kg: 1, // 0.001 tonnes
        avg_weight_kg: 0.01,
        container_count: 1,
        population_count: 100,
        ring_count: 1,
      };

      const result = formatAreaKPIs(summary);

      expect(result.totalBiomass).toBe('0.0 t'); // Rounds to 0.0 (1 decimal)
      expect(result.averageWeight).toBe('0.01 kg'); // 2 decimals
    });

    it('handles very large values', () => {
      const summary: AreaSummary = {
        active_biomass_kg: 99999999,
        avg_weight_kg: 999.99,
        container_count: 9999,
        population_count: 99999999,
        ring_count: 999,
      };

      const result = formatAreaKPIs(summary);

      expect(result.totalBiomass).toBe('100,000.0 t');
      expect(result.averageWeight).toBe('999.99 kg');
      expect(result.containerCount).toBe('9,999 containers');
      expect(result.populationCount).toBe('99,999,999 fish');
      expect(result.ringCount).toBe('999 rings');
    });
  });
});

describe('formatContainerData', () => {
  describe('with complete container data', () => {
    it('formats all fields correctly', () => {
      const container = {
        biomass: 3.5, // 3.5 tonnes = 3500 kg
        capacity: 50, // 50 tonnes
        fishCount: 1200,
        averageWeight: 2.9167,
      };

      const result = formatContainerData(container);

      expect(result.biomass).toBe('3,500 kg');
      expect(result.capacity).toBe('50 t');
      expect(result.fishCount).toBe('1,200');
      expect(result.averageWeight).toBe('2.92 kg');
      expect(result.utilization).toBe('7%'); // 3.5 / 50 = 7%
    });

    it('formats large values with separators', () => {
      const container = {
        biomass: 45.678, // 45,678 kg
        capacity: 100,
        fishCount: 15678,
        averageWeight: 2.913,
      };

      const result = formatContainerData(container);

      expect(result.biomass).toBe('45,678 kg');
      expect(result.capacity).toBe('100 t');
      expect(result.fishCount).toBe('15,678');
    });

    it('handles zero biomass and fish count', () => {
      const container = {
        biomass: 0,
        capacity: 50,
        fishCount: 0,
        averageWeight: 0,
      };

      const result = formatContainerData(container);

      expect(result.biomass).toBe('0 kg');
      expect(result.capacity).toBe('50 t');
      expect(result.fishCount).toBe('0');
      expect(result.averageWeight).toBe('0.00 kg');
      expect(result.utilization).toBe('0%');
    });

    it('calculates utilization correctly', () => {
      const container = {
        biomass: 25,
        capacity: 50,
        fishCount: 8571,
        averageWeight: 2.917,
      };

      const result = formatContainerData(container);

      expect(result.utilization).toBe('50%'); // 25 / 50 = 50%
    });

    it('handles 100% utilization', () => {
      const container = {
        biomass: 50,
        capacity: 50,
        fishCount: 10000,
        averageWeight: 5.0,
      };

      const result = formatContainerData(container);

      expect(result.utilization).toBe('100%');
    });
  });

  describe('with missing/undefined data', () => {
    it('returns honest fallbacks for missing fields', () => {
      const container = {};

      const result = formatContainerData(container);

      expect(result.biomass).toBe('0 kg');
      expect(result.capacity).toBe('N/A');
      expect(result.fishCount).toBe('0');
      expect(result.averageWeight).toBe('0.00 kg');
      expect(result.utilization).toBe('0%');
    });

    it('handles partial data correctly', () => {
      const container = {
        biomass: 10,
        // capacity missing
        fishCount: 3000,
        // averageWeight missing
      };

      const result = formatContainerData(container);

      expect(result.biomass).toBe('10,000 kg');
      expect(result.capacity).toBe('N/A');
      expect(result.fishCount).toBe('3,000');
      expect(result.averageWeight).toBe('0.00 kg');
      expect(result.utilization).toBe('0%'); // Can't calculate without capacity
    });

    it('handles zero capacity edge case', () => {
      const container = {
        biomass: 10,
        capacity: 0,
        fishCount: 100,
        averageWeight: 100,
      };

      const result = formatContainerData(container);

      expect(result.utilization).toBe('0%'); // Avoid division by zero
    });
  });

  describe('edge cases', () => {
    it('handles decimal biomass values', () => {
      const container = {
        biomass: 1.234, // 1,234 kg
        capacity: 50,
        fishCount: 500,
        averageWeight: 2.468,
      };

      const result = formatContainerData(container);

      expect(result.biomass).toBe('1,234 kg');
    });

    it('handles over-capacity utilization', () => {
      const container = {
        biomass: 60,
        capacity: 50,
        fishCount: 12000,
        averageWeight: 5.0,
      };

      const result = formatContainerData(container);

      expect(result.utilization).toBe('120%'); // Over capacity
    });
  });
});

describe('calculateAreaUtilization', () => {
  it('calculates correct percentage for typical values', () => {
    const summary: AreaSummary = {
      active_biomass_kg: 45000, // 45 tonnes
      avg_weight_kg: 3.0,
      container_count: 10,
      population_count: 15000,
      ring_count: 10,
    };
    const capacity = 100; // 100 tonnes

    const result = calculateAreaUtilization(summary, capacity);

    expect(result).toBe(45); // 45 / 100 = 45%
  });

  it('handles 0% utilization', () => {
    const summary: AreaSummary = {
      active_biomass_kg: 0,
      avg_weight_kg: 0,
      container_count: 0,
      population_count: 0,
      ring_count: 0,
    };
    const capacity = 100;

    const result = calculateAreaUtilization(summary, capacity);

    expect(result).toBe(0);
  });

  it('handles 100% utilization', () => {
    const summary: AreaSummary = {
      active_biomass_kg: 100000, // 100 tonnes
      avg_weight_kg: 5.0,
      container_count: 20,
      population_count: 20000,
      ring_count: 20,
    };
    const capacity = 100;

    const result = calculateAreaUtilization(summary, capacity);

    expect(result).toBe(100);
  });

  it('handles over-capacity utilization', () => {
    const summary: AreaSummary = {
      active_biomass_kg: 120000, // 120 tonnes
      avg_weight_kg: 4.0,
      container_count: 25,
      population_count: 30000,
      ring_count: 25,
    };
    const capacity = 100;

    const result = calculateAreaUtilization(summary, capacity);

    expect(result).toBe(120); // Over capacity
  });

  it('returns 0 when summary is undefined', () => {
    const result = calculateAreaUtilization(undefined, 100);

    expect(result).toBe(0);
  });

  it('returns 0 when biomass is missing', () => {
    const summary = {
      // active_biomass_kg missing
      avg_weight_kg: 3.0,
      container_count: 10,
      population_count: 10000,
      ring_count: 10,
    } as AreaSummary;

    const result = calculateAreaUtilization(summary, 100);

    expect(result).toBe(0);
  });

  it('returns 0 when capacity is undefined', () => {
    const summary: AreaSummary = {
      active_biomass_kg: 50000,
      avg_weight_kg: 3.0,
      container_count: 10,
      population_count: 16667,
      ring_count: 10,
    };

    const result = calculateAreaUtilization(summary, undefined);

    expect(result).toBe(0);
  });

  it('returns 0 when capacity is zero (avoid division by zero)', () => {
    const summary: AreaSummary = {
      active_biomass_kg: 50000,
      avg_weight_kg: 3.0,
      container_count: 10,
      population_count: 16667,
      ring_count: 10,
    };

    const result = calculateAreaUtilization(summary, 0);

    expect(result).toBe(0);
  });
});

describe('calculateAverageRingDepth', () => {
  it('calculates average depth correctly', () => {
    const rings = [
      { waterDepth: 20 },
      { waterDepth: 30 },
      { waterDepth: 25 },
    ];

    const result = calculateAverageRingDepth(rings);

    expect(result).toBe('25.0m'); // (20 + 30 + 25) / 3 = 25
  });

  it('handles single ring', () => {
    const rings = [{ waterDepth: 22 }];

    const result = calculateAverageRingDepth(rings);

    expect(result).toBe('22.0m');
  });

  it('formats decimal values correctly', () => {
    const rings = [
      { waterDepth: 20 },
      { waterDepth: 25 },
    ];

    const result = calculateAverageRingDepth(rings);

    expect(result).toBe('22.5m'); // (20 + 25) / 2 = 22.5
  });

  it('returns N/A for empty array', () => {
    const result = calculateAverageRingDepth([]);

    expect(result).toBe('N/A');
  });

  it('returns N/A for null/undefined input', () => {
    expect(calculateAverageRingDepth(null as any)).toBe('N/A');
    expect(calculateAverageRingDepth(undefined as any)).toBe('N/A');
  });

  it('handles zero depth values', () => {
    const rings = [
      { waterDepth: 0 },
      { waterDepth: 0 },
    ];

    const result = calculateAverageRingDepth(rings);

    expect(result).toBe('0.0m');
  });
});

describe('countActiveRings', () => {
  it('counts active rings correctly', () => {
    const rings = [
      { status: 'active' },
      { status: 'inactive' },
      { status: 'active' },
      { status: 'maintenance' },
      { status: 'active' },
    ];

    const result = countActiveRings(rings);

    expect(result).toBe(3);
  });

  it('returns 0 when no active rings', () => {
    const rings = [
      { status: 'inactive' },
      { status: 'maintenance' },
    ];

    const result = countActiveRings(rings);

    expect(result).toBe(0);
  });

  it('returns 0 for empty array', () => {
    const result = countActiveRings([]);

    expect(result).toBe(0);
  });

  it('returns 0 for null/undefined input', () => {
    expect(countActiveRings(null as any)).toBe(0);
    expect(countActiveRings(undefined as any)).toBe(0);
  });

  it('counts all active when all are active', () => {
    const rings = [
      { status: 'active' },
      { status: 'active' },
      { status: 'active' },
    ];

    const result = countActiveRings(rings);

    expect(result).toBe(3);
  });
});


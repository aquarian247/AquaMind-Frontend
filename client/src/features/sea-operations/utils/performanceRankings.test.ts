import { describe, it, expect } from 'vitest';
import { rankByMetric, getRankingLabel, isLowerBetter } from './performanceRankings';
import type { AreaFacilitySummary } from '../types';

const mockFacilities: AreaFacilitySummary[] = [
  { id: 1, name: 'Area A', geography_id: 1, geography_name: 'Faroe', biomass_tons: 100, avg_weight_kg: 3.0, population: 50000, tgc: 3.2, fcr: 1.1, mortality_pct: 0.8, mature_lice: 0.3, movable_lice: 0.5, lice_alert_level: 'success', ring_count: 10 },
  { id: 2, name: 'Area B', geography_id: 1, geography_name: 'Faroe', biomass_tons: 200, avg_weight_kg: 2.5, population: 80000, tgc: 2.8, fcr: 1.3, mortality_pct: 1.2, mature_lice: 0.7, movable_lice: 1.2, lice_alert_level: 'warning', ring_count: 15 },
  { id: 3, name: 'Area C', geography_id: 2, geography_name: 'Scotland', biomass_tons: 150, avg_weight_kg: 4.0, population: 40000, tgc: 3.5, fcr: 1.0, mortality_pct: 0.5, mature_lice: 0.1, movable_lice: 0.2, lice_alert_level: 'success', ring_count: 8 },
  { id: 4, name: 'Area D', geography_id: 2, geography_name: 'Scotland', biomass_tons: 80, avg_weight_kg: 2.0, population: 30000, tgc: 2.5, fcr: 1.5, mortality_pct: 2.0, mature_lice: 1.2, movable_lice: 2.5, lice_alert_level: 'danger', ring_count: 5 },
];

describe('performanceRankings', () => {
  describe('rankByMetric', () => {
    it('should rank by TGC (higher is better)', () => {
      const result = rankByMetric(mockFacilities, 'tgc');
      expect(result[0].facility).toBe('Area C');
      expect(result[0].value).toBe(3.5);
      expect(result[1].facility).toBe('Area A');
    });

    it('should rank by FCR (lower is better)', () => {
      const result = rankByMetric(mockFacilities, 'fcr');
      expect(result[0].facility).toBe('Area C');
      expect(result[0].value).toBe(1.0);
    });

    it('should rank by mortality (lower is better)', () => {
      const result = rankByMetric(mockFacilities, 'mortality');
      expect(result[0].facility).toBe('Area C');
      expect(result[0].value).toBe(0.5);
    });

    it('should rank by lice (lower is better)', () => {
      const result = rankByMetric(mockFacilities, 'lice');
      expect(result[0].facility).toBe('Area C');
      expect(result[0].value).toBe(0.1);
    });

    it('should return top N results', () => {
      const result = rankByMetric(mockFacilities, 'tgc', 2);
      expect(result).toHaveLength(2);
    });

    it('should filter out null values', () => {
      const withNull = [...mockFacilities, {
        ...mockFacilities[0], id: 5, name: 'Area E', tgc: null,
      }] as AreaFacilitySummary[];
      const result = rankByMetric(withNull, 'tgc');
      expect(result.every(r => r.value > 0)).toBe(true);
    });

    it('should include geography info', () => {
      const result = rankByMetric(mockFacilities, 'tgc');
      expect(result[0].geography).toBe('Scotland');
      expect(result[0].area_id).toBe(3);
    });
  });

  describe('getRankingLabel', () => {
    it('should return correct labels', () => {
      expect(getRankingLabel('tgc')).toBe('Top Performers by TGC');
      expect(getRankingLabel('fcr')).toBe('Best FCR');
      expect(getRankingLabel('mortality')).toBe('Lowest Mortality');
      expect(getRankingLabel('lice')).toBe('Lowest Lice Counts');
    });
  });

  describe('isLowerBetter', () => {
    it('should return false for TGC', () => {
      expect(isLowerBetter('tgc')).toBe(false);
    });

    it('should return true for FCR, mortality, lice', () => {
      expect(isLowerBetter('fcr')).toBe(true);
      expect(isLowerBetter('mortality')).toBe(true);
      expect(isLowerBetter('lice')).toBe(true);
    });
  });
});

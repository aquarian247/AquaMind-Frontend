import { describe, it, expect } from 'vitest';
import {
  getFreshwaterMortalityAlertLevel,
  getFreshwaterTGCAlertLevel,
  getFreshwaterFCRAlertLevel,
  getFreshwaterStationHealthStatus,
  getAlertColorClass,
  getAlertBgClass,
} from './performanceThresholds';

describe('performanceThresholds', () => {
  describe('getFreshwaterMortalityAlertLevel', () => {
    it('should return info for null', () => {
      expect(getFreshwaterMortalityAlertLevel(null, '14d')).toBe('info');
    });

    it('should return success for low 14d mortality', () => {
      expect(getFreshwaterMortalityAlertLevel(0.3, '14d')).toBe('success');
    });

    it('should return warning for medium 14d mortality', () => {
      expect(getFreshwaterMortalityAlertLevel(0.6, '14d')).toBe('warning');
    });

    it('should return danger for high 14d mortality', () => {
      expect(getFreshwaterMortalityAlertLevel(0.8, '14d')).toBe('danger');
    });

    it('should use correct 30d thresholds', () => {
      expect(getFreshwaterMortalityAlertLevel(0.5, '30d')).toBe('success');
      expect(getFreshwaterMortalityAlertLevel(0.9, '30d')).toBe('warning');
      expect(getFreshwaterMortalityAlertLevel(1.5, '30d')).toBe('danger');
    });

    it('should use correct 90d thresholds', () => {
      expect(getFreshwaterMortalityAlertLevel(1.0, '90d')).toBe('success');
      expect(getFreshwaterMortalityAlertLevel(2.0, '90d')).toBe('warning');
      expect(getFreshwaterMortalityAlertLevel(3.5, '90d')).toBe('danger');
    });
  });

  describe('getFreshwaterTGCAlertLevel', () => {
    it('should return info for null', () => {
      expect(getFreshwaterTGCAlertLevel(null)).toBe('info');
    });

    it('should return success for high TGC', () => {
      expect(getFreshwaterTGCAlertLevel(4.0)).toBe('success');
    });

    it('should return warning for medium TGC', () => {
      expect(getFreshwaterTGCAlertLevel(3.2)).toBe('warning');
    });

    it('should return danger for low TGC', () => {
      expect(getFreshwaterTGCAlertLevel(2.5)).toBe('danger');
    });
  });

  describe('getFreshwaterFCRAlertLevel', () => {
    it('should return info for null', () => {
      expect(getFreshwaterFCRAlertLevel(null)).toBe('info');
    });

    it('should return success for excellent FCR', () => {
      expect(getFreshwaterFCRAlertLevel(0.8)).toBe('success');
    });

    it('should return warning for good FCR', () => {
      expect(getFreshwaterFCRAlertLevel(1.1)).toBe('warning');
    });

    it('should return danger for poor FCR', () => {
      expect(getFreshwaterFCRAlertLevel(1.3)).toBe('danger');
    });
  });

  describe('getFreshwaterStationHealthStatus', () => {
    it('should return info when all metrics are null', () => {
      expect(getFreshwaterStationHealthStatus({
        mortality_pct: null, tgc: null, fcr: null,
      })).toBe('info');
    });

    it('should return danger when mortality is critical', () => {
      expect(getFreshwaterStationHealthStatus({
        mortality_pct: 2.0, tgc: 3.5, fcr: 1.0,
      })).toBe('danger');
    });

    it('should return success when all metrics are good', () => {
      expect(getFreshwaterStationHealthStatus({
        mortality_pct: 0.3, tgc: 4.0, fcr: 0.9,
      })).toBe('success');
    });
  });

  describe('getAlertColorClass', () => {
    it('should return correct color classes', () => {
      expect(getAlertColorClass('success')).toContain('green');
      expect(getAlertColorClass('warning')).toContain('yellow');
      expect(getAlertColorClass('danger')).toContain('red');
      expect(getAlertColorClass('info')).toContain('muted');
    });
  });

  describe('getAlertBgClass', () => {
    it('should return background classes for each level', () => {
      expect(getAlertBgClass('success')).toContain('bg-');
      expect(getAlertBgClass('warning')).toContain('bg-');
      expect(getAlertBgClass('danger')).toContain('bg-');
      expect(getAlertBgClass('info')).toContain('bg-');
    });
  });
});

import { describe, it, expect } from 'vitest';
import { getHealthStatus, getHealthStatusColor, calculateDaysActive } from './batchHelpers';

describe('batchHelpers', () => {
  describe('getHealthStatus', () => {
    it('should return excellent for survival rate >= 95%', () => {
      expect(getHealthStatus(95)).toBe('excellent');
      expect(getHealthStatus(98)).toBe('excellent');
      expect(getHealthStatus(100)).toBe('excellent');
    });

    it('should return good for survival rate between 90-94%', () => {
      expect(getHealthStatus(90)).toBe('good');
      expect(getHealthStatus(92)).toBe('good');
      expect(getHealthStatus(94)).toBe('good');
    });

    it('should return fair for survival rate between 85-89%', () => {
      expect(getHealthStatus(85)).toBe('fair');
      expect(getHealthStatus(87)).toBe('fair');
      expect(getHealthStatus(89)).toBe('fair');
    });

    it('should return poor for survival rate between 80-84%', () => {
      expect(getHealthStatus(80)).toBe('poor');
      expect(getHealthStatus(82)).toBe('poor');
      expect(getHealthStatus(84)).toBe('poor');
    });

    it('should return critical for survival rate < 80%', () => {
      expect(getHealthStatus(79)).toBe('critical');
      expect(getHealthStatus(50)).toBe('critical');
      expect(getHealthStatus(0)).toBe('critical');
    });
  });

  describe('getHealthStatusColor', () => {
    it('should return correct classes for each status', () => {
      expect(getHealthStatusColor('excellent')).toContain('text-green-600');
      expect(getHealthStatusColor('good')).toContain('text-blue-600');
      expect(getHealthStatusColor('fair')).toContain('text-yellow-600');
      expect(getHealthStatusColor('poor')).toContain('text-orange-600');
      expect(getHealthStatusColor('critical')).toContain('text-red-600');
    });

    it('should return default classes for unknown status', () => {
      expect(getHealthStatusColor('unknown')).toContain('text-gray-600');
      expect(getHealthStatusColor('')).toContain('text-gray-600');
    });
  });

  describe('calculateDaysActive', () => {
    it('should calculate days correctly for recent date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isoDate = yesterday.toISOString();
      
      expect(calculateDaysActive(isoDate)).toBe(1);
    });

    it('should calculate days correctly for older date', () => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      const isoDate = tenDaysAgo.toISOString();
      
      expect(calculateDaysActive(isoDate)).toBe(10);
    });

    it('should return 0 for today', () => {
      const today = new Date().toISOString();
      expect(calculateDaysActive(today)).toBe(0);
    });

    it('should return 0 for invalid date', () => {
      expect(calculateDaysActive('invalid-date')).toBe(0);
      expect(calculateDaysActive('')).toBe(0);
    });

    it('should return 0 for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isoDate = tomorrow.toISOString();
      
      expect(calculateDaysActive(isoDate)).toBe(0);
    });
  });
});


import { describe, it, expect } from 'vitest';
import {
  formatTonnes,
  formatMillions,
  formatWeightG,
  formatPct,
  formatReportDate,
  getCurrentWeek,
  getWeekDateRange,
} from './reportFormatting';

describe('reportFormatting', () => {
  describe('formatTonnes', () => {
    it('should convert kg to tonnes', () => {
      expect(formatTonnes(5000)).toBe('5.0');
    });

    it('should return N/A for null', () => {
      expect(formatTonnes(null)).toBe('N/A');
    });

    it('should respect precision', () => {
      expect(formatTonnes(1234, 2)).toBe('1.23');
    });
  });

  describe('formatMillions', () => {
    it('should convert count to millions', () => {
      expect(formatMillions(2_500_000)).toBe('2.50');
    });

    it('should return N/A for null', () => {
      expect(formatMillions(null)).toBe('N/A');
    });
  });

  describe('formatWeightG', () => {
    it('should format weight in grams', () => {
      expect(formatWeightG(123.456)).toBe('123.5g');
    });

    it('should return N/A for null', () => {
      expect(formatWeightG(null)).toBe('N/A');
    });
  });

  describe('formatPct', () => {
    it('should format percentage', () => {
      expect(formatPct(12.345)).toBe('12.35%');
    });

    it('should return N/A for null', () => {
      expect(formatPct(null)).toBe('N/A');
    });
  });

  describe('formatReportDate', () => {
    it('should format a date string', () => {
      const result = formatReportDate('2025-10-18');
      expect(result).not.toBe('N/A');
      expect(result).toContain('Oct');
    });

    it('should return N/A for null', () => {
      expect(formatReportDate(null)).toBe('N/A');
    });

    it('should return N/A for invalid date', () => {
      expect(formatReportDate('not-a-date')).toBe('N/A');
    });
  });

  describe('getCurrentWeek', () => {
    it('should return a valid week number and year', () => {
      const { week, year } = getCurrentWeek();
      expect(week).toBeGreaterThanOrEqual(1);
      expect(week).toBeLessThanOrEqual(53);
      expect(year).toBeGreaterThanOrEqual(2025);
    });
  });

  describe('getWeekDateRange', () => {
    it('should return start and end dates', () => {
      const { start, end } = getWeekDateRange();
      expect(start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(end).getTime()).toBeGreaterThan(new Date(start).getTime());
    });
  });
});

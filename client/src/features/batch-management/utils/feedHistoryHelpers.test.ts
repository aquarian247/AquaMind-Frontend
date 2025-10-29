import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  getDateRangeFromPeriod,
  getDaysSinceStart,
  calculateTotalFeedCost,
  calculateAverageDailyFeed,
  getCurrentFCR,
  groupFeedingEventsByType,
  filterFeedingEvents,
  getUniqueFilterValues,
} from './feedHistoryHelpers';
import { subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import type { FeedingEvent } from '@/hooks/useBatchFeedHistoryData';

describe('feedHistoryHelpers', () => {
  describe('formatNumber', () => {
    it('should format number with thousand separators', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
    });

    it('should format zero correctly', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should format negative numbers', () => {
      expect(formatNumber(-1234.56)).toBe('-1,234.56');
    });

    it('should format small numbers without separators', () => {
      expect(formatNumber(123)).toBe('123');
    });

    it('should format large numbers with multiple separators', () => {
      expect(formatNumber(1234567890)).toBe('1,234,567,890');
    });
  });

  describe('getDateRangeFromPeriod', () => {
    it('should return last 7 days range', () => {
      const result = getDateRangeFromPeriod('7');
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
      const daysDiff = Math.round(
        (result.to!.getTime() - result.from!.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(daysDiff).toBeCloseTo(7, 0);
    });

    it('should return last 30 days range', () => {
      const result = getDateRangeFromPeriod('30');
      const daysDiff = Math.round(
        (result.to!.getTime() - result.from!.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(daysDiff).toBeCloseTo(30, 0);
    });

    it('should return last 90 days range', () => {
      const result = getDateRangeFromPeriod('90');
      const daysDiff = Math.round(
        (result.to!.getTime() - result.from!.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(daysDiff).toBeCloseTo(90, 0);
    });

    it('should return this week range', () => {
      const result = getDateRangeFromPeriod('week');
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
    });

    it('should return this month range', () => {
      const result = getDateRangeFromPeriod('month');
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
    });

    it('should return custom date range when provided', () => {
      const customRange = {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
      };
      const result = getDateRangeFromPeriod('custom', customRange);
      expect(result).toEqual(customRange);
    });

    it('should return empty object for unknown period', () => {
      const result = getDateRangeFromPeriod('unknown');
      expect(result).toEqual({});
    });
  });

  describe('getDaysSinceStart', () => {
    it('should calculate days since batch start', () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 10); // 10 days ago
      const days = getDaysSinceStart(startDate);
      expect(days).toBeGreaterThanOrEqual(10);
      expect(days).toBeLessThanOrEqual(11); // Account for rounding
    });

    it('should return 0 for today start date', () => {
      const startDate = new Date();
      const days = getDaysSinceStart(startDate);
      expect(days).toBe(0);
    });

    it('should handle past dates correctly', () => {
      const startDate = new Date('2023-01-01');
      const days = getDaysSinceStart(startDate);
      expect(days).toBeGreaterThan(600); // More than 600 days
    });
  });

  describe('calculateTotalFeedCost', () => {
    it('should calculate total feed cost from events', () => {
      const events = [
        { feedCost: 100 } as FeedingEvent,
        { feedCost: 200 } as FeedingEvent,
        { feedCost: 50 } as FeedingEvent,
      ];
      expect(calculateTotalFeedCost(events)).toBe(350);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalFeedCost([])).toBe(0);
    });

    it('should handle undefined/null feed costs', () => {
      const events = [
        { feedCost: 100 } as FeedingEvent,
        { feedCost: undefined } as any,
        { feedCost: 50 } as FeedingEvent,
      ];
      expect(calculateTotalFeedCost(events)).toBe(150);
    });

    it('should handle zero costs', () => {
      const events = [
        { feedCost: 0 } as FeedingEvent,
        { feedCost: 0 } as FeedingEvent,
      ];
      expect(calculateTotalFeedCost(events)).toBe(0);
    });

    it('should handle negative costs (refunds)', () => {
      const events = [
        { feedCost: 100 } as FeedingEvent,
        { feedCost: -20 } as FeedingEvent,
      ];
      expect(calculateTotalFeedCost(events)).toBe(80);
    });
  });

  describe('calculateAverageDailyFeed', () => {
    it('should calculate average daily feed correctly', () => {
      expect(calculateAverageDailyFeed(1000, 10)).toBe(100);
    });

    it('should return 0 when total feed is 0', () => {
      expect(calculateAverageDailyFeed(0, 10)).toBe(0);
    });

    it('should return 0 when days is 0 (avoid division by zero)', () => {
      expect(calculateAverageDailyFeed(1000, 0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(calculateAverageDailyFeed(333.33, 3)).toBeCloseTo(111.11, 2);
    });

    it('should handle large numbers', () => {
      expect(calculateAverageDailyFeed(1000000, 100)).toBe(10000);
    });
  });

  describe('getCurrentFCR', () => {
    it('should return FCR from latest summary', () => {
      const summaries = [{ fcr: 1.2 }, { fcr: 1.25 }, { fcr: 1.3 }];
      expect(getCurrentFCR(summaries)).toBe(1.3);
    });

    it('should return null when no summaries', () => {
      expect(getCurrentFCR([])).toBeNull();
    });

    it('should handle single summary', () => {
      const summaries = [{ fcr: 1.1 }];
      expect(getCurrentFCR(summaries)).toBe(1.1);
    });

    it('should return null for summary with undefined fcr', () => {
      const summaries = [{ fcr: undefined as any }];
      expect(getCurrentFCR(summaries)).toBeNull();
    });
  });

  describe('groupFeedingEventsByType', () => {
    it('should group events by feed type and brand', () => {
      const events: FeedingEvent[] = [
        {
          id: 1,
          feedType: 'Pellet',
          feedBrand: 'BrandA',
          amountKg: 100,
          feedCost: 50,
          feedingDate: '2024-01-01',
          feedingTime: '10:00',
          containerName: 'Ring-1',
          batchBiomassKg: 1000,
          method: 'Manual',
          recordedBy: 'user1',
        },
        {
          id: 2,
          feedType: 'Pellet',
          feedBrand: 'BrandA',
          amountKg: 150,
          feedCost: 75,
          feedingDate: '2024-01-02',
          feedingTime: '10:00',
          containerName: 'Ring-1',
          batchBiomassKg: 1000,
          method: 'Manual',
          recordedBy: 'user1',
        },
      ];

      const result = groupFeedingEventsByType(events);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        feedType: 'Pellet',
        feedBrand: 'BrandA',
        totalAmountKg: 250,
        totalCost: 125,
        eventsCount: 2,
        averageAmountPerEvent: 125,
      });
    });

    it('should handle multiple feed types', () => {
      const events: FeedingEvent[] = [
        {
          id: 1,
          feedType: 'Pellet',
          feedBrand: 'BrandA',
          amountKg: 100,
          feedCost: 50,
          feedingDate: '2024-01-01',
          feedingTime: '10:00',
          containerName: 'Ring-1',
          batchBiomassKg: 1000,
          method: 'Manual',
          recordedBy: 'user1',
        },
        {
          id: 2,
          feedType: 'Powder',
          feedBrand: 'BrandB',
          amountKg: 200,
          feedCost: 100,
          feedingDate: '2024-01-02',
          feedingTime: '10:00',
          containerName: 'Ring-1',
          batchBiomassKg: 1000,
          method: 'Automatic',
          recordedBy: 'system',
        },
      ];

      const result = groupFeedingEventsByType(events);

      expect(result).toHaveLength(2);
      expect(result.map(r => r.feedType)).toEqual(['Pellet', 'Powder']);
    });

    it('should return empty array for no events', () => {
      expect(groupFeedingEventsByType([])).toEqual([]);
    });

    it('should handle events with zero costs', () => {
      const events: FeedingEvent[] = [
        {
          id: 1,
          feedType: 'Pellet',
          feedBrand: 'BrandA',
          amountKg: 100,
          feedCost: 0,
          feedingDate: '2024-01-01',
          feedingTime: '10:00',
          containerName: 'Ring-1',
          batchBiomassKg: 1000,
          method: 'Manual',
          recordedBy: 'user1',
        },
      ];

      const result = groupFeedingEventsByType(events);

      expect(result[0].totalCost).toBe(0);
    });
  });

  describe('filterFeedingEvents', () => {
    const mockEvents: FeedingEvent[] = [
      {
        id: 1,
        feedType: 'Pellet',
        feedBrand: 'BrandA',
        containerName: 'Ring-1',
        amountKg: 100,
        feedCost: 50,
        feedingDate: '2024-01-01',
        feedingTime: '10:00',
        batchBiomassKg: 1000,
        method: 'Manual',
        recordedBy: 'user1',
      },
      {
        id: 2,
        feedType: 'Powder',
        feedBrand: 'BrandB',
        containerName: 'Ring-2',
        amountKg: 200,
        feedCost: 100,
        feedingDate: '2024-01-02',
        feedingTime: '10:00',
        batchBiomassKg: 1000,
        method: 'Automatic',
        recordedBy: 'system',
      },
      {
        id: 3,
        feedType: 'Pellet',
        feedBrand: 'BrandA',
        containerName: 'Ring-2',
        amountKg: 150,
        feedCost: 75,
        feedingDate: '2024-01-03',
        feedingTime: '10:00',
        batchBiomassKg: 1000,
        method: 'Manual',
        recordedBy: 'user1',
      },
    ];

    it('should filter by feed type', () => {
      const result = filterFeedingEvents(mockEvents, 'Pellet', 'all');
      expect(result).toHaveLength(2);
      expect(result.every(e => e.feedType === 'Pellet')).toBe(true);
    });

    it('should filter by container', () => {
      const result = filterFeedingEvents(mockEvents, 'all', 'Ring-1');
      expect(result).toHaveLength(1);
      expect(result[0].containerName).toBe('Ring-1');
    });

    it('should filter by both feed type and container', () => {
      const result = filterFeedingEvents(mockEvents, 'Pellet', 'Ring-2');
      expect(result).toHaveLength(1);
      expect(result[0].feedType).toBe('Pellet');
      expect(result[0].containerName).toBe('Ring-2');
    });

    it('should return all events when filters are "all"', () => {
      const result = filterFeedingEvents(mockEvents, 'all', 'all');
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no matches', () => {
      const result = filterFeedingEvents(mockEvents, 'NonExistent', 'all');
      expect(result).toHaveLength(0);
    });
  });

  describe('getUniqueFilterValues', () => {
    it('should extract unique feed types and containers', () => {
      const events: FeedingEvent[] = [
        {
          id: 1,
          feedType: 'Pellet',
          feedBrand: 'BrandA',
          containerName: 'Ring-1',
          amountKg: 100,
          feedCost: 50,
          feedingDate: '2024-01-01',
          feedingTime: '10:00',
          batchBiomassKg: 1000,
          method: 'Manual',
          recordedBy: 'user1',
        },
        {
          id: 2,
          feedType: 'Powder',
          feedBrand: 'BrandB',
          containerName: 'Ring-2',
          amountKg: 200,
          feedCost: 100,
          feedingDate: '2024-01-02',
          feedingTime: '10:00',
          batchBiomassKg: 1000,
          method: 'Automatic',
          recordedBy: 'system',
        },
        {
          id: 3,
          feedType: 'Pellet',
          feedBrand: 'BrandA',
          containerName: 'Ring-1',
          amountKg: 150,
          feedCost: 75,
          feedingDate: '2024-01-03',
          feedingTime: '10:00',
          batchBiomassKg: 1000,
          method: 'Manual',
          recordedBy: 'user1',
        },
      ];

      const result = getUniqueFilterValues(events);

      expect(result.feedTypes).toEqual(['Pellet', 'Powder']);
      expect(result.containers).toEqual(['Ring-1', 'Ring-2']);
    });

    it('should return empty arrays for no events', () => {
      const result = getUniqueFilterValues([]);
      expect(result.feedTypes).toEqual([]);
      expect(result.containers).toEqual([]);
    });

    it('should handle single event', () => {
      const events: FeedingEvent[] = [
        {
          id: 1,
          feedType: 'Pellet',
          feedBrand: 'BrandA',
          containerName: 'Ring-1',
          amountKg: 100,
          feedCost: 50,
          feedingDate: '2024-01-01',
          feedingTime: '10:00',
          batchBiomassKg: 1000,
          method: 'Manual',
          recordedBy: 'user1',
        },
      ];

      const result = getUniqueFilterValues(events);

      expect(result.feedTypes).toEqual(['Pellet']);
      expect(result.containers).toEqual(['Ring-1']);
    });
  });
});


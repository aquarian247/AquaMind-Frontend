import { describe, it, expect } from 'vitest';
import { calculateSizeDistribution, getTransferRangePercentage, SIZE_CLASSES } from './sizeDistributionCalc';

describe('sizeDistributionCalc', () => {
  describe('calculateSizeDistribution', () => {
    it('should return 6 size classes', () => {
      const result = calculateSizeDistribution(100, 30, 1000);
      expect(result).toHaveLength(6);
    });

    it('should have percentages that sum to approximately 100', () => {
      const result = calculateSizeDistribution(100, 30, 1000);
      const total = result.reduce((s, c) => s + c.percentage, 0);
      expect(total).toBeGreaterThan(95);
      expect(total).toBeLessThanOrEqual(100.1);
    });

    it('should concentrate weight around the mean for small fish (5g)', () => {
      const result = calculateSizeDistribution(5, 2, 10000);
      const smallClass = result.find(c => c.label === '0.1-5g');
      expect(smallClass!.percentage).toBeGreaterThan(30);
    });

    it('should concentrate weight in transfer range for 250g fish', () => {
      const result = calculateSizeDistribution(250, 40, 10000);
      const transferClass = result.find(c => c.label === '180-350g');
      expect(transferClass!.percentage).toBeGreaterThan(50);
    });

    it('should calculate counts when totalCount is provided', () => {
      const result = calculateSizeDistribution(100, 30, 10000);
      const totalCalcCount = result.reduce((s, c) => s + (c.count ?? 0), 0);
      expect(totalCalcCount).toBeGreaterThan(9000);
      expect(totalCalcCount).toBeLessThanOrEqual(10100);
    });

    it('should return null counts when totalCount is null', () => {
      const result = calculateSizeDistribution(100, 30, null);
      result.forEach(c => expect(c.count).toBeNull());
    });

    it('should handle zero standard deviation', () => {
      const result = calculateSizeDistribution(100, 0, 1000);
      const containingClass = result.find(c => c.min_g <= 100 && c.max_g > 100);
      expect(containingClass!.percentage).toBe(100);
    });

    it('should have correct labels matching SIZE_CLASSES', () => {
      const result = calculateSizeDistribution(100, 30, 1000);
      result.forEach((c, i) => {
        expect(c.label).toBe(SIZE_CLASSES[i].label);
      });
    });
  });

  describe('getTransferRangePercentage', () => {
    it('should return high percentage for fish at ideal transfer weight', () => {
      const pct = getTransferRangePercentage(265, 40);
      expect(pct).toBeGreaterThan(60);
    });

    it('should return low percentage for very small fish', () => {
      const pct = getTransferRangePercentage(10, 5);
      expect(pct).toBeLessThan(1);
    });

    it('should return low percentage for fish well over transfer weight', () => {
      const pct = getTransferRangePercentage(500, 30);
      expect(pct).toBeLessThan(1);
    });
  });
});

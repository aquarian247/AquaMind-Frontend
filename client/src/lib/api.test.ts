import { api } from '@/lib/api';
import { vi, afterEach } from 'vitest';
import { ApiService } from '@/api/generated';

/*
 * Restore all spies after every test to avoid cross-test pollution.
 */
afterEach(() => {
  vi.restoreAllMocks();
});

describe('API Wrapper', () => {
  describe('getDashboardKPIs', () => {
    it('returns correct KPI data when API calls succeed', async () => {
      /* Mock underlying ApiService calls */
      vi.spyOn(ApiService, 'apiV1BatchBatchesList').mockResolvedValue({
        /* minimal shape used by api.getDashboardKPIs() */
        results: [
          { status: 'ACTIVE', calculated_population_count: 12500 },
          { status: 'COMPLETED', calculated_population_count: 10800 }
        ]
      } as any);

      vi.spyOn(ApiService, 'apiV1EnvironmentalReadingsList').mockResolvedValue({
        results: [
          {
            parameter_type: 'TEMPERATURE',
            value: 13,
            reading_time: '2025-07-01T00:00:00Z'
          }
        ]
      } as any);

      // Call the API function directly
      const result = await api.getDashboardKPIs();
      
      // Verify the structure and values
      expect(result).toEqual({
        totalFish: 23300, // Sum of batch populations (12500 + 10800)
        healthRate: 50, // 1 active out of 2 batches
        avgWaterTemp: expect.any(Number),
        nextFeedingHours: 4
      });
    });
    
    it('returns fallback values when API calls fail', async () => {
      /* Force the underlying calls to reject so api.ts triggers its
       * fallback branch.
       */
      vi.spyOn(ApiService, 'apiV1BatchBatchesList').mockRejectedValue(
        new Error('Network error')
      );
      vi.spyOn(ApiService, 'apiV1EnvironmentalReadingsList').mockRejectedValue(
        new Error('Network error')
      );
      
      // Call the API function directly - should use fallback values
      const result = await api.getDashboardKPIs();
      
      // Verify fallback values are returned
      expect(result).toEqual({
        totalFish: 0,
        healthRate: 0,
        avgWaterTemp: 12.5,
        nextFeedingHours: 4
      });
    });
  });
  
  describe('getFishGrowthChart', () => {
    it('returns correctly structured chart data when API call succeeds', async () => {
      vi.spyOn(ApiService, 'apiV1BatchGrowthSamplesList').mockResolvedValue({
        results: [
          { sample_date: '2025-06-01', avg_weight_g: 100 },
          { sample_date: '2025-07-01', avg_weight_g: 150 }
        ]
      } as any);

      // Call the API function directly
      const result = await api.getFishGrowthChart();
      
      // Verify the structure
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('datasets');
      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.datasets)).toBe(true);
      expect(result.labels.length).toBeGreaterThan(0);
      expect(result.datasets.length).toBeGreaterThan(0);
      
      // Verify dataset structure
      const dataset = result.datasets[0];
      expect(dataset).toHaveProperty('label');
      expect(dataset).toHaveProperty('data');
      expect(Array.isArray(dataset.data)).toBe(true);
      expect(dataset).toHaveProperty('borderColor');
      expect(dataset).toHaveProperty('backgroundColor');
    });
    
    it('rejects with error when API call fails', async () => {
      vi.spyOn(ApiService, 'apiV1BatchGrowthSamplesList').mockRejectedValue(
        new Error('Network error')
      );
      
      // Expect the function to reject
      await expect(api.getFishGrowthChart()).rejects.toBeDefined();
    });
  });
  
  describe('getWaterQualityChart', () => {
    it('returns correctly structured chart data when API call succeeds', async () => {
      vi.spyOn(ApiService, 'apiV1EnvironmentalReadingsList').mockResolvedValue({
        results: [
          {
            parameter_type: 'TEMPERATURE',
            value: 12.5,
            reading_time: '2025-07-01T00:00:00Z'
          },
          {
            parameter_type: 'TEMPERATURE',
            value: 13,
            reading_time: '2025-07-02T00:00:00Z'
          }
        ]
      } as any);

      // Call the API function directly
      const result = await api.getWaterQualityChart();
      
      // Verify the structure
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('datasets');
      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.datasets)).toBe(true);
      expect(result.labels.length).toBeGreaterThan(0);
      expect(result.datasets.length).toBeGreaterThan(0);
      
      // Verify dataset structure
      const dataset = result.datasets[0];
      expect(dataset).toHaveProperty('label');
      expect(dataset).toHaveProperty('data');
      expect(Array.isArray(dataset.data)).toBe(true);
      expect(dataset).toHaveProperty('borderColor');
      expect(dataset).toHaveProperty('backgroundColor');
    });
    
    it('rejects with error when API call fails', async () => {
      vi.spyOn(ApiService, 'apiV1EnvironmentalReadingsList').mockRejectedValue(
        new Error('Network error')
      );
      
      // Expect the function to reject
      await expect(api.getWaterQualityChart()).rejects.toBeDefined();
    });
  });
});

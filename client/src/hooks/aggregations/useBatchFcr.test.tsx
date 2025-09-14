import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useBatchFcr,
  filterFeedingEvents,
  calculateTotalFeedKg,
  sortGrowthSamples,
  selectFcrSamples,
  calculateBiomassGain
} from './useBatchFcr';
import { ApiService } from '@/api/generated/services/ApiService';

// Mock the ApiService
vi.mock('@/api/generated/services/ApiService', () => ({
  ApiService: {
    apiV1InventoryFeedingEventsList: vi.fn(),
    apiV1BatchGrowthSamplesList: vi.fn(),
    apiV1BatchBatchesRetrieve: vi.fn(),
  },
}));

describe('useBatchFcr', () => {
  let queryClient: QueryClient;

  // Set up a new QueryClient for each test
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Reset mocks
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate FCR correctly with sufficient data', async () => {
    // Mock date range
    const dateRange = {
      from: '2025-01-01',
      to: '2025-02-01'
    };

    // Mock feeding events data
    const mockFeedingEvents = {
      results: [
        { 
          id: 1, 
          batch: 42, 
          feeding_date: '2025-01-15', 
          amount_kg: '10',
          feed_type: 'Standard',
          feed_name: 'Premium Feed'
        },
        { 
          id: 2, 
          batch: 42, 
          feeding_date: '2025-01-20', 
          amount_kg: '15',
          feed_type: 'Standard',
          feed_name: 'Premium Feed'
        },
        { 
          id: 3, 
          batch: 99, // Different batch, should be filtered out
          feeding_date: '2025-01-18', 
          amount_kg: '20',
          feed_type: 'Standard',
          feed_name: 'Premium Feed'
        },
      ],
    };

    // Mock growth samples data
    const mockGrowthSamples = {
      results: [
        {
          id: 101,
          sample_date: '2025-01-05',
          avg_weight_g: '500',
          assignment: 201,
          assignment_batch: 42
        },
        {
          id: 102,
          sample_date: '2025-01-25',
          avg_weight_g: '700',
          assignment: 201,
          assignment_batch: 42
        },
      ],
    };

    // Mock batch data
    const mockBatch = {
      id: 42,
      batch_number: 'BATCH-2025-042',
      calculated_population_count: 1000,
      status: 'ACTIVE'
    };

    // Set up mocks to return our test data
    vi.spyOn(ApiService, 'apiV1InventoryFeedingEventsList').mockResolvedValue(mockFeedingEvents);
    vi.spyOn(ApiService, 'apiV1BatchGrowthSamplesList').mockResolvedValue(mockGrowthSamples);
    vi.spyOn(ApiService, 'apiV1BatchBatchesRetrieve').mockResolvedValue(mockBatch);

    // Render the hook with our test batch ID and date range
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBatchFcr(42, dateRange), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the API was called correctly
    expect(ApiService.apiV1InventoryFeedingEventsList).toHaveBeenCalled();
    expect(ApiService.apiV1BatchGrowthSamplesList).toHaveBeenCalled();
    expect(ApiService.apiV1BatchBatchesRetrieve).toHaveBeenCalledWith(42);

    // Verify the calculated metrics
    await waitFor(() => {
      expect(result.current.data).toEqual({
        totalFeedKg: 25,  // 10 + 15
        biomassGainKg: 200, // ((700-500)/1000)*1000
        fcr: 0.125, // 25/200
        eventCount: 2,
        sampleCount: 2
      });
    });
  });

  it('should return null FCR when insufficient growth samples', async () => {
    // Mock feeding events data with valid events
    const mockFeedingEvents = {
      results: [
        { 
          id: 1, 
          batch: 42, 
          feeding_date: '2025-01-15', 
          amount_kg: '10',
          feed_type: 'Standard',
          feed_name: 'Premium Feed'
        },
      ],
    };

    // Mock growth samples data with only one sample (insufficient for FCR calculation)
    const mockGrowthSamples = {
      results: [
        {
          id: 101,
          sample_date: '2025-01-05',
          avg_weight_g: '500',
          assignment: 201,
          assignment_batch: 42
        },
        // Only one sample, need at least two to calculate growth
      ],
    };

    // Mock batch data
    const mockBatch = {
      id: 42,
      batch_number: 'BATCH-2025-042',
      calculated_population_count: 1000,
      status: 'ACTIVE'
    };

    // Set up mocks
    vi.spyOn(ApiService, 'apiV1InventoryFeedingEventsList').mockResolvedValue(mockFeedingEvents);
    vi.spyOn(ApiService, 'apiV1BatchGrowthSamplesList').mockResolvedValue(mockGrowthSamples);
    vi.spyOn(ApiService, 'apiV1BatchBatchesRetrieve').mockResolvedValue(mockBatch);

    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBatchFcr(42), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify FCR is null when insufficient samples
    await waitFor(() => {
      expect(result.current.data?.fcr).toBeNull();
      expect(result.current.data?.totalFeedKg).toBe(10);
      expect(result.current.data?.biomassGainKg).toBe(0);
      expect(result.current.data?.eventCount).toBe(1);
      expect(result.current.data?.sampleCount).toBe(1);
    });
  });

  it('should handle date range filtering correctly', async () => {
    // Mock date range that excludes some events
    const dateRange = {
      from: '2025-01-15',
      to: '2025-01-25'
    };

    // Mock feeding events with some outside the date range
    const mockFeedingEvents = {
      results: [
        { 
          id: 1, 
          batch: 42, 
          feeding_date: '2025-01-10', // Outside range, should be filtered out
          amount_kg: '5',
          feed_type: 'Standard',
          feed_name: 'Premium Feed'
        },
        { 
          id: 2, 
          batch: 42, 
          feeding_date: '2025-01-20', // Inside range
          amount_kg: '15',
          feed_type: 'Standard',
          feed_name: 'Premium Feed'
        },
        { 
          id: 3, 
          batch: 42, 
          feeding_date: '2025-01-30', // Outside range, should be filtered out
          amount_kg: '10',
          feed_type: 'Standard',
          feed_name: 'Premium Feed'
        },
      ],
    };

    // Mock growth samples with some outside the date range
    const mockGrowthSamples = {
      results: [
        {
          id: 101,
          sample_date: '2025-01-05', // Outside range but needed as baseline
          avg_weight_g: '500',
          assignment: 201,
          assignment_batch: 42
        },
        {
          id: 102,
          sample_date: '2025-01-20', // Inside range
          avg_weight_g: '700',
          assignment: 201,
          assignment_batch: 42
        },
        {
          id: 103,
          sample_date: '2025-01-30', // Outside range, should be filtered out
          avg_weight_g: '900',
          assignment: 201,
          assignment_batch: 42
        },
      ],
    };

    // Mock batch data
    const mockBatch = {
      id: 42,
      batch_number: 'BATCH-2025-042',
      calculated_population_count: 1000,
      status: 'ACTIVE'
    };

    // Set up mocks
    vi.spyOn(ApiService, 'apiV1InventoryFeedingEventsList').mockResolvedValue(mockFeedingEvents);
    vi.spyOn(ApiService, 'apiV1BatchGrowthSamplesList').mockResolvedValue(mockGrowthSamples);
    vi.spyOn(ApiService, 'apiV1BatchBatchesRetrieve').mockResolvedValue(mockBatch);

    // Render the hook with date range
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBatchFcr(42, dateRange), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify only events within date range are counted
    await waitFor(() => {
      expect(result.current.data?.totalFeedKg).toBe(15); // Only the event on 2025-01-20
      expect(result.current.data?.eventCount).toBe(1);
      // Growth samples should include the earliest (baseline) and the one within range
      expect(result.current.data?.sampleCount).toBe(2);
    });
  });

  it('should handle errors and edge cases gracefully', async () => {
    // Mock empty results
    vi.spyOn(ApiService, 'apiV1InventoryFeedingEventsList').mockResolvedValue({ results: [] });
    vi.spyOn(ApiService, 'apiV1BatchGrowthSamplesList').mockResolvedValue({ results: [] });
    vi.spyOn(ApiService, 'apiV1BatchBatchesRetrieve').mockResolvedValue({
      id: 42,
      calculated_population_count: 0
    });

    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBatchFcr(42), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify safe defaults for empty data
    await waitFor(() => {
      expect(result.current.data).toEqual({
        totalFeedKg: 0,
        biomassGainKg: 0,
        fcr: null,
        eventCount: 0,
        sampleCount: 0
      });
    });
  });

  describe('filterFeedingEvents', () => {
    it('should filter events by batch ID', () => {
      const events = [
        { id: 1, batch: 42, feeding_date: '2025-01-01' },
        { id: 2, batch: 99, feeding_date: '2025-01-02' },
        { id: 3, batch: 42, feeding_date: '2025-01-03' },
      ];

      const result = filterFeedingEvents(events, 42);

      expect(result).toHaveLength(2);
      expect(result.map(e => e.id)).toEqual([1, 3]);
    });

    it('should filter events by date range', () => {
      const events = [
        { id: 1, batch: 42, feeding_date: '2025-01-01' },
        { id: 2, batch: 42, feeding_date: '2025-01-15' },
        { id: 3, batch: 42, feeding_date: '2025-02-01' },
      ];

      const dateRange = { from: '2025-01-05', to: '2025-01-25' };
      const result = filterFeedingEvents(events, 42, dateRange);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should handle null feeding dates', () => {
      const events = [
        { id: 1, batch: 42, feeding_date: null },
        { id: 2, batch: 42, feeding_date: '2025-01-15' },
      ];

      const dateRange = { from: '2025-01-10', to: '2025-01-20' };
      const result = filterFeedingEvents(events, 42, dateRange);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });
  });

  describe('calculateTotalFeedKg', () => {
    it('should calculate total feed amount correctly', () => {
      const events = [
        { amount_kg: '10.5' },
        { amount_kg: '15.0' },
        { amount_kg: null },
        { amount_kg: '5' },
      ];

      const result = calculateTotalFeedKg(events);
      expect(result).toBe(30.5);
    });

    it('should handle empty array', () => {
      const result = calculateTotalFeedKg([]);
      expect(result).toBe(0);
    });

    it('should handle invalid amounts', () => {
      const events = [
        { amount_kg: '10' },
        { amount_kg: 'invalid' },
        { amount_kg: null },
      ];

      const result = calculateTotalFeedKg(events);
      expect(result).toBe(10);
    });
  });

  describe('sortGrowthSamples', () => {
    it('should sort samples by date ascending', () => {
      const samples = [
        { id: 1, sample_date: '2025-01-15' },
        { id: 2, sample_date: '2025-01-01' },
        { id: 3, sample_date: '2025-01-10' },
      ];

      const result = sortGrowthSamples(samples);

      expect(result.map(s => s.id)).toEqual([2, 3, 1]);
    });

    it('should handle null sample dates', () => {
      const samples = [
        { id: 1, sample_date: null },
        { id: 2, sample_date: '2025-01-01' },
      ];

      const result = sortGrowthSamples(samples);

      expect(result.map(s => s.id)).toEqual([1, 2]);
    });
  });

  describe('selectFcrSamples', () => {
    it('should return empty array for no samples', () => {
      const result = selectFcrSamples([]);
      expect(result).toEqual([]);
    });

    it('should return single sample when only one exists', () => {
      const samples = [{ id: 1, sample_date: '2025-01-01' }];
      const result = selectFcrSamples(samples);
      expect(result).toEqual([samples[0]]);
    });

    it('should select baseline and latest samples correctly', () => {
      const samples = [
        { id: 1, sample_date: '2025-01-01' },
        { id: 2, sample_date: '2025-01-10' },
        { id: 3, sample_date: '2025-01-20' },
      ];

      const result = selectFcrSamples(samples);
      expect(result.map(s => s.id)).toEqual([1, 3]); // First and last
    });

    it('should filter latest sample by date range', () => {
      const samples = [
        { id: 1, sample_date: '2025-01-01' },
        { id: 2, sample_date: '2025-01-10' },
        { id: 3, sample_date: '2025-01-25' }, // Outside range
      ];

      const dateRange = { to: '2025-01-20' };
      const result = selectFcrSamples(samples, dateRange);
      expect(result.map(s => s.id)).toEqual([1, 2]); // First and latest within range
    });

    it('should return both samples when they have different IDs', () => {
      const samples = [
        { id: 1, sample_date: '2025-01-01' },
        { id: 2, sample_date: '2025-01-01' }, // Same date as first but different ID
      ];

      const result = selectFcrSamples(samples);
      expect(result).toEqual([samples[0], samples[1]]);
    });
  });

  describe('calculateBiomassGain', () => {
    beforeEach(() => {
      vi.spyOn(ApiService, 'apiV1BatchBatchesRetrieve').mockResolvedValue({
        calculated_population_count: 1000,
      });
    });

    it('should return 0 for less than 2 samples', async () => {
      const result = await calculateBiomassGain([{ id: 1 }], 42);
      expect(result).toBe(0);
    });

    it('should calculate biomass gain correctly', async () => {
      const samples = [
        { id: 1, avg_weight_g: '500' },
        { id: 2, avg_weight_g: '700' },
      ];

      const result = await calculateBiomassGain(samples, 42);
      // ((700-500)/1000) * 1000 = 200
      expect(result).toBe(200);
    });

    it('should handle invalid weight values', async () => {
      const samples = [
        { id: 1, avg_weight_g: 'invalid' },
        { id: 2, avg_weight_g: '700' },
      ];

      const result = await calculateBiomassGain(samples, 42);
      // ((700-0)/1000) * 1000 = 700
      expect(result).toBe(700);
    });
  });
});

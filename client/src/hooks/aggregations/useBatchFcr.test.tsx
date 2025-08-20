import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBatchFcr } from './useBatchFcr';
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
});

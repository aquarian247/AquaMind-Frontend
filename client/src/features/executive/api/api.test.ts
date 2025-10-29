/**
 * Executive Dashboard API Layer - Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { ApiService } from '@/api/generated';
import {
  useExecutiveSummary,
  useFacilitySummaries,
  useLiceTrends,
} from './api';

// Mock the generated ApiService
vi.mock('@/api/generated', () => ({
  ApiService: {
    apiV1InfrastructureGeographiesSummaryRetrieve: vi.fn(),
    apiV1InfrastructureGeographiesList: vi.fn(),
    batchContainerAssignmentsSummary: vi.fn(),
    batchGeographySummary: vi.fn(),
    apiV1HealthLiceCountsSummaryRetrieve: vi.fn(),
    apiV1HealthLiceCountsTrendsRetrieve: vi.fn(),
    apiV1OperationalFcrTrendsGeographyTrendsRetrieve: vi.fn(),
  },
}));

// Helper to create QueryClient wrapper
function createQueryClientWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  
  return Wrapper;
}

describe('useExecutiveSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and aggregate executive summary for specific geography', async () => {
    // Mock the geography summary API response
    vi.mocked(ApiService.batchGeographySummary).mockResolvedValue({
      geography_id: 1,
      geography_name: 'Faroe Islands',
      period_start: '2025-09-20',
      period_end: '2025-10-20',
      total_batches: 8,
      growth_metrics: {
        total_biomass_kg: 50000,
        avg_weight_g: 125.5,
        avg_tgc: 3.2,
        avg_sgr: 3.65,
        avg_growth_rate_g_per_day: 1.57,
      },
      mortality_metrics: {
        total_count: 15000,
        total_biomass_kg: 2500,
        avg_mortality_rate_percent: 3.0,
        by_cause: [
          { cause: 'Disease', count: 8000, percentage: 53.3 },
          { cause: 'Predation', count: 5000, percentage: 33.3 },
          { cause: 'Other', count: 2000, percentage: 13.3 },
        ],
      },
      feed_metrics: {
        total_feed_kg: 35000,
        avg_fcr: 0.7,
        feed_cost_total: 42000,
      },
    } as any);

    // Mock the infrastructure summary API response
    vi.mocked(ApiService.apiV1InfrastructureGeographiesSummaryRetrieve).mockResolvedValue({
      container_count: 100,
      capacity_kg: 100000,
      active_biomass_kg: 50000,
    } as any);

    // Mock the batch summary API response
    vi.mocked(ApiService.batchContainerAssignmentsSummary).mockResolvedValue({
      active_biomass_kg: 50000,
      count: 50,
      total_population: 1000,
    } as any);

    // Mock the lice summary API response
    vi.mocked(ApiService.apiV1HealthLiceCountsSummaryRetrieve).mockResolvedValue({
      average_per_fish: 0.6,
      by_development_stage: {
        mature: 0.5,
        movable: 0.3,
      },
    } as any);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useExecutiveSummary(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.geography_id).toBe(1);
    expect(result.current.data?.geography_name).toBe('Faroe Islands');
    expect(result.current.data?.period_start).toBe('2025-09-20');
    expect(result.current.data?.period_end).toBe('2025-10-20');
    expect(result.current.data?.total_biomass_kg).toBe(50000);
    expect(result.current.data?.average_weight_g).toBe(125.5);
    expect(result.current.data?.tgc_average).toBe(3.2);
    expect(result.current.data?.sgr_average).toBe(3.65);
    expect(result.current.data?.feed_this_week_kg).toBe(35000);
    expect(result.current.data?.fcr_average).toBe(0.7);
    expect(result.current.data?.mortality_count_week).toBe(15000); // Real data from geography summary endpoint
    expect(result.current.data?.mortality_biomass_kg).toBe(2500);
    expect(result.current.data?.mortality_percentage).toBe(3.0);
    expect(result.current.data?.total_population).toBe(1000); // From batch summary mock
    expect(result.current.data?.active_batches).toBe(8);
    expect(result.current.data?.total_containers).toBe(100);
    expect(result.current.data?.capacity_utilization_percentage).toBe(50); // 50000 / 100000 * 100
    expect(result.current.data?.mature_lice_average).toBe(0.5); // From lice summary mock
    expect(result.current.data?.movable_lice_average).toBe(0.3); // From lice summary mock
    expect(result.current.data?.lice_alert_level).toBe('warning'); // Based on lice levels
  });

  it('should fetch global summary when geography is "global"', async () => {
    vi.mocked(ApiService.batchContainerAssignmentsSummary).mockResolvedValue({
      active_biomass_kg: 150000,
      count: 75,  // 75 container assignments
      total_population: 1500000,  // 1.5M fish
    } as any);

    vi.mocked(ApiService.apiV1HealthLiceCountsSummaryRetrieve).mockResolvedValue({
      average_per_fish: 0.15,
      by_development_stage: {
        mature: 0.15,
        movable: 0.3,
      },
    } as any);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useExecutiveSummary('global'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.geography_id).toBeNull();
    expect(result.current.data?.geography_name).toBe('Global');
    expect(result.current.data?.total_biomass_kg).toBe(150000);
    expect(result.current.data?.lice_alert_level).toBe('success'); // 0.15 is success
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(ApiService.batchGeographySummary).mockRejectedValue(
      new Error('API Error')
    );

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useExecutiveSummary(1), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe('API Error');
  });

  it('should handle null values from API', async () => {
    vi.mocked(ApiService.batchGeographySummary).mockResolvedValue({
      geography_id: 1,
      geography_name: 'Test Geography',
      period_start: null,
      period_end: null,
      total_batches: null,
      growth_metrics: null, // All growth metrics are null
      mortality_metrics: null, // All mortality metrics are null
      feed_metrics: null, // All feed metrics are null
    } as any);

    vi.mocked(ApiService.apiV1InfrastructureGeographiesSummaryRetrieve).mockResolvedValue({
      container_count: null,
      capacity_kg: null,
    } as any);

    vi.mocked(ApiService.batchContainerAssignmentsSummary).mockResolvedValue({
      active_biomass_kg: null,
      count: null,
      total_population: null,
    } as any);

    vi.mocked(ApiService.apiV1HealthLiceCountsSummaryRetrieve).mockResolvedValue({
      average_per_fish: null,
      by_development_stage: null,
    } as any);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useExecutiveSummary(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.total_biomass_kg).toBeNull();
    expect(result.current.data?.average_weight_g).toBeNull();
    expect(result.current.data?.tgc_average).toBeNull();
    expect(result.current.data?.sgr_average).toBeNull();
    expect(result.current.data?.feed_this_week_kg).toBeNull();
    expect(result.current.data?.fcr_average).toBeNull();
    expect(result.current.data?.mortality_count_week).toBeNull();
    expect(result.current.data?.mortality_biomass_kg).toBeNull();
    expect(result.current.data?.mortality_percentage).toBeNull();
    expect(result.current.data?.active_batches).toBeNull();
    expect(result.current.data?.total_containers).toBeNull();
    expect(result.current.data?.capacity_utilization_percentage).toBeNull();
    expect(result.current.data?.lice_alert_level).toBe('info'); // Default level
  });
});

describe('useFacilitySummaries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.skip('should fetch summaries for all facilities', async () => {
    vi.mocked(ApiService.apiV1InfrastructureGeographiesList).mockResolvedValue({
      results: [
        { id: 1, name: 'Faroe Islands' },
        { id: 2, name: 'Scotland' },
      ],
    } as any);

    vi.mocked(ApiService.batchContainerAssignmentsSummary)
      .mockResolvedValueOnce({
        active_biomass_kg: 25000,
        count: 15,  // 15 assignments
        total_population: 250000,  // 250k fish
      } as any)
      .mockResolvedValueOnce({
        active_biomass_kg: 30000,
        count: 18,  // 18 assignments
        total_population: 300000,  // 300k fish
      } as any);

    vi.mocked(ApiService.apiV1HealthLiceCountsSummaryRetrieve)
      .mockResolvedValueOnce({
        average_per_fish: 0.2,
        by_development_stage: {
          mature: 0.2,
          movable: 0.4,
        },
      } as any)
      .mockResolvedValueOnce({
        average_per_fish: 0.4,
        by_development_stage: {
          mature: 0.4,
          movable: 0.7,
        },
      } as any);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useFacilitySummaries('global'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].name).toBe('Faroe Islands');
    expect(result.current.data?.[0].biomass_kg).toBe(13711589.73); // Real data from geography summary
    expect(result.current.data?.[0].average_weight_g).toBe(633.67); // Real data from geography summary
    expect(result.current.data?.[1].name).toBe('Scotland');
    expect(result.current.data?.[1].biomass_kg).toBe(30000);
  });

  it('should return empty array when no geographies found', async () => {
    vi.mocked(ApiService.apiV1InfrastructureGeographiesList).mockResolvedValue({
      results: [],
    } as any);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useFacilitySummaries('global'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it.skip('should handle partial failures for individual facilities', async () => {
    vi.mocked(ApiService.apiV1InfrastructureGeographiesList).mockResolvedValue({
      results: [
        { id: 1, name: 'Faroe Islands' },
        { id: 2, name: 'Scotland' },
      ],
    } as any);

    vi.mocked(ApiService.batchContainerAssignmentsSummary)
      .mockResolvedValueOnce({
        active_biomass_kg: 25000,
        count: 15,
        total_population: 250000,
      } as any)
      .mockRejectedValueOnce(new Error('Fetch failed'));

    vi.mocked(ApiService.apiV1HealthLiceCountsSummaryRetrieve)
      .mockResolvedValueOnce({
        average_per_fish: 0.2,
        by_development_stage: {
          mature: 0.2,
          movable: 0.4,
        },
      } as any)
      .mockRejectedValueOnce(new Error('Fetch failed'));

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useFacilitySummaries('global'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Should still return 2 facilities, with placeholders for failed one
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].biomass_kg).toBe(13711589.73); // Real data from geography summary
    expect(result.current.data?.[1].biomass_kg).toBeNull(); // Failed facility
    expect(result.current.data?.[1].health_status).toBe('info'); // Default
  });
});

describe('useLiceTrends', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch lice trends with weekly interval', async () => {
    vi.mocked(ApiService.apiV1HealthLiceCountsTrendsRetrieve).mockResolvedValue({
      trends: [
        {
          period: '2025-10-01',
          average_per_fish: 0.2,
          total_counts: 10000,
          fish_sampled: 500,
        },
        {
          period: '2025-10-08',
          average_per_fish: 0.25,
          total_counts: 12500,
          fish_sampled: 600,
        },
      ],
    } as any);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useLiceTrends(1, 'weekly'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].date).toBe('2025-10-01');
    expect(result.current.data?.[0].mature_lice_average).toBe(0.2);
    expect(result.current.data?.[1].date).toBe('2025-10-08');
  });

  it('should return empty array when no trends available', async () => {
    vi.mocked(ApiService.apiV1HealthLiceCountsTrendsRetrieve).mockResolvedValue({
      trends: [],
    } as any);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useLiceTrends('global', 'daily'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('should fetch trends for different intervals', async () => {
    vi.mocked(ApiService.apiV1HealthLiceCountsTrendsRetrieve).mockResolvedValue({
      trends: [{ period: '2025-10', average_per_fish: 0.3, total_counts: 20000, fish_sampled: 1000 }],
    } as any);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useLiceTrends(1, 'monthly'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // API uses positional parameters, not an object
    expect(ApiService.apiV1HealthLiceCountsTrendsRetrieve).toHaveBeenCalledWith(
      undefined, // area
      expect.any(String), // endDate
      1, // geography
      'monthly', // interval
      expect.any(String) // startDate
    );
  });
});


import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStationKpi } from './useStationKpi';
import { ApiService } from '@/api/generated/services/ApiService';

// Mock the ApiService
vi.mock('@/api/generated/services/ApiService', () => ({
  ApiService: {
    apiV1InfrastructureHallsList: vi.fn(),
    apiV1InfrastructureContainersList: vi.fn(),
    apiV1BatchContainerAssignmentsList: vi.fn(),
  },
}));

describe('useStationKpi', () => {
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

  it('should calculate KPIs correctly for a station', async () => {
    // Mock halls data
    const mockHalls = {
      results: [
        { id: 11, freshwater_station: 5, name: 'Hall A' },
        { id: 12, freshwater_station: 5, name: 'Hall B' },
      ],
    };

    // Mock container data
    const mockContainers = {
      results: [
        { id: 1, hall: 11, name: 'Container 1' },
        { id: 2, hall: 12, name: 'Container 2' },
        { id: 3, hall: 99, name: 'Container 3' }, // Different hall/station, should be filtered out
      ],
    };

    // Mock assignment data
    const mockAssignments = {
      results: [
        { id: 101, container_id: 1, biomass_kg: '100', population_count: 200 },
        { id: 102, container_id: 2, biomass_kg: '150', population_count: 250 },
        { id: 103, container_id: 3, biomass_kg: '200', population_count: 300 }, // Different container, should be filtered out
      ],
    };

    // Set up mocks to return our test data
    vi.spyOn(ApiService, 'apiV1InfrastructureHallsList').mockResolvedValue(mockHalls);
    vi.spyOn(ApiService, 'apiV1InfrastructureContainersList').mockResolvedValue(mockContainers);
    vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList').mockResolvedValue(mockAssignments);

    // Render the hook with our test station ID
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useStationKpi(5), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the API was called with the correct parameters
    expect(ApiService.apiV1InfrastructureHallsList).toHaveBeenCalledWith({ freshwater_station: 5 });
    expect(ApiService.apiV1InfrastructureContainersList).toHaveBeenCalled();
    expect(ApiService.apiV1BatchContainerAssignmentsList).toHaveBeenCalledWith(
      undefined, undefined, undefined, true
    );

    // Verify the calculated metrics
    await waitFor(() => {
      expect(result.current.data).toEqual({
        totalBiomassKg: 250, // 100 + 150
        populationCount: 450, // 200 + 250
        averageWeightKg: 250 / 450, // totalBiomass / populationCount
        containerCount: 2, // Only containers in halls for station 5
      });
    });
  });

  it('should handle empty hall results', async () => {
    // Mock empty hall data
    const mockHalls = {
      results: [],
    };

    // Mock empty container data
    const mockContainers = {
      results: [],
    };

    // Mock empty assignment data
    const mockAssignments = {
      results: [],
    };

    // Set up mocks
    vi.spyOn(ApiService, 'apiV1InfrastructureHallsList').mockResolvedValue(mockHalls);
    vi.spyOn(ApiService, 'apiV1InfrastructureContainersList').mockResolvedValue(mockContainers);
    vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList').mockResolvedValue(mockAssignments);

    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useStationKpi(5), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the calculated metrics for empty data
    await waitFor(() => {
      expect(result.current.data).toEqual({
        totalBiomassKg: 0,
        populationCount: 0,
        averageWeightKg: 0,
        containerCount: 0,
      });
    });
  });

  it('should handle null or undefined values in assignments', async () => {
    // Mock halls data
    const mockHalls = {
      results: [
        { id: 11, freshwater_station: 5, name: 'Hall A' },
      ],
    };

    // Mock container data
    const mockContainers = {
      results: [
        { id: 1, hall: 11, name: 'Container 1' },
      ],
    };

    // Mock assignment data with null/undefined values
    const mockAssignments = {
      results: [
        { id: 101, container_id: 1, biomass_kg: null, population_count: 200 },
        { id: 102, container_id: 1, biomass_kg: '150', population_count: undefined },
      ],
    };

    // Set up mocks
    vi.spyOn(ApiService, 'apiV1InfrastructureHallsList').mockResolvedValue(mockHalls);
    vi.spyOn(ApiService, 'apiV1InfrastructureContainersList').mockResolvedValue(mockContainers);
    vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList').mockResolvedValue(mockAssignments);

    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useStationKpi(5), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the calculated metrics handle null/undefined values safely
    await waitFor(() => {
      expect(result.current.data).toEqual({
        totalBiomassKg: 150, // Only the valid biomass_kg value
        populationCount: 200, // Only the valid population_count value
        averageWeightKg: 150 / 200, // totalBiomass / populationCount
        containerCount: 1,
      });
    });
  });
});

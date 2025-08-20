import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAreaKpi } from './useAreaKpi';
import { ApiService } from '@/api/generated/services/ApiService';

// Mock the ApiService
vi.mock('@/api/generated/services/ApiService', () => ({
  ApiService: {
    apiV1InfrastructureContainersList: vi.fn(),
    apiV1BatchContainerAssignmentsList: vi.fn(),
  },
}));

describe('useAreaKpi', () => {
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

  it('should calculate KPIs correctly for an area', async () => {
    // Mock container data
    const mockContainers = {
      results: [
        { id: 1, area: 10, name: 'Container 1' },
        { id: 2, area: 10, name: 'Container 2' },
        // Container from a different area intentionally omitted to ensure
        // the hook only receives containers belonging to area 10
      ],
    };

    // Mock assignment data
    const mockAssignments = {
      results: [
        { id: 101, container_id: 1, biomass_kg: '100', population_count: 200 },
        { id: 102, container_id: 2, biomass_kg: '150', population_count: 250 },
        { id: 103, container_id: 3, biomass_kg: '200', population_count: 300 }, // Different area, should be filtered out
      ],
    };

    // Set up mocks to return our test data
    vi.spyOn(ApiService, 'apiV1InfrastructureContainersList').mockResolvedValue(mockContainers);
    vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList').mockResolvedValue(mockAssignments);

    // Render the hook with our test area ID
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAreaKpi(10), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the API was called with the correct parameters
    expect(ApiService.apiV1InfrastructureContainersList).toHaveBeenCalledWith({ area: 10 });
    expect(ApiService.apiV1BatchContainerAssignmentsList).toHaveBeenCalledWith(
      undefined, undefined, undefined, true
    );

    // Verify the calculated metrics
    await waitFor(() => {
      expect(result.current.data).toEqual({
        totalBiomassKg: 250, // 100 + 150
        populationCount: 450, // 200 + 250
        averageWeightKg: 250 / 450, // totalBiomass / populationCount
        containerCount: 2, // Only containers in area 10
      });
    });
  });

  it('should handle empty container results', async () => {
    // Mock empty container data
    const mockContainers = {
      results: [],
    };

    // Mock empty assignment data
    const mockAssignments = {
      results: [],
    };

    // Set up mocks
    vi.spyOn(ApiService, 'apiV1InfrastructureContainersList').mockResolvedValue(mockContainers);
    vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList').mockResolvedValue(mockAssignments);

    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAreaKpi(10), { wrapper });

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
    // Mock container data
    const mockContainers = {
      results: [
        { id: 1, area: 10, name: 'Container 1' },
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
    vi.spyOn(ApiService, 'apiV1InfrastructureContainersList').mockResolvedValue(mockContainers);
    vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList').mockResolvedValue(mockAssignments);

    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAreaKpi(10), { wrapper });

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

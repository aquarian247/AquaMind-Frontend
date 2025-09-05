import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAreaKpi } from './useAreaKpi';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

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
    vi.clearAllMocks();
    fetchMock.mockReset();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    localStorageMock.removeItem.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate KPIs correctly for an area', async () => {
    // Mock localStorage to return auth token
    localStorageMock.getItem.mockReturnValue('mock-token');

    // Mock fetch responses
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          count: 2,
          next: null,
          previous: null,
          results: [
            { id: 1, area: 10, name: 'Container 1', geography: 1, station: 1, hall: null, container_type: 1, container_type_name: 'PEN' },
            { id: 2, area: 10, name: 'Container 2', geography: 1, station: 1, hall: null, container_type: 1, container_type_name: 'PEN' },
          ],
        }),
      })
    ).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          count: 2,
          next: null,
          previous: null,
          results: [
            { id: 101, container: 1, container_id: 1, biomass_kg: '100', population_count: 200 },
            { id: 102, container: 2, container_id: 2, biomass_kg: '150', population_count: 250 },
          ],
        }),
      })
    );

    // Render the hook with our test area ID
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAreaKpi(10), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the fetch calls were made correctly
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/v1/infrastructure/containers/?area=10&page_size=100',
      {
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      }
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/v1/batch/container-assignments/?page_size=500',
      {
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      }
    );

    // Verify the calculated metrics
    await waitFor(() => {
      expect(result.current.data).toEqual({
        totalBiomassKg: 250, // 100 + 150
        populationCount: 450, // 200 + 250
        averageWeightKg: 250 / 450, // totalBiomass / populationCount
        containerCount: 2, // Only containers in area 10
        hasData: true,
      });
    });
  });

  it('should handle empty container results', async () => {
    // Mock localStorage to return auth token
    localStorageMock.getItem.mockReturnValue('mock-token');

    // Mock fetch responses for empty data
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          count: 0,
          next: null,
          previous: null,
          results: [],
        }),
      })
    ).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          count: 0,
          next: null,
          previous: null,
          results: [],
        }),
      })
    );

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
        hasData: false,
      });
    });
  });

  it('should handle null or undefined values in assignments', async () => {
    // Mock localStorage to return auth token
    localStorageMock.getItem.mockReturnValue('mock-token');

    // Mock fetch responses with null/undefined values
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          count: 1,
          next: null,
          previous: null,
          results: [
            { id: 1, area: 10, name: 'Container 1', geography: 1, station: 1, hall: null, container_type: 1, container_type_name: 'PEN' },
          ],
        }),
      })
    ).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          count: 2,
          next: null,
          previous: null,
          results: [
            { id: 101, container: 1, container_id: 1, biomass_kg: null, population_count: 200 },
            { id: 102, container: 1, container_id: 1, biomass_kg: '150', population_count: undefined },
          ],
        }),
      })
    );

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
        hasData: true,
      });
    });
  });

  it('should handle missing auth token', async () => {
    // Mock localStorage to return null (no auth token)
    localStorageMock.getItem.mockReturnValue(null);

    // Render the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAreaKpi(10), { wrapper });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the hook returns default values
    await waitFor(() => {
      expect(result.current.data).toEqual({
        totalBiomassKg: 0,
        populationCount: 0,
        averageWeightKg: 0,
        containerCount: 0,
        hasData: false,
      });
    });
  });
});

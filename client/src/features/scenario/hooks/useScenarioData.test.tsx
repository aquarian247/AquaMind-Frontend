/**
 * Tests for useScenarioData hook
 * 
 * TASK 7: Server-Side Aggregation Testing
 * - Tests server-side summary stats integration
 * - Tests fallback to client-side calculation
 * - Tests honest fallbacks when data is unavailable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useScenarioData } from './useScenarioData';
import { ApiService } from '@/api/generated';
import type { ReactNode } from 'react';

// Mock the API service
vi.mock('@/api/generated', () => ({
  ApiService: {
    apiV1ScenarioTemperatureProfilesList: vi.fn(),
    apiV1ScenarioTgcModelsList: vi.fn(),
    apiV1ScenarioFcrModelsList: vi.fn(),
    apiV1ScenarioMortalityModelsList: vi.fn(),
    apiV1ScenarioBiologicalConstraintsList: vi.fn(),
    apiV1ScenarioScenariosList: vi.fn(),
    apiV1ScenarioScenariosSummaryStatsRetrieve: vi.fn(),
  },
}));

describe('useScenarioData', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch and compute KPIs from scenarios list (client-side fallback)', async () => {
    // Mock API responses
    vi.mocked(ApiService.apiV1ScenarioTemperatureProfilesList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioTgcModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioFcrModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioMortalityModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioBiologicalConstraintsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosSummaryStatsRetrieve).mockResolvedValue({} as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosList).mockResolvedValue({
      count: 3,
      results: [
        { scenario_id: 1, status: 'running', duration_days: 180 },
        { scenario_id: 2, status: 'completed', duration_days: 200 },
        { scenario_id: 3, status: 'completed', duration_days: 220 },
      ],
    } as any);

    const { result } = renderHook(() => useScenarioData('', 'all'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify KPIs are computed correctly
    expect(result.current.kpis).toEqual({
      totalActiveScenarios: 3,
      scenariosInProgress: 1,
      completedProjections: 2,
      averageProjectionDuration: 200, // (180 + 200 + 220) / 3
    });
  });

  it('should use server-side summary stats when available', async () => {
    // Mock API responses
    vi.mocked(ApiService.apiV1ScenarioTemperatureProfilesList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioTgcModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioFcrModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioMortalityModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioBiologicalConstraintsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosList).mockResolvedValue({ results: [] } as any);
    
    // Mock summary stats endpoint with summary fields
    vi.mocked(ApiService.apiV1ScenarioScenariosSummaryStatsRetrieve).mockResolvedValue({
      totalActiveScenarios: 10,
      scenariosInProgress: 3,
      completedProjections: 7,
      averageProjectionDuration: 195.5,
    } as any);

    const { result } = renderHook(() => useScenarioData('', 'all'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify KPIs use server-side values
    expect(result.current.kpis).toEqual({
      totalActiveScenarios: 10,
      scenariosInProgress: 3,
      completedProjections: 7,
      averageProjectionDuration: 195.5,
    });
  });

  it('should return zero KPIs when no scenarios exist', async () => {
    // Mock API responses with empty data
    vi.mocked(ApiService.apiV1ScenarioTemperatureProfilesList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioTgcModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioFcrModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioMortalityModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioBiologicalConstraintsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosSummaryStatsRetrieve).mockResolvedValue({} as any);

    const { result } = renderHook(() => useScenarioData('', 'all'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify honest fallback (zeros, not N/A)
    expect(result.current.kpis).toEqual({
      totalActiveScenarios: 0,
      scenariosInProgress: 0,
      completedProjections: 0,
      averageProjectionDuration: 0,
    });
  });

  it('should filter scenarios by search term', async () => {
    // Mock API responses
    vi.mocked(ApiService.apiV1ScenarioTemperatureProfilesList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioTgcModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioFcrModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioMortalityModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioBiologicalConstraintsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosSummaryStatsRetrieve).mockResolvedValue({} as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosList).mockResolvedValue({
      results: [
        { scenario_id: 1, name: 'Scotland Scenario', status: 'running', duration_days: 180 },
      ],
    } as any);

    const { result } = renderHook(() => useScenarioData('Scotland', 'all'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify API was called with search term
    expect(ApiService.apiV1ScenarioScenariosList).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      'Scotland',
      undefined
    );
  });

  it('should filter scenarios by status', async () => {
    // Mock API responses
    vi.mocked(ApiService.apiV1ScenarioTemperatureProfilesList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioTgcModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioFcrModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioMortalityModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioBiologicalConstraintsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosSummaryStatsRetrieve).mockResolvedValue({} as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosList).mockResolvedValue({
      results: [
        { scenario_id: 1, status: 'completed', duration_days: 180 },
      ],
    } as any);

    const { result } = renderHook(() => useScenarioData('', 'completed'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify API was called with status filter
    expect(ApiService.apiV1ScenarioScenariosList).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      'completed'
    );
  });

  it('should handle API errors gracefully', async () => {
    // Mock API errors
    vi.mocked(ApiService.apiV1ScenarioTemperatureProfilesList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioTgcModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioFcrModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioMortalityModelsList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioBiologicalConstraintsList).mockRejectedValue(new Error('API error'));
    vi.mocked(ApiService.apiV1ScenarioScenariosList).mockResolvedValue({ results: [] } as any);
    vi.mocked(ApiService.apiV1ScenarioScenariosSummaryStatsRetrieve).mockResolvedValue({} as any);

    const { result } = renderHook(() => useScenarioData('', 'all'), { wrapper });

    await waitFor(() => {
      // Should still return with zero KPIs despite error
      expect(result.current.kpis).toEqual({
        totalActiveScenarios: 0,
        scenariosInProgress: 0,
        completedProjections: 0,
        averageProjectionDuration: 0,
      });
    });
  });
});


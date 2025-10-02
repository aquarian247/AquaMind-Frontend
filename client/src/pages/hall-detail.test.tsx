import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HallDetail from './hall-detail';
import { ApiService } from '@/api/generated';

// Mock wouter
vi.mock('wouter', () => ({
  useLocation: () => ['/halls/1', vi.fn()],
}));

// Mock the ApiService
vi.mock('@/api/generated', () => ({
  ApiService: {
    apiV1InfrastructureHallsRetrieve: vi.fn(),
    apiV1InfrastructureContainersList: vi.fn(),
    apiV1InfrastructureHallsSummaryRetrieve: vi.fn(),
  },
}));

// Mock the infrastructure API hook
vi.mock('@/features/infrastructure/api', () => ({
  useHallSummary: vi.fn()
}));

import { useHallSummary } from '@/features/infrastructure/api';

describe('HallDetail', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 }
      }
    });
    
    vi.clearAllMocks();
  });

  const renderHallDetail = (hallId: string = '1') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <HallDetail params={{ id: hallId }} />
      </QueryClientProvider>
    );
  };

  describe('Server-Side Aggregation', () => {
    it('should display server-side aggregated KPIs', async () => {
      // Mock hall summary with aggregated data
      vi.mocked(useHallSummary).mockReturnValue({
        data: {
          id: 1,
          name: 'Hall Alpha',
          freshwater_station: 5,
          freshwater_station_name: 'Station Omega',
          container_count: 12,
          active_biomass_kg: 5432.5,
          population_count: 25000,
          avg_weight_kg: 0.217,
        },
        isLoading: false,
        error: null,
        isError: false,
      } as any);

      // Mock hall metadata
      vi.mocked(ApiService.apiV1InfrastructureHallsRetrieve).mockResolvedValue({
        id: 1,
        name: 'Hall Alpha',
        freshwater_station: 5,
        freshwater_station_name: 'Station Omega'
      } as any);

      // Mock containers list
      vi.mocked(ApiService.apiV1InfrastructureContainersList).mockResolvedValue({
        results: []
      } as any);

      renderHallDetail();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Hall Alpha')).toBeInTheDocument();
      });

      // Verify KPI cards display aggregated data (with thousand separators)
      await waitFor(() => {
        // Container count
        expect(screen.getByText('12')).toBeInTheDocument();

        // Biomass (with thousand separator)
        expect(screen.getByText('5,432.50 kg')).toBeInTheDocument();

        // Population (with thousand separator)
        expect(screen.getByText('25,000')).toBeInTheDocument();

        // Average weight
        expect(screen.getByText('0.22 kg')).toBeInTheDocument();
      });
    });

    it('should display "N/A" for missing KPI data', async () => {
      // Mock hall summary with some missing data
      vi.mocked(useHallSummary).mockReturnValue({
        data: {
          id: 1,
          name: 'Hall Beta',
          freshwater_station: 5,
          container_count: 8,
          // Missing biomass, population, and avg_weight
        },
        isLoading: false,
        error: null,
        isError: false,
      } as any);

      // Mock hall metadata
      vi.mocked(ApiService.apiV1InfrastructureHallsRetrieve).mockResolvedValue({
        id: 1,
        name: 'Hall Beta',
        freshwater_station: 5
      } as any);

      // Mock containers list
      vi.mocked(ApiService.apiV1InfrastructureContainersList).mockResolvedValue({
        results: []
      } as any);

      renderHallDetail();

      await waitFor(() => {
        expect(screen.getByText('Hall Beta')).toBeInTheDocument();
      });

      // Verify N/A displayed for missing data
      await waitFor(() => {
        const naTexts = screen.getAllByText('N/A');
        expect(naTexts.length).toBeGreaterThanOrEqual(3); // biomass, population, avg weight
      });

      // Container count should still be displayed
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should display loading state', () => {
      // Mock hall summary loading
      vi.mocked(useHallSummary).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isError: false,
      } as any);

      renderHallDetail();

      // Should show loading skeletons
      const skeletons = screen.getAllByRole('generic', { hidden: true })
        .filter(el => el.className.includes('animate-pulse'));
      
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});

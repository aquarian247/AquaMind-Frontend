/**
 * StrategicTab Component - Tests
 * 
 * Tests for strategic planning tab including:
 * - Capacity utilization KPIs
 * - 3-tier harvest forecast from Live Forward Projections
 * 
 * Issue: Live Forward Projection Feature
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { StrategicTab } from './StrategicTab';
import * as api from '../api/api';

// Mock the API hooks
vi.mock('../api/api', () => ({
  useExecutiveSummary: vi.fn(),
  useTieredHarvestForecast: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  
  return Wrapper;
}

// Mock tiered forecast data
const mockTieredForecast = {
  summary: {
    planned_count: 5,
    projected_count: 12,
    needs_attention_count: 3,
  },
  forecasts: [
    {
      tier: 'PLANNED' as const,
      batch_id: 1,
      batch_number: 'BATCH-001',
      container_id: 1,
      container_name: 'Pen-A1',
      current_weight_g: 4500,
      planned_date: '2025-03-15',
      projected_date: '2025-03-18',
      days_to_harvest: 90,
      variance_days: 3,
      confidence: 0.85,
      computed_date: '2025-01-15',
      source: 'PlannedActivity',
    },
    {
      tier: 'NEEDS_PLANNING' as const,
      batch_id: 2,
      batch_number: 'BATCH-002',
      container_id: 2,
      container_name: 'Pen-B2',
      current_weight_g: 4200,
      planned_date: null,
      projected_date: '2025-02-10',
      days_to_harvest: 25,
      variance_days: null,
      confidence: 0.78,
      computed_date: '2025-01-15',
      source: 'LiveForwardProjection',
    },
  ],
};

describe('StrategicTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for tiered forecast
    vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as any);
  });

  it('should render capacity utilization KPIs', () => {
    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: {
        capacity_utilization_percentage: 87.5,
        total_containers: 300,
        active_batches: 75,
        total_biomass_kg: 150000,
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<StrategicTab geography="global" />, { wrapper });

    expect(screen.getByText('Overall Capacity')).toBeInTheDocument();
    expect(screen.getByText('Active Batches')).toBeInTheDocument();
    expect(screen.getByText('Total Biomass')).toBeInTheDocument();
    expect(screen.getByText(/87.5 %/)).toBeInTheDocument();
  });

  it('should render capacity breakdown card', () => {
    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: {
        capacity_utilization_percentage: 87.5,
        total_containers: 300,
        active_batches: 75,
        total_biomass_kg: 150000,
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<StrategicTab geography="global" />, { wrapper });

    expect(screen.getByText('Capacity by Facility Type')).toBeInTheDocument();
    expect(screen.getByText('Sea Farms')).toBeInTheDocument();
    expect(screen.getByText('Freshwater Stations')).toBeInTheDocument();
    expect(screen.getByText('Hatcheries')).toBeInTheDocument();
  });

  it('should render harvest forecast section with scenario button', () => {
    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: {
        capacity_utilization_percentage: 87.5,
        total_containers: 300,
        active_batches: 75,
        total_biomass_kg: 150000,
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<StrategicTab geography="global" />, { wrapper });

    expect(screen.getByText('Harvest Forecast')).toBeInTheDocument();
    expect(screen.getByText('Open Scenario Planner')).toBeInTheDocument();
  });

  it('should call onNavigateToScenario when button clicked', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: {
        capacity_utilization_percentage: 87.5,
        total_containers: 300,
        active_batches: 75,
        total_biomass_kg: 150000,
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<StrategicTab geography="global" onNavigateToScenario={onNavigate} />, { wrapper });

    const scenarioButton = screen.getByText('Open Scenario Planner');
    await user.click(scenarioButton);

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('should render market timing placeholder', () => {
    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: {
        capacity_utilization_percentage: 87.5,
        total_containers: 300,
        active_batches: 75,
        total_biomass_kg: 150000,
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<StrategicTab geography="global" />, { wrapper });

    expect(screen.getByText('Market Timing Indicators')).toBeInTheDocument();
    expect(screen.getByText(/Market timing analysis coming soon/)).toBeInTheDocument();
  });

  // =========================================================================
  // Live Forward Projection - Tiered Harvest Forecast Tests
  // =========================================================================

  describe('Tiered Harvest Forecast', () => {
    beforeEach(() => {
      vi.mocked(api.useExecutiveSummary).mockReturnValue({
        data: {
          capacity_utilization_percentage: 87.5,
          total_containers: 300,
          active_batches: 75,
          total_biomass_kg: 150000,
        },
        isLoading: false,
      } as any);
    });

    it('should render tier explanation panel', () => {
      vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
        data: mockTieredForecast,
        isLoading: false,
        error: null,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('Tier 1: Planned')).toBeInTheDocument();
      expect(screen.getByText('Tier 2: Projected')).toBeInTheDocument();
      expect(screen.getByText('Tier 3: Needs Planning')).toBeInTheDocument();
    });

    it('should render summary counts from forecast data', () => {
      vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
        data: mockTieredForecast,
        isLoading: false,
        error: null,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Check summary cards show correct counts
      expect(screen.getByText('5')).toBeInTheDocument(); // planned_count
      expect(screen.getByText('12')).toBeInTheDocument(); // projected_count
      expect(screen.getByText('3')).toBeInTheDocument(); // needs_attention_count
    });

    it('should render forecast items with tier badges', () => {
      vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
        data: mockTieredForecast,
        isLoading: false,
        error: null,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Check batch numbers are displayed
      expect(screen.getByText('BATCH-001')).toBeInTheDocument();
      expect(screen.getByText('BATCH-002')).toBeInTheDocument();
      
      // Check container names
      expect(screen.getByText('Pen-A1')).toBeInTheDocument();
      expect(screen.getByText('Pen-B2')).toBeInTheDocument();
    });

    it('should show loading state while fetching forecast', () => {
      vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Loading spinner should be visible in the card header
      // The Loader2 component shows during loading
      expect(screen.getByText('Harvest Forecast')).toBeInTheDocument();
    });

    it('should show error state when forecast fetch fails', () => {
      vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText(/Failed to load forecast data/)).toBeInTheDocument();
    });

    it('should show empty state when no forecasts available', () => {
      vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
        data: { summary: { planned_count: 0, projected_count: 0, needs_attention_count: 0 }, forecasts: [] },
        isLoading: false,
        error: null,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText(/No forecast data available/)).toBeInTheDocument();
    });

    it('should display PLANNED tier with green badge', () => {
      vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
        data: mockTieredForecast,
        isLoading: false,
        error: null,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Find the PLANNED badge
      const plannedBadge = screen.getByText('PLANNED');
      expect(plannedBadge).toBeInTheDocument();
      // Badge should have green styling (bg-green-500)
      expect(plannedBadge.className).toContain('green');
    });

    it('should display NEEDS_PLANNING tier with amber badge', () => {
      vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
        data: mockTieredForecast,
        isLoading: false,
        error: null,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Find the NEEDS_PLANNING badge (displayed as "NEEDS PLANNING")
      const needsPlanningBadge = screen.getByText('NEEDS PLANNING');
      expect(needsPlanningBadge).toBeInTheDocument();
      // Badge should have amber styling
      expect(needsPlanningBadge.className).toContain('amber');
    });

    it('should show days to harvest when available', () => {
      vi.mocked(api.useTieredHarvestForecast).mockReturnValue({
        data: mockTieredForecast,
        isLoading: false,
        error: null,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Check days are displayed
      expect(screen.getByText(/90 days/)).toBeInTheDocument();
      expect(screen.getByText(/25 days/)).toBeInTheDocument();
    });
  });
});


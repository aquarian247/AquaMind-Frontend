/**
 * OverviewTab Component - Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { OverviewTab } from './OverviewTab';
import * as api from '../api/api';

// Mock the API hooks
vi.mock('../api/api', () => ({
  useExecutiveSummary: vi.fn(),
  useFacilitySummaries: vi.fn(),
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

describe('OverviewTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    vi.mocked(api.useFacilitySummaries).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    const wrapper = createWrapper();
    render(<OverviewTab geography="global" />, { wrapper });

    // Should show loading skeletons
    expect(screen.getByText('Strategic KPIs')).toBeInTheDocument();
    expect(screen.getByText('Facility Overview')).toBeInTheDocument();
  });

  it('should render 12 KPI cards with summary data', () => {
    const mockSummary = {
      geography_id: null,
      geography_name: 'Global',
      period_start: '2025-10-11',
      period_end: '2025-10-18',
      total_biomass_kg: 150000,
      total_population: 1500000,
      average_weight_g: 100,
      tgc_average: 3.2,
      sgr_average: 1.5,
      feed_this_week_kg: 50000,
      mortality_count_week: 500,
      mortality_biomass_kg: 50,
      mortality_percentage: 0.5,
      mature_lice_average: 0.15,
      movable_lice_average: 0.35,
      lice_alert_level: 'success' as const,
      total_containers: 300,
      active_batches: 75,
      capacity_utilization_percentage: 90,
      released_from_freshwater_week: 50000,
    };

    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: mockSummary,
      isLoading: false,
    } as any);

    vi.mocked(api.useFacilitySummaries).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<OverviewTab geography="global" />, { wrapper });

    // Check that KPI cards are rendered
    expect(screen.getByText('Total Biomass')).toBeInTheDocument();
    expect(screen.getByText('Average Weight')).toBeInTheDocument();
    expect(screen.getByText('TGC')).toBeInTheDocument();
    expect(screen.getByText('Mortality Count')).toBeInTheDocument();
    expect(screen.getByText('Mature Lice')).toBeInTheDocument();
    expect(screen.getByText('Capacity Utilization')).toBeInTheDocument();

    // Check some KPI values
    expect(screen.getByText(/150,000 kg/)).toBeInTheDocument();
    expect(screen.getByText(/100 g/)).toBeInTheDocument();
    expect(screen.getByText(/90 %/)).toBeInTheDocument();
  });

  it('should render N/A for null KPI values', () => {
    const mockSummary = {
      geography_id: null,
      geography_name: 'Global',
      period_start: '2025-10-11',
      period_end: '2025-10-18',
      total_biomass_kg: null,
      total_population: null,
      average_weight_g: null,
      tgc_average: null,
      sgr_average: null,
      feed_this_week_kg: null,
      mortality_count_week: null,
      mortality_biomass_kg: null,
      mortality_percentage: null,
      mature_lice_average: null,
      movable_lice_average: null,
      lice_alert_level: 'info' as const,
      total_containers: null,
      active_batches: null,
      capacity_utilization_percentage: null,
      released_from_freshwater_week: null,
    };

    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: mockSummary,
      isLoading: false,
    } as any);

    vi.mocked(api.useFacilitySummaries).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<OverviewTab geography="global" />, { wrapper });

    // All values should show N/A (honest fallbacks)
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(5); // Multiple N/A values
  });

  it('should render facility list table', () => {
    const mockSummary = {
      geography_id: null,
      geography_name: 'Global',
      period_start: '2025-10-11',
      period_end: '2025-10-18',
      total_biomass_kg: 100000,
      total_population: 1000000,
      average_weight_g: 100,
      tgc_average: null,
      sgr_average: null,
      feed_this_week_kg: null,
      mortality_count_week: null,
      mortality_biomass_kg: null,
      mortality_percentage: null,
      mature_lice_average: null,
      movable_lice_average: null,
      lice_alert_level: 'info' as const,
      total_containers: null,
      active_batches: null,
      capacity_utilization_percentage: null,
      released_from_freshwater_week: null,
    };

    const mockFacilities = [
      {
        id: 1,
        name: 'Test Farm 1',
        type: 'sea_farm' as const,
        geography_id: 1,
        geography_name: 'Faroe Islands',
        biomass_kg: 50000,
        average_weight_g: 120,
        tgc: 3.1,
        fcr: 1.15,
        mortality_percentage: 0.8,
        mature_lice_average: 0.2,
        lice_alert_level: 'success' as const,
        active_containers: 45,
        capacity_utilization_percentage: 90,
        health_status: 'success' as const,
        last_updated: '2025-10-18T10:00:00Z',
      },
    ];

    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: mockSummary,
      isLoading: false,
    } as any);

    vi.mocked(api.useFacilitySummaries).mockReturnValue({
      data: mockFacilities,
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<OverviewTab geography="global" />, { wrapper });

    // Check table headers (multiple "Biomass" texts exist - one in KPI, one in table)
    expect(screen.getByText('Facility')).toBeInTheDocument();
    expect(screen.getByText('Biomass (kg)')).toBeInTheDocument();
    expect(screen.getByText('Lice Status')).toBeInTheDocument();

    // Check facility data
    expect(screen.getByText('Test Farm 1')).toBeInTheDocument();
    expect(screen.getByText('Faroe Islands')).toBeInTheDocument();
    expect(screen.getByText(/50,000 kg/)).toBeInTheDocument();
  });

  it('should display empty state when no facilities', () => {
    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    vi.mocked(api.useFacilitySummaries).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<OverviewTab geography="global" />, { wrapper });

    expect(screen.getByText(/No facilities available/)).toBeInTheDocument();
  });
});


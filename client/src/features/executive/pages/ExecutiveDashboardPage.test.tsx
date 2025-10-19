/**
 * ExecutiveDashboardPage - Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ExecutiveDashboardPage from './ExecutiveDashboardPage';
import * as api from '../api/api';
import { ApiService } from '@/api/generated';

// Mock all API hooks
vi.mock('../api/api', () => ({
  useExecutiveSummary: vi.fn(),
  useFacilitySummaries: vi.fn(),
  useFinancialSummary: vi.fn(),
  useMarketPrices: vi.fn(),
}));

// Mock ApiService
vi.mock('@/api/generated', () => ({
  ApiService: {
    apiV1InfrastructureGeographiesList: vi.fn(),
  },
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

describe('ExecutiveDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock geographies list
    vi.mocked(ApiService.apiV1InfrastructureGeographiesList).mockResolvedValue({
      results: [
        { id: 1, name: 'Faroe Islands' },
        { id: 2, name: 'Scotland' },
      ],
    } as any);

    // Mock executive summary (all fields to match ExecutiveSummary type)
    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: {
        geography_id: null,
        geography_name: 'Global',
        period_start: '2025-10-11',
        period_end: '2025-10-18',
        total_biomass_kg: 150000,
        total_population: 1500000,
        average_weight_g: 100,
        tgc_average: 3.0,
        sgr_average: 1.5,
        feed_this_week_kg: 5000,
        fcr_average: 1.15,
        mortality_count_week: 100,
        mortality_biomass_kg: 10,
        mortality_percentage: 0.5,
        mature_lice_average: 0.2,
        movable_lice_average: 0.4,
        lice_alert_level: 'success' as const,
        total_containers: 300,
        active_batches: 75,
        capacity_utilization_percentage: 90,
        released_from_freshwater_week: 5000,
      },
      isLoading: false,
    } as any);

    // Mock facility summaries
    vi.mocked(api.useFacilitySummaries).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    // Mock financial summary (all fields to match FinancialSummary type)
    vi.mocked(api.useFinancialSummary).mockReturnValue({
      data: {
        geography_id: null,
        period: '2025-10',
        total_revenue: null,
        total_costs: null,
        gross_margin: null,
        gross_margin_percentage: null,
        operating_margin_percentage: null,
        ebitda: null,
        roi_percentage: null,
        cash_flow: null,
      },
      isLoading: false,
    } as any);

    // Mock market prices (all fields to match MarketPrice type)
    vi.mocked(api.useMarketPrices).mockReturnValue({
      data: {
        current_price_per_kg: null,
        currency: 'EUR',
        market_outlook: null,
        last_updated: '2025-10-18T10:00:00Z',
      },
      isLoading: false,
    } as any);
  });

  it('should render page header and geography filter', () => {
    const wrapper = createWrapper();
    render(<ExecutiveDashboardPage />, { wrapper });

    expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Strategic oversight and decision-making/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select geography filter/)).toBeInTheDocument();
  });

  it('should render all 4 tab triggers', () => {
    const wrapper = createWrapper();
    render(<ExecutiveDashboardPage />, { wrapper });

    expect(screen.getByRole('tab', { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Financial/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Strategic/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Market/i })).toBeInTheDocument();
  });

  it('should render Overview tab by default', () => {
    const wrapper = createWrapper();
    render(<ExecutiveDashboardPage />, { wrapper });

    // Overview tab content should be visible
    expect(screen.getByText('Strategic KPIs')).toBeInTheDocument();
    expect(screen.getByText('Facility Overview')).toBeInTheDocument();
  });

  it('should switch tabs when clicked', async () => {
    const user = userEvent.setup();
    const wrapper = createWrapper();
    render(<ExecutiveDashboardPage />, { wrapper });

    // Click Financial tab
    const financialTab = screen.getByRole('tab', { name: /Financial/i });
    await user.click(financialTab);

    // Financial tab content should appear
    expect(await screen.findByText(/Financial Integration Pending/)).toBeInTheDocument();
  });

  it('should pass geography filter to Overview tab', () => {
    const wrapper = createWrapper();
    render(<ExecutiveDashboardPage />, { wrapper });

    // Geography filter is applied to Overview tab hooks (visible by default)
    expect(api.useExecutiveSummary).toHaveBeenCalledWith('global');
    expect(api.useFacilitySummaries).toHaveBeenCalledWith('global');
    
    // Note: Financial/Strategic/Market hooks only called when tabs are active
  });
});


/**
 * FinancialTab Component - Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { FinancialTab } from './FinancialTab';
import * as api from '../api/api';

// Mock the API hooks
vi.mock('../api/api', () => ({
  useFinancialSummary: vi.fn(),
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

describe('FinancialTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render integration pending banner', () => {
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

    const wrapper = createWrapper();
    render(<FinancialTab geography="global" />, { wrapper });

    expect(screen.getByText(/Financial Integration Pending/)).toBeInTheDocument();
    expect(screen.getByText(/\/api\/v1\/finance\/summary\//)).toBeInTheDocument();
  });

  it('should render 6 financial KPI cards', () => {
    vi.mocked(api.useFinancialSummary).mockReturnValue({
      data: {
        geography_id: null,
        period: '2025-10',
        total_revenue: 10000000,
        total_costs: 6500000,
        gross_margin: 3500000,
        gross_margin_percentage: 35.0,
        operating_margin_percentage: 28.5,
        ebitda: 3200000,
        roi_percentage: 18.5,
        cash_flow: 2800000,
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<FinancialTab geography="global" />, { wrapper });

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Total Costs')).toBeInTheDocument();
    expect(screen.getByText('Gross Margin')).toBeInTheDocument();
    expect(screen.getByText('EBITDA')).toBeInTheDocument();
    expect(screen.getByText('Operating Margin')).toBeInTheDocument();
    expect(screen.getByText('ROI')).toBeInTheDocument();
  });

  it('should render N/A for null financial values', () => {
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

    const wrapper = createWrapper();
    render(<FinancialTab geography="global" />, { wrapper });

    // All financial metrics should show N/A
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(4);
  });

  it('should render placeholder charts', () => {
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

    const wrapper = createWrapper();
    render(<FinancialTab geography="global" />, { wrapper });

    expect(screen.getByText('Revenue Trends')).toBeInTheDocument();
    expect(screen.getByText('Cost Breakdown')).toBeInTheDocument();
    expect(screen.getByText(/Revenue trend chart will appear here/)).toBeInTheDocument();
    expect(screen.getByText(/Cost breakdown chart will appear here/)).toBeInTheDocument();
  });
});




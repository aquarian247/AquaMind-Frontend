/**
 * MarketTab Component - Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { MarketTab } from './MarketTab';
import * as api from '../api/api';

// Mock the API hooks
vi.mock('../api/api', () => ({
  useMarketPrices: vi.fn(),
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

describe('MarketTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render integration pending banner', () => {
    vi.mocked(api.useMarketPrices).mockReturnValue({
      data: {
        current_price_per_kg: null,
        currency: 'EUR',
        market_outlook: null,
        last_updated: '2025-10-18T10:00:00Z',
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<MarketTab />, { wrapper });

    expect(screen.getByText(/Market Data Integration Pending/)).toBeInTheDocument();
    expect(screen.getByText(/Stágri Salmon Index/)).toBeInTheDocument();
  });

  it('should render market pricing KPIs', () => {
    vi.mocked(api.useMarketPrices).mockReturnValue({
      data: {
        current_price_per_kg: 8.45,
        currency: 'EUR',
        market_outlook: 'strong',
        last_updated: '2025-10-18T10:00:00Z',
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<MarketTab />, { wrapper });

    expect(screen.getByText('Salmon Price')).toBeInTheDocument();
    expect(screen.getByText('Market Outlook')).toBeInTheDocument();
  });

  it('should render placeholder charts and indicators', () => {
    vi.mocked(api.useMarketPrices).mockReturnValue({
      data: {
        current_price_per_kg: null,
        currency: 'EUR',
        market_outlook: null,
        last_updated: '2025-10-18T10:00:00Z',
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<MarketTab />, { wrapper });

    expect(screen.getByText('Global Market Share')).toBeInTheDocument();
    expect(screen.getByText(/Market share visualization will appear here/)).toBeInTheDocument();
    
    expect(screen.getByText('Supply Outlook')).toBeInTheDocument();
    expect(screen.getByText('Demand Outlook')).toBeInTheDocument();
    expect(screen.getByText(/Supply outlook data coming soon/)).toBeInTheDocument();
    expect(screen.getByText(/Demand outlook data coming soon/)).toBeInTheDocument();
  });

  it('should handle N/A values for market price', () => {
    vi.mocked(api.useMarketPrices).mockReturnValue({
      data: {
        current_price_per_kg: null,
        currency: 'EUR',
        market_outlook: null,
        last_updated: '2025-10-18T10:00:00Z',
      },
      isLoading: false,
    } as any);

    const wrapper = createWrapper();
    render(<MarketTab />, { wrapper });

    // Should display N/A for missing price data
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
  });
});




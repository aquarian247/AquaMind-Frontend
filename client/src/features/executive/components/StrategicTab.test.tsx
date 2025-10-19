/**
 * StrategicTab Component - Tests
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

describe('StrategicTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});


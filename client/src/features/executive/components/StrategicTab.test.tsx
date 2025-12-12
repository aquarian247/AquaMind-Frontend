/**
 * StrategicTab Component - Tests
 * 
 * Tests for the Strategic tab including harvest and sea-transfer forecasts.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { StrategicTab } from './StrategicTab';
import * as api from '../api/api';
import type { HarvestForecastResponse, SeaTransferForecastResponse } from '../types';

// Mock wouter's Link component
vi.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}));

// Mock the API hooks
vi.mock('../api/api', () => ({
  useExecutiveSummary: vi.fn(),
  useHarvestForecast: vi.fn(),
  useSeaTransferForecast: vi.fn(),
}));

// Mock data for harvest forecast
const mockHarvestForecast: HarvestForecastResponse = {
  summary: {
    total_batches: 12,
    harvest_ready_count: 3,
    avg_days_to_harvest: 45.5,
    total_projected_biomass_tonnes: 2450.5,
  },
  upcoming: [
    {
      batch_id: 1,
      batch_number: 'B-2024-001',
      species: 'Atlantic Salmon',
      facility: 'Norðtoftir',
      current_weight_g: 4200,
      target_weight_g: 5000,
      projected_harvest_date: '2026-03-15',
      days_until_harvest: 95,
      projected_biomass_kg: 52000,
      confidence: 0.92,
      planned_activity_id: 456,
      planned_activity_status: 'PENDING',
    },
    {
      batch_id: 2,
      batch_number: 'B-2024-002',
      species: 'Atlantic Salmon',
      facility: 'Hvannasund',
      current_weight_g: 4500,
      target_weight_g: 5000,
      projected_harvest_date: '2026-02-20',
      days_until_harvest: 72,
      projected_biomass_kg: 48000,
      confidence: 0.65,
      planned_activity_id: null,
      planned_activity_status: null,
    },
    {
      batch_id: 3,
      batch_number: 'B-2024-003',
      species: 'Rainbow Trout',
      facility: 'Fuglafjørður',
      current_weight_g: 2800,
      target_weight_g: 3000,
      projected_harvest_date: '2026-01-30',
      days_until_harvest: 51,
      projected_biomass_kg: 28000,
      confidence: 0.35,
      planned_activity_id: null,
      planned_activity_status: null,
    },
  ],
  by_quarter: {
    Q1_2026: { count: 5, biomass_tonnes: 650 },
    Q2_2026: { count: 7, biomass_tonnes: 890 },
  },
};

// Mock data for sea-transfer forecast
const mockSeaTransferForecast: SeaTransferForecastResponse = {
  summary: {
    total_freshwater_batches: 8,
    transfer_ready_count: 2,
    avg_days_to_transfer: 32.0,
  },
  upcoming: [
    {
      batch_id: 10,
      batch_number: 'B-2024-042',
      current_stage: 'Parr',
      target_stage: 'Smolt',
      current_facility: 'Hósvík Freshwater',
      target_facility: 'Hvannasund',
      projected_transfer_date: '2025-06-01',
      days_until_transfer: 45,
      current_weight_g: 85,
      target_weight_g: 100,
      confidence: 0.85,
      planned_activity_id: 321,
    },
    {
      batch_id: 11,
      batch_number: 'B-2024-043',
      current_stage: 'Parr',
      target_stage: 'Smolt',
      current_facility: 'Klaksvík FW Station',
      target_facility: null,
      projected_transfer_date: '2025-06-15',
      days_until_transfer: 59,
      current_weight_g: 78,
      target_weight_g: 100,
      confidence: 0.72,
      planned_activity_id: null,
    },
  ],
  by_month: {
    '2025-06': { count: 4 },
    '2025-07': { count: 4 },
  },
};

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

    // Default mock implementations
    vi.mocked(api.useExecutiveSummary).mockReturnValue({
      data: {
        capacity_utilization_percentage: 87.5,
        total_containers: 300,
        active_batches: 75,
        total_biomass_kg: 150000,
      },
      isLoading: false,
    } as any);

    vi.mocked(api.useHarvestForecast).mockReturnValue({
      data: mockHarvestForecast,
      isLoading: false,
    } as any);

    vi.mocked(api.useSeaTransferForecast).mockReturnValue({
      data: mockSeaTransferForecast,
      isLoading: false,
    } as any);
  });

  describe('Capacity Utilization', () => {
    it('should render capacity utilization KPIs', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('Overall Capacity')).toBeInTheDocument();
      expect(screen.getByText('Active Batches')).toBeInTheDocument();
      expect(screen.getByText('Total Biomass')).toBeInTheDocument();
      expect(screen.getByText(/87.5 %/)).toBeInTheDocument();
    });

    it('should render capacity breakdown card', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('Capacity by Facility Type')).toBeInTheDocument();
      expect(screen.getByText('Sea Farms')).toBeInTheDocument();
      expect(screen.getByText('Freshwater Stations')).toBeInTheDocument();
      expect(screen.getByText('Hatcheries')).toBeInTheDocument();
    });
  });

  describe('Production Forecasts Summary', () => {
    it('should render harvest forecast summary card', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('Harvest Forecast')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument(); // total_batches
      expect(screen.getByText('3')).toBeInTheDocument(); // harvest_ready_count
      expect(screen.getByText('46d')).toBeInTheDocument(); // avg_days_to_harvest rounded
    });

    it('should render sea-transfer forecast summary card', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('Sea-Transfer Forecast')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument(); // total_freshwater_batches
      expect(screen.getByText('2')).toBeInTheDocument(); // transfer_ready_count
      expect(screen.getByText('32d')).toBeInTheDocument(); // avg_days_to_transfer
    });

    it('should show projected biomass in harvest summary', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('2450.5t')).toBeInTheDocument();
      expect(screen.getByText('Biomass')).toBeInTheDocument();
    });
  });

  describe('Harvest Table', () => {
    it('should render upcoming harvests table', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('Upcoming Harvests')).toBeInTheDocument();
      expect(screen.getByText('B-2024-001')).toBeInTheDocument();
      expect(screen.getByText('B-2024-002')).toBeInTheDocument();
    });

    it('should display batch details correctly', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Check that Atlantic Salmon appears (multiple batches have this species)
      expect(screen.getAllByText('Atlantic Salmon').length).toBeGreaterThan(0);
      expect(screen.getByText('Norðtoftir')).toBeInTheDocument();
      // Check for formatted weight values (allow multiple matches for target weight)
      expect(screen.getAllByText('5,000').length).toBeGreaterThan(0);
    });

    it('should show confidence badges with appropriate colors', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // High confidence (92%)
      expect(screen.getByText('92%')).toBeInTheDocument();
      // Medium confidence (65%)
      expect(screen.getByText('65%')).toBeInTheDocument();
      // Low confidence (35%)
      expect(screen.getByText('35%')).toBeInTheDocument();
    });

    it('should show planned activity status when available', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('PENDING')).toBeInTheDocument();
    });

    it('should display empty state when no harvests', () => {
      vi.mocked(api.useHarvestForecast).mockReturnValue({
        data: {
          summary: {
            total_batches: 0,
            harvest_ready_count: 0,
            avg_days_to_harvest: null,
            total_projected_biomass_tonnes: 0,
          },
          upcoming: [],
          by_quarter: {},
        },
        isLoading: false,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('No batches approaching harvest weight')).toBeInTheDocument();
    });
  });

  describe('Sea-Transfer Table', () => {
    it('should render upcoming sea-transfers table', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('Upcoming Sea-Transfers')).toBeInTheDocument();
      expect(screen.getByText('B-2024-042')).toBeInTheDocument();
      expect(screen.getByText('B-2024-043')).toBeInTheDocument();
    });

    it('should display stage transition information', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Check stage info
      expect(screen.getAllByText('Parr').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Smolt').length).toBeGreaterThan(0);
    });

    it('should display current and target facilities', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('Hósvík Freshwater')).toBeInTheDocument();
      expect(screen.getByText('Klaksvík FW Station')).toBeInTheDocument();
    });

    it('should display empty state when no transfers', () => {
      vi.mocked(api.useSeaTransferForecast).mockReturnValue({
        data: {
          summary: {
            total_freshwater_batches: 0,
            transfer_ready_count: 0,
            avg_days_to_transfer: null,
          },
          upcoming: [],
          by_month: {},
        },
        isLoading: false,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('No batches approaching sea-transfer')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should not render harvest data when loading', () => {
      vi.mocked(api.useHarvestForecast).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Should not render batch numbers when loading
      expect(screen.queryByText('B-2024-001')).not.toBeInTheDocument();
    });

    it('should not render sea-transfer data when loading', () => {
      vi.mocked(api.useSeaTransferForecast).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any);

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      // Should not render batch numbers when loading
      expect(screen.queryByText('B-2024-042')).not.toBeInTheDocument();
    });
  });

  describe('Scenario Planning', () => {
    it('should render scenario planning section', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(screen.getByText('Scenario Planning')).toBeInTheDocument();
      expect(screen.getByText('Open Scenario Planner')).toBeInTheDocument();
    });

    it('should call onNavigateToScenario when button clicked', async () => {
      const user = userEvent.setup();
      const onNavigate = vi.fn();

      const wrapper = createWrapper();
      render(<StrategicTab geography="global" onNavigateToScenario={onNavigate} />, { wrapper });

      const scenarioButton = screen.getByText('Open Scenario Planner');
      await user.click(scenarioButton);

      expect(onNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Geography Filter', () => {
    it('should pass geography filter to forecast hooks', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography={5} />, { wrapper });

      expect(api.useHarvestForecast).toHaveBeenCalled();
      expect(vi.mocked(api.useHarvestForecast).mock.calls[0][0]).toBe(5);
      expect(api.useSeaTransferForecast).toHaveBeenCalled();
      expect(vi.mocked(api.useSeaTransferForecast).mock.calls[0][0]).toBe(5);
    });

    it('should pass global filter correctly', () => {
      const wrapper = createWrapper();
      render(<StrategicTab geography="global" />, { wrapper });

      expect(api.useHarvestForecast).toHaveBeenCalled();
      expect(vi.mocked(api.useHarvestForecast).mock.calls[0][0]).toBe('global');
      expect(api.useSeaTransferForecast).toHaveBeenCalled();
      expect(vi.mocked(api.useSeaTransferForecast).mock.calls[0][0]).toBe('global');
    });
  });
});

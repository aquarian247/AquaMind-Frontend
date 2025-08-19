import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BatchAnalyticsView } from './BatchAnalyticsView';

// Helper to create a new QueryClient for each test
const renderWithQueryClient = (ui: React.ReactElement) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  );
};

// Helper to create JSON response
const json = (data: any, init?: ResponseInit) => {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
};

describe('BatchAnalyticsView', () => {
  beforeEach(() => {
    // Mock fetch for all API endpoints used by this component
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url !== 'string') {
        return Promise.resolve(json({}));
      }

      // Growth samples (paginated)
      if (url.includes('/api/v1/batch/growth-samples')) {
        return Promise.resolve(json({
          results: [
            { id: 1, assignment: 101, sample_date: '2025-07-01', avg_weight_g: '150.5', avg_length_cm: '20.0' },
            { id: 2, assignment: 102, sample_date: '2025-07-08', avg_weight_g: '168.7', avg_length_cm: '21.0' },
            { id: 3, assignment: 103, sample_date: '2025-07-15', avg_weight_g: '185.0', avg_length_cm: '21.8' }
          ]
        }));
      }

      // Feeding summaries
      if (url.includes('/api/v1/inventory/batch-feeding-summaries')) {
        return Promise.resolve(json({ results: [{ total_feed_kg: '120.5' }] }));
      }

      // Environmental readings
      if (url.includes('/api/v1/environmental/readings')) {
        return Promise.resolve(json({
          results: [
            { id: 1, parameter: { name: 'Temperature' } },
            { id: 2, parameter: { name: 'Oxygen' } },
            { id: 3, parameter: { name: 'pH' } }
          ]
        }));
      }

      // Scenarios
      if (url.includes('/api/v1/scenario/scenarios')) {
        return Promise.resolve(json({
          results: [{ name: 'Baseline Projection', duration_days: 60 }]
        }));
      }

      // Container assignments
      if (url.includes('/api/v1/batch/batch-container-assignments')) {
        return Promise.resolve(json({
          results: [
            { id: 101, population_count: 25000, biomass_kg: '3750.5' },
            { id: 102, population_count: 24700, biomass_kg: '4133.2' },
            { id: 103, population_count: 24500, biomass_kg: '4500.0' }
          ]
        }));
      }

      // Growth analysis
      if (url.includes('/api/v1/batch/batches/growth-analysis')) {
        return Promise.resolve(json({ status: 'ok' }));
      }

      return Promise.resolve(json({}));
    });
  });

  it('renders basic sections and tabs', async () => {
    // Render with required props
    renderWithQueryClient(<BatchAnalyticsView batchId={1} batchName="Batch A" />);

    // Verify header is rendered
    const header = await screen.findByText(/Analytics for Batch A/i);
    expect(header).toBeInTheDocument();

    // Check if we're in desktop mode with tabs
    const growthTab = screen.queryByRole('tab', { name: /Growth/i });
    
    if (growthTab) {
      // Desktop view - click the Growth tab
      await userEvent.click(growthTab);
      
      // Verify content specific to Growth tab is displayed
      const growthAnalysis = await screen.findByText(/Growth Rate Analysis/i);
      expect(growthAnalysis).toBeInTheDocument();

      // Click Benchmarks tab
      const benchmarksTab = screen.getByRole('tab', { name: /Benchmarks/i });
      await userEvent.click(benchmarksTab);

      // Verify content specific to Benchmarks tab is displayed
      const vsTargetElements = await screen.findAllByText(/vs Target/i);
      expect(vsTargetElements.length).toBeGreaterThan(0);
    } else {
      // Mobile view - tabs are in a select dropdown
      // Just verify that some content is visible
      const performanceMetrics = await screen.findByText(/Performance Metrics/i);
      expect(performanceMetrics).toBeInTheDocument();
    }
  });

  it('handles API error gracefully', async () => {
    // Override fetch mock for growth samples to return error
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/v1/batch/growth-samples')) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }

      // Return empty paginated shapes for other endpoints
      if (url.includes('/api/v1/inventory/batch-feeding-summaries') ||
          url.includes('/api/v1/environmental/readings') ||
          url.includes('/api/v1/scenario/scenarios') ||
          url.includes('/api/v1/batch/batch-container-assignments') ||
          url.includes('/api/v1/batch/batches/growth-analysis')) {
        return Promise.resolve(json({ results: [] }));
      }

      return Promise.resolve(json({}));
    });

    // Render with required props
    renderWithQueryClient(<BatchAnalyticsView batchId={1} batchName="Batch A" />);

    // Verify the error message is displayed
    const errorMessage = await screen.findByText(
      /Error loading analytics data\. Please try again\./i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});

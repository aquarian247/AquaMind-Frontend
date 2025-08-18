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

      // Growth samples endpoint
      if (url.includes('/api/v1/batch/growth-samples')) {
        return Promise.resolve(json({
          count: 2,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              assignment: 1,
              sample_date: '2025-07-01',
              avg_weight_g: 150.5,
              sample_size: 30,
              notes: 'Regular monthly sampling',
              created_at: '2025-07-01T10:15:00Z',
              updated_at: '2025-07-01T10:15:00Z'
            },
            {
              id: 2,
              assignment: 1,
              sample_date: '2025-07-08',
              avg_weight_g: 168.7,
              sample_size: 30,
              notes: 'Mid-month check',
              created_at: '2025-07-08T11:00:00Z',
              updated_at: '2025-07-08T11:00:00Z'
            }
          ]
        }));
      }

      // Growth analysis endpoint
      if (url.includes('/api/v1/batch/batches/growth-analysis')) {
        return Promise.resolve(json({
          id: 1,
          batch: 1,
          survival_rate: 98.5,
          growth_rate: 12.3,
          feed_conversion_ratio: 1.2,
          health_score: 92,
          productivity: 87.5,
          efficiency: 85.3
        }));
      }

      // Batch feeding summaries endpoint
      if (url.includes('/api/v1/inventory/batch-feeding-summaries')) {
        return Promise.resolve(json({
          count: 2,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              batch: 1,
              period_start: '2025-06-01',
              period_end: '2025-06-15',
              total_feed_kg: 450.5,
              avg_daily_feed_kg: 30.0,
              feed_conversion_ratio: 1.2,
              created_at: '2025-06-15T16:00:00Z',
              updated_at: '2025-06-15T16:00:00Z'
            },
            {
              id: 2,
              batch: 1,
              period_start: '2025-06-16',
              period_end: '2025-06-30',
              total_feed_kg: 520.8,
              avg_daily_feed_kg: 34.7,
              feed_conversion_ratio: 1.18,
              created_at: '2025-06-30T16:00:00Z',
              updated_at: '2025-06-30T16:00:00Z'
            }
          ]
        }));
      }

      // Environmental readings endpoint
      if (url.includes('/api/v1/environmental/readings')) {
        return Promise.resolve(json({
          count: 3,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              sensor: 1,
              parameter_type: 'TEMPERATURE',
              value: 12.5,
              reading_time: '2025-07-01T08:00:00Z',
              created_at: '2025-07-01T08:00:01Z',
              updated_at: '2025-07-01T08:00:01Z'
            },
            {
              id: 2,
              sensor: 2,
              parameter_type: 'OXYGEN',
              value: 8.7,
              reading_time: '2025-07-01T08:00:00Z',
              created_at: '2025-07-01T08:00:02Z',
              updated_at: '2025-07-01T08:00:02Z'
            },
            {
              id: 3,
              sensor: 3,
              parameter_type: 'PH',
              value: 7.2,
              reading_time: '2025-07-01T08:00:00Z',
              created_at: '2025-07-01T08:00:03Z',
              updated_at: '2025-07-01T08:00:03Z'
            }
          ]
        }));
      }

      // Environmental correlations endpoint - keep for backward compatibility
      if (url.includes('/api/batch/environmental-correlations')) {
        return Promise.resolve(json([]));
      }

      // Predictive insights endpoint - keep for backward compatibility
      if (url.includes('/api/batch/predictive-insights')) {
        return Promise.resolve(json([]));
      }

      // Benchmarks endpoint - keep for backward compatibility
      if (url.includes('/api/batch/benchmarks')) {
        return Promise.resolve(json([]));
      }

      return Promise.resolve(json({}));
    });
  });

  it('renders basic sections and tabs', async () => {
    // Render with required props
    renderWithQueryClient(<BatchAnalyticsView batchId={1} batchName="Batch A" />);

    // Header should render
    const header = await screen.findByText(/Analytics for Batch A/i);
    expect(header).toBeInTheDocument();

    // One of the metric cards should appear (e.g., Survival Rate)
    const survivalCards = await screen.findAllByText(/Survival Rate/i);
    expect(survivalCards.length).toBeGreaterThan(0);
  });

  it('handles API error gracefully', async () => {
    // Override fetch mock for growth samples to return error
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/v1/batch/growth-samples')) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }

      // Return empty paginated results for other endpoints
      if (url.includes('/api/v1/batch/batches/growth-analysis')) {
        return Promise.resolve(json(null));
      }
      if (url.includes('/api/v1/inventory/batch-feeding-summaries')) {
        return Promise.resolve(json({ count: 0, next: null, previous: null, results: [] }));
      }
      if (url.includes('/api/v1/environmental/readings')) {
        return Promise.resolve(json({ count: 0, next: null, previous: null, results: [] }));
      }

      return Promise.resolve(json({}));
    });

    // Render with required props
    renderWithQueryClient(<BatchAnalyticsView batchId={1} batchName="Batch A" />);

    // Verify error message is shown
    const errorMessage = await screen.findByText(/Error loading analytics data. Please try again./i);
    expect(errorMessage).toBeInTheDocument();
  });
});

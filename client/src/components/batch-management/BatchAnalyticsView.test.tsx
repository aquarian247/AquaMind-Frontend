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

      // Growth metrics endpoint
      if (url.includes('/api/batch/growth-metrics')) {
        return Promise.resolve(json([
          {
            date: '2025-07-01',
            averageWeight: 150.5,
            totalBiomass: 3750.5,
            populationCount: 24900,
            growthRate: 12.5,
            condition: 1.1
          },
          {
            date: '2025-07-08',
            averageWeight: 168.7,
            totalBiomass: 4133.2,
            populationCount: 24500,
            growthRate: 12.1,
            condition: 1.2
          }
        ]));
      }

      // Performance metrics endpoint
      if (url.includes('/api/batch/performance-metrics')) {
        return Promise.resolve(json({
          survivalRate: 98.5,
          growthRate: 12.3,
          feedConversionRatio: 1.2,
          healthScore: 92,
          productivity: 87.5,
          efficiency: 85.3
        }));
      }

      // Environmental correlations endpoint
      if (url.includes('/api/batch/environmental-correlations')) {
        return Promise.resolve(json([
          {
            parameter: 'Temperature',
            correlation: 0.75,
            impact: 'positive',
            significance: 'high'
          },
          {
            parameter: 'Oxygen',
            correlation: 0.62,
            impact: 'positive',
            significance: 'medium'
          },
          {
            parameter: 'pH',
            correlation: 0.31,
            impact: 'neutral',
            significance: 'low'
          }
        ]));
      }

      // Predictive insights endpoint
      if (url.includes('/api/batch/predictive-insights')) {
        return Promise.resolve(json([
          {
            metric: 'Expected Harvest Weight',
            currentValue: 168.7,
            predictedValue: 450.2,
            trend: 'improving',
            confidence: 85,
            timeframe: 'next 60 days'
          }
        ]));
      }

      // Benchmarks endpoint
      if (url.includes('/api/batch/benchmarks')) {
        return Promise.resolve(json([
          {
            metric: 'Growth Rate',
            current: 12.3,
            target: 12.0,
            industry: 11.5,
            status: 'above'
          }
        ]));
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
      const vsTarget = await screen.findByText(/vs Target/i);
      expect(vsTarget).toBeInTheDocument();
    } else {
      // Mobile view - tabs are in a select dropdown
      // Just verify that some content is visible
      const performanceMetrics = await screen.findByText(/Performance Metrics/i);
      expect(performanceMetrics).toBeInTheDocument();
    }
  });

  it('handles API error gracefully', async () => {
    // Override fetch mock for performance-metrics to return error
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/batch/performance-metrics')) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }

      // Return empty arrays/objects for other endpoints
      if (url.includes('/api/batch/growth-metrics')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/batch/environmental-correlations')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/batch/predictive-insights')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/batch/benchmarks')) {
        return Promise.resolve(json([]));
      }

      return Promise.resolve(json({}));
    });

    // Render with required props
    renderWithQueryClient(<BatchAnalyticsView batchId={1} batchName="Batch A" />);

    // Verify header is still rendered despite the API error
    const header = await screen.findByText(/Analytics for Batch A/i);
    expect(header).toBeInTheDocument();

    // Verify at least one section renders without throwing
    const section = await screen.findByText(/Performance Metrics|Growth Analytics/i);
    expect(section).toBeInTheDocument();
  });
});

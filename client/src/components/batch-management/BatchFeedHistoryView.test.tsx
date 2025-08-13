import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BatchFeedHistoryView } from './BatchFeedHistoryView';

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

describe('BatchFeedHistoryView', () => {
  beforeEach(() => {
    // Mock fetch for all API endpoints used by this component
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url !== 'string') {
        return Promise.resolve(json({}));
      }

      // Feeding events endpoint
      if (url.includes('/api/batch/feeding-events')) {
        return Promise.resolve(json([
          {
            id: 1,
            feedingDate: '2025-07-01',
            feedingTime: '08:30:00',
            amountKg: 125.5,
            feedType: 'Growth Formula',
            feedBrand: 'AquaNutrition Pro',
            containerName: 'Tank A-1',
            batchBiomassKg: 3500.75,
            feedCost: 187.25,
            method: 'Automatic',
            recordedBy: 'User 5'
          },
          {
            id: 2,
            feedingDate: '2025-07-02',
            feedingTime: '08:30:00',
            amountKg: 130.2,
            feedType: 'Growth Formula',
            feedBrand: 'AquaNutrition Pro',
            containerName: 'Tank A-1',
            batchBiomassKg: 3620.50,
            feedCost: 195.30,
            method: 'Automatic',
            recordedBy: 'User 5'
          }
        ]));
      }

      // Feeding summaries endpoint
      if (url.includes('/api/batch/feeding-summaries')) {
        return Promise.resolve(json([
          {
            id: 1,
            periodStart: '2025-07-01',
            periodEnd: '2025-07-30',
            totalFeedKg: 3750.5,
            totalFeedConsumedKg: 3600.25,
            totalBiomassGainKg: 2880.2,
            fcr: 1.25,
            averageFeedingPercentage: 3.2,
            feedingEventsCount: 30,
            totalCost: 5625.75
          }
        ]));
      }

      return Promise.resolve(json({}));
    });
  });

  it('renders header and navigates tabs', async () => {
    // Render with required props
    renderWithQueryClient(<BatchFeedHistoryView batchId={1} batchName="Batch A" />);

    // Verify header is rendered
    const header = await screen.findByText(/Feed History for Batch A/i);
    expect(header).toBeInTheDocument();

    // Check if we're in desktop mode with tabs
    const analyticsTab = screen.queryByRole('tab', { name: /Feed Analytics/i });
    
    if (analyticsTab) {
      // Desktop view - click the Feed Analytics tab
      await userEvent.click(analyticsTab);
      
      // Verify content specific to Feed Analytics tab is displayed
      const analyticsContent = await screen.findByText(/Feed Type Usage/i);
      expect(analyticsContent).toBeInTheDocument();
    } else {
      // Mobile view - tabs are in a select dropdown
      // Just verify that some content is visible
      const feedingEvents = await screen.findByText(/Feeding Events/i);
      expect(feedingEvents).toBeInTheDocument();
    }
  });

  it('handles API error gracefully', async () => {
    // Override fetch mock for feeding-events to return error and feeding-summaries to return empty array
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/batch/feeding-events')) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }

      if (url.includes('/api/batch/feeding-summaries')) {
        return Promise.resolve(json([]));
      }

      return Promise.resolve(json({}));
    });

    // Render with required props
    renderWithQueryClient(<BatchFeedHistoryView batchId={1} batchName="Batch A" />);

    // Verify header is still rendered despite the API error
    const header = await screen.findByText(/Feed History for Batch A/i);
    expect(header).toBeInTheDocument();

    // Verify Feed Conversion card renders without throwing
    const feedConversionCards = await screen.findAllByText(/Feed Conversion/i);
    expect(feedConversionCards.length).toBeGreaterThan(0);
  });
});

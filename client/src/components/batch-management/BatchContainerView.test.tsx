import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BatchContainerView } from './BatchContainerView';
import { getQueryFn } from '@/lib/queryClient';

// Helper to create a new QueryClient for each test
const renderWithQueryClient = (ui: React.ReactElement) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: getQueryFn({ on401: 'throw' }),
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

describe('BatchContainerView', () => {
  beforeEach(() => {
    // Mock fetch for all API endpoints used by this component
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url !== 'string') {
        return Promise.resolve(json({}));
      }

      // Farm sites endpoint
      if (url.includes('/api/dashboard/farm-sites')) {
        return Promise.resolve(json([
          { 
            id: 1, 
            name: 'North Bay Farm', 
            location: 'Faroe', 
            totalCapacity: 100000, 
            currentStock: 50000, 
            status: 'active', 
            coordinates: '' 
          }
        ]));
      }

      // Batches endpoint
      if (url.includes('/api/batches')) {
        return Promise.resolve(json([
          { 
            id: 1, 
            name: 'Batch A', 
            container: 10, 
            status: 'active', 
            currentCount: 20000, 
            currentBiomassKg: 3500 
          }
        ]));
      }

      // Containers endpoint
      if (url.includes('/api/containers')) {
        return Promise.resolve(json([
          { 
            id: 10, 
            name: 'North Bay Farm - Cage 1', 
            containerType: 'sea cage', 
            capacity: 50000 
          }
        ]));
      }

      // Environmental readings endpoint
      if (url.includes('/api/environmental-readings')) {
        return Promise.resolve(json([
          { 
            id: 1, 
            parameter: 1, 
            readingTime: '2025-07-01T00:00:00Z', 
            value: 12.3, 
            container: 10 
          }
        ]));
      }

      return Promise.resolve(json({}));
    });
  });

  it('renders filter header and a container card', async () => {
    // Render the component
    renderWithQueryClient(<BatchContainerView />);

    // Verify filter header is rendered
    const filterHeader = await screen.findByText(/Region, Site & Batch Filters/i);
    expect(filterHeader).toBeInTheDocument();

    // Verify container card with view details button is rendered
    const viewDetailsButton = await screen.findByRole('button', { name: /View Details/i });
    expect(viewDetailsButton).toBeInTheDocument();

    // Verify container name is displayed
    const containerName = await screen.findByText(/North Bay Farm - Cage 1/i);
    expect(containerName).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    // Override fetch mock for batches to return error
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/batches')) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }

      // Return empty arrays for other endpoints
      if (url.includes('/api/dashboard/farm-sites')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/containers')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/environmental-readings')) {
        return Promise.resolve(json([]));
      }

      return Promise.resolve(json({}));
    });

    // Render the component
    renderWithQueryClient(<BatchContainerView />);

    // Verify filter header is still rendered despite the API error
    const filterHeader = await screen.findByText(/Region, Site & Batch Filters/i);
    expect(filterHeader).toBeInTheDocument();

    // Verify the component doesn't crash and shows empty state message
    const emptyMessage = await screen.findByText(/No containers match the selected filters/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});

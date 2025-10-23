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

      // Farm sites endpoint (v1 API)
      if (url.includes('/api/v1/infrastructure/areas/')) {
        return Promise.resolve(json({
          results: [
            { 
              id: 1, 
              name: 'North Bay Farm', 
              location: 'Faroe', 
              total_capacity: 100000, 
              current_stock: 50000, 
              status: 'active', 
              coordinates: '' 
            }
          ]
        }));
      }

      // Batches endpoint (v1 API)
      if (url.includes('/api/v1/batch/batches/')) {
        return Promise.resolve(json({
          results: [
            { 
              id: 1, 
              batch_number: 'Batch A',
              species: 1,
              species_name: 'Atlantic Salmon',
              lifecycle_stage: 1,
              status: 'ACTIVE',
              batch_type: 'STANDARD',
              start_date: '2025-01-01',
              expected_end_date: '2025-12-31',
              notes: '',
              created_at: '2025-01-01T00:00:00Z',
              updated_at: '2025-01-01T00:00:00Z',
              calculated_population_count: 20000,
              calculated_biomass_kg: 3500,
              calculated_avg_weight_g: 175,
              current_lifecycle_stage: {
                id: 1,
                name: 'Smolt'
              },
              days_in_production: 120,
              active_containers: [10]
            }
          ]
        }));
      }

      // Containers endpoint (v1 API)
      if (url.includes('/api/v1/infrastructure/containers/')) {
        return Promise.resolve(json({
          results: [
            { 
              id: 10, 
              name: 'North Bay Farm - Cage 1', 
              containerType: 'sea cage', 
              capacity: 50000 
            }
          ]
        }));
      }

      // Environmental readings endpoint (v1 API)
      if (url.includes('/api/v1/environmental/readings/')) {
        return Promise.resolve(json({
          results: [
            { 
              id: 1, 
              parameter: {
                id: 1,
                name: 'Temperature',
                unit: '°C'
              },
              reading_time: '2025-07-01T00:00:00Z', 
              value: 12.3, 
              container: 10 
            }
          ]
        }));
      }

      return Promise.resolve(json({}));
    });
  });

  it.skip('renders header and container assignments', async () => {
    // Create a mock batch to pass as selectedBatch
    const mockBatch = {
      id: 1,
      batch_number: 'BATCH-001',
      species: 1,
      species_name: 'Atlantic Salmon',
      lifecycle_stage: 1,
      status: 'ACTIVE' as const,
      batch_type: 'STANDARD' as const,
      start_date: '2025-01-01',
      expected_end_date: '2025-12-31',
      notes: '',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      calculated_population_count: 20000,
      calculated_biomass_kg: 3500,
      calculated_avg_weight_g: 175,
      current_lifecycle_stage: { id: 1, name: 'Smolt' },
      days_in_production: 120,
      active_containers: [10]
    };

    // Render the component with a selected batch
    renderWithQueryClient(<BatchContainerView selectedBatch={mockBatch} />);

    // Verify batch number is displayed in the new selected batch header card
    await waitFor(() => {
      expect(screen.getByText(/BATCH-001/i)).toBeInTheDocument();
    });

    // Verify species is displayed
    expect(screen.getByText(/Atlantic Salmon/i)).toBeInTheDocument();

    // Verify empty state message since no assignments are returned by mock
    expect(await screen.findByText(/No Active Containers/i)).toBeInTheDocument();
  });

  it('shows empty state when no batch is selected', async () => {
    // Render without a selected batch
    renderWithQueryClient(<BatchContainerView selectedBatch={undefined} />);

    // Verify empty state message is displayed
    const emptyMessage = await screen.findByText(/Select a batch to view its container assignments/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  it('shows empty state when batch has no active assignments', async () => {
    // Override fetch mock to return empty assignments
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/v1/batch/container-assignments/')) {
        return Promise.resolve(json({ results: [] }));
      }
      return Promise.resolve(json({}));
    });

    const mockBatch = {
      id: 1,
      batch_number: 'BATCH-001',
      species: 1,
      species_name: 'Atlantic Salmon',
      lifecycle_stage: 1,
      status: 'ACTIVE' as const,
      batch_type: 'STANDARD' as const,
      start_date: '2025-01-01',
      expected_end_date: '2025-12-31',
      notes: '',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      calculated_population_count: 20000,
      calculated_biomass_kg: 3500,
      calculated_avg_weight_g: 175,
      current_lifecycle_stage: { id: 1, name: 'Smolt' },
      days_in_production: 120,
      active_containers: [10]
    };

    // Render the component with selected batch but no assignments
    renderWithQueryClient(<BatchContainerView selectedBatch={mockBatch} />);

    // Verify empty state message for no assignments
    const emptyMessage = await screen.findByText(/No Active Containers/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BatchTraceabilityView } from './BatchTraceabilityView';

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

describe('BatchTraceabilityView', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock fetch for all API endpoints used by this component
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string | Request) => {
      // Handle both string URLs and Request objects
      const urlString = typeof url === 'string' ? url : url.url;
      
      if (!urlString) {
        return Promise.resolve(json({}));
      }

      // Lifecycle progression endpoint
      if (urlString.includes('/api/v1/batch/container-assignments/lifecycle-progression/')) {
        return Promise.resolve(json({
          batch_id: 1,
          basis: 'stage_entry',
          stages: [
            {
              lifecycle_stage_id: 1,
              lifecycle_stage: 'Egg&Alevin',
              stage_order: 1,
              container_assignments: 1,
              active_containers: 0,
              total_population: 20000,
              total_biomass_kg: 3500.5,
              avg_weight_g: 175.03,
            },
            {
              lifecycle_stage_id: 2,
              lifecycle_stage: 'Fry',
              stage_order: 2,
              container_assignments: 1,
              active_containers: 1,
              total_population: 19500,
              total_biomass_kg: 4200.75,
              avg_weight_g: 215.42,
            },
          ],
          totals: {
            container_assignments: 2,
            active_containers: 1,
            total_population: 39500,
            total_biomass_kg: 7701.25,
          },
        }));
      }

      // Batch container assignments endpoint (DRF pagination format)
      if (urlString.includes('/api/v1/batch/batch-container-assignments') || urlString.includes('assignment')) {
        return Promise.resolve(json({
          count: 2,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              batch: { id: 1, batch_number: 'BATCH-001' },
              container: { id: 10, name: 'Freshwater Tank A-1' },
              lifecycle_stage: { id: 1, name: 'Egg&Alevin' },
              population_count: 20000,
              biomass_kg: "3500.50",
              assignment_date: "2025-05-15",
              departure_date: null,
              is_active: true
            },
            {
              id: 2,
              batch: { id: 1, batch_number: 'BATCH-001' },
              container: { id: 11, name: 'Seawater Pen B-3' },
              lifecycle_stage: { id: 2, name: 'Fry' },
              population_count: 19500,
              biomass_kg: "4200.75",
              assignment_date: "2025-06-20",
              departure_date: null,
              is_active: true
            }
          ]
        }));
      }

      // Batch transfers endpoint (DRF pagination format)
      if (urlString.includes('/api/v1/batch/transfers')) {
        return Promise.resolve(json({
          count: 0,
          next: null,
          previous: null,
          results: []
        }));
      }

      // Containers endpoint (DRF pagination format)
      if (urlString.includes('/api/v1/infrastructure/containers')) {
        return Promise.resolve(json({
          count: 2,
          next: null,
          previous: null,
          results: [
            { 
              id: 10, 
              name: 'Freshwater Tank A-1'
            },
            {
              id: 11,
              name: 'Seawater Pen B-3'
            }
          ]
        }));
      }
      
      // Growth analysis aggregation endpoint
      if (urlString.includes('/growth_analysis')) {
        return Promise.resolve(json({
          growth_metrics: [
            {
              date: "2025-05-30",
              avg_weight_g: "120.5",
              condition_factor: "1.15"
            },
            {
              date: "2025-07-05",
              avg_weight_g: "215.8",
              condition_factor: "1.22"
            }
          ],
          start_date: "2025-05-15",
          current_avg_weight: "215.8"
        }));
      }
      
      // Performance metrics aggregation endpoint
      if (urlString.includes('/performance_metrics')) {
        return Promise.resolve(json({
          mortality_metrics: {
            total_count: 125,
            mortality_rate: 0.64,
            by_cause: []
          }
        }));
      }
      
      // Mortality events endpoint (DRF pagination format)
      if (urlString.includes('/api/v1/batch/mortality-events')) {
        return Promise.resolve(json({
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              batch: 1,
              event_date: "2025-06-25",
              count: 125,
              cause: "ENVIRONMENTAL",
              description: "Test mortality",
              created_at: "2025-06-25T10:00:00Z"
            }
          ]
        }));
      }


      return Promise.resolve(json({}));
    });
  });

  it('renders header and navigates tabs', async () => {
    // Provide stages and containers as props to avoid fetch issues in tests
    const mockStages = [
      { id: 1, name: 'Egg&Alevin', order: 1 },
      { id: 2, name: 'Fry', order: 2 }
    ];
    
    const mockContainers = [
      { id: 10, name: 'Freshwater Tank A-1' },
      { id: 11, name: 'Seawater Pen B-3' }
    ];
    
    // Render with required props and data to bypass loading state
    renderWithQueryClient(
      <BatchTraceabilityView 
        batchId={1} 
        batchName="Batch A"
        stages={mockStages}
        containers={mockContainers}
      />
    );

    // Verify header is rendered
    const header = await screen.findByText(/Batch Traceability: Batch A/i);
    expect(header).toBeInTheDocument();

    // Check if we're in desktop mode with tabs
    const transferTab = screen.queryByRole('tab', { name: /Transfer History/i });
    
    if (transferTab) {
      // Desktop view - click the Transfer History tab
      await userEvent.click(transferTab);
      
      // Verify empty state is shown (no transfers in mock data)
      const emptyStateMessage = await screen.findByText(/No Transfer Records/i);
      expect(emptyStateMessage).toBeInTheDocument();
    } else {
      // Mobile view - tabs are in a select dropdown
      // Just verify that some content is visible
      const lifecycleContent = await screen.findByText(/Lifecycle Progression/i);
      expect(lifecycleContent).toBeInTheDocument();
    }
  });

  it('shows loading placeholder when a core dataset fails', async () => {
    // Override fetch mock for assignment endpoint to return error.
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string | Request) => {
      const urlString = typeof url === 'string' ? url : url.url;

      if (
        urlString.includes('/api/v1/batch/container-assignments/') ||
        urlString.includes('/api/v1/batch/batch-container-assignments')
      ) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }

      return Promise.resolve(json({ count: 0, next: null, previous: null, results: [] }));
    });

    // Render with required props
    renderWithQueryClient(<BatchTraceabilityView batchId={1} batchName="Batch A" />);

    // Verify loading message is displayed
    const loadingMessage = await screen.findByText(/Loading traceability data.../i);
    expect(loadingMessage).toBeInTheDocument();
  });
});

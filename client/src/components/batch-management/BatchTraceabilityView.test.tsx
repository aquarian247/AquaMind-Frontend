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
    // Mock fetch for all API endpoints used by this component
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url !== 'string') {
        return Promise.resolve(json({}));
      }

      // Batch container assignments endpoint
      if (url.includes('/api/batch-container-assignments')) {
        return Promise.resolve(json([
          {
            id: 1,
            batch: 1,
            container: 10,
            lifecycleStage: 1,
            populationCount: 20000,
            biomassKg: "3500.50",
            assignmentDate: "2025-05-15",
            departureDate: null,
            isActive: true
          },
          {
            id: 2,
            batch: 1,
            container: 11,
            lifecycleStage: 2,
            populationCount: 19500,
            biomassKg: "4200.75",
            assignmentDate: "2025-06-20",
            departureDate: null,
            isActive: true
          }
        ]));
      }

      // Batch transfers endpoint
      if (url.includes('/api/batch-transfers')) {
        return Promise.resolve(json([
          {
            id: 1,
            batch: 1,
            fromContainerAssignment: 1,
            toContainerAssignment: 2,
            transferType: "MOVE",
            populationCount: 19500,
            transferDate: "2025-06-20",
            transferPercentage: "97.5",
            reason: "Lifecycle stage transition"
          }
        ]));
      }

      // Containers endpoint
      if (url.includes('/api/containers')) {
        return Promise.resolve(json([
          { 
            id: 10, 
            name: 'Freshwater Tank A-1'
          },
          {
            id: 11,
            name: 'Seawater Pen B-3'
          }
        ]));
      }

      // Stages endpoint
      if (url.includes('/api/stages')) {
        return Promise.resolve(json([
          {
            id: 1,
            name: 'Freshwater'
          },
          {
            id: 2,
            name: 'Seawater'
          }
        ]));
      }

      // Growth samples endpoint
      if (url.includes('/api/growth-samples')) {
        return Promise.resolve(json([
          {
            id: 1,
            containerAssignment: 1,
            sampleDate: "2025-05-30",
            avgWeightG: "120.5",
            conditionFactor: "1.15",
            sampleSize: 30,
            sampledBy: 5
          },
          {
            id: 2,
            containerAssignment: 2,
            sampleDate: "2025-07-05",
            avgWeightG: "215.8",
            conditionFactor: "1.22",
            sampleSize: 30,
            sampledBy: 5
          }
        ]));
      }

      // Mortality events endpoint
      if (url.includes('/api/mortality-events')) {
        return Promise.resolve(json([
          {
            id: 1,
            containerAssignment: 2,
            eventDate: "2025-06-25",
            mortalityCount: 125,
            cause: "Environmental",
            reportedBy: 3
          }
        ]));
      }

      return Promise.resolve(json({}));
    });
  });

  it('renders header and navigates tabs', async () => {
    // Render with required props
    renderWithQueryClient(<BatchTraceabilityView batchId={1} batchName="Batch A" />);

    // Verify header is rendered
    const header = await screen.findByText(/Batch Traceability: Batch A/i);
    expect(header).toBeInTheDocument();

    // Check if we're in desktop mode with tabs
    const transferTab = screen.queryByRole('tab', { name: /Transfer History/i });
    
    if (transferTab) {
      // Desktop view - click the Transfer History tab
      await userEvent.click(transferTab);
      
      // Verify content specific to Transfer History tab is displayed
      const tableHeader = await screen.findByText(/Transfer Date/i);
      expect(tableHeader).toBeInTheDocument();
    } else {
      // Mobile view - tabs are in a select dropdown
      // Just verify that some content is visible
      const lifecycleContent = await screen.findByText(/Lifecycle Progression/i);
      expect(lifecycleContent).toBeInTheDocument();
    }
  });

  it('shows loading placeholder when a core dataset fails', async () => {
    // Override fetch mock for batch-container-assignments to return error
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/batch-container-assignments')) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }

      // Return empty arrays for other endpoints to isolate the test
      if (url.includes('/api/batch-transfers')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/containers')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/stages')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/growth-samples')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/mortality-events')) {
        return Promise.resolve(json([]));
      }

      return Promise.resolve(json({}));
    });

    // Render with required props
    renderWithQueryClient(<BatchTraceabilityView batchId={1} batchName="Batch A" />);

    // Verify loading message is displayed
    const loadingMessage = await screen.findByText(/Loading traceability data.../i);
    expect(loadingMessage).toBeInTheDocument();
  });
});

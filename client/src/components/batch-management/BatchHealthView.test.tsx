import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BatchHealthView } from './BatchHealthView';

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

describe('BatchHealthView', () => {
  beforeEach(() => {
    // Mock fetch for all API endpoints used by this component
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url !== 'string') {
        return Promise.resolve(json({}));
      }

      // Health records endpoint
      if (url.includes('/api/v1/health/journal-entries')) {
        // Component currently doesn't render journal entry specific fields in tests,
        // so an empty paginated object is enough.
        return Promise.resolve(json({ results: [] }));
      }

      // Mortality events endpoint
      if (url.includes('/api/v1/batch/mortality-events')) {
        return Promise.resolve(json({
          results: [
            {
              id: 1,
              event_date: '2025-07-05',
              count: 12,
              cause: 'Environmental',
              description: 'Sudden temperature change',
              container_info: 'Tank A-1'
            },
            {
              id: 2,
              event_date: '2025-07-12',
              count: 15,
              cause: 'Disease',
              description: 'Suspected bacterial infection',
              container_info: 'Tank A-1'
            }
          ]
        }));
      }

      // Health assessments endpoint
      if (url.includes('/api/v1/health/health-sampling-events')) {
        return Promise.resolve(json({
          results: [
            {
              id: 1,
              sampling_date: '2025-07-15',
              sampled_by_username: 'Dr. Smith',
              avg_k_factor: '0.9',
              notes: 'Batch recovering well from previous issues'
            }
          ]
        }));
      }

      // Lab samples endpoint
      if (url.includes('/api/v1/health/health-lab-samples')) {
        return Promise.resolve(json({
          results: [
            {
              id: 1,
              sample_date: '2025-07-10',
              sample_type: 'Water',
              notes: 'Water quality parameters within normal range'
            }
          ]
        }));
      }

      return Promise.resolve(json({}));
    });
  });

  it('renders basic sections and tab navigation', async () => {
    // Render with required props
    renderWithQueryClient(<BatchHealthView batchId={1} batchName="Batch A" />);

    // Verify header is rendered
    const header = await screen.findByText(/Health Status for Batch A/i);
    expect(header).toBeInTheDocument();

    // Check if we're in desktop mode with tabs
    const mortalityTab = screen.queryByRole('tab', { name: /Mortality Events/i });
    
    if (mortalityTab) {
      // Desktop view - click the Mortality Events tab
      await userEvent.click(mortalityTab);
      
      // Verify content specific to Mortality Events tab is displayed
      const mortalityContent = await screen.findByText(/12 mortalities/i);
      expect(mortalityContent).toBeInTheDocument();

      // Click Health Assessments tab
      const assessmentsTab = screen.getByRole('tab', { name: /Health Assessments/i });
      await userEvent.click(assessmentsTab);

      // Verify content specific to Health Assessments tab is displayed
      const assessmentContent = await screen.findByText(/Dr\. Smith/i);
      expect(assessmentContent).toBeInTheDocument();
    } else {
      // Mobile view - tabs are in a select dropdown
      // Just verify that some content is visible
      const healthOverview = await screen.findByText(/Health Overview/i);
      expect(healthOverview).toBeInTheDocument();
    }
  });

  it('handles API error gracefully', async () => {
    // Override fetch mock for health records to return error
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/v1/health/journal-entries')) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }

      // Return empty arrays for other endpoints
      if (url.includes('/api/v1/batch/mortality-events')) {
        return Promise.resolve(json({ results: [] }));
      }
      if (url.includes('/api/v1/health/health-sampling-events')) {
        return Promise.resolve(json({ results: [] }));
      }
      if (url.includes('/api/v1/health/health-lab-samples')) {
        return Promise.resolve(json({ results: [] }));
      }

      return Promise.resolve(json({}));
    });

    // Render with required props
    renderWithQueryClient(<BatchHealthView batchId={1} batchName="Batch A" />);

    // Verify header is still rendered despite the API error
    const header = await screen.findByText(/Health Status for Batch A/i);
    expect(header).toBeInTheDocument();

    // Verify at least one section renders without throwing
    const sections = await screen.findAllByText(/Health Assessments|Lab Results/i);
    expect(sections.length).toBeGreaterThan(0);
  });
});

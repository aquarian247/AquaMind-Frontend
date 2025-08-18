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

      // Health journal entries endpoint
      if (url.includes('/api/v1/health/journal-entries')) {
        return Promise.resolve(json({
          count: 3,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              entry_date: '2025-07-01',
              healthScore: 92,
              mortalityCount: 12,
              notes: 'Regular health check - good condition',
              veterinarian: 'Dr. Smith',
              assessment: {
                behavior: 'Active and responsive',
                physicalCondition: 'Good overall condition',
                growthRate: 12.5
              }
            },
            {
              id: 2,
              entry_date: '2025-07-08',
              healthScore: 88,
              mortalityCount: 15,
              notes: 'Slight decrease in activity levels',
              veterinarian: 'Dr. Johnson',
              assessment: {
                behavior: 'Slightly less active',
                physicalCondition: 'Some minor fin erosion',
                growthRate: 11.8
              }
            },
            {
              id: 3,
              entry_date: '2025-07-15',
              healthScore: 90,
              mortalityCount: 10,
              notes: 'Improved since last check',
              veterinarian: 'Dr. Smith',
              assessment: {
                behavior: 'Normal activity resumed',
                physicalCondition: 'Improving fin condition',
                growthRate: 12.1
              }
            }
          ]
        }));
      }

      if (url.includes('/api/v1/batch/mortality-events')) {
        return Promise.resolve(json({
          count: 2,
          next: null,
          previous: null,
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

      if (url.includes('/api/v1/health/health-sampling-events')) {
        return Promise.resolve(json({
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              sampling_date: '2025-07-15',
              sampled_by_username: 'Dr. Smith',
              healthScore: 90,
              mortalityRate: 0.5,
              avg_k_factor: '0.9',
              notes: 'Batch recovering well from previous issues'
            }
          ]
        }));
      }

      if (url.includes('/api/v1/health/health-lab-samples')) {
        return Promise.resolve(json({
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              sample_date: '2025-07-10',
              sample_type: 'WATER',
              notes: 'Water quality parameters within normal range',
              test_results: {
                oxygen: '8.2 mg/L',
                pH: '7.4'
              }
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
      // Card headline appears in the mortality view
      const mortalityContent = await screen.findByText(/Total Mortality/i);
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
        return Promise.resolve(json({ count: 0, next: null, previous: null, results: [] }));
      }
      if (url.includes('/api/v1/health/health-sampling-events')) {
        return Promise.resolve(json({ count: 0, next: null, previous: null, results: [] }));
      }
      if (url.includes('/api/v1/health/health-lab-samples')) {
        return Promise.resolve(json({ count: 0, next: null, previous: null, results: [] }));
      }

      return Promise.resolve(json({}));
    });

    // Render with required props
    renderWithQueryClient(<BatchHealthView batchId={1} batchName="Batch A" />);

    // Component should display an error state
    const errorMsg = await screen.findByText(/Error loading health data/i);
    expect(errorMsg).toBeInTheDocument();
  });
});

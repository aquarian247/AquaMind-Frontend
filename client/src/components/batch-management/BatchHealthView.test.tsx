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
      if (url.includes('/api/health/records')) {
        return Promise.resolve(json([
          {
            id: 1,
            date: '2025-07-01',
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
            date: '2025-07-08',
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
            date: '2025-07-15',
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
        ]));
      }

      // Mortality events endpoint
      if (url.includes('/api/batch/mortality-events')) {
        return Promise.resolve(json([
          {
            id: 1,
            date: '2025-07-05',
            count: 12,
            cause: 'Environmental',
            description: 'Sudden temperature change',
            containerName: 'Tank A-1'
          },
          {
            id: 2,
            date: '2025-07-12',
            count: 15,
            cause: 'Disease',
            description: 'Suspected bacterial infection',
            containerName: 'Tank A-1'
          }
        ]));
      }

      // Health assessments endpoint
      if (url.includes('/api/health/assessments')) {
        return Promise.resolve(json([
          {
            id: 1,
            date: '2025-07-15',
            veterinarian: 'Dr. Smith',
            healthScore: 90,
            mortalityRate: 0.5,
            growthRate: 12.1,
            behavior: 'Normal activity patterns',
            physicalCondition: 'Good overall condition with minor fin erosion',
            notes: 'Batch recovering well from previous issues'
          }
        ]));
      }

      // Lab samples endpoint
      if (url.includes('/api/health/lab-samples')) {
        return Promise.resolve(json([
          {
            id: 1,
            sampleDate: '2025-07-10',
            sampleType: 'Water',
            labId: 'LAB-2025-0723',
            results: {
              oxygen: '8.2 mg/L',
              pH: '7.4',
              ammonia: '0.02 mg/L'
            },
            notes: 'Water quality parameters within normal range'
          }
        ]));
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
      if (typeof url === 'string' && url.includes('/api/health/records')) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }

      // Return empty arrays for other endpoints
      if (url.includes('/api/batch/mortality-events')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/health/assessments')) {
        return Promise.resolve(json([]));
      }
      if (url.includes('/api/health/lab-samples')) {
        return Promise.resolve(json([]));
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

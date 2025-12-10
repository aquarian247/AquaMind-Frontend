/**
 * Phase 8.5 Polish Feature Tests
 *
 * Tests for:
 * - ProjectionPreviewTooltip component (8.5.5)
 * - FCR metrics display (8.5.6)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ProjectionPreviewTooltip,
  ProjectionPreviewIcon,
} from '../components/ProjectionPreviewTooltip';
import {
  FCR_THRESHOLDS,
  getFCRStatusColor,
  getFCRStatusBgColor,
} from '../pages/VarianceReportPage';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test wrapper with QueryClient
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('ProjectionPreviewTooltip', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children without crashing', () => {
    render(
      <TestWrapper>
        <ProjectionPreviewTooltip activityId={1}>
          <span>Activity Name</span>
        </ProjectionPreviewTooltip>
      </TestWrapper>
    );

    expect(screen.getByText('Activity Name')).toBeInTheDocument();
  });

  it('displays projection data when fetched successfully', async () => {
    const user = userEvent.setup();

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            activity_id: 1,
            due_date: '2025-03-15',
            scenario_id: 1,
            scenario_name: 'Baseline Scenario',
            projected_weight_g: 120.5,
            projected_population: 9200,
            projected_biomass_kg: 1108.6,
            day_number: 90,
            rationale: 'From Baseline Scenario: Day 90, projected 120.5g',
          }),
      })
    );

    render(
      <TestWrapper>
        <ProjectionPreviewTooltip activityId={1}>
          <button>Hover me</button>
        </ProjectionPreviewTooltip>
      </TestWrapper>
    );

    await user.hover(screen.getByRole('button', { name: /hover me/i }));

    // Wait for data to load - use getAllByText since Radix creates duplicates for accessibility
    await waitFor(() => {
      const elements = screen.getAllByText('Baseline Scenario');
      expect(elements.length).toBeGreaterThan(0);
    });

    // Check for projected weight - using regex to find it
    await waitFor(() => {
      expect(screen.getAllByText(/120\.5g/).length).toBeGreaterThan(0);
    });
  });

  it('handles null projection data gracefully', async () => {
    const user = userEvent.setup();

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            activity_id: 1,
            due_date: '2025-03-15',
            scenario_id: 1,
            scenario_name: 'Empty Scenario',
            projected_weight_g: null,
            projected_population: null,
            projected_biomass_kg: null,
            day_number: null,
            rationale: 'Scheduled per Empty Scenario',
          }),
      })
    );

    render(
      <TestWrapper>
        <ProjectionPreviewTooltip activityId={1}>
          <button>Hover me</button>
        </ProjectionPreviewTooltip>
      </TestWrapper>
    );

    await user.hover(screen.getByRole('button', { name: /hover me/i }));

    // Wait for data to load - use getAllByText since Radix creates duplicates
    await waitFor(() => {
      const elements = screen.getAllByText('Empty Scenario');
      expect(elements.length).toBeGreaterThan(0);
    });

    // Should show rationale even without projection data
    await waitFor(() => {
      expect(screen.getAllByText(/Scheduled per Empty Scenario/i).length).toBeGreaterThan(0);
    });
  });
});

describe('ProjectionPreviewIcon', () => {
  it('renders info icon', () => {
    render(
      <TestWrapper>
        <ProjectionPreviewIcon activityId={1} />
      </TestWrapper>
    );

    // Should render a button with info icon
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('FCR Metrics Display', () => {
  // Unit tests for the actual FCR helper functions from VarianceReportPage

  describe('FCR_THRESHOLDS', () => {
    it('should have correct threshold values', () => {
      expect(FCR_THRESHOLDS.excellent).toBe(1.2);
      expect(FCR_THRESHOLDS.acceptable).toBe(1.5);
    });
  });

  describe('getFCRStatusColor', () => {
    it('should return emerald for excellent FCR (<= 1.2)', () => {
      expect(getFCRStatusColor(1.0)).toBe('text-emerald-600');
      expect(getFCRStatusColor(1.2)).toBe('text-emerald-600'); // boundary
    });

    it('should return amber for acceptable FCR (1.2 < fcr <= 1.5)', () => {
      expect(getFCRStatusColor(1.21)).toBe('text-amber-600');
      expect(getFCRStatusColor(1.35)).toBe('text-amber-600');
      expect(getFCRStatusColor(1.5)).toBe('text-amber-600'); // boundary
    });

    it('should return rose for poor FCR (> 1.5)', () => {
      expect(getFCRStatusColor(1.51)).toBe('text-rose-600');
      expect(getFCRStatusColor(1.8)).toBe('text-rose-600');
      expect(getFCRStatusColor(2.5)).toBe('text-rose-600');
    });

    it('should return muted for null FCR', () => {
      expect(getFCRStatusColor(null)).toBe('text-muted-foreground');
    });
  });

  describe('getFCRStatusBgColor', () => {
    it('should return emerald hex for excellent FCR', () => {
      expect(getFCRStatusBgColor(1.0)).toBe('#10b981');
      expect(getFCRStatusBgColor(1.2)).toBe('#10b981'); // boundary
    });

    it('should return amber hex for acceptable FCR', () => {
      expect(getFCRStatusBgColor(1.35)).toBe('#f59e0b');
      expect(getFCRStatusBgColor(1.5)).toBe('#f59e0b'); // boundary
    });

    it('should return red hex for poor FCR', () => {
      expect(getFCRStatusBgColor(1.8)).toBe('#ef4444');
    });

    it('should return slate hex for null FCR', () => {
      expect(getFCRStatusBgColor(null)).toBe('#94a3b8');
    });
  });
});

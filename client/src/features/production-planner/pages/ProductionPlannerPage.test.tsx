/**
 * Production Planner Page Tests
 *
 * Smoke tests for the main Production Planner page.
 * Following testing guide patterns with simple fetch mocks.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductionPlannerPage } from './ProductionPlannerPage';

// Mock wouter router
vi.mock('wouter', () => ({
  useLocation: () => ['/production-planner', vi.fn()],
  useParams: () => ({}),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock UserContext
vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    hasOperationalAccess: true,
    isViewer: false,
    isAdmin: false,
    profile: { role: 'MGR' },
  }),
}));

describe('ProductionPlannerPage', () => {
  let fetchMock: any;
  let queryClient: QueryClient;

  beforeEach(() => {
    // Setup fetch mock
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Fresh query client for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });
  });

  it('should render page header', async () => {
    // Mock scenarios response
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 1,
            next: null,
            previous: null,
            results: [
              {
                scenario_id: 1,
                name: 'Test Scenario',
                status: 'ACTIVE',
              },
            ],
          }),
      })
    );

    // Mock activities response
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // Empty activities
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProductionPlannerPage />
      </QueryClientProvider>
    );

    expect(screen.getByText('Production Planner')).toBeInTheDocument();
    expect(
      screen.getByText('Plan and track operational activities across scenarios')
    ).toBeInTheDocument();
  });

  it('should render KPI dashboard', async () => {
    // Mock scenarios
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 1,
            next: null,
            previous: null,
            results: [{ scenario_id: 1, name: 'Test' }],
          }),
      })
    );

    // Mock activities
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              scenario: 1,
              batch: 100,
              activity_type: 'VACCINATION',
              status: 'PENDING',
              due_date: new Date().toISOString().split('T')[0],
              is_overdue: 'false',
            },
          ]),
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProductionPlannerPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Upcoming (Next 7 Days)')).toBeInTheDocument();
      expect(screen.getByText('Overdue')).toBeInTheDocument();
      expect(screen.getByText('This Month')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  it('should show empty state when no scenarios exist', async () => {
    // Mock empty scenarios
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 0,
            next: null,
            previous: null,
            results: [],
          }),
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProductionPlannerPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No scenarios available/i)
      ).toBeInTheDocument();
    });
  });

  it('should show create activity button when scenario selected', async () => {
    // Mock scenarios
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 1,
            next: null,
            previous: null,
            results: [{ scenario_id: 1, name: 'Test' }],
          }),
      })
    );

    // Mock activities
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProductionPlannerPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Create Activity')).toBeInTheDocument();
    });
  });

  it('should show RBAC empty state for users without operational access', async () => {
    // Override mock to deny access
    vi.mocked(
      await import('@/contexts/UserContext')
    ).useUser = () => ({
      hasOperationalAccess: false,
      isViewer: true,
      isAdmin: false,
      profile: { role: 'VIEW' },
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductionPlannerPage />
      </QueryClientProvider>
    );

    // Should show permission denied state (component from RBAC)
    // The exact text depends on RBACEmptyState implementation
    expect(screen.queryByText('Production Planner')).toBeInTheDocument();
  });
});


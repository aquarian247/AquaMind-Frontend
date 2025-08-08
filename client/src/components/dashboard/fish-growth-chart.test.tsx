import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FishGrowthChart from './fish-growth-chart';
import { api } from '@/lib/api';
import { vi, afterEach } from 'vitest';

// Ensure spies are cleared between tests
afterEach(() => {
  vi.restoreAllMocks();
});

describe('FishGrowthChart', () => {
  it('renders chart with data from API', async () => {
    // Mock successful API response
    vi.spyOn(api, 'getFishGrowthChart').mockResolvedValue({
      labels: ['2025-06-01'],
      datasets: [
        {
          label: 'Average Weight',
          data: [100],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
        },
      ],
    });

    // Create a fresh QueryClient for each test
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });

    // Render component wrapped in QueryClientProvider
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <FishGrowthChart />
      </QueryClientProvider>
    );

    // Wait for data to load and component to render
    expect(await screen.findByText('Fish Growth Rate')).toBeInTheDocument();
    
    // Check heading is present
    expect(screen.getByText('Fish Growth Rate')).toBeInTheDocument();
    
    // Verify canvas element exists (Chart.js is mocked)
    expect(container.querySelector('canvas')).not.toBeNull();
    
    // Ensure no error message is shown
    expect(screen.queryByText('Failed to load fish growth data')).not.toBeInTheDocument();
  });

  it('shows error message when API request fails', async () => {
    // Mock API failure
    vi.spyOn(api, 'getFishGrowthChart').mockRejectedValue(new Error('Network error'));
    
    // Create a fresh QueryClient for each test
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });

    // Render component wrapped in QueryClientProvider
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <FishGrowthChart />
      </QueryClientProvider>
    );

    // Wait for error message to appear
    expect(await screen.findByText('Failed to load fish growth data')).toBeInTheDocument();
    
    // Verify heading is still present
    expect(screen.getByText('Fish Growth Rate')).toBeInTheDocument();
    
    // Ensure no canvas element is rendered in error state
    expect(container.querySelector('canvas')).toBeNull();
  });
});

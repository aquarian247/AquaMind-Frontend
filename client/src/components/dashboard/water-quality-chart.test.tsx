import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WaterQualityChart from './water-quality-chart';
import { api } from '@/lib/api';
import { vi, afterEach } from 'vitest';

// Restore spies between tests
afterEach(() => {
  vi.restoreAllMocks();
});

describe('WaterQualityChart', () => {
  it('renders chart with data from API', async () => {
    // Mock successful API response
    vi.spyOn(api, 'getWaterQualityChart').mockResolvedValue({
      labels: ['2025-07-01'],
      datasets: [
        {
          label: 'Temperature',
          data: [12.5],
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
        <WaterQualityChart />
      </QueryClientProvider>
    );

    // Wait for data to load and component to render
    expect(await screen.findByText('Water Quality Trends')).toBeInTheDocument();
    
    // Check heading is present
    expect(screen.getByText('Water Quality Trends')).toBeInTheDocument();
    
    // Verify canvas element exists (Chart.js is mocked)
    expect(container.querySelector('canvas')).not.toBeNull();
    
    // Ensure no error message is shown
    expect(screen.queryByText('Failed to load water quality data')).not.toBeInTheDocument();
  });

  it('shows error message when API request fails', async () => {
    // Mock failed API response
    vi.spyOn(api, 'getWaterQualityChart').mockRejectedValue(new Error('Network error'));
    
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
        <WaterQualityChart />
      </QueryClientProvider>
    );

    // Wait for error message to appear
    expect(await screen.findByText('Failed to load water quality data')).toBeInTheDocument();
    
    // Verify heading is still present
    expect(screen.getByText('Water Quality Trends')).toBeInTheDocument();
    
    // Ensure no canvas element is rendered in error state
    expect(container.querySelector('canvas')).toBeNull();
  });
});

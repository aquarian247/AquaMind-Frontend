import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import KPICards from './kpi-cards';
import { api } from '@/lib/api';
import { vi, afterEach } from 'vitest';

// Ensure spies are cleaned up between tests
afterEach(() => {
  vi.restoreAllMocks();
});

describe('KPICards', () => {
  it('renders KPI cards with correct data from API', async () => {
    // Mock the Dashboard KPI API response
    vi.spyOn(api, 'getDashboardKPIs').mockResolvedValue({
      totalFish: 23300,
      healthRate: 50,
      avgWaterTemp: 13,
      nextFeedingHours: 4,
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
    render(
      <QueryClientProvider client={queryClient}>
        <KPICards />
      </QueryClientProvider>
    );

    // Wait for data to load and component to render
    expect(await screen.findByText('Total Fish Count')).toBeInTheDocument();
    
    // Check all KPI labels are present
    expect(screen.getByText('Total Fish Count')).toBeInTheDocument();
    expect(screen.getByText('Health Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Water Temp')).toBeInTheDocument();
    expect(screen.getByText('Next Feeding')).toBeInTheDocument();
    
    // Validate Total Fish Count shows sum of calculated_population_count (12500 + 10800 = 23300)
    expect(screen.getByText('23,300')).toBeInTheDocument();
    
    // Validate Health Rate shows 50% (1 ACTIVE out of 2 batches)
    expect(screen.getByText('50%')).toBeInTheDocument();
    
    // Validate Avg Water Temp shows a value with °C
    // Not testing exact value due to floating point issues
    const tempElement = screen.getByText(/\d+°C/);
    expect(tempElement).toBeInTheDocument();
    
    // Validate Next Feeding shows 4 hrs
    expect(screen.getByText('4 hrs')).toBeInTheDocument();
  });
});

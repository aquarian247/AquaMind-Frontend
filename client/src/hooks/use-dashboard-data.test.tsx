import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  useDashboardKPIs, 
  useFishGrowthChart, 
  useWaterQualityChart,
  useFarmSites,
  useActiveAlerts
} from './use-dashboard-data';
import { api } from '@/lib/api';
import { vi, afterEach } from 'vitest';

// Generic test component that renders hook results
function TestComponent<T>({ 
  useHook 
}: { 
  useHook: () => { data: T | undefined; isLoading: boolean; error: Error | null } 
}) {
  const result = useHook();
  
  return (
    <div>
      <div data-testid="loading">{JSON.stringify(result.isLoading)}</div>
      <div data-testid="error">{JSON.stringify(result.error !== null)}</div>
      <div data-testid="data">{JSON.stringify(result.data)}</div>
    </div>
  );
}

// Helper to create a fresh query client for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe('Dashboard Data Hooks', () => {
  // Ensure all spies are cleaned up between tests
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useDashboardKPIs', () => {
    it('returns correct KPI data from API', async () => {
      // Mock successful API response
      vi.spyOn(api, 'getDashboardKPIs').mockResolvedValue({
        totalFish: 23300,
        healthRate: 50,
        avgWaterTemp: 13,
        nextFeedingHours: 4,
      });

      const queryClient = createTestQueryClient();
      
      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent useHook={useDashboardKPIs} />
        </QueryClientProvider>
      );
      
      // Initially loading
      expect(screen.getByTestId('loading').textContent).toBe('true');
      
      // Wait for data to be loaded
      await screen.findByText(/"totalFish":/);
      
      // Verify loading state is false
      expect(screen.getByTestId('loading').textContent).toBe('false');
      
      // Verify error state is false
      expect(screen.getByTestId('error').textContent).toBe('false');
      
      // Get the data and parse it
      const dataElement = screen.getByTestId('data');
      const data = JSON.parse(dataElement.textContent || '{}');
      
      // Verify data structure
      expect(data).toHaveProperty('totalFish');
      expect(data).toHaveProperty('healthRate');
      expect(data).toHaveProperty('avgWaterTemp');
      expect(data).toHaveProperty('nextFeedingHours');
      
      // Verify specific values
      expect(data.totalFish).toBe(23300); // Sum of batch populations (12500 + 10800)
      expect(data.healthRate).toBe(50); // 1 active out of 2 batches
      expect(typeof data.avgWaterTemp).toBe('number');
      expect(typeof data.nextFeedingHours).toBe('number');
    });
  });
  
  describe('useFishGrowthChart', () => {
    it('returns chart data with correct structure', async () => {
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

      const queryClient = createTestQueryClient();
      
      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent useHook={useFishGrowthChart} />
        </QueryClientProvider>
      );
      
      // Wait for data to be loaded
      await screen.findByText(/"labels":/);
      
      // Verify loading state is false
      expect(screen.getByTestId('loading').textContent).toBe('false');
      
      // Verify error state is false
      expect(screen.getByTestId('error').textContent).toBe('false');
      
      // Get the data and parse it
      const dataElement = screen.getByTestId('data');
      const data = JSON.parse(dataElement.textContent || '{}');
      
      // Verify chart data structure
      expect(data).toHaveProperty('labels');
      expect(data).toHaveProperty('datasets');
      expect(Array.isArray(data.labels)).toBe(true);
      expect(Array.isArray(data.datasets)).toBe(true);
      expect(data.labels.length).toBeGreaterThan(0);
      expect(data.datasets.length).toBeGreaterThan(0);
      
      // Verify dataset structure
      const dataset = data.datasets[0];
      expect(dataset).toHaveProperty('label');
      expect(dataset).toHaveProperty('data');
      expect(Array.isArray(dataset.data)).toBe(true);
    });
    
    it('handles API errors correctly', async () => {
      // Mock API failure
      vi.spyOn(api, 'getFishGrowthChart').mockRejectedValue(new Error('Network error'));
      
      const queryClient = createTestQueryClient();
      
      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent useHook={useFishGrowthChart} />
        </QueryClientProvider>
      );
      
      // Wait for error state to be true
      await screen.findByText('true', { selector: '[data-testid="error"]' });
      
      // Verify loading state is false
      expect(screen.getByTestId('loading').textContent).toBe('false');
      
      // Verify data is undefined
      const dataElement = screen.getByTestId('data');
      expect(dataElement.textContent).toBe('');
    });
  });
  
  describe('useWaterQualityChart', () => {
    it('returns water quality chart data with correct structure', async () => {
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

      const queryClient = createTestQueryClient();
      
      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent useHook={useWaterQualityChart} />
        </QueryClientProvider>
      );
      
      // Wait for data to be loaded
      await screen.findByText(/"labels":/);
      
      // Verify loading state is false
      expect(screen.getByTestId('loading').textContent).toBe('false');
      
      // Verify error state is false
      expect(screen.getByTestId('error').textContent).toBe('false');
      
      // Get the data and parse it
      const dataElement = screen.getByTestId('data');
      const data = JSON.parse(dataElement.textContent || '{}');
      
      // Verify chart data structure
      expect(data).toHaveProperty('labels');
      expect(data).toHaveProperty('datasets');
      expect(Array.isArray(data.labels)).toBe(true);
      expect(Array.isArray(data.datasets)).toBe(true);
      expect(data.labels.length).toBeGreaterThan(0);
      expect(data.datasets.length).toBeGreaterThan(0);
      
      // Verify dataset structure
      const dataset = data.datasets[0];
      expect(dataset).toHaveProperty('label');
      expect(dataset).toHaveProperty('data');
      expect(Array.isArray(dataset.data)).toBe(true);
    });
    
    it('handles API errors correctly', async () => {
      // Mock API failure
      vi.spyOn(api, 'getWaterQualityChart').mockRejectedValue(new Error('Network error'));
      
      const queryClient = createTestQueryClient();
      
      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent useHook={useWaterQualityChart} />
        </QueryClientProvider>
      );
      
      // Wait for error state to be true
      await screen.findByText('true', { selector: '[data-testid="error"]' });
      
      // Verify loading state is false
      expect(screen.getByTestId('loading').textContent).toBe('false');
      
      // Verify data is undefined
      const dataElement = screen.getByTestId('data');
      expect(dataElement.textContent).toBe('');
    });
  });
});

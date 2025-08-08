import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a mock QueryClient to prevent actual API calls
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe('App Component', () => {
  it('renders NotFound page when navigating to non-existent route', () => {
    // Set the location to a non-existent route
    window.history.pushState({}, '', '/__test__/non-existent-route');
    
    // Create a fresh QueryClient for each test
    const testQueryClient = createTestQueryClient();
    
    // Render the App component
    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );
    
    // Assert that the NotFound page is rendered
    expect(screen.getByText('404 Page Not Found')).toBeInTheDocument();
  });
});

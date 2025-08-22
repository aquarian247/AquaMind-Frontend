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
  it('redirects to login page when accessing protected route while unauthenticated', () => {
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
    
    /**
     * When unauthenticated, navigating to an unknown route should redirect
     * the user to the login page (not the 404 page) because the route is
     * wrapped in a ProtectedRoute.
     */
    // The login page renders a plain text heading "Sign In" (not an actual <h*> element),
    // so we query it using getByText instead of getByRole.
    // There are multiple elements containing the text "Sign In" (heading + button).
    // Use getAllByText and ensure we have at least one match.
    expect(screen.getAllByText(/sign in/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();
  });
});

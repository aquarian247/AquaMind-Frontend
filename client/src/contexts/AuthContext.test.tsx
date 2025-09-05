import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock all external dependencies
vi.mock('jwt-decode');
vi.mock('@/api/generated');
vi.mock('@/api');

// Simple test component
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="isLoading">{auth.isLoading.toString()}</div>
      <div data-testid="error">{auth.error || 'null'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  it('should provide authentication context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuthenticated')).toBeInTheDocument();
    expect(screen.getByTestId('isLoading')).toBeInTheDocument();
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('should start in unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });

  it('should provide authentication methods', () => {
    const TestMethodsComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <button onClick={() => auth.login('test', 'test')}>Login</button>
          <button onClick={auth.logout}>Logout</button>
          <button onClick={auth.clearError}>Clear Error</button>
          <div data-testid="has-permission">{auth.hasPermission('test').toString()}</div>
          <div data-testid="is-admin">{auth.isAdmin().toString()}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestMethodsComponent />
      </AuthProvider>
    );

    // Test that methods are available and return expected types
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Clear Error')).toBeInTheDocument();
    expect(screen.getByTestId('has-permission')).toHaveTextContent('false');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
  });
});

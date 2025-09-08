import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock all external dependencies to prevent any real API calls or async operations
vi.mock('jwt-decode');
vi.mock('@/api');
vi.mock('@/services/auth.service');
vi.mock('@/api/generated');

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock global fetch to prevent real API calls
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Test component that consumes auth context
const TestComponent = ({ onLogin, onLogout, onRefresh }: {
  onLogin?: () => void;
  onLogout?: () => void;
  onRefresh?: () => void;
}) => {
  const auth = useAuth();

  const handleLogin = async () => {
    await auth.login('testuser', 'testpass');
    onLogin?.();
  };

  const handleLogout = () => {
    auth.logout();
    onLogout?.();
  };

  const handleRefresh = async () => {
    await auth.refreshToken();
    onRefresh?.();
  };

  return (
    <div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="isLoading">{auth.isLoading.toString()}</div>
      <div data-testid="error">{auth.error || 'null'}</div>
      <div data-testid="user-id">{auth.user?.id || 'null'}</div>
      <div data-testid="access-token">{auth.tokenInfo.accessToken || 'null'}</div>
      <button data-testid="login-btn" onClick={handleLogin}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <button data-testid="refresh-btn" onClick={handleRefresh}>
        Refresh
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Provider and Context', () => {
    it('should render AuthProvider and provide context to children', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Just verify the component renders - the AuthContext will initialize
      // but we don't need to wait for async operations in this basic test
      expect(screen.getByTestId('isAuthenticated')).toBeInTheDocument();
      expect(screen.getByTestId('isLoading')).toBeInTheDocument();
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('should provide authentication methods in context', () => {
      const TestMethods = () => {
        const auth = useAuth();
        return (
          <div>
            <div data-testid="has-login">{typeof auth.login === 'function' ? 'function' : 'not-function'}</div>
            <div data-testid="has-logout">{typeof auth.logout === 'function' ? 'function' : 'not-function'}</div>
            <div data-testid="has-refresh">{typeof auth.refreshToken === 'function' ? 'function' : 'not-function'}</div>
            <div data-testid="has-permission">{typeof auth.hasPermission === 'function' ? 'function' : 'not-function'}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestMethods />
        </AuthProvider>
      );

      expect(screen.getByTestId('has-login')).toHaveTextContent('function');
      expect(screen.getByTestId('has-logout')).toHaveTextContent('function');
      expect(screen.getByTestId('has-refresh')).toHaveTextContent('function');
      expect(screen.getByTestId('has-permission')).toHaveTextContent('function');
    });
  });

  describe('Permission Methods', () => {
    it('should provide working permission methods', () => {
      const TestPermComponent = () => {
        const auth = useAuth();
        return (
          <div>
            <div data-testid="has-permission">{auth.hasPermission('test').toString()}</div>
            <div data-testid="is-admin">{auth.isAdmin().toString()}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestPermComponent />
        </AuthProvider>
      );

      // Permission methods should return false when not authenticated
      expect(screen.getByTestId('has-permission')).toHaveTextContent('false');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    });
  });

  describe('Error Handling', () => {
    it('should provide error state management', () => {
      const TestErrorComponent = () => {
        const auth = useAuth();
        return (
          <div>
            <div data-testid="error-state">{auth.error || 'no-error'}</div>
            <button data-testid="clear-error-btn" onClick={auth.clearError}>
              Clear Error
            </button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestErrorComponent />
        </AuthProvider>
      );

      // Should start with no error
      expect(screen.getByTestId('error-state')).toHaveTextContent('no-error');

      // Should provide clearError method
      expect(screen.getByTestId('clear-error-btn')).toBeInTheDocument();
    });
  });
});

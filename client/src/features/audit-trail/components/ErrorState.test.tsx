import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState, NetworkErrorState, PermissionErrorState, NotFoundErrorState } from './ErrorState';

// Mock environment for development mode testing
const originalEnv = process.env.NODE_ENV;

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

afterEach(() => {
  process.env.NODE_ENV = originalEnv;
});

describe('ErrorState', () => {
  describe('status code handling', () => {
    it('should render 400 Bad Request error', () => {
      render(<ErrorState statusCode={400} />);

      expect(screen.getByText('Bad Request')).toBeInTheDocument();
      expect(screen.getByText('The request was invalid. Please check your filters and try again.')).toBeInTheDocument();
    });

    it('should render 401 Authentication error', () => {
      render(<ErrorState statusCode={401} />);

      expect(screen.getByText('Authentication Required')).toBeInTheDocument();
      expect(screen.getByText('Your session has expired. Please log in again to continue.')).toBeInTheDocument();
    });

    it('should render 403 Forbidden error', () => {
      render(<ErrorState statusCode={403} />);

      expect(screen.getByText('Access Forbidden')).toBeInTheDocument();
      expect(screen.getByText('You don\'t have permission to view audit trail data. Please contact your administrator.')).toBeInTheDocument();
    });

    it('should render 404 Not Found error', () => {
      render(<ErrorState statusCode={404} />);

      expect(screen.getByText('Data Not Found')).toBeInTheDocument();
      expect(screen.getByText('The requested audit trail data could not be found. It may have been deleted or moved.')).toBeInTheDocument();
    });

    it('should render 429 Too Many Requests error', () => {
      render(<ErrorState statusCode={429} />);

      expect(screen.getByText('Too Many Requests')).toBeInTheDocument();
      expect(screen.getByText('You\'ve made too many requests. Please wait a moment before trying again.')).toBeInTheDocument();
    });

    it('should render 500 Server error', () => {
      render(<ErrorState statusCode={500} />);

      expect(screen.getByText('Server Error')).toBeInTheDocument();
      expect(screen.getByText('The server encountered an error while processing your request. Please try again later.')).toBeInTheDocument();
    });

    it('should render default network error for unknown status', () => {
      render(<ErrorState statusCode={999} />);

      expect(screen.getByText('Connection Error')).toBeInTheDocument();
      expect(screen.getByText('Unable to load audit trail data. Please check your internet connection and try again.')).toBeInTheDocument();
    });

    it('should render default network error when no status code', () => {
      render(<ErrorState />);

      expect(screen.getByText('Connection Error')).toBeInTheDocument();
    });
  });

  describe('error parsing', () => {
    it('should extract status code from error message', () => {
      const error = new Error('Request failed with status 404: Not Found');
      render(<ErrorState error={error} />);

      expect(screen.getByText('Data Not Found')).toBeInTheDocument();
    });

    it('should extract status code from error status property', () => {
      const error = { status: 403, message: 'Forbidden' };
      render(<ErrorState error={error} />);

      expect(screen.getByText('Access Forbidden')).toBeInTheDocument();
    });
  });

  describe('custom props', () => {
    it('should use custom title and message', () => {
      render(<ErrorState title="Custom Error" message="Custom message" />);

      expect(screen.getByText('Custom Error')).toBeInTheDocument();
      expect(screen.getByText('Custom message')).toBeInTheDocument();
    });

  });

  describe('retry functionality', () => {
    it('should show retry button when onRetry is provided and showRetry is true', () => {
      const onRetry = vi.fn();
      render(<ErrorState onRetry={onRetry} showRetry={true} />);

      const retryButton = screen.getByRole('button', { name: /Retry loading audit trail data/ });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveTextContent('Try Again');

      fireEvent.click(retryButton);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should hide retry button when showRetry is false', () => {
      const onRetry = vi.fn();
      render(<ErrorState onRetry={onRetry} showRetry={false} />);

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    it('should hide retry button when onRetry is not provided', () => {
      render(<ErrorState showRetry={true} />);

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {

    it('should have accessible retry button', () => {
      const onRetry = vi.fn();
      render(<ErrorState onRetry={onRetry} message="Test error" />);

      const retryButton = screen.getByRole('button');
      expect(retryButton).toHaveAttribute('aria-label', 'Retry loading audit trail data: Test error');
    });
  });

  describe('development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should show error details in development mode', () => {
      const error = new Error('Test error message');
      render(<ErrorState error={error} />);

      expect(screen.getByText('Error Details (Dev Mode)')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should show stack trace in development mode', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at testFunction (test.js:1:1)';
      render(<ErrorState error={error} />);

      expect(screen.getByText(/at testFunction/)).toBeInTheDocument();
    });

    it('should not show error details in production mode', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Test error message');
      render(<ErrorState error={error} />);

      expect(screen.queryByText('Error Details (Dev Mode)')).not.toBeInTheDocument();
    });
  });

  describe('specialized components', () => {
    describe('NetworkErrorState', () => {
      it('should render network error with retry', () => {
        const onRetry = vi.fn();
        render(<NetworkErrorState onRetry={onRetry} />);

        expect(screen.getByText('Network Error')).toBeInTheDocument();
        expect(screen.getByText('Unable to connect to the server. Please check your internet connection and try again.')).toBeInTheDocument();

        const retryButton = screen.getByText('Try Again');
        fireEvent.click(retryButton);
        expect(onRetry).toHaveBeenCalled();
      });
    });

    describe('PermissionErrorState', () => {
      it('should render 403 error without retry', () => {
        render(<PermissionErrorState />);

        expect(screen.getByText('Access Forbidden')).toBeInTheDocument();
        expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
      });
    });

    describe('NotFoundErrorState', () => {
      it('should render 404 error without retry', () => {
        render(<NotFoundErrorState />);

        expect(screen.getByText('Data Not Found')).toBeInTheDocument();
        expect(screen.getByText('The audit trail record you\'re looking for could not be found.')).toBeInTheDocument();
        expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
      });
    });
  });
});

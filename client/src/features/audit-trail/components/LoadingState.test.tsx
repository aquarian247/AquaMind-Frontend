import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState, TableLoadingState, PageLoadingState } from './LoadingState';

describe('LoadingState', () => {
  describe('spinner variant', () => {
    it('should render spinner with default message', () => {
      render(<LoadingState variant="spinner" />);

      const container = screen.getByRole('status', { name: 'Loading...' });
      expect(container).toBeInTheDocument();

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render spinner with custom message', () => {
      render(<LoadingState variant="spinner" message="Custom loading message" />);

      expect(screen.getByRole('status', { name: 'Custom loading message' })).toBeInTheDocument();
      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<LoadingState variant="spinner" className="custom-class" />);

      const container = screen.getByRole('status');
      expect(container).toHaveClass('custom-class');
    });

    it('should have correct accessibility attributes', () => {
      render(<LoadingState variant="spinner" message="Test loading" />);

      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('aria-live', 'polite');
      expect(container).toHaveAttribute('aria-label', 'Test loading');

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('skeleton variant', () => {
    it('should render skeleton placeholders', () => {
      render(<LoadingState variant="skeleton" />);

      const container = screen.getByRole('status', { name: 'Loading...' });
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('space-y-4');

      const skeletons = container.querySelectorAll('[aria-hidden="true"]');
      expect(skeletons).toHaveLength(3);
      expect(skeletons[0]).toHaveClass('h-4', 'w-full');
      expect(skeletons[1]).toHaveClass('h-4', 'w-3/4');
      expect(skeletons[2]).toHaveClass('h-4', 'w-1/2');
    });

    it('should render skeleton with custom message', () => {
      render(<LoadingState variant="skeleton" message="Loading data..." />);

      expect(screen.getByRole('status', { name: 'Loading data...' })).toBeInTheDocument();
    });
  });

  describe('skeleton-table variant', () => {
    it('should render table skeleton with default rows', () => {
      render(<LoadingState variant="skeleton-table" />);

      const container = screen.getByRole('status', { name: 'Loading...' });
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('rounded-md', 'border');

      // Header skeleton
      const headerSkeletons = container.querySelectorAll('[aria-hidden="true"]');
      expect(headerSkeletons.length).toBeGreaterThan(6); // 6 header + 5 rows * 6 columns

      // Should have 5 rows by default (plus header)
      const rowContainers = container.querySelectorAll('[class*="border-b"]');
      expect(rowContainers).toHaveLength(6); // 1 header + 5 rows
    });

    it('should render table skeleton with custom row count', () => {
      render(<LoadingState variant="skeleton-table" rows={3} />);

      const container = screen.getByRole('status');
      const rowContainers = container.querySelectorAll('[class*="border-b"]');
      expect(rowContainers).toHaveLength(4); // 1 header + 3 rows
    });

    it('should have table structure', () => {
      render(<LoadingState variant="skeleton-table" />);

      const container = screen.getByRole('status');
      expect(container).toHaveClass('border');

      // Header section
      const header = container.querySelector('[class*="border-b"]');
      expect(header).toBeInTheDocument();

      // Row sections
      const rows = container.querySelectorAll('[class*="border-b"][class*="last:border-b-0"]');
      expect(rows).toHaveLength(5);
    });
  });

  describe('default behavior', () => {
    it('should default to spinner variant', () => {
      render(<LoadingState />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should handle unknown variant gracefully', () => {
      render(<LoadingState variant={undefined as any} />);

      // Should default to spinner
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });
});

describe('TableLoadingState', () => {
  it('should render with default props', () => {
    render(<TableLoadingState />);

    const container = screen.getByRole('status', { name: 'Loading audit trail records...' });
    expect(container).toBeInTheDocument();

    const rowContainers = container.querySelectorAll('[class*="border-b"]');
    expect(rowContainers).toHaveLength(6); // 1 header + 5 rows
  });

  it('should accept custom row count', () => {
    render(<TableLoadingState rows={3} />);

    const container = screen.getByRole('status');
    const rowContainers = container.querySelectorAll('[class*="border-b"]');
    expect(rowContainers).toHaveLength(4); // 1 header + 3 rows
  });

  it('should apply custom className', () => {
    render(<TableLoadingState className="custom-table-class" />);

    const container = screen.getByRole('status');
    expect(container).toHaveClass('custom-table-class');
  });
});

describe('PageLoadingState', () => {
  it('should render centered loading state', () => {
    render(<PageLoadingState />);

    const outerContainer = screen.getByText('Loading audit trail...').closest('.min-h-\\[400px\\]');
    expect(outerContainer).toHaveClass('flex', 'items-center', 'justify-center');

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<PageLoadingState className="custom-page-class" />);

    const container = screen.getByText('Loading audit trail...').closest('.min-h-\\[400px\\]');
    expect(container).toHaveClass('custom-page-class');
  });
});

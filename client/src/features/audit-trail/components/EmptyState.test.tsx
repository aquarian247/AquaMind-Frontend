import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';
import { FileX } from 'lucide-react';

describe('EmptyState', () => {
  it('should render with default message', () => {
    render(<EmptyState />);

    expect(screen.getByText('No Data Available')).toBeInTheDocument();
    expect(screen.getByText(/No history records found for the selected filters/)).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your search criteria/)).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    const customMessage = 'Custom empty message';
    render(<EmptyState message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByText(/No history records found for the selected filters/)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<EmptyState className="custom-class" />);

    const container = screen.getByRole('status');
    expect(container).toHaveClass('custom-class');
  });

  it('should have correct accessibility attributes', () => {
    render(<EmptyState message="Test message" />);

    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-live', 'polite');
    expect(container).toHaveAttribute('aria-label', 'Test message');
  });


  it('should have proper semantic structure', () => {
    render(<EmptyState />);

    const container = screen.getByRole('status');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('No Data Available');
    expect(heading).toHaveClass('text-lg', 'font-medium', 'text-muted-foreground');

    const description = screen.getByText(/No history records found for the selected filters/);
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('should be centered and responsive', () => {
    render(<EmptyState />);

    const container = screen.getByRole('status');
    expect(container).toHaveClass('py-12', 'px-4', 'text-center');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypeBadge } from './TypeBadge';

describe('TypeBadge', () => {
  it('should render Created badge for "+" type', () => {
    render(<TypeBadge type="+" />);

    const badge = screen.getByRole('status', { name: 'Change type: Created' });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Created');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'border-green-200');
  });

  it('should render Updated badge for "~" type', () => {
    render(<TypeBadge type="~" />);

    const badge = screen.getByRole('status', { name: 'Change type: Updated' });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Updated');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'border-blue-200');
  });

  it('should render Deleted badge for "-" type', () => {
    render(<TypeBadge type="-" />);

    const badge = screen.getByRole('status', { name: 'Change type: Deleted' });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Deleted');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'border-red-200');
  });

  it('should render Unknown badge for invalid type', () => {
    render(<TypeBadge type={'' as any} />);

    const badge = screen.getByRole('status', { name: 'Change type: Unknown' });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Unknown');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800', 'border-gray-200');
  });

  it('should apply custom className', () => {
    render(<TypeBadge type="+" className="custom-class" />);

    const badge = screen.getByRole('status');
    expect(badge).toHaveClass('custom-class');
  });

  it('should have correct accessibility attributes', () => {
    render(<TypeBadge type="+" />);

    const badge = screen.getByRole('status');
    expect(badge).toHaveAttribute('aria-label', 'Change type: Created');
  });

  it('should use outline variant', () => {
    render(<TypeBadge type="+" />);

    const badge = screen.getByRole('status');
    expect(badge).toHaveClass('border'); // outline variant typically has border
  });
});

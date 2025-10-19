/**
 * FacilityHealthBadge Component - Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FacilityHealthBadge, FacilityHealthDot } from './FacilityHealthBadge';

describe('FacilityHealthBadge', () => {
  it('should render success badge', () => {
    render(<FacilityHealthBadge level="success" />);

    const badge = screen.getByLabelText(/Health status: Good/);
    expect(badge).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('should render warning badge', () => {
    render(<FacilityHealthBadge level="warning" />);

    const badge = screen.getByLabelText(/Health status: Caution/);
    expect(badge).toBeInTheDocument();
    expect(screen.getByText('Caution')).toBeInTheDocument();
  });

  it('should render danger badge', () => {
    render(<FacilityHealthBadge level="danger" />);

    const badge = screen.getByLabelText(/Health status: Critical/);
    expect(badge).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('should render info badge', () => {
    render(<FacilityHealthBadge level="info" />);

    const badge = screen.getByLabelText(/Health status: N\/A/);
    expect(badge).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should render with icon when showIcon is true', () => {
    const { container } = render(<FacilityHealthBadge level="success" showIcon />);

    // Check for SVG icon (lucide-react renders as svg)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should not render icon when showIcon is false', () => {
    const { container } = render(<FacilityHealthBadge level="success" showIcon={false} />);

    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('should hide label when showLabel is false', () => {
    render(<FacilityHealthBadge level="success" showLabel={false} />);

    expect(screen.queryByText('Good')).not.toBeInTheDocument();
    // But aria-label should still exist
    expect(screen.getByLabelText(/Health status: Good/)).toBeInTheDocument();
  });

  it('should render with both icon and label', () => {
    const { container } = render(
      <FacilityHealthBadge level="warning" showIcon showLabel />
    );

    expect(screen.getByText('Caution')).toBeInTheDocument();
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FacilityHealthBadge level="success" className="custom-badge" />
    );

    const badge = container.querySelector('.custom-badge');
    expect(badge).toBeInTheDocument();
  });

  it('should apply correct color classes for success', () => {
    const { container } = render(<FacilityHealthBadge level="success" />);

    const badge = container.querySelector('.bg-green-100');
    expect(badge).toBeInTheDocument();
  });

  it('should apply correct color classes for warning', () => {
    const { container } = render(<FacilityHealthBadge level="warning" />);

    const badge = container.querySelector('.bg-yellow-100');
    expect(badge).toBeInTheDocument();
  });

  it('should apply correct color classes for danger', () => {
    const { container } = render(<FacilityHealthBadge level="danger" />);

    const badge = container.querySelector('.bg-red-100');
    expect(badge).toBeInTheDocument();
  });

  it('should apply correct color classes for info', () => {
    const { container } = render(<FacilityHealthBadge level="info" />);

    const badge = container.querySelector('.bg-gray-100');
    expect(badge).toBeInTheDocument();
  });
});

describe('FacilityHealthDot', () => {
  it('should render success dot', () => {
    const { container } = render(<FacilityHealthDot level="success" />);

    const dot = screen.getByLabelText(/Health: Good/);
    expect(dot).toBeInTheDocument();
    expect(dot.classList.contains('bg-green-500')).toBe(true);
  });

  it('should render warning dot', () => {
    const { container } = render(<FacilityHealthDot level="warning" />);

    const dot = screen.getByLabelText(/Health: Caution/);
    expect(dot).toBeInTheDocument();
    expect(dot.classList.contains('bg-yellow-500')).toBe(true);
  });

  it('should render danger dot', () => {
    const { container } = render(<FacilityHealthDot level="danger" />);

    const dot = screen.getByLabelText(/Health: Critical/);
    expect(dot).toBeInTheDocument();
    expect(dot.classList.contains('bg-red-500')).toBe(true);
  });

  it('should render info dot', () => {
    const { container } = render(<FacilityHealthDot level="info" />);

    const dot = screen.getByLabelText(/Health: N\/A/);
    expect(dot).toBeInTheDocument();
    expect(dot.classList.contains('bg-gray-400')).toBe(true);
  });

  it('should apply custom className to dot', () => {
    const { container } = render(
      <FacilityHealthDot level="success" className="custom-dot" />
    );

    const dot = container.querySelector('.custom-dot');
    expect(dot).toBeInTheDocument();
  });

  it('should have title attribute for tooltip', () => {
    render(<FacilityHealthDot level="success" />);

    const dot = screen.getByLabelText(/Health: Good/);
    expect(dot).toHaveAttribute('title', 'Good');
  });
});


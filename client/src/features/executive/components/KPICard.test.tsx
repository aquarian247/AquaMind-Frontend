/**
 * KPICard Component - Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard, KPICardSkeleton } from './KPICard';
import type { KPIData } from '../types';

describe('KPICard', () => {
  it('should render basic KPI with value and unit', () => {
    const data: KPIData = {
      title: 'Total Biomass',
      value: 50000,
      unit: 'kg',
    };

    render(<KPICard data={data} />);

    expect(screen.getByText('Total Biomass')).toBeInTheDocument();
    expect(screen.getByText(/50,000 kg/)).toBeInTheDocument();
  });

  it('should render N/A for null value', () => {
    const data: KPIData = {
      title: 'Missing Data',
      value: null,
      unit: 'kg',
    };

    render(<KPICard data={data} />);

    expect(screen.getByText('Missing Data')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should render upward trend indicator', () => {
    const data: KPIData = {
      title: 'Average Weight',
      value: 550,
      unit: 'g',
      trend: {
        direction: 'up',
        percentage: 12.5,
        period: 'vs last week',
      },
    };

    render(<KPICard data={data} />);

    expect(screen.getByText(/550 g/)).toBeInTheDocument();
    expect(screen.getByText(/12.5 %/)).toBeInTheDocument(); // Note: space before %
    expect(screen.getByText('vs last week')).toBeInTheDocument();
    expect(screen.getByLabelText(/Trending up/)).toBeInTheDocument();
  });

  it('should render downward trend indicator', () => {
    const data: KPIData = {
      title: 'Mortality',
      value: 1.5,
      unit: '%',
      trend: {
        direction: 'down',
        percentage: 8.2,
        period: 'vs last month',
      },
    };

    render(<KPICard data={data} />);

    expect(screen.getByText(/1.5 %/)).toBeInTheDocument(); // Note: space before %
    expect(screen.getByText(/8.2 %/)).toBeInTheDocument(); // Note: space before %
    expect(screen.getByLabelText(/Trending down/)).toBeInTheDocument();
  });

  it('should render stable trend indicator', () => {
    const data: KPIData = {
      title: 'FCR',
      value: 1.15,
      unit: '',
      trend: {
        direction: 'stable',
        percentage: 0.5,
      },
    };

    render(<KPICard data={data} />);

    expect(screen.getByText(/1.2/)).toBeInTheDocument(); // Formatted to 1 decimal
    expect(screen.getByLabelText(/Stable/)).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    const data: KPIData = {
      title: 'Total Population',
      value: 1500000,
      unit: 'fish',
      subtitle: 'Across all facilities',
    };

    render(<KPICard data={data} />);

    expect(screen.getByText('Across all facilities')).toBeInTheDocument();
  });

  it('should render without trend indicator when not provided', () => {
    const data: KPIData = {
      title: 'Simple KPI',
      value: 100,
      unit: 'units',
    };

    render(<KPICard data={data} />);

    expect(screen.getByText('Simple KPI')).toBeInTheDocument();
    expect(screen.getByText(/100 units/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Trend/)).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const data: KPIData = {
      title: 'Test',
      value: 42,
      unit: '',
    };

    const { container } = render(<KPICard data={data} className="custom-class" />);
    
    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('should format large numbers with thousand separators', () => {
    const data: KPIData = {
      title: 'Large Number',
      value: 1234567.89,
      unit: 'kg',
    };

    render(<KPICard data={data} />);

    expect(screen.getByText(/1,234,567.9 kg/)).toBeInTheDocument();
  });

  it('should render aria-labels for accessibility', () => {
    const data: KPIData = {
      title: 'Accessible KPI',
      value: 100,
      unit: 'kg',
      trend: {
        direction: 'up',
        percentage: 10,
        period: 'vs last week',
      },
    };

    render(<KPICard data={data} />);

    expect(screen.getByLabelText(/Accessible KPI: 100 kg/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Trend: up 10%/)).toBeInTheDocument();
  });
});

describe('KPICardSkeleton', () => {
  it('should render loading skeleton', () => {
    const { container } = render(<KPICardSkeleton />);
    
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should apply custom className to skeleton', () => {
    const { container } = render(<KPICardSkeleton className="custom-skeleton" />);
    
    const skeleton = container.querySelector('.custom-skeleton');
    expect(skeleton).toBeInTheDocument();
  });
});


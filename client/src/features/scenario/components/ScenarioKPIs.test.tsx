/**
 * Tests for ScenarioKPIs component
 * 
 * TASK 7: Server-Side Aggregation Testing
 * - Tests KPI display with real data
 * - Tests honest fallbacks (N/A) when data is unavailable
 * - Tests loading states
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScenarioKPIs } from './ScenarioKPIs';
import type { ScenarioPlanningKPIs } from '../hooks/useScenarioData';

describe('ScenarioKPIs', () => {
  const mockKpis: ScenarioPlanningKPIs = {
    totalActiveScenarios: 10,
    scenariosInProgress: 3,
    completedProjections: 7,
    averageProjectionDuration: 195.5,
  };

  it('should render loading state', () => {
    render(<ScenarioKPIs kpis={mockKpis} isLoading={true} />);
    
    // Check for animated skeleton cards
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(4);
  });

  it('should render KPIs with real data', () => {
    render(<ScenarioKPIs kpis={mockKpis} isLoading={false} />);
    
    // Verify all KPI cards are rendered
    expect(screen.getByText('Active Scenarios')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Avg Duration')).toBeInTheDocument();

    // Verify KPI values are displayed
    expect(screen.getByText('10')).toBeInTheDocument(); // totalActiveScenarios
    expect(screen.getByText('3')).toBeInTheDocument(); // scenariosInProgress
    expect(screen.getByText('7')).toBeInTheDocument(); // completedProjections
    expect(screen.getByText('196')).toBeInTheDocument(); // averageProjectionDuration (rounded)
  });

  it('should display N/A for average duration when zero', () => {
    const zeroKpis: ScenarioPlanningKPIs = {
      totalActiveScenarios: 5,
      scenariosInProgress: 2,
      completedProjections: 3,
      averageProjectionDuration: 0,
    };

    render(<ScenarioKPIs kpis={zeroKpis} isLoading={false} />);
    
    // Verify zero duration shows N/A (honest fallback)
    expect(screen.getByText('N/A')).toBeInTheDocument();
    
    // Verify other KPIs display normally
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display zero scenarios correctly (not N/A)', () => {
    const zeroScenariosKpis: ScenarioPlanningKPIs = {
      totalActiveScenarios: 0,
      scenariosInProgress: 0,
      completedProjections: 0,
      averageProjectionDuration: 0,
    };

    render(<ScenarioKPIs kpis={zeroScenariosKpis} isLoading={false} />);
    
    // Verify zeros are displayed (valid data, not missing data)
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBe(3); // Three zero counts
    
    // Average duration should be N/A when zero
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should round average duration to nearest integer', () => {
    const decimalKpis: ScenarioPlanningKPIs = {
      totalActiveScenarios: 8,
      scenariosInProgress: 2,
      completedProjections: 6,
      averageProjectionDuration: 187.7,
    };

    render(<ScenarioKPIs kpis={decimalKpis} isLoading={false} />);
    
    // Verify rounding (187.7 → 188)
    expect(screen.getByText('188')).toBeInTheDocument();
  });

  it('should render proper card structure', () => {
    render(<ScenarioKPIs kpis={mockKpis} isLoading={false} />);
    
    // Verify grid layout
    const grid = document.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('gap-4', 'md:grid-cols-2', 'lg:grid-cols-4');

    // Verify cards have proper structure
    const cards = document.querySelectorAll('[class*="card"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should display proper subtitles', () => {
    render(<ScenarioKPIs kpis={mockKpis} isLoading={false} />);
    
    // Verify subtitles (not hardcoded placeholders like "+2 from last month")
    expect(screen.getByText('Total scenarios')).toBeInTheDocument();
    expect(screen.getByText('Currently running')).toBeInTheDocument();
    expect(screen.getByText('Total projections')).toBeInTheDocument();
    expect(screen.getByText('days per scenario')).toBeInTheDocument();
    
    // Verify no hardcoded placeholders exist
    expect(screen.queryByText('+2 from last month')).not.toBeInTheDocument();
  });

  it('should render icons for each KPI card', () => {
    const { container } = render(<ScenarioKPIs kpis={mockKpis} isLoading={false} />);
    
    // Verify icons are rendered (lucide-react icons have specific attributes)
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBe(4); // One icon per card
  });
});


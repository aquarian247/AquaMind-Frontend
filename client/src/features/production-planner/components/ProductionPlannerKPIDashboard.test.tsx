/**
 * Production Planner KPI Dashboard Tests
 *
 * Smoke tests for the KPI dashboard component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ProductionPlannerKPIDashboard } from './ProductionPlannerKPIDashboard';
import type { PlannedActivity } from '../types';

// Mock activity factory
function createMockActivity(overrides: Partial<PlannedActivity> = {}): PlannedActivity {
  return {
    id: 1,
    scenario: 100,
    scenario_name: 'Test Scenario',
    batch: 200,
    batch_number: 'TEST-001',
    activity_type: 'VACCINATION',
    activity_type_display: 'Vaccination',
    due_date: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    status_display: 'Pending',
    container: null,
    container_name: null,
    notes: null,
    created_by: 1,
    created_by_name: 'Test User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: null,
    completed_by: null,
    completed_by_name: '',
    transfer_workflow: null,
    is_overdue: 'false',
    ...overrides,
  };
}

describe('ProductionPlannerKPIDashboard', () => {
  it('should render all 4 KPI cards', () => {
    render(
      <ProductionPlannerKPIDashboard 
        activities={[]} 
        onFilterChange={vi.fn()}
      />
    );

    expect(screen.getByText('Upcoming (Next 7 Days)')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should display correct counts', () => {
    const activities = [
      createMockActivity({ status: 'COMPLETED' }),
      createMockActivity({ status: 'COMPLETED' }),
      createMockActivity({ status: 'PENDING', is_overdue: 'true' }),
    ];

    render(
      <ProductionPlannerKPIDashboard 
        activities={activities} 
        onFilterChange={vi.fn()}
      />
    );

    // Find the completed count (should be 2)
    const completedCards = screen.getAllByText('2');
    expect(completedCards.length).toBeGreaterThan(0);
  });

  it('should call onFilterChange when card is clicked', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(
      <ProductionPlannerKPIDashboard 
        activities={[]} 
        onFilterChange={onFilterChange}
      />
    );

    // Click the Overdue card
    const overdueCard = screen.getByText('Overdue').closest('.cursor-pointer');
    if (overdueCard) {
      await user.click(overdueCard);
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          statuses: ['PENDING'],
          showOverdueOnly: true,
        })
      );
    }
  });

  it('should display zero for empty activities', () => {
    render(
      <ProductionPlannerKPIDashboard 
        activities={[]} 
        onFilterChange={vi.fn()}
      />
    );

    // All KPI counts should be 0
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(4); // 4 KPI cards
  });
});






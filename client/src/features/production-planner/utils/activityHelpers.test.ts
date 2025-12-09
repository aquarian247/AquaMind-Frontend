/**
 * Activity Helpers Tests
 *
 * Unit tests for production planner utility functions.
 */

import { describe, it, expect } from 'vitest';
import { addDays, subDays, startOfToday, startOfMonth, endOfMonth } from 'date-fns';
import {
  calculateActivityKPIs,
  isActivityOverdue,
  filterActivities,
  groupActivitiesByBatch,
  sortActivitiesByDueDate,
  canMarkCompleted,
  canSpawnWorkflow,
  getActivityTypeBadgeVariant,
  getStatusBadgeVariant,
} from './activityHelpers';
import type { PlannedActivity, ActivityFilters } from '../types';

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

describe('calculateActivityKPIs', () => {
  it('should calculate upcoming activities (next 7 days)', () => {
    const today = startOfToday();
    const activities = [
      createMockActivity({ due_date: addDays(today, 1).toISOString().split('T')[0] }),
      createMockActivity({ due_date: addDays(today, 5).toISOString().split('T')[0] }),
      createMockActivity({ due_date: addDays(today, 10).toISOString().split('T')[0] }), // Outside 7 days
    ];

    const kpis = calculateActivityKPIs(activities);
    expect(kpis.upcoming).toBe(2);
  });

  it('should calculate overdue activities', () => {
    const activities = [
      createMockActivity({ is_overdue: 'true', status: 'PENDING' }),
      createMockActivity({ is_overdue: 'false', status: 'PENDING' }),
      createMockActivity({ is_overdue: 'true', status: 'COMPLETED' }), // Overdue but completed
    ];

    const kpis = calculateActivityKPIs(activities);
    expect(kpis.overdue).toBe(2); // Counts all with is_overdue flag
  });

  it('should calculate this month activities', () => {
    const thisMonth = new Date();
    const nextMonth = addDays(endOfMonth(thisMonth), 1);

    const activities = [
      createMockActivity({ 
        due_date: thisMonth.toISOString().split('T')[0], 
        status: 'PENDING' 
      }),
      createMockActivity({ 
        due_date: thisMonth.toISOString().split('T')[0], 
        status: 'IN_PROGRESS' 
      }),
      createMockActivity({ 
        due_date: thisMonth.toISOString().split('T')[0], 
        status: 'COMPLETED' 
      }), // Completed don't count
      createMockActivity({ 
        due_date: nextMonth.toISOString().split('T')[0], 
        status: 'PENDING' 
      }), // Next month
    ];

    const kpis = calculateActivityKPIs(activities);
    expect(kpis.thisMonth).toBe(2);
  });

  it('should calculate completed activities', () => {
    const activities = [
      createMockActivity({ status: 'COMPLETED' }),
      createMockActivity({ status: 'COMPLETED' }),
      createMockActivity({ status: 'PENDING' }),
    ];

    const kpis = calculateActivityKPIs(activities);
    expect(kpis.completed).toBe(2);
  });
});

describe('isActivityOverdue', () => {
  it('should return true for string "true"', () => {
    const activity = createMockActivity({ is_overdue: 'true' });
    expect(isActivityOverdue(activity)).toBe(true);
  });

  it('should return true for string "1"', () => {
    const activity = createMockActivity({ is_overdue: '1' as any });
    expect(isActivityOverdue(activity)).toBe(true);
  });

  it('should return false for string "false"', () => {
    const activity = createMockActivity({ is_overdue: 'false' });
    expect(isActivityOverdue(activity)).toBe(false);
  });

  it('should handle boolean values', () => {
    const activityTrue = createMockActivity({ is_overdue: true as any });
    const activityFalse = createMockActivity({ is_overdue: false as any });
    
    expect(isActivityOverdue(activityTrue)).toBe(true);
    expect(isActivityOverdue(activityFalse)).toBe(false);
  });
});

describe('filterActivities', () => {
  const activities = [
    createMockActivity({ 
      id: 1, 
      activity_type: 'VACCINATION', 
      status: 'PENDING',
      batch: 100,
      due_date: '2025-01-15',
    }),
    createMockActivity({ 
      id: 2, 
      activity_type: 'TRANSFER', 
      status: 'COMPLETED',
      batch: 200,
      due_date: '2025-02-01',
    }),
    createMockActivity({ 
      id: 3, 
      activity_type: 'VACCINATION', 
      status: 'PENDING',
      batch: 100,
      due_date: '2025-01-20',
      is_overdue: 'true',
    }),
  ];

  it('should filter by activity type', () => {
    const filters: ActivityFilters = {
      activityTypes: ['VACCINATION'],
      statuses: [],
      batches: [],
      dateRange: { start: null, end: null },
    };

    const filtered = filterActivities(activities, filters);
    expect(filtered).toHaveLength(2);
    expect(filtered.every((a) => a.activity_type === 'VACCINATION')).toBe(true);
  });

  it('should filter by status', () => {
    const filters: ActivityFilters = {
      activityTypes: [],
      statuses: ['COMPLETED'],
      batches: [],
      dateRange: { start: null, end: null },
    };

    const filtered = filterActivities(activities, filters);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].status).toBe('COMPLETED');
  });

  it('should filter by batch', () => {
    const filters: ActivityFilters = {
      activityTypes: [],
      statuses: [],
      batches: [100],
      dateRange: { start: null, end: null },
    };

    const filtered = filterActivities(activities, filters);
    expect(filtered).toHaveLength(2);
    expect(filtered.every((a) => a.batch === 100)).toBe(true);
  });

  it('should filter by date range', () => {
    const filters: ActivityFilters = {
      activityTypes: [],
      statuses: [],
      batches: [],
      dateRange: { 
        start: new Date('2025-01-18'), 
        end: new Date('2025-02-05') 
      },
    };

    const filtered = filterActivities(activities, filters);
    expect(filtered).toHaveLength(2); // Jan 20 and Feb 1
  });

  it('should filter by overdue only', () => {
    const filters: ActivityFilters = {
      activityTypes: [],
      statuses: [],
      batches: [],
      dateRange: { start: null, end: null },
      showOverdueOnly: true,
    };

    const filtered = filterActivities(activities, filters);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(3);
  });

  it('should combine multiple filters', () => {
    const filters: ActivityFilters = {
      activityTypes: ['VACCINATION'],
      statuses: ['PENDING'],
      batches: [100],
      dateRange: { start: null, end: null },
    };

    const filtered = filterActivities(activities, filters);
    expect(filtered).toHaveLength(2);
  });
});

describe('groupActivitiesByBatch', () => {
  it('should group activities by batch', () => {
    const activities = [
      createMockActivity({ batch: 100, batch_number: 'BATCH-100' }),
      createMockActivity({ batch: 200, batch_number: 'BATCH-200' }),
      createMockActivity({ batch: 100, batch_number: 'BATCH-100' }),
    ];

    const grouped = groupActivitiesByBatch(activities);
    expect(grouped).toHaveLength(2);
    expect(grouped[0].activities).toHaveLength(2);
    expect(grouped[1].activities).toHaveLength(1);
  });

  it('should sort batches by batch number', () => {
    const activities = [
      createMockActivity({ batch: 300, batch_number: 'C-300' }),
      createMockActivity({ batch: 100, batch_number: 'A-100' }),
      createMockActivity({ batch: 200, batch_number: 'B-200' }),
    ];

    const grouped = groupActivitiesByBatch(activities);
    expect(grouped[0].batchNumber).toBe('A-100');
    expect(grouped[1].batchNumber).toBe('B-200');
    expect(grouped[2].batchNumber).toBe('C-300');
  });
});

describe('sortActivitiesByDueDate', () => {
  it('should sort activities by due date ascending', () => {
    const activities = [
      createMockActivity({ id: 1, due_date: '2025-03-01' }),
      createMockActivity({ id: 2, due_date: '2025-01-01' }),
      createMockActivity({ id: 3, due_date: '2025-02-01' }),
    ];

    const sorted = sortActivitiesByDueDate(activities);
    expect(sorted[0].id).toBe(2); // Jan
    expect(sorted[1].id).toBe(3); // Feb
    expect(sorted[2].id).toBe(1); // Mar
  });
});

describe('canMarkCompleted', () => {
  it('should allow marking PENDING activities as completed', () => {
    const activity = createMockActivity({ status: 'PENDING' });
    expect(canMarkCompleted(activity)).toBe(true);
  });

  it('should allow marking IN_PROGRESS activities as completed', () => {
    const activity = createMockActivity({ status: 'IN_PROGRESS' });
    expect(canMarkCompleted(activity)).toBe(true);
  });

  it('should not allow marking COMPLETED activities as completed', () => {
    const activity = createMockActivity({ status: 'COMPLETED' });
    expect(canMarkCompleted(activity)).toBe(false);
  });

  it('should not allow marking CANCELLED activities as completed', () => {
    const activity = createMockActivity({ status: 'CANCELLED' });
    expect(canMarkCompleted(activity)).toBe(false);
  });
});

describe('canSpawnWorkflow', () => {
  it('should allow spawning workflow for TRANSFER activities', () => {
    const activity = createMockActivity({ 
      activity_type: 'TRANSFER',
      status: 'PENDING',
      transfer_workflow: null,
    });
    expect(canSpawnWorkflow(activity)).toBe(true);
  });

  it('should not allow spawning workflow for non-TRANSFER activities', () => {
    const activity = createMockActivity({ 
      activity_type: 'VACCINATION',
      transfer_workflow: null,
    });
    expect(canSpawnWorkflow(activity)).toBe(false);
  });

  it('should not allow spawning workflow if already spawned', () => {
    const activity = createMockActivity({ 
      activity_type: 'TRANSFER',
      transfer_workflow: 123,
    });
    expect(canSpawnWorkflow(activity)).toBe(false);
  });

  it('should not allow spawning workflow for COMPLETED activities', () => {
    const activity = createMockActivity({ 
      activity_type: 'TRANSFER',
      status: 'COMPLETED',
      transfer_workflow: null,
    });
    expect(canSpawnWorkflow(activity)).toBe(false);
  });
});

describe('Badge Variants', () => {
  it('should return correct badge variant for activity types', () => {
    expect(getActivityTypeBadgeVariant('VACCINATION')).toBe('default');
    expect(getActivityTypeBadgeVariant('TREATMENT')).toBe('secondary');
    expect(getActivityTypeBadgeVariant('CULL')).toBe('destructive');
    expect(getActivityTypeBadgeVariant('TRANSFER')).toBe('default');
  });

  it('should return destructive for overdue activities', () => {
    const activity = createMockActivity({ 
      is_overdue: 'true',
      status: 'PENDING' 
    });
    expect(getStatusBadgeVariant(activity)).toBe('destructive');
  });

  it('should return correct badge variant for status', () => {
    const pending = createMockActivity({ status: 'PENDING', is_overdue: 'false' });
    const inProgress = createMockActivity({ status: 'IN_PROGRESS', is_overdue: 'false' });
    const completed = createMockActivity({ status: 'COMPLETED', is_overdue: 'false' });
    
    expect(getStatusBadgeVariant(pending)).toBe('outline');
    expect(getStatusBadgeVariant(inProgress)).toBe('default');
    expect(getStatusBadgeVariant(completed)).toBe('secondary');
  });

  it('should prioritize overdue over other statuses', () => {
    const overdueInProgress = createMockActivity({ 
      status: 'IN_PROGRESS', 
      is_overdue: 'true' 
    });
    expect(getStatusBadgeVariant(overdueInProgress)).toBe('destructive');
  });
});






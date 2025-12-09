/**
 * Production Planner Utility Functions
 *
 * Helper functions for activity calculations, filtering, and formatting.
 */

import { addDays, isSameMonth, isAfter, isBefore, startOfToday } from 'date-fns';
import type { PlannedActivity, ActivityKPIs, ActivityFilters, BatchActivityGroup } from '../types';

/**
 * Calculate KPI metrics from activities
 */
export function calculateActivityKPIs(activities: PlannedActivity[]): ActivityKPIs {
  const today = startOfToday();
  const sevenDaysFromNow = addDays(today, 7);

  return {
    // Upcoming: PENDING activities due within next 7 days
    upcoming: activities.filter((activity) => {
      if (activity.status !== 'PENDING') return false;
      const dueDate = new Date(activity.due_date);
      return !isAfter(dueDate, sevenDaysFromNow) && !isBefore(dueDate, today);
    }).length,

    // Overdue: Activities with is_overdue flag (PENDING + past due)
    overdue: activities.filter((activity) => isActivityOverdue(activity)).length,

    // This Month: Non-completed activities due this calendar month
    thisMonth: activities.filter((activity) => {
      if (activity.status === 'COMPLETED' || activity.status === 'CANCELLED') return false;
      return isSameMonth(new Date(activity.due_date), today);
    }).length,

    // Completed: All completed activities
    completed: activities.filter((activity) => activity.status === 'COMPLETED').length,
  };
}

/**
 * Check if activity is overdue
 * Backend returns is_overdue as string (computed property)
 */
export function isActivityOverdue(activity: PlannedActivity): boolean {
  // Handle both boolean and string representation
  if (typeof activity.is_overdue === 'boolean') {
    return activity.is_overdue;
  }
  return activity.is_overdue === 'true' || activity.is_overdue === '1';
}

/**
 * Filter activities based on filter criteria
 */
export function filterActivities(
  activities: PlannedActivity[],
  filters: ActivityFilters
): PlannedActivity[] {
  return activities.filter((activity) => {
    // Activity type filter
    if (filters.activityTypes.length > 0 && !filters.activityTypes.includes(activity.activity_type)) {
      return false;
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(activity.status || 'PENDING')) {
      return false;
    }

    // Batch filter
    if (filters.batches.length > 0 && !filters.batches.includes(activity.batch)) {
      return false;
    }

    // Date range filter
    const dueDate = new Date(activity.due_date);
    if (filters.dateRange.start && isBefore(dueDate, filters.dateRange.start)) {
      return false;
    }
    if (filters.dateRange.end && isAfter(dueDate, filters.dateRange.end)) {
      return false;
    }

    // Overdue filter
    if (filters.showOverdueOnly && !isActivityOverdue(activity)) {
      return false;
    }

    return true;
  });
}

/**
 * Group activities by batch for timeline view
 */
export function groupActivitiesByBatch(
  activities: PlannedActivity[]
): BatchActivityGroup[] {
  const grouped = activities.reduce(
    (acc, activity) => {
      const batchId = activity.batch;
      if (!acc[batchId]) {
        acc[batchId] = {
          batchId,
          batchNumber: activity.batch_number,
          activities: [],
        };
      }
      acc[batchId].activities.push(activity);
      return acc;
    },
    {} as Record<number, BatchActivityGroup>
  );

  // Sort batches by batch number
  return Object.values(grouped).sort((a, b) =>
    a.batchNumber.localeCompare(b.batchNumber)
  );
}

/**
 * Sort activities by due date (earliest first)
 */
export function sortActivitiesByDueDate(activities: PlannedActivity[]): PlannedActivity[] {
  return [...activities].sort((a, b) => {
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Get badge variant for activity type
 */
export function getActivityTypeBadgeVariant(
  activityType: PlannedActivity['activity_type']
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const badgeMap: Record<PlannedActivity['activity_type'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    VACCINATION: 'default',
    TREATMENT: 'secondary',
    CULL: 'destructive',
    HARVEST: 'default',
    SALE: 'outline',
    FEED_CHANGE: 'secondary',
    TRANSFER: 'default',
    MAINTENANCE: 'outline',
    SAMPLING: 'secondary',
    OTHER: 'outline',
  };

  return badgeMap[activityType] || 'outline';
}

/**
 * Get badge variant for status
 * Includes visual treatment for overdue activities
 */
export function getStatusBadgeVariant(
  activity: PlannedActivity
): 'default' | 'secondary' | 'destructive' | 'outline' {
  // Overdue takes precedence
  if (isActivityOverdue(activity)) {
    return 'destructive';
  }

  const statusMap: Record<NonNullable<PlannedActivity['status']>, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    PENDING: 'outline',
    IN_PROGRESS: 'default',
    COMPLETED: 'secondary',
    CANCELLED: 'outline',
  };

  return statusMap[activity.status || 'PENDING'];
}

/**
 * Check if activity can be marked as completed
 */
export function canMarkCompleted(activity: PlannedActivity): boolean {
  return activity.status !== 'COMPLETED' && activity.status !== 'CANCELLED';
}

/**
 * Check if activity can spawn a workflow
 */
export function canSpawnWorkflow(activity: PlannedActivity): boolean {
  return (
    activity.activity_type === 'TRANSFER' &&
    activity.transfer_workflow === null &&
    activity.status !== 'COMPLETED' &&
    activity.status !== 'CANCELLED'
  );
}

/**
 * Format activity type display name
 */
export function formatActivityType(activityType: PlannedActivity['activity_type']): string {
  const displayMap: Record<PlannedActivity['activity_type'], string> = {
    VACCINATION: 'Vaccination',
    TREATMENT: 'Treatment',
    CULL: 'Culling',
    HARVEST: 'Harvest',
    SALE: 'Sale',
    FEED_CHANGE: 'Feed Change',
    TRANSFER: 'Transfer',
    MAINTENANCE: 'Maintenance',
    SAMPLING: 'Sampling',
    OTHER: 'Other',
  };

  return displayMap[activityType] || activityType;
}

/**
 * Get color hex for activity type (for Gantt chart)
 */
export function getActivityColor(activityType: PlannedActivity['activity_type']): string {
  const colorMap: Record<PlannedActivity['activity_type'], string> = {
    VACCINATION: '#3b82f6',    // blue-500
    TREATMENT: '#ef4444',      // red-500
    CULL: '#f97316',           // orange-500
    HARVEST: '#16a34a',        // green-600 (distinct from SALE)
    SALE: '#22c55e',           // green-500
    FEED_CHANGE: '#eab308',    // yellow-500
    TRANSFER: '#8b5cf6',       // violet-500
    MAINTENANCE: '#64748b',    // slate-500
    SAMPLING: '#06b6d4',       // cyan-500
    OTHER: '#a8a29e',          // stone-400
  };

  return colorMap[activityType] || '#64748b';
}

/**
 * Get activity type options for dropdowns/filters
 */
export function getActivityTypeOptions() {
  return [
    { value: 'VACCINATION', label: 'Vaccination' },
    { value: 'TREATMENT', label: 'Treatment/Health Intervention' },
    { value: 'CULL', label: 'Culling' },
    { value: 'HARVEST', label: 'Harvest' },
    { value: 'SALE', label: 'Sale/Commercial Handoff' },
    { value: 'FEED_CHANGE', label: 'Feed Strategy Change' },
    { value: 'TRANSFER', label: 'Transfer' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'SAMPLING', label: 'Sampling' },
    { value: 'OTHER', label: 'Other' },
  ];
}

/**
 * Get status options for dropdowns/filters
 */
export function getStatusOptions() {
  return [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];
}

/**
 * Get trigger type options for template dropdowns/filters
 */
export function getTriggerTypeOptions() {
  return [
    { value: 'DAY_OFFSET', label: 'Day Offset', description: 'Days after batch creation' },
    { value: 'WEIGHT_THRESHOLD', label: 'Weight Threshold', description: 'When fish reach target weight' },
    { value: 'STAGE_TRANSITION', label: 'Stage Transition', description: 'When batch enters lifecycle stage' },
  ];
}

/**
 * Format trigger type display name
 */
export function formatTriggerType(triggerType: string): string {
  const displayMap: Record<string, string> = {
    DAY_OFFSET: 'Day Offset',
    WEIGHT_THRESHOLD: 'Weight Threshold',
    STAGE_TRANSITION: 'Stage Transition',
  };

  return displayMap[triggerType] || triggerType;
}


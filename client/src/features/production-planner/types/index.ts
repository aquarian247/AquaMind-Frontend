/**
 * Production Planner Types
 *
 * Type definitions for the Operational Scheduling feature.
 * Re-exports generated types and defines local filter/state types.
 */

// Re-export generated API types
export type {
  PlannedActivity,
  PatchedPlannedActivity,
  PaginatedPlannedActivityList,
  ActivityTemplate,
} from '@/api/generated';

// Import for local use
import type { PlannedActivity } from '@/api/generated';

// Activity Type enum (matches backend exactly)
export type ActivityType =
  | 'VACCINATION'
  | 'TREATMENT'
  | 'CULL'
  | 'SALE'
  | 'FEED_CHANGE'
  | 'TRANSFER'
  | 'MAINTENANCE'
  | 'SAMPLING'
  | 'OTHER';

// Status enum (4 states - OVERDUE is computed via is_overdue property)
export type ActivityStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// Filter state for timeline view
export interface ActivityFilters {
  activityTypes: ActivityType[];
  statuses: ActivityStatus[];
  batches: number[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  showOverdueOnly?: boolean;
}

// KPI metrics computed from activities
export interface ActivityKPIs {
  upcoming: number; // Next 7 days
  overdue: number; // PENDING + past due
  thisMonth: number; // Due this calendar month
  completed: number; // Status = COMPLETED
}

// Timeline grouping by batch
export interface BatchActivityGroup {
  batchId: number;
  batchNumber: string;
  activities: PlannedActivity[];
}

// Spawn workflow request payload
export interface SpawnWorkflowRequest {
  workflow_type?: string;
  source_lifecycle_stage: number;
  dest_lifecycle_stage: number;
}

// Activity form data (for Create/Edit)
export interface ActivityFormData {
  scenario: number;
  batch: number;
  activity_type: ActivityType;
  due_date: Date;
  container?: number | null;
  notes?: string;
}


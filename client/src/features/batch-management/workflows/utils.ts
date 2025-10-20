/**
 * Utility functions for transfer workflows.
 */

import type { BatchTransferWorkflowDetail, BatchTransferWorkflowList } from '@/api/generated';

// ============================================================================
// Status Utilities
// ============================================================================

export const WORKFLOW_STATUS_CONFIG = {
  DRAFT: {
    label: 'Draft',
    variant: 'secondary' as const,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  PLANNED: {
    label: 'Planned',
    variant: 'default' as const,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    variant: 'warning' as const,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'success' as const,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'destructive' as const,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
} as const;

export const ACTION_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    variant: 'secondary' as const,
    color: 'text-gray-600',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    variant: 'warning' as const,
    color: 'text-amber-600',
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'success' as const,
    color: 'text-green-600',
  },
  FAILED: {
    label: 'Failed',
    variant: 'destructive' as const,
    color: 'text-red-600',
  },
  SKIPPED: {
    label: 'Skipped',
    variant: 'outline' as const,
    color: 'text-gray-500',
  },
} as const;

export type WorkflowStatus = keyof typeof WORKFLOW_STATUS_CONFIG;
export type ActionStatus = keyof typeof ACTION_STATUS_CONFIG;

/**
 * Get status configuration for workflow.
 */
export function getWorkflowStatusConfig(status?: WorkflowStatus) {
  if (!status) return WORKFLOW_STATUS_CONFIG.DRAFT;
  return WORKFLOW_STATUS_CONFIG[status] || WORKFLOW_STATUS_CONFIG.DRAFT;
}

/**
 * Get status configuration for action.
 */
export function getActionStatusConfig(status?: ActionStatus) {
  if (!status) return ACTION_STATUS_CONFIG.PENDING;
  return ACTION_STATUS_CONFIG[status] || ACTION_STATUS_CONFIG.PENDING;
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format biomass with proper units.
 */
export function formatBiomass(kg: string | number): string {
  const value = typeof kg === 'string' ? parseFloat(kg) : kg;
  if (isNaN(value)) return '0 kg';
  return `${value.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kg`;
}

/**
 * Format fish count with proper units.
 */
export function formatCount(count: number): string {
  return count.toLocaleString('en-US');
}

/**
 * Format percentage.
 */
export function formatPercentage(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';
  return `${num.toFixed(1)}%`;
}

/**
 * Format date for display.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format date range.
 */
export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (start === '—' && end === '—') return '—';
  if (end === '—') return `From ${start}`;
  if (start === '—') return `Until ${end}`;
  
  return `${start} – ${end}`;
}

/**
 * Get progress status color based on percentage.
 */
export function getProgressColor(percentage: number): string {
  if (percentage === 0) return 'bg-gray-200';
  if (percentage < 50) return 'bg-blue-500';
  if (percentage < 100) return 'bg-amber-500';
  return 'bg-green-500';
}

/**
 * Calculate days between dates.
 */
export function getDaysBetween(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): number | null {
  if (!startDate || !endDate) return null;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

/**
 * Check if workflow can be executed.
 */
export function canExecuteWorkflow(workflow: BatchTransferWorkflowList | BatchTransferWorkflowDetail): boolean {
  return workflow.status === 'PLANNED' || workflow.status === 'IN_PROGRESS';
}

/**
 * Check if workflow can be cancelled.
 */
export function canCancelWorkflow(workflow: BatchTransferWorkflowList | BatchTransferWorkflowDetail): boolean {
  return workflow.status !== 'COMPLETED' && workflow.status !== 'CANCELLED';
}

/**
 * Check if workflow can be edited.
 */
export function canEditWorkflow(workflow: BatchTransferWorkflowList | BatchTransferWorkflowDetail): boolean {
  return workflow.status === 'DRAFT';
}


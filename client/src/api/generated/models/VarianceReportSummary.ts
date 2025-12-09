/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for overall variance report summary.
 */
export type VarianceReportSummary = {
    total_activities: number;
    completed_activities: number;
    pending_activities: number;
    cancelled_activities: number;
    overdue_activities: number;
    /**
     * Percentage of total activities completed
     */
    overall_completion_rate: number;
    on_time_activities: number;
    late_activities: number;
    early_activities: number;
    /**
     * Percentage of completed activities that were on-time or early
     */
    overall_on_time_rate: number;
    /**
     * Average variance in days across all completed activities
     */
    avg_variance_days: number | null;
};


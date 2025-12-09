/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for variance statistics grouped by activity type.
 */
export type ActivityTypeStats = {
    activity_type: string;
    activity_type_display: string;
    total_count: number;
    completed_count: number;
    pending_count: number;
    cancelled_count: number;
    /**
     * Percentage of activities completed (excluding cancelled)
     */
    completion_rate: number;
    on_time_count: number;
    late_count: number;
    early_count: number;
    /**
     * Percentage of completed activities that were on-time or early
     */
    on_time_rate: number;
    /**
     * Average variance in days for completed activities
     */
    avg_variance_days: number | null;
    /**
     * Minimum variance (most early)
     */
    min_variance_days: number | null;
    /**
     * Maximum variance (most late)
     */
    max_variance_days: number | null;
};


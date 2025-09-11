/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for Batch model.
 */
export type BatchHistory = {
    readonly history_id: number;
    /**
     * User who made the change
     */
    readonly history_user: string;
    /**
     * When the change was made
     */
    readonly history_date: string;
    /**
     * Type of change: + (Created), ~ (Updated), - (Deleted)
     */
    readonly history_type: string;
    /**
     * Reason for the change
     */
    readonly history_change_reason: string;
    id?: number;
    batch_number: string;
    /**
     * * `ACTIVE` - Active
     * * `COMPLETED` - Completed
     * * `TERMINATED` - Terminated
     */
    status?: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
    /**
     * * `STANDARD` - Standard
     * * `MIXED` - Mixed Population
     */
    batch_type?: 'STANDARD' | 'MIXED';
    start_date: string;
    expected_end_date?: string | null;
    actual_end_date?: string | null;
    notes?: string;
    readonly created_at: string;
    readonly updated_at: string;
    species?: number | null;
    lifecycle_stage?: number | null;
};


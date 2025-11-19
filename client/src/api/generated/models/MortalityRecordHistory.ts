/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for MortalityRecord model.
 */
export type MortalityRecordHistory = {
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
    event_date?: string;
    /**
     * Number of fish that died.
     */
    count: number;
    /**
     * Additional notes about the mortality event.
     */
    notes?: string;
    /**
     * The batch experiencing mortality.
     */
    batch?: number | null;
    /**
     * Container-specific assignment where mortality occurred
     */
    assignment?: number | null;
    /**
     * The specific container, if applicable.
     */
    container?: number | null;
    /**
     * Reason for the mortality.
     */
    reason?: number | null;
};


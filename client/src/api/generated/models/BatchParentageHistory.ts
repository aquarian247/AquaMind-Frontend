/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for BatchParentage model.
 */
export type BatchParentageHistory = {
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
    /**
     * Date eggs assigned to batch
     */
    assignment_date?: string;
    readonly created_at: string;
    readonly updated_at: string;
    batch?: number | null;
    egg_production?: number | null;
};


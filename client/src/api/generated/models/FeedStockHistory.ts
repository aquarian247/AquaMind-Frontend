/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for FeedStock model.
 */
export type FeedStockHistory = {
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
    readonly updated_at: string;
    /**
     * Current amount of feed in stock (kg)
     */
    current_quantity_kg: string;
    /**
     * Threshold for reordering (kg)
     */
    reorder_threshold_kg: string;
    notes?: string;
    feed?: number | null;
    feed_container?: number | null;
};


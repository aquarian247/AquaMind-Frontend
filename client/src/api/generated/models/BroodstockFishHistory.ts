/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for BroodstockFish model.
 */
export type BroodstockFishHistory = {
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
     * Basic traits (e.g., growth_rate, size)
     */
    traits?: any;
    /**
     * Current health status
     *
     * * `healthy` - Healthy
     * * `monitored` - Monitored
     * * `sick` - Sick
     * * `deceased` - Deceased
     */
    health_status?: 'healthy' | 'monitored' | 'sick' | 'deceased';
    readonly created_at: string;
    readonly updated_at: string;
    /**
     * Current container housing the fish
     */
    container?: number | null;
};


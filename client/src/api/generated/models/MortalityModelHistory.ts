/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for MortalityModel model.
 */
export type MortalityModelHistory = {
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
    model_id?: number;
    /**
     * Model name (e.g., 'Low Mortality')
     */
    name: string;
    /**
     * Rate application frequency
     *
     * * `daily` - Daily
     * * `weekly` - Weekly
     */
    frequency: 'daily' | 'weekly';
    /**
     * Mortality rate percentage (e.g., 0.1)
     */
    rate: number;
    readonly created_at: string;
    readonly updated_at: string;
};


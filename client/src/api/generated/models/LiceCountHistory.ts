/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for LiceCount model.
 */
export type LiceCountHistory = {
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
    count_date?: string;
    /**
     * Number of adult female lice counted.
     */
    adult_female_count: number;
    /**
     * Number of adult male lice counted.
     */
    adult_male_count: number;
    /**
     * Number of juvenile lice counted.
     */
    juvenile_count: number;
    /**
     * Number of fish sampled for the count.
     */
    fish_sampled: number;
    /**
     * Additional notes about the lice count.
     */
    notes?: string;
    /**
     * The batch being counted.
     */
    batch?: number | null;
    /**
     * The specific container, if applicable.
     */
    container?: number | null;
    /**
     * User who performed the count.
     */
    user?: number | null;
};


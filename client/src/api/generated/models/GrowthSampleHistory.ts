/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for GrowthSample model.
 */
export type GrowthSampleHistory = {
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
    sample_date: string;
    /**
     * Number of fish sampled
     */
    sample_size: number;
    /**
     * Average weight (g) calculated from individual measurements if provided, otherwise manually entered.
     */
    avg_weight_g: string;
    /**
     * Average length (cm) calculated from individual measurements if provided, otherwise manually entered.
     */
    avg_length_cm?: string | null;
    /**
     * Standard deviation of weight (g) calculated from individual measurements if provided.
     */
    std_deviation_weight?: string | null;
    /**
     * Standard deviation of length (cm) calculated from individual measurements if provided.
     */
    std_deviation_length?: string | null;
    /**
     * Minimum weight in grams
     */
    min_weight_g?: string | null;
    /**
     * Maximum weight in grams
     */
    max_weight_g?: string | null;
    /**
     * Average Condition Factor (K) calculated from individual measurements if provided.
     */
    condition_factor?: string | null;
    notes?: string | null;
    readonly created_at: string;
    readonly updated_at: string;
    /**
     * The specific container assignment this sample was taken from
     */
    assignment?: number | null;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for GrowthSample model with calculated fields.
 */
export type GrowthSample = {
    readonly id: number;
    /**
     * The specific container assignment this sample was taken from
     */
    assignment?: number;
    readonly assignment_details: string;
    sample_date?: string;
    /**
     * Number of fish sampled
     */
    sample_size: number;
    /**
     * Average weight (g) calculated from individual measurements if provided, otherwise manually entered.
     */
    avg_weight_g?: string;
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
    individual_lengths?: Array<string>;
    individual_weights?: Array<string>;
};


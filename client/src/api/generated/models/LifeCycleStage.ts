/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the LifeCycleStage model.
 */
export type LifeCycleStage = {
    readonly id: number;
    readonly species_name: string;
    name: string;
    /**
     * Order in lifecycle (1, 2, 3, etc.)
     */
    order: number;
    description?: string;
    /**
     * Minimum expected weight in grams
     */
    expected_weight_min_g?: string | null;
    /**
     * Maximum expected weight in grams
     */
    expected_weight_max_g?: string | null;
    /**
     * Minimum expected length in centimeters
     */
    expected_length_min_cm?: string | null;
    /**
     * Maximum expected length in centimeters
     */
    expected_length_max_cm?: string | null;
    readonly created_at: string;
    readonly updated_at: string;
    species: number;
};


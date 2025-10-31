/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for displaying growth observations.
 */
export type IndividualGrowthObservation = {
    readonly id: number;
    /**
     * Identifier for the fish (e.g., sequential number).
     */
    fish_identifier: string;
    /**
     * Weight in grams.
     */
    weight_g: string;
    /**
     * Length in centimeters.
     */
    length_cm: string;
    /**
     * Calculate K-factor if weight and length are provided.
     */
    readonly calculated_k_factor: number;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for FishParameterScore model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 */
export type FishParameterScore = {
    readonly id: number;
    /**
     * ID of the health parameter being scored. Must reference an active parameter.
     */
    parameter: number;
    /**
     * Name of the health parameter being scored.
     */
    readonly parameter_name: string;
    /**
     * Score value (typically 1-5) representing the health assessment for this parameter.
     */
    score: number;
    readonly created_at: string;
    readonly updated_at: string;
};


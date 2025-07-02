/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the MortalityReason model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 */
export type MortalityReason = {
    readonly id: number;
    /**
     * Name of the mortality reason (e.g., 'Disease', 'Predation').
     */
    name: string;
    /**
     * Detailed description of the mortality reason.
     */
    description: string;
};


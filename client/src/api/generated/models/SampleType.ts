/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the SampleType model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 */
export type SampleType = {
    readonly id: number;
    /**
     * Name of the sample type (e.g., 'Gill Swab', 'Blood Sample').
     */
    name: string;
    /**
     * Detailed description of the sample type, including collection methods and purpose.
     */
    description: string;
};


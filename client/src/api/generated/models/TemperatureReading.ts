/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for temperature readings with validation.
 */
export type TemperatureReading = {
    readonly reading_id: number;
    /**
     * Relative day number (1-900) in the temperature profile
     */
    day_number: number;
    /**
     * Temperature value in degrees Celsius (e.g., 12.5)
     */
    temperature: number;
};


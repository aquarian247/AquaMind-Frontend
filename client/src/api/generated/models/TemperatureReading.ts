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
     * Date of the temperature reading
     */
    reading_date: string;
    /**
     * Temperature value in degrees Celsius (e.g., 12.5)
     */
    temperature: number;
};


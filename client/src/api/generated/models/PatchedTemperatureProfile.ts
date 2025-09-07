/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TemperatureReading } from './TemperatureReading';
/**
 * Serializer for temperature profiles with nested readings.
 */
export type PatchedTemperatureProfile = {
    readonly profile_id?: number;
    /**
     * Descriptive name (e.g., 'Faroe Islands Winter')
     */
    name?: string;
    readonly readings?: Array<TemperatureReading>;
    readonly reading_count?: number;
    /**
     * Get the date range of readings.
     */
    readonly date_range?: Record<string, any> | null;
    /**
     * Get temperature statistics.
     */
    readonly temperature_summary?: Record<string, any> | null;
    readonly created_at?: string;
    readonly updated_at?: string;
};


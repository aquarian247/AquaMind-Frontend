/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for individual FCR data points in the trends series.
 *
 * Supports container-level granularity with operational metadata.
 */
export type FCRDataPoint = {
    period_start: string;
    period_end: string;
    actual_fcr?: string | null;
    confidence?: string | null;
    data_points?: number;
    predicted_fcr?: string | null;
    scenarios_used?: number;
    /**
     * Percentage deviation of actual from predicted FCR
     */
    deviation?: string | null;
    container_name?: string | null;
    assignment_id?: number | null;
    container_count?: number | null;
    total_containers?: number | null;
};


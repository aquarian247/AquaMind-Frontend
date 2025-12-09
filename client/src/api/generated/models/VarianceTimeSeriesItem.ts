/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for time series variance data point.
 */
export type VarianceTimeSeriesItem = {
    /**
     * Period identifier (e.g., '2025-01' for month, '2025-W01' for week)
     */
    period: string;
    total_due: number;
    completed: number;
    on_time: number;
    late: number;
    early: number;
    completion_rate: number;
    on_time_rate: number;
};


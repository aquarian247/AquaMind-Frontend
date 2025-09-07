/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FCRDataPoint } from './FCRDataPoint';
/**
 * Serializer for FCR trends API response.
 *
 * Provides comprehensive FCR trend data with actual and predicted values,
 * confidence levels, and deviation analysis.
 */
export type FCRTrends = {
    /**
     * * `DAILY` - DAILY
     * * `WEEKLY` - WEEKLY
     * * `MONTHLY` - MONTHLY
     */
    interval?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    readonly unit: string;
    /**
     * * `batch` - batch
     * * `assignment` - assignment
     * * `geography` - geography
     */
    aggregation_level?: 'batch' | 'assignment' | 'geography' | null;
    series: Array<FCRDataPoint>;
};


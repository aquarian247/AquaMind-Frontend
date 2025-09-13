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
 *
 * Time interval semantics:
 * - DAILY: Single-day buckets
 * - WEEKLY: Monday-Sunday inclusive buckets
 * - MONTHLY: Calendar month buckets (1st to last day)
 *
 * Default behavior when filters omitted:
 * - aggregation_level: 'geography' (system-wide aggregation)
 * - interval: 'DAILY' (most granular view)
 */
export type FCRTrends = {
    /**
     * Time interval for data aggregation. DAILY=calendar days, WEEKLY=Monday-Sunday, MONTHLY=calendar months.
     *
     * * `DAILY` - DAILY
     * * `WEEKLY` - WEEKLY
     * * `MONTHLY` - MONTHLY
     */
    interval?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    /**
     * Units for FCR values: 'ratio' (feed consumed / biomass gained)
     */
    readonly unit: string;
    /**
     * Level of data aggregation. 'batch'=per batch, 'assignment'=per container, 'geography'=across all batches in geography.
     *
     * * `batch` - batch
     * * `assignment` - assignment
     * * `geography` - geography
     */
    aggregation_level?: 'batch' | 'assignment' | 'geography';
    /**
     * Time-series data points, one per interval bucket
     */
    series: Array<FCRDataPoint>;
    /**
     * Version of the FCR calculation model used
     */
    model_version?: string | null;
};


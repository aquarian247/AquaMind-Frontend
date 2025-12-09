/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivityTypeStats } from './ActivityTypeStats';
import type { ActivityVarianceItem } from './ActivityVarianceItem';
import type { VarianceReportSummary } from './VarianceReportSummary';
import type { VarianceTimeSeriesItem } from './VarianceTimeSeriesItem';
/**
 * Main serializer for the complete variance report response.
 *
 * Contains summary statistics, per-activity-type breakdown,
 * time series data, and optionally individual activity details.
 */
export type VarianceReport = {
    report_generated_at: string;
    scenario_id: number | null;
    scenario_name: string | null;
    date_range_start: string | null;
    date_range_end: string | null;
    summary: VarianceReportSummary;
    by_activity_type: Array<ActivityTypeStats>;
    time_series: Array<VarianceTimeSeriesItem>;
    /**
     * Individual activity details (only included if include_details=true)
     */
    activities?: Array<ActivityVarianceItem>;
};


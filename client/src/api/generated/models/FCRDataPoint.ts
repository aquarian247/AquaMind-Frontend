/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for individual FCR data points in the trends series.
 *
 * Supports container-level granularity with operational metadata.
 * FCR values represent feed conversion ratio (feed consumed / biomass gained).
 */
export type FCRDataPoint = {
    /**
     * Start date of the time period bucket (inclusive)
     */
    period_start: string;
    /**
     * End date of the time period bucket (inclusive)
     */
    period_end: string;
    /**
     * Actual FCR ratio calculated from feeding and growth data (feed_kg / biomass_gain_kg)
     */
    actual_fcr?: string | null;
    /**
     * Confidence level in the FCR calculation: VERY_HIGH, HIGH, MEDIUM, LOW. Based on data quality and sample size.
     */
    confidence?: string | null;
    /**
     * Number of individual feeding/growth data points used to calculate this FCR value
     */
    data_points?: number;
    /**
     * Predicted FCR ratio from scenario models (feed_kg / expected_biomass_gain_kg)
     */
    predicted_fcr?: string | null;
    /**
     * Number of scenario models that contributed to this prediction
     */
    scenarios_used?: number;
    /**
     * Percentage deviation of actual from predicted FCR: ((actual - predicted) / predicted) * 100
     */
    deviation?: string | null;
    /**
     * Name of the container for container-level aggregations
     */
    container_name?: string | null;
    /**
     * Container assignment ID for container-level aggregations
     */
    assignment_id?: number | null;
    /**
     * Number of containers included in this data point
     */
    container_count?: number | null;
    /**
     * Total number of containers in the aggregation scope
     */
    total_containers?: number | null;
};


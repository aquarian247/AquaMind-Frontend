/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the BatchFeedingSummary model.
 *
 * Provides read operations for batch feeding summaries.
 */
export type BatchFeedingSummary = {
    readonly id: number;
    batch: number;
    readonly batch_name: string;
    /**
     * Start date of the summary period
     */
    period_start: string;
    /**
     * End date of the summary period
     */
    period_end: string;
    /**
     * Total feed used across all containers (kg)
     */
    total_feed_kg: string;
    /**
     * Total batch biomass at start of period (kg)
     */
    total_starting_biomass_kg?: string | null;
    /**
     * Total batch biomass at end of period (kg)
     */
    total_ending_biomass_kg?: string | null;
    /**
     * Total batch growth during the period (kg)
     */
    total_growth_kg?: string | null;
    /**
     * Weighted average FCR across all containers
     */
    weighted_avg_fcr?: string | null;
    /**
     * Number of containers contributing to this summary
     */
    container_count?: number;
    /**
     * Overall confidence level (worst case across containers)
     *
     * * `VERY_HIGH` - Very High (< 10 days since weighing)
     * * `HIGH` - High (10-20 days since weighing)
     * * `MEDIUM` - Medium (20-40 days since weighing)
     * * `LOW` - Low (> 40 days since weighing)
     */
    overall_confidence_level?: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
    /**
     * Overall estimation method across containers
     *
     * * `MEASURED` - All containers have direct measurements
     * * `MIXED` - Some containers use interpolation
     * * `INTERPOLATED` - Most containers use interpolation
     */
    estimation_method?: 'MEASURED' | 'MIXED' | 'INTERPOLATED' | '' | null;
    readonly created_at: string;
    readonly updated_at: string;
};


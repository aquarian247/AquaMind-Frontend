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
     * Total feed used in kg during the period
     */
    total_feed_kg: string;
    /**
     * Average batch biomass during the period (kg)
     */
    average_biomass_kg?: string | null;
    /**
     * Average feeding percentage during the period
     */
    average_feeding_percentage?: string | null;
    /**
     * Growth during the period (kg)
     */
    growth_kg?: string | null;
    /**
     * Total feed consumed by the batch during this period (kg)
     */
    total_feed_consumed_kg?: string | null;
    /**
     * Total biomass gain during this period (kg)
     */
    total_biomass_gain_kg?: string | null;
    /**
     * Feed Conversion Ratio (total_feed_consumed_kg / total_biomass_gain_kg)
     */
    fcr?: string | null;
    readonly created_at: string;
    readonly updated_at: string;
};


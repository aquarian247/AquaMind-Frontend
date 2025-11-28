/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for scenario projection entries.
 */
export type ScenarioProjection = {
    readonly projection_id: number;
    /**
     * DEPRECATED: Temporary field for migration
     */
    scenario?: number | null;
    /**
     * Projection date
     */
    projection_date: string;
    /**
     * Day offset from start (e.g., 45)
     */
    day_number: number;
    /**
     * Fish weight in grams (e.g., 250.5)
     */
    average_weight: number;
    /**
     * Fish count (e.g., 9950.3)
     */
    population: number;
    /**
     * Biomass in kilograms (e.g., 2491.2)
     */
    biomass: number;
    /**
     * Daily feed in kilograms (e.g., 30.5)
     */
    daily_feed: number;
    /**
     * Total feed in kilograms (e.g., 1200.7)
     */
    cumulative_feed: number;
    /**
     * Temperature in Celsius (e.g., 12.8)
     */
    temperature: number;
    current_stage: number;
    readonly stage_name: string;
    readonly growth_rate: number | null;
    readonly fcr_actual: number | null;
};


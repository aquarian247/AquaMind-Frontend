/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the FeedingEvent model.
 *
 * Provides CRUD operations for feeding events with validation and stock
 * updates.
 */
export type PatchedFeedingEvent = {
    readonly id?: number;
    batch?: number;
    readonly batch_name?: string;
    /**
     * The specific batch-container assignment this feeding applies to
     */
    batch_assignment?: number | null;
    /**
     * Container where feeding occurred
     */
    container?: number;
    readonly container_name?: string;
    /**
     * Feed type used
     */
    feed?: number;
    readonly feed_name?: string;
    /**
     * Stock source for this feed
     */
    feed_stock?: number | null;
    feeding_date?: string;
    feeding_time?: string;
    /**
     * Amount of feed given in kilograms
     */
    amount_kg?: string;
    /**
     * Batch biomass at feeding time (auto-populated from latest assignment)
     */
    batch_biomass_kg?: string;
    /**
     * Feed amount as percentage of biomass (auto-calculated)
     */
    readonly feeding_percentage?: string;
    /**
     * Cost of feed consumed (calculated via FIFO)
     */
    readonly feed_cost?: string;
    /**
     * * `MANUAL` - Manual
     * * `AUTOMATIC` - Automatic Feeder
     * * `BROADCAST` - Broadcast
     */
    method?: 'MANUAL' | 'AUTOMATIC' | 'BROADCAST';
    notes?: string;
    recorded_by?: number | null;
    readonly recorded_by_username?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
};


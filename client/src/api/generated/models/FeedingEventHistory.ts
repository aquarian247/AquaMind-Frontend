/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for FeedingEvent model.
 */
export type FeedingEventHistory = {
    readonly history_id: number;
    /**
     * User who made the change
     */
    readonly history_user: string;
    /**
     * When the change was made
     */
    readonly history_date: string;
    /**
     * Type of change: + (Created), ~ (Updated), - (Deleted)
     */
    readonly history_type: string;
    /**
     * Reason for the change
     */
    readonly history_change_reason: string;
    id?: number;
    readonly created_at: string;
    readonly updated_at: string;
    feeding_date: string;
    feeding_time: string;
    /**
     * Amount of feed used in kilograms
     */
    amount_kg: string;
    /**
     * Estimated batch biomass at time of feeding (kg)
     */
    batch_biomass_kg: string;
    /**
     * Feed amount as percentage of biomass (auto-calculated)
     */
    feeding_percentage?: string | null;
    /**
     * Calculated cost of feed used in this feeding event
     */
    feed_cost?: string | null;
    /**
     * * `MANUAL` - Manual
     * * `AUTOMATIC` - Automatic Feeder
     * * `BROADCAST` - Broadcast
     */
    method?: 'MANUAL' | 'AUTOMATIC' | 'BROADCAST';
    notes?: string;
    batch?: number | null;
    /**
     * The specific batch-container assignment this feeding applies to
     */
    batch_assignment?: number | null;
    /**
     * Container where feeding occurred
     */
    container?: number | null;
    /**
     * Feed type used
     */
    feed?: number | null;
    /**
     * Stock source for this feed
     */
    feed_stock?: number | null;
    recorded_by?: number | null;
};


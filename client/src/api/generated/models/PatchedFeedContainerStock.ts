/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for FeedContainerStock model.
 *
 * Handles FIFO inventory tracking for feed batches in containers.
 */
export type PatchedFeedContainerStock = {
    readonly id?: number;
    /**
     * Feed container where this batch is stored
     */
    feed_container?: number;
    /**
     * Name of the feed container
     */
    readonly feed_container_name?: string;
    /**
     * Original purchase batch this stock comes from
     */
    feed_purchase?: number;
    /**
     * Feed purchase batch number
     */
    readonly feed_purchase_batch?: string;
    /**
     * Type of feed
     */
    readonly feed_type?: string;
    /**
     * Remaining quantity of this feed batch in the container (kg)
     */
    quantity_kg?: string;
    /**
     * Date and time when this feed batch was added to the container
     */
    entry_date?: string;
    /**
     * Cost per kg from the original purchase
     */
    readonly cost_per_kg?: string;
    /**
     * Total value of remaining stock (quantity_kg * cost_per_kg)
     */
    readonly total_value?: number | null;
    readonly created_at?: string;
    readonly updated_at?: string;
};


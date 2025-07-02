/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the FeedStock model.
 *
 * Provides CRUD operations for feed stock levels in feed containers.
 */
export type FeedStock = {
    readonly id: number;
    feed: number;
    readonly feed_name: string;
    feed_container: number;
    readonly feed_container_name: string;
    /**
     * Current amount of feed in stock (kg)
     */
    current_quantity_kg: string;
    /**
     * Threshold for reordering (kg)
     */
    reorder_threshold_kg: string;
    readonly updated_at: string;
    notes?: string;
    readonly needs_reorder: boolean;
};


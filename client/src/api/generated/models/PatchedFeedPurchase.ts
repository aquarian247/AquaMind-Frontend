/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the FeedPurchase model.
 *
 * Provides CRUD operations for feed purchase records.
 */
export type PatchedFeedPurchase = {
    readonly id?: number;
    feed?: number;
    readonly feed_name?: string;
    purchase_date?: string;
    /**
     * Amount of feed purchased in kilograms
     */
    quantity_kg?: string;
    /**
     * Cost per kilogram
     */
    cost_per_kg?: string;
    supplier?: string;
    /**
     * Supplier's batch number
     */
    batch_number?: string;
    expiry_date?: string | null;
    notes?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for creating FeedContainerStock entries.
 *
 * Used when adding feed batches to containers.
 */
export type FeedContainerStockCreate = {
    /**
     * Feed container to add stock to
     */
    feed_container: number;
    /**
     * Feed purchase batch to add
     */
    feed_purchase: number;
    /**
     * Quantity to add to container in kg
     */
    quantity_kg: string;
    /**
     * Date and time when this feed batch was added to the container
     */
    entry_date: string;
};


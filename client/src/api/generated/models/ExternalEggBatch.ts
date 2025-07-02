/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for external egg batches.
 */
export type ExternalEggBatch = {
    readonly id: number;
    /**
     * Link to egg production record
     */
    egg_production: number;
    supplier: number;
    readonly supplier_name: string;
    /**
     * Supplier's batch ID
     */
    batch_number: string;
    /**
     * Source farm and transport details
     */
    provenance_data?: string;
    readonly egg_count: number;
    readonly created_at: string;
    readonly updated_at: string;
};


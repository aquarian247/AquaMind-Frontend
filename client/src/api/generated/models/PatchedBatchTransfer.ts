/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the BatchTransfer model.
 */
export type PatchedBatchTransfer = {
    readonly id?: number;
    readonly source_batch_number?: string;
    readonly destination_batch_number?: string;
    readonly transfer_type_display?: string;
    readonly source_lifecycle_stage_name?: string;
    readonly destination_lifecycle_stage_name?: string;
    readonly source_container_name?: string;
    readonly destination_container_name?: string;
    readonly source_batch_info?: string;
    readonly destination_batch_info?: string;
    /**
     * * `CONTAINER` - Container Transfer
     * * `LIFECYCLE` - Lifecycle Stage Change
     * * `SPLIT` - Batch Split
     * * `MERGE` - Batch Merge
     * * `MIXED_TRANSFER` - Mixed Batch Transfer
     */
    transfer_type?: 'CONTAINER' | 'LIFECYCLE' | 'SPLIT' | 'MERGE' | 'MIXED_TRANSFER';
    transfer_date?: string;
    /**
     * Population count before transfer
     */
    source_count?: number;
    /**
     * Number of fish transferred
     */
    transferred_count?: number;
    /**
     * Number of mortalities during transfer
     */
    mortality_count?: number;
    /**
     * Biomass before transfer in kg
     */
    source_biomass_kg?: string;
    /**
     * Biomass transferred in kg
     */
    transferred_biomass_kg?: string;
    /**
     * Whether this was an emergency mixing of different batches
     */
    is_emergency_mixing?: boolean;
    notes?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    source_batch?: number;
    /**
     * Destination batch for merges or new batch for splits; may be null for simple transfers
     */
    destination_batch?: number | null;
    /**
     * Source batch-container assignment
     */
    source_assignment?: number | null;
    /**
     * Destination batch-container assignment
     */
    destination_assignment?: number | null;
    /**
     * Lifecycle stage before transfer
     */
    source_lifecycle_stage?: number;
    /**
     * New lifecycle stage after transfer
     */
    destination_lifecycle_stage?: number | null;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the StageTransitionEnvironmental model.
 *
 * Records environmental conditions during batch transfers between lifecycle stages,
 * which is critical for tracking environmental factors during transitions.
 */
export type PatchedStageTransitionEnvironmental = {
    readonly id?: number;
    /**
     * ID of the batch transfer this environmental record is associated with.
     */
    readonly batch_transfer_id?: number;
    /**
     * The batch transfer this environmental record is associated with.
     */
    batch_transfer?: number;
    /**
     * Water temperature in degrees Celsius during the transfer.
     */
    temperature?: string | null;
    /**
     * Dissolved oxygen level in mg/L during the transfer.
     */
    oxygen?: string | null;
    /**
     * pH level (0-14) during the transfer.
     */
    ph?: string | null;
    /**
     * Salinity level in ppt (parts per thousand) during the transfer.
     */
    salinity?: string | null;
    /**
     * Additional notes about environmental conditions during the transfer.
     */
    notes?: string | null;
    /**
     * Additional environmental parameters
     */
    additional_parameters?: any;
    readonly created_at?: string;
    readonly updated_at?: string;
};


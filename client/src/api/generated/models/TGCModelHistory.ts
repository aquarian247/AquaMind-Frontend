/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for TGCModel model.
 */
export type TGCModelHistory = {
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
    model_id?: number;
    /**
     * Model name (e.g., 'Scotland April TGC')
     */
    name: string;
    /**
     * Location (e.g., 'Scotland Site 1')
     */
    location: string;
    /**
     * Release timing (e.g., 'April')
     */
    release_period: string;
    /**
     * TGC coefficient (e.g., 0.025)
     */
    tgc_value: number;
    /**
     * Temperature exponent (e.g., 0.33)
     */
    exponent_n?: number;
    /**
     * Weight exponent (e.g., 0.66)
     */
    exponent_m?: number;
    readonly created_at: string;
    readonly updated_at: string;
    profile?: number | null;
};


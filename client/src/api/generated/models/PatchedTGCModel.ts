/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TGCModelStage } from './TGCModelStage';
/**
 * Enhanced serializer for TGC models with validation.
 */
export type PatchedTGCModel = {
    readonly model_id?: number;
    /**
     * Model name (e.g., 'Scotland April TGC')
     */
    name?: string;
    /**
     * Location (e.g., 'Scotland Site 1')
     */
    location?: string;
    /**
     * Release timing (e.g., 'April')
     */
    release_period?: string;
    profile?: number;
    readonly profile_name?: string;
    /**
     * TGC coefficient (e.g., 0.025)
     */
    tgc_value?: number;
    /**
     * Temperature exponent (e.g., 0.33)
     */
    exponent_n?: number;
    /**
     * Weight exponent (e.g., 0.66)
     */
    exponent_m?: number;
    readonly stage_overrides?: Array<TGCModelStage>;
    /**
     * Check if temperature profile has data.
     */
    readonly has_temperature_data?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
};


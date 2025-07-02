/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the Species model.
 */
export type PatchedSpecies = {
    readonly id?: number;
    name?: string;
    scientific_name?: string;
    description?: string;
    /**
     * Minimum optimal temperature in °C
     */
    optimal_temperature_min?: string | null;
    /**
     * Maximum optimal temperature in °C
     */
    optimal_temperature_max?: string | null;
    /**
     * Minimum optimal oxygen level in mg/L
     */
    optimal_oxygen_min?: string | null;
    /**
     * Minimum optimal pH level
     */
    optimal_ph_min?: string | null;
    /**
     * Maximum optimal pH level
     */
    optimal_ph_max?: string | null;
    readonly created_at?: string;
    readonly updated_at?: string;
};


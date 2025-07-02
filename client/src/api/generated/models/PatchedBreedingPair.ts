/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for breeding pairs.
 */
export type PatchedBreedingPair = {
    readonly id?: number;
    plan?: number;
    readonly plan_name?: string;
    male_fish?: number;
    readonly male_fish_display?: string;
    female_fish?: number;
    readonly female_fish_display?: string;
    /**
     * Date of pairing
     */
    pairing_date?: string;
    /**
     * Number of offspring produced
     */
    progeny_count?: number | null;
    readonly egg_production_count?: number;
    readonly created_at?: string;
    readonly updated_at?: string;
};


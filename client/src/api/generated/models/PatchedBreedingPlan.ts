/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BreedingTraitPriority } from './BreedingTraitPriority';
/**
 * Serializer for breeding plans.
 */
export type PatchedBreedingPlan = {
    readonly id?: number;
    /**
     * Plan name (e.g., 'Winter 2023 Breeding')
     */
    name?: string;
    /**
     * Plan start date
     */
    start_date?: string;
    /**
     * Plan end date
     */
    end_date?: string;
    /**
     * Plan objectives and goals
     */
    objectives?: string;
    /**
     * Technical notes from geneticist about breeding priorities and trait selection
     */
    geneticist_notes?: string;
    /**
     * Clear instructions for breeders on execution of the breeding plan
     */
    breeder_instructions?: string;
    readonly is_active?: boolean;
    readonly trait_priorities?: Array<BreedingTraitPriority>;
    readonly breeding_pair_count?: number;
    readonly created_by?: number | null;
    readonly created_at?: string;
    readonly updated_at?: string;
};


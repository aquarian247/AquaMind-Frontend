/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for breeding trait priorities.
 */
export type BreedingTraitPriority = {
    readonly id: number;
    plan: number;
    /**
     * Trait to prioritize
     *
     * * `growth_rate` - Growth Rate
     * * `disease_resistance` - Disease Resistance
     * * `size` - Size
     * * `fertility` - Fertility
     */
    trait_name: 'growth_rate' | 'disease_resistance' | 'size' | 'fertility';
    readonly trait_display: string;
    /**
     * Weight from 0 to 1 (e.g., 0.7)
     */
    priority_weight: number;
    readonly created_at: string;
    readonly updated_at: string;
};


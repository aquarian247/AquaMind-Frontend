/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompositionNestedBatch } from './CompositionNestedBatch';
/**
 * Serializer for the BatchComposition model.
 */
export type BatchComposition = {
    readonly id: number;
    readonly mixed_batch: CompositionNestedBatch;
    mixed_batch_id: number;
    readonly source_batch: CompositionNestedBatch;
    source_batch_id: number;
    /**
     * Number of fish from this source batch in the mixed batch
     */
    population_count: number;
    /**
     * Biomass from this source batch in the mixed batch
     */
    biomass_kg: string;
    percentage: string;
    readonly created_at: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchParentage } from './BatchParentage';
import type { BreedingPair } from './BreedingPair';
import type { ExternalEggBatch } from './ExternalEggBatch';
import type { SourceTypeEnum } from './SourceTypeEnum';
/**
 * Detailed serializer for egg production with nested data.
 */
export type EggProductionDetail = {
    readonly id: number;
    readonly pair: BreedingPair;
    readonly pair_display: string;
    /**
     * Unique egg batch identifier
     */
    egg_batch_id: string;
    /**
     * Number of eggs
     */
    egg_count: number;
    /**
     * Date produced or acquired
     */
    production_date?: string;
    /**
     * Destination freshwater station
     */
    destination_station?: number | null;
    /**
     * Internal or external source
     *
     * * `internal` - Internal
     * * `external` - External
     */
    source_type: SourceTypeEnum;
    readonly external_batch: ExternalEggBatch;
    readonly batch_assignment_count: number;
    readonly created_at: string;
    readonly updated_at: string;
    readonly batch_assignments: Array<BatchParentage>;
};


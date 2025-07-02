/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalEggBatch } from './ExternalEggBatch';
import type { SourceTypeEnum } from './SourceTypeEnum';
/**
 * Serializer for egg production.
 */
export type EggProduction = {
    readonly id: number;
    /**
     * Breeding pair (null for external eggs)
     */
    pair?: number | null;
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
};


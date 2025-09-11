/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for EggProduction model.
 */
export type EggProductionHistory = {
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
    id?: number;
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
     * Internal or external source
     *
     * * `internal` - Internal
     * * `external` - External
     */
    source_type: 'internal' | 'external';
    readonly created_at: string;
    readonly updated_at: string;
    /**
     * Breeding pair (null for external eggs)
     */
    pair?: number | null;
    /**
     * Destination freshwater station
     */
    destination_station?: number | null;
};


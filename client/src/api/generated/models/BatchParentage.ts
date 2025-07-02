/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for batch parentage.
 */
export type BatchParentage = {
    readonly id: number;
    batch: number;
    readonly batch_number: string;
    egg_production: number;
    readonly egg_batch_id: string;
    readonly egg_source_type: string;
    /**
     * Date eggs assigned to batch
     */
    assignment_date?: string;
    readonly created_at: string;
    readonly updated_at: string;
};


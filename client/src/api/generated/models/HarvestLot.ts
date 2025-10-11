/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Read-only serializer for harvest lots.
 */
export type HarvestLot = {
    readonly id: number;
    readonly event: number;
    /**
     * Timestamp of the harvest event that produced this lot.
     */
    readonly event_date: string;
    /**
     * Batch identifier associated with the harvest event.
     */
    readonly batch: number;
    /**
     * Batch number tied to the harvest event.
     */
    readonly batch_number: string;
    readonly product_grade: number;
    /**
     * Code representing the product grade.
     */
    readonly product_grade_code: string;
    /**
     * Human readable product grade name.
     */
    readonly product_grade_name: string;
    readonly live_weight_kg: string;
    readonly gutted_weight_kg: string | null;
    readonly fillet_weight_kg: string | null;
    readonly unit_count: number;
    readonly created_at: string;
    readonly updated_at: string;
};


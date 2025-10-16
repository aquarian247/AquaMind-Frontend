/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanySummary } from './CompanySummary';
import type { ProductGradeSummary } from './ProductGradeSummary';
import type { SiteSummary } from './SiteSummary';
/**
 * Read-only serializer for projected harvest facts.
 */
export type FactHarvest = {
    readonly fact_id: number;
    readonly event: number;
    readonly lot: number;
    readonly event_date: string;
    readonly quantity_kg: string;
    readonly unit_count: number;
    /**
     * Identifier of the originating batch.
     */
    readonly batch: number;
    /**
     * Finance company details.
     */
    readonly company: CompanySummary;
    /**
     * Finance site details.
     */
    readonly site: SiteSummary;
    /**
     * Product grade metadata for the lot.
     */
    readonly product_grade: ProductGradeSummary;
    readonly created_at: string;
    readonly updated_at: string;
};


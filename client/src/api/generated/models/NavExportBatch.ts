/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanySummary } from './CompanySummary';
/**
 * Read serializer for NAV export batches.
 */
export type NavExportBatch = {
    readonly id: number;
    readonly company: CompanySummary;
    readonly date_from: string;
    readonly date_to: string;
    readonly posting_date: string;
    readonly currency: string | null;
    /**
     * * `draft` - Draft
     * * `exported` - Exported
     */
    readonly state: 'draft' | 'exported';
    readonly created_at: string;
    readonly updated_at: string;
    readonly line_count: number;
};


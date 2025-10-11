/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IntercompanyPolicySummary } from './IntercompanyPolicySummary';
/**
 * Read-only serializer for intercompany transactions.
 */
export type IntercompanyTransaction = {
    readonly tx_id: number;
    readonly event: number;
    readonly posting_date: string;
    readonly amount: string | null;
    readonly currency: string | null;
    /**
     * * `pending` - Pending
     * * `exported` - Exported
     * * `posted` - Posted
     */
    readonly state: 'pending' | 'exported' | 'posted';
    /**
     * Policy metadata including participating companies.
     */
    readonly policy: IntercompanyPolicySummary;
    readonly created_at: string;
    readonly updated_at: string;
};


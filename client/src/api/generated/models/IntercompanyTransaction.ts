/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IntercompanyPolicySummary } from './IntercompanyPolicySummary';
import type { UserSummary } from './UserSummary';
/**
 * Read-only serializer for intercompany transactions.
 *
 * Supports polymorphic sources (HarvestEvent or BatchTransferWorkflow).
 */
export type IntercompanyTransaction = {
    readonly tx_id: number;
    /**
     * Type of source (harvestevent or batchtransferworkflow)
     */
    readonly source_type: string;
    /**
     * ID of the source object
     */
    readonly source_id: number;
    /**
     * Human-readable source identifier
     */
    readonly source_display: string;
    /**
     * DEPRECATED: Use polymorphic source instead
     */
    readonly event: number | null;
    readonly posting_date: string;
    readonly amount: string | null;
    readonly currency: string | null;
    /**
     * * `pending` - Pending Approval
     * * `posted` - Posted (Approved)
     * * `exported` - Exported to NAV
     */
    readonly state: 'pending' | 'posted' | 'exported';
    /**
     * Policy metadata including participating companies.
     */
    readonly policy: IntercompanyPolicySummary;
    /**
     * Manager who approved this transaction (PENDING → POSTED)
     */
    readonly approved_by: number | null;
    readonly approved_by_details: UserSummary | null;
    /**
     * When the transaction was approved
     */
    readonly approval_date: string | null;
    readonly created_at: string;
    readonly updated_at: string;
};


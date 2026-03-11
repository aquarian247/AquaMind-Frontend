/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ValuationRun = {
    readonly run_id: number;
    readonly company: number;
    readonly company_name: string;
    readonly operating_unit: number;
    readonly operating_unit_name: string;
    readonly budget: number | null;
    readonly import_batch: number | null;
    readonly year: number;
    readonly month: number;
    readonly version: number;
    /**
     * * `PREVIEW` - Preview
     * * `APPROVED` - Approved
     * * `EXPORTED` - Exported
     * * `FAILED` - Failed
     */
    readonly status: 'PREVIEW' | 'APPROVED' | 'EXPORTED' | 'FAILED';
    readonly created_by: number | null;
    readonly approved_by: number | null;
    readonly run_timestamp: string;
    readonly completed_at: string | null;
    readonly notes: string;
    readonly biology_snapshot: any;
    readonly allocation_snapshot: any;
    readonly rule_snapshot: any;
    readonly mortality_snapshot: any;
    readonly totals_snapshot: any;
    readonly nav_posting: any;
    readonly updated_at: string;
};


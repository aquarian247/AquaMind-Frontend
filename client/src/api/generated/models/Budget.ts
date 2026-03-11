/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Budget = {
    readonly budget_id: number;
    company: number;
    readonly company_name: string;
    name: string;
    fiscal_year: number;
    /**
     * * `DRAFT` - Draft
     * * `ACTIVE` - Active
     * * `ARCHIVED` - Archived
     */
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    version?: number;
    notes?: string;
    readonly created_by: number | null;
    readonly created_by_username: string | null;
    readonly created_at: string;
    readonly updated_at: string;
};


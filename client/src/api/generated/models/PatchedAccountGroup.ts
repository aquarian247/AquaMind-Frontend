/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PatchedAccountGroup = {
    readonly group_id?: number;
    code?: string;
    name?: string;
    /**
     * * `ASSET` - Asset
     * * `LIABILITY` - Liability
     * * `EQUITY` - Equity
     * * `REVENUE` - Revenue
     * * `EXPENSE` - Expense
     */
    account_type?: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    parent?: number | null;
    readonly parent_code?: string | null;
    /**
     * External cost-group code used in NAV imports.
     */
    cost_group?: string | null;
    description?: string;
    display_order?: number;
    is_active?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
};


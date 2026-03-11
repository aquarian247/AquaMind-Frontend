/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Account = {
    readonly account_id: number;
    code: string;
    name: string;
    /**
     * * `ASSET` - Asset
     * * `LIABILITY` - Liability
     * * `EQUITY` - Equity
     * * `REVENUE` - Revenue
     * * `EXPENSE` - Expense
     */
    account_type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    group?: number | null;
    readonly group_code: string | null;
    description?: string;
    is_active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AllocationRule = {
    readonly rule_id: number;
    name: string;
    account_group?: number | null;
    readonly account_group_code: string | null;
    cost_center?: number | null;
    readonly cost_center_code: string | null;
    effective_from: string;
    effective_to?: string | null;
    rule_definition?: any;
    is_active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


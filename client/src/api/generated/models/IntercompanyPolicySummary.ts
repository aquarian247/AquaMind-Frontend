/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanySummary } from './CompanySummary';
import type { ProductGradeSummary } from './ProductGradeSummary';
/**
 * Compact representation of an intercompany pricing policy.
 */
export type IntercompanyPolicySummary = {
    readonly id: number;
    /**
     * * `market` - Market
     * * `cost_plus` - Cost Plus
     * * `standard` - Standard
     */
    readonly method: 'market' | 'cost_plus' | 'standard';
    readonly markup_percent: string | null;
    readonly from_company: CompanySummary;
    readonly to_company: CompanySummary;
    readonly product_grade: ProductGradeSummary;
};


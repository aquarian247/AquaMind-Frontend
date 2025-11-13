/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanySummary } from './CompanySummary';
import type { LifeCycleStageSummary } from './LifeCycleStageSummary';
import type { ProductGradeSummary } from './ProductGradeSummary';
/**
 * Compact representation of an intercompany pricing policy.
 */
export type IntercompanyPolicySummary = {
    readonly id: number;
    /**
     * Whether this policy is for harvest (grade) or transfer (lifecycle)
     *
     * * `grade` - Product Grade (Harvest)
     * * `lifecycle` - Lifecycle Stage (Transfer)
     * * `egg_delivery` - Egg Delivery (Creation)
     */
    readonly pricing_basis: 'grade' | 'lifecycle' | 'egg_delivery';
    /**
     * * `market` - Market
     * * `cost_plus` - Cost Plus
     * * `standard` - Standard
     */
    readonly method: 'market' | 'cost_plus' | 'standard';
    /**
     * Markup percentage for COST_PLUS method
     */
    readonly markup_percent: string | null;
    /**
     * Fixed price per kg for STANDARD method
     */
    readonly price_per_kg: string | null;
    readonly from_company: CompanySummary;
    readonly to_company: CompanySummary;
    readonly product_grade: ProductGradeSummary | null;
    readonly lifecycle_stage: LifeCycleStageSummary | null;
};


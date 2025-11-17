/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Combined response for Growth Analysis page.
 *
 * Returns all data needed to render the Growth Analysis chart:
 * - Batch info
 * - Growth samples (measured anchors)
 * - Scenario projection (planned/modeled)
 * - Actual daily states (assimilated reality)
 * - Container assignments (for drilldown)
 *
 * This is a read-only response serializer (not bound to a model).
 */
export type GrowthAnalysisCombined = {
    batch_id: number;
    batch_number: string;
    species: string;
    lifecycle_stage: string;
    start_date: string;
    status: string;
    scenario?: Record<string, any> | null;
    growth_samples: Array<Record<string, any>>;
    scenario_projection: Array<Record<string, any>>;
    actual_daily_states: Array<Record<string, any>>;
    container_assignments: Array<Record<string, any>>;
    date_range: Record<string, any>;
};


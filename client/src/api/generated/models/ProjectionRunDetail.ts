/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Full serializer with parameters snapshot.
 */
export type ProjectionRunDetail = {
    readonly run_id: number;
    /**
     * The scenario configuration used for this run
     */
    scenario: number;
    readonly scenario_name: string;
    /**
     * Sequential run number for this scenario (1, 2, 3...)
     */
    readonly run_number: number;
    /**
     * Optional label (e.g., 'Baseline', 'Updated TGC')
     */
    label?: string;
    /**
     * When this projection run was created
     */
    readonly run_date: string;
    /**
     * Total number of projection records in this run
     */
    total_projections?: number;
    /**
     * Final average weight at end of projection
     */
    final_weight_g?: number | null;
    /**
     * Final biomass at end of projection
     */
    final_biomass_kg?: number | null;
    readonly pinned_batch_count: number;
    /**
     * User who created this run
     */
    created_by?: number | null;
    readonly created_at: string;
    readonly parameters_snapshot: any;
    /**
     * Additional notes about this run
     */
    notes?: string;
    readonly created_by_name: string | null;
    readonly updated_at: string;
};


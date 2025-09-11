/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for Scenario model.
 */
export type ScenarioHistory = {
    readonly history_id: number;
    /**
     * User who made the change
     */
    readonly history_user: string;
    /**
     * When the change was made
     */
    readonly history_date: string;
    /**
     * Type of change: + (Created), ~ (Updated), - (Deleted)
     */
    readonly history_type: string;
    /**
     * Reason for the change
     */
    readonly history_change_reason: string;
    scenario_id?: number;
    /**
     * Scenario name (e.g., 'Scotland April Sim')
     */
    name: string;
    /**
     * Simulation start date
     */
    start_date: string;
    /**
     * Total simulation days (e.g., 900)
     */
    duration_days: number;
    /**
     * Initial fish count (e.g., 10000)
     */
    initial_count: number;
    /**
     * Fish genotype (e.g., 'SalmoBreed')
     */
    genotype: string;
    /**
     * Fish supplier (e.g., 'AquaGen')
     */
    supplier: string;
    /**
     * Initial weight in grams (e.g., 50)
     */
    initial_weight?: number | null;
    readonly created_at: string;
    readonly updated_at: string;
    tgc_model?: number | null;
    fcr_model?: number | null;
    mortality_model?: number | null;
    /**
     * Optional link to existing batch for real-data initialization
     */
    batch?: number | null;
    /**
     * Biological constraints to use for validation
     */
    biological_constraints?: number | null;
    created_by?: number | null;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BiologicalConstraints } from './BiologicalConstraints';
import type { ScenarioModelChange } from './ScenarioModelChange';
/**
 * Enhanced serializer for scenarios with comprehensive validation.
 */
export type Scenario = {
    readonly scenario_id: number;
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
     * Initial weight in grams (e.g., 50)
     */
    initial_weight?: number | null;
    /**
     * Fish genotype (e.g., 'SalmoBreed')
     */
    genotype: string;
    /**
     * Fish supplier (e.g., 'AquaGen')
     */
    supplier: string;
    tgc_model: number;
    fcr_model: number;
    mortality_model: number;
    /**
     * Optional link to existing batch for real-data initialization
     */
    batch?: number | null;
    /**
     * Biological constraints to use for validation
     */
    biological_constraints?: number | null;
    readonly biological_constraints_info: BiologicalConstraints;
    readonly model_changes: Array<ScenarioModelChange>;
    readonly created_by: number | null;
    readonly created_by_name: string;
    /**
     * Determine initial lifecycle stage based on weight.
     */
    readonly initial_stage: Record<string, string> | null;
    /**
     * Estimate harvest day based on growth model.
     */
    readonly projected_harvest_day: number | null;
    readonly created_at: string;
    readonly updated_at: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the EnvironmentalParameter model.
 *
 * Handles environmental parameters that define acceptable ranges for various
 * water quality and environmental metrics in aquaculture operations.
 */
export type EnvironmentalParameter = {
    readonly id: number;
    /**
     * Name of the environmental parameter (e.g., 'Dissolved Oxygen', 'Temperature').
     */
    name: string;
    /**
     * Unit of measurement for this parameter (e.g., 'mg/L', '°C').
     */
    unit: string;
    /**
     * Detailed description of the parameter and its importance in aquaculture.
     */
    description?: string | null;
    /**
     * Minimum acceptable value for this parameter. Values below this trigger alerts.
     */
    min_value?: string | null;
    /**
     * Maximum acceptable value for this parameter. Values above this trigger alerts.
     */
    max_value?: string | null;
    /**
     * Minimum optimal value for this parameter. Values in the optimal range are ideal for fish health.
     */
    optimal_min?: string | null;
    /**
     * Maximum optimal value for this parameter. Values in the optimal range are ideal for fish health.
     */
    optimal_max?: string | null;
    readonly created_at: string;
    readonly updated_at: string;
};


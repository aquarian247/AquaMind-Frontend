/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for BatchContainerAssignment model.
 */
export type BatchContainerAssignmentHistory = {
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
    id?: number;
    population_count: number;
    /**
     * Average weight in grams per fish at the time of this specific assignment or update.
     */
    avg_weight_g?: string | null;
    /**
     * Total biomass in kilograms. Calculated if population_count and avg_weight_g are provided.
     */
    biomass_kg: string;
    assignment_date: string;
    /**
     * Date when this specific assignment ended (e.g., fish moved out or population became zero)
     */
    departure_date?: string | null;
    /**
     * Whether this assignment is current/active
     */
    is_active?: boolean;
    /**
     * Date of the most recent growth sample (weighing) for this assignment
     */
    last_weighing_date?: string | null;
    notes?: string;
    readonly created_at: string;
    readonly updated_at: string;
    batch?: number | null;
    container?: number | null;
    lifecycle_stage?: number | null;
};


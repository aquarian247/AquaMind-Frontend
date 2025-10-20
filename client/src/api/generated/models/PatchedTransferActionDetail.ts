/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Full serializer for action detail views.
 */
export type PatchedTransferActionDetail = {
    readonly id?: number;
    readonly workflow_number?: string;
    /**
     * Get parent workflow information.
     */
    readonly workflow_info?: Record<string, any> | null;
    readonly status_display?: string;
    readonly transfer_method_display?: string;
    /**
     * Get source assignment information.
     */
    readonly source_assignment_info?: Record<string, any> | null;
    /**
     * Get destination assignment information.
     */
    readonly dest_assignment_info?: Record<string, any> | null;
    readonly executed_by_username?: string;
    /**
     * Sequence number within workflow (1, 2, 3...)
     */
    action_number?: number;
    /**
     * Population in source container before this action
     */
    source_population_before?: number;
    /**
     * Number of fish to transfer
     */
    transferred_count?: number;
    /**
     * Number of mortalities during transfer
     */
    mortality_during_transfer?: number;
    /**
     * Biomass transferred (kg)
     */
    transferred_biomass_kg?: string;
    /**
     * * `PENDING` - Pending - Not Started
     * * `IN_PROGRESS` - In Progress - Being Executed
     * * `COMPLETED` - Completed
     * * `FAILED` - Failed - Rolled Back
     * * `SKIPPED` - Skipped
     */
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
    /**
     * Planned execution date
     */
    planned_date?: string | null;
    /**
     * Actual execution date
     */
    readonly actual_execution_date?: string | null;
    /**
     * Method used for transfer
     *
     * * `NET` - Net Transfer
     * * `PUMP` - Pump Transfer
     * * `GRAVITY` - Gravity Transfer
     * * `MANUAL` - Manual Bucket Transfer
     */
    transfer_method?: 'NET' | 'PUMP' | 'GRAVITY' | 'MANUAL' | '' | null;
    /**
     * Water temperature during transfer (°C)
     */
    water_temp_c?: string | null;
    /**
     * Oxygen level during transfer (mg/L)
     */
    oxygen_level?: string | null;
    /**
     * Duration of transfer in minutes
     */
    execution_duration_minutes?: number | null;
    /**
     * Notes about this specific action
     */
    notes?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    /**
     * Parent workflow this action belongs to
     */
    workflow?: number;
    /**
     * Source batch-container assignment
     */
    source_assignment?: number;
    /**
     * Destination batch-container assignment (created during execution)
     */
    dest_assignment?: number | null;
    /**
     * User who executed this action
     */
    readonly executed_by?: number | null;
};


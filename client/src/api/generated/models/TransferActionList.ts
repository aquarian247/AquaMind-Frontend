/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Lightweight serializer for action list views.
 */
export type TransferActionList = {
    readonly id: number;
    /**
     * Parent workflow this action belongs to
     */
    workflow: number;
    readonly workflow_number: string;
    /**
     * Sequence number within workflow (1, 2, 3...)
     */
    action_number: number;
    /**
     * Source batch-container assignment
     */
    source_assignment: number;
    readonly source_container_name: string;
    /**
     * Destination batch-container assignment (created during execution)
     */
    dest_assignment?: number | null;
    /**
     * Destination container for dynamic live handoffs.
     */
    dest_container?: number | null;
    readonly dest_container_name: string;
    /**
     * Number of fish to transfer
     */
    transferred_count: number;
    /**
     * Number of mortalities during transfer
     */
    mortality_during_transfer?: number;
    /**
     * Biomass transferred (kg)
     */
    transferred_biomass_kg: string;
    /**
     * Allow mixing with other batches if destination is occupied at execution
     */
    allow_mixed?: boolean;
    /**
     * * `PENDING` - Pending - Not Started
     * * `IN_PROGRESS` - In Progress - Being Executed
     * * `COMPLETED` - Completed
     * * `FAILED` - Failed - Rolled Back
     * * `SKIPPED` - Skipped
     */
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
    /**
     * Explicit transport leg type for dynamic handoffs.
     *
     * * `STATION_TO_VESSEL` - Station to Vessel
     * * `STATION_TO_TRUCK` - Station to Truck
     * * `TRUCK_TO_VESSEL` - Truck to Vessel
     * * `VESSEL_TO_RING` - Vessel to Ring
     */
    leg_type?: 'STATION_TO_VESSEL' | 'STATION_TO_TRUCK' | 'TRUCK_TO_VESSEL' | 'VESSEL_TO_RING' | '' | null;
    /**
     * How this action was created (planned vs live dynamic start).
     *
     * * `PLANNED` - Planned
     * * `DYNAMIC_LIVE` - Dynamic Live
     */
    created_via?: 'PLANNED' | 'DYNAMIC_LIVE';
    readonly status_display: string;
    /**
     * Planned execution date
     */
    planned_date?: string | null;
    /**
     * Actual execution date
     */
    readonly actual_execution_date: string | null;
    /**
     * High-resolution execution timestamp for operational ordering.
     */
    executed_at?: string | null;
    /**
     * Method used for transfer
     *
     * * `NET` - Net Transfer
     * * `PUMP` - Pump Transfer
     * * `GRAVITY` - Gravity Transfer
     * * `MANUAL` - Manual Bucket Transfer
     */
    transfer_method?: 'NET' | 'PUMP' | 'GRAVITY' | 'MANUAL' | '' | null;
    readonly transfer_method_display: string;
    /**
     * User who executed this action
     */
    readonly executed_by: number | null;
    readonly executed_by_username: string;
};


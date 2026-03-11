/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for creating workflows.
 * Auto-generates workflow_number.
 */
export type BatchTransferWorkflowCreate = {
    readonly id: number;
    readonly batch_number: string;
    /**
     * Get detailed batch information.
     */
    readonly batch_info: Record<string, any> | null;
    readonly workflow_type_display: string;
    readonly status_display: string;
    readonly source_stage_name: string;
    readonly dest_stage_name: string;
    readonly initiated_by_username: string;
    readonly completed_by_username: string;
    readonly is_vessel_transfer: boolean;
    readonly actions: string;
    /**
     * Unique workflow identifier (e.g., TRF-2024-001)
     */
    readonly workflow_number: string;
    /**
     * * `LIFECYCLE_TRANSITION` - Lifecycle Stage Transition
     * * `CONTAINER_REDISTRIBUTION` - Container Redistribution
     * * `EMERGENCY_CASCADE` - Emergency Cascading Transfer
     */
    workflow_type?: 'LIFECYCLE_TRANSITION' | 'CONTAINER_REDISTRIBUTION' | 'EMERGENCY_CASCADE';
    /**
     * * `DRAFT` - Draft - Planning
     * * `PLANNED` - Planned - Ready to Execute
     * * `IN_PROGRESS` - In Progress
     * * `COMPLETED` - Completed
     * * `CANCELLED` - Cancelled
     */
    status?: 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    /**
     * Planned start date for the workflow
     */
    planned_start_date: string;
    /**
     * Planned completion date
     */
    planned_completion_date?: string | null;
    /**
     * Date when first action was executed
     */
    readonly actual_start_date: string | null;
    /**
     * Date when last action was executed
     */
    readonly actual_completion_date: string | null;
    /**
     * Total fish in source containers
     */
    readonly total_source_count: number;
    /**
     * Total fish transferred
     */
    readonly total_transferred_count: number;
    /**
     * Total mortalities during transfer
     */
    readonly total_mortality_count: number;
    /**
     * Total biomass transferred (kg)
     */
    readonly total_biomass_kg: string;
    /**
     * Total number of actions planned
     */
    readonly total_actions_planned: number;
    /**
     * Number of actions completed
     */
    readonly actions_completed: number;
    /**
     * Completion percentage (0-100)
     */
    readonly completion_percentage: string;
    /**
     * When true, actions are created during execution time by ship crew instead of pre-defined during planning.
     */
    is_dynamic_execution?: boolean;
    /**
     * Dynamic route pattern for station-to-sea workflows. Required when is_dynamic_execution is true.
     *
     * * `DIRECT_STATION_TO_VESSEL` - Direct Station to Vessel
     * * `VIA_TRUCK_TO_VESSEL` - Via Truck to Vessel
     */
    dynamic_route_mode?: 'DIRECT_STATION_TO_VESSEL' | 'VIA_TRUCK_TO_VESSEL' | '' | null;
    /**
     * Optional operator estimate of total count to move.
     */
    estimated_total_count?: number | null;
    /**
     * Optional operator estimate of total biomass to move.
     */
    estimated_total_biomass_kg?: string | null;
    /**
     * Whether this transfer crosses subsidiary boundaries
     */
    is_intercompany?: boolean;
    /**
     * Source subsidiary (derived from containers)
     */
    source_subsidiary?: string | null;
    /**
     * Destination subsidiary (derived from containers)
     */
    dest_subsidiary?: string | null;
    /**
     * Timestamp of explicit dynamic workflow completion.
     */
    dynamic_completed_at?: string | null;
    /**
     * General notes about the workflow
     */
    notes?: string;
    /**
     * Reason for cancellation (if cancelled)
     */
    cancellation_reason?: string;
    readonly created_at: string;
    readonly updated_at: string;
    /**
     * Batch being transferred
     */
    batch: number;
    /**
     * Planned activity that spawned this workflow (if any)
     */
    planned_activity?: number | null;
    /**
     * Source lifecycle stage
     */
    source_lifecycle_stage: number;
    /**
     * Destination lifecycle stage (if stage transition)
     */
    dest_lifecycle_stage?: number | null;
    /**
     * Associated intercompany transaction (if applicable)
     */
    finance_transaction?: number | null;
    /**
     * User who created this workflow
     */
    readonly initiated_by: number;
    /**
     * User who completed this workflow
     */
    readonly completed_by: number | null;
    /**
     * User who explicitly completed a dynamic workflow.
     */
    dynamic_completed_by?: number | null;
};


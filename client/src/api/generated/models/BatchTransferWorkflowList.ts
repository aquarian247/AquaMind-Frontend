/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Lightweight serializer for workflow list views.
 */
export type BatchTransferWorkflowList = {
    readonly id: number;
    /**
     * Unique workflow identifier (e.g., TRF-2024-001)
     */
    readonly workflow_number: string;
    /**
     * Batch being transferred
     */
    batch: number;
    readonly batch_number: string;
    /**
     * * `LIFECYCLE_TRANSITION` - Lifecycle Stage Transition
     * * `CONTAINER_REDISTRIBUTION` - Container Redistribution
     * * `EMERGENCY_CASCADE` - Emergency Cascading Transfer
     */
    workflow_type?: 'LIFECYCLE_TRANSITION' | 'CONTAINER_REDISTRIBUTION' | 'EMERGENCY_CASCADE';
    readonly workflow_type_display: string;
    /**
     * * `DRAFT` - Draft - Planning
     * * `PLANNED` - Planned - Ready to Execute
     * * `IN_PROGRESS` - In Progress
     * * `COMPLETED` - Completed
     * * `CANCELLED` - Cancelled
     */
    status?: 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    readonly status_display: string;
    /**
     * Source lifecycle stage
     */
    source_lifecycle_stage: number;
    readonly source_stage_name: string;
    /**
     * Destination lifecycle stage (if stage transition)
     */
    dest_lifecycle_stage?: number | null;
    readonly dest_stage_name: string;
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
     * Whether this transfer crosses subsidiary boundaries
     */
    is_intercompany?: boolean;
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
    readonly is_vessel_transfer: boolean;
    /**
     * User who created this workflow
     */
    readonly initiated_by: number;
    readonly initiated_by_username: string;
    readonly created_at: string;
};


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
     * * `PARTIAL_HARVEST` - Partial Harvest Preparation
     */
    workflow_type?: 'LIFECYCLE_TRANSITION' | 'CONTAINER_REDISTRIBUTION' | 'EMERGENCY_CASCADE' | 'PARTIAL_HARVEST';
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
     * User who created this workflow
     */
    readonly initiated_by: number;
    readonly initiated_by_username: string;
    readonly created_at: string;
};


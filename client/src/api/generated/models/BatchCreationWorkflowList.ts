/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for list view of batch creation workflows.
 *
 * Includes basic info for table display.
 */
export type BatchCreationWorkflowList = {
    readonly id: number;
    /**
     * Unique workflow identifier (e.g. CRT-2025-001)
     */
    readonly workflow_number: string;
    /**
     * Batch created by this workflow (status: PLANNED initially)
     */
    batch: number;
    readonly batch_number: string;
    readonly species_name: string;
    readonly lifecycle_stage_name: string;
    /**
     * * `DRAFT` - Draft
     * * `PLANNED` - Planned
     * * `IN_PROGRESS` - In Progress
     * * `COMPLETED` - Completed
     * * `CANCELLED` - Cancelled
     */
    status?: 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    readonly status_display: string;
    /**
     * Whether eggs are from internal broodstock or external supplier
     *
     * * `INTERNAL` - Internal Broodstock
     * * `EXTERNAL` - External Supplier
     */
    egg_source_type: 'INTERNAL' | 'EXTERNAL';
    readonly egg_source_display: string;
    /**
     * Total eggs expected to be delivered across all actions
     */
    total_eggs_planned: number;
    /**
     * Actual eggs received (planned - mortality)
     */
    readonly total_eggs_received: number;
    /**
     * Total DOA (dead on arrival) eggs
     */
    readonly total_mortality_on_arrival: number;
    /**
     * Total number of delivery actions
     */
    readonly total_actions: number;
    /**
     * Number of actions completed
     */
    readonly actions_completed: number;
    /**
     * Percentage of actions completed
     */
    readonly progress_percentage: string;
    /**
     * When first delivery is planned
     */
    planned_start_date: string;
    /**
     * When first delivery actually occurred
     */
    readonly actual_start_date: string | null;
    /**
     * When all deliveries should be complete
     */
    planned_completion_date: string;
    /**
     * When all deliveries were actually completed
     */
    readonly actual_completion_date: string | null;
    readonly created_by_username: string | null;
    readonly created_at: string;
    readonly updated_at: string;
};


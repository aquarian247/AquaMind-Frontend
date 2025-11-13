/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Batch } from './Batch';
/**
 * Detailed serializer for batch creation workflow.
 *
 * Includes nested batch info, source details, and all fields.
 */
export type BatchCreationWorkflowDetail = {
    readonly id: number;
    readonly batch_detail: Batch;
    readonly egg_source_display: string;
    readonly status_display: string;
    readonly egg_production_detail: string;
    readonly external_supplier_detail: string;
    readonly created_by_username: string | null;
    readonly cancelled_by_username: string | null;
    readonly mortality_percentage: string;
    readonly estimated_total_cost: string;
    /**
     * Unique workflow identifier (e.g. CRT-2025-001)
     */
    readonly workflow_number: string;
    /**
     * * `DRAFT` - Draft
     * * `PLANNED` - Planned
     * * `IN_PROGRESS` - In Progress
     * * `COMPLETED` - Completed
     * * `CANCELLED` - Cancelled
     */
    status?: 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    /**
     * Whether eggs are from internal broodstock or external supplier
     *
     * * `INTERNAL` - Internal Broodstock
     * * `EXTERNAL` - External Supplier
     */
    egg_source_type: 'INTERNAL' | 'EXTERNAL';
    /**
     * Supplier's batch/lot number for traceability
     */
    external_supplier_batch_number?: string;
    /**
     * Cost per 1000 eggs (for external procurement)
     */
    external_cost_per_thousand?: string | null;
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
     * When first delivery is planned
     */
    planned_start_date: string;
    /**
     * When all deliveries should be complete
     */
    planned_completion_date: string;
    /**
     * When first delivery actually occurred
     */
    readonly actual_start_date: string | null;
    /**
     * When all deliveries were actually completed
     */
    readonly actual_completion_date: string | null;
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
     * Reason for cancellation (required if status = CANCELLED)
     */
    cancellation_reason?: string;
    /**
     * When workflow was cancelled
     */
    readonly cancelled_at: string | null;
    /**
     * General notes about this batch creation
     */
    notes?: string;
    readonly created_at: string;
    readonly updated_at: string;
    /**
     * Batch created by this workflow (status: PLANNED initially)
     */
    batch: number;
    /**
     * Link to broodstock egg production event (if internal)
     */
    egg_production?: number | null;
    /**
     * External egg supplier (if not internal broodstock)
     */
    external_supplier?: number | null;
    /**
     * User who created this workflow
     */
    created_by?: number | null;
    /**
     * User who cancelled this workflow
     */
    readonly cancelled_by: number | null;
};


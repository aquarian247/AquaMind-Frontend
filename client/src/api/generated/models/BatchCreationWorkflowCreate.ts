/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for creating a new batch creation workflow.
 *
 * Creates the batch automatically with status PLANNED.
 */
export type BatchCreationWorkflowCreate = {
    readonly id: number;
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
    readonly status: 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    /**
     * Whether eggs are from internal broodstock or external supplier
     *
     * * `INTERNAL` - Internal Broodstock
     * * `EXTERNAL` - External Supplier
     */
    egg_source_type: 'INTERNAL' | 'EXTERNAL';
    /**
     * Link to broodstock egg production event (if internal)
     */
    egg_production?: number | null;
    /**
     * External egg supplier (if not internal broodstock)
     */
    external_supplier?: number | null;
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
     * When first delivery is planned
     */
    planned_start_date: string;
    /**
     * When all deliveries should be complete
     */
    planned_completion_date: string;
    /**
     * General notes about this batch creation
     */
    notes?: string;
    batch_number: string;
    species_id: number;
    lifecycle_stage_id: number;
};


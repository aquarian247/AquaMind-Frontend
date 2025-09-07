/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignmentNestedBatch } from './AssignmentNestedBatch';
import type { NestedContainer } from './NestedContainer';
import type { NestedLifeCycleStage } from './NestedLifeCycleStage';
/**
 * Serializer for BatchContainerAssignment model.
 */
export type PatchedBatchContainerAssignment = {
    readonly id?: number;
    readonly batch?: AssignmentNestedBatch;
    batch_id?: number;
    readonly container?: NestedContainer;
    container_id?: number;
    readonly lifecycle_stage?: NestedLifeCycleStage;
    lifecycle_stage_id?: number;
    assignment_date?: string;
    population_count?: number;
    avg_weight_g?: string;
    readonly biomass_kg?: string;
    /**
     * Whether this assignment is current/active
     */
    is_active?: boolean;
    notes?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    /**
     * Get basic batch information.
     */
    readonly batch_info?: Record<string, any> | null;
    /**
     * Get basic container information.
     */
    readonly container_info?: Record<string, any> | null;
    /**
     * Get lifecycle stage information.
     */
    readonly lifecycle_stage_info?: Record<string, any> | null;
};


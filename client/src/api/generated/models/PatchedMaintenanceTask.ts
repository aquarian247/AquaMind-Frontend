/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskTypeEnum } from './TaskTypeEnum';
/**
 * Serializer for maintenance tasks.
 */
export type PatchedMaintenanceTask = {
    readonly id?: number;
    /**
     * Container requiring maintenance
     */
    container?: number;
    readonly container_name?: string;
    /**
     * Type of maintenance task
     *
     * * `cleaning` - Cleaning
     * * `repair` - Repair
     * * `inspection` - Inspection
     * * `upgrade` - Equipment Upgrade
     */
    task_type?: TaskTypeEnum;
    /**
     * Planned execution date
     */
    scheduled_date?: string;
    /**
     * Actual completion date
     */
    completed_date?: string | null;
    /**
     * Additional details about the task
     */
    notes?: string;
    readonly created_by?: number | null;
    readonly is_overdue?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for ScenarioModelChange model.
 */
export type ScenarioModelChangeHistory = {
    readonly history_id: number;
    /**
     * User who made the change
     */
    readonly history_user: string;
    /**
     * When the change was made
     */
    readonly history_date: string;
    /**
     * Type of change: + (Created), ~ (Updated), - (Deleted)
     */
    readonly history_type: string;
    /**
     * Reason for the change
     */
    readonly history_change_reason: string;
    change_id?: number;
    /**
     * Day of change (e.g., 180). Day 1 is the first simulation day.
     */
    change_day: number;
    readonly created_at: string;
    readonly updated_at: string;
    scenario?: number | null;
    new_tgc_model?: number | null;
    new_fcr_model?: number | null;
    new_mortality_model?: number | null;
};


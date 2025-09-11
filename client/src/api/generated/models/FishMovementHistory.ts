/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for FishMovement model.
 */
export type FishMovementHistory = {
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
    id?: number;
    /**
     * Date and time of movement
     */
    movement_date?: string;
    /**
     * Details about the movement
     */
    notes?: string;
    readonly created_at: string;
    readonly updated_at: string;
    fish?: number | null;
    from_container?: number | null;
    to_container?: number | null;
    moved_by?: number | null;
};


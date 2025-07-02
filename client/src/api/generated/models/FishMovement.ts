/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for fish movements.
 */
export type FishMovement = {
    readonly id: number;
    fish: number;
    readonly fish_display: string;
    from_container: number;
    readonly from_container_name: string;
    to_container: number;
    readonly to_container_name: string;
    /**
     * Date and time of movement
     */
    movement_date?: string;
    readonly moved_by: number | null;
    /**
     * Details about the movement
     */
    notes?: string;
    readonly created_at: string;
    readonly updated_at: string;
};


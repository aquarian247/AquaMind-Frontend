/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for Container model.
 */
export type ContainerHistory = {
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
    name: string;
    volume_m3: string;
    max_biomass_kg: string;
    feed_recommendations_enabled?: boolean;
    active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
    container_type?: number | null;
    hall?: number | null;
    area?: number | null;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for FreshwaterStation model.
 */
export type FreshwaterStationHistory = {
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
    /**
     * * `FRESHWATER` - Freshwater
     * * `BROODSTOCK` - Broodstock
     */
    station_type: 'FRESHWATER' | 'BROODSTOCK';
    /**
     * Latitude (automatically set when location is selected on map)
     */
    latitude: string;
    /**
     * Longitude (automatically set when location is selected on map)
     */
    longitude: string;
    description?: string;
    active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
    geography?: number | null;
};


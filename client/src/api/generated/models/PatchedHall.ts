/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the Hall model.
 */
export type PatchedHall = {
    readonly id?: number;
    /**
     * Unique name for the hall within its station (e.g., 'Hatchery Hall A', 'Grow-out Section 1').
     */
    name?: string;
    /**
     * ID of the freshwater station this hall belongs to.
     */
    freshwater_station?: number;
    /**
     * Name of the freshwater station this hall belongs to.
     */
    readonly freshwater_station_name?: string;
    /**
     * Optional description of the hall, its purpose, or specific characteristics.
     */
    description?: string;
    /**
     * Surface area of the hall in square meters (e.g., 500.75). Optional.
     */
    area_sqm?: string | null;
    /**
     * Indicates if the hall is currently active and in use.
     */
    active?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
};


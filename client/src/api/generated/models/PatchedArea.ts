/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Geography } from './Geography';
/**
 * Serializer for the Area model.
 */
export type PatchedArea = {
    readonly id?: number;
    /**
     * Unique name for the sea area.
     */
    name?: string;
    /**
     * ID of the geographical zone this area belongs to.
     */
    geography?: number;
    /**
     * Detailed information about the associated geographical zone.
     */
    readonly geography_details?: Geography;
    /**
     * Latitude of the area's central point (e.g., 60.123456). Must be between -90 and 90.
     */
    latitude?: string;
    /**
     * Longitude of the area's central point (e.g., 5.123456). Must be between -180 and 180.
     */
    longitude?: string;
    /**
     * Maximum permissible biomass capacity for this area, in kilograms (e.g., 100000.00).
     */
    max_biomass?: string;
    /**
     * Indicates if the area is currently active and available for use.
     */
    active?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
};


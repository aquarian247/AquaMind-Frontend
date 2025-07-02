/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StationTypeEnum } from './StationTypeEnum';
/**
 * Serializer for the FreshwaterStation model.
 */
export type FreshwaterStation = {
    readonly id: number;
    /**
     * Unique name for the freshwater station (e.g., 'Main Hatchery', 'Broodstock Unit Alpha').
     */
    name: string;
    /**
     * Type of the station (e.g., FRESHWATER, BROODSTOCK).
     *
     * * `FRESHWATER` - Freshwater
     * * `BROODSTOCK` - Broodstock
     */
    station_type: StationTypeEnum;
    /**
     * Human-readable display name for the station type.
     */
    readonly station_type_display: string;
    /**
     * ID of the geographical region this station belongs to.
     */
    geography: number;
    /**
     * Name of the geographical region this station belongs to.
     */
    readonly geography_name: string;
    /**
     * Latitude of the station (e.g., 62.000000). Usually set via map interface.
     */
    latitude: string;
    /**
     * Longitude of the station (e.g., -6.783333). Usually set via map interface.
     */
    longitude: string;
    /**
     * Optional description of the freshwater station, its facilities, or purpose.
     */
    description?: string;
    /**
     * Indicates if the freshwater station is currently active and operational.
     */
    active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


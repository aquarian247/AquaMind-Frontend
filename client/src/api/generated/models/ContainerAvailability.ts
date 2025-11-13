/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContainerAssignment } from './ContainerAssignment';
/**
 * Enriched container with availability forecast.
 *
 * Used by ContainerAvailabilityViewSet to return container data
 * with timeline-aware availability status.
 */
export type ContainerAvailability = {
    id: number;
    name: string;
    container_type: string;
    volume_m3: number;
    max_biomass_kg: number;
    /**
     * * `EMPTY` - EMPTY
     * * `OCCUPIED` - OCCUPIED
     */
    current_status: 'EMPTY' | 'OCCUPIED';
    current_assignments: Array<ContainerAssignment>;
    /**
     * * `EMPTY` - EMPTY
     * * `AVAILABLE` - AVAILABLE
     * * `OCCUPIED_BUT_OK` - OCCUPIED_BUT_OK
     * * `CONFLICT` - CONFLICT
     */
    availability_status: 'EMPTY' | 'AVAILABLE' | 'OCCUPIED_BUT_OK' | 'CONFLICT';
    days_until_available: number | null;
    availability_message: string;
    available_capacity_kg: number;
    available_capacity_percent: number;
};


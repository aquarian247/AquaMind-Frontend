/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for truck/vessel transport carriers.
 */
export type PatchedTransportCarrier = {
    readonly id?: number;
    name?: string;
    /**
     * * `TRUCK` - Truck
     * * `VESSEL` - Vessel
     */
    carrier_type?: 'TRUCK' | 'VESSEL';
    /**
     * Geography the carrier belongs to.
     */
    geography?: number;
    /**
     * Geography name.
     */
    readonly geography_name?: string;
    capacity_m3?: string;
    license_plate?: string;
    imo_number?: string;
    captain_contact?: string;
    active?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
};


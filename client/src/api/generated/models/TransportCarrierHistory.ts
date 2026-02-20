/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for TransportCarrier model.
 */
export type TransportCarrierHistory = {
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
     * * `TRUCK` - Truck
     * * `VESSEL` - Vessel
     */
    carrier_type: 'TRUCK' | 'VESSEL';
    capacity_m3: string;
    license_plate?: string;
    imo_number?: string;
    captain_contact?: string;
    active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
    geography?: number | null;
};


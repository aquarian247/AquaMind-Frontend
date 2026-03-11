/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransferStartManualReadings } from './TransferStartManualReadings';
/**
 * Serializer for dynamic handoff start requests.
 */
export type TransferHandoffStart = {
    /**
     * * `STATION_TO_VESSEL` - Station to Vessel
     * * `STATION_TO_TRUCK` - Station to Truck
     * * `TRUCK_TO_VESSEL` - Truck to Vessel
     * * `VESSEL_TO_RING` - Vessel to Ring
     */
    leg_type: 'STATION_TO_VESSEL' | 'STATION_TO_TRUCK' | 'TRUCK_TO_VESSEL' | 'VESSEL_TO_RING';
    source_assignment_id: number;
    dest_container_id: number;
    planned_transferred_count: number;
    planned_transferred_biomass_kg: string;
    /**
     * * `NET` - Net Transfer
     * * `PUMP` - Pump Transfer
     * * `GRAVITY` - Gravity Transfer
     * * `MANUAL` - Manual Bucket Transfer
     */
    transfer_method?: 'NET' | 'PUMP' | 'GRAVITY' | 'MANUAL';
    allow_mixed?: boolean;
    notes?: string;
    allow_compliance_override?: boolean;
    compliance_override_note?: string;
    source_manual_readings?: TransferStartManualReadings;
    dest_manual_readings?: TransferStartManualReadings;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for dynamic handoff completion payload.
 */
export type TransferHandoffComplete = {
    transferred_count: number;
    transferred_biomass_kg: string;
    mortality_during_transfer?: number;
    /**
     * * `NET` - Net Transfer
     * * `PUMP` - Pump Transfer
     * * `GRAVITY` - Gravity Transfer
     * * `MANUAL` - Manual Bucket Transfer
     */
    transfer_method?: 'NET' | 'PUMP' | 'GRAVITY' | 'MANUAL';
    water_temp_c?: string;
    oxygen_level?: string;
    execution_duration_minutes?: number;
    notes?: string;
};


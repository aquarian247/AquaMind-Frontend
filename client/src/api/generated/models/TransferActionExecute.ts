/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for executing a transfer action.
 */
export type TransferActionExecute = {
    /**
     * Number of mortalities during transfer
     */
    mortality_during_transfer?: number;
    /**
     * Method used for transfer
     *
     * * `NET` - Net Transfer
     * * `PUMP` - Pump Transfer
     * * `GRAVITY` - Gravity Transfer
     * * `MANUAL` - Manual Bucket Transfer
     */
    transfer_method?: 'NET' | 'PUMP' | 'GRAVITY' | 'MANUAL';
    /**
     * Water temperature during transfer (°C)
     */
    water_temp_c?: string;
    /**
     * Oxygen level during transfer (mg/L)
     */
    oxygen_level?: string;
    /**
     * Duration of transfer in minutes
     */
    execution_duration_minutes?: number;
    /**
     * Notes about the execution
     */
    notes?: string;
};


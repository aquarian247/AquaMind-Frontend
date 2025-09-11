/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for Sensor model.
 */
export type SensorHistory = {
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
     * * `TEMPERATURE` - Temperature
     * * `OXYGEN` - Oxygen
     * * `PH` - pH
     * * `SALINITY` - Salinity
     * * `CO2` - CO2
     * * `OTHER` - Other
     */
    sensor_type: 'TEMPERATURE' | 'OXYGEN' | 'PH' | 'SALINITY' | 'CO2' | 'OTHER';
    serial_number?: string;
    manufacturer?: string;
    installation_date?: string | null;
    last_calibration_date?: string | null;
    active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
    container?: number | null;
};


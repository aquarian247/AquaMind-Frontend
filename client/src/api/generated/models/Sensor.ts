/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the Sensor model.
 */
export type Sensor = {
    readonly id: number;
    /**
     * User-defined name for the sensor (e.g., 'Tank 1 Temp Sensor', 'Oxygen Probe - Pen 5').
     */
    name: string;
    /**
     * Type of the sensor (e.g., TEMPERATURE, OXYGEN, PH).
     *
     * * `TEMPERATURE` - Temperature
     * * `OXYGEN` - Oxygen
     * * `PH` - pH
     * * `SALINITY` - Salinity
     * * `CO2` - CO2
     * * `OTHER` - Other
     */
    sensor_type: 'TEMPERATURE' | 'OXYGEN' | 'PH' | 'SALINITY' | 'CO2' | 'OTHER';
    /**
     * Human-readable display name for the sensor type.
     */
    readonly sensor_type_display: string;
    /**
     * ID of the container where this sensor is installed.
     */
    container: number;
    /**
     * Name of the container where this sensor is installed.
     */
    readonly container_name: string;
    /**
     * Manufacturer's serial number for the sensor. Optional.
     */
    serial_number?: string;
    /**
     * Manufacturer of the sensor. Optional.
     */
    manufacturer?: string;
    /**
     * Date when the sensor was installed. Optional. Format: YYYY-MM-DD.
     */
    installation_date?: string | null;
    /**
     * Date when the sensor was last calibrated. Optional. Format: YYYY-MM-DD.
     */
    last_calibration_date?: string | null;
    /**
     * Indicates if the sensor is currently active and providing readings.
     */
    active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


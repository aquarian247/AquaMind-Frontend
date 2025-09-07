/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the EnvironmentalReading model.
 *
 * Handles TimescaleDB hypertable data with special attention to the time column.
 * This serializer manages time-series environmental readings from sensors and manual measurements.
 */
export type EnvironmentalReading = {
    readonly id: number;
    /**
     * Name of the environmental parameter being measured.
     */
    readonly parameter_name: string;
    /**
     * Name of the container where the reading was taken.
     */
    readonly container_name: string;
    /**
     * Name/number of the batch associated with this reading.
     */
    readonly batch_name: string;
    /**
     * Name of the sensor that recorded this reading, if applicable.
     */
    readonly sensor_name: string;
    /**
     * The environmental parameter being measured (references EnvironmentalParameter model).
     */
    parameter: number;
    /**
     * The container where the reading was taken.
     */
    container: number;
    /**
     * Optional batch associated with this reading.
     */
    batch?: number | null;
    /**
     * Optional sensor that recorded this reading. Required if is_manual is False.
     */
    sensor?: number | null;
    /**
     * Timestamp when the reading was taken. Used as the time dimension in TimescaleDB.
     */
    reading_time: string;
    /**
     * The measured value of the parameter.
     */
    value: string;
    /**
     * Whether this reading was taken manually (true) or by an automated sensor (false).
     */
    is_manual?: boolean;
    notes?: string;
    readonly created_at: string;
    recorded_by?: number | null;
};


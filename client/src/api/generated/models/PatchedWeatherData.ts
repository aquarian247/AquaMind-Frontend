/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the WeatherData model.
 *
 * Handles TimescaleDB hypertable data with special attention to the time column.
 * Manages weather data recordings that may affect aquaculture operations.
 */
export type PatchedWeatherData = {
    readonly id?: number;
    /**
     * Name of the area where this weather data was recorded.
     */
    readonly area_name?: string;
    /**
     * The area where this weather data was recorded.
     */
    area?: number;
    /**
     * Timestamp when the weather data was recorded. Used as the time dimension in TimescaleDB.
     */
    timestamp?: string;
    /**
     * Air temperature in degrees Celsius.
     */
    temperature?: string | null;
    /**
     * Wind speed in meters per second.
     */
    wind_speed?: string | null;
    /**
     * Wind direction in degrees (0-360, where 0/360 is North).
     */
    wind_direction?: number | null;
    /**
     * Precipitation amount in millimeters.
     */
    precipitation?: string | null;
    /**
     * Wave height in meters.
     */
    wave_height?: string | null;
    /**
     * Wave direction in degrees (0-360, where 0/360 is North).
     */
    wave_direction?: number | null;
    /**
     * Cloud cover percentage (0-100).
     */
    cloud_cover?: number | null;
    /**
     * Wave period in seconds
     */
    wave_period?: string | null;
    readonly created_at?: string;
};


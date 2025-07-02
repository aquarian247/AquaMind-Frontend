/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the PhotoperiodData model.
 *
 * Handles photoperiod (day/night cycle) data for different areas,
 * which is important for managing fish growth and maturation.
 */
export type PatchedPhotoperiodData = {
    readonly id?: number;
    /**
     * Name of the area where this photoperiod data applies.
     */
    readonly area_name?: string;
    /**
     * The area where this photoperiod data applies.
     */
    area?: number;
    /**
     * Date for which this photoperiod data is recorded.
     */
    date?: string;
    /**
     * Natural day length in hours (0-24).
     */
    day_length_hours?: string;
    /**
     * Time when artificial lighting starts, if used.
     */
    artificial_light_start?: string | null;
    /**
     * Time when artificial lighting ends, if used.
     */
    artificial_light_end?: string | null;
    /**
     * Additional notes about the photoperiod conditions.
     */
    notes?: string | null;
    /**
     * Light intensity in lux
     */
    light_intensity?: string | null;
    /**
     * Whether this data point was interpolated rather than measured
     */
    is_interpolated?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
};


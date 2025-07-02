/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the Container model.
 */
export type PatchedContainer = {
    readonly id?: number;
    /**
     * Unique name for the container (e.g., Tank A1, Pen 3).
     */
    name?: string;
    /**
     * ID of the container type (e.g., tank, pen, tray).
     */
    container_type?: number;
    /**
     * Name of the container type.
     */
    readonly container_type_name?: string;
    /**
     * ID of the hall this container is located in (if applicable). Mutually exclusive with 'area'.
     */
    hall?: number | null;
    /**
     * Name of the hall this container is located in.
     */
    readonly hall_name?: string | null;
    /**
     * ID of the sea area this container is located in (if applicable). Mutually exclusive with 'hall'.
     */
    area?: number | null;
    /**
     * Name of the sea area this container is located in.
     */
    readonly area_name?: string | null;
    /**
     * Volume of the container in cubic meters (e.g., 150.75).
     */
    volume_m3?: string;
    /**
     * Maximum recommended biomass capacity for this container in kilograms (e.g., 5000.00).
     */
    max_biomass_kg?: string;
    /**
     * Indicates if automatic feed recommendations are enabled for this container.
     */
    feed_recommendations_enabled?: boolean;
    /**
     * Indicates if the container is currently active and in use.
     */
    active?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
};


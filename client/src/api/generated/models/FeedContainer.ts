/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContainerTypeEnum } from './ContainerTypeEnum';
/**
 * Serializer for the FeedContainer model.
 */
export type FeedContainer = {
    readonly id: number;
    /**
     * Unique name for the feed container (e.g., 'Silo 1', 'Feed Barge Alpha').
     */
    name: string;
    /**
     * Type of the feed container (e.g., SILO, BARGE, TANK).
     *
     * * `SILO` - Silo
     * * `BARGE` - Barge
     * * `TANK` - Tank
     * * `OTHER` - Other
     */
    container_type: ContainerTypeEnum;
    /**
     * Human-readable display name for the container type.
     */
    readonly container_type_display: string;
    /**
     * ID of the hall this feed container is associated with (if applicable). Mutually exclusive with 'area'.
     */
    hall?: number | null;
    /**
     * Name of the hall this feed container is associated with.
     */
    readonly hall_name: string | null;
    /**
     * ID of the sea area this feed container is associated with (if applicable). Mutually exclusive with 'hall'.
     */
    area?: number | null;
    /**
     * Name of the sea area this feed container is associated with.
     */
    readonly area_name: string | null;
    /**
     * Total capacity of the feed container in kilograms (e.g., 50000.00).
     */
    capacity_kg: string;
    /**
     * Indicates if the feed container is currently active and in use.
     */
    active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


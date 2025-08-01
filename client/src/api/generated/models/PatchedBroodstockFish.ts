/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for broodstock fish.
 */
export type PatchedBroodstockFish = {
    readonly id?: number;
    /**
     * Current container housing the fish
     */
    container?: number;
    readonly container_name?: string;
    /**
     * Basic traits (e.g., growth_rate, size)
     */
    traits?: any;
    /**
     * Current health status
     *
     * * `healthy` - Healthy
     * * `monitored` - Monitored
     * * `sick` - Sick
     * * `deceased` - Deceased
     */
    health_status?: 'healthy' | 'monitored' | 'sick' | 'deceased';
    readonly movement_count?: number;
    readonly created_at?: string;
    readonly updated_at?: string;
};


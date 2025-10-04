/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InfrastructureService {
    /**
     * Get KPI summary for a hall including container counts, biomass, population, and average weight.
     * @param id A unique integer value identifying this hall.
     * @param isActive Filter assignments by active status (default: true).
     * @returns any Hall KPI metrics
     * @throws ApiError
     */
    public static hallSummary(
        id: number,
        isActive: boolean = true,
    ): CancelablePromise<{
        /**
         * Total number of containers in the hall
         */
        container_count: number;
        /**
         * Total active biomass in kilograms
         */
        active_biomass_kg: number;
        /**
         * Total population count
         */
        population_count: number;
        /**
         * Average weight in kilograms per fish
         */
        avg_weight_kg: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/infrastructure/halls/{id}/summary/',
            path: {
                'id': id,
            },
            query: {
                'is_active': isActive,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Retrieve aggregated infrastructure overview metrics. Returns totals for containers, capacity, active biomass, a placeholder sensor alert count, and the number of feeding events in the last 24 hours.
     * @returns any Aggregated overview metrics
     * @throws ApiError
     */
    public static infrastructureOverview(): CancelablePromise<{
        total_containers: number;
        capacity_kg: number;
        active_biomass_kg: number;
        sensor_alerts: number;
        feeding_events_today: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/infrastructure/overview/',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
}

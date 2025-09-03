/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InfrastructureService {
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

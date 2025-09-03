/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthCheckResponse } from '../models/HealthCheckResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemService {
    /**
     * API Health Check
     * Health check endpoint for monitoring API availability and basic system status.
     * @returns HealthCheckResponse
     * @throws ApiError
     */
    public static healthCheckRetrieve(): CancelablePromise<HealthCheckResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health-check/',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
}

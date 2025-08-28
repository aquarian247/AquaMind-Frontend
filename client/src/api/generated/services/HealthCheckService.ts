/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthCheckService {
    /**
     * API health check endpoint for monitoring and testing.
     *
     * This endpoint provides a simple way to verify that:
     * 1. The Django application is running
     * 2. The database is accessible
     * 3. Basic API functionality is working
     *
     * Returns 200 OK with system status information, or 503 if services are unavailable.
     * @returns any No response body
     * @throws ApiError
     */
    public static healthCheckRetrieve(): CancelablePromise<any> {
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

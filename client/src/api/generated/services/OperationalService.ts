/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedFCRTrendsList } from '../models/PaginatedFCRTrendsList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OperationalService {
    /**
     * Get FCR trends data
     * Retrieve FCR (Feed Conversion Ratio) trend data with actual and predicted values across different time intervals and aggregation levels.
     * @param assignmentId Optional assignment ID for container-level aggregation
     * @param batchId Optional batch ID for batch-level aggregation
     * @param endDate End date for the trend analysis (ISO format, default: today)
     * @param geographyId Optional geography ID for geography-level aggregation
     * @param includePredicted Include predicted FCR values from scenarios
     * @param interval Time interval for aggregation
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param startDate Start date for the trend analysis (ISO format, default: 1 year ago)
     * @returns PaginatedFCRTrendsList
     * @throws ApiError
     */
    public static apiV1OperationalFcrTrendsList(
        assignmentId?: number,
        batchId?: number,
        endDate?: string,
        geographyId?: number,
        includePredicted: boolean = true,
        interval: 'DAILY' | 'MONTHLY' | 'WEEKLY' = 'WEEKLY',
        ordering?: string,
        page?: number,
        search?: string,
        startDate?: string,
    ): CancelablePromise<PaginatedFCRTrendsList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/operational/fcr-trends/',
            query: {
                'assignment_id': assignmentId,
                'batch_id': batchId,
                'end_date': endDate,
                'geography_id': geographyId,
                'include_predicted': includePredicted,
                'interval': interval,
                'ordering': ordering,
                'page': page,
                'search': search,
                'start_date': startDate,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
}

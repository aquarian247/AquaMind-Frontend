/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedFCRTrendsList } from '../models/PaginatedFCRTrendsList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TrendsService {
    /**
     * Get FCR trends data
     *
     * Retrieve FCR (Feed Conversion Ratio) trend data with actual and predicted values across different time intervals and aggregation levels.
     *
     * **Time Intervals:**
     * - `DAILY`: Single calendar day buckets
     * - `WEEKLY`: Monday-Sunday inclusive buckets
     * - `MONTHLY`: Calendar month buckets (1st to last day)
     *
     * **Aggregation Levels:**
     * - `batch`: Aggregate by batch ID
     * - `assignment`: Aggregate by container assignment ID
     * - `geography`: Aggregate across all batches in geography (default when no filters provided)
     *
     * **Defaults when no filters provided:**
     * - `aggregation_level`: 'geography'
     * - `interval`: 'DAILY'
     * - `start_date`: 1 year ago
     * - `end_date`: today
     *
     * **FCR Units:** Ratio (feed consumed kg / biomass gained kg)
     *
     * @param assignmentId Optional assignment ID for container-level aggregation. When provided, aggregation_level becomes "assignment".
     * @param batchId Optional batch ID for batch-level aggregation. When provided, aggregation_level becomes "batch".
     * @param endDate End date for the trend analysis (ISO format: YYYY-MM-DD, default: today)
     * @param geographyId Optional geography ID for geography-level aggregation. When provided, aggregation_level becomes "geography".
     * @param includePredicted Include predicted FCR values from scenario models (default: true)
     * @param interval Time interval for aggregation. DAILY=calendar days, WEEKLY=Monday-Sunday inclusive, MONTHLY=calendar months.
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param startDate Start date for the trend analysis (ISO format: YYYY-MM-DD, default: 1 year ago)
     * @returns PaginatedFCRTrendsList
     * @throws ApiError
     */
    public static apiV1OperationalFcrTrendsList(
        assignmentId?: number,
        batchId?: number,
        endDate?: string,
        geographyId?: number,
        includePredicted: boolean = true,
        interval: 'DAILY' | 'MONTHLY' | 'WEEKLY' = 'DAILY',
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

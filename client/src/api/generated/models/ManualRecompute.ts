/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request serializer for manual recompute trigger (admin).
 *
 * POST /api/v1/batch/batches/{id}/recompute-daily-states/
 * Body: {
     * "start_date": "2024-01-01",
     * "end_date": "2024-01-31",
     * "assignment_ids": [1, 2, 3]  // Optional
     * }
     */
    export type ManualRecompute = {
        start_date: string;
        end_date?: string | null;
        /**
         * Optional: Specific assignments to recompute. If not provided, all assignments recomputed.
         */
        assignment_ids?: Array<number> | null;
    };


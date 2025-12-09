/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for individual activity variance data.
 */
export type ActivityVarianceItem = {
    id: number;
    batch_number: string;
    batch_id: number;
    activity_type: string;
    activity_type_display: string;
    due_date: string;
    completed_at: string | null;
    status: string;
    /**
     * Days between due_date and completion. Negative=early, 0=on-time, Positive=late
     */
    variance_days: number | null;
    /**
     * True if completed on or before due_date
     */
    is_on_time: boolean | null;
};


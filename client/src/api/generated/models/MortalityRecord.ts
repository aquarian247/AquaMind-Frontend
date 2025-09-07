/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the MortalityRecord model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 * Records mortality events including count, reason, and associated batch/container.
 */
export type MortalityRecord = {
    readonly id: number;
    /**
     * The batch associated with this mortality record.
     */
    batch: number;
    /**
     * The container where the mortality occurred.
     */
    container: number;
    /**
     * Date and time when the mortality event was recorded (auto-set).
     */
    readonly event_date: string;
    /**
     * Number of mortalities recorded in this event.
     */
    count: number;
    /**
     * Reason for the mortality (references MortalityReason model).
     */
    reason: number;
    /**
     * Additional notes about the mortality event.
     */
    notes?: string | null;
};


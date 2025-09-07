/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the HealthLabSample model.
 *
 * Handles creating lab samples with historical batch-container assignment lookup
 * based on the sample date.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 * Includes HealthDecimalFieldsMixin for decimal field validation and
 * UserAssignmentMixin for automatic user assignment.
 *
 * This serializer handles the complex logic of finding the correct historical
 * batch-container assignment based on the sample date, which is crucial for
 * accurate record-keeping when lab results may arrive weeks after sampling.
 */
export type HealthLabSample = {
    readonly id: number;
    /**
     * The specific batch-container assignment active when the sample was taken.
     */
    readonly batch_container_assignment: number;
    /**
     * ID of the batch from which the sample was taken. Used to find the historical assignment.
     */
    batch_id: number;
    /**
     * ID of the container from which the sample was taken. Used to find the historical assignment.
     */
    container_id: number;
    /**
     * Type of sample collected (references SampleType model).
     */
    sample_type: number;
    /**
     * Date when the sample was collected. Used to find the historical batch-container assignment.
     */
    sample_date: string;
    /**
     * Date when the sample was sent to the laboratory for analysis.
     */
    date_sent_to_lab?: string | null;
    /**
     * Date when the results were received from the laboratory.
     */
    date_results_received?: string | null;
    /**
     * Reference ID assigned by the laboratory for tracking purposes.
     */
    lab_reference_id?: string | null;
    /**
     * Summary of the laboratory findings and results.
     */
    findings_summary?: string | null;
    /**
     * Structured JSON data containing quantitative test results.
     */
    quantitative_results?: any;
    /**
     * File attachment for the lab report (e.g., PDF).
     */
    attachment?: string | null;
    /**
     * Additional notes about the sample or results.
     */
    notes?: string | null;
    /**
     * User who recorded this lab sample result.
     */
    recorded_by?: number | null;
    readonly created_at: string;
    readonly updated_at: string;
    /**
     * Batch number from the associated batch-container assignment.
     */
    readonly batch_number: string;
    /**
     * Container name from the associated batch-container assignment.
     */
    readonly container_name: string;
    /**
     * Name of the sample type.
     */
    readonly sample_type_name: string;
    /**
     * Username of the person who recorded this sample.
     */
    readonly recorded_by_username: string;
    /**
     * Detailed information about the batch-container assignment at the time of sampling.
     */
    readonly batch_container_assignment_details: string;
    readonly batch: string;
    readonly container: string;
};


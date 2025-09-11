/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for HealthLabSample model.
 */
export type HealthLabSampleHistory = {
    readonly history_id: number;
    /**
     * User who made the change
     */
    readonly history_user: string;
    /**
     * When the change was made
     */
    readonly history_date: string;
    /**
     * Type of change: + (Created), ~ (Updated), - (Deleted)
     */
    readonly history_type: string;
    /**
     * Reason for the change
     */
    readonly history_change_reason: string;
    id?: number;
    /**
     * Date the sample was physically taken. Crucial for historical linkage.
     */
    sample_date: string;
    /**
     * Date the sample was sent to the laboratory.
     */
    date_sent_to_lab?: string | null;
    /**
     * Date the results were received from the laboratory.
     */
    date_results_received?: string | null;
    /**
     * External reference ID from the laboratory.
     */
    lab_reference_id?: string | null;
    /**
     * Qualitative summary of the lab findings.
     */
    findings_summary?: string | null;
    /**
     * Structured quantitative results (e.g., {'param': 'value', 'unit': 'cfu/ml'}).
     */
    quantitative_results?: any;
    /**
     * File attachment for the lab report (e.g., PDF).
     */
    attachment?: string | null;
    /**
     * Additional notes or comments by the veterinarian.
     */
    notes?: string | null;
    readonly created_at: string;
    readonly updated_at: string;
    /**
     * The specific batch-container assignment active when the sample was taken.
     */
    batch_container_assignment?: number | null;
    /**
     * Type of sample taken (e.g., skin mucus, water sample).
     */
    sample_type?: number | null;
    /**
     * User who recorded this lab sample result.
     */
    recorded_by?: number | null;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for Treatment model.
 */
export type TreatmentHistory = {
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
    treatment_date?: string;
    /**
     * Type of treatment administered.
     *
     * * `medication` - Medication
     * * `vaccination` - Vaccination
     * * `physical` - Physical Treatment
     * * `other` - Other
     */
    treatment_type: 'medication' | 'vaccination' | 'physical' | 'other';
    /**
     * Description of the treatment.
     */
    description: string;
    /**
     * Dosage of medication or treatment.
     */
    dosage?: string;
    /**
     * Duration of treatment in days.
     */
    duration_days?: number;
    /**
     * Withholding period in days.
     */
    withholding_period_days?: number;
    /**
     * Outcome of the treatment.
     *
     * * `pending` - Pending
     * * `successful` - Successful
     * * `partial` - Partially Successful
     * * `unsuccessful` - Unsuccessful
     */
    outcome?: 'pending' | 'successful' | 'partial' | 'unsuccessful';
    /**
     * The batch receiving the treatment.
     */
    batch?: number | null;
    /**
     * The specific container, if applicable.
     */
    container?: number | null;
    /**
     * The specific batch-container assignment, if applicable.
     */
    batch_assignment?: number | null;
    /**
     * User who recorded the treatment.
     */
    user?: number | null;
    /**
     * Specific vaccination type, if applicable.
     */
    vaccination_type?: number | null;
};


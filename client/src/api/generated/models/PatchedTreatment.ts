/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TreatmentTypeEnum } from './TreatmentTypeEnum';
/**
 * Serializer for the Treatment model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 * Includes HealthDecimalFieldsMixin for decimal field validation and UserAssignmentMixin
 * for automatic user assignment.
 *
 * This serializer handles treatment records for fish health management, including
 * medications, vaccinations, and other therapeutic interventions.
 */
export type PatchedTreatment = {
    readonly id?: number;
    /**
     * The batch that received the treatment.
     */
    batch?: number;
    /**
     * The container where the treatment was administered.
     */
    container?: number;
    /**
     * Optional specific batch-container assignment for this treatment.
     */
    batch_assignment?: number | null;
    /**
     * User who recorded the treatment.
     */
    readonly user?: number;
    /**
     * Date and time when the treatment was administered (auto-set).
     */
    readonly treatment_date?: string;
    /**
     * Type of treatment administered (e.g., 'medication', 'vaccination').
     *
     * * `medication` - Medication
     * * `vaccination` - Vaccination
     * * `physical` - Physical Treatment
     * * `other` - Other
     */
    treatment_type?: TreatmentTypeEnum;
    /**
     * Specific vaccination type if treatment_type is 'vaccination'.
     */
    vaccination_type?: number | null;
    /**
     * Detailed description of the treatment administered.
     */
    description?: string;
    /**
     * Dosage amount of the treatment (with units specified in description).
     */
    dosage?: string;
    /**
     * Duration of the treatment in days.
     */
    duration_days?: number | null;
    /**
     * Number of days fish must be withheld from harvest after treatment.
     */
    withholding_period_days?: number | null;
    /**
     * Calculated end date of the withholding period based on treatment date and withholding period days.
     */
    readonly withholding_end_date?: string;
    /**
     * Outcome or result of the treatment.
     */
    outcome?: string | null;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FishParameterScore } from './FishParameterScore';
/**
 * Serializer for IndividualFishObservation model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 * Includes HealthDecimalFieldsMixin for decimal field validation and
 * NestedHealthModelMixin for handling nested models.
 */
export type IndividualFishObservation = {
    readonly id: number;
    /**
     * The sampling event this fish observation belongs to.
     */
    sampling_event?: number | null;
    /**
     * Unique identifier for the individual fish within this sampling event.
     */
    fish_identifier: string;
    /**
     * Weight of the fish in grams.
     */
    weight_g?: string | null;
    /**
     * Length of the fish in centimeters.
     */
    length_cm?: string | null;
    /**
     * List of parameter scores for this fish observation.
     */
    parameter_scores?: Array<FishParameterScore>;
    /**
     * Calculated K-factor (condition factor) based on weight and length measurements.
     */
    readonly calculated_k_factor: number | null;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for HealthSamplingEvent model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 * Includes HealthDecimalFieldsMixin for decimal field validation,
 * NestedHealthModelMixin for handling nested models, and
 * UserAssignmentMixin for automatic user assignment.
 *
 * This serializer handles complex nested data structures for fish health sampling events,
 * including individual fish observations and their parameter scores.
 */
export type PatchedHealthSamplingEvent = {
    readonly id?: number;
    /**
     * The specific batch and container assignment being sampled.
     */
    assignment?: number;
    sampling_date?: string;
    /**
     * Target or initially declared number of individual fish to be examined in this sampling event.
     */
    number_of_fish_sampled?: number;
    /**
     * Average weight in grams of sampled fish.
     */
    readonly avg_weight_g?: string | null;
    /**
     * Standard deviation of weight in grams.
     */
    readonly std_dev_weight_g?: string | null;
    /**
     * Minimum weight in grams among sampled fish.
     */
    readonly min_weight_g?: string | null;
    /**
     * Maximum weight in grams among sampled fish.
     */
    readonly max_weight_g?: string | null;
    individual_fish_observations?: Array<Record<string, any>>;
    /**
     * Average length in centimeters of sampled fish.
     */
    readonly avg_length_cm?: string | null;
    /**
     * Standard deviation of length in centimeters.
     */
    readonly std_dev_length_cm?: string | null;
    /**
     * Minimum length in centimeters among sampled fish.
     */
    readonly min_length_cm?: string | null;
    /**
     * Maximum length in centimeters among sampled fish.
     */
    readonly max_length_cm?: string | null;
    /**
     * Average condition factor (K) of sampled fish.
     */
    readonly avg_k_factor?: string | null;
    /**
     * Actual number of fish with measurements in this sample.
     */
    readonly calculated_sample_size?: number | null;
    notes?: string | null;
    /**
     * User who conducted the sampling.
     */
    sampled_by?: number | null;
    /**
     * Get the batch number from the assignment.
     *
     * Args:
     * obj: The HealthSamplingEvent instance.
     *
     * Returns:
     * str or None: The batch number, or None if not available.
     */
    readonly batch_number?: string | null;
    /**
     * Get the container name from the assignment.
     *
     * Args:
     * obj: The HealthSamplingEvent instance.
     *
     * Returns:
     * str or None: The container name, or None if not available.
     */
    readonly container_name?: string | null;
    /**
     * Get the username of the user who performed the sampling.
     *
     * Args:
     * obj: The HealthSamplingEvent instance.
     *
     * Returns:
     * str or None: The username, or None if not available.
     */
    readonly sampled_by_username?: string | null;
};


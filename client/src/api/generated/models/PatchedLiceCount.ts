/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the LiceCount model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 * Records sea lice counts for monitoring parasite loads in fish populations.
 */
export type PatchedLiceCount = {
    readonly id?: number;
    /**
     * The batch for which lice were counted.
     */
    batch?: number;
    /**
     * The container where fish were sampled (optional).
     */
    container?: number | null;
    /**
     * User who performed the lice count (auto-set from request).
     */
    readonly user?: number;
    /**
     * Date and time when the lice count was performed (auto-set).
     */
    readonly count_date?: string;
    /**
     * Number of adult female lice counted across all sampled fish.
     */
    adult_female_count?: number;
    /**
     * Number of adult male lice counted across all sampled fish.
     */
    adult_male_count?: number;
    /**
     * Number of juvenile lice counted across all sampled fish.
     */
    juvenile_count?: number;
    /**
     * Number of fish examined during this lice count.
     */
    fish_sampled?: number;
    /**
     * Additional notes about the lice count or observations.
     */
    notes?: string | null;
    /**
     * Calculated average number of lice per fish (total count / fish sampled).
     */
    readonly average_per_fish?: number;
};


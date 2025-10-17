/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LiceType } from './LiceType';
/**
 * Serializer for LiceCount model.
 *
 * Records sea lice counts for monitoring parasite loads.
 *
 * Supports legacy format (adult_female_count, adult_male_count,
 * juvenile_count) and new normalized format (lice_type + count_value).
 */
export type LiceCount = {
    readonly id: number;
    /**
     * The batch for which lice were counted.
     */
    batch: number;
    /**
     * The container where fish were sampled (optional).
     */
    container?: number | null;
    /**
     * User who performed the lice count (auto-set from request).
     */
    readonly user: number;
    /**
     * Date and time when the lice count was performed (auto-set).
     */
    readonly count_date: string;
    /**
     * [LEGACY] Adult female lice count. Use lice_type + count_value for new records.
     */
    adult_female_count?: number;
    /**
     * [LEGACY] Adult male lice count. Use lice_type + count_value for new records.
     */
    adult_male_count?: number;
    /**
     * [LEGACY] Juvenile lice count. Use lice_type + count_value for new records.
     */
    juvenile_count?: number;
    /**
     * Normalized lice type (species + gender + development stage).
     */
    lice_type?: number | null;
    /**
     * Detailed lice type classification information.
     */
    readonly lice_type_details: LiceType;
    /**
     * Count for the specific lice type.
     */
    count_value?: number | null;
    /**
     * Method used to detect and count lice.
     *
     * * `automated` - Automated Detection
     * * `manual` - Manual Visual Count
     * * `visual` - Visual Estimation
     * * `camera` - Camera-based Detection
     */
    detection_method?: 'automated' | 'manual' | 'visual' | 'camera' | null;
    /**
     * Confidence level (0.00-1.00, where 1.00 is highest confidence).
     */
    confidence_level?: string | null;
    /**
     * Number of fish examined during this lice count.
     */
    fish_sampled: number;
    /**
     * Additional notes about the lice count or observations.
     */
    notes?: string | null;
    /**
     * Calculated average number of lice per fish (total count / fish sampled).
     */
    readonly average_per_fish: number;
    /**
     * Total lice count regardless of tracking format.
     */
    readonly total_count: number;
};


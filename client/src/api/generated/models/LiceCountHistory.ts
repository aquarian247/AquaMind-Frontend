/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for LiceCount model.
 */
export type LiceCountHistory = {
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
    count_date?: string;
    /**
     * [LEGACY] Adult female lice counted. Use lice_type_counts for new data.
     */
    adult_female_count?: number;
    /**
     * [LEGACY] Adult male lice counted. Use lice_type_counts for new data.
     */
    adult_male_count?: number;
    /**
     * [LEGACY] Juvenile lice counted. Use lice_type_counts for new data.
     */
    juvenile_count?: number;
    /**
     * Count for lice type. Use with lice_type field.
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
    detection_method?: 'automated' | 'manual' | 'visual' | 'camera' | '' | null;
    /**
     * Confidence level (0.00-1.00), where 1.00 is highest confidence.
     */
    confidence_level?: string | null;
    /**
     * Number of fish sampled for the count.
     */
    fish_sampled: number;
    /**
     * Additional notes about the lice count.
     */
    notes?: string;
    /**
     * The batch being counted.
     */
    batch?: number | null;
    /**
     * The specific container, if applicable.
     */
    container?: number | null;
    /**
     * User who performed the count.
     */
    user?: number | null;
    /**
     * Normalized lice type classification (species, gender, development stage).
     */
    lice_type?: number | null;
};


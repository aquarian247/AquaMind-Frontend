/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the HealthParameter model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 */
export type HealthParameter = {
    readonly id: number;
    /**
     * Name of the health parameter (e.g., 'Gill Condition', 'Fin Condition').
     */
    name: string;
    /**
     * Description of what score 1 represents for this parameter.
     */
    description_score_1: string;
    /**
     * Description of what score 2 represents for this parameter.
     */
    description_score_2: string;
    /**
     * Description of what score 3 represents for this parameter.
     */
    description_score_3: string;
    /**
     * Description of what score 4 represents for this parameter.
     */
    description_score_4: string;
    /**
     * Description of what score 5 represents for this parameter.
     */
    description_score_5: string;
    /**
     * Whether this parameter is currently active and available for scoring.
     */
    is_active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


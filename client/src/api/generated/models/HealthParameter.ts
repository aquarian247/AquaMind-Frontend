/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ParameterScoreDefinition } from './ParameterScoreDefinition';
/**
 * Serializer for the HealthParameter model with nested score definitions.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 * Includes nested score_definitions for flexible parameter scoring.
 */
export type HealthParameter = {
    readonly id: number;
    /**
     * Name of the health parameter (e.g., Gill Condition).
     */
    name: string;
    /**
     * General description of this health parameter
     */
    description?: string | null;
    /**
     * Minimum score value (inclusive)
     */
    min_score?: number;
    /**
     * Maximum score value (inclusive)
     */
    max_score?: number;
    /**
     * Score definitions for this parameter (e.g., 0-3 scale with labels and descriptions).
     */
    readonly score_definitions: Array<ParameterScoreDefinition>;
    /**
     * Is this parameter currently in use?
     */
    is_active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for parameter score definitions.
 */
export type ParameterScoreDefinition = {
    readonly id: number;
    parameter: number;
    /**
     * The numeric score value (e.g., 0, 1, 2, 3)
     */
    score_value: number;
    /**
     * Short label for this score (e.g., 'Excellent', 'Good')
     */
    label: string;
    /**
     * Detailed description of what this score indicates
     */
    description: string;
    /**
     * Order to display this score (for sorting)
     */
    display_order?: number;
    readonly created_at: string;
    readonly updated_at: string;
};


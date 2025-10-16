/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Input serializer for nested fish parameter scores.
 */
export type FishParameterScoreInput = {
    /**
     * ID of the active health parameter being scored.
     */
    parameter: number;
    /**
     * Score value (typically 1-5) representing the health assessment for this parameter.
     */
    score: number;
};


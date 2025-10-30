/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Input serializer for nested fish parameter scores.
 *
 * Note: Score validation is performed dynamically based on the parameter's min/max range.
 */
export type FishParameterScoreInput = {
    /**
     * ID of the active health parameter being scored.
     */
    parameter: number;
    /**
     * Score value - range defined by parameter's min_score/max_score
     */
    score: number;
};


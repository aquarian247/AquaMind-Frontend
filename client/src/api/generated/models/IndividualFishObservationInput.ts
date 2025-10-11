/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FishParameterScoreInput } from './FishParameterScoreInput';
/**
 * Input serializer for nested individual fish observations.
 */
export type IndividualFishObservationInput = {
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
    parameter_scores?: Array<FishParameterScoreInput>;
};


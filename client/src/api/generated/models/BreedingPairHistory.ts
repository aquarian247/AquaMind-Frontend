/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for BreedingPair model.
 */
export type BreedingPairHistory = {
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
    /**
     * Date of pairing
     */
    pairing_date?: string;
    /**
     * Number of offspring produced
     */
    progeny_count?: number | null;
    readonly created_at: string;
    readonly updated_at: string;
    plan?: number | null;
    male_fish?: number | null;
    female_fish?: number | null;
};


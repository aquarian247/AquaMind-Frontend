/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for hierarchical MortalityReason model.
 */
export type PatchedMortalityReason = {
    readonly id?: number;
    /**
     * Name of the mortality reason.
     */
    name?: string;
    /**
     * Detailed description.
     */
    description?: string;
    /**
     * Parent reason ID for sub-reasons.
     */
    parent?: number | null;
    /**
     * Name of parent reason (read-only).
     */
    readonly parent_name?: string;
    /**
     * Child reasons (read-only, only on detail view).
     */
    readonly children?: string;
};


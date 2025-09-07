/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for biological constraint sets.
 */
export type PatchedBiologicalConstraints = {
    readonly id?: number;
    /**
     * Name for this constraint set (e.g., 'Bakkafrost Standard', 'Conservative')
     */
    name?: string;
    /**
     * Description of this constraint set
     */
    description?: string;
    /**
     * Whether this constraint set is currently active
     */
    is_active?: boolean;
    readonly stage_constraints?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
};


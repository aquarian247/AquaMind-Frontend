/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for biological constraint sets.
 */
export type BiologicalConstraints = {
    readonly id: number;
    /**
     * Name for this constraint set (e.g., 'Bakkafrost Standard', 'Conservative')
     */
    name: string;
    /**
     * Description of this constraint set
     */
    description?: string;
    /**
     * Whether this constraint set is currently active
     */
    is_active?: boolean;
    /**
     * Get stage constraints in a structured format.
     */
    readonly stage_constraints: Array<Record<string, any>>;
    readonly created_at: string;
    readonly updated_at: string;
};


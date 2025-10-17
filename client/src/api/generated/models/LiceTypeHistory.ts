/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for LiceType model.
 */
export type LiceTypeHistory = {
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
     * Scientific name of the lice species (e.g., Lepeophtheirus salmonis, Caligus elongatus).
     */
    species: string;
    /**
     * Gender classification of the lice.
     *
     * * `male` - Male
     * * `female` - Female
     * * `unknown` - Unknown
     */
    gender: 'male' | 'female' | 'unknown';
    /**
     * Development stage (e.g., copepodid, chalimus, pre-adult, adult).
     */
    development_stage: string;
    /**
     * Additional description or notes about this lice type classification.
     */
    description?: string;
    /**
     * Whether this lice type is currently tracked.
     */
    is_active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


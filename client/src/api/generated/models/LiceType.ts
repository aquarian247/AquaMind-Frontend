/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for LiceType model.
 *
 * Provides read-only access to normalized lice type classifications.
 */
export type LiceType = {
    readonly id: number;
    /**
     * Scientific name of the lice species.
     */
    readonly species: string;
    /**
     * Gender classification (male, female, unknown).
     */
    readonly gender: string;
    /**
     * Development stage (copepodid, chalimus, pre-adult, adult, juvenile).
     */
    readonly development_stage: string;
    /**
     * Description of lice type and characteristics.
     */
    readonly description: string;
    /**
     * Whether this lice type is currently tracked.
     */
    readonly is_active: boolean;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the MortalityEvent model.
 */
export type PatchedMortalityEvent = {
    readonly id?: number;
    readonly batch_number?: string;
    readonly cause_display?: string;
    readonly batch_info?: string;
    readonly container_info?: string;
    readonly reason_info?: string;
    event_date?: string;
    /**
     * Number of mortalities
     */
    count?: number;
    /**
     * Estimated biomass lost in kg
     */
    biomass_kg?: string;
    /**
     * * `DISEASE` - Disease
     * * `HANDLING` - Handling
     * * `PREDATION` - Predation
     * * `ENVIRONMENTAL` - Environmental
     * * `UNKNOWN` - Unknown
     * * `OTHER` - Other
     */
    cause?: 'DISEASE' | 'HANDLING' | 'PREDATION' | 'ENVIRONMENTAL' | 'UNKNOWN' | 'OTHER';
    description?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    batch?: number;
};


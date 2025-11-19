/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the MortalityEvent model.
 */
export type MortalityEvent = {
    readonly id: number;
    readonly batch_number: string;
    readonly cause_display: string;
    /**
     * Get basic batch information.
     */
    readonly batch_info: Record<string, any> | null;
    /**
     * Get basic assignment information.
     */
    readonly assignment_info: Record<string, any> | null;
    /**
     * Get basic container information.
     */
    readonly container_info: Record<string, any> | null;
    /**
     * Get mortality reason information.
     */
    readonly reason_info: Record<string, any> | null;
    event_date: string;
    /**
     * Number of mortalities
     */
    count: number;
    /**
     * Estimated biomass lost in kg
     */
    biomass_kg: string;
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
    readonly created_at: string;
    readonly updated_at: string;
    batch: number;
    /**
     * Container-specific assignment where mortality occurred
     */
    assignment?: number | null;
};


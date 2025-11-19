/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for MortalityEvent model.
 */
export type MortalityEventHistory = {
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
    batch?: number | null;
    /**
     * Container-specific assignment where mortality occurred
     */
    assignment?: number | null;
};


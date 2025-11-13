/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for executing a creation action (delivery).
 *
 * Records actual delivery details and updates populations.
 */
export type CreationActionExecute = {
    /**
     * Number of eggs DOA (dead on arrival)
     */
    mortality_on_arrival: number;
    /**
     * * `TRANSPORT` - Ground Transport
     * * `HELICOPTER` - Helicopter
     * * `BOAT` - Boat
     * * `INTERNAL_TRANSFER` - Internal Facility Transfer
     */
    delivery_method?: 'TRANSPORT' | 'HELICOPTER' | 'BOAT' | 'INTERNAL_TRANSFER' | null;
    /**
     * Water temperature in °C
     */
    water_temp_on_arrival?: string | null;
    /**
     * Quality score 1-5 (1=poor, 5=excellent)
     */
    egg_quality_score?: number | null;
    /**
     * Duration of delivery operation in minutes
     */
    execution_duration_minutes?: number | null;
    /**
     * Notes about delivery conditions, etc.
     */
    notes?: string;
};


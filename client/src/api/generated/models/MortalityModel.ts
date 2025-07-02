/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FrequencyEnum } from './FrequencyEnum';
import type { MortalityModelStage } from './MortalityModelStage';
/**
 * Enhanced serializer for mortality models with validation.
 */
export type MortalityModel = {
    readonly model_id: number;
    /**
     * Model name (e.g., 'Low Mortality')
     */
    name: string;
    /**
     * Rate application frequency
     *
     * * `daily` - Daily
     * * `weekly` - Weekly
     */
    frequency: FrequencyEnum;
    /**
     * Mortality rate percentage (e.g., 0.1)
     */
    rate: number;
    readonly stage_overrides: Array<MortalityModelStage>;
    readonly effective_annual_rate: string;
    readonly created_at: string;
    readonly updated_at: string;
};


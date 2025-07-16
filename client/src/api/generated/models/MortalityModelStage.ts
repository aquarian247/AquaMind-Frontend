/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for stage-specific mortality rates.
 */
export type MortalityModelStage = {
    /**
     * * `egg` - Egg
     * * `alevin` - Alevin
     * * `fry` - Fry
     * * `parr` - Parr
     * * `smolt` - Smolt
     * * `post_smolt` - Post-Smolt
     * * `harvest` - Harvest
     */
    lifecycle_stage: 'egg' | 'alevin' | 'fry' | 'parr' | 'smolt' | 'post_smolt' | 'harvest';
    readonly stage_display: string;
    /**
     * Daily mortality rate as percentage for this stage
     */
    daily_rate_percent: string;
    /**
     * Weekly mortality rate as percentage (calculated if not provided)
     */
    weekly_rate_percent?: string | null;
};


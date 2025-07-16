/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for stage-specific TGC overrides.
 */
export type TGCModelStage = {
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
     * TGC value for this specific stage
     */
    tgc_value: string;
    /**
     * Temperature exponent (n) for this stage
     */
    temperature_exponent?: string;
    /**
     * Weight exponent (m) for this stage
     */
    weight_exponent?: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LifecycleStageEnum } from './LifecycleStageEnum';
/**
 * Serializer for stage-specific TGC overrides.
 */
export type TGCModelStage = {
    lifecycle_stage: LifecycleStageEnum;
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


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LifecycleStageEnum } from './LifecycleStageEnum';
/**
 * Serializer for stage-specific mortality rates.
 */
export type MortalityModelStage = {
    lifecycle_stage: LifecycleStageEnum;
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


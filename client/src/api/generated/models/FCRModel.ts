/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FCRModelStage } from './FCRModelStage';
/**
 * Enhanced serializer for FCR models with validation.
 */
export type FCRModel = {
    readonly model_id: number;
    /**
     * Model name (e.g., 'Standard FCR')
     */
    name: string;
    readonly stages: Array<FCRModelStage>;
    readonly total_duration: string;
    readonly stage_coverage: string;
    readonly created_at: string;
    readonly updated_at: string;
};


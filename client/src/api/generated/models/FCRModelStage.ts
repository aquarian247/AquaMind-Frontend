/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Enhanced serializer for FCR model stages.
 */
export type FCRModelStage = {
    stage: number;
    readonly stage_name: string;
    /**
     * FCR for the stage (e.g., 1.2)
     */
    fcr_value: number;
    /**
     * Stage duration in days (e.g., 90)
     */
    duration_days: number;
    /**
     * Get weight-based FCR overrides.
     */
    readonly overrides: Array<Record<string, any>>;
};


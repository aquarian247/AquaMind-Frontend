/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Enhanced serializer for scenario model changes.
 */
export type ScenarioModelChange = {
    readonly change_id: number;
    /**
     * Day of change (e.g., 180)
     */
    change_day: number;
    new_tgc_model?: number | null;
    new_fcr_model?: number | null;
    new_mortality_model?: number | null;
    readonly change_description: string;
};


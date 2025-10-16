/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Compact representation of a finance site.
 */
export type SiteSummary = {
    readonly id: number;
    readonly name: string;
    /**
     * * `station` - Freshwater Station
     * * `area` - Area
     */
    readonly source_model: 'station' | 'area';
    readonly source_pk: number;
    readonly company_id: number;
};


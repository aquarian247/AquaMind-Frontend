/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Compact representation of a finance company.
 */
export type CompanySummary = {
    readonly id: number;
    readonly display_name: string;
    /**
     * * `BS` - Broodstock
     * * `FW` - Freshwater
     * * `FM` - Farming
     * * `LG` - Logistics
     * * `ALL` - All Subsidiaries
     */
    readonly subsidiary: 'BS' | 'FW' | 'FM' | 'LG' | 'ALL';
    readonly geography: string | null;
    readonly currency: string | null;
};


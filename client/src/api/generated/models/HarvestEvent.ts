/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Read-only serializer for harvest events.
 */
export type HarvestEvent = {
    readonly id: number;
    readonly event_date: string;
    readonly batch: number;
    /**
     * Batch number associated with this harvest event.
     */
    readonly batch_number: string;
    readonly assignment: number;
    /**
     * Name of the container linked to the batch assignment at harvest time.
     */
    readonly assignment_container: string;
    readonly dest_geography: number | null;
    /**
     * Display name of the destination geography.
     */
    readonly dest_geography_name: string;
    /**
     * * `BS` - Broodstock
     * * `FW` - Freshwater
     * * `FM` - Farming
     * * `LG` - Logistics
     * * `ALL` - All Subsidiaries
     */
    readonly dest_subsidiary: 'BS' | 'FW' | 'FM' | 'LG' | 'ALL' | null;
    /**
     * Human readable destination subsidiary label.
     */
    readonly dest_subsidiary_display: string;
    readonly document_ref: string;
    readonly created_at: string;
    readonly updated_at: string;
};


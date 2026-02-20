/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for capturing point-in-time transport snapshots.
 */
export type TransferActionSnapshot = {
    /**
     * Snapshot moment to capture for this transfer handoff.
     *
     * * `start` - Start
     * * `in_transit` - In Transit
     * * `finish` - Finish
     */
    moment: 'start' | 'in_transit' | 'finish';
};


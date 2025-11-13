/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Minimal serializer for nested Batch representation.
 */
export type AssignmentNestedBatch = {
    readonly id: number;
    batch_number: string;
    /**
     * * `PLANNED` - Planned - Awaiting Delivery
     * * `RECEIVING` - Receiving - Partial Delivery
     * * `ACTIVE` - Active
     * * `COMPLETED` - Completed
     * * `TERMINATED` - Terminated
     * * `CANCELLED` - Cancelled - Never Delivered
     */
    status?: 'PLANNED' | 'RECEIVING' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED' | 'CANCELLED';
};


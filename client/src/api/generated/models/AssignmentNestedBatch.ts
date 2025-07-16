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
     * * `ACTIVE` - Active
     * * `COMPLETED` - Completed
     * * `TERMINATED` - Terminated
     */
    status?: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
};


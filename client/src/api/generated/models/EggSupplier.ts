/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for egg suppliers.
 */
export type EggSupplier = {
    readonly id: number;
    /**
     * Supplier name
     */
    name: string;
    /**
     * Contact information (phone, email, address)
     */
    contact_details: string;
    /**
     * Certifications and quality standards
     */
    certifications?: string;
    readonly batch_count: number;
    readonly created_at: string;
    readonly updated_at: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the VaccinationType model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 * Handles information about different types of vaccines used in aquaculture.
 */
export type VaccinationType = {
    readonly id: number;
    /**
     * Name of the vaccination type (e.g., 'PD Vaccine', 'IPN Vaccine').
     */
    name: string;
    /**
     * Manufacturer or supplier of the vaccine.
     */
    manufacturer: string;
    /**
     * Standard dosage information for this vaccine.
     */
    dosage?: string | null;
    /**
     * Detailed description of the vaccine, including diseases targeted and efficacy information.
     */
    description: string;
};


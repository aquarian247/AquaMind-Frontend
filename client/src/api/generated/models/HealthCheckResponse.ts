/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for health check API response.
 */
export type HealthCheckResponse = {
    /**
     * Current service status
     */
    status: string;
    /**
     * Timestamp of the health check
     */
    timestamp: string;
    /**
     * Service name
     */
    service: string;
    /**
     * Service version
     */
    version: string;
    /**
     * Database status
     */
    database: string;
    /**
     * Environment type
     */
    environment: string;
};


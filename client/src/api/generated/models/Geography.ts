/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the Geography model.
 */
export type Geography = {
    readonly id: number;
    /**
     * Unique name for the geographical region (e.g., 'Faroe Islands', 'Scotland West').
     */
    name: string;
    /**
     * Optional description of the geographical region, its boundaries, or specific characteristics.
     */
    description?: string;
    readonly created_at: string;
    readonly updated_at: string;
};


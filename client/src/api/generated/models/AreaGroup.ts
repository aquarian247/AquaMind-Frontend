/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Geography } from './Geography';
/**
 * Serializer for the AreaGroup model.
 */
export type AreaGroup = {
    readonly id: number;
    /**
     * Unique name within the geography + parent group scope.
     */
    name: string;
    /**
     * Optional short code for operations and reporting.
     */
    code?: string;
    /**
     * ID of the geography this area-group belongs to.
     */
    geography: number;
    /**
     * Detailed geography information.
     */
    readonly geography_details: Geography;
    /**
     * Optional parent area-group for hierarchical grouping.
     */
    parent?: number | null;
    /**
     * Name of the linked parent area-group.
     */
    readonly parent_name: string | null;
    /**
     * Indicates if the area-group is active.
     */
    active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


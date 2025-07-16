/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the Feed model.
 *
 * Provides CRUD operations for feed types used in aquaculture operations.
 */
export type Feed = {
    readonly id: number;
    name: string;
    brand: string;
    /**
     * * `MICRO` - Micro
     * * `SMALL` - Small
     * * `MEDIUM` - Medium
     * * `LARGE` - Large
     */
    size_category: 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';
    /**
     * Pellet size in millimeters
     */
    pellet_size_mm?: string | null;
    /**
     * Protein content percentage
     */
    protein_percentage?: string | null;
    /**
     * Fat content percentage
     */
    fat_percentage?: string | null;
    /**
     * Carbohydrate content percentage
     */
    carbohydrate_percentage?: string | null;
    description?: string;
    is_active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};


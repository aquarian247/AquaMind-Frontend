/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the ContainerType model.
 */
export type ContainerType = {
    readonly id: number;
    /**
     * Unique name for the container type (e.g., 'Circular Tank 10m', 'Square Pen 20x20').
     */
    name: string;
    /**
     * Category of the container type (e.g., TANK, PEN, TRAY).
     *
     * * `TANK` - Tank
     * * `PEN` - Pen
     * * `TRAY` - Tray
     * * `OTHER` - Other
     */
    category: 'TANK' | 'PEN' | 'TRAY' | 'OTHER';
    /**
     * Human-readable display name for the category.
     */
    readonly category_display: string;
    /**
     * Maximum design volume of this container type in cubic meters (e.g., 100.50).
     */
    max_volume_m3: string;
    /**
     * Optional description of the container type, its characteristics, or usage notes.
     */
    description?: string;
    readonly created_at: string;
    readonly updated_at: string;
};


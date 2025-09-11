/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for ContainerType model.
 */
export type ContainerTypeHistory = {
    readonly history_id: number;
    /**
     * User who made the change
     */
    readonly history_user: string;
    /**
     * When the change was made
     */
    readonly history_date: string;
    /**
     * Type of change: + (Created), ~ (Updated), - (Deleted)
     */
    readonly history_type: string;
    /**
     * Reason for the change
     */
    readonly history_change_reason: string;
    id?: number;
    name: string;
    /**
     * * `TANK` - Tank
     * * `PEN` - Pen
     * * `TRAY` - Tray
     * * `OTHER` - Other
     */
    category: 'TANK' | 'PEN' | 'TRAY' | 'OTHER';
    max_volume_m3: string;
    description?: string;
    readonly created_at: string;
    readonly updated_at: string;
};


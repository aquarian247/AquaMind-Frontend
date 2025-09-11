/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for UserProfile model.
 */
export type UserProfileHistory = {
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
    full_name?: string;
    phone?: string | null;
    profile_picture?: string | null;
    job_title?: string | null;
    department?: string | null;
    /**
     * Geographic region access level
     *
     * * `FO` - Faroe Islands
     * * `SC` - Scotland
     * * `ALL` - All Geographies
     */
    geography?: 'FO' | 'SC' | 'ALL';
    /**
     * Subsidiary access level
     *
     * * `BS` - Broodstock
     * * `FW` - Freshwater
     * * `FM` - Farming
     * * `LG` - Logistics
     * * `ALL` - All Subsidiaries
     */
    subsidiary?: 'BS' | 'FW' | 'FM' | 'LG' | 'ALL';
    /**
     * User role and permission level
     *
     * * `ADMIN` - Administrator
     * * `MGR` - Manager
     * * `OPR` - Operator
     * * `VET` - Veterinarian
     * * `QA` - Quality Assurance
     * * `FIN` - Finance
     * * `VIEW` - Viewer
     */
    role?: 'ADMIN' | 'MGR' | 'OPR' | 'VET' | 'QA' | 'FIN' | 'VIEW';
    /**
     * * `en` - English
     * * `fo` - Faroese
     * * `da` - Danish
     */
    language_preference?: 'en' | 'fo' | 'da';
    /**
     * * `DMY` - DD/MM/YYYY
     * * `MDY` - MM/DD/YYYY
     * * `YMD` - YYYY-MM-DD
     */
    date_format_preference?: 'DMY' | 'MDY' | 'YMD';
    readonly created_at: string;
    readonly updated_at: string;
    user?: number | null;
};


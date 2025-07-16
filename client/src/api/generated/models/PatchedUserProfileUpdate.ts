/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for updating UserProfile information.
 *
 * Provides a dedicated serializer for profile updates separate from user data.
 * Includes all fields from the UserProfile model that should be updatable by users.
 */
export type PatchedUserProfileUpdate = {
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
};


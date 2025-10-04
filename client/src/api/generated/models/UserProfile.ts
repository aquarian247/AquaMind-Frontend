/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Read-only serializer for the UserProfile model.
 *
 * Handles serialization of UserProfile instances for GET requests,
 * including all profile information and RBAC fields. All fields are
 * read-only to ensure profile updates use the appropriate update serializers.
 */
export type UserProfile = {
    readonly full_name: string;
    readonly phone: string | null;
    readonly profile_picture: string | null;
    readonly job_title: string | null;
    readonly department: string | null;
    /**
     * Geographic region access level
     *
     * * `FO` - Faroe Islands
     * * `SC` - Scotland
     * * `ALL` - All Geographies
     */
    readonly geography: 'FO' | 'SC' | 'ALL';
    /**
     * Subsidiary access level
     *
     * * `BS` - Broodstock
     * * `FW` - Freshwater
     * * `FM` - Farming
     * * `LG` - Logistics
     * * `ALL` - All Subsidiaries
     */
    readonly subsidiary: 'BS' | 'FW' | 'FM' | 'LG' | 'ALL';
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
    readonly role: 'ADMIN' | 'MGR' | 'OPR' | 'VET' | 'QA' | 'FIN' | 'VIEW';
    /**
     * * `en` - English
     * * `fo` - Faroese
     * * `da` - Danish
     */
    readonly language_preference: 'en' | 'fo' | 'da';
    /**
     * * `DMY` - DD/MM/YYYY
     * * `MDY` - MM/DD/YYYY
     * * `YMD` - YYYY-MM-DD
     */
    readonly date_format_preference: 'DMY' | 'MDY' | 'YMD';
    readonly created_at: string;
    readonly updated_at: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for updating UserProfile information.
 *
 * Provides a dedicated serializer for profile updates separate from user data.
 * Allows users to update their own profile information excluding RBAC fields
 * (role, geography, subsidiary) which require admin privileges.
 */
export type PatchedUserProfileUpdate = {
    full_name?: string;
    phone?: string | null;
    profile_picture?: string | null;
    job_title?: string | null;
    department?: string | null;
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


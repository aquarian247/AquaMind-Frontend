/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the UserProfile model.
 *
 * Handles serialization and deserialization of UserProfile instances,
 * including user preferences and profile information.
 */
export type UserProfile = {
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
    readonly created_at: string;
    readonly updated_at: string;
};


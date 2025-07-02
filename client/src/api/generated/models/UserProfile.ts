/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DateFormatPreferenceEnum } from './DateFormatPreferenceEnum';
import type { LanguagePreferenceEnum } from './LanguagePreferenceEnum';
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
    language_preference?: LanguagePreferenceEnum;
    date_format_preference?: DateFormatPreferenceEnum;
    readonly created_at: string;
    readonly updated_at: string;
};


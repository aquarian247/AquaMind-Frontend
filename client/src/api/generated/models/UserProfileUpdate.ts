/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DateFormatPreferenceEnum } from './DateFormatPreferenceEnum';
import type { GeographyEnum } from './GeographyEnum';
import type { LanguagePreferenceEnum } from './LanguagePreferenceEnum';
import type { RoleEnum } from './RoleEnum';
import type { SubsidiaryEnum } from './SubsidiaryEnum';
/**
 * Serializer for updating UserProfile information.
 *
 * Provides a dedicated serializer for profile updates separate from user data.
 * Includes all fields from the UserProfile model that should be updatable by users.
 */
export type UserProfileUpdate = {
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
    geography?: GeographyEnum;
    /**
     * Subsidiary access level
     *
     * * `BS` - Broodstock
     * * `FW` - Freshwater
     * * `FM` - Farming
     * * `LG` - Logistics
     * * `ALL` - All Subsidiaries
     */
    subsidiary?: SubsidiaryEnum;
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
    role?: RoleEnum;
    language_preference?: LanguagePreferenceEnum;
    date_format_preference?: DateFormatPreferenceEnum;
};


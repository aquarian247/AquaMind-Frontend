/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GeographyEnum } from './GeographyEnum';
import type { RoleEnum } from './RoleEnum';
import type { SubsidiaryEnum } from './SubsidiaryEnum';
import type { UserProfile } from './UserProfile';
/**
 * Serializer for the User model.
 *
 * Handles user registration, updates, and provides profile data
 * nested within the user data.
 */
export type PatchedUser = {
    readonly id?: number;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     */
    username?: string;
    email?: string;
    full_name?: string;
    phone?: string;
    geography?: GeographyEnum;
    subsidiary?: SubsidiaryEnum;
    role?: RoleEnum;
    password?: string;
    /**
     * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
     */
    is_active?: boolean;
    readonly profile?: UserProfile;
    readonly date_joined?: string;
};


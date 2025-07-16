/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserProfile } from './UserProfile';
/**
 * Serializer for user registration that requires password.
 *
 * Extends UserSerializer but makes password field required.
 */
export type UserCreate = {
    readonly id: number;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     */
    username: string;
    email: string;
    full_name?: string;
    phone?: string;
    /**
     * * `FO` - Faroe Islands
     * * `SC` - Scotland
     * * `ALL` - All Geographies
     */
    geography?: 'FO' | 'SC' | 'ALL';
    /**
     * * `BS` - Broodstock
     * * `FW` - Freshwater
     * * `FM` - Farming
     * * `LG` - Logistics
     * * `ALL` - All Subsidiaries
     */
    subsidiary?: 'BS' | 'FW' | 'FM' | 'LG' | 'ALL';
    /**
     * * `ADMIN` - Administrator
     * * `MGR` - Manager
     * * `OPR` - Operator
     * * `VET` - Veterinarian
     * * `QA` - Quality Assurance
     * * `FIN` - Finance
     * * `VIEW` - Viewer
     */
    role?: 'ADMIN' | 'MGR' | 'OPR' | 'VET' | 'QA' | 'FIN' | 'VIEW';
    password: string;
    /**
     * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
     */
    is_active?: boolean;
    readonly profile: UserProfile;
    readonly date_joined: string;
};


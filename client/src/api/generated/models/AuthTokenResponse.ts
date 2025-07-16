/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for token response data.
 * Defines the structure of the response from authentication endpoints.
 */
export type AuthTokenResponse = {
    /**
     * Authentication token for API access
     */
    token: string;
    /**
     * User ID associated with the token
     */
    user_id: number;
    /**
     * Username of the authenticated user
     */
    username: string;
    /**
     * Email of the authenticated user
     */
    email: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Custom token serializer that adds user data to token response.
 *
 * Extends the JWT TokenObtainPairSerializer to include additional user
 * information in the token response.
 */
export type CustomTokenObtainPair = {
    username: string;
    password: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthToken } from '../models/AuthToken';
import type { AuthTokenResponse } from '../models/AuthTokenResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Custom view for obtaining auth tokens that also returns user info
     * @param requestBody
     * @returns AuthTokenResponse
     * @throws ApiError
     */
    public static apiAuthTokenCreate(
        requestBody: AuthToken,
    ): CancelablePromise<AuthTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/token/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Development-only endpoint that returns an auth token without credentials. **Disabled in production.**
     * @returns AuthTokenResponse
     * @throws ApiError
     */
    public static apiV1AuthDevAuthRetrieve(): CancelablePromise<AuthTokenResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/dev-auth/',
        });
    }
    /**
     * Custom view for obtaining auth tokens that also returns user info
     * @param requestBody
     * @returns AuthTokenResponse
     * @throws ApiError
     */
    public static apiV1AuthTokenCreate(
        requestBody: AuthToken,
    ): CancelablePromise<AuthTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/token/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

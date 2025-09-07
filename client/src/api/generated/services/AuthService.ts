/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthToken } from '../models/AuthToken';
import type { AuthTokenResponse } from '../models/AuthTokenResponse';
import type { TokenRefreshRequest } from '../models/TokenRefreshRequest';
import type { TokenRefreshResponse } from '../models/TokenRefreshResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
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
    /**
     * Takes a refresh type JSON web token and returns an access type JSON web
     * token if the refresh token is valid.
     * @param requestBody
     * @returns TokenRefreshResponse
     * @throws ApiError
     */
    public static apiV1AuthTokenRefreshCreate(
        requestBody: TokenRefreshRequest,
    ): CancelablePromise<TokenRefreshResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/token/refresh/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

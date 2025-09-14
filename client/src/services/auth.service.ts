/**
 * Centralized Authentication Service
 *
 * Provides standardized authentication handling for all API calls,
 * including token management, error handling, and retry logic.
 */

import { authConfig } from '../config/auth.config';
import { apiConfig } from '../config/api.config';

export interface AuthTokens {
  access: string;
  refresh?: string; // Optional for single-token systems
  token?: string; // For Django TokenAuthentication
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

export class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<AuthTokens | null> | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Get stored access token
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(authConfig.tokenKey);
  }

  /**
   * Get stored refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(authConfig.refreshTokenKey);
  }

  /**
   * Store authentication tokens
   */
  static storeTokens(tokens: AuthTokens): void {
    // Handle both JWT (access/refresh) and single token formats
    if (tokens.access) {
      localStorage.setItem(authConfig.tokenKey, tokens.access);
    } else if (tokens.token) {
      // For single token systems (like Django TokenAuthentication)
      localStorage.setItem(authConfig.tokenKey, tokens.token);
    }

    // Store refresh token if available
    if (tokens.refresh) {
      localStorage.setItem(authConfig.refreshTokenKey, tokens.refresh);
    }
  }

  /**
   * Clear all stored tokens
   */
  static clearTokens(): void {
    localStorage.removeItem(authConfig.tokenKey);
    localStorage.removeItem(authConfig.refreshTokenKey);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      // Decode JWT to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime + authConfig.tokenRefreshThreshold / 1000;
    } catch {
      return false;
    }
  }

  /**
   * Make authenticated fetch request
   */
  static async authenticatedFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getAccessToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 responses
    if (response.status === 401) {
      console.warn('Received 401 response, clearing tokens and redirecting to login');
      this.clearTokens();

      // Dispatch custom event for auth context to handle
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));

      throw new ApiError('Authentication failed', 401);
    }

    return response;
  }

  /**
   * Make authenticated API call with retry logic
   */
  static async authenticatedApiCall<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= authConfig.retries; attempt++) {
      try {
        const response = await this.authenticatedFetch(url, {
          ...options,
          signal: options.signal || AbortSignal.timeout(authConfig.timeout),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new ApiError(
            `API call failed: ${response.status}`,
            response.status,
            errorData
          );
        }

        const data = await response.json();

        return {
          data,
          status: response.status,
          headers: response.headers,
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on auth errors or client errors
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === authConfig.retries) {
          break;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw lastError || new Error('API call failed after retries');
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(): Promise<AuthTokens | null> {
    // Prevent multiple concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doRefreshTokens();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async doRefreshTokens(): Promise<AuthTokens | null> {
    const refreshToken = AuthService.getRefreshToken();

    if (!refreshToken) {
      console.warn('No refresh token available');
      return null;
    }

    try {
      const { ApiService } = await import('@/api/generated');

      const response = await ApiService.apiTokenRefreshCreate({
        refresh: refreshToken,
      } as any);

      if (!response.access) {
        throw new ApiError('Invalid refresh response format', 500);
      }

      const tokens: AuthTokens = {
        access: response.access,
        refresh: refreshToken, // Keep existing refresh token
      };

      AuthService.storeTokens(tokens);

      return tokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      AuthService.clearTokens();
      return null;
    }
  }

  /**
   * Login with username and password
   */
  static async login(username: string, password: string): Promise<AuthTokens> {
    const { ApiService } = await import('@/api/generated');

    try {
      const response = await ApiService.apiTokenCreate({
        username,
        password,
      } as any);

      // Handle JWT format (access + refresh tokens)
      if (!response.access || !response.refresh) {
        throw new ApiError('Invalid JWT token response format', 500);
      }

      const tokens: AuthTokens = {
        access: response.access,
        refresh: response.refresh,
      };

      this.storeTokens(tokens);

      return tokens;
    } catch (error) {
      // Re-throw ApiError from ApiService as our custom ApiError for consistency
      if (error instanceof Error) {
        throw new ApiError(error.message || 'Login failed', 401);
      }
      throw new ApiError('Login failed', 401);
    }
  }

  /**
   * Logout and clear tokens
   */
  static logout(): void {
    this.clearTokens();
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  /**
   * Get user profile
   */
  static async getUserProfile(): Promise<any> {
    const response = await this.authenticatedApiCall(
      authConfig.baseUrl + authConfig.endpoints.profile
    );
    return response.data;
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Helper function to make authenticated API calls
 * This provides a simple interface for components
 */
export const authenticatedFetch = AuthService.authenticatedFetch.bind(AuthService);
export const authenticatedApiCall = AuthService.authenticatedApiCall.bind(AuthService);

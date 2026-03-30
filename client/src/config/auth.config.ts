/**
 * Authentication Configuration
 *
 * Centralized configuration for authentication settings,
 * token management, and API endpoints.
 */

const runtimeOrigin =
  typeof window !== 'undefined' ? window.location.origin : '';
const configuredBaseUrl = import.meta.env.VITE_DJANGO_API_URL?.trim() || '';
const baseUrl = configuredBaseUrl || runtimeOrigin || 'http://localhost:8000';

export const authConfig = {
  // API Configuration
  baseUrl,
  apiVersion: 'v1',

  // Token Configuration
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry

  // Request Configuration
  timeout: 30000,
  retries: 3,

  // Auth Endpoints - JWT Authentication
  endpoints: {
    login: '/api/token/',
    refresh: '/api/token/refresh/',
    profile: '/api/v1/users/auth/profile/',
  },

  // Auth Sources (for future AD/LDAP integration)
  authSources: {
    LOCAL: 'local',
    LDAP: 'ldap',
    AD: 'ad',
  } as const,

  // Environment flags
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
} as const;

export type AuthSource = typeof authConfig.authSources[keyof typeof authConfig.authSources];

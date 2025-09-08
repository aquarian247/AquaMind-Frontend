/**
 * Authentication Configuration
 *
 * Centralized configuration for authentication settings,
 * token management, and API endpoints.
 */

export const authConfig = {
  // API Configuration
  baseUrl: import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000',
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
    login: '/api/v1/auth/token/',
    refresh: '/api/v1/auth/token/refresh/',
    profile: '/api/v1/users/auth/profile/',
    // Development endpoint for automatic token setup (only in dev)
    devToken: '/api/v1/auth/dev-auth/',
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

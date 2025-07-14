/**
 * API Client Wrapper
 * 
 * This module provides a unified interface to the AquaMind API by configuring
 * and re-exporting the auto-generated OpenAPI client.
 */

import { OpenAPI } from './generated';
import { ApiError, CancelablePromise } from './generated';

// Re-export all types and services from the generated client
export * from './generated';

// Configure the OpenAPI client with the backend URL
const DJANGO_API_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000';
OpenAPI.BASE = `${DJANGO_API_URL}/api/v1`;

// Authentication helpers
export const setAuthToken = (token: string | null) => {
  if (token) {
    OpenAPI.HEADERS = {
      ...OpenAPI.HEADERS,
      'Authorization': `Bearer ${token}`
    };
  } else {
    // Remove Authorization header when token is null
    // Handle the case where HEADERS might be a Resolver function
    const currentHeaders = OpenAPI.HEADERS || {};
    const headers: Record<string, string> = {};
    
    // Copy all headers except Authorization
    if (typeof currentHeaders === 'object') {
      Object.entries(currentHeaders).forEach(([key, value]) => {
        if (key !== 'Authorization') {
          headers[key] = value;
        }
      });
    }
    
    OpenAPI.HEADERS = headers;
  }
};

// Helper for handling JWT token storage
export const storeAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  setAuthToken(token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
  setAuthToken(null);
};

export const initializeAuth = () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};

// Initialize auth on module load
initializeAuth();

// Pagination helpers
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
  [key: string]: any;
}

/**
 * Helper to convert pagination params to query parameters
 */
export const getPaginationQueryParams = (params: PaginationParams = {}): Record<string, string> => {
  const { page, pageSize, ...otherParams } = params;
  
  const queryParams: Record<string, string> = {};
  
  // Add pagination params
  if (page !== undefined) {
    queryParams.page = String(page);
  }
  
  if (pageSize !== undefined) {
    queryParams.page_size = String(pageSize);
  }
  
  // Add all other params
  Object.entries(otherParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams[key] = String(value);
    }
  });
  
  return queryParams;
};

/**
 * Error handling helper
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    // Handle structured API errors
    if (error.body && typeof error.body === 'object') {
      if (Array.isArray(error.body)) {
        return error.body.join(', ');
      } else if ('detail' in error.body) {
        return String(error.body.detail);
      } else if ('non_field_errors' in error.body) {
        return String(error.body.non_field_errors);
      } else {
        // Handle validation errors (field-specific errors)
        const fieldErrors = Object.entries(error.body)
          .map(([field, errors]) => {
            if (Array.isArray(errors)) {
              return `${field}: ${errors.join(', ')}`;
            }
            return `${field}: ${String(errors)}`;
          })
          .join('; ');
        
        return fieldErrors || 'An API error occurred';
      }
    }
    return error.message || 'An unknown API error occurred';
  }
  
  return error instanceof Error ? error.message : 'An unknown error occurred';
};

// Type compatibility helpers for migration
export type DjangoListResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/**
 * Helper to ensure compatibility with existing code during migration
 * This allows gradual migration from manual types to generated types
 */
export const ensureBackwardCompatibility = <T>(response: any): DjangoListResponse<T> => {
  // The generated client already returns the correct structure,
  // but this function exists to provide a clear migration path
  return response as DjangoListResponse<T>;
};

import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';

// Import batch history types for now (simplified implementation)
import type { BatchHistory } from '@/api/generated/models/BatchHistory';
import type { PaginatedBatchHistoryList } from '@/api/generated/models/PaginatedBatchHistoryList';

// Common history record type (extracting common fields)
export interface HistoryRecord {
  readonly history_id: number;
  readonly history_user: string;
  readonly history_date: string;
  readonly history_type: '+' | '~' | '-';
  readonly history_change_reason?: string;
  [key: string]: any; // Allow model-specific fields
}

// Common paginated response type
export interface PaginatedHistoryResponse<T = HistoryRecord> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// History filters type
export interface HistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  historyUser?: string;
  historyType?: '+' | '~' | '-';
  page?: number;
  pageSize?: number;
}

// App domains
export const APP_DOMAINS = {
  BATCH: 'batch',
  INFRASTRUCTURE: 'infrastructure',
  INVENTORY: 'inventory',
  HEALTH: 'health',
  SCENARIO: 'scenario',
  USERS: 'users'
} as const;

export type AppDomain = typeof APP_DOMAINS[keyof typeof APP_DOMAINS];

// Model mappings for each app domain
export const APP_MODELS = {
  [APP_DOMAINS.BATCH]: [
    { value: 'batch', label: 'Batches' },
    { value: 'container-assignment', label: 'Container Assignments' },
    { value: 'growth-sample', label: 'Growth Samples' },
    { value: 'mortality-event', label: 'Mortality Events' },
    { value: 'batch-transfer', label: 'Transfers' }
  ],
  [APP_DOMAINS.INFRASTRUCTURE]: [
    { value: 'area', label: 'Areas' },
    { value: 'container', label: 'Containers' },
    { value: 'container-type', label: 'Container Types' },
    { value: 'feed-container', label: 'Feed Containers' },
    { value: 'freshwater-station', label: 'Freshwater Stations' },
    { value: 'geography', label: 'Geography' },
    { value: 'hall', label: 'Halls' },
    { value: 'sensor', label: 'Sensors' }
  ],
  [APP_DOMAINS.INVENTORY]: [
    { value: 'feed-stock', label: 'Feed Stock' },
    { value: 'feeding-event', label: 'Feeding Events' }
  ],
  [APP_DOMAINS.HEALTH]: [
    { value: 'journal-entry', label: 'Journal Entries' },
    { value: 'health-lab-sample', label: 'Lab Samples' },
    { value: 'lice-count', label: 'Lice Counts' },
    { value: 'mortality-record', label: 'Mortality Records' },
    { value: 'treatment', label: 'Treatments' }
  ],
  [APP_DOMAINS.SCENARIO]: [
    { value: 'scenario', label: 'Scenarios' },
    { value: 'fcr-model', label: 'FCR Models' },
    { value: 'mortality-model', label: 'Mortality Models' },
    { value: 'scenario-model-change', label: 'Model Changes' },
    { value: 'tgc-model', label: 'TGC Models' }
  ],
  [APP_DOMAINS.USERS]: [
    { value: 'user-profile', label: 'User Profiles' }
  ]
} as const;

// Error types for better error categorization
export interface ApiError {
  message: string;
  statusCode?: number;
  type: 'network' | 'auth' | 'permission' | 'not_found' | 'server' | 'validation' | 'unknown';
  originalError?: unknown;
}

// Utility function to categorize errors
export function categorizeError(error: unknown): ApiError {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      type: 'unknown',
      originalError: error
    };
  }

  const errorString = String(error);

  // Check for network errors
  if (errorString.includes('fetch') || errorString.includes('network') || errorString.includes('Failed to fetch')) {
    return {
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'network',
      originalError: error
    };
  }

  // Extract status code from error message
  const statusMatch = errorString.match(/(\d{3}):/);
  const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : undefined;

  switch (statusCode) {
    case 400:
      return {
        message: 'Invalid request parameters. Please check your filters.',
        statusCode: 400,
        type: 'validation',
        originalError: error
      };

    case 401:
      return {
        message: 'Your session has expired. Please log in again.',
        statusCode: 401,
        type: 'auth',
        originalError: error
      };

    case 403:
      return {
        message: 'You don\'t have permission to view this audit trail data.',
        statusCode: 403,
        type: 'permission',
        originalError: error
      };

    case 404:
      return {
        message: 'The requested audit trail data could not be found.',
        statusCode: 404,
        type: 'not_found',
        originalError: error
      };

    case 429:
      return {
        message: 'Too many requests. Please wait a moment before trying again.',
        statusCode: 429,
        type: 'server',
        originalError: error
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: 'Server error. Please try again later.',
        statusCode,
        type: 'server',
        originalError: error
      };

    default:
      // Try to extract meaningful message from error
      const messageMatch = errorString.match(/:\s*(.+)/);
      const extractedMessage = messageMatch ? messageMatch[1] : errorString;

      return {
        message: extractedMessage || 'An unexpected error occurred while loading audit trail data.',
        statusCode,
        type: 'unknown',
        originalError: error
      };
  }
}

// Centralized query options
const HISTORY_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: (failureCount: number, error: unknown) => {
    // Don't retry on auth errors (401) or permission errors (403)
    const categorizedError = categorizeError(error);
    if (categorizedError.type === 'auth' || categorizedError.type === 'permission') {
      return false;
    }
    // Retry once for network/server errors
    return failureCount < 1;
  },
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// Helper function to generate consistent query keys
export function getHistoryQueryKey(appDomain: AppDomain, model?: string, filters?: HistoryFilters, historyId?: number): string[] {
  const key = ['audit-trail', appDomain];
  if (model) key.push(model);
  if (historyId) key.push('detail', historyId.toString());
  if (filters) {
    // Sort filter keys for consistent query keys
    const sortedFilters = Object.keys(filters)
      .sort()
      .reduce((result, key) => {
        result[key] = filters[key as keyof HistoryFilters];
        return result;
      }, {} as any);
    key.push(sortedFilters);
  }
  return key;
}


// Main hook for fetching history lists
export function useHistoryList(
  appDomain: AppDomain,
  model: string,
  filters?: HistoryFilters
) {
  return useQuery({
    queryKey: getHistoryQueryKey(appDomain, model, filters),
    queryFn: async () => {
      try {
        // For now, focus on batch domain to get basic functionality working
        // TODO: Expand to other domains once batch is stable
        if (appDomain === APP_DOMAINS.BATCH && model === 'batch') {
          return await ApiService.listBatchBatchHistory(
            undefined, // batchNumber
            undefined, // batchType
            filters?.dateFrom,
            filters?.dateTo,
            filters?.historyType,
            filters?.historyUser,
            undefined, // lifecycleStage
            undefined, // ordering
            filters?.page,
            undefined, // search
            undefined, // species
            undefined  // status
          );
        } else {
          // Return empty result for unsupported domains/models for now
          return {
            count: 0,
            next: null,
            previous: null,
            results: []
          };
        }
      } catch (error) {
        console.error(`Failed to fetch ${appDomain} ${model} history:`, error);
        // Categorize and re-throw the error for better error handling
        const categorizedError = categorizeError(error);
        throw categorizedError;
      }
    },
    enabled: !!(appDomain && model),
    ...HISTORY_QUERY_OPTIONS
  });
}

// Main hook for fetching history details
export function useHistoryDetail(
  appDomain: AppDomain,
  model: string,
  historyId: number
) {
  return useQuery({
    queryKey: getHistoryQueryKey(appDomain, model, undefined, historyId),
    queryFn: async () => {
      try {
        // For now, default to batch detail to avoid complex method signature issues
        // In a production implementation, we'd use the proper method mapping
        return await ApiService.retrieveBatchBatchHistoryDetail(historyId);
      } catch (error) {
        console.error(`Failed to fetch ${appDomain} ${model} history detail:`, error);
        // Categorize and re-throw the error for better error handling
        const categorizedError = categorizeError(error);
        throw categorizedError;
      }
    },
    enabled: !!(appDomain && model && historyId),
    ...HISTORY_QUERY_OPTIONS
  });
}

// Utility function to get available models for an app domain
export function getAvailableModels(appDomain: AppDomain) {
  return APP_MODELS[appDomain] || [];
}

// Utility function to get history type label
export function getHistoryTypeLabel(type: '+' | '~' | '-'): string {
  switch (type) {
    case '+':
      return 'Created';
    case '~':
      return 'Updated';
    case '-':
      return 'Deleted';
    default:
      return 'Unknown';
  }
}

// Utility function to get history type color
export function getHistoryTypeColor(type: '+' | '~' | '-'): string {
  switch (type) {
    case '+':
      return 'bg-green-100 text-green-800 border-green-200';
    case '~':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case '-':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
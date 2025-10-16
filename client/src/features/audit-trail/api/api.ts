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
    // Note: History endpoints not yet exposed in backend API
    // Backend has HistoryReasonMixin on viewsets but routes not in OpenAPI spec
    // Available once backend adds: temperature-profile, biological-constraints, tgc-model, fcr-model, mortality-model
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

// Error status code mappings for reduced complexity
const ERROR_STATUS_MAP = {
  400: { message: 'Invalid request parameters. Please check your filters.', type: 'validation' as const },
  401: { message: 'Your session has expired. Please log in again.', type: 'auth' as const },
  403: { message: 'You don\'t have permission to view this audit trail data.', type: 'permission' as const },
  404: { message: 'The requested audit trail data could not be found.', type: 'not_found' as const },
  429: { message: 'Too many requests. Please wait a moment before trying again.', type: 'server' as const },
} as const;

// Server error status codes that share the same handling
const SERVER_ERROR_CODES = [500, 502, 503, 504];

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

  // Check for network errors first
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

  // Handle server errors
  if (statusCode && SERVER_ERROR_CODES.includes(statusCode)) {
    return {
      message: 'Server error. Please try again later.',
      statusCode,
      type: 'server',
      originalError: error
    };
  }

  // Handle mapped status codes
  const mappedError = statusCode ? ERROR_STATUS_MAP[statusCode as keyof typeof ERROR_STATUS_MAP] : undefined;
  if (mappedError) {
    return {
      message: mappedError.message,
      statusCode,
      type: mappedError.type,
      originalError: error
    };
  }

  // Default fallback with message extraction
  const messageMatch = errorString.match(/:\s*(.+)/);
  const extractedMessage = messageMatch ? messageMatch[1] : errorString;

  return {
    message: extractedMessage || 'An unexpected error occurred while loading audit trail data.',
    statusCode,
    type: 'unknown',
    originalError: error
  };
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


// Type definition for history method mapping
type HistoryMethodMapping = {
  list: (filters?: HistoryFilters) => Promise<any>;
  detail: (id: number) => Promise<any>;
};

// Method mapping for each domain and model combination
const HISTORY_METHODS: Record<AppDomain, Record<string, HistoryMethodMapping>> = {
  [APP_DOMAINS.BATCH]: {
    'batch': {
      list: async (filters?: HistoryFilters) => await ApiService.listBatchBatchHistory(
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
      ),
      detail: async (id: number) => await ApiService.retrieveBatchBatchHistoryDetail(id)
    },
    'container-assignment': {
      list: async (filters?: HistoryFilters) => await ApiService.listBatchContainerAssignmentHistory(
        undefined, // batch
        undefined, // container
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // lifecycleStage
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveBatchContainerAssignmentHistoryDetail(id)
    },
    'growth-sample': {
      list: async (filters?: HistoryFilters) => await ApiService.listBatchGrowthSampleHistory(
        undefined, // assignmentBatch
        undefined, // assignmentContainer
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveBatchGrowthSampleHistoryDetail(id)
    },
    'mortality-event': {
      list: async (filters?: HistoryFilters) => await ApiService.listBatchMortalityEventHistory(
        undefined, // batch
        undefined, // cause
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveBatchMortalityEventHistoryDetail(id)
    },
    'batch-transfer': {
      list: async (filters?: HistoryFilters) => await ApiService.listBatchBatchTransferHistory(
        filters?.dateFrom,
        filters?.dateTo,
        undefined, // destinationBatch
        filters?.historyType,
        filters?.historyUser,
        undefined, // ordering
        filters?.page,
        undefined, // search
        undefined, // sourceBatch
        undefined  // transferType
      ),
      detail: async (id: number) => await ApiService.retrieveBatchBatchTransferHistoryDetail(id)
    }
  },
  [APP_DOMAINS.INFRASTRUCTURE]: {
    'area': {
      list: async (filters?: HistoryFilters) => await ApiService.listInfrastructureAreaHistory(
        undefined, // active
        filters?.dateFrom,
        filters?.dateTo,
        undefined, // geography
        filters?.historyType,
        filters?.historyUser,
        undefined, // name
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveInfrastructureAreaHistoryDetail(id)
    },
    'container': {
      list: async (filters?: HistoryFilters) => await ApiService.listInfrastructureContainerHistory(
        undefined, // active
        undefined, // area
        undefined, // containerType
        filters?.dateFrom,
        filters?.dateTo,
        undefined, // hall
        filters?.historyType,
        filters?.historyUser,
        undefined, // name
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveInfrastructureContainerHistoryDetail(id)
    },
    'container-type': {
      list: async (filters?: HistoryFilters) => await ApiService.listInfrastructureContainerTypeHistory(
        undefined, // category
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // name
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveInfrastructureContainerTypeHistoryDetail(id)
    },
    'feed-container': {
      list: async (filters?: HistoryFilters) => await ApiService.listInfrastructureFeedContainerHistory(
        undefined, // active
        undefined, // area
        undefined, // containerType
        filters?.dateFrom,
        filters?.dateTo,
        undefined, // hall
        filters?.historyType,
        filters?.historyUser,
        undefined, // name
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveInfrastructureFeedContainerHistoryDetail(id)
    },
    'freshwater-station': {
      list: async (filters?: HistoryFilters) => await ApiService.listInfrastructureFreshwaterStationHistory(
        undefined, // active
        filters?.dateFrom,
        filters?.dateTo,
        undefined, // geography
        filters?.historyType,
        filters?.historyUser,
        undefined, // name
        undefined, // ordering
        filters?.page,
        undefined, // search
        undefined  // stationType
      ),
      detail: async (id: number) => await ApiService.retrieveInfrastructureFreshwaterStationHistoryDetail(id)
    },
    'geography': {
      list: async (filters?: HistoryFilters) => await ApiService.listInfrastructureGeographyHistory(
        filters?.dateFrom,
        filters?.dateTo,
        undefined, // description
        filters?.historyType,
        filters?.historyUser,
        undefined, // name
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveInfrastructureGeographyHistoryDetail(id)
    },
    'hall': {
      list: async (filters?: HistoryFilters) => await ApiService.listInfrastructureHallHistory(
        undefined, // active
        filters?.dateFrom,
        filters?.dateTo,
        undefined, // freshwaterStation
        filters?.historyType,
        filters?.historyUser,
        undefined, // name
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveInfrastructureHallHistoryDetail(id)
    },
    'sensor': {
      list: async (filters?: HistoryFilters) => await ApiService.listInfrastructureSensorHistory(
        undefined, // active
        undefined, // container
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // name
        undefined, // ordering
        filters?.page,
        undefined, // search
        undefined  // sensorType
      ),
      detail: async (id: number) => await ApiService.retrieveInfrastructureSensorHistoryDetail(id)
    }
  },
  [APP_DOMAINS.INVENTORY]: {
    'feeding-event': {
      list: async (filters?: HistoryFilters) => await ApiService.listInventoryFeedingEventHistory(
        undefined, // batch
        filters?.dateFrom,
        filters?.dateTo,
        undefined, // feed
        filters?.historyType,
        filters?.historyUser,
        undefined, // method
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveInventoryFeedingEventHistoryDetail(id)
    }
  },
  [APP_DOMAINS.HEALTH]: {
    'journal-entry': {
      list: async (filters?: HistoryFilters) => await ApiService.listHealthJournalEntryHistory(
        undefined, // batch
        undefined, // category
        undefined, // container
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // ordering
        filters?.page,
        undefined, // resolutionStatus
        undefined, // search
        undefined  // severity
      ),
      detail: async (id: number) => await ApiService.retrieveHealthJournalEntryHistoryDetail(id)
    },
    'health-lab-sample': {
      list: async (filters?: HistoryFilters) => await ApiService.listHealthHealthLabSampleHistory(
        undefined, // batchContainerAssignment
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // ordering
        filters?.page,
        undefined, // recordedBy
        undefined, // sampleType
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveHealthHealthLabSampleHistoryDetail(id)
    },
    'lice-count': {
      list: async (filters?: HistoryFilters) => await ApiService.listHealthLiceCountHistory(
        undefined, // batch
        undefined, // container
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // ordering
        filters?.page,
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveHealthLiceCountHistoryDetail(id)
    },
    'mortality-record': {
      list: async (filters?: HistoryFilters) => await ApiService.listHealthMortalityRecordHistory(
        undefined, // batch
        undefined, // container
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // ordering
        filters?.page,
        undefined, // reason
        undefined  // search
      ),
      detail: async (id: number) => await ApiService.retrieveHealthMortalityRecordHistoryDetail(id)
    },
    'treatment': {
      list: async (filters?: HistoryFilters) => await ApiService.listHealthTreatmentHistory(
        undefined, // batch
        undefined, // container
        filters?.dateFrom,
        filters?.dateTo,
        filters?.historyType,
        filters?.historyUser,
        undefined, // ordering
        filters?.page,
        undefined, // search
        undefined  // treatmentType
      ),
      detail: async (id: number) => await ApiService.retrieveHealthTreatmentHistoryDetail(id)
    }
  },
  [APP_DOMAINS.SCENARIO]: {
    // Note: Scenario model history intentionally excluded (Phase 7 - prevents 50GB table bloat)
    // Note: TGC, FCR, Mortality model history endpoints not exposed in backend API
  },
  [APP_DOMAINS.USERS]: {
    'user-profile': {
      list: async (filters?: HistoryFilters) => await ApiService.listUsersUserProfileHistory(
        filters?.dateFrom,
        filters?.dateTo,
        undefined, // geography
        filters?.historyType,
        filters?.historyUser,
        undefined, // ordering
        filters?.page,
        undefined, // role
        undefined, // search
        undefined, // subsidiary
        undefined  // user
      ),
      detail: async (id: number) => await ApiService.retrieveUsersUserProfileHistoryDetail(id)
    }
  }
} as const;

// Main hook for fetching history lists
export function useHistoryList(
  appDomain: AppDomain,
  model: string,
  filters?: HistoryFilters
) {
  return useQuery({
    queryKey: getHistoryQueryKey(appDomain, model, filters),
    queryFn: async () => {
      const domainMethods = HISTORY_METHODS[appDomain];
      if (!domainMethods) {
        throw new Error(`Unknown domain: ${appDomain}`);
      }

      const modelMethod = domainMethods[model as keyof typeof domainMethods];
      if (!modelMethod || !modelMethod.list) {
        // Return empty result set instead of throwing for domains with no exposed history endpoints
        return {
          count: 0,
          next: null,
          previous: null,
          results: []
        };
      }

      return await modelMethod.list(filters);
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
      const domainMethods = HISTORY_METHODS[appDomain];
      if (!domainMethods) {
        throw new Error(`Unknown domain: ${appDomain}`);
      }

      const modelMethod = domainMethods[model as keyof typeof domainMethods];
      if (!modelMethod || !modelMethod.detail) {
        // Return null for domains with no exposed history endpoints
        return null;
      }

      return await modelMethod.detail(historyId);
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
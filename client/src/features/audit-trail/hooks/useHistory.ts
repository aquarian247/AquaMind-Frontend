import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";

// History types
export type HistoryType = '+' | '~' | '-';

export interface HistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  historyUser?: string;
  historyType?: HistoryType;
  page?: number;
  pageSize?: number;
}

// App domains for tabs
export const APP_DOMAINS = {
  BATCH: 'batch',
  INFRASTRUCTURE: 'infrastructure',
  INVENTORY: 'inventory',
  HEALTH: 'health',
  SCENARIO: 'scenario',
  USERS: 'users'
} as const;

export type AppDomain = typeof APP_DOMAINS[keyof typeof APP_DOMAINS];

// Model mappings for each app domain (only using methods that actually exist)
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
};

// Generic history query hook
export function useHistoryList(appDomain: AppDomain, model?: string, filters?: HistoryFilters) {
  const queryKey = ['audit-trail', appDomain, model, filters];

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        // For now, let's simplify and just return batch history
        // In a full implementation, we'd need to handle all the different model types
        // and their specific parameter signatures
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
      } catch (error) {
        console.error(`Failed to fetch ${appDomain} history:`, error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Detail history query hook
export function useHistoryDetail(appDomain: AppDomain, historyId: number) {
  const queryKey = ['audit-trail', appDomain, 'detail', historyId];

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        // For now, default to batch detail as we need to implement proper routing
        // In a full implementation, we'd need to determine the specific model type
        // from the history record or route parameters
        return await ApiService.retrieveBatchBatchHistoryDetail(historyId);
      } catch (error) {
        console.error(`Failed to fetch ${appDomain} history detail:`, error);
        throw error;
      }
    },
    enabled: !!historyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Utility function to get available models for an app domain
export function getAvailableModels(appDomain: AppDomain) {
  return APP_MODELS[appDomain] || [];
}

// Utility function to get history type label
export function getHistoryTypeLabel(type: HistoryType): string {
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
export function getHistoryTypeColor(type: HistoryType): string {
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

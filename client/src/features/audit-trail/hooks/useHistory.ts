// Re-export from api.ts for backward compatibility
export {
  useHistoryList,
  useHistoryDetail,
  HistoryFilters,
  HistoryRecord,
  PaginatedHistoryResponse,
  APP_DOMAINS,
  AppDomain,
  APP_MODELS,
  getAvailableModels,
  getHistoryTypeLabel,
  getHistoryTypeColor,
  getHistoryQueryKey
} from '../api/api';

// Legacy type alias for backward compatibility
export type HistoryType = '+' | '~' | '-';

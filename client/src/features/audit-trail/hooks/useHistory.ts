// Re-export from api.ts for backward compatibility
export {
  useHistoryList,
  useHistoryDetail,
  APP_MODELS,
  getHistoryTypeLabel,
  getHistoryTypeColor,
  getHistoryQueryKey
} from '../api/api';

// Legacy type alias for backward compatibility
export type HistoryType = '+' | '~' | '-';

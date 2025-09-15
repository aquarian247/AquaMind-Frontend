// Barrel export for audit trail feature
export { OverviewPage } from './pages/OverviewPage';
export { RecordDetailPage } from './pages/RecordDetailPage';

// Re-export hooks for convenience
export { useHistoryList, useHistoryDetail } from './hooks/useHistory';
export { useHistoryFilters } from './hooks/useHistoryFilters';

// Re-export components for potential reuse
export { TypeBadge } from './components/TypeBadge';
export { EmptyState } from './components/EmptyState';
export { ModelSelector } from './components/ModelSelector';
export { FilterBar } from './components/FilterBar';
export { HistoryTable } from './components/HistoryTable';

// Re-export types and constants
export type { HistoryType, HistoryFilters, AppDomain } from './hooks/useHistory';
export { APP_DOMAINS, getAvailableModels, getHistoryTypeLabel, getHistoryTypeColor } from './hooks/useHistory';

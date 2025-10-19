/**
 * Executive Dashboard Feature - Barrel Export
 * 
 * Centralized exports for lazy loading and clean imports
 */

// Types
export type * from './types';

// Utilities
export * from './utils/alertLevels';
export * from './utils/kpiCalculations';

// API Hooks
export * from './api/api';

// Components
export * from './components';

// Pages
export { default as ExecutiveDashboardPage } from './pages/ExecutiveDashboardPage';


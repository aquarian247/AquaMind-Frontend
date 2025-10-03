/**
 * Batch Management - Re-export from feature slice
 * 
 * This file maintains backward compatibility after refactoring.
 * The actual implementation is now in features/batch-management/pages/BatchManagementPage.tsx
 * 
 * Previous: 509 LOC monolithic component
 * Current: Decomposed into feature slice with:
 * - Shell page (191 LOC)
 * - Reusable hooks (useBatchFilters, useBatchCreation)
 * - Utility functions with tests (batchHelpers, lifecycleHelpers)
 * - Form schema (batchFormSchema)
 * - Dialog component (CreateBatchDialog)
 */
export { default } from "@/features/batch-management/pages/BatchManagementPage";

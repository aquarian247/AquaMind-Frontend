import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FinancialPlanningPage from './FinancialPlanningPage';

vi.mock('@/components/rbac/PermissionGuard', () => ({
  PermissionGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/contexts/UserContext', () => ({
  useUser: vi.fn(() => ({ isAdmin: true })),
}));

vi.mock('../api', () => ({
  useFinanceCompanies: vi.fn(),
  useOperatingUnits: vi.fn(),
  useAccountGroups: vi.fn(),
  useAccounts: vi.fn(),
  useCostCenters: vi.fn(),
  useAllocationRules: vi.fn(),
  useBudgets: vi.fn(),
  useBudgetEntries: vi.fn(),
  useCostImports: vi.fn(),
  usePeriodLocks: vi.fn(),
  useValuationRuns: vi.fn(),
  useMovementReport: vi.fn(),
  useRingValuation: vi.fn(),
  useNavExportPreview: vi.fn(),
  usePreCloseSummary: vi.fn(),
  useCreateBudget: vi.fn(),
  useCopyBudget: vi.fn(),
  useCreateAccountGroup: vi.fn(),
  useCreateAccount: vi.fn(),
  useCreateCostCenter: vi.fn(),
  useCreateAllocationRule: vi.fn(),
  useBulkImportBudgetEntries: vi.fn(),
  useDeleteBudgetEntry: vi.fn(),
  useUploadCostImport: vi.fn(),
  useAllocateBudget: vi.fn(),
  useCreateValuationRun: vi.fn(),
  useLockPeriod: vi.fn(),
  useUnlockPeriod: vi.fn(),
}));

import * as financeCoreApi from '../api';

function mutationStub() {
  return {
    mutateAsync: vi.fn(),
    isPending: false,
  };
}

describe('FinancialPlanningPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(financeCoreApi.useFinanceCompanies).mockReturnValue({
      data: [
        {
          company_id: 1,
          display_name: 'Finance Core Freshwater',
          currency: 'NOK',
          subsidiary: 'FW',
        },
      ],
      isLoading: false,
    } as any);
    vi.mocked(financeCoreApi.useOperatingUnits).mockReturnValue({
      data: [
        {
          site_id: 10,
          site_name: 'Finance Station',
          source_model: 'station',
          source_pk: 1,
        },
      ],
      isLoading: false,
    } as any);
    vi.mocked(financeCoreApi.useAccountGroups).mockReturnValue({
      data: [{ group_id: 1, code: 'OPEX', name: 'Operating Expenses', account_type: 'EXPENSE' }],
      isLoading: false,
    } as any);
    vi.mocked(financeCoreApi.useAccounts).mockReturnValue({
      data: [{ account_id: 1, code: '5100', name: 'Station Costs', account_type: 'EXPENSE' }],
      isLoading: false,
    } as any);
    vi.mocked(financeCoreApi.useCostCenters).mockReturnValue({
      data: [{ cost_center_id: 1, code: 'PRJ-1', name: 'Project 1', cost_center_type: 'PROJECT', batch_links: [] }],
      isLoading: false,
    } as any);
    vi.mocked(financeCoreApi.useAllocationRules).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);
    vi.mocked(financeCoreApi.useBudgets).mockReturnValue({
      data: [{ budget_id: 1, name: 'Base Budget', version: 1, status: 'ACTIVE' }],
      isLoading: false,
    } as any);
    vi.mocked(financeCoreApi.useBudgetEntries).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);
    vi.mocked(financeCoreApi.useCostImports).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(financeCoreApi.usePeriodLocks).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(financeCoreApi.useValuationRuns).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(financeCoreApi.useMovementReport).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(financeCoreApi.useRingValuation).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(financeCoreApi.useNavExportPreview).mockReturnValue({ data: undefined, isLoading: false } as any);
    vi.mocked(financeCoreApi.usePreCloseSummary).mockReturnValue({
      data: {
        period: '2026-03',
        budget: { budget_id: 1, name: 'Base Budget', version: 1, status: 'ACTIVE' },
        biology: {
          row_count: 1,
          source: 'assignment_fallback',
          snapshot_date: '2026-03-01',
          latest_recorded_at: '2026-03-11T12:00:00Z',
          missing_cost_projects: [],
        },
        latest_import: null,
        latest_preview_run: null,
        latest_approved_run: null,
        current_lock: {
          period_lock_id: null,
          is_locked: false,
          version: null,
          locked_at: null,
          locked_by_username: null,
          reopened_at: null,
          reopened_by_username: null,
          lock_reason: '',
          reopen_reason: '',
        },
        checks: [],
        actions: {
          can_import: true,
          can_allocate: false,
          can_valuate: false,
          can_lock: false,
          can_unlock: false,
        },
      },
      isLoading: false,
    } as any);

    vi.mocked(financeCoreApi.useCreateBudget).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useCopyBudget).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useCreateAccountGroup).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useCreateAccount).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useCreateCostCenter).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useCreateAllocationRule).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useBulkImportBudgetEntries).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useDeleteBudgetEntry).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useUploadCostImport).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useAllocateBudget).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useCreateValuationRun).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useLockPeriod).mockReturnValue(mutationStub() as any);
    vi.mocked(financeCoreApi.useUnlockPeriod).mockReturnValue(mutationStub() as any);
  });

  it('renders finance planning shell and tabs', async () => {
    render(<FinancialPlanningPage />);

    expect(screen.getByText('Financial Planning')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Chart of Accounts/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Cost Centers/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Budgeting/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /EoM Wizard/i })).toBeInTheDocument();

    expect((await screen.findAllByText('Add Account Group')).length).toBeGreaterThan(0);
    expect(await screen.findByText('Base Budget v1')).toBeInTheDocument();
  });
});

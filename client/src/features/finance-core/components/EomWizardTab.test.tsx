import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EomWizardTab } from './EomWizardTab';

function baseProps() {
  return {
    fiscalYear: 2026,
    month: '3',
    onMonthChange: vi.fn(),
    budgets: [{ budget_id: 1, name: 'Base Budget', version: 1, status: 'ACTIVE' }] as any,
    selectedBudgetId: 1,
    operatingUnits: [
      { site_id: 1, site_name: 'Finance Station', source_model: 'station' },
    ] as any,
    selectedOperatingUnitId: 1,
    onSelectOperatingUnit: vi.fn(),
    selectedRunId: undefined,
    onSelectRunId: vi.fn(),
    costImports: [],
    periodLocks: [],
    valuationRuns: [],
    movementReport: [],
    ringValuation: [],
    navExportPreview: undefined,
    preCloseSummary: {
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
      checks: [
        {
          code: 'import',
          label: 'Import',
          status: 'blocked',
          blocking: true,
          message: 'No cost import found for the selected period.',
        },
      ],
      actions: {
        can_import: true,
        can_allocate: false,
        can_valuate: false,
        can_lock: false,
        can_unlock: false,
      },
    },
    lastActionResult: null,
    onUploadCostImport: vi.fn(),
    onAllocateBudget: vi.fn(),
    onCreateValuationRun: vi.fn(),
    onLockPeriod: vi.fn(),
    onUnlockPeriod: vi.fn(),
    isSubmitting: false,
    companyId: 1,
    isAdmin: false,
    loadingState: {
      preClose: false,
      imports: false,
      locks: false,
      runs: false,
      movement: false,
      ring: false,
      nav: false,
    },
    errorState: {},
  };
}

describe('EomWizardTab', () => {
  it('renders checklist and disables blocked actions', () => {
    render(<EomWizardTab {...baseProps()} />);

    expect(screen.getByText('Pre-Close Checklist')).toBeInTheDocument();
    expect(screen.getByText('No cost import found for the selected period.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Allocation Preview/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Run Valuation/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Lock Period/i })).toBeDisabled();
  });

  it('shows reopen controls for admins when the period is locked', () => {
    const props = baseProps();
    props.isAdmin = true;
    props.preCloseSummary = {
      ...props.preCloseSummary,
      current_lock: {
        period_lock_id: 7,
        is_locked: true,
        version: 3,
        locked_at: '2026-03-11T12:00:00Z',
        locked_by_username: 'finance_demo',
        reopened_at: null,
        reopened_by_username: null,
        lock_reason: 'Close complete',
        reopen_reason: '',
      },
      actions: {
        ...props.preCloseSummary.actions,
        can_unlock: true,
      },
    };

    render(<EomWizardTab {...props} />);

    expect(screen.getByText('LOCKED')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reopen Period/i })).toBeInTheDocument();
  });
});

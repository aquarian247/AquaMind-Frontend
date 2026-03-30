import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import { useUser } from '@/contexts/UserContext';
import { ChartOfAccountsManager } from '../components/ChartOfAccountsManager';
import { CostCenterManager } from '../components/CostCenterManager';
import { BudgetingTab } from '../components/BudgetingTab';
import { EomWizardTab } from '../components/EomWizardTab';
import {
  useAccountGroups,
  useAccounts,
  useAllocateBudget,
  useAllocationRules,
  useBulkImportBudgetEntries,
  useBudgets,
  useBudgetEntries,
  useCopyBudget,
  useCostCenters,
  useCostImports,
  useCreateAccount,
  useCreateAccountGroup,
  useCreateAllocationRule,
  useCreateBudget,
  useCreateCostCenter,
  useCreateSeaCostProject,
  useCreateValuationRun,
  useDeleteBudgetEntry,
  useFinanceCompanies,
  useLockPeriod,
  useMovementReport,
  useNavExportPreview,
  useOperatingUnits,
  usePeriodLocks,
  usePreCloseSummary,
  useRingValuation,
  useSeaInputOverview,
  useUploadCostImport,
  useUploadSeaCostImport,
  useUnlockPeriod,
  useValuationRuns,
} from '../api';

interface ActionResultState {
  kind: 'success' | 'error';
  title: string;
  description: string;
  details?: string[];
}

function formatActionError(error: unknown): ActionResultState {
  const payload = (error as { payload?: any })?.payload;
  const detailRows = Array.isArray(payload?.rows)
    ? payload.rows
        .slice(0, 5)
        .map((row: { row: number; error: string }) => `Row ${row.row}: ${row.error}`)
    : undefined;
  const description =
    payload?.detail ||
    (error instanceof Error ? error.message : 'Unknown finance-core error');

  return {
    kind: 'error',
    title: 'Finance Core Action Failed',
    description,
    details: detailRows,
  };
}

export default function FinancialPlanningPage() {
  const { isAdmin } = useUser();
  const currentYear = new Date().getFullYear();
  const [activeTab, setActiveTab] = useState<
    'chart-of-accounts' | 'cost-centers' | 'budgeting' | 'eom-wizard'
  >('chart-of-accounts');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>();
  const [selectedOperatingUnitId, setSelectedOperatingUnitId] = useState<number | undefined>();
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | undefined>();
  const [fiscalYear, setFiscalYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
  const [selectedRunId, setSelectedRunId] = useState<number | undefined>();
  const [lastActionResult, setLastActionResult] = useState<ActionResultState | null>(null);

  const companiesQuery = useFinanceCompanies();
  const operatingUnitsQuery = useOperatingUnits(selectedCompanyId);
  const accountGroupsQuery = useAccountGroups();
  const accountsQuery = useAccounts();
  const costCentersQuery = useCostCenters(selectedCompanyId);
  const allocationRulesQuery = useAllocationRules();
  const budgetsQuery = useBudgets(selectedCompanyId, fiscalYear);
  const budgetEntriesQuery = useBudgetEntries(
    activeTab === 'budgeting' ? selectedBudgetId : undefined
  );
  const eomEnabled = activeTab === 'eom-wizard';
  const costImportsQuery = useCostImports(
    eomEnabled ? fiscalYear : undefined,
    eomEnabled ? Number(selectedMonth) : undefined
  );
  const periodLocksQuery = usePeriodLocks(
    eomEnabled ? selectedCompanyId : undefined,
    eomEnabled ? fiscalYear : undefined,
    eomEnabled ? Number(selectedMonth) : undefined
  );
  const valuationRunsQuery = useValuationRuns(
    eomEnabled ? selectedCompanyId : undefined,
    eomEnabled ? selectedOperatingUnitId : undefined,
    eomEnabled ? fiscalYear : undefined,
    eomEnabled ? Number(selectedMonth) : undefined
  );
  const preCloseSummaryQuery = usePreCloseSummary(
    eomEnabled ? selectedCompanyId : undefined,
    eomEnabled ? selectedOperatingUnitId : undefined,
    eomEnabled ? fiscalYear : undefined,
    eomEnabled ? Number(selectedMonth) : undefined,
    eomEnabled ? selectedBudgetId : undefined
  );
  const movementReportQuery = useMovementReport(
    eomEnabled ? selectedCompanyId : undefined,
    eomEnabled ? fiscalYear : undefined,
    eomEnabled ? Number(selectedMonth) : undefined,
    eomEnabled ? selectedRunId : undefined
  );
  const ringValuationQuery = useRingValuation(
    eomEnabled ? selectedRunId : undefined
  );
  const navPreviewQuery = useNavExportPreview(
    eomEnabled ? selectedRunId : undefined
  );

  const createBudget = useCreateBudget();
  const copyBudget = useCopyBudget();
  const createAccountGroup = useCreateAccountGroup();
  const createAccount = useCreateAccount();
  const createCostCenter = useCreateCostCenter();
  const createAllocationRule = useCreateAllocationRule();
  const createSeaCostProject = useCreateSeaCostProject();
  const bulkImportBudgetEntries = useBulkImportBudgetEntries();
  const deleteBudgetEntry = useDeleteBudgetEntry();
  const uploadCostImport = useUploadCostImport();
  const uploadSeaCostImport = useUploadSeaCostImport();
  const allocateBudget = useAllocateBudget();
  const createValuationRun = useCreateValuationRun();
  const lockPeriod = useLockPeriod();
  const unlockPeriod = useUnlockPeriod();

  const selectedCompany = useMemo(
    () => companiesQuery.data?.find((c) => c.company_id === selectedCompanyId),
    [companiesQuery.data, selectedCompanyId]
  );
  const isFarmingCompany = selectedCompany?.subsidiary === 'FM';

  const seaInputOverviewQuery = useSeaInputOverview(
    eomEnabled && isFarmingCompany ? selectedCompanyId : undefined,
    eomEnabled && isFarmingCompany ? selectedOperatingUnitId : undefined,
    eomEnabled && isFarmingCompany ? fiscalYear : undefined,
    eomEnabled && isFarmingCompany ? Number(selectedMonth) : undefined,
  );

  useEffect(() => {
    if (!selectedCompanyId && companiesQuery.data?.length) {
      setSelectedCompanyId(companiesQuery.data[0].company_id);
    }
  }, [companiesQuery.data, selectedCompanyId]);

  useEffect(() => {
    if (!selectedOperatingUnitId && operatingUnitsQuery.data?.length) {
      setSelectedOperatingUnitId(operatingUnitsQuery.data[0].site_id);
    }
  }, [operatingUnitsQuery.data, selectedOperatingUnitId]);

  useEffect(() => {
    if (!selectedBudgetId && budgetsQuery.data?.length) {
      setSelectedBudgetId(budgetsQuery.data[0].budget_id);
    }
  }, [budgetsQuery.data, selectedBudgetId]);

  useEffect(() => {
    if (!valuationRunsQuery.data?.length) {
      setSelectedRunId(undefined);
      return;
    }

    const availableRunIds = new Set(valuationRunsQuery.data.map((run) => run.run_id));
    if (selectedRunId && availableRunIds.has(selectedRunId)) {
      return;
    }

    const approvedRun = valuationRunsQuery.data.find((run) => run.status === 'APPROVED');
    setSelectedRunId(approvedRun?.run_id || valuationRunsQuery.data[0].run_id);
  }, [selectedRunId, valuationRunsQuery.data]);

  const selectedBudget = useMemo(
    () => budgetsQuery.data?.find((budget) => budget.budget_id === selectedBudgetId),
    [budgetsQuery.data, selectedBudgetId]
  );

  const isLoading =
    companiesQuery.isLoading ||
    operatingUnitsQuery.isLoading ||
    accountGroupsQuery.isLoading ||
    accountsQuery.isLoading ||
    allocationRulesQuery.isLoading ||
    budgetsQuery.isLoading;

  const isSubmitting =
    createBudget.isPending ||
    copyBudget.isPending ||
    createAccountGroup.isPending ||
    createAccount.isPending ||
    createCostCenter.isPending ||
    createAllocationRule.isPending ||
    bulkImportBudgetEntries.isPending ||
    deleteBudgetEntry.isPending ||
    uploadCostImport.isPending ||
    allocateBudget.isPending ||
    createValuationRun.isPending ||
    lockPeriod.isPending ||
    unlockPeriod.isPending;

  const handleDeleteBudgetEntries = useCallback(async (entryIds: number[]) => {
    await Promise.all(entryIds.map((entryId) => deleteBudgetEntry.mutateAsync(entryId)));
  }, [deleteBudgetEntry]);

  const handleCreateBudget = useCallback(
    async (payload: Partial<import('@/api/generated').Budget>) =>
      createBudget.mutateAsync(payload),
    [createBudget]
  );

  const handleCopyBudget = useCallback(
    async (budgetId: number, payload: import('@/api/generated').BudgetCopy) =>
      copyBudget.mutateAsync({ budgetId, payload }),
    [copyBudget]
  );

  const handleBulkImportBudgetEntries = useCallback(
    async (payload: import('@/api/generated').BudgetEntryBulkImport) =>
      bulkImportBudgetEntries.mutateAsync(payload),
    [bulkImportBudgetEntries]
  );

  const handleUploadCostImport = useCallback(async (payload: {
    year: number;
    month: number;
    file: File;
  }) => {
    try {
      const result = await uploadCostImport.mutateAsync(payload);
      setLastActionResult({
        kind: 'success',
        title: 'Import complete',
        description: `${result.source_filename} uploaded for ${result.year}-${String(result.month).padStart(2, '0')}.`,
        details: [
          `${result.imported_row_count} rows imported`,
          `Total amount ${result.total_amount}`,
        ],
      });
      return result;
    } catch (error) {
      setLastActionResult(formatActionError(error));
      throw error;
    }
  }, [uploadCostImport]);

  const handleAllocateBudget = useCallback(async (
    budgetId: number,
    operatingUnitId: number,
    month: number
  ) => {
    try {
      const run = await allocateBudget.mutateAsync({
        budgetId,
        payload: { month, operating_unit: operatingUnitId, notes: '' },
      });
      setSelectedRunId(run.run_id);
      setLastActionResult({
        kind: 'success',
        title: 'Allocation preview ready',
        description: `Preview run v${run.version} created for ${run.year}-${String(run.month).padStart(2, '0')}.`,
        details: [
          `Biology source rows: ${run.biology_snapshot?.length || 0}`,
          `Allocated total ${run.totals_snapshot?.allocated_amount || '0.00'}`,
        ],
      });
      return run;
    } catch (error) {
      setLastActionResult(formatActionError(error));
      throw error;
    }
  }, [allocateBudget]);

  const handleCreateValuationRun = useCallback(async (
    budgetId: number,
    operatingUnitId: number,
    month: number,
    mortalityAdjustments?: Record<string, string>
  ) => {
    try {
      const run = await createValuationRun.mutateAsync({
        budgetId,
        payload: {
          month,
          operating_unit: operatingUnitId,
          notes: '',
          mortality_adjustments: mortalityAdjustments || {},
        },
      });
      setSelectedRunId(run.run_id);
      setLastActionResult({
        kind: 'success',
        title: 'Valuation approved',
        description: `Approved run v${run.version} completed for ${run.year}-${String(run.month).padStart(2, '0')}.`,
        details: [
          `Closing value ${run.totals_snapshot?.closing_value_total || '0.00'}`,
          `Delta ${run.totals_snapshot?.delta || '0.00'}`,
        ],
      });
      return run;
    } catch (error) {
      setLastActionResult(formatActionError(error));
      throw error;
    }
  }, [createValuationRun]);

  const handleLockPeriod = useCallback(async (payload: {
    company: number;
    operating_unit: number;
    year: number;
    month: number;
    reason: string;
  }) => {
    try {
      const result = await lockPeriod.mutateAsync(payload);
      setLastActionResult({
        kind: 'success',
        title: 'Period locked',
        description: `${result.operating_unit_name} locked for ${result.year}-${String(result.month).padStart(2, '0')}.`,
        details: [
          `Version ${result.version}`,
          result.lock_reason || 'No lock reason provided',
        ],
      });
      return result;
    } catch (error) {
      setLastActionResult(formatActionError(error));
      throw error;
    }
  }, [lockPeriod]);

  const handleUnlockPeriod = useCallback(async (periodLockId: number, reason: string) => {
    try {
      const result = await unlockPeriod.mutateAsync({
        periodLockId,
        payload: { reason },
      });
      setLastActionResult({
        kind: 'success',
        title: 'Period reopened',
        description: `${result.operating_unit_name} reopened at version ${result.version}.`,
        details: [reason],
      });
      return result;
    } catch (error) {
      setLastActionResult(formatActionError(error));
      throw error;
    }
  }, [unlockPeriod]);

  return (
    <PermissionGuard require="finance" resource="Finance Planning">
      <div className="w-full max-w-none py-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Planning</h1>
            <p className="mt-1 text-muted-foreground">
              Chart of accounts, cost centers, budgeting, and month-end close.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Company</label>
              <select
                className="h-10 rounded-md border border-input bg-background px-3"
                value={selectedCompanyId?.toString() || ''}
                onChange={(e) => {
                  setSelectedCompanyId(Number(e.target.value));
                  setSelectedBudgetId(undefined);
                  setSelectedOperatingUnitId(undefined);
                }}
              >
                <option value="">Select company</option>
                {companiesQuery.data?.map((company) => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.display_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Fiscal Year</label>
              <input
                className="h-10 rounded-md border border-input bg-background px-3"
                type="number"
                value={fiscalYear}
                onChange={(e) => {
                  setFiscalYear(Number(e.target.value));
                  setSelectedBudgetId(undefined);
                }}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Active Budget</label>
              <div className="flex h-10 items-center rounded-md border border-dashed px-3">
                <Badge variant="secondary">
                  {selectedBudget ? `${selectedBudget.name} v${selectedBudget.version}` : 'No budget'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && (
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(
                value as 'chart-of-accounts' | 'cost-centers' | 'budgeting' | 'eom-wizard'
              )
            }
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
              <TabsTrigger value="cost-centers">Cost Centers</TabsTrigger>
              <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
              <TabsTrigger value="eom-wizard">EoM Wizard</TabsTrigger>
            </TabsList>

            <TabsContent value="chart-of-accounts">
              <ChartOfAccountsManager
                accountGroups={accountGroupsQuery.data || []}
                accounts={accountsQuery.data || []}
                onCreateAccountGroup={(payload) => createAccountGroup.mutateAsync(payload)}
                onCreateAccount={(payload) => createAccount.mutateAsync(payload)}
                isSubmitting={isSubmitting}
              />
            </TabsContent>

            <TabsContent value="cost-centers">
              <CostCenterManager
                companyId={selectedCompanyId}
                sites={operatingUnitsQuery.data || []}
                costCenters={costCentersQuery.data || []}
                allocationRules={allocationRulesQuery.data || []}
                accountGroups={accountGroupsQuery.data || []}
                onCreateCostCenter={(payload) => createCostCenter.mutateAsync(payload)}
                onCreateAllocationRule={(payload) => createAllocationRule.mutateAsync(payload)}
                onCreateSeaProject={(payload) => createSeaCostProject.mutateAsync(payload)}
                isSubmitting={isSubmitting}
                isFarmingCompany={isFarmingCompany}
              />
            </TabsContent>

            <TabsContent value="budgeting">
              <BudgetingTab
                companyId={selectedCompanyId}
                fiscalYear={fiscalYear}
                budgets={budgetsQuery.data || []}
                budgetEntries={budgetEntriesQuery.data || []}
                accounts={accountsQuery.data || []}
                costCenters={costCentersQuery.data || []}
                selectedBudgetId={selectedBudgetId}
                onSelectBudget={setSelectedBudgetId}
                onCreateBudget={handleCreateBudget}
                onCopyBudget={handleCopyBudget}
                onBulkImportBudgetEntries={handleBulkImportBudgetEntries}
                onDeleteBudgetEntries={handleDeleteBudgetEntries}
                isSubmitting={isSubmitting}
              />
            </TabsContent>

            <TabsContent value="eom-wizard">
              <EomWizardTab
                fiscalYear={fiscalYear}
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                budgets={budgetsQuery.data || []}
                selectedBudgetId={selectedBudgetId}
                operatingUnits={operatingUnitsQuery.data || []}
                selectedOperatingUnitId={selectedOperatingUnitId}
                onSelectOperatingUnit={setSelectedOperatingUnitId}
                selectedRunId={selectedRunId}
                onSelectRunId={setSelectedRunId}
                costImports={costImportsQuery.data || []}
                periodLocks={periodLocksQuery.data || []}
                valuationRuns={valuationRunsQuery.data || []}
                movementReport={movementReportQuery.data || []}
                ringValuation={ringValuationQuery.data || []}
                navExportPreview={navPreviewQuery.data}
                preCloseSummary={preCloseSummaryQuery.data}
                lastActionResult={lastActionResult}
                onUploadCostImport={handleUploadCostImport}
                onUploadSeaCostImport={async (payload) => {
                  try {
                    await uploadSeaCostImport.mutateAsync(payload);
                    setLastActionResult({
                      kind: 'success',
                      title: 'Sea Cost Import Uploaded',
                      description: 'Sea farming costs imported with routing rules applied.',
                    });
                  } catch (error) {
                    setLastActionResult(formatActionError(error));
                    throw error;
                  }
                }}
                onAllocateBudget={handleAllocateBudget}
                onCreateValuationRun={handleCreateValuationRun}
                onLockPeriod={handleLockPeriod}
                onUnlockPeriod={handleUnlockPeriod}
                isSubmitting={isSubmitting}
                companyId={selectedCompanyId}
                isAdmin={isAdmin}
                isFarmingCompany={isFarmingCompany}
                seaInputOverview={seaInputOverviewQuery.data}
                loadingState={{
                  preClose: preCloseSummaryQuery.isLoading,
                  imports: costImportsQuery.isLoading,
                  locks: periodLocksQuery.isLoading,
                  runs: valuationRunsQuery.isLoading,
                  movement: movementReportQuery.isLoading,
                  ring: ringValuationQuery.isLoading,
                  nav: navPreviewQuery.isLoading,
                }}
                errorState={{
                  preClose: preCloseSummaryQuery.error instanceof Error ? preCloseSummaryQuery.error.message : undefined,
                  imports: costImportsQuery.error instanceof Error ? costImportsQuery.error.message : undefined,
                  locks: periodLocksQuery.error instanceof Error ? periodLocksQuery.error.message : undefined,
                  runs: valuationRunsQuery.error instanceof Error ? valuationRunsQuery.error.message : undefined,
                  movement: movementReportQuery.error instanceof Error ? movementReportQuery.error.message : undefined,
                  ring: ringValuationQuery.error instanceof Error ? ringValuationQuery.error.message : undefined,
                  nav: navPreviewQuery.error instanceof Error ? navPreviewQuery.error.message : undefined,
                }}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PermissionGuard>
  );
}

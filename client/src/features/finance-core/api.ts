import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiService, OpenAPI } from '@/api/generated';
import { toast } from '@/hooks/use-toast';
import type {
  Account,
  AccountGroup,
  AllocationRule,
  Budget,
  BudgetAllocate,
  BudgetCopy,
  BudgetEntry,
  BudgetEntryBulkImport,
  CompanyDimension,
  CostCenter,
  PeriodLock,
  PeriodLockAction,
  PeriodUnlock,
  SiteDimension,
  ValuationRun,
  ValuationRunRequest,
} from '@/api/generated';
import { authenticatedFetch } from '@/services/auth.service';

export interface MovementReportRow {
  run_id: number;
  company: string;
  operating_unit: string;
  period: string;
  allocated_total: string;
  closing_value_total: string;
  delta: string;
}

export interface RingValuationRow {
  cost_center_code: string;
  cost_center_name: string;
  batch_numbers: string[];
  biomass_kg: string;
  wac_per_kg: string;
  estimated_value: string;
}

export interface NavExportPreview {
  delta: string;
  psg: string;
  lines: Array<{
    account_no: string;
    balancing_account_no: string;
    amount: string;
    entry_type: string;
    operating_unit: string;
    psg: string;
  }>;
}

export interface PreCloseCheck {
  code: string;
  label: string;
  status: 'complete' | 'warning' | 'blocked' | 'pending' | 'ready';
  blocking: boolean;
  message: string;
}

export interface PreCloseSummary {
  period: string;
  budget: {
    budget_id: number | null;
    name: string | null;
    version: number | null;
    status: string | null;
  };
  biology: {
    row_count: number;
    source: string;
    snapshot_date: string;
    latest_recorded_at: string | null;
    missing_cost_projects: Array<{
      batch_id: number;
      batch_number: string;
      container_id: number;
      container_name: string;
    }>;
  };
  latest_import: {
    import_batch_id: number;
    source_filename: string;
    imported_row_count: number;
    total_amount: string;
    created_at: string;
    uploaded_by_username: string | null;
  } | null;
  latest_preview_run: {
    run_id: number;
    version: number;
    status: string;
    run_timestamp: string;
    completed_at: string | null;
    delta: string | null;
    closing_value_total: string | null;
  } | null;
  latest_approved_run: {
    run_id: number;
    version: number;
    status: string;
    run_timestamp: string;
    completed_at: string | null;
    delta: string | null;
    closing_value_total: string | null;
  } | null;
  current_lock: {
    period_lock_id: number | null;
    is_locked: boolean;
    version: number | null;
    locked_at: string | null;
    locked_by_username: string | null;
    reopened_at: string | null;
    reopened_by_username: string | null;
    lock_reason: string;
    reopen_reason: string;
  };
  checks: PreCloseCheck[];
  actions: {
    can_import: boolean;
    can_allocate: boolean;
    can_valuate: boolean;
    can_lock: boolean;
    can_unlock: boolean;
  };
}

export interface FinanceCoreMutationError extends Error {
  payload?: any;
}

const FINANCE_CORE_STALE_MS = 10_000;

function financeCoreUrl(path: string, query?: Record<string, string | number | undefined>) {
  const url = new URL(`${OpenAPI.BASE}${path}`, window.location.origin);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.pathname + url.search;
}

async function fetchFinanceCoreJson<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
  const response = await authenticatedFetch(financeCoreUrl(path, query));
  if (!response.ok) {
    throw new Error(`Finance core request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.body?.detail || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

function showSuccess(title: string, description?: string) {
  toast({
    title,
    description,
  });
}

function showError(description: string) {
  toast({
    title: 'Finance Core Error',
    description,
  });
}

function createMutationError(message: string, payload?: any): FinanceCoreMutationError {
  const error = new Error(message) as FinanceCoreMutationError;
  error.payload = payload;
  return error;
}

export function useFinanceCompanies() {
  return useQuery({
    queryKey: ['finance-core', 'companies'],
    queryFn: async (): Promise<CompanyDimension[]> => {
      const data = await ApiService.apiV1FinanceCoreCompaniesList();
      return data.results || [];
    },
    staleTime: FINANCE_CORE_STALE_MS,
  });
}

export function useOperatingUnits(companyId?: number) {
  return useQuery({
    queryKey: ['finance-core', 'operating-units', companyId],
    queryFn: async (): Promise<SiteDimension[]> => {
      const data = await ApiService.apiV1FinanceCoreOperatingUnitsList(
        companyId,
        'site_name',
      );
      return data.results || [];
    },
    enabled: !!companyId,
    staleTime: FINANCE_CORE_STALE_MS,
  });
}

export function useAccountGroups(accountType?: string | null) {
  return useQuery({
    queryKey: ['finance-core', 'account-groups', accountType],
    queryFn: async (): Promise<AccountGroup[]> => {
      const data = await ApiService.apiV1FinanceCoreAccountGroupsList(
        accountType as any,
        true,
        'code',
      );
      return data.results || [];
    },
    staleTime: FINANCE_CORE_STALE_MS,
  });
}

export function useAccounts(accountType?: string | null) {
  return useQuery({
    queryKey: ['finance-core', 'accounts', accountType],
    queryFn: async (): Promise<Account[]> => {
      const data = await ApiService.apiV1FinanceCoreAccountsList(
        accountType as any,
        undefined,
        true,
        'code',
      );
      return data.results || [];
    },
    staleTime: FINANCE_CORE_STALE_MS,
  });
}

export function useCostCenters(companyId?: number) {
  return useQuery({
    queryKey: ['finance-core', 'cost-centers', companyId],
    queryFn: async (): Promise<CostCenter[]> => {
      const data = await ApiService.apiV1FinanceCoreCostCentersList(
        companyId,
        undefined,
        true,
        'code',
      );
      return data.results || [];
    },
    enabled: !!companyId,
    staleTime: FINANCE_CORE_STALE_MS,
  });
}

export function useAllocationRules() {
  return useQuery({
    queryKey: ['finance-core', 'allocation-rules'],
    queryFn: async (): Promise<AllocationRule[]> => {
      const data = await ApiService.apiV1FinanceCoreAllocationRulesList();
      return data.results || [];
    },
    staleTime: FINANCE_CORE_STALE_MS,
  });
}

export function useBudgets(companyId?: number, fiscalYear?: number) {
  return useQuery({
    queryKey: ['finance-core', 'budgets', companyId, fiscalYear],
    queryFn: async (): Promise<Budget[]> => {
      const data = await ApiService.apiV1FinanceCoreBudgetsList(
        companyId,
        fiscalYear,
        '-fiscal_year',
      );
      return data.results || [];
    },
    enabled: !!companyId && !!fiscalYear,
    staleTime: FINANCE_CORE_STALE_MS,
  });
}

export function useBudgetEntries(budgetId?: number) {
  return useQuery({
    queryKey: ['finance-core', 'budget-entries', budgetId],
    queryFn: async (): Promise<BudgetEntry[]> => {
      const data = await ApiService.apiV1FinanceCoreBudgetEntriesList(
        undefined,
        budgetId,
      );
      return data.results || [];
    },
    enabled: !!budgetId,
    staleTime: FINANCE_CORE_STALE_MS,
  });
}

export function useCostImports(year?: number, month?: number) {
  return useQuery({
    queryKey: ['finance-core', 'cost-imports', year, month],
    queryFn: async () => {
      const data = await ApiService.apiV1FinanceCoreCostImportsList(
        month,
        '-created_at',
        undefined,
        year,
      );
      return data.results || [];
    },
    enabled: !!year && !!month,
    staleTime: FINANCE_CORE_STALE_MS,
    refetchOnWindowFocus: true,
  });
}

export function usePeriodLocks(companyId?: number, year?: number, month?: number) {
  return useQuery({
    queryKey: ['finance-core', 'period-locks', companyId, year, month],
    queryFn: async (): Promise<PeriodLock[]> => {
      const data = await ApiService.apiV1FinanceCorePeriodsList(
        companyId,
        undefined,
        month,
        undefined,
        '-year',
        undefined,
        year,
      );
      return data.results || [];
    },
    enabled: !!companyId && !!year && !!month,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useValuationRuns(companyId?: number, operatingUnitId?: number, year?: number, month?: number) {
  return useQuery({
    queryKey: ['finance-core', 'valuation-runs', companyId, operatingUnitId, year, month],
    queryFn: async (): Promise<ValuationRun[]> => {
      const data = await ApiService.apiV1FinanceCoreValuationRunsList(
        undefined,
        companyId,
        month,
        operatingUnitId,
        '-version',
        undefined,
        undefined,
        year,
      );
      return data.results || [];
    },
    enabled: !!companyId && !!operatingUnitId && !!year && !!month,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useMovementReport(
  companyId?: number,
  year?: number,
  month?: number,
  runId?: number
) {
  return useQuery({
    queryKey: ['finance-core', 'movement-report', companyId, year, month, runId],
    queryFn: () =>
      fetchFinanceCoreJson<MovementReportRow[]>(
        '/api/v1/finance-core/reports/movement/',
        { company: companyId, year, month, run_id: runId }
      ),
    enabled: !!companyId && !!year && !!month,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useRingValuation(runId?: number) {
  return useQuery({
    queryKey: ['finance-core', 'ring-valuation', runId],
    queryFn: () =>
      fetchFinanceCoreJson<RingValuationRow[]>(
        '/api/v1/finance-core/reports/ring-valuation/',
        { run_id: runId }
      ),
    enabled: !!runId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useNavExportPreview(runId?: number) {
  return useQuery({
    queryKey: ['finance-core', 'nav-export-preview', runId],
    queryFn: () =>
      fetchFinanceCoreJson<NavExportPreview>(
        '/api/v1/finance-core/reports/nav-export-preview/',
        { run_id: runId, format: 'json' }
      ),
    enabled: !!runId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function usePreCloseSummary(
  companyId?: number,
  operatingUnitId?: number,
  year?: number,
  month?: number,
  budgetId?: number
) {
  return useQuery({
    queryKey: ['finance-core', 'pre-close-summary', companyId, operatingUnitId, year, month, budgetId],
    queryFn: () =>
      fetchFinanceCoreJson<PreCloseSummary>(
        '/api/v1/finance-core/reports/pre-close-summary/',
        {
          company: companyId,
          operating_unit: operatingUnitId,
          year,
          month,
          budget: budgetId,
        }
      ),
    enabled: !!companyId && !!operatingUnitId && !!year && !!month,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

function invalidateFinanceCore(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['finance-core'] });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Budget>) =>
      ApiService.apiV1FinanceCoreBudgetsCreate(payload as Budget),
    onSuccess: (data) => {
      showSuccess(
        'Budget created',
        `${data.name} for ${data.fiscal_year} is ready.`
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useCopyBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ budgetId, payload }: { budgetId: number; payload: BudgetCopy }) =>
      ApiService.apiV1FinanceCoreBudgetsCopyCreate(budgetId, payload),
    onSuccess: (data) => {
      showSuccess(
        'Budget copied',
        `${data.name} v${data.version} created for ${data.fiscal_year}.`
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useCreateAccountGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AccountGroup>) =>
      ApiService.apiV1FinanceCoreAccountGroupsCreate(payload as AccountGroup),
    onSuccess: (data) => {
      showSuccess('Account group created', `${data.code} is now available.`);
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Account>) =>
      ApiService.apiV1FinanceCoreAccountsCreate(payload as Account),
    onSuccess: (data) => {
      showSuccess('Account created', `${data.code} is now available.`);
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useCreateCostCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CostCenter>) =>
      ApiService.apiV1FinanceCoreCostCentersCreate(payload as CostCenter),
    onSuccess: (data) => {
      showSuccess('Cost center created', `${data.code} is linked for planning.`);
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useCreateAllocationRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AllocationRule>) =>
      ApiService.apiV1FinanceCoreAllocationRulesCreate(payload as AllocationRule),
    onSuccess: (data) => {
      showSuccess('Allocation rule created', `${data.name} is active.`);
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useBulkImportBudgetEntries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BudgetEntryBulkImport) =>
      ApiService.apiV1FinanceCoreBudgetEntriesBulkImportCreate(payload as any),
    onSuccess: () => {
      showSuccess(
        'Budget entries saved',
        'Budget grid changes were persisted successfully.'
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useDeleteBudgetEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: number) =>
      ApiService.apiV1FinanceCoreBudgetEntriesDestroy(entryId),
    onSuccess: () => {
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useUploadCostImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      year,
      month,
      file,
    }: {
      year: number;
      month: number;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append('year', String(year));
      formData.append('month', String(month));
      formData.append('file', file);
      const response = await authenticatedFetch(
        financeCoreUrl('/api/v1/finance-core/cost-imports/'),
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.detail ||
          payload?.rows?.[0]?.error ||
          `Upload failed (${response.status})`;
        throw createMutationError(message, payload);
      }
      return response.json();
    },
    onSuccess: (data) => {
      showSuccess(
        'NAV cost import uploaded',
        `${data.source_filename} added ${data.imported_row_count} rows for ${data.year}-${String(data.month).padStart(2, '0')}.`
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useAllocateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ budgetId, payload }: { budgetId: number; payload: BudgetAllocate }) =>
      ApiService.apiV1FinanceCoreBudgetsAllocateCreate(budgetId, payload),
    onSuccess: (data) => {
      showSuccess(
        'Allocation preview generated',
        `Preview run v${data.version} created for ${data.year}-${String(data.month).padStart(2, '0')}.`
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useCreateValuationRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ budgetId, payload }: { budgetId: number; payload: ValuationRunRequest }) =>
      ApiService.apiV1FinanceCoreBudgetsValuationRunCreate(budgetId, payload),
    onSuccess: (data) => {
      showSuccess(
        'Valuation run completed',
        `Approved run v${data.version} closed at ${data.totals_snapshot?.closing_value_total || '0.00'}.`
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useLockPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PeriodLockAction) =>
      ApiService.apiV1FinanceCorePeriodsLockCreate(payload),
    onSuccess: (data) => {
      showSuccess(
        'Period locked',
        `${data.operating_unit_name} is locked for ${data.year}-${String(data.month).padStart(2, '0')} (v${data.version}).`
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useUnlockPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ periodLockId, payload }: { periodLockId: number; payload: PeriodUnlock }) =>
      ApiService.apiV1FinanceCorePeriodsUnlockCreate(periodLockId, payload),
    onSuccess: (data) => {
      showSuccess(
        'Period reopened',
        `${data.operating_unit_name} reopened at version ${data.version}.`
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

// ---------------------------------------------------------------------------
// Sea farming specific hooks
// ---------------------------------------------------------------------------

export interface FallowBucketRow {
  bucket_id: number;
  site_name: string;
  year: number;
  month: number;
  cost_group_code: string;
  amount: string;
  released: boolean;
  released_in_run: number | null;
}

export interface FallowBucketsResponse {
  buckets: FallowBucketRow[];
  unreleased_summary: {
    total: string;
    by_cost_group: Array<{ cost_group_code: string; amount: string }>;
    bucket_ids: number[];
  };
}

export interface SeaInputOverview {
  site: string;
  year: number;
  month: number;
  active_projects: Array<{ cost_center_id: number; code: string; name: string }>;
  imported_cost_lines: Array<{ cost_group_code: string; amount: string; operating_unit_name: string }>;
  fallow_pending: {
    total: string;
    by_cost_group: Array<{ cost_group_code: string; amount: string }>;
  };
}

export function useFallowBuckets(siteId?: number, year?: number) {
  return useQuery({
    queryKey: ['finance-core', 'fallow-buckets', siteId, year],
    queryFn: () =>
      fetchFinanceCoreJson<FallowBucketsResponse>(
        '/api/v1/finance-core/reports/fallow-buckets/',
        { site: siteId, year, released: 'false' as any }
      ),
    enabled: !!siteId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useSeaInputOverview(
  companyId?: number,
  operatingUnitId?: number,
  year?: number,
  month?: number
) {
  return useQuery({
    queryKey: ['finance-core', 'sea-input-overview', companyId, operatingUnitId, year, month],
    queryFn: () =>
      fetchFinanceCoreJson<SeaInputOverview>(
        '/api/v1/finance-core/reports/sea-input-overview/',
        { company: companyId, operating_unit: operatingUnitId, year, month }
      ),
    enabled: !!companyId && !!operatingUnitId && !!year && !!month,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useUploadSeaCostImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      budgetId,
      year,
      month,
      file,
    }: {
      budgetId: number;
      year: number;
      month: number;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append('year', String(year));
      formData.append('month', String(month));
      formData.append('file', file);
      const response = await authenticatedFetch(
        financeCoreUrl(`/api/v1/finance-core/budgets/${budgetId}/sea-import/`),
        { method: 'POST', body: formData }
      );
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.detail ||
          payload?.rows?.[0]?.error ||
          `Sea import failed (${response.status})`;
        throw createMutationError(message, payload);
      }
      return response.json();
    },
    onSuccess: (data) => {
      showSuccess(
        'Sea cost import uploaded',
        `Imported ${data.imported_row_count} rows${data.filtered_count ? ` (${data.filtered_count} filtered)` : ''}.`
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

export function useCreateSeaCostProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      site: number;
      insert_year: number;
      batch?: number | null;
      sequence?: number | null;
      activate?: boolean;
    }) => {
      const response = await authenticatedFetch(
        financeCoreUrl('/api/v1/finance-core/cost-centers/create-sea-project/'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errPayload = await response.json().catch(() => null);
        throw createMutationError(
          errPayload?.detail || errPayload?.[0] || `Failed (${response.status})`,
          errPayload
        );
      }
      return response.json();
    },
    onSuccess: (data) => {
      showSuccess(
        'Sea cost project created',
        `Project ${data.code} is now available.`
      );
      invalidateFinanceCore(queryClient);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
}

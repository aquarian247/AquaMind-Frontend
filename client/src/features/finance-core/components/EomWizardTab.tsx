import { useMemo, useState } from 'react';
import type {
  Budget,
  CostImportBatch,
  PeriodLock,
  SiteDimension,
  ValuationRun,
} from '@/api/generated';
import type {
  MovementReportRow,
  NavExportPreview,
  PreCloseSummary,
  RingValuationRow,
} from '../api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ActionResultState {
  kind: 'success' | 'error';
  title: string;
  description: string;
  details?: string[];
}

interface EomWizardTabProps {
  fiscalYear: number;
  month: string;
  onMonthChange: (value: string) => void;
  budgets: Budget[];
  selectedBudgetId?: number;
  operatingUnits: SiteDimension[];
  selectedOperatingUnitId?: number;
  onSelectOperatingUnit: (value: number) => void;
  selectedRunId?: number;
  onSelectRunId: (value: number | undefined) => void;
  costImports: CostImportBatch[];
  periodLocks: PeriodLock[];
  valuationRuns: ValuationRun[];
  movementReport: MovementReportRow[];
  ringValuation: RingValuationRow[];
  navExportPreview?: NavExportPreview;
  preCloseSummary?: PreCloseSummary;
  lastActionResult?: ActionResultState | null;
  onUploadCostImport: (payload: { year: number; month: number; file: File }) => Promise<unknown>;
  onAllocateBudget: (budgetId: number, operatingUnitId: number, month: number) => Promise<unknown>;
  onCreateValuationRun: (
    budgetId: number,
    operatingUnitId: number,
    month: number,
    mortalityAdjustments?: Record<string, string>
  ) => Promise<unknown>;
  onLockPeriod: (payload: {
    company: number;
    operating_unit: number;
    year: number;
    month: number;
    reason: string;
  }) => Promise<unknown>;
  onUnlockPeriod: (periodLockId: number, reason: string) => Promise<unknown>;
  isSubmitting: boolean;
  companyId?: number;
  isAdmin: boolean;
  loadingState: {
    preClose: boolean;
    imports: boolean;
    locks: boolean;
    runs: boolean;
    movement: boolean;
    ring: boolean;
    nav: boolean;
  };
  errorState: {
    preClose?: string;
    imports?: string;
    locks?: string;
    runs?: string;
    movement?: string;
    ring?: string;
    nav?: string;
  };
}

export function EomWizardTab({
  fiscalYear,
  month,
  onMonthChange,
  budgets,
  selectedBudgetId,
  operatingUnits,
  selectedOperatingUnitId,
  onSelectOperatingUnit,
  selectedRunId,
  onSelectRunId,
  costImports,
  periodLocks,
  valuationRuns,
  movementReport,
  ringValuation,
  navExportPreview,
  preCloseSummary,
  lastActionResult,
  onUploadCostImport,
  onAllocateBudget,
  onCreateValuationRun,
  onLockPeriod,
  onUnlockPeriod,
  isSubmitting,
  companyId,
  isAdmin,
  loadingState,
  errorState,
}: EomWizardTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lockReason, setLockReason] = useState('End-of-month close completed');
  const [reopenReason, setReopenReason] = useState('Need to revise month-close data');
  const [impairmentPct, setImpairmentPct] = useState('0');

  const selectedBudget = useMemo(
    () => budgets.find((budget) => budget.budget_id === selectedBudgetId),
    [budgets, selectedBudgetId]
  );
  const selectedRun = useMemo(
    () => valuationRuns.find((run) => run.run_id === selectedRunId) || valuationRuns[0],
    [selectedRunId, valuationRuns]
  );
  const currentLock = preCloseSummary?.current_lock;
  const canUnlock = Boolean(currentLock?.is_locked && currentLock.period_lock_id && isAdmin);

  const impairmentTargets = useMemo(() => {
    const rows =
      (selectedRun?.biology_snapshot as Array<{ cost_center_id?: number }> | undefined) || [];
    return Array.from(
      new Set(
        rows
          .map((row) => row.cost_center_id)
          .filter((value): value is number => typeof value === 'number')
      )
    );
  }, [selectedRun]);

  const summaryChecks = preCloseSummary?.checks || [];

  const statusVariant = (status?: string) => {
    switch (status) {
      case 'complete':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'blocked':
        return 'destructive';
      case 'ready':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const uploadImport = async () => {
    if (!selectedFile) return;
    await onUploadCostImport({
      year: fiscalYear,
      month: Number(month),
      file: selectedFile,
    });
    setSelectedFile(null);
  };

  const previewAllocation = async () => {
    if (!selectedBudgetId || !selectedOperatingUnitId) return;
    await onAllocateBudget(selectedBudgetId, selectedOperatingUnitId, Number(month));
  };

  const runValuation = async () => {
    if (!selectedBudgetId || !selectedOperatingUnitId) {
      if (!selectedBudgetId || !selectedOperatingUnitId) return;
    }
    const mortalityAdjustments =
      Number(impairmentPct) > 0
        ? Object.fromEntries(
            impairmentTargets.map((costCenterId) => [String(costCenterId), impairmentPct])
          )
        : {};
    await onCreateValuationRun(
      selectedBudgetId,
      selectedOperatingUnitId,
      Number(month),
      mortalityAdjustments
    );
  };

  const lockCurrentPeriod = async () => {
    if (!companyId || !selectedOperatingUnitId) return;
    await onLockPeriod({
      company: companyId,
      operating_unit: selectedOperatingUnitId,
      year: fiscalYear,
      month: Number(month),
      reason: lockReason,
    });
  };

  const unlockCurrentPeriod = async () => {
    if (!currentLock?.period_lock_id) return;
    await onUnlockPeriod(currentLock.period_lock_id, reopenReason);
  };

  const renderSectionMessage = (
    loading: boolean,
    error: string | undefined,
    empty: boolean,
    emptyMessage: string,
    colSpan = 4
  ) => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="text-muted-foreground">
            Loading...
          </TableCell>
        </TableRow>
      );
    }
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="text-destructive">
            {error}
          </TableCell>
        </TableRow>
      );
    }
    if (empty) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="text-muted-foreground">
            {emptyMessage}
          </TableCell>
        </TableRow>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pre-Close Checklist</CardTitle>
          <CardDescription>
            Guided readiness checks for the selected site, month, and budget.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {summaryChecks.map((check) => (
              <div
                key={check.code}
                className="rounded-lg border p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium">{check.label}</h3>
                  <Badge variant={statusVariant(check.status) as any}>
                    {check.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{check.message}</p>
              </div>
            ))}
            {summaryChecks.length === 0 && !loadingState.preClose && (
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                No pre-close summary is available yet.
              </div>
            )}
          </div>
          {loadingState.preClose && (
            <p className="text-sm text-muted-foreground">Refreshing pre-close summary...</p>
          )}
          {errorState.preClose && (
            <p className="text-sm text-destructive">{errorState.preClose}</p>
          )}
        </CardContent>
      </Card>

      {lastActionResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>{lastActionResult.title}</CardTitle>
              <Badge
                variant={lastActionResult.kind === 'success' ? 'default' : 'destructive'}
              >
                {lastActionResult.kind.toUpperCase()}
              </Badge>
            </div>
            <CardDescription>{lastActionResult.description}</CardDescription>
          </CardHeader>
          {lastActionResult.details?.length ? (
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {lastActionResult.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </CardContent>
          ) : null}
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>EoM Wizard</CardTitle>
          <CardDescription>
            Upload actual costs, preview allocation, run valuation, export NAV preview,
            and lock the period.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="eom-budget">Budget</Label>
              <Input
                id="eom-budget"
                value={selectedBudget?.name || 'No budget selected'}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eom-site">Operating Unit</Label>
              <select
                id="eom-site"
                className="h-10 rounded-md border border-input bg-background px-3"
                value={selectedOperatingUnitId?.toString() || ''}
                onChange={(e) => onSelectOperatingUnit(Number(e.target.value))}
              >
                <option value="">Select operating unit</option>
                {operatingUnits.map((site) => (
                  <option key={site.site_id} value={site.site_id}>
                    {site.site_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eom-month">Month</Label>
              <Input
                id="eom-month"
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => onMonthChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="impairment">Impairment %</Label>
              <Input
                id="impairment"
                type="number"
                min={0}
                max={100}
                value={impairmentPct}
                onChange={(e) => setImpairmentPct(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Biology Source</h3>
                <Badge variant="outline">
                  {preCloseSummary?.biology.source || 'unknown'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {preCloseSummary?.biology.row_count || 0} rows
              </p>
              <p className="text-xs text-muted-foreground">
                {preCloseSummary?.biology.latest_recorded_at || 'No timestamp available'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Latest Import</h3>
                <Badge variant="outline">
                  {preCloseSummary?.latest_import ? 'READY' : 'MISSING'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {preCloseSummary?.latest_import?.source_filename || 'No import uploaded'}
              </p>
              <p className="text-xs text-muted-foreground">
                {preCloseSummary?.latest_import?.created_at || '—'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Selected Run</h3>
                <Badge variant="outline">
                  {selectedRun ? selectedRun.status : 'NONE'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedRun ? `v${selectedRun.version}` : 'No valuation run selected'}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedRun?.run_timestamp || '—'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Lock State</h3>
                <Badge variant={currentLock?.is_locked ? 'destructive' : 'secondary'}>
                  {currentLock?.is_locked ? 'LOCKED' : 'OPEN'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentLock?.is_locked
                  ? `Version ${currentLock.version}`
                  : 'Period can still be edited'}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentLock?.locked_by_username
                  ? `By ${currentLock.locked_by_username} at ${currentLock.locked_at}`
                  : '—'}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="run-select">Report Run</Label>
            <select
              id="run-select"
              className="h-10 rounded-md border border-input bg-background px-3"
              value={selectedRunId?.toString() || ''}
              onChange={(e) =>
                onSelectRunId(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">Select valuation run</option>
              {valuationRuns.map((run) => (
                <option key={run.run_id} value={run.run_id}>
                  v{run.version} - {run.status} - {run.year}-{String(run.month).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr,auto,auto,auto]">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <Button
              disabled={isSubmitting || !selectedFile || !preCloseSummary?.actions.can_import}
              onClick={uploadImport}
            >
              Upload NAV CSV
            </Button>
            <Button
              variant="outline"
              disabled={
                isSubmitting ||
                !selectedBudgetId ||
                !selectedOperatingUnitId ||
                !preCloseSummary?.actions.can_allocate
              }
              onClick={previewAllocation}
            >
              Allocation Preview
            </Button>
            <Button
              disabled={
                isSubmitting ||
                !selectedBudgetId ||
                !selectedOperatingUnitId ||
                !preCloseSummary?.actions.can_valuate
              }
              onClick={runValuation}
            >
              Run Valuation
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lock-reason">Lock Reason</Label>
            <Input
              id="lock-reason"
              value={lockReason}
              onChange={(e) => setLockReason(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              disabled={
                isSubmitting ||
                !companyId ||
                !selectedOperatingUnitId ||
                !preCloseSummary?.actions.can_lock
              }
              onClick={lockCurrentPeriod}
            >
              Lock Period
            </Button>
            {currentLock?.is_locked && (
              <Input
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="Reason required to reopen period"
                className="max-w-md"
              />
            )}
            {canUnlock && (
              <Button
                variant="outline"
                disabled={isSubmitting || !reopenReason.trim()}
                onClick={unlockCurrentPeriod}
              >
                Reopen Period
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Imports</CardTitle>
            <CardDescription>Uploaded cost files for the selected planning period.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costImports.map((item) => (
                  <TableRow key={item.import_batch_id}>
                    <TableCell>{item.year}-{String(item.month).padStart(2, '0')}</TableCell>
                    <TableCell>{item.source_filename}</TableCell>
                    <TableCell>{item.imported_row_count}</TableCell>
                    <TableCell className="text-right">{item.total_amount}</TableCell>
                  </TableRow>
                ))}
                {renderSectionMessage(
                  loadingState.imports,
                  errorState.imports,
                  costImports.length === 0,
                  'No cost imports uploaded yet.'
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Period Locks</CardTitle>
            <CardDescription>Current lock state for finance-core and biology write protection.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Operating Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periodLocks.map((lock) => (
                  <TableRow key={lock.period_lock_id}>
                    <TableCell>{lock.year}-{String(lock.month).padStart(2, '0')}</TableCell>
                    <TableCell>{lock.operating_unit_name}</TableCell>
                    <TableCell>{lock.is_locked ? 'LOCKED' : 'REOPENED'}</TableCell>
                    <TableCell>{lock.version}</TableCell>
                  </TableRow>
                ))}
                {renderSectionMessage(
                  loadingState.locks,
                  errorState.locks,
                  periodLocks.length === 0,
                  'No locks registered for this period yet.'
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Valuation Runs</CardTitle>
            <CardDescription>Latest preview and approved runs for the selected site/month.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Closing Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {valuationRuns.map((run) => (
                  <TableRow
                    key={run.run_id}
                    className={run.run_id === selectedRunId ? 'bg-muted/40' : ''}
                    onClick={() => onSelectRunId(run.run_id)}
                  >
                    <TableCell>v{run.version}</TableCell>
                    <TableCell>{run.status}</TableCell>
                    <TableCell>{run.year}-{String(run.month).padStart(2, '0')}</TableCell>
                    <TableCell>{run.run_timestamp.slice(0, 19).replace('T', ' ')}</TableCell>
                    <TableCell className="text-right">{run.totals_snapshot?.closing_value_total || '0.00'}</TableCell>
                  </TableRow>
                ))}
                {renderSectionMessage(
                  loadingState.runs,
                  errorState.runs,
                  valuationRuns.length === 0,
                  'No valuation runs generated yet.',
                  5
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NAV Export Preview</CardTitle>
            <CardDescription>Balanced journal lines built from the latest approved valuation run.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Balancing</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {navExportPreview?.lines?.length ? (
                  navExportPreview.lines.map((line) => (
                    <TableRow key={`${line.entry_type}-${line.account_no}`}>
                      <TableCell>{line.entry_type}</TableCell>
                      <TableCell>{line.account_no}</TableCell>
                      <TableCell>{line.balancing_account_no}</TableCell>
                      <TableCell className="text-right">{line.amount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No NAV preview available yet.
                    </TableCell>
                  </TableRow>
                )}
                {loadingState.nav && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      Loading NAV preview...
                    </TableCell>
                  </TableRow>
                )}
                {errorState.nav && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-destructive">
                      {errorState.nav}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Movement Report</CardTitle>
            <CardDescription>Site-level movement of allocated and closing values.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Operating Unit</TableHead>
                  <TableHead className="text-right">Allocated</TableHead>
                  <TableHead className="text-right">Closing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movementReport.map((row) => (
                  <TableRow key={row.run_id}>
                    <TableCell>{row.period}</TableCell>
                    <TableCell>{row.operating_unit}</TableCell>
                    <TableCell className="text-right">{row.allocated_total}</TableCell>
                    <TableCell className="text-right">{row.closing_value_total}</TableCell>
                  </TableRow>
                ))}
                {renderSectionMessage(
                  loadingState.movement,
                  errorState.movement,
                  movementReport.length === 0,
                  'Movement data will appear after the first valuation run.'
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ring Valuation</CardTitle>
            <CardDescription>Container-level closing valuation using the latest WAC values.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cost Center</TableHead>
                  <TableHead className="text-right">Biomass</TableHead>
                  <TableHead className="text-right">WAC / kg</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ringValuation.map((row) => (
                  <TableRow key={`${row.cost_center_code}-${row.batch_numbers.join('-')}`}>
                    <TableCell>{row.cost_center_code}</TableCell>
                    <TableCell className="text-right">{row.biomass_kg}</TableCell>
                    <TableCell className="text-right">{row.wac_per_kg}</TableCell>
                    <TableCell className="text-right">{row.estimated_value}</TableCell>
                  </TableRow>
                ))}
                {renderSectionMessage(
                  loadingState.ring,
                  errorState.ring,
                  ringValuation.length === 0,
                  'Ring valuation becomes available after a valuation run.'
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

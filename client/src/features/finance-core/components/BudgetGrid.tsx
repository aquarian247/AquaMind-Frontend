import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { Account, BudgetEntry, BudgetEntryBulkImport, CostCenter } from '@/api/generated';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type GridRow = {
  rowId: string;
  accountId: number;
  accountLabel: string;
  costCenterId: number;
  costCenterLabel: string;
  entryIds: Record<number, number | null>;
  m1: number | null;
  m2: number | null;
  m3: number | null;
  m4: number | null;
  m5: number | null;
  m6: number | null;
  m7: number | null;
  m8: number | null;
  m9: number | null;
  m10: number | null;
  m11: number | null;
  m12: number | null;
};

interface BudgetGridProps {
  budgetId?: number;
  budgetEntries: BudgetEntry[];
  accounts: Account[];
  costCenters: CostCenter[];
  onBulkImport: (payload: BudgetEntryBulkImport) => Promise<unknown>;
  onDeleteEntries: (entryIds: number[]) => Promise<unknown>;
  isSubmitting: boolean;
}

function arraySignature(values: Array<string | number>) {
  return values.join('|');
}

function budgetEntrySignature(entries: BudgetEntry[]) {
  return entries
    .map((entry) => [
      entry.entry_id,
      entry.account,
      entry.cost_center,
      entry.month,
      entry.amount,
      entry.updated_at,
    ].join(':'))
    .join('|');
}

function accountSignature(accounts: Account[]) {
  return arraySignature(
    accounts.map((account) => `${account.account_id}:${account.code}:${account.updated_at}`)
  );
}

function costCenterSignature(costCenters: CostCenter[]) {
  return arraySignature(
    costCenters.map(
      (costCenter) =>
        `${costCenter.cost_center_id}:${costCenter.code}:${costCenter.updated_at}`
    )
  );
}

const MONTH_COLUMNS = [
  ['m1', 'Jan'],
  ['m2', 'Feb'],
  ['m3', 'Mar'],
  ['m4', 'Apr'],
  ['m5', 'May'],
  ['m6', 'Jun'],
  ['m7', 'Jul'],
  ['m8', 'Aug'],
  ['m9', 'Sep'],
  ['m10', 'Oct'],
  ['m11', 'Nov'],
  ['m12', 'Dec'],
] as const;
type MonthKey = (typeof MONTH_COLUMNS)[number][0];

function emptyGridRow(account: Account, costCenter: CostCenter): GridRow {
  const entryIds = Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => [index + 1, null])
  ) as Record<number, number | null>;
  return {
    rowId: `${account.account_id}-${costCenter.cost_center_id}`,
    accountId: account.account_id,
    accountLabel: `${account.code} - ${account.name}`,
    costCenterId: costCenter.cost_center_id,
    costCenterLabel: `${costCenter.code} - ${costCenter.name}`,
    entryIds,
    m1: null,
    m2: null,
    m3: null,
    m4: null,
    m5: null,
    m6: null,
    m7: null,
    m8: null,
    m9: null,
    m10: null,
    m11: null,
    m12: null,
  };
}

function buildGridRows(
  budgetEntries: BudgetEntry[],
  accounts: Account[],
  costCenters: CostCenter[]
) {
  const accountMap = new Map(accounts.map((account) => [account.account_id, account]));
  const costCenterMap = new Map(
    costCenters.map((costCenter) => [costCenter.cost_center_id, costCenter])
  );
  const rowMap = new Map<string, GridRow>();

  budgetEntries.forEach((entry) => {
    const account = accountMap.get(entry.account);
    const costCenter = costCenterMap.get(entry.cost_center);
    if (!account || !costCenter) return;

    const key = `${account.account_id}-${costCenter.cost_center_id}`;
    const row = rowMap.get(key) || emptyGridRow(account, costCenter);
    const monthKey = `m${entry.month}` as MonthKey;
    row[monthKey] = Number(entry.amount);
    row.entryIds[entry.month] = entry.entry_id;
    rowMap.set(key, row);
  });

  return Array.from(rowMap.values()).sort((left, right) =>
    left.accountLabel.localeCompare(right.accountLabel) ||
    left.costCenterLabel.localeCompare(right.costCenterLabel)
  );
}

function serializeRows(rows: GridRow[]) {
  return JSON.stringify(
    rows.map((row) => ({
      rowId: row.rowId,
      values: MONTH_COLUMNS.map(([key]) => row[key]),
    }))
  );
}

function parseAmount(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function monthValueLabel(value: number | null) {
  return value === null ? '' : value.toString();
}

interface BudgetGridRowProps {
  row: GridRow;
  isSubmitting: boolean;
  onAmountChange: (rowId: string, monthKey: MonthKey, value: string) => void;
  onRemoveRow: (rowId: string) => void;
}

const BudgetGridRow = memo(function BudgetGridRow({
  row,
  isSubmitting,
  onAmountChange,
  onRemoveRow,
}: BudgetGridRowProps) {
  const isPersisted = Object.values(row.entryIds).some(Boolean);

  return (
    <TableRow>
      <TableCell className="min-w-[280px]">
        <div className="flex items-center gap-2">
          <span>{row.accountLabel}</span>
          {!isPersisted && <Badge variant="outline">NEW</Badge>}
        </div>
      </TableCell>
      <TableCell className="min-w-[280px]">{row.costCenterLabel}</TableCell>
      {MONTH_COLUMNS.map(([monthKey]) => (
        <TableCell key={`${row.rowId}-${monthKey}`} className="min-w-[132px]">
          <Input
            type="number"
            step="0.01"
            className="h-10 min-w-[120px] px-3 text-right"
            value={monthValueLabel(row[monthKey])}
            disabled={isSubmitting}
            onChange={(event) =>
              onAmountChange(row.rowId, monthKey, event.target.value)
            }
          />
        </TableCell>
      ))}
      <TableCell className="w-[84px]">
        <Button
          variant="ghost"
          size="sm"
          disabled={isSubmitting}
          onClick={() => onRemoveRow(row.rowId)}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
});

const BudgetGridComponent = ({
  budgetId,
  budgetEntries,
  accounts,
  costCenters,
  onBulkImport,
  onDeleteEntries,
  isSubmitting,
}: BudgetGridProps) => {
  const baseRows = useMemo(
    () => buildGridRows(budgetEntries, accounts, costCenters),
    [budgetEntries, accounts, costCenters]
  );
  const baseSnapshot = useMemo(() => serializeRows(baseRows), [baseRows]);
  const [rows, setRows] = useState<GridRow[]>(baseRows);
  const [savedSnapshot, setSavedSnapshot] = useState(baseSnapshot);
  const [removedEntryIds, setRemovedEntryIds] = useState<number[]>([]);
  const [newAccountId, setNewAccountId] = useState('');
  const [newCostCenterId, setNewCostCenterId] = useState('');
  const currentSnapshot = useMemo(() => serializeRows(rows), [rows]);
  const hasChanges = currentSnapshot !== savedSnapshot || removedEntryIds.length > 0;

  useEffect(() => {
    setRows(baseRows);
    setSavedSnapshot(baseSnapshot);
    setRemovedEntryIds([]);
  }, [budgetId, baseRows, baseSnapshot]);

  const addRow = () => {
    const account = accounts.find(
      (candidate) => candidate.account_id === Number(newAccountId)
    );
    const costCenter = costCenters.find(
      (candidate) => candidate.cost_center_id === Number(newCostCenterId)
    );
    if (!account || !costCenter) return;

    const candidate = emptyGridRow(account, costCenter);
    if (rows.some((row) => row.rowId === candidate.rowId)) {
      return;
    }

    setRows((current) =>
      [...current, candidate].sort((left, right) =>
        left.accountLabel.localeCompare(right.accountLabel) ||
        left.costCenterLabel.localeCompare(right.costCenterLabel)
      )
    );
    setNewAccountId('');
    setNewCostCenterId('');
  };

  const onAmountChange = useCallback(
    (rowId: string, monthKey: MonthKey, value: string) => {
      setRows((current) =>
        current.map((row) =>
          row.rowId === rowId ? { ...row, [monthKey]: parseAmount(value) } : row
        )
      );
    },
    []
  );

  const onRemoveRow = useCallback((rowId: string) => {
    setRows((current) => {
      const rowToRemove = current.find((row) => row.rowId === rowId);
      if (!rowToRemove) {
        return current;
      }

      const persistedIds = Object.values(rowToRemove.entryIds).filter(
        (entryId): entryId is number => typeof entryId === 'number'
      );
      if (persistedIds.length > 0) {
        setRemovedEntryIds((previous) =>
          Array.from(new Set([...previous, ...persistedIds]))
        );
      }

      return current.filter((row) => row.rowId !== rowId);
    });
  }, []);

  const resetChanges = () => {
    setRows(baseRows);
    setSavedSnapshot(baseSnapshot);
    setRemovedEntryIds([]);
  };

  const saveChanges = async () => {
    if (!budgetId) return;

    const upsertRows: BudgetEntryBulkImport['rows'] = [];
    const deleteIds: number[] = [...removedEntryIds];

    rows.forEach((row) => {
      MONTH_COLUMNS.forEach(([key], index) => {
        const month = index + 1;
        const amount = row[key];
        const entryId = row.entryIds[month];
        if (amount === null || amount === undefined || Number.isNaN(amount)) {
          if (entryId) {
            deleteIds.push(entryId);
          }
          return;
        }

        upsertRows.push({
          month,
          account: row.accountId,
          cost_center: row.costCenterId,
          amount: amount.toFixed(2),
          notes: '',
        });
      });
    });

    if (upsertRows.length > 0) {
      await onBulkImport({
        budget: budgetId,
        rows: upsertRows,
      });
    }
    if (deleteIds.length > 0) {
      await onDeleteEntries(Array.from(new Set(deleteIds)));
    }
    setSavedSnapshot(currentSnapshot);
    setRemovedEntryIds([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-4 lg:flex-row lg:items-end">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="grid-account">Add Budget Row</Label>
          <select
            id="grid-account"
            className="h-10 rounded-md border border-input bg-background px-3"
            value={newAccountId}
            onChange={(e) => setNewAccountId(e.target.value)}
          >
            <option value="">Choose account</option>
            {accounts.map((account) => (
              <option key={account.account_id} value={account.account_id}>
                {account.code} - {account.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid flex-1 gap-2">
          <Label htmlFor="grid-cost-center">Cost Center</Label>
          <select
            id="grid-cost-center"
            className="h-10 rounded-md border border-input bg-background px-3"
            value={newCostCenterId}
            onChange={(e) => setNewCostCenterId(e.target.value)}
          >
            <option value="">Choose cost center</option>
            {costCenters.map((costCenter) => (
              <option key={costCenter.cost_center_id} value={costCenter.cost_center_id}>
                {costCenter.code} - {costCenter.name}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="outline"
          disabled={isSubmitting || !newAccountId || !newCostCenterId}
          onClick={addRow}
        >
          Add Row
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium">Monthly Budget Grid</h3>
          <Badge variant={hasChanges ? 'default' : 'secondary'}>
            {hasChanges ? 'Unsaved changes' : 'Saved'}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isSubmitting || !hasChanges}
            onClick={resetChanges}
          >
            Reset
          </Button>
          <Button
            disabled={isSubmitting || !budgetId || !hasChanges}
            onClick={saveChanges}
          >
            Save Grid Changes
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-[2200px]">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[280px]">Account</TableHead>
              <TableHead className="min-w-[280px]">Cost Center</TableHead>
              {MONTH_COLUMNS.map(([, title]) => (
                <TableHead key={title} className="min-w-[132px] text-right">
                  {title}
                </TableHead>
              ))}
              <TableHead className="w-[84px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <BudgetGridRow
                key={row.rowId}
                row={row}
                isSubmitting={isSubmitting}
                onAmountChange={onAmountChange}
                onRemoveRow={onRemoveRow}
              />
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={MONTH_COLUMNS.length + 3}
                  className="text-muted-foreground"
                >
                  No budget rows yet. Add an account/cost center row to start entering
                  monthly values.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

function areBudgetGridPropsEqual(
  previous: BudgetGridProps,
  next: BudgetGridProps
) {
  return (
    previous.budgetId === next.budgetId &&
    previous.isSubmitting === next.isSubmitting &&
    budgetEntrySignature(previous.budgetEntries) ===
      budgetEntrySignature(next.budgetEntries) &&
    accountSignature(previous.accounts) === accountSignature(next.accounts) &&
    costCenterSignature(previous.costCenters) ===
      costCenterSignature(next.costCenters)
  );
}

export const BudgetGrid = memo(BudgetGridComponent, areBudgetGridPropsEqual);

export default BudgetGrid;

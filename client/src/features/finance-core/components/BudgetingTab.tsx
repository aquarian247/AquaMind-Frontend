import { useMemo, useState } from 'react';
import type { Account, Budget, BudgetEntry, BudgetEntryBulkImport, BudgetCopy, CostCenter } from '@/api/generated';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BudgetGrid } from './BudgetGrid';

interface BudgetingTabProps {
  companyId?: number;
  fiscalYear: number;
  budgets: Budget[];
  budgetEntries: BudgetEntry[];
  accounts: Account[];
  costCenters: CostCenter[];
  selectedBudgetId?: number;
  onSelectBudget: (budgetId: number) => void;
  onCreateBudget: (payload: Partial<Budget>) => Promise<unknown>;
  onCopyBudget: (budgetId: number, payload: BudgetCopy) => Promise<unknown>;
  onBulkImportBudgetEntries: (payload: BudgetEntryBulkImport) => Promise<unknown>;
  onDeleteBudgetEntries: (entryIds: number[]) => Promise<unknown>;
  isSubmitting: boolean;
}

export function BudgetingTab({
  companyId,
  fiscalYear,
  budgets,
  budgetEntries,
  accounts,
  costCenters,
  selectedBudgetId,
  onSelectBudget,
  onCreateBudget,
  onCopyBudget,
  onBulkImportBudgetEntries,
  onDeleteBudgetEntries,
  isSubmitting,
}: BudgetingTabProps) {
  const [budgetForm, setBudgetForm] = useState({ name: 'Base Budget', status: 'ACTIVE' });
  const [copyYear, setCopyYear] = useState(String(fiscalYear + 1));

  const selectedBudget = useMemo(
    () => budgets.find((budget) => budget.budget_id === selectedBudgetId),
    [budgets, selectedBudgetId]
  );

  const createBudget = async () => {
    if (!companyId) return;
    await onCreateBudget({
      company: companyId,
      name: budgetForm.name,
      fiscal_year: fiscalYear,
      status: budgetForm.status as Budget['status'],
      version: 1,
      notes: '',
    });
  };

  const copyBudget = async () => {
    if (!selectedBudgetId) return;
    await onCopyBudget(selectedBudgetId, {
      target_year: Number(copyYear),
      new_name: `${selectedBudget?.name || 'Budget'} ${copyYear}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Budget Controls</CardTitle>
            <CardDescription>Create annual budgets and copy them forward.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="budget-name">Budget Name</Label>
              <Input
                id="budget-name"
                value={budgetForm.name}
                onChange={(e) => setBudgetForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget-status">Status</Label>
              <select
                id="budget-status"
                className="h-10 rounded-md border border-input bg-background px-3"
                value={budgetForm.status}
                onChange={(e) => setBudgetForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="DRAFT">DRAFT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
            <Button disabled={isSubmitting || !companyId || !budgetForm.name} onClick={createBudget}>
              Create Budget
            </Button>

            <div className="border-t pt-4">
              <div className="grid gap-2">
                <Label htmlFor="budget-select">Active Budget</Label>
                <select
                  id="budget-select"
                  className="h-10 rounded-md border border-input bg-background px-3"
                  value={selectedBudgetId?.toString() || ''}
                  onChange={(e) => onSelectBudget(Number(e.target.value))}
                >
                  <option value="">Select budget</option>
                  {budgets.map((budget) => (
                    <option key={budget.budget_id} value={budget.budget_id}>
                      {budget.name} v{budget.version}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="copy-year">Copy To Year</Label>
                <Input
                  id="copy-year"
                  type="number"
                  value={copyYear}
                  onChange={(e) => setCopyYear(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                disabled={isSubmitting || !selectedBudgetId}
                onClick={copyBudget}
              >
                Copy Budget Forward
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Grid</CardTitle>
            <CardDescription>
              {selectedBudget
                ? `${selectedBudget.name} monthly grid for ${fiscalYear}`
                : 'Select a budget to manage spreadsheet entries.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetGrid
              budgetId={selectedBudgetId}
              budgetEntries={budgetEntries}
              accounts={accounts}
              costCenters={costCenters}
              onBulkImport={onBulkImportBudgetEntries}
              onDeleteEntries={onDeleteBudgetEntries}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

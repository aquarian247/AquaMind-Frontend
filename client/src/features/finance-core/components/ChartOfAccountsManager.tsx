import { useState } from 'react';
import type { Account, AccountGroup } from '@/api/generated';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ACCOUNT_TYPES = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] as const;

interface ChartOfAccountsManagerProps {
  accountGroups: AccountGroup[];
  accounts: Account[];
  onCreateAccountGroup: (payload: Partial<AccountGroup>) => Promise<unknown>;
  onCreateAccount: (payload: Partial<Account>) => Promise<unknown>;
  isSubmitting: boolean;
}

export function ChartOfAccountsManager({
  accountGroups,
  accounts,
  onCreateAccountGroup,
  onCreateAccount,
  isSubmitting,
}: ChartOfAccountsManagerProps) {
  const [groupForm, setGroupForm] = useState({
    code: '',
    name: '',
    account_type: 'EXPENSE',
    cost_group: '',
  });
  const [accountForm, setAccountForm] = useState({
    code: '',
    name: '',
    account_type: 'EXPENSE',
    group: '',
  });

  const submitGroup = async () => {
    await onCreateAccountGroup({
      code: groupForm.code,
      name: groupForm.name,
      account_type: groupForm.account_type as AccountGroup['account_type'],
      cost_group: groupForm.cost_group || null,
      is_active: true,
    });
    setGroupForm({ code: '', name: '', account_type: 'EXPENSE', cost_group: '' });
  };

  const submitAccount = async () => {
    await onCreateAccount({
      code: accountForm.code,
      name: accountForm.name,
      account_type: accountForm.account_type as Account['account_type'],
      group: accountForm.group ? Number(accountForm.group) : null,
      is_active: true,
    });
    setAccountForm({ code: '', name: '', account_type: 'EXPENSE', group: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Account Group</CardTitle>
            <CardDescription>Define external cost groups and reporting structure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="group-code">Code</Label>
              <Input
                id="group-code"
                value={groupForm.code}
                onChange={(e) => setGroupForm((prev) => ({ ...prev, code: e.target.value }))}
                placeholder="OPEX"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group-name">Name</Label>
              <Input
                id="group-name"
                value={groupForm.name}
                onChange={(e) => setGroupForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Operating Expenses"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group-type">Account Type</Label>
              <select
                id="group-type"
                className="h-10 rounded-md border border-input bg-background px-3"
                value={groupForm.account_type}
                onChange={(e) => setGroupForm((prev) => ({ ...prev, account_type: e.target.value }))}
              >
                {ACCOUNT_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group-cost-code">Import Cost Group</Label>
              <Input
                id="group-cost-code"
                value={groupForm.cost_group}
                onChange={(e) => setGroupForm((prev) => ({ ...prev, cost_group: e.target.value }))}
                placeholder="OPEX"
              />
            </div>
            <Button
              disabled={isSubmitting || !groupForm.code || !groupForm.name}
              onClick={submitGroup}
            >
              Add Account Group
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Account</CardTitle>
            <CardDescription>Create leaf accounts under the finance-core chart.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="account-code">Code</Label>
              <Input
                id="account-code"
                value={accountForm.code}
                onChange={(e) => setAccountForm((prev) => ({ ...prev, code: e.target.value }))}
                placeholder="5100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account-name">Name</Label>
              <Input
                id="account-name"
                value={accountForm.name}
                onChange={(e) => setAccountForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Station Costs"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account-type">Account Type</Label>
              <select
                id="account-type"
                className="h-10 rounded-md border border-input bg-background px-3"
                value={accountForm.account_type}
                onChange={(e) => setAccountForm((prev) => ({ ...prev, account_type: e.target.value }))}
              >
                {ACCOUNT_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account-group">Group</Label>
              <select
                id="account-group"
                className="h-10 rounded-md border border-input bg-background px-3"
                value={accountForm.group}
                onChange={(e) => setAccountForm((prev) => ({ ...prev, group: e.target.value }))}
              >
                <option value="">Unassigned</option>
                {accountGroups.map((group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.code} - {group.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              disabled={isSubmitting || !accountForm.code || !accountForm.name}
              onClick={submitAccount}
            >
              Add Account
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chart of Accounts</CardTitle>
          <CardDescription>Groups and accounts currently configured for finance-core planning.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Account Groups</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Import Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountGroups.map((group) => (
                  <TableRow key={group.group_id}>
                    <TableCell>{group.code}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.account_type}</TableCell>
                    <TableCell>{group.cost_group || '—'}</TableCell>
                  </TableRow>
                ))}
                {accountGroups.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No account groups configured yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Accounts</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Group</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.account_id}>
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.account_type}</TableCell>
                    <TableCell>{account.group_code || '—'}</TableCell>
                  </TableRow>
                ))}
                {accounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No accounts configured yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

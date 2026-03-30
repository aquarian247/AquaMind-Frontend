import { useState } from 'react';
import type { AccountGroup, AllocationRule, CostCenter, SiteDimension } from '@/api/generated';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const COST_CENTER_TYPES = ['SITE', 'PROJECT', 'DEPARTMENT', 'OTHER'] as const;

interface CostCenterManagerProps {
  companyId?: number;
  sites: SiteDimension[];
  costCenters: CostCenter[];
  allocationRules: AllocationRule[];
  accountGroups: AccountGroup[];
  onCreateCostCenter: (payload: Partial<CostCenter>) => Promise<unknown>;
  onCreateAllocationRule: (payload: Partial<AllocationRule>) => Promise<unknown>;
  onCreateSeaProject?: (payload: {
    site: number;
    insert_year: number;
    batch?: number | null;
    activate?: boolean;
  }) => Promise<unknown>;
  isSubmitting: boolean;
  isFarmingCompany?: boolean;
}

export function CostCenterManager({
  companyId,
  sites,
  costCenters,
  allocationRules,
  accountGroups,
  onCreateCostCenter,
  onCreateAllocationRule,
  onCreateSeaProject,
  isSubmitting,
  isFarmingCompany,
}: CostCenterManagerProps) {
  const [costCenterForm, setCostCenterForm] = useState({
    code: '',
    name: '',
    site: '',
    cost_center_type: 'PROJECT',
  });
  const [seaProjectForm, setSeaProjectForm] = useState({
    site: '',
    insert_year: String(new Date().getFullYear()),
  });
  const [ruleForm, setRuleForm] = useState({
    name: '',
    account_group: '',
    cost_center: '',
    effective_from: new Date().toISOString().slice(0, 10),
    headcount: '0.50',
    biomass: '0.50',
    fallback: 'equal_split',
  });

  const submitCostCenter = async () => {
    if (!companyId) return;
    await onCreateCostCenter({
      company: companyId,
      code: costCenterForm.code,
      name: costCenterForm.name,
      site: costCenterForm.site ? Number(costCenterForm.site) : null,
      cost_center_type: costCenterForm.cost_center_type as CostCenter['cost_center_type'],
      is_active: true,
    });
    setCostCenterForm({ code: '', name: '', site: '', cost_center_type: 'PROJECT' });
  };

  const submitRule = async () => {
    await onCreateAllocationRule({
      name: ruleForm.name,
      account_group: ruleForm.account_group ? Number(ruleForm.account_group) : null,
      cost_center: ruleForm.cost_center ? Number(ruleForm.cost_center) : null,
      effective_from: ruleForm.effective_from,
      rule_definition: {
        mode: 'weighted',
        weights: {
          headcount: Number(ruleForm.headcount),
          biomass: Number(ruleForm.biomass),
        },
        fallback: ruleForm.fallback,
      },
      is_active: true,
    });
    setRuleForm({
      name: '',
      account_group: '',
      cost_center: '',
      effective_from: new Date().toISOString().slice(0, 10),
      headcount: '0.50',
      biomass: '0.50',
      fallback: 'equal_split',
    });
  };

  const submitSeaProject = async () => {
    if (!onCreateSeaProject || !seaProjectForm.site) return;
    await onCreateSeaProject({
      site: Number(seaProjectForm.site),
      insert_year: Number(seaProjectForm.insert_year),
      activate: true,
    });
    setSeaProjectForm({ site: '', insert_year: String(new Date().getFullYear()) });
  };

  const activeSeaProjects = costCenters.filter(
    (cc) => cc.cost_center_type === 'PROJECT' && cc.is_active
  );

  return (
    <div className="space-y-6">
      {isFarmingCompany && onCreateSeaProject && (
        <Card>
          <CardHeader>
            <CardTitle>Create Sea Cost Project</CardTitle>
            <CardDescription>
              Create a cost project following the Bakkafrost naming convention
              (e.g. A15-25-01). One active project per site is enforced.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="sea-site">Sea Site</Label>
                <select
                  id="sea-site"
                  className="h-10 rounded-md border border-input bg-background px-3"
                  value={seaProjectForm.site}
                  onChange={(e) =>
                    setSeaProjectForm((prev) => ({ ...prev, site: e.target.value }))
                  }
                >
                  <option value="">Select sea site</option>
                  {sites.map((site) => (
                    <option key={site.site_id} value={site.site_id}>
                      {site.site_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sea-insert-year">Insert Year</Label>
                <Input
                  id="sea-insert-year"
                  type="number"
                  value={seaProjectForm.insert_year}
                  onChange={(e) =>
                    setSeaProjectForm((prev) => ({ ...prev, insert_year: e.target.value }))
                  }
                />
              </div>
            </div>
            {activeSeaProjects.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Active projects: {activeSeaProjects.map((p) => p.code).join(', ')}
              </p>
            )}
            <Button
              disabled={isSubmitting || !seaProjectForm.site}
              onClick={submitSeaProject}
            >
              Create Sea Project
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Cost Center</CardTitle>
            <CardDescription>Create site or project structures for allocation targets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cc-code">Code</Label>
              <Input
                id="cc-code"
                value={costCenterForm.code}
                onChange={(e) => setCostCenterForm((prev) => ({ ...prev, code: e.target.value }))}
                placeholder="PRJ-101"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cc-name">Name</Label>
              <Input
                id="cc-name"
                value={costCenterForm.name}
                onChange={(e) => setCostCenterForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Smolt Project 101"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cc-site">Operating Unit</Label>
              <select
                id="cc-site"
                className="h-10 rounded-md border border-input bg-background px-3"
                value={costCenterForm.site}
                onChange={(e) => setCostCenterForm((prev) => ({ ...prev, site: e.target.value }))}
              >
                <option value="">No site</option>
                {sites.map((site) => (
                  <option key={site.site_id} value={site.site_id}>
                    {site.site_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cc-type">Type</Label>
              <select
                id="cc-type"
                className="h-10 rounded-md border border-input bg-background px-3"
                value={costCenterForm.cost_center_type}
                onChange={(e) => setCostCenterForm((prev) => ({ ...prev, cost_center_type: e.target.value }))}
              >
                {COST_CENTER_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <Button
              disabled={isSubmitting || !companyId || !costCenterForm.code || !costCenterForm.name}
              onClick={submitCostCenter}
            >
              Add Cost Center
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Allocation Rule</CardTitle>
            <CardDescription>Override the default 50/50 headcount and biomass allocation logic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={ruleForm.name}
                onChange={(e) => setRuleForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Smolt Weighted Rule"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-group">Account Group</Label>
              <select
                id="rule-group"
                className="h-10 rounded-md border border-input bg-background px-3"
                value={ruleForm.account_group}
                onChange={(e) => setRuleForm((prev) => ({ ...prev, account_group: e.target.value }))}
              >
                <option value="">No group</option>
                {accountGroups.map((group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-center">Cost Center Override</Label>
              <select
                id="rule-center"
                className="h-10 rounded-md border border-input bg-background px-3"
                value={ruleForm.cost_center}
                onChange={(e) => setRuleForm((prev) => ({ ...prev, cost_center: e.target.value }))}
              >
                <option value="">No override</option>
                {costCenters.map((costCenter) => (
                  <option key={costCenter.cost_center_id} value={costCenter.cost_center_id}>
                    {costCenter.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="rule-headcount">Headcount Weight</Label>
                <Input
                  id="rule-headcount"
                  value={ruleForm.headcount}
                  onChange={(e) => setRuleForm((prev) => ({ ...prev, headcount: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rule-biomass">Biomass Weight</Label>
                <Input
                  id="rule-biomass"
                  value={ruleForm.biomass}
                  onChange={(e) => setRuleForm((prev) => ({ ...prev, biomass: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-effective">Effective From</Label>
              <Input
                id="rule-effective"
                type="date"
                value={ruleForm.effective_from}
                onChange={(e) => setRuleForm((prev) => ({ ...prev, effective_from: e.target.value }))}
              />
            </div>
            <Button
              disabled={isSubmitting || !ruleForm.name}
              onClick={submitRule}
            >
              Add Rule
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configured Cost Centers</CardTitle>
          <CardDescription>Project hierarchy and linked biological batches.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Operating Unit</TableHead>
                <TableHead>Batch Links</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costCenters.map((costCenter) => (
                <TableRow key={costCenter.cost_center_id}>
                  <TableCell>{costCenter.code}</TableCell>
                  <TableCell>{costCenter.name}</TableCell>
                  <TableCell>{costCenter.cost_center_type}</TableCell>
                  <TableCell>{costCenter.site_summary?.site_name || '—'}</TableCell>
                  <TableCell>
                    {costCenter.batch_links?.map((link) => link.batch_number).join(', ') || '—'}
                  </TableCell>
                </TableRow>
              ))}
              {costCenters.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No cost centers configured yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allocation Rules</CardTitle>
          <CardDescription>Rules currently available for EoM distribution and historical snapshots.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Account Group</TableHead>
                <TableHead>Cost Center</TableHead>
                <TableHead>Effective From</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocationRules.map((rule) => (
                <TableRow key={rule.rule_id}>
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>{rule.account_group_code || '—'}</TableCell>
                  <TableCell>{rule.cost_center_code || '—'}</TableCell>
                  <TableCell>{rule.effective_from}</TableCell>
                </TableRow>
              ))}
              {allocationRules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No allocation rules configured yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

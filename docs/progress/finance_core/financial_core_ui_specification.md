# Financial Core UI Specification

**AquaMind Financial Planning & Budgeting Module - Frontend Implementation Guide**

**Version**: 1.0  
**Date**: October 28, 2025  
**Technology Stack**: React 18 + TypeScript, TanStack Query, Tailwind CSS, Shadcn/ui

---

## Table of Contents

1. [Overview](#overview)
2. [Page Structure](#page-structure)
3. [Component Specifications](#component-specifications)
4. [API Integration](#api-integration)
5. [State Management](#state-management)
6. [User Workflows](#user-workflows)
7. [Responsive Design](#responsive-design)
8. [Testing Strategy](#testing-strategy)

---

## Overview

The Financial Core UI provides a comprehensive interface for managing the Chart of Accounts (CoA), Cost Centers, and monthly budgets in AquaMind. The UI is designed to support both configuration (CoA/Cost Center setup) and data entry (monthly budgeting).

### Key Design Principles

1. **Tabbed Interface**: Separate tabs for Chart of Accounts, Cost Centers, and Budgeting to avoid overwhelming users.
2. **Spreadsheet-Like Data Entry**: Monthly budgeting uses a grid layout similar to Excel for familiar UX.
3. **Warm Earth Theme**: Consistent with the AquaMind prototype (earth tones, organic feel).
4. **Responsive Design**: Works on desktop, tablet, and mobile (though budgeting is optimized for desktop).
5. **API-First**: All data fetching and mutations use the generated API client (TanStack Query).

---

## Page Structure

### Main Page: Financial Planning

**Route**: `/finance/planning`

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Header: "Financial Planning" + Year Selector + Company Filter│
├─────────────────────────────────────────────────────────────┤
│ Tabs: [Chart of Accounts] [Cost Centers] [Budgeting]        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                Tab Content Area                              │
│                (Dynamic based on active tab)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Header Components**:
- **Title**: "Financial Planning"
- **Year Selector**: Dropdown to select fiscal year (default: current year)
- **Company Filter**: Dropdown to filter by company (if user has access to multiple companies)
- **Active Budget Indicator**: Badge showing the active budget for the selected year/company

---

## Component Specifications

### 1. Chart of Accounts Manager

**Tab**: "Chart of Accounts"

**Purpose**: Configure the Chart of Accounts (CoA) with hierarchical grouping.

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ [+ Add Account Group] [+ Add Account] [Search...]           │
├─────────────────────────────────────────────────────────────┤
│ Account Type Filter: [All] [Asset] [Liability] [Equity]    │
│                      [Revenue] [Expense]                     │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Code  │ Name              │ Type     │ Group  │ Status│  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ OPEX  │ Operating Expenses│ EXPENSE  │ -      │ ●    │  │
│ │  └─ FEED │ Feed Costs      │ EXPENSE  │ OPEX   │ ●    │  │
│ │     └─ 5100│ Smolt Feed    │ EXPENSE  │ FEED   │ ●    │  │
│ │     └─ 5110│ Parr Feed     │ EXPENSE  │ FEED   │ ●    │  │
│ │  └─ LABOR│ Labor Costs     │ EXPENSE  │ OPEX   │ ●    │  │
│ │     └─ 5200│ Farm Labor    │ EXPENSE  │ LABOR  │ ●    │  │
│ │ 4000  │ Harvest Revenue   │ REVENUE  │ -      │ ●    │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- **Hierarchical Tree View**: Account groups and accounts displayed in a tree structure (indented).
- **Add Account Group**: Modal dialog with fields (Code, Name, Account Type, Parent Group, Display Order).
- **Add Account**: Modal dialog with fields (Code, Name, Account Type, Group, Description, Is Active).
- **Edit/Delete**: Row actions (pencil icon for edit, trash icon for delete).
- **Search**: Full-text search by code, name, or description.
- **Filter by Account Type**: Buttons to filter by account type (Asset, Liability, Equity, Revenue, Expense).
- **Status Indicator**: Green dot for active, red dot for inactive.

**Component Structure**:
```typescript
// client/src/pages/FinancialPlanningPage.tsx
export const ChartOfAccountsManager: React.FC = () => {
  const [accountType, setAccountType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch account groups and accounts
  const { data: accountGroups } = useQuery({
    queryKey: ['accountGroups', accountType],
    queryFn: () => AccountGroupService.apiV1FinanceCoreAccountGroupsList({ account_type: accountType }),
  });
  
  const { data: accounts } = useQuery({
    queryKey: ['accounts', accountType, searchTerm],
    queryFn: () => AccountService.apiV1FinanceCoreAccountsList({ 
      account_type: accountType,
      search: searchTerm,
      is_active: true
    }),
  });
  
  // Render tree view
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={() => setShowAddGroupModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account Group
          </Button>
          <Button onClick={() => setShowAddAccountModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
        <Input
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
      </div>
      
      <AccountTypeFilter value={accountType} onChange={setAccountType} />
      
      <AccountTreeView groups={accountGroups} accounts={accounts} />
    </div>
  );
};
```

---

### 2. Cost Center Manager

**Tab**: "Cost Centers"

**Purpose**: Configure cost centers for cost allocation.

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ [+ Add Cost Center] [Search...]                             │
├─────────────────────────────────────────────────────────────┤
│ Company Filter: [All Companies] [Bakkafrost P/F] [...]      │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Code      │ Name                    │ Company  │ Status│  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ FARM-01   │ Faroe Islands - Farm 1  │ Bakkafrost│ ●    │  │
│ │ HATCHERY  │ Main Hatchery           │ Bakkafrost│ ●    │  │
│ │ SMOLT-HALL│ Smolt Production Hall   │ Bakkafrost│ ●    │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- **Add Cost Center**: Modal dialog with fields (Code, Name, Company, Description, Is Active).
- **Edit/Delete**: Row actions.
- **Search**: Full-text search by code, name, or description.
- **Filter by Company**: Dropdown to filter by company.
- **Status Indicator**: Green dot for active, red dot for inactive.

**Component Structure**:
```typescript
export const CostCenterManager: React.FC = () => {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: costCenters } = useQuery({
    queryKey: ['costCenters', companyId, searchTerm],
    queryFn: () => CostCenterService.apiV1FinanceCoreCostCentersList({ 
      company: companyId,
      search: searchTerm,
      is_active: true
    }),
  });
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Cost Center
        </Button>
        <Input
          placeholder="Search cost centers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
      </div>
      
      <CompanyFilter value={companyId} onChange={setCompanyId} />
      
      <CostCenterDataTable data={costCenters || []} />
    </div>
  );
};
```

---

### 3. Monthly Budgeting Grid

**Tab**: "Budgeting"

**Purpose**: Enter and edit monthly budget data in a spreadsheet-like interface.

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Budget Selector: [2025 Base Budget ▼] [+ Create Budget] [Copy Budget] [Activate]       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Filters: Account Type [All ▼] Cost Center [All ▼] [+ Add Row]                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│ │ Account      │ Cost Center│ Jan    │ Feb    │ Mar    │ ... │ Dec    │ Total     │  │
│ ├───────────────────────────────────────────────────────────────────────────────────┤  │
│ │ 5100 Smolt   │ FARM-01    │ 50,000 │ 52,000 │ 51,000 │ ... │ 55,000 │ 630,000   │  │
│ │ 5110 Parr    │ FARM-01    │ 30,000 │ 31,000 │ 30,500 │ ... │ 32,000 │ 372,000   │  │
│ │ 5200 Labor   │ FARM-01    │ 80,000 │ 80,000 │ 80,000 │ ... │ 85,000 │ 975,000   │  │
│ │ 4000 Revenue │ FARM-01    │200,000 │210,000 │205,000 │ ... │220,000 │2,550,000  │  │
│ └───────────────────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Summary: Total Revenue: 10,000,000 | Total Expenses: 8,000,000 | Net Income: 2,000,000 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**Features**:
- **Budget Selector**: Dropdown to select active budget or create a new one.
- **Create Budget**: Modal dialog with fields (Name, Year, Company, Scenario, Description).
- **Copy Budget**: Copy existing budget to a new year (uses `/budgets/{id}/copy/` endpoint).
- **Activate Budget**: Set the selected budget as active for the company/year.
- **Spreadsheet Grid**: Editable cells for monthly amounts (Jan-Dec).
- **Add Row**: Add a new budget entry (select Account and Cost Center).
- **Auto-Save**: Debounced auto-save on cell edit (uses PATCH endpoint).
- **Row Totals**: Calculated total for each row (sum of Jan-Dec).
- **Summary Row**: Calculated totals by account type (Revenue, Expenses, Net Income).
- **Filters**: Filter by account type and cost center to reduce grid size.

**Component Structure**:
```typescript
export const MonthlyBudgetingGrid: React.FC = () => {
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const [accountTypeFilter, setAccountTypeFilter] = useState<string | null>(null);
  const [costCenterFilter, setCostCenterFilter] = useState<number | null>(null);
  
  // Fetch budget with entries
  const { data: budget } = useQuery({
    queryKey: ['budget', selectedBudgetId],
    queryFn: () => BudgetService.apiV1FinanceCoreBudgetsRetrieve({ id: selectedBudgetId! }),
    enabled: !!selectedBudgetId,
  });
  
  // Mutation for updating budget entries
  const updateEntryMutation = useMutation({
    mutationFn: (data: { id: number; budgeted_amount: number }) =>
      BudgetEntryService.apiV1FinanceCoreBudgetEntriesPartialUpdate({
        id: data.id,
        budgeted_amount: data.budgeted_amount,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['budget', selectedBudgetId]);
    },
  });
  
  // Handle cell edit with debounce
  const handleCellEdit = useDebouncedCallback((entryId: number, newValue: number) => {
    updateEntryMutation.mutate({ id: entryId, budgeted_amount: newValue });
  }, 500);
  
  return (
    <div className="space-y-4">
      <BudgetSelector
        value={selectedBudgetId}
        onChange={setSelectedBudgetId}
        onCreateBudget={() => setShowCreateBudgetModal(true)}
        onCopyBudget={() => setShowCopyBudgetModal(true)}
      />
      
      <BudgetGridFilters
        accountType={accountTypeFilter}
        costCenter={costCenterFilter}
        onAccountTypeChange={setAccountTypeFilter}
        onCostCenterChange={setCostCenterFilter}
      />
      
      <BudgetDataGrid
        budget={budget}
        onCellEdit={handleCellEdit}
        accountTypeFilter={accountTypeFilter}
        costCenterFilter={costCenterFilter}
      />
      
      <BudgetSummary budget={budget} />
    </div>
  );
};
```

**Grid Implementation** (using `@tanstack/react-table`):
```typescript
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';

interface BudgetEntryRow {
  account_code: string;
  account_name: string;
  cost_center_code: string;
  cost_center_name: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  total: number;
}

const columns: ColumnDef<BudgetEntryRow>[] = [
  {
    accessorKey: 'account_code',
    header: 'Account',
    cell: ({ row }) => `${row.original.account_code} ${row.original.account_name}`,
  },
  {
    accessorKey: 'cost_center_code',
    header: 'Cost Center',
    cell: ({ row }) => row.original.cost_center_code,
  },
  ...['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map((month) => ({
    accessorKey: month,
    header: month.charAt(0).toUpperCase() + month.slice(1),
    cell: ({ row, getValue }) => (
      <EditableCell
        value={getValue() as number}
        onChange={(newValue) => handleCellEdit(row.original[`${month}_entry_id`], newValue)}
      />
    ),
  })),
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
];

export const BudgetDataGrid: React.FC<BudgetDataGridProps> = ({ budget, onCellEdit }) => {
  // Transform budget entries into grid rows
  const rows = transformBudgetEntriesToRows(budget?.entries || []);
  
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border px-2 py-1 bg-muted">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-2 py-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

### 4. Editable Cell Component

**Purpose**: Inline editing for budget amounts in the grid.

**Component**:
```typescript
interface EditableCellProps {
  value: number;
  onChange: (newValue: number) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());
  
  const handleBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(localValue);
    if (!isNaN(numValue) && numValue !== value) {
      onChange(numValue);
    }
  };
  
  if (isEditing) {
    return (
      <input
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        className="w-full px-1 py-0.5 border-none focus:ring-2 focus:ring-primary"
        autoFocus
      />
    );
  }
  
  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-accent px-1 py-0.5"
    >
      {formatCurrency(value)}
    </div>
  );
};
```

---

## API Integration

### Generated API Client

All API calls use the generated TypeScript client from `npm run sync:openapi`.

**Example Services**:
- `AccountGroupService.apiV1FinanceCoreAccountGroupsList()`
- `AccountService.apiV1FinanceCoreAccountsList()`
- `CostCenterService.apiV1FinanceCoreCostCentersList()`
- `BudgetService.apiV1FinanceCoreBudgetsList()`
- `BudgetService.apiV1FinanceCoreBudgetsRetrieve({ id })`
- `BudgetService.apiV1FinanceCoreBudgetsSummaryRetrieve({ id })`
- `BudgetService.apiV1FinanceCoreBudgetsCopyCreate({ id, new_year, new_name })`
- `BudgetEntryService.apiV1FinanceCoreBudgetEntriesBulkCreateCreate({ entries })`

### TanStack Query Hooks

**Custom Hooks**:
```typescript
// client/src/hooks/useAccounts.ts
export const useAccounts = (filters?: { account_type?: string; is_active?: boolean }) => {
  return useQuery({
    queryKey: ['accounts', filters],
    queryFn: () => AccountService.apiV1FinanceCoreAccountsList(filters),
  });
};

// client/src/hooks/useCostCenters.ts
export const useCostCenters = (filters?: { company?: number; is_active?: boolean }) => {
  return useQuery({
    queryKey: ['costCenters', filters],
    queryFn: () => CostCenterService.apiV1FinanceCoreCostCentersList(filters),
  });
};

// client/src/hooks/useBudget.ts
export const useBudget = (budgetId: number | null) => {
  return useQuery({
    queryKey: ['budget', budgetId],
    queryFn: () => BudgetService.apiV1FinanceCoreBudgetsRetrieve({ id: budgetId! }),
    enabled: !!budgetId,
  });
};

// client/src/hooks/useBudgetSummary.ts
export const useBudgetSummary = (budgetId: number | null) => {
  return useQuery({
    queryKey: ['budgetSummary', budgetId],
    queryFn: () => BudgetService.apiV1FinanceCoreBudgetsSummaryRetrieve({ id: budgetId! }),
    enabled: !!budgetId,
  });
};
```

---

## State Management

### Global State (Zustand)

**Store**: `client/src/stores/financePlanningStore.ts`

```typescript
import { create } from 'zustand';

interface FinancePlanningState {
  selectedYear: number;
  selectedCompanyId: number | null;
  selectedBudgetId: number | null;
  activeTab: 'accounts' | 'cost-centers' | 'budgeting';
  setSelectedYear: (year: number) => void;
  setSelectedCompanyId: (companyId: number | null) => void;
  setSelectedBudgetId: (budgetId: number | null) => void;
  setActiveTab: (tab: 'accounts' | 'cost-centers' | 'budgeting') => void;
}

export const useFinancePlanningStore = create<FinancePlanningState>((set) => ({
  selectedYear: new Date().getFullYear(),
  selectedCompanyId: null,
  selectedBudgetId: null,
  activeTab: 'accounts',
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedCompanyId: (companyId) => set({ selectedCompanyId: companyId }),
  setSelectedBudgetId: (budgetId) => set({ selectedBudgetId: budgetId }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
```

---

## User Workflows

### Workflow 1: Create Chart of Accounts

1. **Navigate** to `/finance/planning`
2. **Select Tab**: "Chart of Accounts"
3. **Click** "+ Add Account Group"
4. **Fill Form**:
   - Code: "OPEX"
   - Name: "Operating Expenses"
   - Account Type: "EXPENSE"
   - Display Order: 1
5. **Submit** → Account group created
6. **Click** "+ Add Account"
7. **Fill Form**:
   - Code: "5100"
   - Name: "Smolt Feed"
   - Account Type: "EXPENSE"
   - Group: "OPEX"
8. **Submit** → Account created
9. **Repeat** for all accounts

---

### Workflow 2: Create Monthly Budget

1. **Navigate** to `/finance/planning`
2. **Select Tab**: "Budgeting"
3. **Click** "+ Create Budget"
4. **Fill Form**:
   - Name: "2025 Base Budget"
   - Year: 2025
   - Company: "Bakkafrost P/F"
   - Scenario: (optional)
   - Description: "Base budget for 2025 fiscal year"
5. **Submit** → Budget created
6. **Click** "+ Add Row"
7. **Select**:
   - Account: "5100 Smolt Feed"
   - Cost Center: "FARM-01"
8. **Enter Monthly Amounts**:
   - Jan: 50,000
   - Feb: 52,000
   - Mar: 51,000
   - ... (continue for all months)
9. **Auto-Save** → Budget entries saved
10. **Repeat** for all account/cost center combinations
11. **Click** "Activate" → Budget set as active

---

### Workflow 3: Copy Budget to New Year

1. **Navigate** to `/finance/planning`
2. **Select Tab**: "Budgeting"
3. **Select Budget**: "2025 Base Budget"
4. **Click** "Copy Budget"
5. **Fill Form**:
   - New Year: 2026
   - New Name: "2026 Base Budget (Copied from 2025)"
6. **Submit** → Budget copied with all entries
7. **Edit** monthly amounts as needed
8. **Click** "Activate" → New budget set as active

---

## Responsive Design

### Desktop (≥1024px)

- **Full Grid**: All 12 months visible in budgeting grid
- **Sidebar**: Persistent sidebar navigation
- **Modals**: Centered modals for forms

### Tablet (768px - 1023px)

- **Horizontal Scroll**: Budgeting grid scrolls horizontally
- **Sidebar**: Collapsible sidebar
- **Modals**: Full-width modals

### Mobile (≤767px)

- **Vertical Layout**: Budgeting grid switches to vertical card layout (one account/cost center per card)
- **Sidebar**: Hidden, accessible via hamburger menu
- **Modals**: Full-screen modals

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

**Test Files**:
- `ChartOfAccountsManager.test.tsx`
- `CostCenterManager.test.tsx`
- `MonthlyBudgetingGrid.test.tsx`
- `EditableCell.test.tsx`

**Example Test**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ChartOfAccountsManager } from './ChartOfAccountsManager';

describe('ChartOfAccountsManager', () => {
  it('renders account list', async () => {
    render(<ChartOfAccountsManager />);
    expect(await screen.findByText('5100 Smolt Feed')).toBeInTheDocument();
  });
  
  it('opens add account modal', () => {
    render(<ChartOfAccountsManager />);
    fireEvent.click(screen.getByText('Add Account'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

### Integration Tests

**Test Scenarios**:
1. Create account → Verify API call → Verify UI update
2. Edit budget entry → Verify debounced API call → Verify grid update
3. Copy budget → Verify new budget created → Verify entries copied

### E2E Tests (Playwright)

**Test Flows**:
1. Complete budget creation workflow (from CoA setup to budget entry)
2. Budget vs. Actuals report generation
3. Multi-user budget editing (concurrent edits)

---

## Conclusion

This UI specification provides complete guidance for frontend agents to implement the Financial Core module in AquaMind. The design follows the established AquaMind patterns (Warm Earth theme, Tailwind CSS, Shadcn/ui) and ensures a familiar, intuitive UX for users transitioning from FishTalk.

For backend integration details, see the **Financial Core API Specification** document.

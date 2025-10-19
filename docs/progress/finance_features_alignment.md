# Finance Features Alignment & Shared Components

**Created**: October 19, 2024  
**Purpose**: Ensure consistency across finance-related frontend features  
**Status**: Architecture Definition

---

## 🎯 Overview

AquaMind has THREE finance-related frontend features that must work together cohesively:

1. **Finance Reporting** (Feed Cost Analysis) - Analytical, read-only
2. **Transfer Workflow UI** (Batch Transfers) - Operational, read-write
3. **Intercompany Transaction Management** (via workflows) - Approval workflows

This document defines shared responsibilities, common components, and integration points.

---

## 📊 Feature Comparison Matrix

| Aspect | Finance Reporting | Transfer Workflow UI | Intercompany Approvals |
|--------|------------------|---------------------|------------------------|
| **Primary Users** | CFO, Finance Managers | Freshwater Mgr, Ship Crew, Farming Mgr | Farming Managers |
| **Operation Type** | Read-only (analytics) | Read-write (CRUD + execute) | Write (approval) |
| **Backend Endpoints** | `/api/v1/inventory/feeding-events/finance-report/` | `/api/batch/transfer-workflows/` | `/api/finance/intercompany-transactions/` |
| **Main UI Pattern** | Dashboard + Charts | Wizard + Detail Pages + Dialogs | Approval Dashboard |
| **Filters Needed** | Date, Geography, Feed, Cost | Status, Batch, Type, Date | Status, Date, Company |
| **Mobile Priority** | Low (Desktop CFO) | High (Ship crew execution) | Medium (Manager tablets) |
| **Complexity** | High (32 filters, charts) | Medium (state machine, multi-step) | Low (approval flow) |

---

## 🔄 Integration Points

### **1. Navigation Structure**

**Recommended Hierarchy**:
```
Finance (Top-level section)
├── Feed Cost Analysis      → Finance Reporting
├── Transfer Workflows      → Transfer Workflow List
└── Pending Approvals      → Intercompany Approvals
```

**Implementation**:
```tsx
// App.tsx or navigation config
<NavSection title="Finance" icon={DollarSign}>
  <NavItem 
    href="/finance/feed-costs" 
    label="Feed Cost Analysis"
    icon={TrendingUp}
  />
  <NavItem 
    href="/finance/transfer-workflows" 
    label="Transfer Workflows"
    icon={ArrowRightLeft}
    badge={pendingWorkflowsCount}
  />
  <NavItem 
    href="/finance/approvals" 
    label="Pending Approvals"
    icon={CheckCircle}
    badge={pendingApprovalsCount}
  />
</NavSection>
```

---

### **2. Cross-Feature Linking**

**Use Case 1**: From Transfer Workflow → Finance Report
```tsx
// In WorkflowDetailPage.tsx
<Card>
  <CardHeader>Batch Feed Costs</CardHeader>
  <CardContent>
    <p>See this batch's feed costs in detail</p>
    <Button asChild>
      <Link to={`/finance/feed-costs?batch=${workflow.batch}&startDate=${workflow.planned_start_date}`}>
        View Feed Report →
      </Link>
    </Button>
  </CardContent>
</Card>
```

**Use Case 2**: From Finance Report → Transfer Workflows
```tsx
// In FinanceReportingPage.tsx (container breakdown)
<TableRow>
  <TableCell>{container.name}</TableCell>
  <TableCell>${container.feed_cost}</TableCell>
  <TableCell>
    {container.recent_transfers_count > 0 && (
      <Button variant="link" size="sm" asChild>
        <Link to={`/finance/transfer-workflows?container=${container.id}`}>
          {container.recent_transfers_count} transfers
        </Link>
      </Button>
    )}
  </TableCell>
</TableRow>
```

**Use Case 3**: From Approval Dashboard → Workflow Detail
```tsx
// In PendingApprovalsPage.tsx
<PendingApprovalCard transaction={tx}>
  <Button asChild>
    <Link to={`/finance/transfer-workflows/${tx.source_id}`}>
      View Workflow Details →
    </Link>
  </Button>
</PendingApprovalCard>
```

---

## 🧩 Shared Components Library

### **Phase 0: Shared Components (Build FIRST)**

Before implementing either feature, create shared components that both will use.

**Location**: `client/src/features/shared/finance/`

---

#### **Component 1: DateRangeFilter**
**File**: `features/shared/finance/DateRangeFilter.tsx`

**Used By**: Finance Reporting, Transfer Workflows, Approvals

```tsx
interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  showPresets?: boolean;
  presets?: Array<'today' | 'week' | 'month' | 'quarter' | 'year'>;
  errors?: { startDate?: string; endDate?: string; dateRange?: string };
  required?: boolean;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  showPresets = true,
  presets = ['today', 'week', 'month', 'quarter', 'year'],
  errors = {},
  required = true,
}: DateRangeFilterProps) {
  const applyPreset = (preset: string) => {
    const { startDate, endDate } = getDateRangeForPeriod(preset);
    onStartDateChange(startDate);
    onEndDateChange(endDate);
  };
  
  return (
    <div className="space-y-4">
      {showPresets && (
        <div className="flex gap-2 flex-wrap">
          {presets.map(preset => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="capitalize"
            >
              {preset}
            </Button>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date {required && '*'}</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className={errors.startDate ? 'border-red-500' : ''}
          />
          {errors.startDate && (
            <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
          )}
        </div>
        
        <div>
          <Label>End Date {required && '*'}</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className={errors.endDate ? 'border-red-500' : ''}
          />
          {errors.endDate && (
            <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>
      
      {errors.dateRange && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errors.dateRange}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Shared utility
function getDateRangeForPeriod(period: string): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  
  const startDates = {
    today: now,
    week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    month: new Date(now.getFullYear(), now.getMonth(), 1),
    quarter: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1),
    year: new Date(now.getFullYear(), 0, 1),
  };
  
  const startDate = (startDates[period as keyof typeof startDates] || now)
    .toISOString()
    .split('T')[0];
  
  return { startDate, endDate };
}
```

---

#### **Component 2: GeographicFilters**
**File**: `features/shared/finance/GeographicFilters.tsx`

**Used By**: Finance Reporting, Transfer Workflows

```tsx
interface GeographicFiltersProps {
  geographyIds?: number[];
  areaIds?: number[];
  stationId?: number;
  onGeographyChange: (ids: number[]) => void;
  onAreaChange: (ids: number[]) => void;
  onStationChange: (id?: number) => void;
  layout?: 'stacked' | 'grid';
  collapsible?: boolean;
}

export function GeographicFilters({
  geographyIds = [],
  areaIds = [],
  stationId,
  onGeographyChange,
  onAreaChange,
  onStationChange,
  layout = 'stacked',
  collapsible = false,
}: GeographicFiltersProps) {
  const { data: geographies } = useGeographies();
  const { data: areas } = useAreas();
  const { data: stations } = useFreshwaterStations();
  
  const content = (
    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
      <MultiSelectFilter
        label="Geographies"
        options={geographies?.results?.map(g => ({
          id: g.id,
          label: g.name,
          description: `${g.total_containers || 0} containers`,
        })) || []}
        selectedIds={geographyIds}
        onChange={onGeographyChange}
        placeholder="Select geographies..."
      />
      
      <MultiSelectFilter
        label="Areas"
        options={areas?.results?.map(a => ({
          id: a.id,
          label: a.name,
          description: `${a.geography_name} - ${a.area_type}`,
        })) || []}
        selectedIds={areaIds}
        onChange={onAreaChange}
        placeholder="Select areas..."
      />
      
      <div>
        <Label>Freshwater Station</Label>
        <Select
          value={stationId?.toString() || ''}
          onValueChange={(v) => onStationChange(v ? parseInt(v) : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All stations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Stations</SelectItem>
            {stations?.results?.map(s => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.name} - {s.station_type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  
  if (collapsible) {
    return (
      <Collapsible>
        <CollapsibleTrigger>
          <Label className="text-base font-semibold">Geographic Filters</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>{content}</CollapsibleContent>
      </Collapsible>
    );
  }
  
  return content;
}
```

---

#### **Component 3: FinanceKpiCard**
**File**: `features/shared/finance/FinanceKpiCard.tsx`

**Used By**: Finance Reporting, Transfer Workflow Detail, Approvals

```tsx
interface FinanceKpiCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
  onClick?: () => void;
}

export function FinanceKpiCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-green-600',
  subtitle,
  trend,
  isLoading,
  onClick,
}: FinanceKpiCardProps) {
  return (
    <Card 
      className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', iconColor)} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={cn(
                'flex items-center text-xs mt-2',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>{trend.value}% {trend.label}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

---

#### **Component 4: RechartsTheme**
**File**: `features/shared/finance/charts/theme.ts`

**Used By**: Finance Reporting charts, Transfer Workflow progress charts

```typescript
/**
 * Shared Recharts theme configuration for finance features
 * Ensures consistent colors, fonts, and styling across all charts
 */

export const FINANCE_CHART_COLORS = {
  primary: '#16a34a',      // green-600 (matches brand)
  secondary: '#0ea5e9',    // sky-500
  tertiary: '#f59e0b',     // amber-500
  danger: '#ef4444',       // red-500
  muted: '#94a3b8',        // slate-400
  gradient: ['#16a34a', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899'],
} as const;

export const CHART_FONT_CONFIG = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 12,
  fontWeight: 400,
} as const;

export const CHART_MARGIN = {
  top: 20,
  right: 30,
  bottom: 20,
  left: 20,
} as const;

export const TOOLTIP_STYLE = {
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '12px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
} as const;

// Shared formatters
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatWeight(kg: number): string {
  return `${kg.toLocaleString()} kg`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  const date = new Date(dateString);
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
```

---

#### **Component 5: ChartWrapper**
**File**: `features/shared/finance/charts/ChartWrapper.tsx`

**Used By**: All charts in both features

```tsx
interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  actions?: React.ReactNode;
  height?: number;
}

export function ChartWrapper({
  title,
  description,
  children,
  isLoading,
  error,
  isEmpty,
  emptyMessage = 'No data available for the selected period',
  actions,
  height = 300,
}: ChartWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center" style={{ height }}>
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-muted-foreground">
              Failed to load chart data
            </p>
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center" style={{ height }}>
            <BarChart3 className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div style={{ height }}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

#### **Component 6: StatusBadge**
**File**: `features/shared/finance/StatusBadge.tsx`

**Used By**: Transfer Workflows (workflow status), Approvals (transaction status)

```tsx
type WorkflowStatus = 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type TransactionStatus = 'PENDING' | 'POSTED' | 'EXPORTED';

interface StatusBadgeProps {
  status: WorkflowStatus | TransactionStatus;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG = {
  // Workflow statuses
  DRAFT: { variant: 'secondary' as const, label: 'Draft', icon: FileText },
  PLANNED: { variant: 'default' as const, label: 'Planned', icon: Calendar },
  IN_PROGRESS: { variant: 'warning' as const, label: 'In Progress', icon: Loader2 },
  COMPLETED: { variant: 'success' as const, label: 'Completed', icon: CheckCircle },
  CANCELLED: { variant: 'destructive' as const, label: 'Cancelled', icon: XCircle },
  
  // Transaction statuses
  PENDING: { variant: 'warning' as const, label: 'Pending Approval', icon: Clock },
  POSTED: { variant: 'success' as const, label: 'Posted', icon: CheckCircle },
  EXPORTED: { variant: 'default' as const, label: 'Exported', icon: Download },
} as const;

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className={size === 'sm' ? 'text-xs' : ''}>
      <Icon className={cn('mr-1', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      {config.label}
    </Badge>
  );
}
```

---

## 🎨 Shared Styling & Conventions

### **Currency Formatting**
```typescript
// Always use this format across all features
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD', // or EUR based on transaction.currency
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// Usage
<div>${formatter.format(15625)}</div>
// Output: $15,625
```

### **Date Formatting**
```typescript
// Short format for tables
formatDate(date, 'short') // "Oct 18"

// Long format for details
formatDate(date, 'long') // "October 18, 2024"

// Relative format for recent items
formatDistanceToNow(date, { addSuffix: true }) // "2 days ago"
```

### **Color Palette for Finance**
```typescript
export const FINANCE_COLORS = {
  positive: 'text-green-600',      // Profit, income, gains
  negative: 'text-red-600',        // Costs, losses
  neutral: 'text-slate-600',       // Standard data
  warning: 'text-amber-600',       // Pending, in-progress
  success: 'text-emerald-600',     // Completed, approved
} as const;
```

---

## 📋 Implementation Order

### **Phase 0: Shared Components (Build FIRST)**
**Before starting either feature**

**Tasks**:
1. Create `features/shared/finance/` folder structure
2. Implement DateRangeFilter component
3. Implement GeographicFilters component
4. Implement FinanceKpiCard component
5. Implement Recharts theme & ChartWrapper
6. Implement StatusBadge component
7. Write Storybook stories for each component
8. Write unit tests

**Deliverables**:
- 6 shared components ready to use
- Consistent theme configuration
- Documented in Storybook

---

### **Phase 1: Finance Reporting (Can Start)**
Uses shared components, establishes patterns

**Dependencies**: Phase 0 complete

---

### **Phase 2: Transfer Workflow Finance Integration (Backend)**
Independent of frontend

**Dependencies**: None (backend work)

---

### **Phase 3: Transfer Workflow Frontend**
Reuses shared components from Finance Reporting

**Dependencies**: Phase 0 + Phase 2 complete

---

## 🔍 Scope Boundaries

### **Finance Reporting Owns**:
- Feed cost aggregation UI
- Multi-dimensional filtering (32 params)
- Cost breakdowns by feed/geography/area/container
- Time series charts for feed costs
- CSV/Excel export of feed data
- CFO dashboard views

### **Transfer Workflow UI Owns**:
- Workflow creation wizard
- Action execution dialogs (mobile-optimized)
- Workflow progress tracking
- State machine visualization
- Transfer history views
- Ship crew mobile UI

### **Intercompany Approvals Owns** (part of Transfer Workflow):
- Pending approval dashboard
- Approval/rejection actions
- Transaction detail views
- Approval notifications

### **Shared Responsibility**:
- Date range filtering
- Geographic filtering
- Status badges
- KPI cards
- Chart styling
- Currency/date formatting

---

## ✅ Acceptance Criteria for Consistency

### **Visual Consistency**
- [ ] All finance features use same color palette
- [ ] Status badges use consistent styling
- [ ] Charts use Recharts with shared theme
- [ ] Currency always formatted with 2 decimals
- [ ] Dates use consistent format patterns

### **Functional Consistency**
- [ ] Date presets work identically in all features
- [ ] Geographic filters behave the same way
- [ ] Loading states use same skeleton components
- [ ] Error states show same messaging patterns
- [ ] Empty states have consistent design

### **Navigation Consistency**
- [ ] All features accessible from "Finance" section
- [ ] Breadcrumbs show consistent hierarchy
- [ ] Back buttons preserve filter state
- [ ] Cross-feature links work correctly

### **Mobile Consistency**
- [ ] All features responsive <768px
- [ ] Touch targets minimum 44x44px
- [ ] Forms work on mobile keyboards
- [ ] Charts render correctly on small screens

---

## 🚀 Deployment Strategy

### **Option A: Shared Components First** ⭐ **RECOMMENDED**
```
Week 1: Build all shared components
Week 2-3: Finance Reporting (using shared)
Week 4: Transfer Workflow Backend
Week 5-6: Transfer Workflow Frontend (using shared)
```

**Benefits**:
- No rework needed
- Consistent from day 1
- Shared components battle-tested by reporting first

### **Option B: Feature by Feature**
```
Week 1-2: Finance Reporting (build inline)
Week 3: Extract shared components
Week 4: Transfer Workflow Backend
Week 5-6: Transfer Workflow Frontend (refactor to use shared)
```

**Benefits**:
- Faster time to first feature
- Learn patterns organically
- Risk: More refactoring needed

---

## 📝 Documentation Requirements

### **Storybook Stories Required**
Each shared component must have:
- Default state story
- Loading state story
- Error state story
- Empty state story
- Interactive demo

### **README Required**
`features/shared/finance/README.md` must document:
- Component API (props, events)
- Usage examples
- Theme customization
- Best practices

---

## 🎓 Key Principles

1. **DRY (Don't Repeat Yourself)**: Build shared components ONCE
2. **Consistency > Customization**: Use shared components even if slightly different
3. **Mobile-First**: Always consider small screens
4. **Accessibility**: ARIA labels, keyboard navigation, screen readers
5. **Performance**: React Query caching, debouncing, lazy loading

---

## ✅ Success Metrics

After implementing all three features:
- [ ] <10% code duplication between features
- [ ] Consistent UX rating >90% in user testing
- [ ] Mobile usability score >85/100
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Page load time <2s for all finance pages
- [ ] Zero layout shift (CLS score <0.1)

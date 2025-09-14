# Refactoring Large Page Components

> **Guide**: How to decompose oversized page components (500+ LOC) into maintainable feature slices

---

## 🚨 When to Refactor

**Trigger Conditions:**
- Page component > 500 LOC
- Single file > 300 LOC
- Function with CC > 15 (cyclomatic complexity)
- Multiple responsibilities in one component
- Hard to test or understand

**Current Status**: Before refactoring, check complexity metrics:
```bash
npm run complexity:analyze
```

---

## 🏗️ Refactoring Strategy

### 1. Identify Logical Sections

**Step 1**: Analyze the large component and identify logical sections:

```tsx
// BEFORE: Massive BatchManagementPage.tsx (600+ LOC)
function BatchManagementPage() {
  // ❌ 50 LOC: State management
  // ❌ 100 LOC: Data fetching logic
  // ❌ 150 LOC: Table rendering
  // ❌ 80 LOC: Modal dialogs
  // ❌ 120 LOC: Chart visualizations
  // ❌ 100 LOC: Form handling
}
```

**Step 2**: Group related functionality:

```tsx
// AFTER: Logical sections identified
function BatchManagementPage() {
  // ✅ 30 LOC: Layout and routing
  // ✅ 20 LOC: State coordination
}

// Extracted components:
// - BatchTableView (150 LOC)
// - BatchAnalyticsView (120 LOC)
// - BatchTransferDialog (80 LOC)
// - BatchFilters (100 LOC)
```

---

## 📁 Feature Slice Structure

### Standard Feature Organization

```
features/batch-management/
├── api.ts              # TanStack Query hooks
├── hooks.ts            # Custom business logic hooks
├── components/         # Feature-specific components
│   ├── BatchTableView.tsx
│   ├── BatchAnalyticsView.tsx
│   └── BatchTransferDialog.tsx
├── pages/              # Route targets (thin shells)
│   └── BatchManagementPage.tsx
└── index.ts            # Barrel exports
```

### Thin Page Shell Pattern

**Route Target** (Keep under 150 LOC):
```tsx
// features/batch-management/pages/BatchManagementPage.tsx
import { useLocation } from 'wouter';
import { BatchTableView } from '../components/BatchTableView';
import { BatchAnalyticsView } from '../components/BatchAnalyticsView';

export function BatchManagementPage() {
  const [location] = useLocation();
  const isAnalyticsView = location.includes('/analytics');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Batch Management</h1>

      {isAnalyticsView ? (
        <BatchAnalyticsView />
      ) : (
        <BatchTableView />
      )}
    </div>
  );
}
```

---

## 🧩 Component Extraction Patterns

### Pattern 1: Extract Data Components

**Before:**
```tsx
function BatchManagementPage() {
  const { data: batches } = useQuery({
    queryKey: ['batches'],
    queryFn: () => ApiService.apiV1BatchBatchesList(),
  });

  // 80 LOC of table logic mixed with page logic
  return (
    <div>
      <DataTable
        columns={[/* inline column definitions */]}
        data={batches?.results || []}
        // inline event handlers
      />
    </div>
  );
}
```

**After:**
```tsx
// features/batch-management/api.ts
export function useBatches() {
  return useQuery({
    queryKey: ['batches'],
    queryFn: () => ApiService.apiV1BatchBatchesList(),
  });
}

// features/batch-management/components/BatchTableView.tsx
import { useBatches } from '../api';

export function BatchTableView() {
  const { data: batches } = useBatches();

  const columns = useMemo(() => [
    // column definitions
  ], []);

  return (
    <DataTable
      columns={columns}
      data={batches?.results || []}
      onRowClick={handleRowClick}
    />
  );
}
```

### Pattern 2: Extract Business Logic Hooks

**Before:**
```tsx
function BatchAnalyticsView() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // 60 LOC of complex data processing logic
  const chartData = useMemo(() => {
    if (!batches) return [];
    return batches.results
      .filter(batch => isWithinPeriod(batch.created_at, selectedPeriod))
      .map(batch => ({
        date: batch.created_at,
        biomass: calculateBiomass(batch),
        fcr: calculateFCR(batch),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [batches, selectedPeriod]);

  return <LineChart data={chartData} />;
}
```

**After:**
```tsx
// features/batch-management/hooks/useBatchAnalytics.ts
export function useBatchAnalytics(selectedPeriod: string) {
  const { data: batches } = useBatches();

  const chartData = useMemo(() => {
    if (!batches?.results) return [];

    return batches.results
      .filter(batch => isWithinPeriod(batch.created_at, selectedPeriod))
      .map(batch => ({
        date: batch.created_at,
        biomass: calculateBiomass(batch),
        fcr: calculateFCR(batch),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [batches, selectedPeriod]);

  return { chartData };
}

// features/batch-management/components/BatchAnalyticsView.tsx
export function BatchAnalyticsView() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const { chartData } = useBatchAnalytics(selectedPeriod);

  return (
    <div>
      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
        </SelectContent>
      </Select>
      <LineChart data={chartData} />
    </div>
  );
}
```

### Pattern 3: Extract Modal/Dialog Components

**Before:**
```tsx
function BatchManagementPage() {
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // 100 LOC of dialog logic mixed with page logic
  const handleTransfer = async (batchId: string, targetAreaId: string) => {
    try {
      await ApiService.apiV1BatchBatchesTransferCreate({
        batch: batchId,
        target_area: targetAreaId,
      });
      setShowTransferDialog(false);
      // refresh data
    } catch (error) {
      // error handling
    }
  };

  return (
    <div>
      {/* page content */}
      {showTransferDialog && (
        <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
          {/* 80 LOC of dialog JSX */}
        </Dialog>
      )}
    </div>
  );
}
```

**After:**
```tsx
// features/batch-management/hooks/useBatchTransfer.ts
export function useBatchTransfer() {
  const queryClient = useQueryClient();

  const transferMutation = useMutation({
    mutationFn: ({ batchId, targetAreaId }: TransferParams) =>
      ApiService.apiV1BatchBatchesTransferCreate({
        batch: batchId,
        target_area: targetAreaId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });

  return {
    transfer: transferMutation.mutateAsync,
    isTransferring: transferMutation.isPending,
    error: transferMutation.error,
  };
}

// features/batch-management/components/BatchTransferDialog.tsx
interface BatchTransferDialogProps {
  batch: Batch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchTransferDialog({
  batch,
  open,
  onOpenChange
}: BatchTransferDialogProps) {
  const { transfer, isTransferring, error } = useBatchTransfer();

  const handleSubmit = async (targetAreaId: string) => {
    if (!batch) return;

    try {
      await transfer({ batchId: batch.id, targetAreaId });
      onOpenChange(false);
    } catch (error) {
      // error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Batch</DialogTitle>
        </DialogHeader>
        {/* dialog content */}
      </DialogContent>
    </Dialog>
  );
}

// features/batch-management/pages/BatchManagementPage.tsx
export function BatchManagementPage() {
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  return (
    <div>
      <BatchTableView
        onTransferClick={(batch) => {
          setSelectedBatch(batch);
          setShowTransferDialog(true);
        }}
      />

      <BatchTransferDialog
        batch={selectedBatch}
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
      />
    </div>
  );
}
```

---

## 🔄 Migration Checklist

### Phase 1: Analysis
- [ ] Identify oversized components (>500 LOC)
- [ ] Run complexity analysis: `npm run complexity:check`
- [ ] Map out logical sections and dependencies
- [ ] Plan extraction order (data → hooks → components)

### Phase 2: Extract Data Layer
- [ ] Create `features/[name]/api.ts` with TanStack Query hooks
- [ ] Move data fetching logic from components to hooks
- [ ] Update component imports to use new API hooks

### Phase 3: Extract Business Logic
- [ ] Create `features/[name]/hooks/` for complex logic
- [ ] Move state management and calculations to custom hooks
- [ ] Ensure hooks are reusable across components

### Phase 4: Extract Components
- [ ] Create `features/[name]/components/` directory
- [ ] Extract presentational components (tables, charts, forms)
- [ ] Move modal dialogs to separate components

### Phase 5: Thin Page Shell
- [ ] Update page component to be a thin routing shell
- [ ] Keep page under 150 LOC
- [ ] Ensure all routing and layout logic remains

### Phase 6: Testing & Validation
- [ ] Run tests: `npm run test`
- [ ] Check complexity: `npm run complexity:analyze`
- [ ] Verify no functional regressions
- [ ] Update any affected tests

---

## 📊 Success Metrics

**Before Refactoring:**
- File size: 600+ LOC
- Functions with CC > 15: Multiple
- Test coverage: Difficult to achieve
- Code reuse: Minimal

**After Refactoring:**
- Page shell: <150 LOC
- Components: <300 LOC each
- Hooks: <150 LOC each
- CC: <15 for all functions
- Test coverage: High (isolated components)
- Code reuse: High (shared hooks/components)

---

## 🎯 Common Pitfalls

### ❌ Don't Do This

**Anti-pattern 1: Extract too early**
```tsx
// ❌ Premature extraction - component too small to justify
function TinyFilter({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}
// Better to keep inline or in ui/ folder
```

**Anti-pattern 2: Wrong extraction level**
```tsx
// ❌ Extracted to wrong location
// Should be in features/batch-management/, not components/
function BatchTable() { /* ... */ }
```

**Anti-pattern 3: Missing dependencies**
```tsx
// ❌ Forgot to pass required props
function BatchTableView() {
  const { data } = useBatches(); // Missing: no way to customize query
}
```

### ✅ Do This Instead

**Pattern 1: Extract with props interface**
```tsx
interface BatchTableViewProps {
  filters?: BatchFilters;
  onRowClick?: (batch: Batch) => void;
}

function BatchTableView({ filters, onRowClick }: BatchTableViewProps) {
  const { data } = useBatches(filters);
  // ...
}
```

**Pattern 2: Use composition over inheritance**
```tsx
// ✅ Composition pattern
function BatchManagementPage() {
  return (
    <div>
      <BatchFilters />
      <BatchTableView />
      <BatchActions />
    </div>
  );
}
```

---

## 🔗 Related Resources

- [Code Organization Guidelines](../code_organization_guidelines.md)
- [Frontend Testing Guide](../frontend_testing_guide.md)
- [Complexity Thresholds Guide](../complexity-thresholds-and-remediation.md)
- [Navigation Architecture](../NAVIGATION_ARCHITECTURE.md)

---

## 📞 Need Help?

If you're unsure about how to refactor a specific component:

1. **Check existing patterns** in `features/` folders
2. **Run complexity analysis** to identify hotspots
3. **Create a GitHub issue** with the component details
4. **Reference this guide** in your PR description

**Remember**: Refactoring is iterative. Start small, test often, and commit frequently! 🚀

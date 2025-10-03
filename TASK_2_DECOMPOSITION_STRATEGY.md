# Task 2 – Batch Management Decomposition Strategy

**Current Status:** 509 LOC (Target: ≤150 LOC shell)  
**File:** `client/src/pages/batch-management.tsx`

## Analysis

### Current Structure

```
batch-management.tsx (509 LOC)
├── Imports & Types (1-89)
│   ├── batchFormSchema (34-64) - 31 LOC
│   ├── BatchFormData type (66)
│   ├── BatchKPIs interface (69-78) - 10 LOC
│   └── ContainerDistribution interface (80-88) - 9 LOC
│
├── Main Component (90-509)
    ├── State Management (91-100) - 10 LOC
    ├── Data Hooks (105-106) - 2 LOC
    ├── Mutation & Form Setup (109-151) - 43 LOC
    ├── Helper Functions (154-212) - 59 LOC
    │   ├── getHealthStatus
    │   ├── getHealthStatusColor
    │   ├── getLifecycleStages
    │   ├── calculateDaysActive
    │   ├── getStageProgress
    │   └── getProgressColor
    ├── Filtering Logic (214-220) - 7 LOC
    ├── Loading State (222-239) - 18 LOC
    └── Main Render (294-509) - 216 LOC
        ├── Header + Create Dialog (295-374) - 80 LOC
        ├── KPI Cards (375) - 1 LOC (component call)
        ├── Tabs Navigation (377-422) - 46 LOC
        └── Tab Contents (424-508) - 85 LOC
            ├── Overview Tab (424-438)
            ├── Containers Tab (440-454)
            ├── Medical Tab (456-471)
            ├── Feed Tab (473-488)
            └── Analytics Tab (490-507)
```

### Components Already Extracted
✅ `BatchKPIs` - KPI display (imported from features)
✅ `BatchOverview` - Batch list/cards (imported from features)
✅ `BatchContainerView` - Container tab content
✅ `BatchHealthView` - Health/medical tab content
✅ `BatchAnalyticsView` - Analytics tab content
✅ `BatchFeedHistoryView` - Feed history tab content

### What Needs Extraction

1. **Form Schema & Validation** (31 LOC)
   - Move to `features/batch-management/schemas/batchFormSchema.ts`

2. **Helper Functions** (59 LOC)
   - Move to `features/batch-management/utils/`
     - `batchHelpers.ts` - health status, colors
     - `lifecycleHelpers.ts` - stage calculations, progress

3. **Create Batch Dialog** (80 LOC in render)
   - Move to `features/batch-management/components/CreateBatchDialog.tsx`

4. **Custom Hook for Batch Creation** (43 LOC mutation logic)
   - Move to `features/batch-management/hooks/useBatchCreation.ts`

5. **Custom Hook for Filtering** (7 LOC + state)
   - Move to `features/batch-management/hooks/useBatchFilters.ts`

## Decomposition Plan

### Step 1: Extract Schemas
**Target:** `features/batch-management/schemas/batchFormSchema.ts`
- batchFormSchema
- BatchFormData type
- Export for reuse

### Step 2: Extract Utilities with Tests
**Target:** `features/batch-management/utils/`

**File: `batchHelpers.ts`**
```typescript
export function getHealthStatus(survivalRate: number): HealthStatus
export function getHealthStatusColor(status: string): string
export function calculateDaysActive(startDate: string): number
```

**File: `lifecycleHelpers.ts`**
```typescript
export function getLifecycleStages(): LifecycleStage[]
export function getStageProgress(stageName?: string, daysActive?: number): number
export function getProgressColor(progress: number): string
```

**Tests:** `batchHelpers.test.ts`, `lifecycleHelpers.test.ts`

### Step 3: Extract Creation Hook
**Target:** `features/batch-management/hooks/useBatchCreation.ts`
```typescript
export function useBatchCreation() {
  return {
    isOpen,
    setIsOpen,
    form,
    onSubmit,
    isLoading
  }
}
```

### Step 4: Extract Filtering Hook
**Target:** `features/batch-management/hooks/useBatchFilters.ts`
```typescript
export function useBatchFilters(batches: ExtendedBatch[], stages: any[]) {
  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    stageFilter,
    setStageFilter,
    filteredBatches
  }
}
```

### Step 5: Extract Create Dialog Component
**Target:** `features/batch-management/components/CreateBatchDialog.tsx`
- Full dialog with form
- Uses useBatchCreation hook
- Reusable component

### Step 6: Create Shell Page
**Target:** `features/batch-management/pages/BatchManagementPage.tsx`

**Estimated LOC: ~120**
```typescript
export default function BatchManagementPage() {
  // State (10 LOC)
  const [selectedBatch, setSelectedBatch] = useState<ExtendedBatch | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Hooks (5 LOC)
  const { batches, species, stages, containers, broodstockPairs, eggSuppliers, isLoading } = useBatchData("all");
  const { kpis } = useBatchKPIs(batches);
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, stageFilter, setStageFilter, filteredBatches } = useBatchFilters(batches, stages);
  
  // Loading state (15 LOC)
  if (isLoading) return <BatchManagementSkeleton />;
  
  // Render (90 LOC)
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Header>
        <CreateBatchDialog />
      </Header>
      
      <BatchKPIs kpis={kpis} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList />
        
        <TabsContent value="overview">
          <BatchOverview
            batches={filteredBatches}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            stageFilter={stageFilter}
            onStageFilterChange={setStageFilter}
            onBatchSelect={setSelectedBatch}
            selectedBatch={selectedBatch}
            stages={stages}
          />
        </TabsContent>
        
        <TabsContent value="containers">
          <BatchContainerView batch={selectedBatch} />
        </TabsContent>
        
        <TabsContent value="medical">
          <BatchHealthView batch={selectedBatch} />
        </TabsContent>
        
        <TabsContent value="feed">
          <BatchFeedHistoryView batch={selectedBatch} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <BatchAnalyticsView batch={selectedBatch} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### Step 7: Update old file to re-export
**Target:** `client/src/pages/batch-management.tsx`
```typescript
// Re-export for backward compatibility
export { default } from "@/features/batch-management/pages/BatchManagementPage";
```

## Expected Outcomes

### File Size Targets
- ✅ Shell page: ~120 LOC (under 150 target)
- ✅ CreateBatchDialog: ~90 LOC
- ✅ useBatchCreation hook: ~50 LOC
- ✅ useBatchFilters hook: ~25 LOC
- ✅ batchHelpers: ~30 LOC + 50 LOC tests
- ✅ lifecycleHelpers: ~40 LOC + 50 LOC tests
- ✅ batchFormSchema: ~35 LOC

### Total: 440 LOC split across 7 files (vs 509 in one file)

### Complexity Improvements
- Helper functions: CC ≤ 5 each (currently inline)
- Hook functions: CC ≤ 8 each
- Component render: CC ≤ 10 (simplified)

### Test Coverage
- ✅ batchHelpers: 90%+ coverage
- ✅ lifecycleHelpers: 90%+ coverage
- ✅ useBatchFilters: 80%+ coverage
- ✅ Form validation: Covered by schema tests

## Migration Safety

1. **Backward Compatibility:** Re-export from old location
2. **No Breaking Changes:** All imports remain valid
3. **Test Coverage:** Unit tests before migration
4. **Type Safety:** Full TypeScript throughout
5. **Incremental:** Can be reviewed file-by-file

## Notes

- BatchFormData type already defined in features/batch/types.ts (check for duplication)
- BatchKPIs interface duplicates useBatchKPIs return type (consolidate)
- ContainerDistribution interface may be defined elsewhere (check)
- Geography filtering already removed (noted in code comment)


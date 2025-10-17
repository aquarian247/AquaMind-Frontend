# Executive Frontends - Quick Start Guide

**Last Updated:** October 17, 2025  
**Status:** Plans Ready for Execution

---

## What's Been Done

✅ **Backend Lice Enhancement** - COMPLETE
- Enhanced lice tracking with species/stage normalization
- New API endpoints: `/api/v1/health/lice-types/`, `.../lice-counts/summary/`, `.../lice-counts/trends/`
- 32 tests passing
- Ready for dashboard consumption

✅ **Implementation Plans Created** - COMPLETE
- 3 comprehensive dashboard plans
- 37 total tasks across all dashboards
- Backend API requirements documented
- Complexity and dependencies mapped

---

## Three Dashboard Plans

### 1. Executive Dashboard (Medium Complexity)
📁 **Plan:** `executive-dashboard-plan/IMPLEMENTATION_PLAN.md`  
👤 **Persona:** CEO, CFO  
📊 **Tabs:** Overview, Financial, Strategic, Market  
⚡ **Tasks:** 10 tasks, 2-3 sessions

**When to Build:** First (establishes patterns for others)

---

### 2. Freshwater Station Manager Dashboard (High Complexity)
📁 **Plan:** `freshwater-dashboard-plan/IMPLEMENTATION_PLAN.md`  
👤 **Persona:** Freshwater Oversight Manager  
📊 **Tabs:** Weekly Report, Forensic Analysis, Transfer Planning, Station Details  
⚡ **Tasks:** 13 tasks, 3-4 sessions

**When to Build:** Second (different data sources, can reuse Executive components)

---

### 3. Sea Area Operations Manager Dashboard (Very High Complexity)
📁 **Plan:** `sea-operations-dashboard-plan/IMPLEMENTATION_PLAN.md`  
👤 **Persona:** Sea Operations Oversight Manager  
📊 **Tabs:** Weekly Report, Lice Management, Market Intelligence, Facility Comparison  
⚡ **Tasks:** 14 tasks, 4-5 sessions

**When to Build:** Third (most complex, can reuse components from both previous)

---

## How to Use These Plans

### Read the Plans
1. Start with `MASTER_IMPLEMENTATION_PLAN.md` for overview
2. Read the specific dashboard's `SUMMARY.md` for quick context
3. Deep dive into `IMPLEMENTATION_PLAN.md` for task details

### Execute a Plan
1. **Choose dashboard** (recommended order: Exec → FW → Sea)
2. **Start with Task 0** of chosen plan
3. **Complete tasks sequentially** (each designed for single session)
4. **Test after each task** (don't accumulate untested code)
5. **Update progress** in plan document

### Track Progress
Create a `PROGRESS.md` file in each plan folder:
```markdown
# [Dashboard Name] - Progress Tracker

- [x] Task 0: Complete
- [x] Task 1: Complete  
- [ ] Task 2: In Progress
- [ ] Task 3: Blocked (waiting for backend endpoint)
- [ ] Task 4: Not Started
...
```

---

## Starting Points

### Option 1: Executive Dashboard (Recommended First)
```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend

# Read the plan
cat docs/progress/executives_frontends/executive-dashboard-plan/IMPLEMENTATION_PLAN.md

# Start Task 0: Backend API Gap Analysis
# (READ-ONLY task - no code changes)
# Search OpenAPI spec for financial/market endpoints
grep -i "market\|financial\|revenue\|ebitda" api/openapi.yaml
```

### Option 2: Freshwater Dashboard
```bash
# Read the plan
cat docs/progress/executives_frontends/freshwater-dashboard-plan/IMPLEMENTATION_PLAN.md

# Start Task 0: Weekly Report Analysis
# Review screenshots and map to backend data
open docs/progress/executives_frontends/screencapture-*freshwater*.png
```

### Option 3: Sea Operations Dashboard  
```bash
# Read the plan
cat docs/progress/executives_frontends/sea-operations-dashboard-plan/IMPLEMENTATION_PLAN.md

# Start Task 0: Prototype Extraction
# Already extracted - analyze the code
cd docs/progress/executives_frontends/executive-dashboard
cat src/pages/OperationsManager.jsx | head -100
```

---

## Task Execution Pattern

Each task follows this pattern:

### 1. Read Task Description
- Scope, actions, files to create
- Backend endpoints to use
- Success criteria

### 2. Execute Task
- Follow actions list
- Create files in specified locations
- Use AquaMind patterns (features/ structure, ApiService, formatFallback)
- Write tests alongside code

### 3. Validate Task
- Run tests: `npm run test`
- Check types: `npm run type-check`
- Fix linter errors
- Verify in browser (if UI task)

### 4. Mark Complete
- Update progress tracker
- Note any deviations
- Document any blockers
- Move to next task

---

## Common Patterns (All Dashboards)

### API Hook Pattern
```typescript
// features/[dashboard]/api/api.ts
import { ApiService } from '@/api/generated';
import { useQuery } from '@tanstack/react-query';
import { formatFallback, formatCount } from '@/lib/formatFallback';

export function useDashboardKPIs(geography?: number) {
  return useQuery({
    queryKey: ['dashboard-kpis', geography],
    queryFn: async () => {
      const summary = await ApiService.apiV1[...]SummaryRetrieve(geography);
      return {
        totalBiomass: formatCount(summary.active_biomass_kg),
        avgWeight: formatFallback(summary.avg_weight_kg, 'kg'),
        // ... more KPIs
      };
    },
    enabled: !!geography
  });
}
```

### Component Pattern
```typescript
// features/[dashboard]/components/SomeTab.tsx
import { useKPIHook } from '../api/api';

export function SomeTab({ geography }: { geography: number }) {
  const { data: kpis, isLoading, error } = useKPIHook(geography);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="space-y-6">
      <KPICard
        title="Total Biomass"
        value={kpis?.totalBiomass}
        unit="kg"
        trend={kpis?.biomassTrend}
      />
      {/* More components */}
    </div>
  );
}
```

### Test Pattern
```typescript
// features/[dashboard]/components/SomeTab.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SomeTab } from './SomeTab';
import * as api from '../api/api';

vi.mock('../api/api');

describe('SomeTab', () => {
  it('renders KPIs', async () => {
    vi.mocked(api.useKPIHook).mockReturnValue({
      data: { totalBiomass: 1000, /* ... */ },
      isLoading: false,
      error: null
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SomeTab geography={1} />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Total Biomass')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### "Backend endpoint doesn't exist"
- Check if it's in OpenAPI spec: `grep -i "endpoint-name" api/openapi.yaml`
- If missing: Create backend feature request OR use mock data with disclosure banner
- Don't block: Proceed with honest "Integration pending" message

### "Calculation doesn't match prototype"
- Document the discrepancy
- Verify formula extraction
- Test with known data
- May indicate prototype bug or data difference

### "Test data insufficient"
- Accept limitations
- Display "Insufficient data" message
- Document minimum data requirements for UAT
- Focus testing on available data

### "Performance issue"
- Add lazy loading
- Add virtualization for large lists
- Check for N+1 query problems
- Use React.memo and useMemo
- Consider pagination

### "Component too large (>300 LOC)"
- Extract sub-components
- Move calculations to hooks
- Move utilities to separate files
- Follow single-responsibility principle

---

## Getting Help

### Plan-Related Questions
- **Master Plan:** `MASTER_IMPLEMENTATION_PLAN.md`
- **Dashboard-Specific:** Check plan folder's `IMPLEMENTATION_PLAN.md`
- **Quick Reference:** `SUMMARY.md` in each folder

### Technical Questions
- **Architecture:** `AquaMind-Frontend/docs/architecture.md`
- **Coding Guidelines:** `AquaMind-Frontend/docs/CONTRIBUTING.md`
- **Testing:** `AquaMind-Frontend/docs/frontend_testing_guide.md`
- **API Usage:** `AquaMind-Frontend/docs/multi-entity-filtering-guide.md`

### Source Material
- **Prototypes:** `executive-dashboard/` folder (extracted)
- **Screenshots:** `screencapture-*.png` files
- **Analysis Docs:** `*.md` files in executives_frontends/
- **Weekly Reports:** Referenced in analysis documents

---

## Ready to Start?

### Recommended Starting Point

```bash
# 1. Review master plan
cat docs/progress/executives_frontends/MASTER_IMPLEMENTATION_PLAN.md

# 2. Choose dashboard (recommend: Executive first)
cat docs/progress/executives_frontends/executive-dashboard-plan/SUMMARY.md

# 3. Read full plan
cat docs/progress/executives_frontends/executive-dashboard-plan/IMPLEMENTATION_PLAN.md

# 4. Execute Task 0
# (Follow task description in plan)

# 5. Continue with subsequent tasks
```

---

**Happy Building! 🎉**

All three dashboards will transform how executives and operations managers interact with AquaMind, replacing 70+ pages of manual reports with real-time, interactive analytics.


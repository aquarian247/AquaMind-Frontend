# P3 – Implement Client-Side Aggregations & Eliminate Remaining TS Errors  
_Phase: Type Alignment • Assignee: Code Droid_

---

## 1 Scope  

After P2 every component consumes raw snake_case API data through `ApiService`, but many pages still expect **aggregated or derived properties** (e.g. `total_biomass`, `average_weight`, `fcr_ratio`).  
Phase P3 implements these calculations **entirely inside the frontend**, removes any temporary `any`/TODO casts, and drives the TypeScript error count to **zero**.

### Examples of missing fields to derive  
| Domain | Raw Fields Available | Derived Field to Calculate | Where Used |
|--------|---------------------|----------------------------|------------|
| Area KPI cards | Containers → `current_biomass_kg` | `total_biomass` (sum) | `pages/area-detail.tsx` |
| Area KPI cards | Containers list | `average_weight` (biomass ÷ count) | `pages/area-detail.tsx` |
| Feeding history | `amount_kg`, `batch_biomass_kg` | `feeding_percentage` | `components/batch-management/BatchFeedHistoryView.tsx` |
| Station overview | Containers list | `total_containers`, `average_weight` | `pages/station-detail.tsx` |
| Batch dashboard | FeedingEvents, GrowthSamples | `fcr_ratio` | `pages/batch-management.tsx` |

*If a calculated value requires heavy DB joins or ML it will be deferred and tracked separately.*

---

## 2 Required Reading  

1. `docs/api_alignment/FRONTEND_ADAPTATION_PRINCIPLES.md` – §4 *Computed Properties on the Client*  
2. `docs/architecture.md` – TanStack Query & hooks sections  
3. `docs/code_organization_guidelines.md` – file placement & naming conventions  
4. `client/src/lib/queryClient.ts` – caching config  
5. Generated models in `client/src/api/generated/models/**` – canonical field list  

_(Backend docs are not needed for this phase.)_

---

## 3 Action Steps  

### 3.1 Set-Up  
1. **Branch** `type-alignment/P3` from `develop` (or merged P2).  
2. Run `npm run type-check`; record remaining error count for the issue comment.

### 3.2 Create Aggregation Hooks  
Place hooks under `client/src/hooks/aggregations/`.

| Hook | Responsibility |
|------|----------------|
| `useAreaKpi(areaId)` | Fetch containers for an area; compute biomass sum, average weight, container count, mortality rate (if data available). |
| `useStationKpi(stationId)` | Similar aggregate for stations. |
| `useBatchFcr(batchId, dateRange?)` | Compute FCR from FeedingEvents & GrowthSamples. |
| Additional hooks | As new derived fields are discovered. |

Implementation pattern:

```ts
export const useAreaKpi = (areaId: number) =>
  useQuery({
    queryKey: ['area-kpi', areaId],
    queryFn: () =>
      ApiService.apiV1InfrastructureContainersList({ area: areaId }),
    select: data => {
      const containers = data.results ?? [];
      const totalBiomass = containers.reduce(
        (sum, c) => sum + Number(c.current_biomass_kg ?? 0),
        0
      );
      const totalCount = containers.reduce(
        (sum, c) => sum + (c.current_count ?? 0),
        0
      );
      const averageWeight = totalCount ? totalBiomass / totalCount : 0;
      return { totalBiomass, averageWeight, containerCount: containers.length };
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
```

### 3.3 Refactor Components  
1. Replace inline calculations with the new hooks.  
2. Remove fallback camelCase props or `// ts-ignore` added in P1/P2.  
3. Ensure derived props are typed, no `any`.

### 3.4 Unit Tests  
* Add Vitest tests for each aggregation hook (≥ 80 % branch coverage).  
* Mock API responses with lightweight fixture objects.

### 3.5 Performance & Caching  
* Heavy arrays (> 500 rows) – memoise with `useMemo`.  
* Keep hook `staleTime` in sync with KPI refresh requirements (default 5 min).

---

## 4 Success Criteria  

- `npm run type-check` returns **0 errors**.  
- All KPI widgets/tables previously blank now show correct values.  
- Dev server: Area / Station pages render in < 300 ms (Chrome devtools, throttling off).  
- New hooks live in `client/src/hooks/aggregations/` and are unit-tested.  
- No residual `// TODO P1`, `// TODO P2`, or `// ts-ignore` markers related to missing properties.

---

## 5 Session End Instructions  

1. Ensure Success Criteria met or list blockers here.  
2. Update `docs/api_alignment/API_TYPE_ALIGNMENT_MASTER_PLAN.md` – mark P3 status (`➖` or `✅`; add notes).  
3. `git add -A && git commit -m "phase P3: implement client aggregations (<domain>)"`  
4. `git push --set-upstream origin type-alignment/P3`  
5. Comment:  
   * Domains completed (Area, Station, Batch, …)  
   * Remaining TypeScript error count (should be 0)  
   * Performance observations or edge-case notes  
6. When Success Criteria satisfied, close **#P3** and ping maintainers to proceed to Phase P4.

---

### Let’s reach ✨zero-error TypeScript✨ and fully self-contained client KPIs! 🚀

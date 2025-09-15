# P1 – Adopt Snake_Case Properties Across Codebase  
_Phase: Type Alignment • Assignee: Code Droid_

---

## 1 Scope

After Phase P0 removed duplicate DTOs, **all network payloads now use auto-generated models** that expose backend-native **snake_case** fields.  
Many components, hooks and util functions still reference **camelCase** aliases (`feedingDate`, `totalBiomass`, …).  
This issue covers **mechanical refactoring** of every remaining camelCase property reference in `client/src/**` to its exact snake_case counterpart, plus minor logic tweaks to satisfy the stricter type checker.

*Out of scope*  
• Adding or removing endpoints  
• Implementing computed fields (handled in P3)  
• CI gate changes (handled by issues #11, #22)

---

## 2 Required Reading

1. `docs/api_alignment/FRONTEND_ADAPTATION_PRINCIPLES.md` – esp. section **3 Snake_Case All the Way**  
2. `docs/code_organization_guidelines.md` – import & naming conventions  
3. `docs/architecture.md` – query layer overview (locate hooks/components)  

_Read only relevant subsections; backend docs not needed._

---

## 3 Action Steps

| # | Task |
|---|------|
| 1 | **Checkout branch** `type-alignment/P1` off `develop` (or off merged P0 branch). |
| 2 | Run `npm run type-check` – record current error count (mostly camelCase errors). |
| 3 | Global search for camelCase data properties (e.g. `.feedingDate`, `.totalBiomass`) and **replace with snake_case equivalents** as defined in generated models. |
| 4 | Update object destructuring & hook selectors accordingly:<br>`const { feeding_date } = event;` |
| 5 | Remove fallback operators `?? camelCaseProp` – they should no longer exist. |
| 6 | Adjust TanStack Query `select` callbacks if they previously mapped camelCase. |
| 7 | Re-run `npm run type-check` after each directory batch; ensure incremental progress. |
| 8 | Commit frequently with descriptive messages (`phase P1: convert batch components to snake_case`). |

### Example Conversion

```tsx
// ❌ before
const rows = events.map(e => ({
  feedingDate: e.feeding_date,
  feedCost: Number(e.feed_cost),
}));

// ✅ after
const rows = events.map(e => ({
  feeding_date: e.feeding_date,
  feed_cost: Number(e.feed_cost),
}));
```

---

## 4 Common Patterns to Fix

| Pattern | Fix |
|---------|-----|
| **Destructuring camelCase** <br>`const { totalBiomass } = area` | Rename to snake_case or compute locally |
| **Optional fallback** <br>`e.feeding_date ?? e.feedingDate` | Remove fallback |
| **TS ignore** lines from P0 | Remove once property is corrected |
| **Local camelCase interfaces** extending models | Delete or convert property names |

---

## 5 Success Criteria

- `npm run type-check` reports **≤ 30 remaining errors**, none related to camelCase property names.  
- `grep -R "\.[a-z]*[A-Z][a-zA-Z]\+" client/src | wc -l` returns **0** data-property matches (UI prop names like `onClick` are fine).  
- Application runs in dev mode with no new runtime errors.  
- Commits pushed to `type-alignment/P1` branch.

---

## 6 Session End Instructions

1. Confirm Success Criteria; if blocked, describe blockers in this issue.  
2. Update **`docs/api_alignment/API_TYPE_ALIGNMENT_MASTER_PLAN.md`** – Progress Tracker: mark P1 status (`➖` or `✅`).  
3. `git add -A && git commit -m "phase P1: adopt snake_case in <area> (remaining errors: <n>)"`  
4. `git push --set-upstream origin type-alignment/P1`  
5. Comment on this issue summarising:  
   • Files updated / patterns automated  
   • Current TS error count  
   • Next recommended action / blockers  
6. When Success Criteria met, close **#P1** and notify maintainers.

---

Let’s bring the codebase 100 % in line with the backend contract! 🐟

# P0 – Purge Duplicate DTOs & Re-wire Imports  
_Phase: Type Alignment • Assignee: Code Droid_

---

## 1 Problem Statement  
`client/src/lib/types/django.ts` contains hand-written interfaces that duplicate – and drift from – the auto-generated models in `client/src/api/generated/**`.  
This shadow file is responsible for **~40 type errors** and is the root of subsequent mismatches.  
The first step toward contract-strict alignment is to delete this file and switch every import to the generated types.

---

## 2 Required Reading  
1. `docs/api_alignment/FRONTEND_ADAPTATION_PRINCIPLES.md` – rules for using only generated types  
2. `docs/code_organization_guidelines.md` – project style & import conventions  
3. `docs/architecture.md` – overview of query layer (for locating imports)

*(Skim only the relevant sections; no backend docs needed for this phase.)*

---

## 3 Action Steps  

| # | Task |
|---|------|
| 1 | Create branch `type-alignment/P0` off `develop` (or `main` if `develop` doesn’t exist). Open a fresh draft PR for this phase (do not reuse older alignment PRs). |
| 2 | Delete file **`client/src/lib/types/django.ts`**. |
| 3 | Global search for `from ".*types/django"` and **replace** with the corresponding generated model import. <br> • Example: `import { Feed } from "@/lib/types/django"` → `import { Feed } from "@/api/generated/models/Feed";` |
| 4 | If a local type has no generated equivalent, temporarily cast (`as any`) **but add a `// TODO P1` marker**. |
| 5 | Run `npm run lint --fix` to auto-sort imports. |
| 6 | Run `npm run type-check`; resolve any residual errors that still reference the deleted file. |
| 7 | Update docs tracker: mark **P0** “in-progress” or “done”. |

---

## 4 Success Criteria  
- `client/src/lib/types/django.ts` **no longer exists**.  
- **Zero** imports referencing that path (grep to confirm).  
- `npm run type-check` compiles; remaining errors are ≤ previous count – 40.  
- One commit: `phase P0: remove duplicate DTOs and fix imports`.

---

## 5 Tips & Common Issues  
• Use IDE rename-import feature to avoid typos.  
• Some components expect camelCase properties; keep casts minimal – full fix happens in Phase P1.  
• Watch for **barrel files** (`index.ts`) that re-export deleted interfaces.  
• If a generated type is a union (e.g., `string | null`), adjust code instead of adding a local helper type.  

---

## 6 Session End Instructions  
1. Confirm Success Criteria.  
2. Update **`docs/api_alignment/API_TYPE_ALIGNMENT_MASTER_PLAN.md`** ‑ Progress Tracker → mark P0 status.  
3. `git add -A && git commit -m "phase P0: remove duplicate DTOs & rewire imports"`  
4. Push branch and open PR **draft** referencing this issue (`Fixes #P0`).  
5. Comment here summarising: remaining TS error count, tricky files, next recommended action.  
6. Await review or proceed to P1 once merged.

---

*Note: Always use a fresh PR per phase; rebase any existing related PRs after this phase merges.*

Let’s purge the duplicates and get one step closer to ✨zero-error TypeScript✨.

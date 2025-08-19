# DROID QUICK START  
_AquaMind-Frontend • API Type Alignment_

A one-page cheat-sheet for **Code Droids** (and Reliability Droids) working on the contract-strict initiative.  
Scan → act → commit → push.

---

## 1 Pick Your Phase

1. Open `docs/api_alignment/API_TYPE_ALIGNMENT_MASTER_PLAN.md`.
2. Find the first phase whose **Status** ≠ ✅.
3. Open the matching GitHub issue (`#P0`, `#P1`, `#P2`, `#P3`, …).
4. Create / checkout branch `type-alignment/<phase>`.

---

## 2 Read Before You Code

Minimal required context per session:

| What | Where |
|------|-------|
| Phase tasks & exit criteria | GitHub issue body |
| Non-negotiable architecture rules | `docs/api_alignment/FRONTEND_ADAPTATION_PRINCIPLES.md` |
| Coding style & import rules | `docs/code_organization_guidelines.md` |
| Query layer reference | `docs/architecture.md` (Data-flow section) |

_No backend docs needed for type-alignment phases._

---

## 3 Core Commands

```bash
# install deps (once per container)
npm ci

# run dev server
npm run dev

# auto-fix lint
npm run lint --fix

# type checking gate
npm run type-check

# unit tests (optional)
npm test
```

---

## 4 Session Checklist

1. **Implement** tasks listed in phase issue.  
2. Run `npm run lint --fix` and `npm run type-check` until clean or until only expected errors remain.  
3. Update **Progress Tracker** table in `API_TYPE_ALIGNMENT_MASTER_PLAN.md`.  
4. `git add -A && git commit -m "phase <X>: <summary> (remaining TS errors: <n>)"`  
5. `git push --set-upstream origin type-alignment/<phase>`.  
6. Comment on the phase issue:  
   - What you changed  
   - Current TypeScript error count  
   - Next recommended action / blockers  
7. If exit criteria met → close the issue (or mark ready for review).

---

## 5 Golden Rules

1. **Backend is frozen** – treat OpenAPI spec as law.  
2. **Only generated models** (`@/api/generated/...`) – no local DTOs.  
3. **snake_case everywhere** – no camelCase API props.  
4. Compute KPIs **client-side by default**.  
5. Keep commits _small & scoped_ (one domain or pattern per commit).  
6. Never leave `// ts-ignore` without a linked TODO + phase reference.

---

## 6 Need Help?

* Check the phase issue “Troubleshooting” section.  
* Search repo discussions (`Ctrl+Shift+F` for similar patterns).  
* If stuck >10 min, comment in the issue and await human guidance.

---

Happy aligning & may your TypeScript always be **zero-error**! 🐟

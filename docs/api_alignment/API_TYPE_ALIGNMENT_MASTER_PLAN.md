# API Type Alignment Master Plan  
_AquaMind-Frontend ↔ Backend • Contract-Strict Initiative_  

---

## 1 Purpose & Context  
The backend OpenAPI specification is frozen and **the single source of truth**.  
All TypeScript errors in the frontend originate from diverging local DTOs, camelCase props, and legacy endpoints.  
This plan orchestrates a multi-phase, strictly typed alignment so that:

* `npm run type-check` exits **0**.  
* No local DTOs exist; only generated types are used.  
* CI endpoint validator is re-enabled as blocking.  

Progress is event-driven (phases), not time-based, optimised for Code Droid execution.

---

## 2 Phases & Exit Criteria  

| Phase | Goal | Mandatory Exit Criteria | Blocking Issues* |
|-------|------|-------------------------|------------------|
| **P0 – Type Purge** | Remove duplicate local DTOs | • `client/src/lib/types/django.ts` deleted  <br>• Build compiles (may still error) | #P0 |
| **P1 – Snake_Case Adoption** | Replace camelCase props | • No camelCase property references in `src/`  <br>• Type errors linked to case mismatch = 0 | #P1 |
| **P2 – Query Fix-up** | All components fetch via `ApiService` | • No hard-coded `/api` strings (lint pass)  <br>• All wrong service names corrected | #P2 |
| **P3 – Client Aggregations** | Compute missing props locally | • Hooks / selectors derive KPIs  <br>• Type errors count = 0 | #P3 |
| **P4 – Reliability Gate** | Lock contract | • `npm run type-check` & `validate:endpoints` **blocking** in CI  <br>• Pre-commit hook prevents local DTOs | #11 #12 #21 #22 |

\* “Blocking Issues” column lists the GitHub issue that must be closed to mark the phase complete.

---

## 3 Progress Tracker  

_Code Droids update this table at the end of every session._

| Phase | Status | Started At | Completed At | Notes |
|-------|--------|-----------|--------------|-------|
| P0 | ✅ | 2025-08-19 | 2025-08-19 | Deleted client/src/lib/types/django.ts; removed local DTO dependency |
| P1 | ✅ | 2025-08-19 | 2025-08-19 | Adopted snake_case across inventory/broodstock pages; aligned pagination shapes |
| P2 | ✅ | 2025-08-19 | 2025-08-19 | All queries migrated to ApiService wrappers with semantic React Query keys; endpoint validator 0 invalid |
| P3 | ☐ | — | — | — |
| P4 | ☐ | — | — | — |

### Phase P2 – Session Notes (2025-08-19)
- Replaced raw fetch paths with `lib/api.ts` ApiService wrappers across rings, inventory, broodstock, and batch analytics components  
- Introduced semantic query keys (domain/resource pattern) and removed string URL keys  
- Preserved snake_case and paginated shapes; added safe placeholder arrays where backend coverage is pending  
- Verified: `npm run type-check` passes; `npm run validate:endpoints` reports **0 invalid endpoints**

Legend: ☐ not-started · ➖ in-progress · ✅ done

## PR Strategy

Create a new draft PR per phase on branch `type-alignment/<phase>` (base off `develop` or `main`).  
After a phase merges, rebase or cherry-pick any related open PRs onto the updated base.

---

## 4 Work Instructions for Code Droids

1. Checkout branch `type-alignment/<phase>` (create if missing)  
2. Read Required Reading in the corresponding GitHub issue  
3. Complete tasks listed under “Action Steps” in that issue  
4. Run `npm run type-check` and `npm run validate:endpoints`  
5. Update the Progress Tracker table above  
6. Commit with a clear message and reference the issue when applicable  
7. Push the branch and open a draft PR per phase  
8. Comment in the issue summarising changes, remaining gaps, and next actions

---


| `#P1` | Replace camelCase property references | P1 | Same as above |
| `#P2` | Migrate all network calls to ApiService | P2 | `docs/architecture.md` (query layer), `api/openapi.yaml` |
| `#P3` | Implement client-side aggregations & remove residual TS errors | P3 | Component-specific docs noted inside issue |
| `#11` | Make CI endpoint validation blocking | P4 | Existing issue |
| `#12` | Documentation final pass & contract freeze | P4 | Existing issue |
| `#21` | Add frontend-backend integration tests | P4 | Existing issue |
| `#22` | Add pre-commit hooks for API validation | P4 | Existing issue |

_Backend FCR investigation is separate (`AquaMind` repo) and not part of the type alignment critical path._

---

## 6 Session Checklist  

At the end of **every** Code Droid session:

- [ ] All automated tests (if any), `npm run type-check`, and `npm run validate:endpoints` executed locally  
- [ ] Progress Tracker table updated  
- [ ] Commit & push to branch  
- [ ] GitHub issue comment posted with:  
  - Summary of changes  
  - Remaining errors / blockers  
  - Next recommended action  

If phase exit criteria are satisfied, close the phase issue and ping the next phase assignee.

---

### Ready, set, align! 🚀

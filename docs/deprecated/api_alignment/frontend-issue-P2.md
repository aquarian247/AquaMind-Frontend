# P2 – Migrate All Network Calls to `ApiService`
_Phase: Type Alignment • Assignee: Code Droid_

---

## 1 Scope  
After P1 every model reference is snake_case and imported from the generated client, but many components still:

* call `fetch()`, `axios`, or the legacy `django-api.ts` wrapper  
* embed literal paths such as `"/api/v1/batch/batches/"`  
* reference outdated `ApiService` method names (`apiV1ScenarioScenariosConfigurationRetrieve`, …)

Phase P2 replaces **every** non-generated network call with the canonical functions in  
`client/src/api/generated/services/ApiService.ts`.

_What’s **not** in scope_  
• Calculating derived fields (handled in P3)  
• CI gate changes (#11, #22)  

---

## 2 Required Reading  

1. `docs/api_alignment/FRONTEND_ADAPTATION_PRINCIPLES.md` – §2 *Auto-Generated Types Only*  
2. `docs/architecture.md` – Data-fetching section (`lib/api.ts`, TanStack Query)  
3. `docs/code_organization_guidelines.md` – import style & barrel files  
4. `api/openapi.yaml` or generated `services/` folder – find correct method names  

_Read only the sections listed above; backend docs are **not** required._

---

## 3 Action Steps  

| # | Task |
|---|------|
| 1 | **Create branch** `type-alignment/P2` off `develop` (or merged P1). |
| 2 | Search codebase for non-generated calls:  <br>• `fetch(`  <br>• `axios.`  <br>• `"/api/`  <br>• `django-api` |
| 3 | Replace each call with the equivalent `ApiService.*` method.  <br>_Tip_: use IDE “go to symbol” inside `ApiService` to locate methods. |
| 4 | Fix compiler errors (`TS2551`) by updating to real method names now present in generated client. |
| 5 | Delete unused helpers: `client/src/lib/django-api.ts`, any proxy rewrite remnants. |
| 6 | Refactor TanStack Query hooks to return the `Promise` from `ApiService` directly. |
| 7 | Centralise auth / base URL in `lib/api.ts` (ensure calls no longer set their own `fetch`). |
| 8 | Run `npm run lint --fix` and `npm run type-check` until only non-networking errors remain. |
| 9 | Commit per domain slice (`phase P2: migrate Batch pages`, etc.). |

### Recommended Grep Patterns

```
fetch(
axios\.
['"]/api/v1
django-api
ApiService\.apiV1[A-Za-z]+(?:List|Retrieve|Create|Update|Destroy)  // outdated names
```

---

## 4 Examples  

### 4.1 Replacing `fetch()`  

```ts
// ❌ before
const response = await fetch("/api/v1/batch/batches/");
const data = await response.json();

// ✅ after
const data = await ApiService.apiV1BatchBatchesList({});
```

### 4.2 Fixing Wrong Service Name  

```ts
// ❌ TS2551
ApiService.apiV1ScenarioScenariosProjectionsList(id);

// ✅ correct
ApiService.apiV1ScenarioScenariosRetrieveProjections(id);
```

### 4.3 Custom Wrapper Removal  

```ts
// ❌ before
import { getJson } from "@/lib/django-api";
getJson("/api/v1/inventory/feeds/");

// ✅ after
ApiService.apiV1InventoryFeedsList({});
```

---

## 5 Success Criteria  

* `grep -R '"\\/api\\/v1' client/src | wc -l` → **0** matches.  
* No remaining `fetch(` or `axios.` backend calls.  
* No `TS2551` errors for missing `ApiService` methods.  
* App runs in dev mode with no 404s in browser console.  
* `client/src/lib/django-api.ts` deleted and unreferenced.

---

## 6 Session End Instructions  

1. Verify Success Criteria or describe blockers in this issue.  
2. Update `docs/api_alignment/API_TYPE_ALIGNMENT_MASTER_PLAN.md` – set P2 status (➖ or ✅).  
3. `git add -A && git commit -m "phase P2: migrate <area> to ApiService (remaining TS errors: <n>)"`  
4. `git push --set-upstream origin type-alignment/P2`  
5. Comment here with:  
   * End-to-end list of endpoints converted  
   * Remaining TypeScript error count  
   * Any missing endpoints in `ApiService` (open new issue if spec gap)  
6. When Success Criteria met, close **#P2** and hand off to Phase P3.

---

Let’s eliminate stringly-typed endpoints and speak the backend’s language everywhere 🌊

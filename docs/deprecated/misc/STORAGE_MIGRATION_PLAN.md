# Storage Migration Plan  
_File: docs/STORAGE_MIGRATION_PLAN.md_  
_Audience: Front-end & Back-end developers, QA, DevOps_  
_Status: DRAFT – ready for review_  

---

## 1 Why We’re Migrating Away from `server/storage.ts`

| Issue | Impact |
|-------|--------|
| **Monolithic mock database** – 3 000+ lines of hard-coded objects | Hard to read, slow to load, brittle to edits |
| **Schema drift** – diverges from Django models & OpenAPI spec | Compile errors, runtime surprises, CI flakes |
| **Duplicate business logic** – Express re-implements back-end behaviour | Double maintenance, inconsistent rules |
| **Build instability** – frequent truncation & syntax errors (`Unexpected end of file`) | Breaks `npm run build`, blocks CI |
| **Poor test specificity** – all data returned, no way to focus on a single case | Slows UI development, hides edge-cases |

To support the **API Contract Unification Plan** (§3.1 of `aquamind/docs/progress/api_contract_unification_plan.md`) we must replace this legacy mock with something lighter, spec-driven, and easier to toggle on/off.

---

## 2 What Replaces It: `server/mock-api.ts`

| Aspect | `storage.ts` (legacy) | `mock-api.ts` (new) |
|--------|----------------------|---------------------|
| Data volume | ~15 000 lines including helper maths | ≈250 lines of **minimal** sample records |
| Source-of-truth | Ad-hoc TypeScript interfaces | Structures **copied from the OpenAPI spec** |
| Toggle | hard-wired Express dependency | `shouldUseMockApi()` checks `VITE_USE_MOCK_API` / `VITE_USE_DJANGO_API` |
| Maintenance | manual edits whenever models change | regenerate small fixtures or stub generators |
| Express coupling | tightly coupled `storage` class | simple route handlers registered via `registerMockApiRoutes(app)` |

---

## 3 Migration Steps

1. **Add the new file**  
   `server/mock-api.ts` – already committed in feature branch `feature/api-contract-unification`.

2. **Register conditional routes**  
   In `server/index.ts` (or equivalent Express entry) add:  
   ```ts
   import { registerMockApiRoutes, shouldUseMockApi } from './mock-api';
   if (shouldUseMockApi()) registerMockApiRoutes(app);
   ```
   Remove the old `import { storage } from './storage'` lines and any usage.

3. **Delete legacy files** (after PR review)  
   ```
   git rm server/storage.ts
   git rm server/routes.ts  // now redundant mock routes
   ```

4. **Update environment defaults**  
   - `.env.example`: set `VITE_USE_MOCK_API=true` for default dev behaviour.  
   - CI pipelines that rely on Django (backend tests) should export `VITE_USE_DJANGO_API=true` instead.

5. **Refactor UI data hooks (if any)**  
   Any component that imported helpers from `server/storage` (rare) should be switched to fetch via HTTP using the generated API client.

6. **Run regression suite**  
   - `npm run build` (front-end TS compile)  
   - `npm run dev` and manually hit a few pages  
   - `pytest` + Schemathesis in back-end: unaffected

7. **Open PR & merge**  
   Title: `chore: replace legacy storage.ts with lightweight mock-api.ts`  
   Label: `spec-sync` to trigger Review-Droid.

---

## 4 How to Use the New System

| Scenario | Environment variable setup | Expected behaviour |
|----------|---------------------------|--------------------|
| **Local UI dev (no Docker)** | `VITE_USE_MOCK_API=true` _(default)_ | Express serves mock endpoints, instant start-up |
| **Integrated dev env (Docker compose running Django)** | `VITE_USE_DJANGO_API=true` | Front-end proxies all `/api/*` calls to Django container |
| **CI – Front-end** | `VITE_USE_MOCK_API=true` | No dependency on Python services, faster pipeline |
| **CI – Contract tests** | `VITE_USE_DJANGO_API=true` | Schemathesis hits real Django API |

To switch modes at runtime, restart the Vite dev server after changing `.env`.

---

## 5 Benefits of the New Approach

1. **Spec-Driven** Mock responses always match the canonical OpenAPI schema.  
2. **Tiny Footprint** Hundreds of lines vs. thousands – easy code reviews.  
3. **Toggle-able** One env-var flips between mock and real back-end.  
4. **Faster Builds** No large TypeScript bundle, no esbuild crash risk.  
5. **Focused Testing** Fixtures intentionally minimal → easier to craft edge-cases.  
6. **Clear Ownership** UI team owns mock; back-end team owns Django; contract keeps them in sync.

---

## 6 Alignment with the API Contract Unification Plan

| Plan Section | Alignment |
|--------------|-----------|
| **§3.2 Front-end – Generate TS client** | mock handlers use the same DTOs generated from `openapi.yaml`. |
| **§3.3 Cross-Repo Automation** | When spec changes, regenerated types surface any mismatch in mocks immediately. |
| **§3.4 Contract Validation** | Mock layer is optional in CI; Schemathesis still exercises real back-end. |
| **Known Issue KI-4** *(TypeScript errors)* | Eliminates most `results/null`-style errors by shrinking custom code. |
| **Success Criterion #1** (*single source of truth*) | Storage logic no longer competes with Django; only OpenAPI remains authoritative. |

---

## 7 Open Tasks & Owners

| Task | Owner | Due |
|------|-------|-----|
| Remove `storage.ts`, `routes.ts` | Front-end Code-Droid | PR day |
| Update `.env.example` & docs | Docs-Droid | PR day |
| Verify CI matrix (mock vs Django) | DevOps | +1 day |
| Notify team via Slack `#aquadev` | PM | After merge |

---

_Once merged, the legacy mock database is gone for good. The front-end remains fully functional offline, yet seamlessly switches to real data whenever the Django API is available._

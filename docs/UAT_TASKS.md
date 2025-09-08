# UAT Tasks Plan (Frontend)

Purpose: Achieve UAT readiness with clean authentication, consistent docs/config, and a simple, reliable test setup.

## Priorities
1. Authentication alignment (spec → generated client → app usage)  
2. Testing cleanup (MSW removed; using simple fetch/client mocks)  
3. Configuration & documentation consistency  
4. Remove misleading fallbacks; raise coverage gates gradually  

---

## Task 1 — Canonicalize Auth Endpoints in OpenAPI & Regenerate Client
**Summary**
Align OpenAPI spec with actual working JWT endpoints from backend.
Add the working JWT endpoints that backend actually implements:
* `POST /api/v1/auth/token/` (login)
* `POST /api/v1/auth/token/refresh/` (refresh)

**Files**
* `api/openapi.yaml`

**Steps**
1. Ensure the canonical JWT endpoints `/api/v1/auth/token/` and `/api/v1/auth/token/refresh/` are properly defined in OpenAPI spec
2. Remove legacy endpoints (`/api/token/`, `/api/auth/jwt/`) that are not the canonical implementation
3. Align schemas with `djangorestframework-simplejwt` response formats
4. Run `npm run generate:api` and commit `client/src/api/generated`

**Acceptance Criteria**
* Generated client exposes JWT auth methods under `/api/v1/auth/token/…`
* Endpoints match what backend actually implements
* No broken 404 endpoints in spec
* `npm run type-check` passes

**Verification**
* `grep -R "/api/token" client/src/api/generated` shows both endpoints
* `npm run build` succeeds

---

## Task 2 — Align Frontend Auth Config to Working JWT Endpoints
**Summary**
Point all auth config to the actual working JWT endpoints from backend.

**Files**
* `client/src/config/auth.config.ts`
* `client/src/services/auth.service.ts` (update any hardcoded URLs)

**Steps**
* Set `login` → `/api/v1/auth/token/`
* Set `refresh` → `/api/v1/auth/token/refresh/`
* Update any hardcoded endpoint references in auth service
* Leave `profile` as `/api/v1/users/auth/profile/` if backend provides it

**Acceptance Criteria**
All auth endpoints point to working JWT endpoints from backend
No references to broken 404 endpoints

**Verification**
Auth service uses working endpoints that match backend logs

---

## Task 3 — Update AuthContext to Use Generated Client Only
**Summary**
Remove manual fetches & TS casts; rely on generated client for working JWT endpoints.

**Files**
* `client/src/contexts/AuthContext.tsx`
* `client/src/services/auth.service.ts`

**Steps**
1. Replace manual fetch calls with generated client methods
2. Use correct JWT endpoints that match backend implementation
3. Delete any TS casts used to bypass model issues
4. Ensure auth flows work with generated client

**Acceptance Criteria**
* ✅ COMPLETED: No manual fetch calls in auth service
* ✅ COMPLETED: Auth service uses generated client methods
* ✅ COMPLETED: No TS casts in AuthContext
* ✅ COMPLETED: `npm run type-check && npm run lint && npm run test` pass

**Verification**
* Auth flows work via generated client methods
* No hardcoded endpoint URLs in auth service

---

## Task 4 — MSW Removal ✅ COMPLETED
**Summary**
MSW has been completely removed; tests now use simple fetch or client mocks.

**Files**  
* `client/src/setupTests.ts` (updated)  
* `client/src/test/msw/*` (deleted)

**Steps Completed**  
1. ✅ Deleted MSW imports/event listeners in `setupTests.ts`.  
2. ✅ Removed `client/src/test/msw` directory.
3. ✅ Removed MSW from `package.json` dependencies.

**Acceptance Criteria**  
* ✅ No `msw` references.  
* ✅ `npm run test` passes (79 tests).

**Verification**  
`grep -R "msw" client/src` returns nothing - ✅ VERIFIED.

---

## Task 5 — Raise Coverage Thresholds
**Summary**  
Increase gates to encourage real testing.

**Files**  
* `vite.config.ts`

**Steps**  
Set thresholds: **lines 40, statements 40, functions 30, branches 20**.

**Acceptance Criteria**  
`npm run test:ci` passes or reveals genuine gaps.

**Verification**  
Check `client/coverage/` report.

---

## Task 6 — Remove Misleading Fallback Values
**Summary**  
Delete unrealistic hard-coded numbers; isolate dev-only fallbacks.

**Files**  
* `client/src/lib/api.ts`

**Steps**  
1. Search for `3500`, `21805000`, etc.  
2. Replace with generated client calls **or** `devFallbacks.ts` gated by `VITE_USE_DJANGO_API`.

**Acceptance Criteria**  
No unrealistic constants in production path; lint/type-check pass.

**Verification**  
`grep -R "21805000\\|3500" client/src/lib` → empty or dev-only module.

---

## Task 7 — Environment Variable Consistency Audit
**Summary**  
Remove obsolete env var names.

**Files** — *repo-wide*

**Steps**  
`grep -R "VITE_USE_BACKEND_API\\|VITE_BACKEND_API_URL" -n .` should return no matches (environment variables have been standardized).

**Acceptance Criteria**  
No old env names remain.

**Verification**  
Grep returns no matches.

---

## Task 8 — Documentation Verification Pass
**Summary**  
Ensure docs reflect final state (generated client, canonical auth, Vitest, no MSW).

**Files**  
* `README.md`  
* `docs/CONTRIBUTING.md`  
* `docs/frontend_testing_guide.md`  
* `docs/DJANGO_INTEGRATION_GUIDE.md`  
* `docs/code_organization_guidelines.md`

**Steps**  
Search for `MSW`, legacy env vars, `/api/token`, `/api/auth/jwt`.

**Acceptance Criteria**  
Docs are consistent; no stale references.

**Verification**  
Manual scan or grep of docs.

---

## Task 9 — Express/Server Parity Check
**Summary**  
Validate dev proxy & mock API respect `VITE_USE_DJANGO_API`.

**Files**  
* `server/index.ts`  
* `server/mock-api.ts`

**Steps**  
1. Confirm only `VITE_USE_DJANGO_API` env flag used.  
2. Ensure proxy paths align with `/api/v1/*`.

**Acceptance Criteria**  
Only `VITE_USE_DJANGO_API` environment variable used; correct routing.

**Verification**  
Run dev server; `curl` a couple of endpoints.

---

## Task 10 — Add Targeted Auth Tests
**Summary**  
Add minimal suite for login / refresh logic.

**Files**  
* Auth service & context files  
* New test files under `client/src/**/__tests__`

**Steps**  
1. Mock generated client responses.  
2. Cover: login success, login 401, refresh success, expired refresh → logout.

**Acceptance Criteria**  
Tests deterministic; coverage bumps for auth modules.

**Verification**  
`npm run test` passes; coverage numbers increase.

---

## Execution Notes
* Prefer **small, single-purpose PRs** (≤ 300 LOC).  
* Always run `npm run type-check && npm run lint && npm run test` before PR.  
* Regenerate client whenever the OpenAPI spec changes (`npm run generate:api`).

---

## Current Status & Next Steps

### ✅ **Task 3 COMPLETED**
- AuthContext uses generated client exclusively
- No manual fetch calls or TS casts
- All quality gates pass (type-check, lint, test)

### ⚠️ **Critical Discovery from Backend Issue #40**
The UAT_TASKS.md was based on incorrect assumptions about "canonical" endpoints:
- **Broken**: `/api/v1/auth/token/` (404 Not Found)
- **Working**: `/api/v1/auth/token/` and `/api/v1/auth/token/refresh/` (JWT endpoints)
- **Missing**: OpenAPI spec doesn't document the working endpoints!

### 🎯 **Corrected Path Forward**
1. **Task 1 (REVISED)**: Ensure canonical JWT endpoints are properly documented in OpenAPI spec
2. **Task 2 (REVISED)**: Update auth config to use `/api/v1/auth/token/` endpoints
3. **Task 3**: ✅ **COMPLETED** - AuthContext uses generated client
4. Continue with Tasks 4-10 as planned

### **Immediate Action Items**
1. Ensure OpenAPI spec properly documents `/api/v1/auth/token/` and `/api/v1/auth/token/refresh/`
2. Update auth service to use these endpoints
3. Regenerate API client
4. Update documentation with correct endpoints

## Definition of Done (UAT Readiness)
* Auth flows use **working JWT endpoints** via generated client; **no hacks**
* MSW completely removed; tests stable with simple fetch/client mocks
* Env/config/docs consistent with actual backend implementation
* No misleading fallbacks; coverage gates raised & green  

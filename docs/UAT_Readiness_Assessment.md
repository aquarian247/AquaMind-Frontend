# AquaMind-Frontend UAT Readiness Assessment

Date: 2025-09-06  
Author: Droid (Factory AI)  
Scope: Analysis-only (no code changes performed)

---

## Executive Summary

Status: **Not UAT-ready**

High-risk blockers were identified in authentication endpoints and token models, environment configuration inconsistencies, and mismatches between documentation and implementation. Testing configuration is not enforcing meaningful quality bars. These issues will likely cause authentication failures, integration confusion, and unreliable UAT outcomes if not addressed pre-UAT.

Top blockers (must fix before UAT):

* Authentication endpoint misalignment across config, generated client, and OpenAPI spec [5][6][11]
* TokenRefresh model/type generation error requiring type casts [6][10]
* Inconsistent environment variables across docs vs code [12][13]
* Test script/documentation mismatch; MSW disabled but partially referenced [1][3][4]
* Coverage thresholds set extremely low (effectively non-gating) [2]

---

## Methodology

* Reviewed configuration, authentication and API integration code paths  
* Cross-checked OpenAPI specification against generated client and auth config  
* Assessed testing setup, MSW usage, and coverage thresholds  
* Validated documentation claims against actual repository files  

(References use [n] mapped in *Sources*.)

---

## Detailed Findings

### 1) Authentication Architecture

* Endpoints disagree across layers  
  * Config expects `/api/v1/users/auth/token/`, `/api/v1/users/auth/token/refresh/`, `/api/v1/users/auth/profile/` [5]  
  * OpenAPI defines `/api/v1/auth/token/`, plus alternative JWT routes (`/api/auth/jwt/*`, `/api/token/*`) [11]  
  * Generated client is built from the OpenAPI spec and thus lacks the `/api/v1/users/auth/*` endpoints that **AuthContext** calls (e.g., `apiV1UsersAuthProfileRetrieve`, `apiV1UsersAuthTokenRefreshCreate`) [6][11]
* **TokenRefresh** model/type issue  
  * Generated `TokenRefresh` incorrectly includes a readonly `access` field—request should send only `refresh`, response returns `access` [10]  
  * AuthContext works around this with a type-cast when calling refresh, indicating schema/client mismatch [6]
* Mixed authentication paths increase fragility and confusion (manual AuthService plus OpenAPI client token handling) [6][7][8]

Impact: Login/refresh flows are prone to break at runtime; UAT testers may be blocked at authentication.

Target state:

* Single canonical set of endpoints in OpenAPI spec (and backend) used by generated client  
* AuthContext calls only generated methods; no type-casts needed  
* Auth config aligns with generated client and backend URLs  

---

### 2) Environment Configuration

* Environment variables have been standardized on `VITE_USE_DJANGO_API` for consistent configuration [12][13]
* README & CONTRIBUTING largely standardize on `VITE_USE_DJANGO_API`, but stray references can misconfigure dev/test environments [12][13]

Impact: Misconfiguration risk and time lost diagnosing “wrong backend” routing during UAT.

Target state: One variable (`VITE_USE_DJANGO_API`) consistently used across code and docs.

---

### 3) Testing Configuration & MSW

* Coverage thresholds: lines/statements/functions 10 %, branches 5 % [2]  
* Docs say `npm run test` is watch mode, but `package.json` runs `vitest run` (one-off) [1][4]  
* MSW documented as disabled and is disabled in setup, but residual instrumentation remains [3][4]

Impact: Low quality gating; confusion about test execution; MSW residual code may mislead.

Target state:

* Scripts/docs agree on test behaviour  
* Clear policy on MSW (fully enabled or removed)  
* Coverage thresholds raised to meaningful levels (e.g., 50 % lines, 30–40 % branches)

---

### 4) Documentation Integrity

* README and guides reference non-existent files (e.g., `client/src/lib/django-api.ts`, `DJANGO_API_ALIGNMENT.md`) [13]
* Testing guide claims conflict with actual scripts/config [1][2][4]

Impact: Onboarding friction; UAT instructions may be misleading.

Target state: Remove stale references; ensure how-to sections match current repo.

---

### 5) API Integration Consistency

* Unified API layer is powerful, but fallback code contains hard-coded values and non-standard paths that could hide backend mismatches  
* OpenAPI spec includes overlapping/legacy auth routes, increasing confusion [11]

Impact: Hidden discrepancies surface late; inconsistent data during demos/tests.

Target state: Eliminate critical hard-coded fallbacks; align OpenAPI to a single, versioned set of endpoints.

---

## Readiness Assessment (UAT Criteria)

| Area | Status | Key Risks |
|------|--------|-----------|
| Authentication flows | ❌ At risk | Endpoint & schema mismatches [5][6][10][11] |
| Environment toggles   | ❌ At risk | Variable inconsistencies [12][13] |
| Testability           | ⚠️ Weak   | Low coverage, script/doc mismatch [1][2][4] |
| Documentation clarity | ⚠️ Weak   | Stale file references [4][12][13] |

**Conclusion:** Not UAT-ready until critical blockers below are resolved.

---

## Remediation Plan (Pre-UAT)

1. **Resolve Authentication Endpoint Conflicts (High)**  
   * Decide canonical auth endpoints (recommend `/api/v1/auth/token/`, `/api/v1/auth/token/refresh/`, plus `/api/v1/users/auth/profile/`) [11]  
   * Update OpenAPI spec; remove overlapping legacy variants [11]  
   * Regenerate client; ensure generation command matches checked-in spec [1][11]  
   * Update `auth.config.ts` and AuthContext; remove type casts [5][6][10]

2. **Standardize Environment Variables (High)**  
   * Environment variables standardized on `VITE_USE_DJANGO_API` exclusively [12][13]

3. **Fix Testing Configuration & Policy (High)**  
   * Align script behaviour and docs (`vitest` watch vs run) [1][4]  
   * Decide on MSW: fully enable (server.listen/reset/close) or delete residual code [3][4]  
   * Raise coverage thresholds to meaningful levels [2]

4. **Repair Documentation (Medium)**  
   * Remove or restore missing files referenced in docs [13]  
   * Ensure integration guide reflects generated client usage and URLs [13]

5. **Remove/Replace Hard-coded Fallbacks (Medium)**  
   * Replace critical fallback constants with explicit “No data available” states or feature flags

---

## Verification Steps (Pre-UAT Checklist)

* ✅ Login succeeds via canonical endpoint; profile retrieval works through generated client [5][6][11]  
* ✅ Refresh succeeds without type casts; `TokenRefresh` request carries only `refresh`; response returns `access` [6][10]  
* ✅ All docs reference `VITE_USE_DJANGO_API`; backend switching unambiguous [12][13]  
* ✅ `npm run test` behaviour matches docs; coverage gates respected [1][2][4]  
* ✅ MSW policy explicit and consistent with setup [3][4]

---

## Post-UAT Hardening (Recommended)

* Expand unit/integration tests for auth flows, data processing, and error boundaries [2][4]  
* Standardize API calls on generated client; minimise custom fetch layers [6][7][8]  
* Keep OpenAPI spec as single source of truth; regenerate client on backend changes [1][11]

---

## Sources

1. **package.json** – scripts  
2. **vite.config.ts** – coverage thresholds  
3. **client/src/setupTests.ts** – MSW disabled, instrumentation  
4. **docs/frontend_testing_guide.md** – test scripts & MSW guidance  
5. **client/src/config/auth.config.ts** – auth endpoints (`/api/v1/users/auth/*`)  
6. **client/src/contexts/AuthContext.tsx** – non-generated endpoints, token refresh cast  
7. **client/src/services/auth.service.ts** – manual token handling  
8. **client/src/api/generated/core/request.ts** – `Authorization: Bearer` header  
9. **client/src/api/generated/models/TokenObtainPair.ts** – generated model  
10. **client/src/api/generated/models/TokenRefresh.ts** – readonly `access` issue  
11. **api/openapi.yaml** – overlapping auth endpoints  
12. **docs/CONTRIBUTING.md** – mixed env vars  
13. **README.md** – non-existent file references, env vars  

*File paths refer to the repository state at the time of this assessment.*

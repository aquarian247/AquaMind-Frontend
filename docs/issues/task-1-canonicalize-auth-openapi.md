# Task 1 — Canonicalize Auth Endpoints in OpenAPI & Regenerate Client

## Executive Summary
OpenAPI currently defines **duplicate** authentication routes (legacy `/api/auth/jwt/*` and `/api/token/*`) while the application and docs standardize on `/api/v1/auth/token/` + `/api/v1/auth/token/refresh/`.  
The generated TypeScript model **`TokenRefresh`** marks `access` as **readonly**, forcing a type-cast workaround in `AuthContext`. Canonicalize the spec to a single pair of JWT endpoints and regenerate the client so application code can drop hacks and align with documentation [1] [2] [3] [4] [5] [6].

Highlights  
• Duplicates present: `/api/auth/jwt/*`, `/api/token/*`, `/api/v1/auth/token/` [1]  
• Missing canonical refresh path `/api/v1/auth/token/refresh/` (exists today as `/api/token/refresh/`) [1]  
• Generated model `TokenRefresh` has `readonly access`, causing TS casts [2] [3]  
• Front-end config expects canonical endpoints but is inconsistent for refresh (login OK, refresh wrong path) [4] [5]

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Canonicalize Auth Endpoints in OpenAPI & Regenerate Client

### Background
`api/openapi.yaml` currently exposes **three** auth endpoint families:

* `/api/auth/jwt/*`
* `/api/token/*`
* `/api/v1/auth/token/*`

Docs and frontend standardize on the `/api/v1/auth/token/*` pair.  
The generated model `TokenRefresh` incorrectly treats `access` as `readonly` on the request body, forcing TS casts in `AuthContext`.

### Goals
1. Single canonical pair only  
   • POST `/api/v1/auth/token/` (login)  
   • POST `/api/v1/auth/token/refresh/` (refresh)  
2. Remove legacy duplications: `/api/token/*` and `/api/auth/jwt/*`  
3. Fix refresh request model so body is `{ refresh: string }` (no `readonly`), response contains `{ access: string }`.

### Scope
* Update `api/openapi.yaml` paths & schemas.  
* Regenerate client (`client/src/api/generated`) via `npm run generate:api`.  
* No app-code edits besides what’s required for compilation (follow-ups in Task 2/3).

### Detailed Requirements
#### 1  Paths
Keep:  
```
POST /api/v1/auth/token/
POST /api/v1/auth/token/refresh/
```
Delete all `/api/token/*` and `/api/auth/jwt/*` routes.

#### 2  Schemas (`components/schemas`)
Add:

```yaml
TokenRefreshRequest:
  type: object
  required: [refresh]
  properties:
    refresh:
      type: string

TokenRefreshResponse:
  type: object
  required: [access]
  properties:
    access:
      type: string
```

In the refresh path:

* `requestBody` → `$ref: '#/components/schemas/TokenRefreshRequest'`
* `200` response → `$ref: '#/components/schemas/TokenRefreshResponse'`

Ensure **no** schema marks `access` as `readonly` in the request model.

#### 3  Regenerate client & verify
```
npm run generate:api
```
* Generated services expose both canonical endpoints.  
* `client/src/api/generated/models/TokenRefresh.ts` is no longer used as a request requiring `access`.

### Acceptance Criteria
* `api/openapi.yaml` contains only the canonical pair under `/api/v1/auth/token/*`.  
* Generated client includes a refresh method at `/api/v1/auth/token/refresh/`.  
* No “readonly access on request” in generated types; TS casts not required.  
* `npm run type-check && npm run lint && npm run test` all pass.

### Verification Steps
```bash
# regenerate client
npm run generate:api

# sanity checks
grep -R "/api/v1/auth/token/" client/src/api/generated | wc -l
grep -R "/api/token/\|/api/auth/jwt" api/openapi.yaml

# quality gates
npm run type-check && npm run lint && npm run test
```

### Risks / Notes
* `djangorestframework-simplejwt` refresh response may include only `access`. If `ROTATE_REFRESH_TOKENS` is enabled server-side, it can also include `refresh`. **Do not require** `refresh` in the response.  
* Do **not** change login semantics beyond path canonicalization.

### Branch & PR
* **Branch:** `feature/canonicalize-auth-openapi`  
* **PR title:** `feat(openapi): canonicalize auth endpoints and regenerate client`  
* Include before/after OpenAPI snippets for the two endpoints in the PR description.

---

## Optimal Droid Prompt (for a code-execution agent)

You can paste the block below into Factory/Code-Droid.

```
You will canonicalize authentication endpoints in the AquaMind-Frontend repo and regenerate the TypeScript client.

Repo: https://github.com/aquarian247/AquaMind-Frontend

1) Prep
   git checkout main && git pull --ff-only
   git switch -c feature/canonicalize-auth-openapi

2) Spec edits (api/openapi.yaml)
   • Remove all legacy auth endpoints under /api/token/* and /api/auth/jwt/*.
   • Ensure only:
       POST /api/v1/auth/token/
       POST /api/v1/auth/token/refresh/
   • Add schemas:
       TokenRefreshRequest  – object { refresh: string }
       TokenRefreshResponse – object { access: string }
   • Wire requestBody/response refs accordingly.

3) Generate client
   npm ci
   npm run generate:api

4) Quality gates
   npm run type-check && npm run lint && npm run test

5) Verify
   • Generated services expose both canonical endpoints.
   • No type requires 'access' on the refresh request (no readonly hack).

6) Commit & PR
   git add api/openapi.yaml client/src/api/generated
   git commit -m "feat(openapi): canonicalize auth endpoints and regenerate client"
   git push -u origin feature/canonicalize-auth-openapi
   # Open PR to main with before/after spec snippets.

Success = only /api/v1/auth/token/* endpoints in spec & client, type checks/lint/tests pass, refresh request body is { refresh: string }.
```

---

## Sources
1. `api/openapi.yaml`  
2. `client/src/api/generated/models/TokenRefresh.ts`  
3. `client/src/contexts/AuthContext.tsx`  
4. `client/src/config/auth.config.ts`  
5. `client/src/lib/config.ts`  
6. `docs/UAT_TASKS.md`  

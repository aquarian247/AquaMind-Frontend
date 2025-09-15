# Task 2 — Align Frontend Auth Config to Canonical Endpoints

## Executive Summary
Frontend config still points to legacy `v1`-prefixed auth paths while the canonical pair is `/api/token/` and `/api/token/refresh/`. Update configuration and constants to reference only the canonical endpoints so the app and docs are aligned [1][2][4].

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Align Frontend Auth Config to Canonical Endpoints (`/api/token/*`)

### Background
We are standardizing on auth endpoints:
• POST `/api/token/` (login)
• POST `/api/token/refresh/` (refresh)

Config currently references legacy paths (e.g., `/api/v1/users/auth/token/…`) [1][2]. After Task 1 canonicalizes the spec and generated client, the config must match the canonical pair.

### Goals
1. Point all frontend config to the canonical endpoints.  
2. Keep profile endpoint as `/api/v1/users/auth/profile/` only if backend supports it.

### Scope
• `client/src/config/auth.config.ts`  
• `client/src/lib/config.ts` (DJANGO_ENDPOINTS)  
• Grep for `users/auth/token` references across client code

### Detailed Requirements
1. **auth.config.ts**
   • `endpoints.login` → `/api/token/`
   • `endpoints.refresh` → `/api/token/refresh/`
   • `endpoints.profile` remains `/api/v1/users/auth/profile/` if valid; otherwise add TODO.

2. **lib/config.ts**
   • `DJANGO_ENDPOINTS.AUTH_LOGIN` → `/api/token/`
   • `DJANGO_ENDPOINTS.AUTH_TOKEN_REFRESH` → `/api/token/refresh/`

3. **Cleanup**  
   • Remove all references to `/api/v1/users/auth/token/…` in codebase.

### Acceptance Criteria
• `grep -R "users/auth/token" client/src` returns no matches.  
• App login and refresh hit `/api/token/*`.  
• `npm run type-check && npm run lint && npm run test` pass.

### Verification Steps
```bash
grep -R "users/auth/token" client/src || echo "OK"
npm run type-check && npm run lint && npm run test
```

### Risks / Notes
• Ensure Task 1 is merged first so the generated client & OpenAPI are canonical.  
• Do **not** introduce other legacy paths such as `/api/token/*` or `/api/auth/jwt/*`.

### Branch & PR
• Branch: `fix/align-auth-config-canonical-endpoints`  
• PR title: `fix(auth): align frontend auth config to /api/token/*`

---

## Optimal Droid Prompt (for a code-execution agent)

```
Goal: Align frontend config to canonical endpoints /api/token/ and /api/token/refresh/.

1) Prep
   git checkout main && git pull --ff-only
   git switch -c fix/align-auth-config-canonical-endpoints

2) Edits
   - client/src/config/auth.config.ts
       login   = '/api/token/'
       refresh = '/api/token/refresh/'
       profile = '/api/v1/users/auth/profile/'  # only if backend supports it
   - client/src/lib/config.ts
       DJANGO_ENDPOINTS.AUTH_LOGIN         = '/api/token/'
       DJANGO_ENDPOINTS.AUTH_TOKEN_REFRESH = '/api/token/refresh/'

3) Sanity checks
   grep -R "users/auth/token" client/src || echo OK

4) Quality gates
   npm run type-check && npm run lint && npm run test

5) Commit & PR
   git add client/src/config/auth.config.ts client/src/lib/config.ts
   git commit -m "fix(auth): align frontend auth config to /api/token/*"
   git push -u origin fix/align-auth-config-canonical-endpoints
```

---

## Sources
1. `client/src/config/auth.config.ts`  
2. `client/src/lib/config.ts`  
3. `docs/UAT_TASKS.md`  
4. `docs/CONTRIBUTING.md`

# Task 3 — Update AuthContext to Use Generated Client Only

## Executive Summary
After canonicalizing auth endpoints (Task 1) and aligning config (Task 2), remove manual hacks in `AuthContext` and rely exclusively on the generated client. Eliminate the type-cast workaround caused by the broken `TokenRefresh` model and call the canonical refresh endpoint from the generated client [1][2][3].

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Update AuthContext to Use Generated Client Only

### Background
`AuthContext.tsx` currently:
• Calls `ApiService.apiV1UsersAuthTokenRefreshCreate` and type-casts `{ refresh } as unknown as TokenRefresh` because the generated model marks `access` as readonly on request [1][2].  
• Uses a centralized `AuthService` for login but mixes generated and manual logic.

With Task 1, the spec exposes canonical endpoints under `/api/token/*` with correct request/response types. We should delete the casts and call the generated refresh method directly.

### Goals
1. Use generated client for login and refresh flows.  
2. Remove TS casts and legacy endpoint references.  
3. Keep token scheduling/decoding logic; continue to set OpenAPI token via `setAuthToken`.

### Scope
• `client/src/contexts/AuthContext.tsx`  
• `client/src/services/auth.service.ts` (ensure it delegates to generated client)

### Detailed Requirements
1. **Refresh flow**
   • Replace calls to `/api/v1/users/auth/token/refresh/` with the canonical generated method `/api/token/refresh/`.
   • Request body must be `{ refresh: string }`; response includes `{ access: string }`.
   • Remove `as unknown as TokenRefresh` cast.

2. **Login flow**
   • Ensure login uses `/api/token/` endpoint via generated client (directly or via `AuthService`).
   • Keep `setAuthToken(newAccess)` to update the OpenAPI runtime.

3. **Cleanup**  
   • Remove any references to `/api/v1/auth/token/*` and `/api/auth/jwt/*`.

### Acceptance Criteria
• No TS casts hacking models in `AuthContext.tsx`.  
• `grep -R "as unknown as TokenRefresh" client/src` returns no matches.  
• Login and refresh executed via generated client methods bound to `/api/token/*`.  
• `npm run type-check && npm run lint && npm run test` pass.

### Verification Steps
```bash
grep -R "as unknown as TokenRefresh" client/src || echo "OK"

npm run type-check && npm run lint && npm run test
```

### Risks / Notes
• Token refresh timing/race conditions — keep existing scheduling (refresh 5 minutes before expiry) and logout on failure.  
• If the profile endpoint is unavailable, continue decoding JWT for minimal user info; profile enrichment can remain optional.

### Branch & PR
• Branch: `refactor/authcontext-use-generated-client-only`  
• PR title: `refactor(auth): use generated client for login/refresh and drop TS casts`

---

## Optimal Droid Prompt (for a code-execution agent)

```
Goal: Refactor AuthContext to rely only on the generated client for login and refresh.

1) Prep
   git checkout main && git pull --ff-only
   git switch -c refactor/authcontext-use-generated-client-only

2) Edits
   - client/src/contexts/AuthContext.tsx
       * Replace refresh call with generated method hitting /api/token/refresh/
       * Remove "as unknown as TokenRefresh" cast
       * Ensure setAuthToken(newAccess) is called after refresh/login
       * Keep scheduling logic intact
   - client/src/services/auth.service.ts (if needed)
       * Ensure login delegates to generated client /api/token/

3) Sanity checks
   grep -R "as unknown as TokenRefresh" client/src || echo OK

4) Quality gates
   npm run type-check && npm run lint && npm run test

5) Commit & PR
   git add client/src/contexts/AuthContext.tsx client/src/services/auth.service.ts
   git commit -m "refactor(auth): use generated client for login/refresh and drop TS casts"
   git push -u origin refactor/authcontext-use-generated-client-only
```

---

## Sources
1. `client/src/contexts/AuthContext.tsx`  
2. `client/src/api/generated/models/TokenRefresh.ts`  
3. `docs/UAT_TASKS.md`

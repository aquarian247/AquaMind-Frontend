# Task 9 — Express/Server Parity Check (Use VITE_USE_DJANGO_API Only)

## Executive Summary
The Express proxy (`server/index.ts`) and mock API (`server/mock-api.ts`) must follow the same conventions adopted by the frontend:  
• Single environment toggle `VITE_USE_DJANGO_API` (no `VITE_USE_BACKEND_API`)  
• Canonical authentication endpoints `/api/v1/auth/token/*` only  
This task removes legacy variables and endpoint families from the server layer, ensuring configuration parity and reducing confusion between environments [1][2].

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Server Parity: Use VITE_USE_DJANGO_API Only and Align With Canonical Endpoints

### Background
Frontend tasks 1–7 standardised on `VITE_USE_DJANGO_API` and canonical auth endpoints. The server code still contains legacy references that can lead to mismatched behaviour between local dev, tests, and production mocks.

### Goals
1. Remove every instance of `VITE_USE_BACKEND_API` in server code and scripts.  
2. Ensure server logic relies exclusively on `VITE_USE_DJANGO_API`.  
3. Align proxy and mock routes to `/api/v1/auth/token/` and `/api/v1/auth/token/refresh/`.

### Scope
• `server/index.ts`  
• `server/mock-api.ts`  
• Any server-side start scripts (`package.json` → `scripts.dev:server` etc.)

### Detailed Requirements
1. Environment variable  
   • Replace `VITE_USE_BACKEND_API` with `VITE_USE_DJANGO_API` everywhere under `server/`.  
   • Update log messages to reference the new variable name.

2. Canonical endpoints  
   • Search for `/api/token/` or `/api/auth/jwt/` patterns and replace with `/api/v1/auth/token/` equivalents.  
   • Mock routes in `mock-api.ts` should expose:  
     – POST `/api/v1/auth/token/` (login)  
     – POST `/api/v1/auth/token/refresh/` (refresh)

3. Startup sanity  
   • When `npm run dev:server` starts, log whether `VITE_USE_DJANGO_API` is enabled.  
   • Ensure toggling the variable correctly switches between proxying to Django API vs. using the mock API.

### Acceptance Criteria
• `grep -R "VITE_USE_BACKEND_API" server` returns no matches.  
• No server code references `/api/token/*` or `/api/auth/jwt/*`.  
• Running `npm run dev:server` logs variable state and serves canonical endpoints.  
• `npm run type-check && npm run lint && npm run test` pass.

### Verification Steps
```bash
# check for legacy env var
grep -R "VITE_USE_BACKEND_API" server || echo "OK"

# smoke-start server
npm run dev:server & sleep 2
pkill -f dev:server || true
```

### Risks / Notes
• Keep mock endpoints minimal—full mock behaviour is not required, only parity for auth paths.  
• Merge after Tasks 5–8 to avoid merge conflicts with concurrent refactors.

### Branch & PR
• Branch: `chore/server-parity-django-env`  
• PR title: `chore(server): use VITE_USE_DJANGO_API only; align endpoints`

---

## Optimal Droid Prompt (for a code-execution agent)

```
Goal: Ensure Express server uses only VITE_USE_DJANGO_API and canonical auth endpoints.

1) Prep
   git checkout main && git pull --ff-only
   git switch -c chore/server-parity-django-env

2) Replace legacy env var
   rg -n "VITE_USE_BACKEND_API" server || true
   # edit occurrences → VITE_USE_DJANGO_API

3) Align endpoints
   rg -n "/api/(token|auth/jwt)" server || true
   # update to /api/v1/auth/token/ and /api/v1/auth/token/refresh/

4) Confirm mock routes
   # add or verify POST handlers in server/mock-api.ts for login & refresh

5) Smoke test
   npm run dev:server & sleep 2; pkill -f dev:server || true

6) Quality gates
   npm run type-check && npm run lint && npm run test

7) Commit & PR
   git add server
   git commit -m "chore(server): use VITE_USE_DJANGO_API only; align endpoints"
   git push -u origin chore/server-parity-django-env
```

---

## Sources
1. `server/index.ts`  
2. `server/mock-api.ts`
